<script lang="ts">
	import type { Skill, SkillCategory } from '$lib/data/experience';

	interface Props {
		categories: SkillCategory[];
		maxYears: number;
	}

	let { categories, maxYears }: Props = $props();

	const ticks = $derived(Array.from({ length: maxYears }, (_, i) => i + 1));
	const majorTicks = $derived(ticks.filter((t) => t % 4 === 0));
	const pos = (years: number) => `${(years / maxYears) * 100}%`;

	/** Vertical offset (in dot spacings) so tools with equal years stack instead of overlapping. */
	const DOT_SPACING = 12;
	function stacked(skills: Skill[]) {
		const seen = new Map<number, number>();
		return skills.map((skill) => {
			const index = seen.get(skill.years) ?? 0;
			seen.set(skill.years, index + 1);
			// 0, +1, -1, +2, -2 ... alternating around the centre line
			const step = Math.ceil(index / 2) * (index % 2 === 0 ? -1 : 1);
			return { skill, offset: step * DOT_SPACING };
		});
	}

	/** Selected tool name per category. Names, not objects: deep state would proxy the
	 *  skill objects and break identity comparisons against the source data. */
	let selected = $state<Record<string, string | undefined>>({});
</script>

<!-- Beeswarm: one row per category, every tool a dot on a shared 1..max year axis. -->
<div>
	<div class="grid grid-cols-[minmax(0,1fr)_60%] items-end gap-4">
		<p class="label text-muted">Tap a dot</p>
		<div class="relative h-4" aria-hidden="true">
			<div class="absolute inset-y-0 right-[5px] left-[5px]">
				{#each majorTicks as tick (tick)}
					<span class="absolute -translate-x-1/2 label text-muted" style:left={pos(tick)}>
						{tick}
					</span>
				{/each}
			</div>
		</div>
	</div>

	<ul class="mt-2">
		{#each categories as category (category.name)}
			{@const current = category.skills.find((skill) => skill.name === selected[category.name])}
			<li class="grid grid-cols-[minmax(0,1fr)_60%] items-center gap-4 py-3 hairline-t">
				<div class="min-w-0">
					<h2 class="label text-pulse">{category.short}</h2>
					<p class="mt-1 truncate label text-muted" aria-live="polite">
						{#if current}
							<span class="text-paper">{current.name}</span> · {current.years}
							{current.years === 1 ? 'yr' : 'yrs'}
						{:else}
							{category.skills.length} tools
						{/if}
					</p>
				</div>
				<div class="relative h-12">
					<div class="absolute inset-y-0 right-[5px] left-[5px]">
						{#each ticks as tick (tick)}
							<span
								class={['absolute inset-y-0 w-px', tick % 4 === 0 ? 'bg-line' : 'bg-line/40']}
								style:left={pos(tick)}
								aria-hidden="true"
							></span>
						{/each}
						{#each stacked(category.skills) as { skill, offset } (skill.name)}
							<button
								type="button"
								class={[
									'absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full transition-colors',
									// generous tap target around the small dot
									"before:absolute before:-inset-2.5 before:content-['']",
									current === skill
										? 'z-10 bg-signal shadow-[0_0_10px_var(--color-signal)]'
										: 'bg-pulse shadow-[0_0_8px_var(--color-pulse)]'
								]}
								style:left={pos(skill.years)}
								style:margin-top="{offset}px"
								aria-label="{skill.name}: {skill.years} {skill.years === 1 ? 'year' : 'years'}"
								aria-pressed={current === skill}
								onclick={() =>
									(selected[category.name] = current === skill ? undefined : skill.name)}
							></button>
						{/each}
					</div>
				</div>
			</li>
		{/each}
	</ul>
</div>
