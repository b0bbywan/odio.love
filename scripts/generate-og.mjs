import { execFileSync } from 'child_process';
import { existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { join, dirname } from 'path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const source = process.argv[2] ?? 'public/screenshots/embedded-ui.png';
const out = 'public/og-cover.png';
const bg = '#0a100a';
const innerSize = '1124x554';
const canvasSize = '1200x630';

const srcPath = join(root, source);
const outPath = join(root, out);

if (!existsSync(srcPath)) {
  console.error(`[og] Source not found: ${source}`);
  process.exit(1);
}

console.log(`[og] Composing ${out} from ${source}...`);

execFileSync(
  'magick',
  [
    '-size', canvasSize,
    `xc:${bg}`,
    '(', srcPath, '-resize', `${innerSize}^`, '-resize', innerSize, ')',
    '-gravity', 'center',
    '-composite',
    outPath,
  ],
  { stdio: 'inherit' }
);

console.log(`[og] ${out} generated (1200x630).`);
