# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start Astro dev server (localhost:4321)
npm run build     # Build static site to dist/
npm run preview   # Serve production build locally
```

No linting or test scripts are configured.

## Environment Variables

- `PUBLIC_BETA` — set to `'true'` to switch to beta mode (affects site URL, robots.txt exclusion from crawlers, and install script endpoint)

## Architecture

**odio.love** is a static marketing site for the *odio* Raspberry Pi audio streaming project, built with Astro 5 + Tailwind CSS 4 + Svelte 5.

### Data → Components pattern

All page content lives in `/src/data/` as plain JS files (`features.js`, `comparison.js`, `streaming.js`, `ecosystem.js`, `repos.js`, `config.js`). Components in `/src/components/` import from these data files and render them — content changes go in `data/`, markup changes go in `components/`.

### Pages

- `src/pages/index.astro` — landing page; composes all 10 section components in order
- `src/pages/install.ts` — API endpoint that proxies the latest install script from GitHub releases
- `src/pages/robots.txt.ts` — dynamic robots.txt; disallows all crawlers when `PUBLIC_BETA` is set

### Layout & Styles

- `src/layouts/Base.astro` — single shared HTML shell with meta/OG tags and font imports
- `src/styles/global.css` — Tailwind 4 setup + 8 CSS custom properties for the dark green/moss theme (`--color-bg`, `--color-text`, `--color-accent-moss`, `--color-accent-leaf`, `--color-accent-amber`, etc.)

### Content

- `src/content/manifesto.mdx` — the project manifesto rendered via `Manifesto.astro`

### Activity section

`Activity.astro` is a compact KPI strip that client-side-fetches `https://docs.odio.love/stats.json` and links out to `https://docs.odio.love/community/activity/` for the full chart/table. The stats pipeline itself lives in the `odio-docs` repo — this site only consumes the published JSON, no local copy.

### Deployment

Deployed to Vercel as a static site.
