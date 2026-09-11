import { BufferAttribute, IcosahedronGeometry } from 'three';
import { SimplexNoise } from 'three/addons/math/SimplexNoise.js';

/**
 * Hemisphere proportions in the +x frame: x lateral (nx < 0 is the medial face),
 * y up, z forward. Extents differ by side so the cross-section is a "D" (flat
 * medial wall, rounded lateral wall) and the underside is flatter than the crown.
 */
export const HEMI = {
	lateral: 0.5, // half-width on the outer side
	medial: 0.2, // how far the medial wall bulges toward the midline
	crown: 0.62, // half-height above the equator
	base: 0.42, // half-height below it
	length: 0.8, // half-length front-to-back
	gap: 0.015
} as const;

/** X offset of each hemisphere's frame origin from the midline. */
export const HEMI_CX = HEMI.medial + HEMI.gap / 2;

const smoothstep = (a: number, b: number, x: number) => {
	const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
	return t * t * (3 - 2 * t);
};

/** Direction-dependent extents: pick the half-axis for the side the direction points to. */
function extents(nx: number, ny: number) {
	return {
		x: nx < 0 ? HEMI.medial : HEMI.lateral,
		y: ny < 0 ? HEMI.base : HEMI.crown,
		z: HEMI.length
	};
}

// Direction of the temporal lobe's centre: lateral, low, slightly forward.
const TEMPORAL = normalize(0.65, -0.72, 0.25);
function normalize(x: number, y: number, z: number): [number, number, number] {
	const l = Math.hypot(x, y, z);
	return [x / l, y / l, z / l];
}

/**
 * A procedural cerebrum. The base shape is an anatomically proportioned D-section
 * hemisphere with frontal fullness, an occipital taper, a temporal lobe under the
 * lateral fissure, and gyri/sulci from domain-warped ridged noise. The same radius
 * function shapes the mesh and tests whether a point lies inside, so hypergraph
 * nodes never poke through the surface.
 */
export function createBrainField(rng: () => number) {
	const simplex = new SimplexNoise({ random: rng });
	const n3 = (x: number, y: number, z: number) => simplex.noise3d(x, y, z);

	/** Radius multiplier for unit direction (nx, ny, nz). */
	function radiusAt(nx: number, ny: number, nz: number): number {
		return shapeAt(nx, ny, nz).radius;
	}

	/** Radius multiplier plus the local fold depth (negative in sulci), used to shade the shell. */
	function shapeAt(nx: number, ny: number, nz: number): { radius: number; relief: number } {
		const e = extents(nx, ny);
		const px = nx * e.x;
		const py = ny * e.y;
		const pz = nz * e.z;

		// --- Gross anatomy -----------------------------------------------------
		let r = 1;
		// Vertex: the crown peaks a little behind centre.
		r += 0.04 * smoothstep(0, 1, ny) * (1 - Math.abs(nz + 0.15));
		// Frontal pole: rounded on top, cut back underneath (orbital surface).
		r -= 0.1 * smoothstep(0.45, 1, nz) * smoothstep(-0.05, -0.8, ny);
		// Occipital pole: tapers and sits lower than the crown.
		r -= 0.14 * smoothstep(-0.45, -1, nz) * smoothstep(-0.3, 0.7, ny);
		r -= 0.05 * smoothstep(-0.7, -1, nz);
		// Inferior surface: flat, most of all toward the midline.
		r -= 0.12 * smoothstep(-0.5, -1, ny) * smoothstep(0.75, -0.3, nx);
		// Temporal lobe: a strong bulge low on the lateral side, pointing forward.
		const t = Math.max(0, nx * TEMPORAL[0] + ny * TEMPORAL[1] + nz * TEMPORAL[2]);
		r += 0.34 * Math.pow(t, 6);
		// Lateral (Sylvian) fissure: a deep groove above the temporal lobe rising toward the back,
		// opening into a notch at the temporal pole.
		const fissureY = -0.05 - 0.28 * nz;
		const fissure = Math.exp(-((ny - fissureY) * (ny - fissureY)) / 0.02);
		r -= 0.17 * fissure * smoothstep(0.25, 0.85, nx) * smoothstep(-0.7, 0.7, nz);

		// --- Gyri and sulci ---------------------------------------------------
		// Warp the sampling domain with low-frequency noise so folds meander like real gyri.
		const wx = px + 0.35 * n3(px * 1.4 + 3, py * 1.4, pz * 1.4);
		const wy = py + 0.35 * n3(px * 1.4, py * 1.4 + 7, pz * 1.4);
		const wz = pz + 0.35 * n3(px * 1.4, py * 1.4, pz * 1.4 + 11);
		const ridge = 1 - Math.abs(n3(wx * 4.2, wy * 4.2, wz * 4.2));
		let d = 0.06 * n3(px * 1.6, py * 1.6, pz * 1.6); // gentle lobe-scale undulation
		d -= 0.11 * ridge * ridge * ridge; // sulci: narrow grooves between gyri
		d += 0.02 * n3(px * 9, py * 9, pz * 9); // fine surface texture

		// The medial wall is smooth; relief fades out as the direction turns inward.
		const relief = d * smoothstep(-0.55, 0.05, nx);
		return { radius: r + relief, relief };
	}

	/** One hemisphere in the +x frame. Mirror with scale.x = -1 for the other side. */
	function makeHemisphere(detail: number): IcosahedronGeometry {
		const geo = new IcosahedronGeometry(1, detail);
		const pos = geo.attributes.position;
		const relief = new Float32Array(pos.count);
		for (let i = 0; i < pos.count; i++) {
			const nx = pos.getX(i);
			const ny = pos.getY(i);
			const nz = pos.getZ(i);
			const e = extents(nx, ny);
			const shape = shapeAt(nx, ny, nz);
			pos.setXYZ(i, nx * e.x * shape.radius, ny * e.y * shape.radius, nz * e.z * shape.radius);
			relief[i] = shape.relief;
		}
		geo.setAttribute('aRelief', new BufferAttribute(relief, 1));
		geo.computeVertexNormals();
		return geo;
	}

	/** Is the world-space point inside either hemisphere, at least `margin` under the surface? */
	function inside(x: number, y: number, z: number, margin = 0.05): boolean {
		const s = x < 0 ? -1 : 1;
		const lx = s * x - HEMI_CX;
		const e = extents(lx, y);
		const ex = lx / e.x;
		const ey = y / e.y;
		const ez = z / e.z;
		const len = Math.hypot(ex, ey, ez);
		return len > 0 && len < radiusAt(ex / len, ey / len, ez / len) - margin;
	}

	return { radiusAt, makeHemisphere, inside };
}
