/**
 * Fails if a string that is meant to be assembled client-side ends up literal in
 * the build — or in the repo.
 *
 * Two links are deliberately never written out in full: the contact address
 * (Email.astro) and the Discord invite (Footer.astro). Both are reassembled at
 * runtime so a crawler reading the shipped files finds nothing to harvest.
 *
 * That is easy to break without noticing. A `'disc' + 'ord'` concatenation gets
 * folded back into a single literal by the minifier, so the source still looks
 * split while the bundle no longer is. And a public repo is scraped just like a
 * public site, so the tracked sources are checked as well — including this file,
 * which is why the needles below are assembled rather than written out.
 *
 *   npm run check:obfuscation
 */
import { execFileSync } from 'node:child_process';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const DIST = 'dist/client';

/** Never allowed to appear verbatim, in the build or in a tracked file. */
const FORBIDDEN = [
  { needle: ['contact', 'odio.love'].join('@'), what: 'the contact address (see Email.astro)' },
  { needle: ['disc', 'ord', '.gg'].join(''), what: 'the Discord invite host (see Footer.astro)' },
];

function walk(dir) {
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

function scan(files, label) {
  const hits = [];
  for (const file of files) {
    let content;
    try {
      content = readFileSync(file, 'utf8').toLowerCase();
    } catch {
      continue; // binary assets (images, fonts) can't hold a readable literal
    }
    for (const { needle, what } of FORBIDDEN) {
      if (content.includes(needle)) hits.push({ file, needle, what });
    }
  }
  for (const { file, needle, what } of hits) {
    console.error(`FAIL ${file} contains "${needle}" — ${what}`);
  }
  console.log(
    hits.length
      ? `${hits.length} literal(s) leaked into ${label}.`
      : `No harvestable literals in ${label} (${files.length} files checked).`,
  );
  return hits.length;
}

let built;
try {
  built = walk(DIST);
} catch {
  console.error(`[obfuscation] ${DIST} not found — run \`npm run build\` first.`);
  process.exit(1);
}

const tracked = execFileSync('git', ['ls-files', '-z'], { encoding: 'utf8' })
  .split('\0')
  .filter(Boolean);

const leaks = scan(built, 'the build') + scan(tracked, 'the tracked sources');

if (leaks) {
  console.error(
    '\n[obfuscation] Assemble the string at runtime in a way the minifier cannot ' +
      "fold back (e.g. ['a', 'b'].join('')).",
  );
  process.exit(1);
}
