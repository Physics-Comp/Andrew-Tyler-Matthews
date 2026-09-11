import {
	BufferAttribute,
	BufferGeometry,
	Color,
	DynamicDrawUsage,
	Group,
	LineSegments,
	Mesh,
	MeshBasicMaterial,
	PerspectiveCamera,
	Points,
	Scene,
	WebGLRenderer
} from 'three';
import { HEMI_CX, createBrainField } from './brain';
import { EDGE_COUNT, FIRING, FIRING_REDUCED, NODE_COUNT, SEED } from './config';
import { FiringSim, buildHypergraph } from './hypergraph';
import { createRenderLoop } from './loop';
import { createLinesMaterial, createPointsMaterial, createShellMaterial } from './materials';
import { mulberry32 } from './rng';

export interface BrainSceneOptions {
	canvas: HTMLCanvasElement;
	/** Element whose size drives the canvas and whose visibility pauses the loop */
	host: HTMLElement;
	reducedMotion: boolean;
}

export interface BrainScene {
	dispose(): void;
	setReducedMotion(value: boolean): void;
	/** Snap the brain to a yaw (around y) and pitch (around x), in radians. */
	setOrientation(yaw: number, pitch: number): void;
}

const ROTATION_SPEED = (2 * Math.PI) / 80; // one revolution every 80 s
const MAX_PIXEL_RATIO = 2;

/** Read a colour token from app.css so the scene and the page share one palette. */
function cssColor(name: string, fallback: string): Color {
	const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
	return new Color(value || fallback);
}

export function createBrainScene({ canvas, host, reducedMotion }: BrainSceneOptions): BrainScene {
	const renderer = new WebGLRenderer({
		canvas,
		alpha: true,
		antialias: true,
		powerPreference: 'high-performance'
	});
	renderer.setClearColor(0x000000, 0);
	const pixelRatio = Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO);
	renderer.setPixelRatio(pixelRatio);

	const palette = {
		sky: cssColor('--color-sky', '#8ccbf9'),
		pulse: cssColor('--color-pulse', '#3ec9c9'),
		blue: cssColor('--color-dot-blue', '#2f5bd4'),
		pink: cssColor('--color-dot-pink', '#d9a0d8'),
		gold: cssColor('--color-dot-gold', '#8f7a2e')
	};
	const white = new Color('#ffffff');

	const scene = new Scene();
	const camera = new PerspectiveCamera(35, 1, 0.1, 20);
	camera.position.set(0, 0.15, 3.7);
	camera.lookAt(0, 0, 0);

	const group = new Group();
	group.rotation.x = 0.35;
	scene.add(group);

	// --- Brain shell ---------------------------------------------------------
	const rng = mulberry32(SEED);
	const field = createBrainField(rng);
	const shellGeometry = field.makeHemisphere(5);
	const wireGeometry = field.makeHemisphere(4);
	const shellMaterial = createShellMaterial(palette.sky);
	const wireMaterial = new MeshBasicMaterial({
		color: palette.sky,
		wireframe: true,
		transparent: true,
		opacity: 0.04,
		depthWrite: false
	});
	for (const side of [1, -1]) {
		for (const [geometry, material] of [
			[shellGeometry, shellMaterial],
			[wireGeometry, wireMaterial]
		] as const) {
			const mesh = new Mesh(geometry, material);
			mesh.position.x = side * HEMI_CX;
			mesh.scale.x = side;
			group.add(mesh);
		}
	}

	// --- Hypergraph ---------------------------------------------------------
	const toRgb = (c: Color): [number, number, number] => [c.r, c.g, c.b];
	const graph = buildHypergraph({
		nodeCount: NODE_COUNT,
		edgeCount: EDGE_COUNT,
		rng,
		inside: (x, y, z) => field.inside(x, y, z, 0.05),
		palette: [
			{ rgb: toRgb(palette.blue), weight: 60 },
			{ rgb: toRgb(palette.pink), weight: 25 },
			{ rgb: toRgb(palette.gold), weight: 15 }
		]
	});
	const sim = new FiringSim(graph, reducedMotion ? FIRING_REDUCED : FIRING);

	const nodeColors = new Float32Array(graph.restColors);
	const nodeSizes = new Float32Array(graph.baseSizes);
	const pointsGeometry = new BufferGeometry();
	pointsGeometry.setAttribute('position', new BufferAttribute(graph.positions, 3));
	const colorAttr = new BufferAttribute(nodeColors, 3).setUsage(DynamicDrawUsage);
	const sizeAttr = new BufferAttribute(nodeSizes, 1).setUsage(DynamicDrawUsage);
	pointsGeometry.setAttribute('aColor', colorAttr);
	pointsGeometry.setAttribute('aSize', sizeAttr);
	const pointsMaterial = createPointsMaterial(pixelRatio);
	group.add(new Points(pointsGeometry, pointsMaterial));

	// Star expansion: one segment from each hyperedge centroid to each of its members.
	const segmentCount = graph.edgeMembers.length;
	const linePositions = new Float32Array(segmentCount * 2 * 3);
	const lineT = new Float32Array(segmentCount * 2);
	const lineState = new Float32Array(segmentCount * 2 * 2);
	for (let e = 0, s = 0; e < graph.edgeCount; e++) {
		for (let m = graph.edgeOffsets[e]; m < graph.edgeOffsets[e + 1]; m++, s++) {
			const n = graph.edgeMembers[m];
			linePositions.set(graph.edgeCentroids.subarray(e * 3, e * 3 + 3), s * 6);
			linePositions.set(graph.positions.subarray(n * 3, n * 3 + 3), s * 6 + 3);
			lineT[s * 2] = 0;
			lineT[s * 2 + 1] = 1;
		}
	}
	const linesGeometry = new BufferGeometry();
	linesGeometry.setAttribute('position', new BufferAttribute(linePositions, 3));
	linesGeometry.setAttribute('aT', new BufferAttribute(lineT, 1));
	const stateAttr = new BufferAttribute(lineState, 2).setUsage(DynamicDrawUsage);
	linesGeometry.setAttribute('aState', stateAttr);
	const linesMaterial = createLinesMaterial(palette.blue, palette.pulse);
	group.add(new LineSegments(linesGeometry, linesMaterial));

	// --- Per-frame update ---------------------------------------------------
	function writeAttributes() {
		const { restColors, baseSizes, nodeCount } = graph;
		for (let i = 0; i < nodeCount; i++) {
			const act = sim.nodeAct[i];
			// rest → pulse → white as activation rises
			const fr = palette.pulse.r + (white.r - palette.pulse.r) * act;
			const fg = palette.pulse.g + (white.g - palette.pulse.g) * act;
			const fb = palette.pulse.b + (white.b - palette.pulse.b) * act;
			nodeColors[i * 3] = restColors[i * 3] + (fr - restColors[i * 3]) * act;
			nodeColors[i * 3 + 1] = restColors[i * 3 + 1] + (fg - restColors[i * 3 + 1]) * act;
			nodeColors[i * 3 + 2] = restColors[i * 3 + 2] + (fb - restColors[i * 3 + 2]) * act;
			nodeSizes[i] = baseSizes[i] * (1 + 2.5 * act);
		}
		colorAttr.needsUpdate = true;
		sizeAttr.needsUpdate = true;

		for (let e = 0, s = 0; e < graph.edgeCount; e++) {
			const pos = sim.pulsePos(e);
			const intensity = sim.edgeIntensity(e);
			// While idle or in afterglow, park the spot off the segment so only the flat glow shows.
			const spot = pos >= 0 ? pos : 2;
			const members = graph.edgeOffsets[e + 1] - graph.edgeOffsets[e];
			for (let k = 0; k < members; k++, s++) {
				lineState[s * 4] = spot;
				lineState[s * 4 + 1] = intensity;
				lineState[s * 4 + 2] = spot;
				lineState[s * 4 + 3] = intensity;
			}
		}
		stateAttr.needsUpdate = true;
	}

	// --- Interaction ----------------------------------------------------------
	let reduced = reducedMotion;
	let targetTiltX = 0;
	let targetTiltY = 0;
	let tiltX = 0;
	let tiltY = 0;
	let spin = -1.0; // start on a three-quarter lateral view so the lobes read
	let basePitch = 0.35;

	function onPointerMove(event: PointerEvent) {
		if (reduced) return;
		const px = event.clientX / window.innerWidth - 0.5;
		const py = event.clientY / window.innerHeight - 0.5;
		targetTiltX = py * 0.25;
		targetTiltY = px * 0.35;
	}
	window.addEventListener('pointermove', onPointerMove, { passive: true });

	function tick(dt: number) {
		sim.update(dt);
		writeAttributes();
		if (!reduced) spin += ROTATION_SPEED * dt;
		const ease = 1 - Math.exp(-4 * dt);
		tiltX += (targetTiltX - tiltX) * ease;
		tiltY += (targetTiltY - tiltY) * ease;
		group.rotation.x = basePitch + tiltX;
		group.rotation.y = spin + tiltY;
	}

	// --- Loop, paused when hidden or off-screen -------------------------------
	const loop = createRenderLoop(host, (dt) => {
		tick(dt);
		renderer.render(scene, camera);
	});

	// --- Sizing ---------------------------------------------------------------
	function resize() {
		const width = host.clientWidth;
		const height = host.clientHeight;
		if (width === 0 || height === 0) return;
		renderer.setSize(width, height, false);
		camera.aspect = width / height;
		camera.updateProjectionMatrix();
	}
	const resizeObserver = new ResizeObserver(resize);
	resizeObserver.observe(host);
	resize();

	// Draw one frame immediately so the fade-in reveals a finished scene.
	writeAttributes();
	renderer.render(scene, camera);

	return {
		setOrientation(yaw, pitch) {
			spin = yaw;
			basePitch = pitch;
			tiltX = tiltY = targetTiltX = targetTiltY = 0;
			group.rotation.set(pitch, yaw, 0);
			renderer.render(scene, camera);
		},
		setReducedMotion(value) {
			reduced = value;
			sim.params = value ? FIRING_REDUCED : FIRING;
			if (value) {
				targetTiltX = 0;
				targetTiltY = 0;
			}
		},
		dispose() {
			loop.dispose();
			window.removeEventListener('pointermove', onPointerMove);
			resizeObserver.disconnect();
			for (const geometry of [shellGeometry, wireGeometry, pointsGeometry, linesGeometry]) {
				geometry.dispose();
			}
			for (const material of [shellMaterial, wireMaterial, pointsMaterial, linesMaterial]) {
				material.dispose();
			}
			renderer.dispose();
			renderer.forceContextLoss();
		}
	};
}
