import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	// Tailwind first so it owns CSS processing before Svelte emits component styles.
	plugins: [tailwindcss(), sveltekit()]
});
