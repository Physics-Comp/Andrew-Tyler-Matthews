<script lang="ts">
	import { site } from '$lib/data/site';
</script>

<section id="contact" class="scroll-mt-20 px-4 py-24 hairline-t md:px-6 md:py-32 lg:px-10 xl:px-16">
	<div class="page-container grid gap-10 md:grid-cols-12">
		<div class="md:col-span-5">
			<p class="label text-muted">Contact</p>
			<h2 class="mt-6 text-display uppercase">Get in touch</h2>
		</div>
		<div class="md:col-span-6 md:col-start-7">
			<p class="label text-pulse">Open to collaboration & good conversation</p>
			<p class="mt-6 max-w-md text-paper/80">
				If you want to collaborate on a project or have an engaging discussion, send me an email.
				I'd like to hear from you.
			</p>
			<a
				href="mailto:{site.contactEmail}"
				class="mt-10 inline-block px-6 py-4 label text-paper transition-colors hairline hover:border-signal hover:bg-signal hover:text-ink"
			>
				Contact me →
			</a>
		</div>
	</div>
</section>
