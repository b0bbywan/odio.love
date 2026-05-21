import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { join, dirname } from 'path';

// The /install, /upgrade, /manifest.json ... routes are vercel redirects to
// GitHub release assets. A wrong asset name silently 404s (see odio-docs#33),
// so follow each redirect destination and require a 200.

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const { redirects = [] } = JSON.parse(readFileSync(join(root, 'vercel.json'), 'utf8'));

const results = await Promise.all(
  redirects.map(async ({ source, destination }) => {
    try {
      const res = await fetch(destination, { redirect: 'follow' });
      return { source, destination, status: res.status, ok: res.ok };
    } catch (err) {
      return { source, destination, status: err.message, ok: false };
    }
  }),
);

let failed = false;
for (const { source, destination, status, ok } of results) {
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${source} -> ${destination} (${status})`);
  if (!ok) failed = true;
}

if (failed) {
  console.error('\n[redirects] One or more redirect destinations did not resolve.');
  process.exit(1);
}
