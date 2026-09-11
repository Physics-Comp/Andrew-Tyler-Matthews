<script lang="ts">
	import { slide } from 'svelte/transition';
	import { prefersReducedMotion } from 'svelte/motion';
	import type { Role } from '$lib/data/experience';

	interface Props {
		role: Role;
		open?: boolean;
	}

	let { role, open = $bindable(false) }: Props = $props();

	const id = $props.id();
	const panelId = `role-panel-${id}`;
	const duration = $derived(prefersReducedMotion.current ? 0 : 250);
</script>

<li class="hairline-b">
	<button
		type="button"
		class="group grid w-full cursor-pointer grid-cols-[1fr_auto] items-start gap-x-6 gap-y-3 py-8 text-left md:grid-cols-[10rem_1fr_2fr_auto] md:gap-x-8"
		aria-expanded={open}
		aria-controls={panelId}
		onclick={() => (open = !open)}
	>
		<p class="pt-1 label text-muted md:order-1">{role.dates}</p>
		<div class="col-span-2 md:order-2 md:col-span-1">
			<h2 class="label text-paper transition-colors group-hover:text-signal">{role.title}</h2>
			<p class="mt-2 label text-pulse">{role.company}</p>
			{#if role.location}
				<p class="mt-2 label text-muted">{role.location}</p>
			{/if}
		</div>
		<p class="hidden label text-muted md:order-3 md:block">
			{role.highlights.length} highlight{role.highlights.length === 1 ? '' : 's'}
		</p>
		<span
			class="flex h-8 w-8 items-center justify-center label text-paper transition-transform duration-200 hairline group-hover:border-signal group-hover:text-signal md:order-4"
			class:rotate-45={open}
			aria-hidden="true"
		>
			+
		</span>
	</button>

	{#if open}
		<div id={panelId} transition:slide={{ duration }}>
			<ul
				class="max-w-2xl space-y-3 pb-10 text-paper/75 md:ml-[calc(10rem+2rem)] lg:ml-[calc((100%-10rem-6rem)/3+10rem+4rem)]"
			>
				{#each role.highlights as highlight (highlight)}
					<li class="grid grid-cols-[1rem_1fr] gap-2">
						<span class="text-pulse" aria-hidden="true">·</span>
						<span>{highlight}</span>
					</li>
				{/each}
			</ul>
		</div>
	{/if}
</li>
