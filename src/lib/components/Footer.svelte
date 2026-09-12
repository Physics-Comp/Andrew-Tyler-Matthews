<script lang="ts">
	import { site, socialLinks } from '$lib/data/site';

	const year = new Date().getFullYear();
</script>

<footer class="px-4 py-10 hairline-t md:px-6 lg:px-10 xl:px-16">
	<div class="page-container grid gap-6 label text-muted md:grid-cols-3 md:items-center">
		<nav class="flex gap-6" aria-label="Social">
			{#each socialLinks as link (link.href)}
				<a
					href={link.href}
					target="_blank"
					rel="noopener noreferrer"
					class="text-paper transition-colors hover:text-signal"
				>
					{link.label}
				</a>
			{/each}
		</nav>
		<p class="md:text-right">© {year} {site.name}</p>
	</div>
</footer>
