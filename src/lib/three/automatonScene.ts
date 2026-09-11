import {
	Color,
	DataTexture,
	Mesh,
	NearestFilter,
	OrthographicCamera,
	PlaneGeometry,
	RedFormat,
	Scene,
	ShaderMaterial,
	UnsignedByteType,
	WebGLRenderer
} from 'three';
import { ElementaryAutomaton, RULES } from './automaton';
import { createRenderLoop } from './loop';

export interface AutomatonState {
	rule: number;
	note: string;
	generation: number;
}

export interface AutomatonSceneOptions {
	canvas: HTMLCanvasElement;
	host: HTMLElement;
	reducedMotion: boolean;
	/** Called whenever the rule or generation changes */
	onChange?: (state: AutomatonState) => void;
}

export interface AutomatonScene {
	dispose(): void;
	setReducedMotion(value: boolean): void;
	/** Fade out, switch to the next rule in the cycle, and regrow from the seed. */
	nextRule(): void;
}

/** CSS pixels per cell */
const CELL_PX = 5;
/** Generations per second */
const STEPS_PER_SECOND = 14;
const STEPS_PER_SECOND_REDUCED = 2.5;
/** Seconds on one rule before cycling to the next */
const CYCLE_AFTER = 28;
const FADE_OUT = 0.4;
const FADE_IN = 0.6;

function cssColor(name: string, fallback: string): Color {
	const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
	return new Color(value || fallback);
}

export function createAutomatonScene({
	canvas,
	host,
	reducedMotion,
	onChange
}: AutomatonSceneOptions): AutomatonScene {
	const renderer = new WebGLRenderer({ canvas, alpha: true, antialias: false });
	renderer.setClearColor(0x000000, 0);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

	const scene = new Scene();
	const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);

	// --- Grid state ---------------------------------------------------------
	let width = 1;
	let height = 1;
	let cells = new Uint8Array(1);
	let rows = 0;
	let texture = new DataTexture(cells, 1, 1, RedFormat, UnsignedByteType);
	let automaton = new ElementaryAutomaton(1, RULES[0].rule);
	let ruleIndex = 0;

	const material = new ShaderMaterial({
		uniforms: {
			uState: { value: texture },
			uSize: { value: [1, 1] },
			uRows: { value: 0 },
			uNew: { value: cssColor('--color-pulse', '#3ec9c9') },
			uOld: { value: cssColor('--color-dot-blue', '#2f5bd4') },
			uGrid: { value: cssColor('--color-line', '#2a2a2a') },
			uFade: { value: 0 }
		},
		vertexShader: /* glsl */ `
			varying vec2 vUv;
			void main() {
				vUv = uv;
				gl_Position = vec4(position.xy, 0.0, 1.0);
			}
		`,
		fragmentShader: /* glsl */ `
			uniform sampler2D uState;
			uniform vec2 uSize;
			uniform float uRows;
			uniform vec3 uNew;
			uniform vec3 uOld;
			uniform vec3 uGrid;
			uniform float uFade;
			varying vec2 vUv;
			void main() {
				// Row 0 (the seed) sits at the top of the panel.
				vec2 cell = vec2(vUv.x, 1.0 - vUv.y) * uSize;
				vec2 ij = floor(cell);
				vec2 f = cell - ij;
				// Cells are stored as raw 0/1 bytes, which sample as 0 or 1/255.
				float state = step(0.5 / 255.0, texture2D(uState, (ij + 0.5) / uSize).r);

				// Faint lattice between cells.
				float line = step(0.94, max(abs(f.x - 0.5), abs(f.y - 0.5)) * 2.0);
				float lattice = line * 0.5;

				// Live cells: inset squares, bright at the growing edge, cooling with age.
				float inset = smoothstep(0.0, 0.14, f.x) * smoothstep(0.0, 0.14, 1.0 - f.x)
					* smoothstep(0.0, 0.14, f.y) * smoothstep(0.0, 0.14, 1.0 - f.y);
				float age = clamp((uRows - 1.0 - ij.y) / uSize.y, 0.0, 1.0);
				vec3 tint = mix(uNew, uOld, smoothstep(0.0, 0.55, age)) * (1.0 - 0.5 * age);
				tint += vec3(0.5) * step(uRows - 1.5, ij.y); // white-hot newest row
				float alive = state * inset;

				vec3 color = uGrid * lattice + tint * alive;
				float alpha = max(alive, lattice);
				gl_FragColor = vec4(color * uFade, alpha * uFade);
			}
		`,
		transparent: true,
		depthWrite: false,
		depthTest: false
	});
	scene.add(new Mesh(new PlaneGeometry(2, 2), material));

	function notify() {
		onChange?.({
			rule: RULES[ruleIndex].rule,
			note: RULES[ruleIndex].note,
			generation: automaton.generation
		});
	}

	function rebuildGrid(cssWidth: number, cssHeight: number) {
		const w = Math.max(32, Math.floor(cssWidth / CELL_PX));
		const h = Math.max(16, Math.floor(cssHeight / CELL_PX));
		if (w === width && h === height) return;
		width = w;
		height = h;
		cells = new Uint8Array(width * height);
		rows = 0;
		texture.dispose();
		texture = new DataTexture(cells, width, height, RedFormat, UnsignedByteType);
		texture.magFilter = NearestFilter;
		texture.minFilter = NearestFilter;
		texture.unpackAlignment = 1; // rows are `width` bytes, not padded to 4
		texture.needsUpdate = true;
		material.uniforms.uState.value = texture;
		material.uniforms.uSize.value = [width, height];
		automaton = new ElementaryAutomaton(width, RULES[ruleIndex].rule);
		notify();
	}

	/** Append the automaton's current row, scrolling the grid up once it is full. */
	function pushRow() {
		if (rows === height) {
			cells.copyWithin(0, width);
		} else {
			rows++;
		}
		cells.set(automaton.current, (rows - 1) * width);
		texture.needsUpdate = true;
		material.uniforms.uRows.value = rows;
	}

	function restart() {
		cells.fill(0);
		rows = 0;
		automaton.setRule(RULES[ruleIndex].rule);
		pushRow(); // show the seed immediately
		notify();
	}

	// --- Timing ---------------------------------------------------------------
	let reduced = reducedMotion;
	let stepAccumulator = 0;
	let ruleClock = 0;
	let fade = 0;
	let pendingRestart = false;

	function tick(dt: number) {
		if (pendingRestart) {
			fade = Math.max(0, fade - dt / FADE_OUT);
			if (fade === 0) {
				pendingRestart = false;
				ruleClock = 0;
				restart();
			}
		} else {
			fade = Math.min(1, fade + dt / FADE_IN);
			const interval = 1 / (reduced ? STEPS_PER_SECOND_REDUCED : STEPS_PER_SECOND);
			stepAccumulator += dt;
			while (stepAccumulator >= interval) {
				stepAccumulator -= interval;
				automaton.step();
				pushRow();
				notify();
			}
			ruleClock += dt;
			if (!reduced && ruleClock >= CYCLE_AFTER) nextRule();
		}
		material.uniforms.uFade.value = fade;
		renderer.render(scene, camera);
	}

	function nextRule() {
		if (pendingRestart) return;
		ruleIndex = (ruleIndex + 1) % RULES.length;
		pendingRestart = true;
	}

	// --- Sizing ---------------------------------------------------------------
	function resize() {
		const w = host.clientWidth;
		const h = host.clientHeight;
		if (w === 0 || h === 0) return;
		renderer.setSize(w, h, false);
		rebuildGrid(w, h);
	}
	const resizeObserver = new ResizeObserver(resize);
	resizeObserver.observe(host);
	resize();
	restart();
	// Draw the seed row once so the panel isn't blank before it scrolls into view.
	renderer.render(scene, camera);

	const loop = createRenderLoop(host, tick);

	return {
		nextRule,
		setReducedMotion(value) {
			reduced = value;
		},
		dispose() {
			loop.dispose();
			resizeObserver.disconnect();
			material.dispose();
			texture.dispose();
			scene.traverse((object) => {
				if (object instanceof Mesh) object.geometry.dispose();
			});
			renderer.dispose();
			renderer.forceContextLoss();
		}
	};
}
