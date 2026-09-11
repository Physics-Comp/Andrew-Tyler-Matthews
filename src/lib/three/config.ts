// Plain constants with no Three.js import, so pages can use them for captions
// without pulling the renderer into their bundle.

export const NODE_COUNT = 420;
export const EDGE_COUNT = 160;
export const SEED = 7;

export interface FiringParams {
	/** Node glow decay time constant, seconds */
	nodeTau: number;
	/** Seconds a node ignores new spikes after firing */
	nodeRefractory: number;
	/** Spontaneous firing rate per idle hyperedge, events per second */
	spontaneousRate: number;
	/** Seconds for a pulse to travel from the hyperedge centroid to its nodes */
	pulseDuration: number;
	/** Seconds a hyperedge stays quiet after a pulse */
	edgeRefractory: number;
	/** Probability that a spiking node triggers each of its other idle hyperedges */
	spreadProb: number;
	/** Upper bound on simultaneously pulsing hyperedges */
	maxActive: number;
}

export const FIRING: FiringParams = {
	nodeTau: 0.45,
	nodeRefractory: 1.5,
	spontaneousRate: 0.06,
	pulseDuration: 0.4,
	edgeRefractory: 1.2,
	spreadProb: 0.3,
	maxActive: 24
};

/** Calmer variant for prefers-reduced-motion. */
export const FIRING_REDUCED: FiringParams = {
	...FIRING,
	spontaneousRate: 0.015,
	spreadProb: 0.15,
	maxActive: 8
};
