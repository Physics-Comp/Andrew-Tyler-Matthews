<script lang="ts">
	import AutomatonPanel from '$lib/components/AutomatonPanel.svelte';
	import ContactCta from '$lib/components/ContactCta.svelte';
	import RoleDrawer from '$lib/components/RoleDrawer.svelte';
	import TenureRadial from '$lib/components/TenureRadial.svelte';
	import TenureSwarm from '$lib/components/TenureSwarm.svelte';
	import {
		education,
		maxSkillYears,
		profile,
		roleGroups,
		skillCategories
	} from '$lib/data/experience';
	import { site } from '$lib/data/site';

	const roleKey = (role: { title: string; company: string }) => `${role.company}|${role.title}`;

	/** Which drawers are open, keyed by company and title. Only the current role starts open. */
	let openRoles = $state<Record<string, boolean>>(
		Object.fromEntries(
			roleGroups.flatMap((group, g) =>
				group.roles.map((role, r) => [roleKey(role), g === 0 && r === 0])
			)
		)
	);

	function allOpen(group: (typeof roleGroups)[number]) {
		return group.roles.every((role) => openRoles[roleKey(role)]);
	}

	function setGroup(group: (typeof roleGroups)[number], open: boolean) {
		for (const role of group.roles) openRoles[roleKey(role)] = open;
	}
</script>

<svelte:head>
	<title>Experience — {site.name}</title>
</svelte:head>

<!-- Header -->
<section class="bg-grid px-4 pt-20 pb-16 md:px-6 md:pt-28 md:pb-24">
	<div class="grid gap-10 md:grid-cols-12">
		<div class="md:col-span-7">
			<p class="label text-muted">Experience</p>
			<h1 class="mt-6 text-display uppercase">Background<br />& abilities</h1>
		</div>
		<p class="max-w-md text-paper/75 md:col-span-4 md:col-start-9 md:pt-12">{profile}</p>
	</div>
	<div class="mt-16 md:mt-24">
		<AutomatonPanel />
	</div>
</section>

<!-- Roles -->
{#each roleGroups as group, g (group.heading)}
	<section class={['px-4 pb-24 md:px-6', g === 0 && 'pt-16 md:pt-24']}>
		<div class="flex items-end justify-between gap-4 pb-4 hairline-b">
			<p class="label text-muted">
				{group.heading}
			</p>
			<button
				type="button"
				class="cursor-pointer label text-muted transition-colors hover:text-signal"
				onclick={() => setGroup(group, !allOpen(group))}
			>
				{allOpen(group) ? 'Collapse all' : 'Expand all'}
			</button>
		</div>
		<ol>
			{#each group.roles as role (roleKey(role))}
				<RoleDrawer {role} bind:open={openRoles[roleKey(role)]} />
			{/each}
		</ol>
	</section>
{/each}

<!-- Education: one row, same rhythm as the roles -->
<section class="px-4 pb-24 md:px-6">
	<p class="pb-4 label text-muted hairline-b">Education</p>
	<ol>
		{#each education as entry (entry.school)}
			<li class="grid gap-4 py-8 hairline-b md:grid-cols-[1fr_2fr] md:gap-8">
				<div>
					<h2 class="label text-paper">{entry.school}</h2>
					<p class="mt-2 label text-pulse">{entry.degree} {entry.field}</p>
					<p class="mt-2 label text-muted">{entry.location}</p>
				</div>
				<p class="max-w-2xl text-paper/75">{entry.description}</p>
			</li>
		{/each}
	</ol>
</section>

<!-- Technical expertise: every tool by years of experience, grouped by category -->
<section class="px-4 pb-24 md:px-6 md:pb-32">
	<div class="flex flex-wrap items-end justify-between gap-4 pb-4 hairline-b">
		<p class="label text-muted">Technical expertise</p>
		<p class="label text-muted">Years of hands-on experience · longest {maxSkillYears}</p>
	</div>
	<!-- Radial bars from ~480px up (decorative for assistive tech); the beeswarm is the
	     narrow-screen layout and stays available to screen readers alongside the chart. -->
	<div class="mt-10 hidden min-[30rem]:block">
		<TenureRadial categories={skillCategories} maxYears={maxSkillYears} />
	</div>
	<div class="mt-10 min-[30rem]:sr-only">
		<TenureSwarm categories={skillCategories} maxYears={maxSkillYears} />
	</div>
</section>

<ContactCta />
