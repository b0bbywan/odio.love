import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import astro from 'eslint-plugin-astro';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';

export default [
  { ignores: ['dist/', '.astro/', '.vercel/', 'node_modules/'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...astro.configs.recommended,
  ...svelte.configs.recommended,
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
  },
];
