import type { ImageMetadata } from 'astro';
import { tours } from '../data/tours';
import { generateDepartures } from './departures';

// Deterministic PRNG (mulberry32) seeded from a string, so the same seed always
// produces the same sequence — this is what makes the assignment stable across
// requests/refreshes while still looking shuffled.
function seededRandom(seed: string) {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  let s = (h ^= h >>> 16) >>> 0;
  return function rand() {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seededShuffle<T>(items: T[], seed: string): T[] {
  const rand = seededRandom(seed);
  const arr = items.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const jungleCardKeysCache = new Map<string, string[]>();

// Every card that can ever be rendered for a jungle: one per tour variant (no
// departure), plus one per tour variant x departure date. Sorted so the resulting
// index is stable regardless of which page/order this runs in.
function getJungleCardKeys(jungleSlug: string): string[] {
  const cached = jungleCardKeysCache.get(jungleSlug);
  if (cached) return cached;

  const keys: string[] = [];
  tours
    .filter((t) => t.jungle === jungleSlug)
    .forEach((tour) => {
      keys.push(tour.slug);
      generateDepartures(tour).forEach((dep) => {
        keys.push(`${tour.slug}|${dep.dateSlug}`);
      });
    });
  keys.sort();

  jungleCardKeysCache.set(jungleSlug, keys);
  return keys;
}

const jungleShuffleCache = new Map<string, { pool: ImageMetadata[]; shuffled: ImageMetadata[] }>();

// Keyed by jungleSlug but invalidated whenever a different pool (by reference) is passed
// in for that jungle — different pages can legitimately pass different pools (e.g. a
// jungle-specific wildlife pool vs. a generic fallback) for the same jungle within one
// server lifetime, and reusing a shuffle sized for the wrong pool would index out of bounds.
function getJungleShuffle(pool: ImageMetadata[], jungleSlug: string): ImageMetadata[] {
  const cached = jungleShuffleCache.get(jungleSlug);
  if (cached && cached.pool === pool) return cached.shuffled;

  const shuffled = seededShuffle(pool, jungleSlug);
  jungleShuffleCache.set(jungleSlug, { pool, shuffled });
  return shuffled;
}

function preferredIndex(pool: ImageMetadata[], jungleSlug: string, cardKey: string): number {
  const keys = getJungleCardKeys(jungleSlug);
  const index = keys.indexOf(cardKey);
  return (index === -1 ? 0 : index) % pool.length;
}

/**
 * Stable (non-random on refresh) gallery image for a single tour card, guaranteed
 * not to repeat against any other card in the same jungle (as long as the jungle has
 * fewer cards than the pool has images). Use getBatchGalleryImages instead when a
 * page mixes cards from more than one jungle (e.g. "related tours" grids), since
 * this alone can't see across jungles to avoid a collision.
 */
export function getCardGalleryImage(
  pool: ImageMetadata[],
  jungleSlug: string,
  tourSlug: string,
  departureDateSlug?: string
): ImageMetadata {
  if (!pool.length) throw new Error('wildlife gallery pool is empty');
  const cardKey = departureDateSlug ? `${tourSlug}|${departureDateSlug}` : tourSlug;
  const shuffled = getJungleShuffle(pool, jungleSlug);
  return shuffled[preferredIndex(pool, jungleSlug, cardKey)];
}

export interface GalleryCardRef {
  jungleSlug: string;
  tourSlug: string;
  departureDateSlug?: string;
}

/**
 * Stable image assignment for a specific, ordered list of cards — guaranteed unique
 * within that list even when it mixes multiple jungles (e.g. a "you might also like"
 * grid). Each card still prefers its own deterministic per-jungle pick; on a
 * cross-jungle collision it deterministically walks forward in that jungle's shuffle
 * order until it finds an image not already used earlier in the same list.
 */
export function getBatchGalleryImages(pool: ImageMetadata[], cards: GalleryCardRef[]): ImageMetadata[] {
  if (!pool.length) throw new Error('wildlife gallery pool is empty');

  const used = new Set<ImageMetadata>();

  return cards.map((card) => {
    const cardKey = card.departureDateSlug ? `${card.tourSlug}|${card.departureDateSlug}` : card.tourSlug;
    const shuffled = getJungleShuffle(pool, card.jungleSlug);
    const start = preferredIndex(pool, card.jungleSlug, cardKey);

    let picked = shuffled[start];
    let step = 0;
    while (used.has(picked) && step < shuffled.length) {
      step += 1;
      picked = shuffled[(start + step) % shuffled.length];
    }

    used.add(picked);
    return picked;
  });
}
