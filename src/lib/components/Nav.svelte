<script lang="ts">
	import { page } from '$app/state';
	import { navLinks, site } from '$lib/data/site';

	let open = $state(false);

	function isCurrent(href: string) {
		return page.url.pathname === href || page.url.pathname.startsWith(href + '/');
	}
</script>

<header class="sticky top-0 z-20 bg-ink/90 backdrop-blur hairline-b">
	<nav
		class="page-container flex flex-wrap items-center justify-between px-4 py-4 md:px-6 lg:px-10 xl:px-16"
		aria-label="Primary"
	>
		<a
			href="/"
			class="label text-paper transition-colors hover:text-signal"
			onclick={() => (open = false)}
		>
			A.Matthews
		</a>

		<button
			class="px-3 py-2 label text-paper transition-colors hairline hover:border-signal hover:text-signal md:hidden"
			type="button"
			aria-expanded={open}
			aria-controls="primary-nav"
			onclick={() => (open = !open)}
		>
			{open ? 'Close' : 'Menu'}
		</button>

		<ul
			id="primary-nav"
			class={[
				'basis-full flex-col gap-3 pt-5 md:flex md:basis-auto md:flex-row md:items-center md:gap-8 md:pt-0',
				open ? 'flex' : 'hidden'
			]}
		>
			{#each navLinks as link (link.href)}
				<li>
					<a
						href={link.href}
						class={[
							'block py-1 label transition-colors hover:text-signal',
							isCurrent(link.href) ? 'text-pulse' : 'text-paper'
						]}
						aria-current={isCurrent(link.href) ? 'page' : undefined}
						onclick={() => (open = false)}
					>
						{link.label}
					</a>
				</li>
			{/each}
			<li>
				<a
					href="mailto:{site.contactEmail}"
					class="inline-block px-3 py-2 label text-paper transition-colors hairline hover:border-signal hover:bg-signal hover:text-ink"
				>
					Email me
				</a>
			</li>
		</ul>
	</nav>
</header>
