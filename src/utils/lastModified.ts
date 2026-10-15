import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const cache = new Map<string, string | undefined>();

function gitDate(files: string[]): string | undefined {
  try {
    const out = execFileSync('git', ['log', '-1', '--format=%cs', '--', ...files], { encoding: 'utf8' }).trim();
    return out || undefined;
  } catch {
    return undefined;
  }
}

function pageSource(routePattern: string): string | undefined {
  const base = resolve('src/pages') + (routePattern === '/' ? '/index' : routePattern.replace(/\/$/, ''));
  return [`${base}.astro`, `${base}/index.astro`].find((file) => existsSync(file));
}

/** Content data the page imports from src/data, so data-driven routes date from their data. */
function dataImports(file: string): string[] {
  const source = readFileSync(file, 'utf8');
  return [...source.matchAll(/from\s+['"]([^'"]*\/data\/[^'"]+)['"]/g)]
    .map(([, spec]) => resolve(dirname(file), spec))
    .flatMap((path) => [path, `${path}.ts`, `${path}.json`])
    .filter((path) => existsSync(path) && !path.endsWith('authors.ts'));
}

/**
 * Last git commit date (YYYY-MM-DD) of the page's source file and the src/data files it imports.
 * Undefined when git is unavailable, so no date is invented.
 */
export function lastModified(routePattern: string): string | undefined {
  if (cache.has(routePattern)) return cache.get(routePattern);
  const file = pageSource(routePattern);
  const date = file ? gitDate([file, ...dataImports(file)]) : undefined;
  cache.set(routePattern, date);
  return date;
}
