<script lang="ts">
	interface Props {
		title: string;
		/** Use an h2 for secondary section titles that share this look. */
		level?: 1 | 2;
	}

	let { title, level = 1 }: Props = $props();
</script>

<div class="page-title">
	{#if level === 1}
		<h1>{title}</h1>
	{:else}
		<h2>{title}</h2>
	{/if}
	<hr />
</div>

<style lang="scss">
	@use '$lib/styles/variables' as *;
	@use '$lib/styles/mixins' as *;

	.page-title {
		text-align: center;

		h1,
		h2 {
			@include display-heading(30px);
			margin: 0;
			padding-top: 25px;
			font-weight: bold;
		}

		hr {
			@include dotted-rule(15%);
		}
	}
</style>
