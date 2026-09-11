<script lang="ts">
	import PageTitle from '$lib/components/PageTitle.svelte';
	import StarRating from '$lib/components/StarRating.svelte';
	import { education, jobs, skillColumns } from '$lib/data/experience';
</script>

<svelte:head>
	<title>Experience</title>
</svelte:head>

<PageTitle title="Background" />

<h2 class="section-heading">Education</h2>
<div class="entries">
	{#each education as entry (entry.school)}
		<div class="entry">
			<div class="entry__meta">
				<h3 class="entry__title">{entry.school}</h3>
				<p class="entry__dates">{entry.dates}</p>
			</div>
			<div class="entry__body">
				<p>{entry.description}</p>
			</div>
		</div>
	{/each}
</div>

<hr class="separator" />

<h2 class="section-heading">Work Experience</h2>
<div class="entries">
	{#each jobs as job (job.title + job.company)}
		<div class="entry">
			<div class="entry__meta">
				<h3 class="entry__title">{job.title}</h3>
				<p class="entry__dates">{job.dates}</p>
			</div>
			<div class="entry__body">
				<h4 class="entry__subtitle">{job.company}</h4>
				<p>{job.description}</p>
			</div>
		</div>
	{/each}
</div>

<hr class="separator" />

<PageTitle title="Abilities" />

<h2 class="section-heading section-heading--skills">Skills</h2>
<div class="skills">
	{#each skillColumns as column, i (i)}
		<table class="skills__table">
			<tbody>
				{#each column as skill (skill.name)}
					<tr>
						<th scope="row">{skill.name}</th>
						<td><StarRating value={skill.rating} label={skill.name} /></td>
					</tr>
				{/each}
			</tbody>
		</table>
	{/each}
</div>

<style lang="scss">
	@use '$lib/styles/variables' as *;
	@use '$lib/styles/mixins' as *;

	.section-heading {
		@include display-heading;
		margin: 0 10%;
		padding: 25px 0;

		&--skills {
			margin: 0 15%;
		}
	}

	.separator {
		width: 100%;
		margin: 0;
		border: none;
		border-top: 1px solid $color-border;
	}

	// Two-column entry (was Bootstrap .row / .col-sm-6) ------------------------
	.entries {
		margin: 0 13%;

		@include down($bp-md) {
			margin: 0 1rem;
		}
	}

	.entry {
		display: grid;
		gap: 1rem 2rem;
		padding-bottom: 100px;

		@include up($bp-sm) {
			grid-template-columns: 1fr 1fr;
		}

		@include down($bp-md) {
			padding-bottom: 3rem;
		}
	}

	.entry__title {
		@include display-heading($font-size-h4);
	}

	.entry__subtitle {
		@include display-heading(15px, $color-text);
	}

	.entry__dates {
		font-family: $font-display;
		font-size: 15px;
	}

	.entry__body p {
		font-family: $font-mono;
	}

	// Skills -----------------------------------------------------------------
	.skills {
		display: grid;
		gap: 2rem 4rem;
		margin: 0 18% 50px;

		@include up($bp-sm) {
			grid-template-columns: 1fr 1fr;
		}

		@include down($bp-md) {
			margin: 0 1rem 50px;
		}
	}

	.skills__table {
		width: 100%;

		th {
			padding: 0.15rem 1.5rem 0.15rem 0;
			text-align: left;
			font-weight: normal;
			font-family: $font-mono;
		}

		td {
			padding: 0.15rem 0;
		}
	}
</style>
