<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title: string;
		description: string;
		image: string;
		alt?: string;
		/** Fixed image height in px; leave unset to let the image size itself. */
		imageHeight?: number;
		/** Action area (button/link) rendered below the description. */
		children?: Snippet;
	}

	let { title, description, image, alt = '', imageHeight, children }: Props = $props();
</script>

<article class="card">
	<img
		class="card__image"
		src={image}
		{alt}
		loading="lazy"
		style:height={imageHeight ? `${imageHeight}px` : undefined}
	/>
	<div class="card__body">
		<h3 class="card__title">{title}</h3>
		<p class="card__text">{description}</p>
		{#if children}
			<div class="card__actions">
				{@render children()}
			</div>
		{/if}
	</div>
</article>

<style lang="scss">
	@use '$lib/styles/variables' as *;

	.card {
		display: flex;
		flex-direction: column;
		background-color: $color-white;
		border: 1px solid $color-border;
		border-radius: $radius;
		overflow: hidden;
	}

	.card__image {
		width: 100%;
		object-fit: cover;
	}

	.card__body {
		display: flex;
		flex: 1;
		flex-direction: column;
		padding: 1.25rem;
		font-family: $font-mono;
	}

	.card__title {
		margin-bottom: 0.75rem;
		font-family: $font-mono;
		font-size: 1.25rem;
		color: $color-text;
	}

	.card__text {
		flex: 1;
		margin-bottom: 1rem;
	}

	.card__actions {
		display: flex;
		justify-content: center;
		margin-top: auto;
	}
</style>
