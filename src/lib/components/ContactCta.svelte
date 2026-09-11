<script lang="ts">
	import { site, socialLinks } from '$lib/data/site';
</script>

<section id="contact" class="scroll-mt-20 px-4 py-24 hairline-t md:px-6 md:py-32">
	<div class="grid gap-10 md:grid-cols-12">
		<div class="md:col-span-5">
			<p class="label text-muted">Contact</p>
			<h2 class="mt-6 text-display uppercase">Get in touch</h2>
		</div>
		<div class="md:col-span-6 md:col-start-7">
			<p class="label text-pulse">Open to collaboration & good conversation</p>
			<p class="mt-6 max-w-md text-paper/80">
				If you want to collaborate on a project, or just talk through an idea in computation, math,
				neuroscience, or physics, send me an email. I'd like to hear from you.
			</p>
			<a
				href="mailto:{site.contactEmail}"
				class="mt-10 inline-block px-6 py-4 label text-paper transition-colors hairline hover:border-signal hover:bg-signal hover:text-ink"
			>
				{site.contactEmail} →
			</a>
			<ul class="mt-10 flex gap-6 label text-muted">
				{#each socialLinks as link (link.href)}
					<li>
						<a
							href={link.href}
							target="_blank"
							rel="noopener noreferrer"
							class="transition-colors hover:text-signal"
						>
							{link.label}
						</a>
					</li>
				{/each}
			</ul>
		</div>
	</div>
</section>
