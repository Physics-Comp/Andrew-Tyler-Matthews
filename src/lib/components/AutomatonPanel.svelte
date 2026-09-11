<script lang="ts">
	import { onMount } from 'svelte';
	import type { AutomatonScene, AutomatonState } from '$lib/three/automatonScene';
	import { RULES } from '$lib/three/automaton';

	let host = $state<HTMLDivElement>();
	let canvas = $state<HTMLCanvasElement>();
	let status = $state<'loading' | 'ready' | 'fallback'>('loading');
	let scene = $state<AutomatonScene>();
	let current = $state<AutomatonState>({ ...RULES[0], generation: 0 });

	onMount(() => {
		let disposed = false;
		const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
		const onMotionChange = () => scene?.setReducedMotion(motionQuery.matches);
		motionQuery.addEventListener('change', onMotionChange);

		(async () => {
			if (!('WebGL2RenderingContext' in window) || !canvas || !host) {
				status = 'fallback';
				return;
			}
			const { createAutomatonScene } = await import('$lib/three/automatonScene');
			if (disposed) return;
			try {
				scene = createAutomatonScene({
					canvas,
					host,
					reducedMotion: motionQuery.matches,
					onChange: (state) => (current = state)
				});
				status = 'ready';
			} catch (error) {
				console.warn('AutomatonPanel: WebGL unavailable, showing fallback.', error);
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

<figure>
	<div
		bind:this={host}
		class="relative aspect-[4/3] w-full overflow-hidden bg-ink-2/40 hairline sm:aspect-[16/7] lg:aspect-[16/5]"
		aria-hidden="true"
	>
		{#if status === 'fallback'}
			<div class="absolute inset-0 grid place-items-center">
				<p class="label text-muted">Fig. 03 — automaton unavailable (WebGL is off)</p>
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
	<figcaption
		class="mt-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 label text-muted"
	>
		<span>
			Fig. 03 — Rule <span class="text-paper">{current.rule}</span> · elementary cellular automaton
			· {current.note} · one seed · gen
			<span class="inline-block w-[4ch] text-paper">{current.generation}</span>
		</span>
		<button
			type="button"
			class="cursor-pointer text-paper transition-colors hover:text-signal disabled:cursor-default disabled:text-muted"
			disabled={!scene}
			onclick={() => scene?.nextRule()}
		>
			Next rule →
		</button>
	</figcaption>
</figure>
