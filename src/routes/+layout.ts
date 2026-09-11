// Every page is static content, so render it all at build time.
// The Deno server still handles redirects (see hooks.server.ts) and any future dynamic routes.
export const prerender = true;
