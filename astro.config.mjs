import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

const isBeta = process.env.PUBLIC_BETA === 'true';

export default defineConfig({
  site: isBeta ? 'https://beta.odio.love' : 'https://odio.love',
integrations: [svelte(), mdx(), ...(isBeta ? [] : [sitemap()])],
  output: 'static',
  vite: {
    plugins: [tailwindcss()],
  },
});
