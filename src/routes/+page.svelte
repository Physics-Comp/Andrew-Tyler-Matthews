<script lang="ts">
	import { site } from '$lib/data/site';
	import { bio, skillHighlights } from '$lib/data/home';
</script>

<svelte:head>
	<title>{site.name}</title>
</svelte:head>

<section class="hero">
	<img class="hero__atom hero__atom--left" src="/images/atom1.png" alt="" width="50" height="50" />
	<img class="hero__atom hero__atom--right" src="/images/atom1.png" alt="" width="50" height="50" />
	<h1 class="hero__name">I'm {site.firstName}</h1>
	<p class="hero__intro">{site.tagline}</p>
	<img class="hero__lab" src="/images/lab3.png" alt="" width="400" height="313" />
</section>

<section class="profile">
	<img
		class="profile__photo"
		src="/images/headshot4.jpg"
		alt="Portrait of {site.name}"
		width="200"
		height="200"
	/>
	<h2 class="profile__greeting">Hello.</h2>
	<p class="profile__bio">{bio}</p>
</section>

<hr class="rule" />

<section class="skills">
	<h2 class="skills__title">My Skills</h2>
	{#each skillHighlights as skill (skill.title)}
		<div class="skill skill--image-{skill.imageSide}">
			<img class="skill__image" src={skill.image} alt={skill.alt} width="250" height="250" />
			<h3 class="skill__title">{skill.title}</h3>
			<p class="skill__text">{skill.text}</p>
		</div>
	{/each}
</section>

<hr class="rule" />

<section class="contact">
	<h2 class="contact__title">Get In Touch</h2>
	<h3 class="contact__subtitle">I'm Available For Freelance Work</h3>
	<p class="contact__text">
		For inquires related to projects and freelance work please click the contact button
	</p>
	<a class="contact__button" href="mailto:{site.contactEmail}">
		<img src="/images/mail_letter.png" alt="" width="20" height="20" />
		Contact
	</a>
</section>

<style lang="scss">
	@use '$lib/styles/variables' as *;
	@use '$lib/styles/mixins' as *;

	section {
		text-align: center;
	}

	// Hero -------------------------------------------------------------------
	.hero {
		position: relative;
		padding: 50px 1rem 0;
		background-color: $color-mint;
	}

	.hero__atom {
		position: absolute;
		top: 4rem;

		&--left {
			left: 10%;
		}

		&--right {
			right: 10%;
		}

		@include down($bp-md) {
			display: none;
		}
	}

	.hero__name {
		@include display-heading($font-size-h1);
		margin: 0 auto;
	}

	.hero__intro {
		@include display-heading($font-size-h2);
		margin: 0 auto;
	}

	.hero__lab {
		display: block;
		margin: 0 auto;
	}

	// Profile ----------------------------------------------------------------
	.profile {
		width: min(50%, 100% - 2rem);
		margin: 0 auto;
		padding-bottom: 30px;

		@include down($bp-md) {
			width: auto;
			padding-inline: 1rem;
		}
	}

	.profile__photo {
		margin-top: 60px;
		border-radius: 50%;
	}

	.profile__greeting {
		@include display-heading;
		padding-top: 20px;
	}

	// Skills -----------------------------------------------------------------
	.skills {
		padding-bottom: 5%;
	}

	.skills__title {
		@include display-heading;
	}

	.skill {
		width: 70%;
		margin: 5% auto;
		text-align: left;
		line-height: 2;

		&::after {
			// clear the floated image
			content: '';
			display: table;
			clear: both;
		}

		&--image-left .skill__image {
			float: left;
			margin-right: 30px;
		}

		&--image-right .skill__image {
			float: right;
			margin-left: 30px;
			margin-bottom: 1rem;
		}

		@include down($bp-md) {
			width: auto;
			padding-inline: 1rem;

			.skill__image {
				float: none;
				display: block;
				margin: 0 auto 1rem;
			}
		}
	}

	.skill__title {
		@include display-heading;
	}

	// Contact ----------------------------------------------------------------
	.contact {
		padding: 0 1rem 50px;
	}

	.contact__title {
		@include display-heading;
	}

	.contact__subtitle {
		@include display-heading($font-size-h3, $color-teal);
	}

	.contact__button {
		@include button($color-teal, $color-teal-dark);
		margin-top: 1.5em;
		padding: 0.75em 2em;
		font-family: $font-display;
		font-size: 20px;
	}
</style>
