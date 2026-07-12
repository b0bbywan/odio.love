import { describe, it, expect } from 'vitest';
import { existsSync } from 'node:fs';
import { checkCsp } from '../../scripts/csp.mjs';

/**
 * Vercel reads vercel.json before the build, so the CSP header (which pins the
 * hashes of Astro's inlined island runtime) has to be committed by hand via
 * `npm run csp:sync`. If it drifts from what the build actually emits, the
 * browser blocks those scripts and the homepage breaks in production.
 *
 * Requires a build to have run — skipped otherwise so `npm test` still works on
 * a clean checkout.
 */
describe('CSP header', () => {
  const built = existsSync('dist/client/index.html');

  it.skipIf(!built)('matches the inline scripts/styles in the build', async () => {
    const { ok, expected, actual } = await checkCsp();

    expect(
      ok,
      `vercel.json CSP has drifted from the build — run \`npm run csp:sync\`.\n\n` +
        `expected: ${expected}\n\nactual:   ${actual}\n`
    ).toBe(true);
  });
});
