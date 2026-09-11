# Andrew Matthews — Personal Website

Personal site: software engineering, data science, and an interest in computation, mathematics, neuroscience, and physics.
Built with [SvelteKit](https://svelte.dev/docs/kit), styled with [Tailwind CSS v4](https://tailwindcss.com), deployed to [Cloudflare Pages](https://pages.cloudflare.com). The home page hero is a procedural brain with a firing hypergraph rendered in [Three.js](https://threejs.org).

Development uses [Deno](https://deno.com) as the local toolchain (`deno task ...`); the equivalent `npm run ...` scripts also work and are what Cloudflare Pages runs to build the site.

## Requirements

- [Deno](https://docs.deno.com/runtime/getting_started/installation/) 2.x

## Develop

```sh
deno install        # install dependencies (once)
deno task dev       # start the dev server at http://localhost:5173
```

## Build and run

```sh
deno task build     # outputs a Cloudflare Pages worker to .svelte-kit/cloudflare/
deno task start     # serves the production build locally with Wrangler on :8788
```

## Other tasks

```sh
deno task check     # type-check Svelte + TypeScript
deno task format    # format with Prettier (sorts Tailwind classes)
```

## Layout

- `src/routes/` — pages: `/` (home) and `/experience`
- `src/lib/components/` — shared UI (banner, nav, footer, stats, skill meter, contact, brain hero)
- `src/lib/data/` — page content as plain TypeScript objects
- `src/lib/three/` — the hero scene: procedural brain geometry, hypergraph + firing simulation, shaders, renderer lifecycle
- `src/app.css` — Tailwind import and the design tokens (colors, type) for the whole site
- `static/` — images and favicon, served as-is
- `legacy/` — the original Bootstrap site, kept for reference
