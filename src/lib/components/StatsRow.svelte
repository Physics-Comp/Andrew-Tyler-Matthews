<script lang="ts">
	import type { Stat } from '$lib/data/stats';

	let { stats }: { stats: Stat[] } = $props();

	/** Longer values need a smaller size so they don't wrap or overpower the row. */
	function valueSize(value: string) {
		if (value.length > 10) return 'text-2xl md:text-3xl';
		if (value.length > 6) return 'text-3xl md:text-4xl';
		return 'text-5xl md:text-6xl';
	}
</script>

<div class="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
	{#each stats as stat (stat.label)}
		<div class="border-l border-sky-line pl-4">
			<p class={['font-medium tracking-tight', valueSize(stat.value)]}>
				{stat.value}
			</p>
			<p class="mt-3 label opacity-70">{stat.label}</p>
		</div>
	{/each}
</div>
