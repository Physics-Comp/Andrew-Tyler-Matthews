# Andrew Matthews — Personal Website

A personal website showcasing my interests, skills, and projects.
Built with [SvelteKit](https://svelte.dev/docs/kit), styled with Sass, and served by [Deno](https://deno.com).

## Requirements

- [Deno](https://docs.deno.com/runtime/getting_started/installation/) 2.x

## Develop

```sh
deno install        # install dependencies (once)
deno task dev       # start the dev server at http://localhost:5173
```

## Build and run

```sh
deno task build     # outputs a Deno server to .deno-deploy/
deno task start     # serves the production build with Deno
```

## Other tasks

```sh
deno task check     # type-check Svelte + TypeScript
deno task format    # format with Prettier
```

## Layout

- `src/routes/` — one folder per page (`/`, `/experience`, `/projects`, `/services`)
- `src/lib/components/` — shared UI (nav, footer, cards, star ratings)
- `src/lib/data/` — page content as plain TypeScript objects
- `src/lib/styles/` — Sass variables, mixins, and global styles
- `static/` — images and favicon, served as-is
- `legacy/` — the original Bootstrap site, kept for reference during the redesign
