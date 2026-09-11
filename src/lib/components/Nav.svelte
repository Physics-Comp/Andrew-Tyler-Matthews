<script lang="ts">
	import { page } from '$app/state';
	import { navLinks } from '$lib/data/site';

	let open = $state(false);

	function isCurrent(href: string) {
		return page.url.pathname === href || page.url.pathname.startsWith(href + '/');
	}
</script>

<header class="nav">
	<nav class="nav__inner" aria-label="Primary">
		<a class="nav__brand" href="/" onclick={() => (open = false)}>
			<img src="/images/beaker_home.png" alt="Home" width="50" height="50" />
		</a>

		<button
			class="nav__toggle"
			type="button"
			aria-expanded={open}
			aria-controls="primary-nav"
			onclick={() => (open = !open)}
		>
			<span class="sr-only">Toggle navigation</span>
			<span class="nav__burger" aria-hidden="true"></span>
		</button>

		<ul id="primary-nav" class="nav__links" class:nav__links--open={open}>
			{#each navLinks as link (link.href)}
				<li>
					<a
						href={link.href}
						aria-current={isCurrent(link.href) ? 'page' : undefined}
						onclick={() => (open = false)}
					>
						{link.label}
					</a>
				</li>
			{/each}
		</ul>
	</nav>
</header>

<style lang="scss">
	@use '$lib/styles/variables' as *;
	@use '$lib/styles/mixins' as *;

	.nav {
		background-color: $color-mint;
		font-family: $font-display;
		padding-top: 16px;
	}

	.nav__inner {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		padding: 0.5rem 1rem;
	}

	.nav__brand {
		display: inline-flex;
		margin-right: 1rem;
	}

	.nav__toggle {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 3.25rem;
		height: 2.5rem;
		padding: 0;
		border: 1px solid rgba($color-teal-dark, 0.25);
		border-radius: $radius;
		background: transparent;
		color: $color-teal-dark;
		cursor: pointer;

		&:focus-visible {
			outline: 2px solid $color-teal;
			outline-offset: 2px;
		}

		@include up($bp-lg) {
			display: none;
		}
	}

	// Three-bar burger drawn with box-shadows
	.nav__burger {
		position: relative;
		display: block;
		width: 1.4rem;
		height: 2px;
		background: currentColor;
		box-shadow:
			0 -7px 0 currentColor,
			0 7px 0 currentColor;
	}

	.nav__links {
		display: none;
		flex-basis: 100%;
		flex-direction: column;
		margin: 0;
		padding: 0.5rem 0 0;
		list-style: none;

		&--open {
			display: flex;
		}

		@include up($bp-lg) {
			display: flex;
			flex-basis: auto;
			flex-direction: row;
			margin-left: auto;
			padding: 0;
		}

		a {
			display: block;
			padding: 0.5rem;
			color: $color-teal-dark;

			&:hover,
			&[aria-current='page'] {
				color: $color-teal;
			}
		}
	}
</style>
