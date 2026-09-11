import { redirect, type Handle } from '@sveltejs/kit';

/**
 * Old static-site URLs and removed routes → current pages.
 * The Deno adapter only emits trailing-slash redirects for pages that still exist,
 * so removed routes (and their trailing-slash variants) must be handled here.
 */
const legacyRoutes: Record<string, string> = {
	'/index.html': '/',
	'/experience_skills.html': '/experience',
	'/interests_projects.html': '/',
	'/services.html': '/',
	'/projects': '/',
	'/services': '/'
};

export const handle: Handle = async ({ event, resolve }) => {
	const path = event.url.pathname.replace(/\/+$/, '') || '/';
	const target = legacyRoutes[path];
	if (target) redirect(301, target);
	return resolve(event);
};
