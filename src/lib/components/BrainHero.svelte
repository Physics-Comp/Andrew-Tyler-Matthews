<script lang="ts">
	import { onMount } from 'svelte';
	import type { BrainScene } from '$lib/three/scene';

	let host = $state<HTMLDivElement>();
	let canvas = $state<HTMLCanvasElement>();
	let status = $state<'loading' | 'ready' | 'fallback'>('loading');

	onMount(() => {
		let disposed = false;
		let scene: BrainScene | undefined;
		const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
		const onMotionChange = () => scene?.setReducedMotion(motionQuery.matches);
		motionQuery.addEventListener('change', onMotionChange);

		(async () => {
			if (!('WebGL2RenderingContext' in window) || !canvas || !host) {
				status = 'fallback';
				return;
			}
			// Dynamic import keeps Three.js out of every other page's bundle.
			const { createBrainScene } = await import('$lib/three/scene');
			if (disposed) return;
			try {
				scene = createBrainScene({ canvas, host, reducedMotion: motionQuery.matches });
				status = 'ready';
				// Dev-only handle for inspecting the scene from the console.
				if (import.meta.env.DEV) (window as unknown as { __brain?: BrainScene }).__brain = scene;
			} catch (error) {
				console.warn('BrainHero: WebGL unavailable, showing fallback.', error);
				status = 'fallback';
			}
		})();

		return () => {
			disposed = true;
			motionQuery.removeEventListener('change', onMotionChange);
			scene?.dispose();
		};
	});
</script>

<div bind:this={host} class="relative aspect-square w-full" aria-hidden="true">
	{#if status === 'fallback'}
		<div class="absolute inset-0 grid place-items-center bg-ink-2/60 hairline">
			<p class="label text-muted">Fig. 01 — cortex render unavailable (WebGL is off)</p>
		</div>
	{:else}
		<canvas
			bind:this={canvas}
			class={[
				'absolute inset-0 h-full w-full transition-opacity duration-700',
				status === 'ready' ? 'opacity-100' : 'opacity-0'
			]}
		></canvas>
	{/if}
</div>
