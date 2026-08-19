/**
 * Fails if a string that is meant to be assembled client-side ends up literal in
 * the build.
 *
 * Two links are deliberately never written out in full: the contact address
 * (Email.astro) and the Discord invite (Footer.astro). Both are reassembled at
 * runtime so a crawler reading the shipped files finds nothing to harvest.
 *
 * That is easy to break without noticing — a `'disc' + 'ord'` concatenation, for
 * instance, gets folded back into a single literal by the minifier, so the
 * source still looks split while the bundle no longer is. This check reads what
 * actually ships.
 *
 *   npm run check:obfuscation
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const DIST = 'dist/client';

/** Never allowed to appear verbatim in any shipped file. */
const FORBIDDEN = [
  { needle: 'contact@odio.love', what: 'the contact address (see Email.astro)' },
  { needle: 'discord.gg', what: 'the Discord invite host (see Footer.astro)' },
];

function walk(dir) {
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

let files;
try {
  files = walk(DIST);
} catch {
  console.error(`[obfuscation] ${DIST} not found — run \`npm run build\` first.`);
  process.exit(1);
}

const hits = [];
for (const file of files) {
  let content;
  try {
    content = readFileSync(file, 'utf8');
  } catch {
    continue; // binary assets (images, fonts) can't hold a readable literal
  }
  const lower = content.toLowerCase();
  for (const { needle, what } of FORBIDDEN) {
    if (lower.includes(needle)) hits.push({ file, needle, what });
  }
}

for (const { file, needle, what } of hits) {
  console.error(`FAIL ${file} contains "${needle}" — ${what}`);
}

if (hits.length) {
  console.error(
    `\n[obfuscation] ${hits.length} literal(s) leaked into ${DIST}. ` +
      'Assemble the string at runtime in a way the minifier cannot fold back ' +
      "(e.g. ['a', 'b'].join('')).",
  );
  process.exit(1);
}

console.log(`No harvestable literals in ${DIST} (${files.length} files checked).`);
