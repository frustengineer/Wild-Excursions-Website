/**
 * Researched facts for the resort directory (Oct 2026), layered on top of resortDirectory.json.
 *
 * Rule: a fact is listed only when the property's own site, the reserve's official list, or at least
 * two independent listings agree. Anything single-sourced or conflicting was left out. Distances are
 * written as the sources give them. The site's park resort guides (tadobaResorts.ts / penchResorts.ts)
 * already carry checked location notes for some properties; facilities for those are taken from the
 * same checked text.
 */

export type Facility =
  | 'Swimming pool' | "Children's pool" | 'Indoor pool' | 'Private pools' | 'Plunge pools' | 'Jacuzzi'
  | 'Spa' | 'Restaurant' | 'Bar' | 'Library' | 'Watchtower' | 'Machan' | "Kids' play area" | 'Games zone'
  | 'Bonfire' | 'Stargazing' | 'Boating' | 'Cycling' | 'Conference hall' | 'Dormitory' | 'Pet-friendly'
  | 'Wheelchair-friendly' | 'Yoga';

export interface ResortSource { label: string; href: string }

export interface ResortFacts {
  /** one or two sentences unique to this property */
  summary?: string;
  /** distance to the gate, as stated by the sources */
  gateNote?: string;
  facilities?: Facility[];
  checkIn?: string;
  checkOut?: string;
  /** months the lodge is open, when it closes with the core zone */
  season?: string;
  sources?: ResortSource[];
}

const tadobaList = { label: 'Tadoba-Andhari Tiger Reserve: Where to Stay (official resort list)', href: 'https://mytadoba.mahaforest.gov.in/wheretostay' };

export const resortFacts: Record<string, ResortFacts> = {
  // Bandhavgarh
  'aranyak-resort-bandhavgarh': {
    summary: 'A cottage resort in Kuchwahi village on Bijariya Road, on the Tala side of Bandhavgarh, with premium and superior cottages set around an outdoor pool.',
    facilities: ['Swimming pool', 'Spa', 'Restaurant', 'Bar'],
    checkIn: '1:30 PM',
    checkOut: '11:30 AM',
    sources: [
      { label: 'Aranyak Resort Bandhavgarh on Kayak (check-in times)', href: 'https://www.kayak.com/Tala-Hotels-Aranyak-Resort.2167835.ksp' },
      { label: 'Aranyak Resort Bandhavgarh on Hotels.com (facilities)', href: 'https://www.hotels.com/ho3098780896' },
    ],
  },
  'bamboo-grove-resort': {
    summary: 'A small lodge of garden-view cottages in Guruwahi village, a short walk from the Bandhavgarh park boundary near Tala, listed on booking sites as Bamboo Grove Lodge.',
    facilities: ['Swimming pool', 'Bar'],
    sources: [
      { label: 'Bamboo Grove Lodge on Hotels.com', href: 'https://hotels.com/ho3752447520/bamboo-grove-lodge' },
      { label: 'Bamboo Grove Lodge on Expedia', href: 'https://www.expedia.com/es/Manpur-Hoteles-Bamboo-Grove-Lodge.h117232735.Informacion-Hotel' },
    ],
  },
  'bandhav-villas': {
    summary: 'A villa resort, also spelled Bandhav Vilas, in Kuchwahi village on the Tala side of Bandhavgarh, with standalone villas around a pool and a lamp-lit stone courtyard.',
    gateNote: 'in Kuchwahi village, about 5 km (around 20 minutes\' drive) from Tala gate',
    facilities: ['Swimming pool', 'Restaurant', 'Bonfire'],
    season: 'October to June',
    sources: [
      { label: 'Bandhav Vilas, Bandhavgarh (Big Cats India)', href: 'https://bigcatsindia.com/bandhav-vilas/' },
      { label: 'Bandhav Vilas (Tribes Travel)', href: 'https://www.tribes.co.uk/accommodation/bandhav-vilas/details-and-map' },
    ],
  },
  'kings-lodge-bandhavgarh': {
    summary: 'Pugdundee Safaris\' lodge in its own forest near Rancha village, with cottages and stilt cottages, all air-conditioned with en-suite bathrooms.',
    gateNote: 'about a 10-minute drive from Tala gate',
    facilities: ['Swimming pool', 'Library', 'Watchtower', 'Restaurant'],
    checkIn: '1:30 PM',
    checkOut: '11:00 AM',
    season: '15 October to 30 June',
    sources: [
      { label: 'Kings Lodge (Tribes Travel)', href: 'https://www.tribes.co.uk/accommodation/kings-lodge/details-and-map' },
      { label: 'Kings Lodge (Audley Travel)', href: 'https://audleytravel.com/india/accommodation/kings-lodge' },
      { label: 'Pugdundee Safaris Kings Lodge on Expedia (check-in times)', href: 'https://www.expedia.com.au/Bandhogarh-Hotels-Pugdundee-Safaris-Kings-Lodge.h19969904.Hotel-Information' },
    ],
  },
  'monsoon-forest-resort': {
    summary: 'A Greetoe Resorts property of ground-level and raised "nest" cottages set in its own patch of forest near Tala, with vegetarian dining and yoga between safaris.',
    facilities: ['Swimming pool', 'Restaurant', 'Yoga'],
    sources: [
      { label: 'Monsoon Forest (Experience Travel Group)', href: 'https://www.experiencetravelgroup.com/india/hotel/monsoon-forest/?tab=map' },
      { label: 'Monsoon Forest by Greetoe Resort on Trip.com', href: 'https://ph.trip.com/hotels/tala-hotel-detail-131584736/monsoon-forest-by-greetoe-resort' },
    ],
  },
  'syna-tiger-resort': {
    summary: 'A resort in Tala village with eight cottages themed on the art of different Indian states, plus tribal cottages, luxury cottages and a suite.',
    gateNote: 'about 200 m from Tala gate',
    facilities: ['Swimming pool', "Children's pool", 'Restaurant'],
    sources: [
      { label: 'Top ten resorts in Bandhavgarh (Wild Trails)', href: 'https://wildtrails.in/?p=13862' },
      { label: 'Syna Tiger Resort on Trip.com', href: 'https://sa.trip.com/hotels/tala-hotel-detail-10032580/syna-tiger-resort-bandhavgarh' },
      { label: 'Syna Tiger Resort on Travelocity', href: 'https://www.travelocity.com/Manpur-Hotels-Syna-Tiger-Resort-Bandhavgarh.h31779535.Hotel-Reviews' },
    ],
  },
  'tiger-trails-resort': {
    summary: 'A cottage resort in Tala village, close to the Bandhavgarh park boundary, reached by a short unpaved village road.',
    facilities: ['Swimming pool', 'Restaurant', 'Bar', 'Library'],
    sources: [
      { label: 'Tiger Trails Resorts on Hotels.com', href: 'https://hotels.com/ho525929/tiger-trails-resorts-bandhogarh-india' },
      { label: 'Tiger Trails Resort on Kayak', href: 'https://www.kayak.com/Tala-Hotels-Tiger-Trails-Resort.2163237.ksp' },
    ],
  },

  // Kanha
  'aranyak-resort-kanha': {
    summary: 'A resort on Khatia road in Mocha village, on the Khatia side of Kanha, with premium cottages, a children\'s pool and a banquet hall.',
    gateNote: 'about 5.6 km (8 minutes\' drive) from Khatia gate',
    facilities: ["Children's pool", 'Restaurant', 'Conference hall'],
    sources: [
      { label: 'Aranyak Resort Kanha on Expedia', href: 'https://www.expedia.com.au/Mandla-Hotels-Aranyak-Resort-Kanha.h96803393.Hotel-Information' },
      { label: 'Aranyak Resort Kanha on Travelocity', href: 'https://www.travelocity.com/Bichhiya-Hotels-Aranyak-Resort-Kanha.h96803393.Hotel-Reviews' },
    ],
  },

  // Satpura
  'goldmark-resorts-churna': {
    summary: 'A resort on the Churna road, built around a lagoon-style pool, on the quieter Churna side of Satpura.',
    gateNote: 'about 4.3 km from Churna gate',
    facilities: ['Swimming pool', 'Restaurant', "Kids' play area"],
    sources: [
      { label: 'Goldmark Resort Churna on Hotels.com', href: 'https://www.hotels.com/ho2916841504/goldmark-resort-churna-betul-india/' },
      { label: 'Goldmark Resort Churna on Expedia', href: 'https://www.expedia.com/Betul-Hotels-GOLDMARK-RESORT-CHURNA.h91120047.Hotel-Information' },
    ],
  },
  'parijat-lake-resort-by-goldmark': {
    summary: 'A lakeside resort beside Bison Lodge at Madhai, with river-view rooms and a fire-pit terrace facing the water.',
    gateNote: 'about 170 m from Madhai gate',
    facilities: ['Swimming pool', 'Restaurant', 'Boating', 'Conference hall'],
    sources: [
      { label: 'Parijat Lake Resort by GoldMark on Trip.com', href: 'https://nz.trip.com/hotels/sarangpur-hotel-detail-104707458/parijat-by-goldmark' },
      { label: 'Parijat Lake Resort by GoldMark on Expedia', href: 'https://www.expedia.com.my/Sohagpur-Hotels-Parijat-By-Goldmark.h91119611.Hotel-Information' },
    ],
  },

  // Tadoba
  'saiprasad-tiger-resorts': {
    summary: 'A Kolara-side resort near Chimur whose top categories come with their own pool or Jacuzzi, from the Rajwada and Forest Suites with private pools to a honeymoon suite with an indoor Jacuzzi.',
    facilities: ['Private pools', 'Jacuzzi'],
    sources: [
      { label: 'Saiprasad Tiger Resorts on Hotels.com', href: 'https://www.hotels.com/ho4090040736/' },
    ],
  },
  'vrruksh-ecostay': {
    summary: 'An eco-stay near Moharli that describes itself as built from stabilised mud blocks and run partly on solar power, with mud-block cottages, twin cottages and large safari tents.',
    gateNote: 'about 8 minutes\' drive from Moharli gate and 10 minutes from Junona gate, by the lodge\'s own figures',
    sources: [
      { label: 'Vrruksh Eco Stay, Tadoba (Big Cats India)', href: 'https://bigcatsindia.com/vrruksh-eco-stay/' },
    ],
  },
  'irai-safari-retreat': { facilities: ['Swimming pool', 'Restaurant'], sources: [tadobaList] },
  'tadoba-jungle-camp': { facilities: ['Swimming pool', 'Stargazing', 'Bonfire'], sources: [tadobaList] },
  'tathastu-tadoba': { facilities: ['Swimming pool', 'Spa', 'Bar', 'Boating', 'Cycling', 'Stargazing'], sources: [tadobaList] },
  'pugmark-jungle-lodge': { facilities: ['Swimming pool', 'Watchtower', 'Library', "Kids' play area"], sources: [tadobaList] },
  'the-sanctuary-tadoba-resort': { facilities: ['Swimming pool', 'Machan', 'Wheelchair-friendly'], sources: [tadobaList] },
  'camp-serai-tiger-resort': { facilities: ['Dormitory', 'Machan', 'Restaurant'], sources: [tadobaList] },
  'welcome-heritage-tadoba-vanya-villas-resort-and-spa': { facilities: ['Swimming pool', 'Spa', 'Restaurant'], sources: [tadobaList] },
  'trees-n-tigers-resorts': { facilities: ['Plunge pools', 'Restaurant', 'Pet-friendly'], sources: [tadobaList] },
  '7-tigers-resort': { facilities: ['Swimming pool', 'Spa', 'Restaurant'], sources: [tadobaList] },
  'tadoba-tiger-king-resort': { facilities: ['Swimming pool', 'Games zone', 'Restaurant', 'Dormitory'], sources: [tadobaList] },
  'bagh-kothi-resort': { facilities: ['Machan', 'Watchtower', 'Pet-friendly'], sources: [tadobaList] },

  // Pench
  'pench-jungle-camp': { facilities: ['Swimming pool', 'Spa', 'Library'] },
  'tathastu-resort': { facilities: ['Swimming pool'] },
  'the-soul-tree-resort': { facilities: ['Swimming pool', 'Plunge pools', "Kids' play area", 'Restaurant'] },
  'vannraj-resort-and-spa': { facilities: ['Swimming pool', 'Spa'] },
  'orient-woods-resort': {
    summary: 'A cottage resort at Manegaon Tek on the Ramtek road, on the Maharashtra side of Pench near Khursapar gate, now run by Sterling as Sterling Orient Woods Pench.',
    facilities: ['Swimming pool', "Children's pool", 'Restaurant'],
    sources: [
      { label: 'Sterling Orient Woods Pench on Expedia', href: 'https://www.expedia.co.uk/Ramtek-Hotels-Sterling-Orient-Woods-Pench.h109036469.Hotel-Information' },
      { label: 'Sterling Orient Woods Pench on Hotels.com', href: 'https://www.hotels.com/ho3490167008/' },
    ],
  },
  'rukhad-jungle-camp': {
    summary: 'A small camp in the forest at Rukhad on the Nagpur–Jabalpur highway: four Jal Mahal cottages with private decks over a waterhole, and the elevated Dudhiya and Daldali cottages overlooking a lake.',
    gateNote: 'about 200 m from the Rukhad buffer gate',
    sources: [
      { label: 'Rukhad Jungle Camp, Pench (Big Cats India)', href: 'https://bigcatsindia.com/rukhad-jungle-camp/' },
      { label: 'Rukhad Jungle Camp reviews on MakeMyTrip', href: 'https://www.makemytrip.com/hotels/review-of-rukhad_jungle_camp_pench-details-pench.html' },
    ],
  },
  'tiger-n-woods-resort': {
    summary: 'A resort in Awarghani village with ten wooden machans, cabins on stilts with balconies facing the forest, alongside premium cottages and cottages with plunge pools.',
    gateNote: 'about 1–1.7 km (a 4–5 minute drive) from Turia gate',
    facilities: ['Swimming pool', 'Machan', 'Plunge pools', 'Restaurant'],
    sources: [
      { label: 'Tiger N Woods Resort on Trip.com', href: 'https://ph.trip.com/hotels/kohka-hotel-detail-9025025/tiger-n-woods-resort' },
      { label: 'Tiger N Woods Resort on Expedia', href: 'https://www.expedia.com/es/Seoni-Hoteles-Tiger-N-Woods-Resort.h11114787.Informacion-Hotel' },
      { label: 'Tiger N Woods guest reviews (Wanderlog)', href: 'https://wanderlog.com/place/details/5421/tiger-n-woods' },
    ],
  },

  // Panna
  'greetoe-camp-panna': {
    summary: 'A Greetoe Resorts camp on the edge of the Ken river along the Raneh Falls road, with AC cottages and a pool.',
    facilities: ['Swimming pool', 'Restaurant'],
    sources: [
      { label: 'Greetoe Camp Panna on Trip.com', href: 'https://ph.trip.com/hotels/khajuraho-hotel-detail-9431954/greetoe-camp-panna' },
    ],
  },

  // Umred-Karhandla
  'royal-karhandla-resort': {
    gateNote: 'about 1 km from Karhandla gate',
    sources: [
      { label: 'Royal Karhandla Resort on Trip.com', href: 'https://mx.trip.com/hotels/nagpur-hotel-detail-14001251/royal-karhandla-resort' },
    ],
  },
};

/** safari gates with mapped coordinates (OpenStreetMap), keyed by resort area */
export const areaGates: Record<string, { name: string; lat: number; lng: number }> = {
  moharli: { name: 'Moharli gate', lat: 20.19204, lng: 79.335 },
  turia: { name: 'Turia gate', lat: 21.73906, lng: 79.33683 },
  maharashtra: { name: 'Khursapar gate', lat: 21.66865, lng: 79.37002 },
  khatia: { name: 'Khatia gate', lat: 22.3062, lng: 80.52901 },
  mukki: { name: 'Mukki gate', lat: 22.15475, lng: 80.67277 },
  karhandla: { name: 'Karhandla gate', lat: 20.84567, lng: 79.40137 },
};

export const gateSource: ResortSource = { label: 'Safari gate locations from OpenStreetMap', href: 'https://www.openstreetmap.org/' };
