import adapter from '@deno/svelte-adapter';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Compiles <style lang="scss"> and <script lang="ts"> blocks via Vite.
	preprocess: vitePreprocess(),

	compilerOptions: {
		// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
		runes: ({ filename }) => (filename.split(/[/\\]/).includes('node_modules') ? undefined : true)
	},

	kit: {
		// Official Deno adapter: `deno task build` emits a server to .deno-deploy/
		adapter: adapter()
	}
};

export default config;
