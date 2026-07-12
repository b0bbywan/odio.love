/**
 * Builds the Content-Security-Policy header value from the built site and keeps
 * vercel.json in sync with it.
 *
 * Vercel reads vercel.json from the repo *before* running the build, so the CSP
 * header cannot be generated at build time — it has to be committed. Almost
 * everything is emitted as external files (see astro.config.mjs), but Astro
 * inlines its island hydration runtime, and those fragments need hashes.
 *
 *   npm run csp:sync    rewrite the CSP header in vercel.json from dist/
 *   npm run csp:check   fail if vercel.json has drifted from dist/ (used by tests)
 *
 * The hashes only change when Astro's island runtime changes (i.e. on an Astro
 * upgrade), not when you edit your own components.
 */
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { readdir } from 'node:fs/promises';
import { join } from 'node:path';

const DIST = 'dist/client';
const VERCEL_JSON = 'vercel.json';

/** Origins the site talks to. Add new ones here. */
const DIRECTIVES = {
  'default-src': ["'self'"],
  'script-src': ["'self'"], // + inline hashes discovered below
  'style-src': ["'self'"], // + inline hashes discovered below
  'img-src': ["'self'", 'data:', 'https://my.home-assistant.io'],
  'font-src': ["'self'", 'data:'], // @fontsource emits base64 data: fonts
  'connect-src': ["'self'", 'https://api.github.com', 'https://stats.odio.love'],
  'object-src': ["'none'"],
  'base-uri': ["'none'"],
  'form-action': ["'none'"],
  'frame-ancestors': ["'none'"],
  'upgrade-insecure-requests': [],
};

async function htmlFiles(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await htmlFiles(path)));
    else if (entry.name.endsWith('.html')) out.push(path);
  }
  return out;
}

const sha256 = (content) =>
  `'sha256-${createHash('sha256').update(content, 'utf8').digest('base64')}'`;

/** Collect hashes of every inline <script>/<style> across all built pages. */
async function collectHashes() {
  const scripts = new Set();
  const styles = new Set();

  for (const file of await htmlFiles(DIST)) {
    const html = readFileSync(file, 'utf8');

    for (const [, attrs, body] of html.matchAll(
      /<script([^>]*)>([\s\S]*?)<\/script\b[^>]*>/gi
    )) {
      // Skip external scripts, and JSON-LD data blocks (never executed, so CSP
      // does not apply to them).
      if (/\ssrc=/.test(attrs) || /application\/ld\+json/.test(attrs)) continue;
      if (body.trim()) scripts.add(sha256(body));
    }

    for (const [, body] of html.matchAll(/<style[^>]*>([\s\S]*?)<\/style\s*>/g)) {
      if (body.trim()) styles.add(sha256(body));
    }
  }
  return { scripts: [...scripts].sort(), styles: [...styles].sort() };
}

async function buildPolicy() {
  const { scripts, styles } = await collectHashes();
  const directives = { ...DIRECTIVES };
  directives['script-src'] = [...directives['script-src'], ...scripts];
  directives['style-src'] = [...directives['style-src'], ...styles];

  return Object.entries(directives)
    .map(([name, values]) => (values.length ? `${name} ${values.join(' ')}` : name))
    .join('; ');
}

function readVercelCsp(config) {
  const header = config.headers
    ?.flatMap((rule) => rule.headers)
    .find((h) => h.key === 'Content-Security-Policy');
  if (!header) throw new Error('No Content-Security-Policy header in vercel.json');
  return header;
}

export async function checkCsp() {
  const expected = await buildPolicy();
  const config = JSON.parse(readFileSync(VERCEL_JSON, 'utf8'));
  const actual = readVercelCsp(config).value;
  return { ok: actual === expected, expected, actual };
}

async function main() {
  const mode = process.argv[2];
  const { ok, expected, actual } = await checkCsp();

  if (mode === '--check') {
    if (ok) {
      console.log('CSP in vercel.json matches the build.');
      return;
    }
    console.error('CSP in vercel.json has drifted from the build.\n');
    console.error(`  expected: ${expected}\n`);
    console.error(`  actual:   ${actual}\n`);
    console.error('Run `npm run csp:sync` and commit vercel.json.');
    process.exit(1);
  }

  if (ok) {
    console.log('CSP already up to date.');
    return;
  }
  const config = JSON.parse(readFileSync(VERCEL_JSON, 'utf8'));
  readVercelCsp(config).value = expected;
  writeFileSync(VERCEL_JSON, JSON.stringify(config, null, 2) + '\n');
  console.log(`CSP synced into ${VERCEL_JSON}:\n\n  ${expected}\n`);
}

// Only run as a CLI, so tests can import checkCsp().
if (process.argv[1]?.endsWith('csp.mjs')) await main();
