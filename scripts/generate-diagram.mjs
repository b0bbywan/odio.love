import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { join, dirname } from 'path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const diagrams = [
  { src: 'src/architecture.dot',         out: 'public/architecture.svg' },
  { src: 'src/architecture-network.dot', out: 'public/architecture-network.svg' },
];

for (const { src, out } of diagrams) {
  const dot = readFileSync(join(root, src), 'utf8');
  console.log(`[diagram] Fetching SVG for ${src}...`);

  const res = await fetch('https://kroki.io/graphviz/svg', {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: dot,
  });

  if (!res.ok) {
    console.error(`[diagram] kroki.io error: ${res.status} ${res.statusText}`);
    process.exit(1);
  }

  const buf = await res.arrayBuffer();
  writeFileSync(join(root, out), Buffer.from(buf));
  console.log(`[diagram] ${out} generated.`);
}
