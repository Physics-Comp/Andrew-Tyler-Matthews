<script lang="ts">
	import '$lib/styles/global.scss';
	import Nav from '$lib/components/Nav.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { site } from '$lib/data/site';

	let { children } = $props();
</script>

<svelte:head>
	<meta name="description" content={site.description} />
</svelte:head>

<Nav />
<main>
	{@render children()}
</main>
<Footer />
