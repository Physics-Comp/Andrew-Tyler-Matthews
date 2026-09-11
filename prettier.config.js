/** @type {import("prettier").Config} */
const config = {
	useTabs: true,
	singleQuote: true,
	trailingComma: 'none',
	printWidth: 100,
	// Tailwind plugin must be last so it can sort classes after the Svelte parser runs.
	plugins: ['prettier-plugin-svelte', 'prettier-plugin-tailwindcss'],
	tailwindStylesheet: './src/app.css',
	overrides: [{ files: '*.svelte', options: { parser: 'svelte' } }]
};

export default config;
