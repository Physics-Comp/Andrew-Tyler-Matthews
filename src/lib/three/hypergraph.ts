import type { FiringParams } from './config';

/** Hypergraph in compressed-sparse-row form: cheap to iterate every frame. */
export interface Hypergraph {
	nodeCount: number;
	edgeCount: number;
	/** xyz per node */
	positions: Float32Array;
	/** rgb per node, resting colour */
	restColors: Float32Array;
	/** resting point size per node */
	baseSizes: Float32Array;
	/** members of edge e are edgeMembers[edgeOffsets[e] .. edgeOffsets[e+1]) */
	edgeOffsets: Uint32Array;
	edgeMembers: Uint32Array;
	/** xyz per edge */
	edgeCentroids: Float32Array;
	/** edges touching node n are nodeEdges[nodeEdgeOffsets[n] .. nodeEdgeOffsets[n+1]) */
	nodeEdgeOffsets: Uint32Array;
	nodeEdges: Uint32Array;
}

export interface HypergraphOptions {
	nodeCount: number;
	edgeCount: number;
	rng: () => number;
	/** Volume test for node placement */
	inside: (x: number, y: number, z: number) => boolean;
	/** Resting colours as [r, g, b] in 0..1 with a weight each */
	palette: { rgb: [number, number, number]; weight: number }[];
	/** Max distance between a hyperedge's seed node and its other members */
	neighbourRadius?: number;
}

export function buildHypergraph(opts: HypergraphOptions): Hypergraph {
	const { nodeCount, edgeCount, rng, inside, palette, neighbourRadius = 0.35 } = opts;

	// Nodes: rejection-sample the bounding box against the brain volume.
	const positions = new Float32Array(nodeCount * 3);
	let placed = 0;
	for (let attempt = 0; placed < nodeCount && attempt < 50_000; attempt++) {
		const x = (rng() * 2 - 1) * 1.0;
		const y = (rng() * 2 - 1) * 0.75;
		const z = (rng() * 2 - 1) * 1.0;
		if (!inside(x, y, z)) continue;
		positions.set([x, y, z], placed * 3);
		placed++;
	}
	if (placed < nodeCount) throw new Error(`Only placed ${placed}/${nodeCount} nodes`);

	// Resting colours and sizes.
	const restColors = new Float32Array(nodeCount * 3);
	const baseSizes = new Float32Array(nodeCount);
	const totalWeight = palette.reduce((s, p) => s + p.weight, 0);
	for (let i = 0; i < nodeCount; i++) {
		let pick = rng() * totalWeight;
		let rgb = palette[palette.length - 1].rgb;
		for (const p of palette) {
			if ((pick -= p.weight) <= 0) {
				rgb = p.rgb;
				break;
			}
		}
		restColors.set(rgb, i * 3);
		baseSizes[i] = 1 + rng() * 0.8;
	}

	// Hyperedges: a seed node plus 2–4 of its nearest neighbours within a radius.
	const dist2 = (a: number, b: number) => {
		const dx = positions[a * 3] - positions[b * 3];
		const dy = positions[a * 3 + 1] - positions[b * 3 + 1];
		const dz = positions[a * 3 + 2] - positions[b * 3 + 2];
		return dx * dx + dy * dy + dz * dz;
	};
	const r2 = neighbourRadius * neighbourRadius;
	const edges: number[][] = [];
	const seen = new Set<string>();
	const order = new Uint32Array(nodeCount);

	function neighboursOf(seed: number, count: number): number[] {
		for (let i = 0; i < nodeCount; i++) order[i] = i;
		const sorted = Array.from(order).sort((a, b) => dist2(seed, a) - dist2(seed, b));
		const out: number[] = [];
		for (const n of sorted) {
			if (n === seed) continue;
			if (dist2(seed, n) > r2) break;
			out.push(n);
			if (out.length === count) break;
		}
		return out;
	}

	function tryAddEdge(seed: number, extra: number): boolean {
		const members = [seed, ...neighboursOf(seed, extra)];
		if (members.length < 3) return false;
		members.sort((a, b) => a - b);
		const key = members.join(',');
		if (seen.has(key)) return false;
		seen.add(key);
		edges.push(members);
		return true;
	}

	for (let attempt = 0; edges.length < edgeCount && attempt < edgeCount * 20; attempt++) {
		tryAddEdge(Math.floor(rng() * nodeCount), 2 + Math.floor(rng() * 3));
	}

	// Give isolated nodes one hyperedge so nothing sits permanently dark.
	const degree = new Uint32Array(nodeCount);
	for (const m of edges) for (const n of m) degree[n]++;
	for (let n = 0; n < nodeCount; n++) if (degree[n] === 0) tryAddEdge(n, 2);

	// Pack into CSR arrays.
	const edgeOffsets = new Uint32Array(edges.length + 1);
	const edgeMembers = new Uint32Array(edges.reduce((s, m) => s + m.length, 0));
	const edgeCentroids = new Float32Array(edges.length * 3);
	degree.fill(0);
	let k = 0;
	edges.forEach((members, e) => {
		edgeOffsets[e] = k;
		let cx = 0;
		let cy = 0;
		let cz = 0;
		for (const n of members) {
			edgeMembers[k++] = n;
			degree[n]++;
			cx += positions[n * 3];
			cy += positions[n * 3 + 1];
			cz += positions[n * 3 + 2];
		}
		edgeCentroids.set([cx / members.length, cy / members.length, cz / members.length], e * 3);
	});
	edgeOffsets[edges.length] = k;

	const nodeEdgeOffsets = new Uint32Array(nodeCount + 1);
	for (let n = 0; n < nodeCount; n++) nodeEdgeOffsets[n + 1] = nodeEdgeOffsets[n] + degree[n];
	const nodeEdges = new Uint32Array(nodeEdgeOffsets[nodeCount]);
	const cursor = Uint32Array.from(nodeEdgeOffsets.subarray(0, nodeCount));
	edges.forEach((members, e) => {
		for (const n of members) nodeEdges[cursor[n]++] = e;
	});

	return {
		nodeCount,
		edgeCount: edges.length,
		positions,
		restColors,
		baseSizes,
		edgeOffsets,
		edgeMembers,
		edgeCentroids,
		nodeEdgeOffsets,
		nodeEdges
	};
}

const IDLE = 0;
const PULSING = 1;
const REFRACTORY = 2;

/**
 * Action-potential simulation. Idle hyperedges fire spontaneously (Poisson); a pulse
 * travels from the centroid to the member nodes, which light up, decay exponentially,
 * and can trigger their other hyperedges after a refractory period.
 */
export class FiringSim {
	/** Node glow, 0..1 */
	readonly nodeAct: Float32Array;
	private readonly nodeRef: Float32Array;
	private readonly edgePhase: Uint8Array;
	private readonly edgeT: Float32Array;
	private active = 0;

	constructor(
		readonly g: Hypergraph,
		public params: FiringParams,
		private readonly rng: () => number = Math.random
	) {
		this.nodeAct = new Float32Array(g.nodeCount);
		this.nodeRef = new Float32Array(g.nodeCount);
		this.edgePhase = new Uint8Array(g.edgeCount);
		this.edgeT = new Float32Array(g.edgeCount);
	}

	update(dt: number): void {
		const { g, params: p } = this;
		const decay = Math.exp(-dt / p.nodeTau);
		for (let i = 0; i < g.nodeCount; i++) {
			this.nodeAct[i] *= decay;
			if (this.nodeRef[i] > 0) this.nodeRef[i] -= dt;
		}
		for (let e = 0; e < g.edgeCount; e++) {
			const phase = this.edgePhase[e];
			if (phase === IDLE) {
				if (this.active < p.maxActive && this.rng() < p.spontaneousRate * dt) this.fire(e);
			} else if (phase === PULSING) {
				if ((this.edgeT[e] += dt) >= p.pulseDuration) {
					// The pulse reaches the member nodes.
					for (let m = g.edgeOffsets[e]; m < g.edgeOffsets[e + 1]; m++) {
						const n = g.edgeMembers[m];
						this.nodeAct[n] = 1;
						if (this.nodeRef[n] <= 0) {
							this.nodeRef[n] = p.nodeRefractory;
							this.spread(n, e);
						}
					}
					this.edgePhase[e] = REFRACTORY;
					this.edgeT[e] = 0;
					this.active--;
				}
			} else if ((this.edgeT[e] += dt) >= p.edgeRefractory) {
				this.edgePhase[e] = IDLE;
			}
		}
	}

	/** 0..1 position of the pulse along centroid→node while pulsing, else -1. */
	pulsePos(e: number): number {
		return this.edgePhase[e] === PULSING ? this.edgeT[e] / this.params.pulseDuration : -1;
	}

	/** Line brightness: 1 while pulsing, a fading afterglow during refractory, 0 idle. */
	edgeIntensity(e: number): number {
		switch (this.edgePhase[e]) {
			case PULSING:
				return 1;
			case REFRACTORY:
				return 0.3 * (1 - this.edgeT[e] / this.params.edgeRefractory);
			default:
				return 0;
		}
	}

	private fire(e: number): void {
		this.edgePhase[e] = PULSING;
		this.edgeT[e] = 0;
		this.active++;
	}

	private spread(n: number, from: number): void {
		const { g, params: p } = this;
		for (let k = g.nodeEdgeOffsets[n]; k < g.nodeEdgeOffsets[n + 1]; k++) {
			const e = g.nodeEdges[k];
			if (e === from || this.edgePhase[e] !== IDLE) continue;
			if (this.active < p.maxActive && this.rng() < p.spreadProb) this.fire(e);
		}
	}
}
