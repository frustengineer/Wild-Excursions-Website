// Copy-overlap check against the offline competitor mirror (docs/seo/CONTENT_GAP_PLAN.md §6.7).
// Usage: node scripts/overlap-check.mjs <route> [<route> ...]   e.g. /best-places-to-see-tigers-in-india/
// Builds 8-word shingles from dist/<route>/index.html and fails if more than 2% of them
// appear in any single competitor page.
import fs from 'node:fs';
import path from 'node:path';

const MIRROR = path.resolve('../pugdundeesafaris_copy/www.pugdundeesafaris.com');
const SIZE = 8;
const LIMIT = 0.02;

const text = (html) => html
  .replace(/<(script|style|nav|footer|header)[\s\S]*?<\/\1>/gi, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&[a-z#0-9]+;/gi, ' ')
  .toLowerCase()
  .replace(/[^a-z0-9\s]/g, ' ')
  .split(/\s+/)
  .filter(Boolean);

const shingles = (words) => {
  const set = new Set();
  for (let i = 0; i + SIZE <= words.length; i++) set.add(words.slice(i, i + SIZE).join(' '));
  return set;
};

const competitorFiles = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
  const full = path.join(dir, entry.name);
  if (entry.isDirectory()) return competitorFiles(full);
  return entry.name.endsWith('.html') ? [full] : [];
});

const routes = process.argv.slice(2);
if (!routes.length) {
  console.error('Usage: node scripts/overlap-check.mjs <route> [...]');
  process.exit(2);
}
if (!fs.existsSync(MIRROR)) {
  console.error(`Competitor mirror not found at ${MIRROR}`);
  process.exit(2);
}

const competitors = competitorFiles(MIRROR).map((file) => ({ file, set: shingles(text(fs.readFileSync(file, 'utf8'))) }));
let failed = false;

for (const route of routes) {
  const file = path.resolve('dist', route.replace(/^\/|\/$/g, ''), 'index.html');
  if (!fs.existsSync(file)) {
    console.error(`✗ ${route}: ${file} not found (run npm run build first)`);
    failed = true;
    continue;
  }
  const html = fs.readFileSync(file, 'utf8');
  const main = (html.match(/<main[\s\S]*<\/main>/i) || [html])[0];
  const ours = shingles(text(main));
  let worst = { share: 0, file: '' };
  for (const competitor of competitors) {
    let hits = 0;
    for (const shingle of ours) if (competitor.set.has(shingle)) hits++;
    const share = ours.size ? hits / ours.size : 0;
    if (share > worst.share) worst = { share, file: competitor.file };
  }
  const pct = (worst.share * 100).toFixed(2);
  const ok = worst.share <= LIMIT;
  if (!ok) failed = true;
  console.log(`${ok ? '✓' : '✗'} ${route}: ${pct}% max overlap${worst.file ? ` (${path.relative(MIRROR, worst.file)})` : ''}`);
}

process.exit(failed ? 1 : 0);
