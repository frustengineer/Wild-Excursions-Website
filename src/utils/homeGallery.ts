import type { ImageMetadata } from 'astro';

const homeImageModules = import.meta.glob<{ default: ImageMetadata }>(
  '../../home_images/*.{jpg,jpeg,png,webp,avif}',
  { eager: true }
);

const homeImages: Record<string, ImageMetadata> = Object.fromEntries(
  Object.entries(homeImageModules).map(([path, mod]) => [path.split('/').pop()!.replace(/\.[^.]+$/, ''), mod.default])
);

const wildlifeGalleryModules = import.meta.glob<{ default: ImageMetadata }>(
  '../assets/wildlife-gallery/*.{jpg,jpeg,png,webp,avif}',
  { eager: true }
);

const wildlifeGalleryImages: Record<string, ImageMetadata> = Object.fromEntries(
  Object.entries(wildlifeGalleryModules).map(([path, mod]) => [path.split('/').pop()!.replace(/\.[^.]+$/, ''), mod.default])
);

const tourJungleModules = import.meta.glob<{ default: ImageMetadata }>(
  '../../tour_jungle/*.{jpg,jpeg,png,webp,avif}',
  { eager: true }
);

const tourJungleImages: Record<string, ImageMetadata> = Object.fromEntries(
  Object.entries(tourJungleModules).map(([path, mod]) => [path.split('/').pop()!.replace(/\.[^.]+$/, ''), mod.default])
);

export const homepageGalleryNamesByJungle: Record<string, string[]> = {
  tadoba: ['bengal-tiger-wildlife-17', 'bengal-tiger-wildlife-05', 'bengal-tiger-wildlife-09'],
  tipeshwar: ['bengal-tiger-wildlife-35', 'bengal-tiger-wildlife-36', 'bengal-tiger-wildlife-37'],
  nagzira: ['bengal-tiger-wildlife-27', 'rhesus-macaque-wildlife-01', 'wild-excursions-safari-activity'],
  'umred-karhandla': ['bengal-tiger-wildlife-32', 'indian-leopard-wildlife-06', 'ruddy-shelduck-waterbird-01'],
  pench: ['indian-leopard-wildlife-04', 'honey-badger-wildlife-01', 'sloth-bear-wildlife-01'],
  kanha: ['bengal-tiger-wildlife-25', 'bengal-tiger-wildlife-26', 'spotted-deer-forest-01'],
  bandhavgarh: ['bengal-tiger-wildlife-01', 'bengal-tiger-wildlife-02', 'bengal-tiger-wildlife-03'],
  satpura: ['sloth-bear-and-bengal-tiger-01', 'indian-giant-squirrel-01', 'bengal-tiger-wildlife-31'],
  panna: ['indian-leopard-wildlife-07', 'indian-leopard-wildlife-02', 'bengal-tiger-wildlife-28'],
  ranthambore: ['bengal-tiger-wildlife-34', 'sambar-deer-at-night-01', 'bengal-tiger-wildlife-29'],
  kaziranga: ['rare-golden-bengal-tiger-01', 'asian-elephant-wildlife-07', 'one-horned-rhinoceros-wildlife-05'],
  'jim-corbett': ['asian-elephant-wildlife-06', 'bengal-tiger-wildlife-24', 'bengal-tiger-wildlife-30'],
  gir: ['asiatic-lion-wildlife-01', 'asiatic-lion-cub-wildlife-01', 'asiatic-lion-cub-wildlife-02'],
};

// The only images we can honestly say were taken in a given jungle — used anywhere
// a gallery needs to stay jungle-specific rather than pulling from the general
// cross-jungle wildlife pool.
export function getJungleHomeImages(jungleSlug: string): ImageMetadata[] {
  return (homepageGalleryNamesByJungle[jungleSlug] ?? [])
    .map((name) => homeImages[name])
    .filter((img): img is ImageMetadata => Boolean(img));
}

// Every close-up, single-species wildlife photo we actually have in home_images,
// verified by eye rather than trusted from filenames (several *-tiger-reserve-safari-*
// files turned out not to contain tigers at all).
const SPECIES_IMAGES: Record<string, string[]> = {
  tiger: [
    'bengal-tiger-wildlife-25', 'bengal-tiger-wildlife-26',
    'bengal-tiger-wildlife-29', 'bengal-tiger-wildlife-37',
    'bengal-tiger-wildlife-28', 'bengal-tiger-wildlife-01',
    'bengal-tiger-wildlife-02', 'bengal-tiger-wildlife-03',
    'bengal-tiger-wildlife-14', 'bengal-tiger-wildlife-20', 'bengal-tiger-wildlife-32',
    'bengal-tiger-wildlife-34',
    'bengal-tiger-wildlife-17', 'bengal-tiger-wildlife-05', 'bengal-tiger-wildlife-38',
    'bengal-tiger-wildlife-31', 'bengal-tiger-wildlife-35',
    'bengal-tiger-wildlife-36', 'bengal-tiger-wildlife-33',
    'bengal-tiger-wildlife-07', 'bengal-tiger-wildlife-22', 'bengal-tiger-wildlife-16',
    'bengal-tiger-wildlife-15', 'bengal-tiger-wildlife-08', 'bengal-tiger-wildlife-11',
    'bengal-tiger-wildlife-09', 'bengal-tiger-wildlife-06', 'bengal-tiger-wildlife-10',
    'bengal-tiger-wildlife-21', 'bengal-tiger-wildlife-24',
    'bengal-tiger-wildlife-04', 'bengal-tiger-wildlife-27',
  ],
  // The golden (pseudo-melanistic) color morph is only documented at Kaziranga — kept
  // separate from the regular tiger pool so it never shows up representing another park.
  goldenTiger: ['rare-golden-bengal-tiger-01'],
  slothBearTiger: ['sloth-bear-and-bengal-tiger-01'],
  // 01, 03, and 06 were removed after visual verification: 01 is actually an Indian palm
  // squirrel, 03 is a branded "Pench National Park" poster card (not a plain photo), and 06
  // is a tiger cub — none of them a leopard despite the filename.
  leopard: [
    'indian-leopard-wildlife-07', 'indian-leopard-wildlife-04', 'indian-leopard-wildlife-02',
    'indian-leopard-wildlife-05',
  ],
  rhino: [
    'one-horned-rhinoceros-wildlife-05', 'one-horned-rhinoceros-wildlife-01',
    'one-horned-rhinoceros-wildlife-03', 'one-horned-rhinoceros-wildlife-02', 'one-horned-rhinoceros-wildlife-04',
  ],
  elephant: [
    'asian-elephant-wildlife-07', 'asian-elephant-wildlife-01', 'asian-elephant-wildlife-03', 'asian-elephant-wildlife-05',
    'asian-elephant-wildlife-04', 'asian-elephant-wildlife-02', 'asian-elephant-wildlife-08',
    'asian-elephant-wildlife-06',
  ],
  macaque: [
    'rhesus-macaque-wildlife-01', 'rhesus-macaque-wildlife-04',
    'rhesus-macaque-wildlife-02', 'rhesus-macaque-wildlife-06', 'rhesus-macaque-wildlife-03', 'rhesus-macaque-wildlife-05',
  ],
  owl: ['indian-eagle-owl-01'],
  dhole: ['indian-wild-dog-dhole-01', 'indian-wild-dog-dhole-02'],
  honeyBadger: ['honey-badger-wildlife-01'],
  // Yellow-throated martens are a Himalayan-foothill/Terai species — Corbett, not Ranthambore,
  // despite the source filename.
  marten: ['yellow-throated-marten-wildlife-01'],
  giantSquirrel: ['indian-giant-squirrel-01'],
  deer: ['sambar-deer-at-night-01', 'sambar-deer-wildlife-01', 'spotted-deer-forest-01', 'spotted-deer-wildlife-01', 'spotted-deer-wetland-01'],
  slothBear: ['sloth-bear-wildlife-01'],
  slothBearDhole: ['sloth-bear-and-dhole-01'],
  wildBuffalo: ['wild-water-buffalo-01'],
  sarusCrane: ['sarus-crane-wildlife-02', 'sarus-crane-wildlife-03', 'sarus-crane-wildlife-01'],
  peacock: ['indian-peacock-wildlife-01', 'indian-peacock-wildlife-02'],
  munia: ['red-munia-bird-01'],
  paintedStork: ['painted-stork-wetland-bird-01'],
  treepie: ['rufous-treepie-bird-01', 'rufous-treepie-bird-02'],
  shelduck: ['ruddy-shelduck-waterbird-01'],
  beeEater: ['green-bee-eater-bird-01'],
  dragonfly: ['dragonfly-wildlife-macro-01'],
  // Gir is the world's only wild home of the Asiatic lion — kept as its own species,
  // never mixed into the tiger/leopard pools of any other jungle.
  lion: ['asiatic-lion-wildlife-01', 'asiatic-lion-cub-wildlife-01', 'asiatic-lion-cub-wildlife-02'],
};

const SPECIES_ALT: Record<string, string> = {
  tiger: 'Bengal tiger in the wild',
  lion: 'Asiatic lion of Gir',
  slothBearTiger: 'Sloth bear and Bengal tiger habitat',
  goldenTiger: 'Rare golden tiger of Kaziranga',
  leopard: 'Leopard in the wild',
  rhino: 'One-horned rhinoceros',
  elephant: 'Asian elephant',
  macaque: 'Rhesus macaque',
  owl: 'Owl in the forest',
  dhole: 'Indian wild dog (dhole)',
  honeyBadger: 'Honey badger',
  marten: 'Yellow-throated marten',
  giantSquirrel: 'Indian giant squirrel',
  deer: 'Deer in the forest',
  slothBear: 'Sloth bear in the wild',
  slothBearDhole: 'Sloth bear and Indian wild dog',
  wildBuffalo: 'Wild water buffalo',
  sarusCrane: 'Sarus crane',
  peacock: 'Indian peacock',
  munia: 'Munia bird',
  paintedStork: 'Painted stork',
  treepie: 'Rufous treepie',
  shelduck: 'Ruddy shelduck',
  beeEater: 'Green bee-eater',
  dragonfly: 'Dragonfly',
};

const ALL_JUNGLES = [
  'tadoba', 'tipeshwar', 'nagzira', 'kanha', 'bandhavgarh', 'pench', 'satpura',
  'panna', 'ranthambore', 'jim-corbett', 'umred-karhandla', 'kaziranga',
  'dudhwa', 'kishanpur', 'pilibhit', 'rajaji', 'gir', 'manas',
  'sunderban', 'jhalana', 'jawai-bera', 'bor', 'sanjay-dubri', 'bandipur',
];

// The original 10 central-Indian dry-deciduous reserves plus Dudhwa/Kishanpur/Pilibhit/Rajaji
// (Terai/foothill, tiger+leopard present) and Sunderban/Bor/Sanjay Dubri/Bandipur — every park
// with a genuine, jeep- or boat-visible tiger population.
const TIGER_JUNGLES = [
  'tadoba', 'tipeshwar', 'nagzira', 'kanha', 'bandhavgarh', 'pench', 'satpura', 'panna', 'ranthambore',
  'jim-corbett', 'umred-karhandla', 'dudhwa', 'kishanpur', 'pilibhit', 'rajaji', 'sunderban', 'bor', 'sanjay-dubri', 'bandipur',
];
// Same central/Terai belt, plus Gir (leopards coexist with lions there) and the two
// leopard-specific Rajasthan parks (Jhalana, Jawai Bera — no tigers at either). Sunderban is
// excluded — leopards aren't part of the mangrove delta's fauna, unlike its tigers.
const LEOPARD_JUNGLES = [
  'tadoba', 'tipeshwar', 'nagzira', 'kanha', 'bandhavgarh', 'pench', 'satpura', 'panna', 'ranthambore',
  'jim-corbett', 'umred-karhandla', 'dudhwa', 'kishanpur', 'pilibhit', 'rajaji', 'gir', 'bor', 'sanjay-dubri',
  'jhalana', 'jawai-bera', 'bandipur',
];
// Rhesus macaque range covers the tiger/leopard belt but not Gir (langurs, not macaques, are
// Gir's primate), the Assam wetland parks (different macaque species there), or the mangrove
// delta / rocky-hill leopard parks where they're not a marketed sighting.
const MACAQUE_JUNGLES = ALL_JUNGLES.filter((j) => !['kaziranga', 'manas', 'gir', 'sunderban', 'jhalana', 'jawai-bera'].includes(j));
const DHOLE_JUNGLES = ['tadoba', 'tipeshwar', 'nagzira', 'kanha', 'bandhavgarh', 'pench', 'satpura', 'umred-karhandla', 'bandipur'];
const HONEY_BADGER_JUNGLES = ['tadoba', 'tipeshwar', 'nagzira', 'kanha', 'bandhavgarh', 'pench', 'satpura', 'panna', 'ranthambore', 'jim-corbett', 'umred-karhandla', 'bor', 'sanjay-dubri'];
const DEER_JUNGLES = ALL_JUNGLES.filter((j) => j !== 'sunderban');
const SLOTH_BEAR_JUNGLES = ['tadoba', 'tipeshwar', 'nagzira', 'kanha', 'bandhavgarh', 'pench', 'satpura', 'panna', 'ranthambore', 'umred-karhandla', 'gir', 'bor', 'sanjay-dubri', 'bandipur'];
const PEACOCK_JUNGLES = ALL_JUNGLES.filter((j) => !['kaziranga', 'manas', 'sunderban'].includes(j));
const WETLAND_ADJACENT_JUNGLES = ['tadoba', 'satpura', 'panna', 'ranthambore', 'jawai-bera'];

// Which jungles it's honest to show each species for. Kept conservative — species are
// only listed for parks where they're a documented, expected sighting.
const SPECIES_JUNGLES: Record<string, string[]> = {
  tiger: TIGER_JUNGLES,
  slothBearTiger: TIGER_JUNGLES.filter((j) => SLOTH_BEAR_JUNGLES.includes(j)),
  goldenTiger: ['kaziranga'],
  leopard: LEOPARD_JUNGLES,
  rhino: ['kaziranga', 'manas'],
  elephant: ['jim-corbett', 'kaziranga', 'rajaji', 'manas', 'dudhwa', 'bandipur'],
  macaque: MACAQUE_JUNGLES,
  owl: ALL_JUNGLES,
  dhole: DHOLE_JUNGLES,
  honeyBadger: HONEY_BADGER_JUNGLES,
  marten: ['jim-corbett'],
  giantSquirrel: ['tadoba', 'satpura', 'panna', 'pench', 'kanha', 'bandipur'],
  deer: DEER_JUNGLES,
  slothBear: SLOTH_BEAR_JUNGLES,
  slothBearDhole: SLOTH_BEAR_JUNGLES.filter((j) => DHOLE_JUNGLES.includes(j)),
  wildBuffalo: ['kaziranga', 'manas'],
  sarusCrane: TIGER_JUNGLES.filter((j) => j !== 'sunderban' && j !== 'bor' && j !== 'sanjay-dubri' && j !== 'bandipur'),
  peacock: PEACOCK_JUNGLES,
  munia: ALL_JUNGLES,
  paintedStork: WETLAND_ADJACENT_JUNGLES,
  treepie: ALL_JUNGLES,
  shelduck: ALL_JUNGLES,
  beeEater: ALL_JUNGLES,
  dragonfly: ALL_JUNGLES,
  lion: ['gir'],
};

// Every close-up, single-species photo in src/assets/wildlife-gallery — a separate shoot
// from home_images, used for the tour-detail itinerary hero strip so it shows the jungle's
// own confirmed wildlife instead of the old generic, jungle-agnostic tour_jungle/ photo dump.
const GALLERY_SPECIES_IMAGES: Record<string, string[]> = {
  tiger: [
    'bengal-tiger-wildlife-gallery-01', 'bengal-tiger-wildlife-gallery-04', 'bengal-tiger-wildlife-gallery-05',
    'bengal-tiger-wildlife-gallery-06', 'bengal-tiger-wildlife-gallery-07', 'bengal-tiger-wildlife-gallery-08',
    'bengal-tiger-wildlife-gallery-15', 'bengal-tiger-wildlife-gallery-18', 'bengal-tiger-wildlife-gallery-22',
    'bengal-tiger-wildlife-gallery-24', 'bengal-tiger-wildlife-gallery-25', 'bengal-tiger-wildlife-gallery-27',
    'bengal-tiger-wildlife-gallery-31', 'bengal-tiger-wildlife-gallery-33', 'bengal-tiger-wildlife-gallery-35',
    'bengal-tiger-wildlife-gallery-37', 'bengal-tiger-wildlife-gallery-38', 'bengal-tiger-wildlife-gallery-39',
    'bengal-tiger-wildlife-gallery-46', 'bengal-tiger-wildlife-gallery-49', 'bengal-tiger-wildlife-gallery-50',
    'bengal-tiger-wildlife-gallery-52', 'bengal-tiger-wildlife-gallery-58', 'bengal-tiger-wildlife-gallery-66',
    'bengal-tiger-wildlife-gallery-67', 'bengal-tiger-wildlife-gallery-72', 'bengal-tiger-wildlife-gallery-75',
    'bengal-tiger-wildlife-gallery-79', 'bengal-tiger-wildlife-gallery-80',
    'bengal-tiger-cub-wildlife-gallery-55', 'bengal-tiger-cub-wildlife-gallery-56',
    'bengal-tiger-family-wildlife-gallery-02', 'bengal-tiger-family-wildlife-gallery-21',
    'bengal-tiger-family-wildlife-gallery-69', 'bengal-tiger-family-wildlife-gallery-83',
    'bengal-tiger-pair-wildlife-gallery-62',
  ],
  leopard: ['indian-leopard-wildlife-gallery-29', 'indian-leopard-wildlife-gallery-41', 'indian-leopard-wildlife-gallery-81'],
  lion: ['asiatic-lion-wildlife-gallery-01', 'asiatic-lion-cub-wildlife-gallery-01', 'asiatic-lion-cub-wildlife-gallery-02'],
  elephant: ['asian-elephant-wildlife-gallery-03', 'asian-elephant-pair-wildlife-gallery-71'],
  dhole: ['dhole-wildlife-gallery-54', 'dhole-wildlife-gallery-76'],
  sambarDeer: ['sambar-deer-wildlife-gallery-16', 'sambar-deer-wildlife-gallery-57'],
  spottedDeer: [
    'spotted-deer-wildlife-gallery-10', 'spotted-deer-wildlife-gallery-14', 'spotted-deer-wildlife-gallery-30',
    'spotted-deer-wildlife-gallery-47', 'spotted-deer-wildlife-gallery-60', 'spotted-deer-wildlife-gallery-70',
  ],
  barkingDeer: ['barking-deer-wildlife-gallery-48'],
  peacock: ['indian-peacock-wildlife-gallery-13', 'indian-peacock-wildlife-gallery-51'],
  sarusCrane: ['sarus-crane-wildlife-gallery-45'],
  grayLangur: ['gray-langur-wildlife-gallery-23', 'gray-langur-wildlife-gallery-78', 'gray-langur-troop-wildlife-gallery-43'],
  nilgai: ['nilgai-wildlife-gallery-19'],
  goldenJackal: ['golden-jackal-pair-wildlife-gallery-61'],
  indianMongoose: ['indian-mongoose-wildlife-gallery-73'],
  indianHornbill: ['indian-hornbill-wildlife-gallery-85'],
  crestedSerpentEagle: [
    'crested-serpent-eagle-wildlife-gallery-11', 'crested-serpent-eagle-wildlife-gallery-36',
    'crested-serpent-eagle-wildlife-gallery-59', 'crested-serpent-eagle-wildlife-gallery-84',
  ],
  fishEagle: ['fish-eagle-wildlife-gallery-89'],
  brownFishOwl: ['brown-fish-owl-wildlife-gallery-87'],
  spottedOwlet: ['spotted-owlet-pair-wildlife-gallery-12'],
  paradiseFlycatcher: ['asian-paradise-flycatcher-wildlife-gallery-40', 'asian-paradise-flycatcher-wildlife-gallery-53'],
  yellowFlycatcher: ['yellow-flycatcher-wildlife-gallery-63'],
  commonKingfisher: ['common-kingfisher-wildlife-gallery-88'],
  piedKingfisher: ['pied-kingfisher-wildlife-gallery-20'],
  coppersmithBarbet: ['coppersmith-barbet-wildlife-gallery-86'],
  greenBeeEater: ['green-bee-eater-wildlife-gallery-28', 'green-bee-eater-wildlife-gallery-65'],
  blackDrongo: ['black-drongo-wildlife-gallery-17'],
  longTailedShrike: ['long-tailed-shrike-wildlife-gallery-64'],
  rufousTreepie: ['rufous-treepie-wildlife-gallery-26'],
  woodpecker: ['woodpecker-wildlife-gallery-74'],
  hoopoe: ['hoopoe-wildlife-gallery-34'],
  houseSparrow: ['house-sparrow-wildlife-gallery-09'],
  heron: ['heron-wildlife-gallery-32'],
  orangeHeadedThrush: ['orange-headed-thrush-wildlife-gallery-90'],
  yellowThroatedBulbul: ['yellow-throated-bulbul-wildlife-gallery-77'],
  forestCrab: ['forest-crab-wildlife-gallery-92'],
  damselfly: ['damselfly-wildlife-gallery-68'],
  dragonfly: ['dragonfly-wildlife-gallery-44'],
  leafhopper: ['leafhopper-wildlife-gallery-82'],
};

const GALLERY_SPECIES_ALT: Record<string, string> = {
  tiger: 'Bengal tiger in the wild',
  leopard: 'Leopard in the wild',
  lion: 'Asiatic lion of Gir',
  elephant: 'Asian elephant',
  dhole: 'Indian wild dog (dhole)',
  sambarDeer: 'Sambar deer',
  spottedDeer: 'Spotted deer (chital)',
  barkingDeer: 'Barking deer',
  peacock: 'Indian peacock',
  sarusCrane: 'Sarus crane',
  grayLangur: 'Gray langur',
  nilgai: 'Nilgai antelope',
  goldenJackal: 'Golden jackal',
  indianMongoose: 'Indian mongoose',
  indianHornbill: 'Indian grey hornbill',
  crestedSerpentEagle: 'Crested serpent eagle',
  fishEagle: 'Fish eagle',
  brownFishOwl: 'Brown fish owl',
  spottedOwlet: 'Spotted owlet',
  paradiseFlycatcher: 'Asian paradise flycatcher',
  yellowFlycatcher: 'Yellow flycatcher',
  commonKingfisher: 'Common kingfisher',
  piedKingfisher: 'Pied kingfisher',
  coppersmithBarbet: 'Coppersmith barbet',
  greenBeeEater: 'Green bee-eater',
  blackDrongo: 'Black drongo',
  longTailedShrike: 'Long-tailed shrike',
  rufousTreepie: 'Rufous treepie',
  woodpecker: 'Woodpecker',
  hoopoe: 'Hoopoe',
  houseSparrow: 'House sparrow',
  heron: 'Heron',
  orangeHeadedThrush: 'Orange-headed thrush',
  yellowThroatedBulbul: 'Yellow-throated bulbul',
  forestCrab: 'Forest crab',
  damselfly: 'Damselfly',
  dragonfly: 'Dragonfly',
  leafhopper: 'Leafhopper',
};

// Widespread pan-India forest/wetland species — genuinely expected in virtually any of
// these reserves, so listed broadly rather than restricted like the marquee mammals above.
const COMMON_BIRD_INSECT_JUNGLES = ALL_JUNGLES;
// Gray langur and nilgai aren't part of the Northeast wetland or mangrove-delta fauna —
// Kaziranga/Manas have different primates and habitat, and Sunderban is pure mangrove.
const WIDESPREAD_MINUS_NORTHEAST_AND_DELTA = ALL_JUNGLES.filter((j) => !['kaziranga', 'manas', 'sunderban'].includes(j));
// Indian grey hornbill isn't part of the mangrove delta or the arid Rajasthan scrub-hill
// leopard reserves.
const HORNBILL_JUNGLES = ALL_JUNGLES.filter((j) => !['sunderban', 'jhalana', 'jawai-bera'].includes(j));

const GALLERY_SPECIES_JUNGLES: Record<string, string[]> = {
  tiger: TIGER_JUNGLES,
  leopard: LEOPARD_JUNGLES,
  lion: ['gir'],
  elephant: SPECIES_JUNGLES.elephant,
  dhole: DHOLE_JUNGLES,
  sambarDeer: DEER_JUNGLES,
  spottedDeer: DEER_JUNGLES,
  barkingDeer: DEER_JUNGLES,
  peacock: PEACOCK_JUNGLES,
  sarusCrane: SPECIES_JUNGLES.sarusCrane,
  grayLangur: WIDESPREAD_MINUS_NORTHEAST_AND_DELTA,
  nilgai: WIDESPREAD_MINUS_NORTHEAST_AND_DELTA,
  goldenJackal: ALL_JUNGLES,
  indianMongoose: ALL_JUNGLES,
  indianHornbill: HORNBILL_JUNGLES,
  crestedSerpentEagle: COMMON_BIRD_INSECT_JUNGLES,
  fishEagle: COMMON_BIRD_INSECT_JUNGLES,
  brownFishOwl: COMMON_BIRD_INSECT_JUNGLES,
  spottedOwlet: COMMON_BIRD_INSECT_JUNGLES,
  paradiseFlycatcher: COMMON_BIRD_INSECT_JUNGLES,
  yellowFlycatcher: COMMON_BIRD_INSECT_JUNGLES,
  commonKingfisher: COMMON_BIRD_INSECT_JUNGLES,
  piedKingfisher: COMMON_BIRD_INSECT_JUNGLES,
  coppersmithBarbet: COMMON_BIRD_INSECT_JUNGLES,
  greenBeeEater: COMMON_BIRD_INSECT_JUNGLES,
  blackDrongo: COMMON_BIRD_INSECT_JUNGLES,
  longTailedShrike: COMMON_BIRD_INSECT_JUNGLES,
  rufousTreepie: COMMON_BIRD_INSECT_JUNGLES,
  woodpecker: COMMON_BIRD_INSECT_JUNGLES,
  hoopoe: COMMON_BIRD_INSECT_JUNGLES,
  houseSparrow: COMMON_BIRD_INSECT_JUNGLES,
  heron: COMMON_BIRD_INSECT_JUNGLES,
  orangeHeadedThrush: COMMON_BIRD_INSECT_JUNGLES,
  yellowThroatedBulbul: COMMON_BIRD_INSECT_JUNGLES,
  forestCrab: COMMON_BIRD_INSECT_JUNGLES,
  damselfly: COMMON_BIRD_INSECT_JUNGLES,
  dragonfly: COMMON_BIRD_INSECT_JUNGLES,
  leafhopper: COMMON_BIRD_INSECT_JUNGLES,
};

export type SpeciesPhoto = { image: ImageMetadata; alt: string };

function hashOffset(input: string, mod: number): number {
  if (mod <= 0) return 0;
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
  return hash % mod;
}

// Builds a jungle-accurate wildlife photo pool: only species that actually live in that
// jungle, interleaved round-robin across species so consecutive picks don't repeat the
// same animal, then rotated by `seed` so different tours in the same jungle don't all
// open their fallback pool on the same photo.
export function getJungleWildlifePool(jungleSlug: string, seed = ''): SpeciesPhoto[] {
  const speciesKeys = Object.keys(SPECIES_IMAGES).filter((key) => SPECIES_JUNGLES[key]?.includes(jungleSlug));
  const perSpeciesLists = speciesKeys.map((key) =>
    SPECIES_IMAGES[key]
      .map((name) => homeImages[name])
      .filter((img): img is ImageMetadata => Boolean(img))
      .map((image) => ({ image, alt: SPECIES_ALT[key] }))
  );

  const pool: SpeciesPhoto[] = [];
  const maxLen = Math.max(0, ...perSpeciesLists.map((list) => list.length));
  for (let i = 0; i < maxLen; i += 1) {
    for (const list of perSpeciesLists) {
      if (list[i]) pool.push(list[i]);
    }
  }

  if (pool.length === 0 || !seed) return pool;
  const offset = hashOffset(seed, pool.length);
  return [...pool.slice(offset), ...pool.slice(0, offset)];
}

// Same jungle-accurate, round-robin, seed-rotated approach as getJungleWildlifePool, but
// sourced from src/assets/wildlife-gallery instead of home_images — used for the tour-detail
// itinerary hero strip so it only ever shows this jungle's own confirmed wildlife.
export function getJungleWildlifeGalleryPool(jungleSlug: string, seed = ''): SpeciesPhoto[] {
  const speciesKeys = Object.keys(GALLERY_SPECIES_IMAGES).filter((key) => GALLERY_SPECIES_JUNGLES[key]?.includes(jungleSlug));
  const perSpeciesLists = speciesKeys.map((key) =>
    GALLERY_SPECIES_IMAGES[key]
      .map((name) => wildlifeGalleryImages[name])
      .filter((img): img is ImageMetadata => Boolean(img))
      .map((image) => ({ image, alt: GALLERY_SPECIES_ALT[key] }))
  );

  const pool: SpeciesPhoto[] = [];
  const maxLen = Math.max(0, ...perSpeciesLists.map((list) => list.length));
  for (let i = 0; i < maxLen; i += 1) {
    for (const list of perSpeciesLists) {
      if (list[i]) pool.push(list[i]);
    }
  }

  if (pool.length === 0 || !seed) return pool;
  const offset = hashOffset(seed, pool.length);
  return [...pool.slice(offset), ...pool.slice(0, offset)];
}

// Every photo in tour_jungle, verified by eye — several filenames turned out to be
// swapped (e.g. "bengal-tiger-forest-itinerary-02" is actually a dhole pack, and
// "dhole-grassland-itinerary" is actually a tiger). Used for the itinerary hero strip
// so it only ever shows this jungle's own confirmed wildlife. A single elephant photo
// in the folder was excluded — it reads as an African savanna stock shot, not a
// credible Indian-reserve sighting.
const TOUR_JUNGLE_SPECIES_IMAGES: Record<string, string[]> = {
  tiger: [
    'bengal-tiger-forest-itinerary-01',
    'dense-forest-itinerary',
    'dhole-grassland-itinerary',
    'forest-landscape-itinerary',
    'forest-safari-road-itinerary',
    'wildlife-grassland-itinerary',
  ],
  dhole: ['bengal-tiger-forest-itinerary-02', 'sunlit-forest-itinerary'],
};

const TOUR_JUNGLE_SPECIES_ALT: Record<string, string> = {
  tiger: 'Bengal tiger in the wild',
  dhole: 'Indian wild dog (dhole)',
};

const TOUR_JUNGLE_SPECIES_JUNGLES: Record<string, string[]> = {
  tiger: TIGER_JUNGLES,
  dhole: DHOLE_JUNGLES,
};

export function getTourJungleWildlifePool(jungleSlug: string, seed = ''): SpeciesPhoto[] {
  const speciesKeys = Object.keys(TOUR_JUNGLE_SPECIES_IMAGES).filter((key) => TOUR_JUNGLE_SPECIES_JUNGLES[key]?.includes(jungleSlug));
  const perSpeciesLists = speciesKeys.map((key) =>
    TOUR_JUNGLE_SPECIES_IMAGES[key]
      .map((name) => tourJungleImages[name])
      .filter((img): img is ImageMetadata => Boolean(img))
      .map((image) => ({ image, alt: TOUR_JUNGLE_SPECIES_ALT[key] }))
  );

  const pool: SpeciesPhoto[] = [];
  const maxLen = Math.max(0, ...perSpeciesLists.map((list) => list.length));
  for (let i = 0; i < maxLen; i += 1) {
    for (const list of perSpeciesLists) {
      if (list[i]) pool.push(list[i]);
    }
  }

  if (pool.length === 0 || !seed) return pool;
  const offset = hashOffset(seed, pool.length);
  return [...pool.slice(offset), ...pool.slice(0, offset)];
}
