import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://odio.love',
  integrations: [svelte(), mdx(), sitemap()],
  output: 'static',
  adapter: vercel(),
  // Emit scripts and stylesheets as external files instead of inlining them, so
  // the CSP header in vercel.json can stay `script-src 'self'` / `style-src 'self'`.
  // Astro still inlines its island hydration runtime; those few hashes are pinned
  // in vercel.json and guarded by `npm run csp:check`.
  build: { inlineStylesheets: 'never' },
  vite: {
    plugins: [tailwindcss()],
    build: { assetsInlineLimit: 0 },
  },
});
