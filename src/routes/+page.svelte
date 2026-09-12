<script lang="ts">
	import BrainHero from '$lib/components/BrainHero.svelte';
	import ContactCta from '$lib/components/ContactCta.svelte';
	import StatsRow from '$lib/components/StatsRow.svelte';
	import { bio, headline, heroSubtitle, heroTitle, heroValues, lenses } from '$lib/data/home';
	import { site } from '$lib/data/site';
	import { stats } from '$lib/data/stats';
	import { EDGE_COUNT, NODE_COUNT } from '$lib/three/config';
</script>

<svelte:head>
	<title>{site.name}</title>
</svelte:head>

<!-- Hero -->
<section class="relative overflow-hidden bg-grid px-4 md:px-6 lg:px-10 xl:px-16">
	<div class="page-container">
		<div class="grid min-h-[calc(100dvh-7rem)] grid-cols-12 items-center gap-x-8 gap-y-12 py-16">
			<div class="col-span-12 lg:col-span-5">
				<h1 class="text-display uppercase">{heroTitle}</h1>
				<p class="mt-3 text-display-sm text-muted uppercase">{heroSubtitle}</p>
				<p class="mt-10 label text-pulse">{heroValues.join(' · ')}</p>
				<div class="mt-10 flex flex-wrap gap-4 label">
					<a
						href="/experience"
						class="inline-block px-5 py-3 text-paper transition-colors hairline hover:border-signal hover:bg-signal hover:text-ink"
					>
						View experience →
					</a>
					<a
						href="#contact"
						class="inline-block px-2 py-3 text-muted transition-colors hover:text-signal"
					>
						Get in touch
					</a>
				</div>
			</div>
			<div class="col-span-12 lg:col-span-7">
				<BrainHero />
			</div>
		</div>
		<div class="flex justify-between pb-6 label text-muted">
			<p>
				Fig. 01 — procedural cortex · n = {NODE_COUNT} nodes · {EDGE_COUNT} hyperedges · stochastic firing
			</p>
			<p class="hidden md:block">Scroll to explore ↓</p>
		</div>
	</div>
</section>

<!-- Statement + stats -->
<section class="bg-sky px-4 py-24 text-sky-ink md:px-6 md:py-32 lg:px-10 xl:px-16">
	<div class="page-container">
		<h2 class="max-w-5xl text-display-sm uppercase">{headline}</h2>
		<div class="mt-20 border-t border-sky-line pt-12">
			<StatsRow {stats} />
		</div>
	</div>
</section>

<!-- About -->
<section class="px-4 py-24 md:px-6 md:py-32 lg:px-10 xl:px-16">
	<div class="page-container grid gap-12 md:grid-cols-12">
		<figure class="md:col-span-4">
			<!-- Source is only 200px; enlarging past this trades a little sharpness for presence. -->
			<div class="relative aspect-square w-full max-w-80 overflow-hidden bg-black hairline">
				<img
					src="/images/headshot4.jpg"
					alt="Portrait of {site.name}"
					width="200"
					height="200"
					class="h-full w-full object-cover"
				/>
				<!-- Soft vignette: fades the grey backdrop into the black frame without touching the face. -->
				<div
					class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_65%_at_50%_45%,transparent_55%,var(--color-black)_100%)]"
				></div>
			</div>
			<figcaption class="mt-4 label text-muted">Fig. 02 — A. Matthews</figcaption>
		</figure>
		<div class="md:col-span-7 md:col-start-6">
			<p class="label text-muted">About</p>
			<h2 class="mt-6 text-display-sm uppercase">Hello.</h2>
			<p class="mt-8 max-w-xl text-paper/80">{bio}</p>
			<ol class="mt-16">
				{#each lenses as lens (lens.title)}
					<li class="py-8 hairline-t">
						<h3 class="label text-paper">{lens.title}</h3>
						<p class="mt-4 max-w-xl text-paper/70">{lens.text}</p>
					</li>
				{/each}
			</ol>
		</div>
	</div>
</section>

<ContactCta />
