<script lang="ts">
	interface Props {
		/** Filled stars */
		value: number;
		max?: number;
		/** What is being rated, for the accessible label */
		label: string;
	}

	let { value, max = 5, label }: Props = $props();
</script>

<span class="stars" role="img" aria-label="{label}: {value} out of {max}">
	{#each { length: max }, i (i)}
		<svg
			class="star"
			class:star--filled={i < value}
			viewBox="0 0 24 24"
			width="16"
			height="16"
			aria-hidden="true"
		>
			<path
				d="M12 2.5l2.95 6.3 6.9.8-5.1 4.7 1.35 6.85L12 17.75l-6.1 3.4 1.35-6.85-5.1-4.7 6.9-.8z"
				fill={i < value ? 'currentColor' : 'none'}
				stroke="currentColor"
				stroke-width="1.5"
				stroke-linejoin="round"
			/>
		</svg>
	{/each}
</span>

<style lang="scss">
	@use '$lib/styles/variables' as *;

	.stars {
		display: inline-flex;
		gap: 0.35rem;
		color: $color-teal-dark;
	}

	.star {
		flex: none;
	}
</style>
