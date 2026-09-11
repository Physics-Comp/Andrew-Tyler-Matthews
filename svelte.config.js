import adapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Compiles <script lang="ts"> via Vite. Styling is Tailwind (src/app.css), so no CSS preprocessing.
	preprocess: vitePreprocess(),

	compilerOptions: {
		// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
		runes: ({ filename }) => (filename.split(/[/\\]/).includes('node_modules') ? undefined : true)
	},

	kit: {
		// Official Cloudflare adapter: `vite build` emits a Pages-compatible worker to .svelte-kit/cloudflare/
		adapter: adapter()
	}
};

export default config;
