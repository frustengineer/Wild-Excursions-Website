import type { ImageMetadata } from 'astro';
import { commonsPhotos } from './encyclopediaCredits';
import { tadobaGates, tadobaZones, penchGates } from './encyclopedia';
import leopardTree from '../../tour_images/indian-leopard-tree-tour.webp';
import leopardTree2 from '../../tour_images/indian-leopard-tree-tour-02.webp';
import dhole1 from '../../home_images/indian-wild-dog-dhole-01.webp';
import blackLeopard from '../../home_images/black-leopard-wildlife-01.webp';
import boarTiger from '../../home_images/wild-boar-and-bengal-tiger-01.webp';
import gaurLocal from '../../meta_ads/indian_gaur.webp';

export type Credit = { author: string; license: string; licenseUrl: string; source: string };
export type Photo = { key: string; src: ImageMetadata; alt: string; credit?: Credit };

const commonsFiles = import.meta.glob<ImageMetadata>('../assets/encyclopedia/*.webp', { eager: true, import: 'default' });
const galleryFiles = import.meta.glob<ImageMetadata>('../assets/wildlife-gallery/*.webp', { eager: true, import: 'default' });
const wg = (name: string) => galleryFiles[`../assets/wildlife-gallery/${name}.webp`];

/** Wild Excursions' own photographs — no external credit needed. */
const ownPhotos: Record<string, { src: ImageMetadata; alt: string }> = {
  'we-tiger-family': { src: wg('bengal-tiger-family-wildlife-gallery-02'), alt: 'Tigress walking down a forest road with two large cubs' },
  'we-tiger-walk': { src: wg('bengal-tiger-wildlife-gallery-01'), alt: 'Bengal tiger snarling as it walks a shaded forest track' },
  'we-tiger-log': { src: wg('bengal-tiger-wildlife-gallery-04'), alt: 'Bengal tiger stepping over a fallen log towards the camera' },
  'we-tiger-rest': { src: wg('bengal-tiger-wildlife-gallery-05'), alt: 'Young tiger lying on a forest path beside green undergrowth' },
  'we-tiger-cub': { src: wg('bengal-tiger-cub-wildlife-gallery-55'), alt: 'Tiger cub staring through green foliage' },
  'we-dhole': { src: wg('dhole-wildlife-gallery-54'), alt: 'Close portrait of a dhole crouched on the forest floor' },
  'we-langur': { src: wg('gray-langur-troop-wildlife-gallery-43'), alt: 'Grey langur troop sitting on a forest road' },
  'we-leopard': { src: wg('indian-leopard-wildlife-gallery-29'), alt: 'Indian leopard watching from behind leaves' },
  'we-leopard-drink': { src: wg('indian-leopard-wildlife-gallery-41'), alt: 'Indian leopard drinking from a rocky forest stream' },
  'we-leopard-tree': { src: leopardTree, alt: 'Indian leopard resting on a tree branch' },
  'we-leopard-tree-2': { src: leopardTree2, alt: 'Indian leopard draped over a tree limb' },
  'we-nilgai': { src: wg('nilgai-wildlife-gallery-19'), alt: 'Nilgai bull standing in a forest clearing' },
  'we-sambar': { src: wg('sambar-deer-wildlife-gallery-16'), alt: 'Sambar deer peering out from behind a tree trunk' },
  'we-sambar-sunset': { src: wg('sambar-deer-wildlife-gallery-57'), alt: 'Silhouette of a sambar stag against an orange sunset sky' },
  'we-chital': { src: wg('spotted-deer-wildlife-gallery-10'), alt: 'Chital standing in a green meadow' },
  'we-chital-stag': { src: wg('spotted-deer-wildlife-gallery-30'), alt: 'Chital stag with antlers in tall grass' },
  'we-dhole-2': { src: dhole1, alt: 'Dhole standing on a forest track' },
  'we-black-leopard': { src: blackLeopard, alt: 'Black (melanistic) leopard sitting at the forest edge' },
  'we-boar-tiger': { src: boarTiger, alt: 'Wild boar standing its ground as a Bengal tiger approaches across a meadow' },
  'we-gaur': { src: gaurLocal, alt: 'Indian gaur standing in forest near Tadoba' },
};

export function photo(key: string): Photo {
  const own = ownPhotos[key];
  if (own) return { key, ...own };
  const meta = commonsPhotos[key as keyof typeof commonsPhotos];
  const src = commonsFiles[`../assets/encyclopedia/${key}.webp`];
  if (!meta || !src) throw new Error(`Unknown encyclopedia photo: ${key}`);
  return { key, src, alt: meta.alt, credit: meta.credit };
}

const tigerPool = ['tadoba-tiger-stripes', 'tadoba-tigress-cub', 'tadoba-young-tigress', 'tadoba-radio-collar', 'tiger-maya-cubs'];
const tadobaPool = ['tadoba-lake', 'tadoba-bamboo-trail', 'tadoba-painted-storks', 'species-gaur-calf', 'tadoba-pandharpauni'];
const penchPool = ['pench-habitat', 'pench-forest', 'pench-dholes', 'pench-peacock', 'pench-sambar'];

const zoneSets: Record<string, string[]> = {
  'moharli-zone': ['gate-moharli', 'tiger-madhuri', 'tadoba-lake', 'gate-agarzari', 'tadoba-bamboo-road'],
  'kolara-zone': ['tadoba-young-tigress', 'tadoba-bamboo-trail', 'species-sambar', 'tadoba-tiger-stripes', 'species-sloth-bear-2'],
  'navegaon-zone': ['tadoba-radio-collar', 'tadoba-andhari-entry', 'species-nilgai-tadoba', 'tadoba-chital-lake', 'species-dhole-tadoba'],
  'pangdi-zari-zone': ['gate-zari-tiger', 'gate-zari-road', 'gate-zari-tiger-2', 'species-gaur-calf', 'tadoba-painted-storks'],
};
const gateSets: Record<string, string[]> = {
  moharli: ['gate-moharli'],
  khutwanda: ['gate-khutwanda'],
  agarzari: ['gate-agarzari', 'gate-agarzari-tiger'],
  zari: ['gate-zari-tiger', 'gate-zari-road'],
  pangdi: ['gate-zari-tiger-2'],
};
const tigerSets: Record<string, string[]> = {
  maya: ['tiger-maya', 'tiger-maya-cubs'],
  madhuri: ['tiger-madhuri'],
  sonam: ['tiger-sonam', 'tiger-sonam-cubs'],
  tara: ['tiger-tara'],
  matkasur: ['tiger-matkasur', 'tiger-matkasur-water'],
  waghdoh: ['tiger-waghdoh-cub'],
  'chhoti-tara': ['tiger-chhoti-tara-cub'],
};
/** Tigers whose own photo is not available under a free licence. */
export const tigersWithoutPortrait = new Set(['lara', 'madhu', 'chota-matka']);
/** Pages whose lead photo shows a cub of the named tiger, not the tiger itself. */
export const tigersShownByCub = new Set(['waghdoh', 'chhoti-tara']);

const penchRegionSets: Record<string, string[]> = {
  'madhya-pradesh': ['pench-karmajhiri-2', 'pench-reserve', 'pench-turia-chital', 'pench-forest', 'pench-turia-peacock', 'species-chital-pench'],
  maharashtra: ['pench-tiger', 'pench-sillari-gate', 'pench-habitat', 'pench-dholes', 'pench-roller', 'pench-sambar'],
};
const penchGateSets: Record<string, string[]> = {
  turia: ['pench-turia-chital', 'pench-turia-tiger', 'pench-turia-peacock'],
  karmajhiri: ['pench-karmajhiri-2', 'pench-karmajhiri'],
  sillari: ['pench-sillari-gate', 'pench-sillari-tiger'],
};
const speciesSets: Record<string, string[]> = {
  'bengal-tiger': ['we-tiger-log', 'tadoba-tigress-cub', 'we-tiger-family', 'pench-tiger', 'we-tiger-cub', 'tadoba-tiger-stripes'],
  'indian-leopard': ['we-leopard', 'we-black-leopard', 'we-leopard-drink', 'we-leopard-tree', 'we-leopard-tree-2'],
  dhole: ['pench-dholes', 'species-dhole-tadoba', 'we-dhole', 'we-dhole-2', 'tadoba-bamboo-trail'],
  'sloth-bear': ['species-sloth-bear', 'species-sloth-bear-2', 'tadoba-bamboo-road', 'tadoba-bamboo-trail', 'tadoba-lake'],
  gaur: ['species-gaur', 'species-gaur-calf', 'we-gaur', 'tadoba-bamboo-trail', 'pench-habitat'],
  sambar: ['species-sambar', 'pench-sambar', 'species-sambar-fight', 'we-sambar', 'we-sambar-sunset', 'tadoba-pandharpauni'],
  chital: ['species-chital-pench', 'tadoba-chital-lake', 'pench-turia-chital', 'we-chital', 'we-chital-stag'],
  nilgai: ['species-nilgai-tadoba', 'species-nilgai', 'we-nilgai', 'tadoba-andhari-entry', 'pench-forest'],
  'wild-boar': ['species-wild-boar', 'we-boar-tiger', 'species-wild-boar-tiger', 'pench-habitat', 'tadoba-bamboo-trail'],
  'mugger-crocodile': ['species-mugger', 'species-mugger-head', 'tadoba-lake-wide', 'tadoba-lake', 'tadoba-painted-storks'],
};

const fixed: Record<string, string[]> = {
  '/wildlife-encyclopedia/': ['tiger-maya', 'tadoba-lake', 'pench-habitat', 'species-sloth-bear', 'pench-dholes', 'tadoba-painted-storks', 'we-leopard', 'species-gaur'],
  '/tadoba/wildlife-encyclopedia/': ['tadoba-tigress-cub', 'tadoba-bamboo-trail', 'tadoba-lake', 'tadoba-entry-gate', 'tiger-matkasur', 'tadoba-painted-storks', 'species-gaur-calf', 'tadoba-pandharpauni'],
  '/pench/wildlife-encyclopedia/': ['pench-tiger', 'pench-habitat', 'pench-reserve', 'pench-dholes', 'pench-peacock', 'pench-sambar', 'pench-forest', 'pench-jackal'],
  '/tadoba/gates/': ['tadoba-entry-gate', 'gate-moharli', 'gate-agarzari', 'gate-khutwanda', 'gate-zari-road', 'tadoba-andhari-entry'],
  '/tadoba/famous-tigers/': ['tiger-maya-cubs', 'tiger-sonam', 'tiger-matkasur', 'tiger-madhuri', 'tiger-tara', 'tiger-maya'],
  '/pench/gates/': ['pench-sillari-gate', 'pench-karmajhiri-2', 'pench-turia-chital', 'pench-habitat', 'pench-reserve'],
  '/wildlife/': ['we-tiger-log', 'we-leopard', 'pench-dholes', 'species-sloth-bear', 'species-gaur', 'species-mugger', 'species-chital-pench', 'species-nilgai-tadoba'],
};

function keysForPath(path: string): string[] {
  if (fixed[path]) return fixed[path];
  const [, a, b, c] = path.split('/');
  if (a === 'tadoba' && b === 'gates' && c) {
    const gate = tadobaGates.find((g) => g.slug === c);
    const zone = tadobaZones.find((z) => gate && z.name.startsWith(gate.cluster));
    return [...(gateSets[c] ?? []), ...(zone ? zoneSets[zone.slug] : tadobaPool)];
  }
  if (a === 'tadoba' && b === 'famous-tigers' && c) return [...(tigerSets[c] ?? []), ...tigerPool];
  if (a === 'tadoba' && zoneSets[b]) return zoneSets[b];
  if (a === 'pench' && b === 'gates' && c) {
    const gate = penchGates.find((g) => g.slug === c);
    const region = gate?.state === 'Maharashtra' ? 'maharashtra' : 'madhya-pradesh';
    return [...(penchGateSets[c] ?? []), ...penchRegionSets[region]];
  }
  if (a === 'pench' && penchRegionSets[b]) return penchRegionSets[b];
  if (a === 'wildlife' && speciesSets[b]) return speciesSets[b];
  return a === 'pench' ? penchPool : tadobaPool;
}

/** Photos for an encyclopedia URL — at least five, de-duplicated, lead photo first. */
export function galleryForPath(path: string): Photo[] {
  const pool = path.startsWith('/pench/') ? penchPool : tadobaPool;
  const keys = [...new Set([...keysForPath(path), ...pool])];
  return keys.slice(0, Math.max(6, keysForPath(path).length)).map(photo);
}

const fallbackCovers = ['tadoba-bamboo-trail', 'tadoba-lake', 'tadoba-tiger-stripes', 'pench-habitat', 'tadoba-painted-storks', 'pench-forest', 'species-gaur-calf', 'tadoba-pandharpauni', 'we-tiger-walk'];
const isMapped = (path: string) => Boolean(fixed[path]) || /^\/(tadoba|pench|wildlife)\/.+/.test(path);

/** Lead photo for a card linking to `path`; unmapped pages get a varied fallback instead of one repeated photo. */
export function coverForPath(path: string): Photo {
  if (isMapped(path)) return galleryForPath(path)[0];
  const hash = [...path].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);
  return photo(fallbackCovers[hash % fallbackCovers.length]);
}
