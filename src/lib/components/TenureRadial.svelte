<script lang="ts">
	import type { SkillCategory } from '$lib/data/experience';

	interface Props {
		categories: SkillCategory[];
		maxYears: number;
	}

	let { categories, maxYears }: Props = $props();

	// --- Geometry (viewBox units) ------------------------------------------
	const SIZE = 900;
	const CX = SIZE / 2;
	const CY = SIZE / 2;
	const R_INNER = 78; // where bars start
	const R_MAX = 268; // the outermost year ring
	const R_CATEGORY = 284; // curved category labels
	const R_LABEL = 306; // tool names
	const GAP_UNITS = 1.6; // gap between categories, in bar widths
	const BAR_FILL = 0.68; // fraction of a slot a bar occupies

	const toolCount = $derived(categories.reduce((n, c) => n + c.skills.length, 0));
	const unitDeg = $derived(360 / (toolCount + categories.length * GAP_UNITS));
	const ringStep = $derived((R_MAX - R_INNER) / maxYears);
	const ringRadius = (years: number) => R_INNER + years * ringStep;

	const rad = (deg: number) => (deg * Math.PI) / 180;
	const point = (deg: number, r: number) => [
		CX + r * Math.cos(rad(deg)),
		CY + r * Math.sin(rad(deg))
	];

	/** Annular sector path between two angles (degrees, clockwise from +x) and two radii. */
	function sector(a0: number, a1: number, r0: number, r1: number) {
		const [x0, y0] = point(a0, r1);
		const [x1, y1] = point(a1, r1);
		const [x2, y2] = point(a1, r0);
		const [x3, y3] = point(a0, r0);
		const large = a1 - a0 > 180 ? 1 : 0;
		return `M${x0},${y0} A${r1},${r1} 0 ${large} 1 ${x1},${y1} L${x2},${y2} A${r0},${r0} 0 ${large} 0 ${x3},${y3} Z`;
	}

	/** Arc path for a curved label; drawn right-to-left on the lower half so text stays upright. */
	function arc(a0: number, a1: number, r: number) {
		const mid = ((a0 + a1) / 2 + 360) % 360;
		const flip = mid > 0 && mid < 180; // lower half in SVG coordinates
		const [sx, sy] = point(flip ? a1 : a0, r);
		const [ex, ey] = point(flip ? a0 : a1, r);
		const large = a1 - a0 > 180 ? 1 : 0;
		return `M${sx},${sy} A${r},${r} 0 ${large} ${flip ? 0 : 1} ${ex},${ey}`;
	}

	interface Bar {
		name: string;
		years: number;
		category: string;
		path: string;
		mid: number;
		label: { x: number; y: number; rotate: number; anchor: 'start' | 'end' };
	}

	interface Sector {
		name: string;
		short: string;
		start: number;
		end: number;
		arc: string;
	}

	const layout = $derived.by(() => {
		const bars: Bar[] = [];
		const sectors: Sector[] = [];
		// Start so the gap between the last and first category straddles the top.
		let cursor = -90 - (GAP_UNITS / 2) * unitDeg;
		for (const category of categories) {
			cursor += GAP_UNITS * unitDeg;
			const start = cursor;
			for (const skill of category.skills) {
				const a0 = cursor + ((1 - BAR_FILL) / 2) * unitDeg;
				const a1 = a0 + BAR_FILL * unitDeg;
				const mid = (a0 + a1) / 2;
				const [lx, ly] = point(mid, R_LABEL);
				const norm = ((mid % 360) + 360) % 360;
				const left = norm > 90 && norm < 270;
				bars.push({
					name: skill.name,
					years: skill.years,
					category: category.name,
					path: sector(a0, a1, R_INNER, ringRadius(skill.years)),
					mid,
					label: { x: lx, y: ly, rotate: left ? mid + 180 : mid, anchor: left ? 'end' : 'start' }
				});
				cursor += unitDeg;
			}
			const end = cursor;
			sectors.push({
				name: category.name,
				short: category.short,
				start,
				end,
				arc: arc(start + 0.15 * unitDeg, end - 0.15 * unitDeg, R_CATEGORY)
			});
		}
		return { bars, sectors };
	});

	const rings = $derived(Array.from({ length: maxYears }, (_, i) => i + 1));
	const labelledRings = $derived(rings.filter((y) => y % 4 === 0 || y === maxYears));

	let hovered = $state<Bar | null>(null);
	const id = $props.id();

	/** Rendered width in CSS px; text is scaled up in viewBox units as the chart shrinks. */
	let width = $state(0);
	const fontScale = $derived(width > 0 ? Math.min(1.7, Math.max(1, SIZE / width)) : 1);
	const fs = (px: number) => `${(px * fontScale).toFixed(2)}px`;
</script>

<figure class="mx-auto max-w-[52rem]" bind:clientWidth={width}>
	<svg
		viewBox="0 0 {SIZE} {SIZE}"
		class="h-auto w-full overflow-visible"
		aria-hidden="true"
		onpointerleave={() => (hovered = null)}
	>
		<!-- Year rings -->
		{#each rings as year (year)}
			<circle
				cx={CX}
				cy={CY}
				r={ringRadius(year)}
				class={['fill-none stroke-line', year % 4 === 0 ? 'opacity-100' : 'opacity-50']}
				stroke-width="1"
			/>
		{/each}
		{#each labelledRings as year (year)}
			<text
				x={CX}
				y={CY - ringRadius(year) - 3}
				class="fill-muted font-mono tracking-[0.12em]"
				font-size={fs(9)}
				text-anchor="middle"
			>
				{year}
			</text>
		{/each}

		<!-- Category arcs + curved labels -->
		{#each layout.sectors as s (s.name)}
			<path id="{id}-arc-{s.short}" d={s.arc} class="fill-none" />
			<path
				d={s.arc}
				class={[
					'fill-none stroke-pulse transition-opacity duration-200',
					hovered && hovered.category !== s.name ? 'opacity-20' : 'opacity-60'
				]}
				stroke-width="1"
			/>
			<text
				font-size={fs(9)}
				class={[
					'fill-pulse font-mono tracking-[0.14em] uppercase transition-opacity duration-200',
					hovered && hovered.category !== s.name ? 'opacity-25' : 'opacity-100'
				]}
				dy="-4"
			>
				<textPath href="#{id}-arc-{s.short}" startOffset="50%" text-anchor="middle">
					{s.short}
				</textPath>
			</text>
		{/each}

		<!-- Bars -->
		{#each layout.bars as bar (bar.name)}
			<g
				class={[
					'cursor-default transition-opacity duration-200',
					hovered && hovered.category !== bar.category ? 'opacity-25' : 'opacity-100'
				]}
				role="presentation"
				onpointerenter={() => (hovered = bar)}
			>
				<title>{bar.name}: {bar.years} {bar.years === 1 ? 'year' : 'years'}</title>
				<path
					d={bar.path}
					class={['stroke-ink transition-colors', hovered === bar ? 'fill-signal' : 'fill-pulse']}
					stroke-width="1"
				/>
				<text
					x={bar.label.x}
					y={bar.label.y}
					transform="rotate({bar.label.rotate} {bar.label.x} {bar.label.y})"
					text-anchor={bar.label.anchor}
					dominant-baseline="middle"
					font-size={fs(10)}
					class={['font-mono', hovered === bar ? 'fill-signal' : 'fill-paper']}
				>
					{bar.name}
				</text>
			</g>
		{/each}

		<!-- Center readout -->
		<g text-anchor="middle" class="font-mono">
			{#if hovered}
				<text x={CX} y={CY - 6} font-size={fs(13)} class="fill-paper">{hovered.name}</text>
				<text x={CX} y={CY + 14} font-size={fs(11)} class="fill-signal tracking-[0.14em] uppercase">
					{hovered.years}
					{hovered.years === 1 ? 'year' : 'years'}
				</text>
			{:else}
				<text x={CX} y={CY - 6} font-size={fs(13)} class="fill-paper">{toolCount} tools</text>
				<text x={CX} y={CY + 14} font-size={fs(9)} class="fill-muted tracking-[0.14em] uppercase">
					hover a bar
				</text>
			{/if}
		</g>
	</svg>
</figure>
