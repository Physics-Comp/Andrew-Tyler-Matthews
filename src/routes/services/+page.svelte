<script lang="ts">
	import Card from '$lib/components/Card.svelte';
	import PageTitle from '$lib/components/PageTitle.svelte';
	import { services, servicesContact } from '$lib/data/services';
</script>

<svelte:head>
	<title>Services</title>
</svelte:head>

<PageTitle title="Services" />

<div class="services">
	{#each services as service (service.title)}
		<Card
			title={service.title}
			description={service.description}
			image={service.image}
			alt={service.alt}
			imageHeight={220}
		>
			<a class="btn" href={servicesContact}>Contact</a>
		</Card>
	{/each}
</div>

<style lang="scss">
	@use '$lib/styles/variables' as *;
	@use '$lib/styles/mixins' as *;

	.services {
		display: grid;
		gap: 30px;
		margin: 5% 4%;

		@include up($bp-sm) {
			grid-template-columns: repeat(3, 1fr);
		}

		@include down($bp-md) {
			margin: 2rem 1rem;
		}
	}
</style>
