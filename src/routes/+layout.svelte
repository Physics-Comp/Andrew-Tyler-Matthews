<script lang="ts">
	import '../app.css';
	import TopBanner from '$lib/components/TopBanner.svelte';
	import Nav from '$lib/components/Nav.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { site } from '$lib/data/site';

	let { children } = $props();
</script>

<svelte:head>
	<meta name="description" content={site.description} />
</svelte:head>

<TopBanner />
<Nav />
<main>
	{@render children()}
</main>
<Footer />
