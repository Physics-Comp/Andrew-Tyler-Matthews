import { AdditiveBlending, Color, DoubleSide, ShaderMaterial } from 'three';

/** Translucent shell: a fresnel rim so the brain reads as glass on black without any lights. */
export function createShellMaterial(color: Color, intensity = 0.4): ShaderMaterial {
	return new ShaderMaterial({
		uniforms: { uColor: { value: color }, uIntensity: { value: intensity } },
		vertexShader: /* glsl */ `
			attribute float aRelief;
			varying float vFresnel;
			varying float vLight;
			void main() {
				vec3 n = normalize(normalMatrix * normal);
				// Sulci (negative relief) darken, gyri crests lighten.
				float fold = clamp(1.0 + 8.0 * aRelief, 0.15, 1.6);
				vec4 mv = modelViewMatrix * vec4(position, 1.0);
				vec3 v = normalize(-mv.xyz);
				vFresnel = pow(1.0 - abs(dot(n, v)), 3.0);
				// Faint diffuse term from a fixed key light so gyri and sulci read on the surface.
				vec3 l = normalize(vec3(0.6, 0.8, 0.5));
				vLight = pow(abs(dot(n, l)), 2.0) * fold;
				gl_Position = projectionMatrix * mv;
			}
		`,
		fragmentShader: /* glsl */ `
			uniform vec3 uColor;
			uniform float uIntensity;
			varying float vFresnel;
			varying float vLight;
			void main() {
				float a = vFresnel * uIntensity + 0.09 * vLight;
				gl_FragColor = vec4(uColor * a, a);
			}
		`,
		transparent: true,
		blending: AdditiveBlending,
		depthWrite: false,
		side: DoubleSide
	});
}

/** Nodes: soft additive sprites. Per-vertex colour and size are updated on the CPU each frame. */
export function createPointsMaterial(pixelRatio: number): ShaderMaterial {
	return new ShaderMaterial({
		uniforms: { uPixelRatio: { value: pixelRatio }, uScale: { value: 26 } },
		vertexShader: /* glsl */ `
			attribute vec3 aColor;
			attribute float aSize;
			uniform float uPixelRatio;
			uniform float uScale;
			varying vec3 vColor;
			void main() {
				vColor = aColor;
				vec4 mv = modelViewMatrix * vec4(position, 1.0);
				gl_PointSize = aSize * uScale * uPixelRatio / -mv.z;
				gl_Position = projectionMatrix * mv;
			}
		`,
		fragmentShader: /* glsl */ `
			varying vec3 vColor;
			void main() {
				float d = length(gl_PointCoord - 0.5);
				if (d > 0.5) discard;
				float a = pow(1.0 - d * 2.0, 2.2);
				gl_FragColor = vec4(vColor * a, a);
			}
		`,
		transparent: true,
		blending: AdditiveBlending,
		depthWrite: false
	});
}

/**
 * Hyperedges as line segments from each centroid to its members. `aT` runs 0→1 along the
 * segment; `aState` is (pulse position, intensity) so a bright spot travels the line.
 */
export function createLinesMaterial(rest: Color, fire: Color): ShaderMaterial {
	return new ShaderMaterial({
		uniforms: { uRest: { value: rest }, uFire: { value: fire } },
		vertexShader: /* glsl */ `
			attribute float aT;
			attribute vec2 aState;
			varying float vT;
			varying vec2 vState;
			void main() {
				vT = aT;
				vState = aState;
				gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
			}
		`,
		fragmentShader: /* glsl */ `
			uniform vec3 uRest;
			uniform vec3 uFire;
			varying float vT;
			varying vec2 vState;
			void main() {
				float spot = exp(-pow((vT - vState.x) * 5.0, 2.0));
				float glow = vState.y * (0.25 + spot);
				vec3 c = uRest * 0.55 + uFire * glow;
				gl_FragColor = vec4(c, 1.0);
			}
		`,
		transparent: true,
		blending: AdditiveBlending,
		depthWrite: false
	});
}
