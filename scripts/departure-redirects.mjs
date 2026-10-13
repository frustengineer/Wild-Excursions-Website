// Runs after `astro build`. Expired departure pages are built as meta-refresh redirect stubs;
// this swaps each stub for a real 301 in dist/_redirects, which is a stronger redirect signal
// for search engines. Departures that expire between deploys are handled in the browser.
import { readdir, readFile, rm, appendFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';

const dist = resolve('dist');
const toursDir = join(dist, 'tours');
const rules = [];

for (const jungle of await readdir(toursDir, { withFileTypes: true })) {
  if (!jungle.isDirectory()) continue;
  for (const tour of await readdir(join(toursDir, jungle.name), { withFileTypes: true })) {
    if (!tour.isDirectory()) continue;
    for (const departure of await readdir(join(toursDir, jungle.name, tour.name), { withFileTypes: true })) {
      if (!departure.isDirectory()) continue;
      const dir = join(toursDir, jungle.name, tour.name, departure.name);
      const html = await readFile(join(dir, 'index.html'), 'utf8').catch(() => '');
      const target = html.match(/<meta http-equiv="refresh" content="0;url=([^"]+)"/)?.[1];
      if (!target) continue;
      const from = `/tours/${jungle.name}/${tour.name}/${departure.name}`;
      rules.push(`${from}/  ${target}  301`, `${from}  ${target}  301`);
      await rm(dir, { recursive: true });
    }
  }
}

if (rules.length) await appendFile(join(dist, '_redirects'), `\n${rules.join('\n')}\n`);
console.log(`departure-redirects: ${rules.length / 2} expired departures now 301 to their tour page`);
