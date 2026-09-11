<script lang="ts">
	import { site, socialLinks } from '$lib/data/site';

	const year = new Date().getFullYear();
</script>

<footer class="footer">
	<nav class="footer__links" aria-label="Social">
		{#each socialLinks as link (link.href)}
			<a href={link.href} target="_blank" rel="noopener noreferrer">{link.label}</a>
		{/each}
	</nav>
	<p class="footer__name">© {year} {site.name}.</p>
</footer>

<style lang="scss">
	@use '$lib/styles/variables' as *;

	.footer {
		margin: 0;
		padding: 20px 0 50px;
		text-align: center;
		font-family: $font-display;
		background-color: $color-mint;
	}

	.footer__links a {
		display: inline-block;
		margin: 10px 20px;
		color: $color-teal-dark;

		&:hover {
			color: $color-teal;
		}
	}

	.footer__name {
		margin: 0;
		padding-top: 30px;
		color: $color-teal-dark;
	}
</style>
