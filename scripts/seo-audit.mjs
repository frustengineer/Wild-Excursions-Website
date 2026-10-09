import { readdir, readFile } from 'node:fs/promises';
import { join, relative, resolve, sep } from 'node:path';

const distRoot = resolve('dist');

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.map((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  }));
  return files.flat();
}

function match(html, pattern) {
  return html.match(pattern)?.[1]?.trim() ?? '';
}

function routeFor(file) {
  const path = relative(distRoot, file).split(sep).join('/');
  if (path === 'index.html') return '/';
  return `/${path.replace(/index\.html$/, '')}`;
}

const files = (await walk(distRoot)).filter((file) => file.endsWith('.html'));
const pages = [];

for (const file of files) {
  const html = await readFile(file, 'utf8');
  const robots = match(html, /<meta\s+name=["']robots["']\s+content=["']([^"']*)["']/i);
  pages.push({
    route: routeFor(file),
    title: match(html, /<title>([\s\S]*?)<\/title>/i),
    description: match(html, /<meta\s+name="description"\s+content="([^"]*)"/i),
    canonical: match(html, /<link\s+rel="canonical"\s+href="([^"]*)"/i),
    robots,
    noindex: /\bnoindex\b/i.test(robots),
    h1Count: (html.match(/<h1(?:\s|>)/gi) ?? []).length,
  });
}

const indexable = pages.filter((page) => !page.noindex);
const errors = [];
const warnings = [];

for (const page of indexable) {
  if (!page.title) errors.push(`${page.route}: missing title`);
  if (!page.description) errors.push(`${page.route}: missing meta description`);
  if (!page.canonical) errors.push(`${page.route}: missing canonical URL`);
  if (page.h1Count !== 1) errors.push(`${page.route}: expected one H1, found ${page.h1Count}`);
  if (page.title.length > 70) warnings.push(`${page.route}: long title (${page.title.length} characters)`);
  if (page.description && page.description.length < 70) warnings.push(`${page.route}: short description (${page.description.length} characters)`);
  if (page.description.length > 180) warnings.push(`${page.route}: long description (${page.description.length} characters)`);
}

for (const [field, label] of [['title', 'title'], ['canonical', 'canonical URL']]) {
  const grouped = new Map();
  for (const page of indexable) {
    if (!page[field]) continue;
    const routes = grouped.get(page[field]) ?? [];
    routes.push(page.route);
    grouped.set(page[field], routes);
  }
  for (const [value, routes] of grouped) {
    if (routes.length > 1) errors.push(`duplicate ${label}: ${value} -> ${routes.join(', ')}`);
  }
}

const sitemapFiles = (await walk(distRoot)).filter((file) => /sitemap-\d+\.xml$/.test(file));
const sitemapUrls = new Set();
for (const file of sitemapFiles) {
  const xml = await readFile(file, 'utf8');
  for (const result of xml.matchAll(/<loc>(.*?)<\/loc>/g)) sitemapUrls.add(new URL(result[1]).pathname);
}
for (const page of pages.filter((candidate) => candidate.noindex)) {
  if (sitemapUrls.has(page.route)) errors.push(`${page.route}: noindex URL appears in sitemap`);
}

console.log(`SEO audit: ${pages.length} HTML pages, ${indexable.length} indexable, ${sitemapUrls.size} sitemap URLs.`);
if (warnings.length) {
  console.log(`\nWarnings (${warnings.length}):`);
  warnings.slice(0, 30).forEach((warning) => console.log(`- ${warning}`));
  if (warnings.length > 30) console.log(`- ...and ${warnings.length - 30} more`);
}
if (errors.length) {
  console.error(`\nErrors (${errors.length}):`);
  errors.slice(0, 50).forEach((error) => console.error(`- ${error}`));
  if (errors.length > 50) console.error(`- ...and ${errors.length - 50} more`);
  process.exitCode = 1;
} else {
  console.log('\nNo blocking SEO errors found.');
}
