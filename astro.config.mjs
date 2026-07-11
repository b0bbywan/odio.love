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
  // Astro hashes every inline <script>/<style> it emits and injects them into a
  // <meta http-equiv="content-security-policy">, so script-src/style-src stay
  // strict (no 'unsafe-inline') without hand-maintaining hashes.
  // Non-hashed directives are declared here; frame-ancestors is ignored in a
  // <meta> tag, so clickjacking is covered by the headers in vercel.json.
  security: {
    csp: {
      directives: [
        "default-src 'self'",
        "img-src 'self' data: https://my.home-assistant.io",
        "font-src 'self' data:",
        "connect-src 'self' https://api.github.com https://stats.odio.love",
        "object-src 'none'",
        "base-uri 'none'",
        "form-action 'none'",
        "upgrade-insecure-requests",
      ],
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
