<script lang="ts">
	import Card from '$lib/components/Card.svelte';
	import { projectGroups } from '$lib/data/projects';
</script>

<svelte:head>
	<title>Projects</title>
</svelte:head>

{#each projectGroups as group (group.heading)}
	<section class="group">
		<h2 class="group__heading">{group.heading}</h2>
		<div class="group__cards" style:--columns={group.projects.length}>
			{#each group.projects as project (project.title)}
				<Card
					title={project.title}
					description={project.description}
					image={project.image}
					alt={project.alt}
					imageHeight={project.imageHeight}
				>
					<a class="btn" href={project.action.href} target="_blank" rel="noopener noreferrer">
						{project.action.label}
					</a>
				</Card>
			{/each}
		</div>
	</section>
{/each}

<style lang="scss">
	@use '$lib/styles/variables' as *;
	@use '$lib/styles/mixins' as *;

	.group {
		margin: 0 13%;

		&:last-of-type {
			margin-bottom: 5%;
		}

		@include down($bp-md) {
			margin: 0 1rem;
		}
	}

	.group__heading {
		@include display-heading;
		padding: 25px 0;
	}

	// Replaces Bootstrap's .card-deck: equal-width cards in a row, stacking on small screens
	.group__cards {
		display: grid;
		gap: 30px;

		@include up($bp-sm) {
			grid-template-columns: repeat(var(--columns, 3), 1fr);
		}
	}
</style>
