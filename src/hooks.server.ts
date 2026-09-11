import { redirect, type Handle } from '@sveltejs/kit';

/** Old static-site URLs → new routes, so existing links and bookmarks keep working. */
const legacyRoutes: Record<string, string> = {
	'/index.html': '/',
	'/experience_skills.html': '/experience',
	'/interests_projects.html': '/projects',
	'/services.html': '/services'
};

export const handle: Handle = async ({ event, resolve }) => {
	const target = legacyRoutes[event.url.pathname];
	if (target) redirect(301, target);
	return resolve(event);
};
