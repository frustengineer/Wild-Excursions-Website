import { parkGallery, activityImages, type GalleryImage } from './tadobaGallery';
import stayPlaceholder from '../../home_images/wild-excursions-jungle-resort.webp';
// CC0 — "Milky Way above trees 1 (Unsplash)" by Andy Schneider, via Wikimedia Commons (not shot at Pench)
import stargazing from '../../meta_ads/stargazing.webp';

/** Pench resort photos: drop .webp/.jpg/.png files into these folders and they appear
 *  automatically (sorted by filename). Luxury = the jungle camp near Turia gate:
 *  luxury/tent/ (tents, in and out) and luxury/image/ (camp grounds, dining, experiences). */
const luxuryTentModules = import.meta.glob('../../meta_ads/pench/luxury/tent/*.{webp,jpg,jpeg,png}', {
  eager: true,
  import: 'default',
}) as Record<string, ImageMetadata>;
const luxuryCampModules = import.meta.glob('../../meta_ads/pench/luxury/image/*.{webp,jpg,jpeg,png}', {
  eager: true,
  import: 'default',
}) as Record<string, ImageMetadata>;
// Semi-Luxury = the cottage resort near Turia gate: semi-luxury/deluxe cottage room/ and semi-luxury/property/
const semiCottageModules = import.meta.glob('../../meta_ads/pench/semi-luxury/deluxe cottage room/*.{webp,jpg,jpeg,png}', {
  eager: true,
  import: 'default',
}) as Record<string, ImageMetadata>;
const semiPropertyModules = import.meta.glob('../../meta_ads/pench/semi-luxury/property/*.{webp,jpg,jpeg,png}', {
  eager: true,
  import: 'default',
}) as Record<string, ImageMetadata>;
const sorted = (mods: Record<string, ImageMetadata>) =>
  Object.entries(mods)
    .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
    .map(([, image]) => image);
const pick = (mods: Record<string, ImageMetadata>, dir: string, n: string) =>
  mods[`../../meta_ads/pench/luxury/${dir}/pench-jungle-camp-turia-pench-${n}.webp`];

const luxuryTentPhotos = sorted(luxuryTentModules);
const luxuryCampPhotos = sorted(luxuryCampModules);
export const luxuryPhotos = [...luxuryTentPhotos, ...luxuryCampPhotos];
const semiCottagePhotos = sorted(semiCottageModules);
const semiPropertyPhotos = sorted(semiPropertyModules);
export const semiLuxuryPhotos = [...semiCottagePhotos, ...semiPropertyPhotos];

/** Hand-picked shots: hero = morning tea in the thatched gazebo, sunrise over the lake. */
export const luxuryHero = pick(luxuryCampModules, 'image', '28') ?? luxuryCampPhotos[0] ?? stayPlaceholder;
const tentCover = pick(luxuryTentModules, 'tent', '21') ?? luxuryTentPhotos[0] ?? stayPlaceholder;
const campCover = pick(luxuryCampModules, 'image', '26') ?? luxuryCampPhotos[0] ?? stayPlaceholder;
/** extra mobile hero slides */
export const luxuryTentExterior = tentCover;
export const luxuryTentInterior = pick(luxuryTentModules, 'tent', '13') ?? tentCover;
export const luxuryPoolDinner = campCover;
export const luxuryCover = tentCover;
const semiPick = (mods: Record<string, ImageMetadata>, dir: string, n: string) =>
  mods[`../../meta_ads/pench/semi-luxury/${dir}/soul-tree-turia-pench-${n}.webp`];
const semiCottageCover = semiPick(semiCottageModules, 'deluxe cottage room', '04') ?? semiCottagePhotos[0] ?? stayPlaceholder;
/** cottages above the lawn */
export const semiLuxuryCover = semiPick(semiPropertyModules, 'property', '13') ?? semiPropertyPhotos[0] ?? stayPlaceholder;

/** Park photos with location-neutral alt text (the shared set isn't Pench-specific).
 *  No boat safari at Pench, so those shots are dropped. */
const penchActivities: GalleryImage[] = [
  ...activityImages.filter((img) => !/boat safari/i.test(img.alt)),
  { src: stargazing, alt: 'Stargazing under the Milky Way above the forest canopy', category: 'Activities' },
];
export const penchGallery: GalleryImage[] = [...parkGallery, ...penchActivities].map((img) => ({
  ...img,
  alt: img.alt
    .replace('inside Tadoba National Park', 'inside the park')
    .replace(/ (in|of) Tadoba\b/g, '')
    .replace(/Tadoba['’]s /g, '')
    .replace(/Tadoba /g, ''),
}));

export interface StayGroup {
  key: string;
  tier: string;
  category: string;
  name: string;
  blurb: string;
  cover: ImageMetadata;
}

export interface StayImage {
  src: ImageMetadata;
  alt: string;
  groups: string[];
}

export interface StayTier {
  key: string;
  cat: string;
  name: string;
  blurb: string;
  cover: ImageMetadata;
  collections: string[];
}

const luxuryBlurb = 'Furnished safari tents with en-suite baths and private sit-outs, a pool, lakeside dining and a lounge — a jungle camp near Pench’s Turia gate.';
const semiLuxuryBlurb = 'AC deluxe cottages with private plunge pools, a large swimming pool, landscaped lawns, a multi-cuisine restaurant and a kids’ play area — near Pench’s Turia gate.';

export const stayGroups: StayGroup[] = [
  { key: 'luxury-tents', tier: 'luxury', category: 'Luxury', name: 'Luxury Tents', blurb: 'Furnished safari tents with en-suite baths, AC and private sit-outs looking into the forest.', cover: tentCover },
  { key: 'luxury-camp', tier: 'luxury', category: 'Luxury', name: 'Resort Ambiance', blurb: 'Pool, lakeside sit-outs, the dining hall, lounge and games room, and bush breakfasts on safari.', cover: campCover },
  { key: 'semi-cottages', tier: 'semi-luxury', category: 'Semi-Luxury', name: 'Deluxe Cottages', blurb: 'AC cottages with vaulted ceilings, a private plunge pool and a sit-out deck.', cover: semiCottageCover },
  { key: 'semi-property', tier: 'semi-luxury', category: 'Semi-Luxury', name: 'Resort Ambiance', blurb: 'Swimming pool, lawns, the restaurant and a kids’ play area.', cover: semiLuxuryCover },
];

export const stayImages: StayImage[] = [
  ...luxuryTentPhotos.map((src, i) => ({ src, alt: `Luxury safari tent at a jungle camp near Pench’s Turia gate (photo ${i + 1})`, groups: ['luxury-tents'] })),
  ...luxuryCampPhotos.map((src, i) => ({ src, alt: `Grounds, dining and experiences at a luxury jungle camp near Pench (photo ${i + 1})`, groups: ['luxury-camp'] })),
  ...semiCottagePhotos.map((src, i) => ({ src, alt: `Deluxe cottage with a private plunge pool at a resort near Pench’s Turia gate (photo ${i + 1})`, groups: ['semi-cottages'] })),
  ...semiPropertyPhotos.map((src, i) => ({ src, alt: `Pool, lawns and dining at a semi-luxury resort near Pench (photo ${i + 1})`, groups: ['semi-property'] })),
];

export const stayGroupImageCount = (key: string) =>
  stayImages.filter((i) => i.groups.includes(key)).length;

export const stayTiers: StayTier[] = [
  { key: 'luxury', cat: 'Luxury', name: 'Luxury', blurb: luxuryBlurb, cover: luxuryCover, collections: ['luxury-tents', 'luxury-camp'] },
  { key: 'semi-luxury', cat: 'Semi-Luxury', name: 'Semi-Luxury', blurb: semiLuxuryBlurb, cover: semiLuxuryCover, collections: ['semi-cottages', 'semi-property'] },
];

export const stayTierPhotoCount = (t: StayTier) =>
  t.collections.reduce((n, k) => n + stayGroupImageCount(k), 0);

export const penchGalleryCounts = {
  all: penchGallery.length + stayImages.length,
  Destination: penchGallery.filter((i) => i.category === 'Destination').length,
  Activities: penchGallery.filter((i) => i.category === 'Activities').length,
  Stay: stayImages.length,
};
