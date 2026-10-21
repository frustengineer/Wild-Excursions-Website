// Writes dist/sitemap/index.html: a plain HTML list of every URL in the XML sitemaps, grouped by
// section, so every indexable page is at most two clicks from any page (the footer links here).
// Runs after `astro build`, when @astrojs/sitemap has already written the XML files.
import fs from 'node:fs';
import path from 'node:path';

const DIST = path.resolve('dist');
const SITE = 'https://wildexcursions.in';
const index = fs.readFileSync(path.join(DIST, 'sitemap-index.xml'), 'utf8');
const files = [...index.matchAll(/<loc>[^<]*\/(sitemap-[^<]+\.xml)<\/loc>/g)].map(([, f]) => f);
const urls = files.flatMap((f) => [...fs.readFileSync(path.join(DIST, f), 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, u]) => u));

const titleOf = (url) => {
  const file = path.join(DIST, new URL(url).pathname, 'index.html');
  const html = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
  const raw = (html.match(/<title>([^<]*)<\/title>/) || [])[1] || new URL(url).pathname;
  return raw.replace(/\s*[|·–-]\s*Wild Excursions\s*$/i, '').trim();
};

const groups = [
  ['Tour packages', (p) => p.startsWith('/tours/')],
  ['Tadoba guides', (p) => /^\/(tadoba|how-to-reach-tadoba|tadoba-|resorts-near-.*tadoba|best-.*tadoba|moharli|how-many-safaris-in-tadoba)/.test(p)],
  ['Pench guides', (p) => /^\/(pench|how-to-reach-pench|pench-|resorts-near-.*pench|best-.*pench|how-many-safaris-in-pench)/.test(p)],
  ['Wildlife and species', (p) => /^\/(wildlife|wildlife-encyclopedia)\//.test(p)],
  ['Blog', (p) => p.startsWith('/blogs/')],
  ['Planning guides', (p) => p.startsWith('/guides/') || p.startsWith('/tiger-safari-tours/')],
  ['India safari guides', () => true],
];
const grouped = new Map(groups.map(([name]) => [name, []]));
for (const url of urls) {
  const p = new URL(url).pathname;
  const [name] = groups.find(([, test]) => test(p));
  grouped.get(name).push({ url, title: titleOf(url) });
}

const esc = (s) => s.replace(/&(?!amp;|lt;|gt;|quot;|#)/g, '&amp;').replace(/</g, '&lt;');
const sections = [...grouped]
  .filter(([, items]) => items.length)
  .map(([name, items]) => `<section><h2>${name} <span>${items.length}</span></h2><ul>${items
    .sort((a, b) => a.title.localeCompare(b.title))
    .map((i) => `<li><a href="${new URL(i.url).pathname}">${esc(i.title)}</a></li>`)
    .join('')}</ul></section>`)
  .join('\n');

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Sitemap: All Pages | Wild Excursions</title>
<meta name="description" content="Every page on Wild Excursions: tiger safari tours, Tadoba and Pench guides, wildlife species, blog articles and India safari planning guides.">
<meta name="robots" content="index,follow">
<link rel="canonical" href="${SITE}/sitemap/">
<link rel="icon" href="/favicon.ico">
<style>
  :root{--gold:#fdcb08;--ink:#1d1f1a;--muted:#6f7065;--line:#e4ded0;--paper:#f6f3ec}
  *{box-sizing:border-box}body{margin:0;background:var(--paper);color:var(--ink);font:15px/1.6 Poppins,system-ui,-apple-system,'Segoe UI',Roboto,sans-serif}
  header{background:#16281d;color:#fff;padding:1.2rem 1rem}header a{color:var(--gold);font-weight:700;text-decoration:none}
  main{width:min(1180px,calc(100% - 2rem));margin:0 auto;padding:2rem 0 4rem}
  h1{margin:0 0 .4rem;font-size:clamp(1.8rem,4vw,2.4rem)}main>p{color:var(--muted);margin:0 0 2rem}
  section{margin-top:2rem}h2{font-size:1.2rem;margin:0 0 .8rem;padding-bottom:.4rem;border-bottom:2px solid var(--gold)}h2 span{font-size:.8rem;color:var(--muted);font-weight:600}
  ul{margin:0;padding:0;list-style:none;columns:3 260px;column-gap:2rem}li{break-inside:avoid;padding:.2rem 0}
  a{color:#4a3d00}a:hover{color:#000}
</style>
</head>
<body>
<header><a href="/">← Wild Excursions home</a></header>
<main>
<h1>Sitemap</h1>
<p>All ${urls.length} pages on Wild Excursions, grouped by section.</p>
${sections}
</main>
</body>
</html>
`;
fs.mkdirSync(path.join(DIST, 'sitemap'), { recursive: true });
fs.writeFileSync(path.join(DIST, 'sitemap', 'index.html'), html);
console.log(`html-sitemap: ${urls.length} URLs from ${files.length} sitemap file(s)`);
