/**
 * Pench stays for the Pench resort guides. Locations and facilities from each property's
 * own website or major booking listings, checked October 2026. Category is our grading.
 */
import type { ResortCategory } from './tadobaResorts';

export type PenchResortZone = 'turia' | 'karmajhiri' | 'jamtara' | 'sillari';

export interface PenchResort {
  name: string;
  category: ResortCategory;
  zone: PenchResortZone;
  location: string;
  highlights: string;
  website?: string;
}

export const penchResortZones: Array<{ key: PenchResortZone; name: string; gates: string; blurb: string }> = [
  {
    key: 'turia',
    name: 'Turia (MP)',
    gates: 'Turia core · Telia, Rukhad, Khawasa buffer',
    blurb: 'Pench\'s main gate and biggest cluster of stays, along the Nagpur–Jabalpur highway between Khawasa and the Kohka lake. Every budget is here.',
  },
  {
    key: 'karmajhiri',
    name: 'Karmajhiri (MP)',
    gates: 'Karmajhiri core · Kumbhpani buffer',
    blurb: 'A quieter gate on the Seoni side with far fewer vehicles. Only a handful of lodges, including one of Pench\'s best.',
  },
  {
    key: 'jamtara',
    name: 'Jamtara (MP)',
    gates: 'Jamtara core',
    blurb: 'The least-visited MP gate, on the Chhindwara side, with a tiny daily quota and a very wild feel.',
  },
  {
    key: 'sillari',
    name: 'Sillari & Khursapar (Maharashtra)',
    gates: 'Sillari, Khursapar, Chorbahuli, Khubala core',
    blurb: 'The Maharashtra side, closest to Nagpur. Fewer resorts, simpler stays and quieter drives.',
  },
];

export const penchResorts: PenchResort[] = [
  // Turia
  { name: 'Baghvan, A Taj Safari', category: 'Luxury', zone: 'turia', location: 'Avarghani village, about 1 km from Turia gate', highlights: 'Taj Safaris\' lodge: spacious private cottages with their own sitting areas, naturalist-led safaris, nature walks and birding.', website: 'https://www.tajhotels.com/en-in/hotels/baghvan-pench-national-park' },
  { name: 'Pench Jungle Camp', category: 'Luxury', zone: 'turia', location: 'About 1 km from Turia gate, on 50 acres with its own lake', highlights: 'Thirteen luxury safari tents plus cottages and a family suite, a pool overlooking the lake, a spa and a library.', website: 'https://www.penchjunglecamp.com/' },
  { name: 'Kohka Wilderness Camp', category: 'Luxury', zone: 'turia', location: 'Kohka, about 10 minutes from Turia gate', highlights: 'A small wilderness camp on the Turia side, about 10 minutes from the gate.' },
  { name: 'Mahua Vann', category: 'Semi-Luxury', zone: 'turia', location: 'Kuppitola village, near Khawasa, about 10 minutes from Turia gate', highlights: 'Handcrafted mud cottages (some with decks over a seasonal river), deluxe rooms, a pool and a 37-acre eco park.', website: 'https://mahuaresorts.com/resorts/mahua-vann/' },
  { name: 'WelcomHeritage Jungle Home', category: 'Semi-Luxury', zone: 'turia', location: 'At Turia gate, on the Nagpur–Jabalpur highway', highlights: 'Super deluxe rooms, suites and luxury tents, pool, spa and a games zone.', website: 'https://www.junglehomepench.com/' },
  { name: 'Tuli Tiger Corridor', category: 'Semi-Luxury', zone: 'turia', location: 'Turia village, about 10 minutes from Turia gate', highlights: 'Tents and cottages on 22 acres in the buffer, pool, restaurant and in-house naturalist.' },
  { name: 'Tathastu Pench', category: 'Semi-Luxury', zone: 'turia', location: 'Awarghani village, near Turia gate', highlights: 'Cottages and family suites with a pool, close to Turia gate.', website: 'https://www.tathasturesorts.com/resorts/pench' },
  { name: 'Sterling Padam Pench', category: 'Semi-Luxury', zone: 'turia', location: 'Jamuntola road, Kothar, about 5.4 km from Turia gate', highlights: 'A 5-acre resort with a pool, gym, kids\' club and family rooms.', website: 'https://www.sterlingholidays.com/' },
  { name: 'The Soul Tree', category: 'Semi-Luxury', zone: 'turia', location: 'Kohka road, Turia village, close to Turia gate', highlights: 'Cottages set around wide lawns, a pool, a kids\' play area and a restaurant.', website: 'https://www.thesoultree.in/' },
  { name: 'Vannraj Resort & Spa', category: 'Semi-Luxury', zone: 'turia', location: 'Jamun Tola village, near Turia', highlights: 'Resort with a spa, pool and family rooms on the Turia side.', website: 'https://www.vannrajresorts.com/' },
  { name: 'MPT Kipling\'s Court', category: 'Deluxe', zone: 'turia', location: 'Awarghani, near Turia gate', highlights: 'MP Tourism\'s resort: comfortable rooms in large grounds with a garden and pool, a dependable value pick.', website: 'https://www.mpstdc.com/' },
  { name: 'Village Machaan Resort', category: 'Deluxe', zone: 'turia', location: 'Awarghani village, in the buffer near Turia', highlights: 'Glass-fronted cottages and a relaxed, good-value base for Turia drives.', website: 'https://www.villagemachaan.com/' },
  { name: 'Vann Vaikuntham', category: 'Deluxe', zone: 'turia', location: 'Near Turia gate', highlights: 'Family-oriented resort with comfortable rooms close to the gate.', website: 'https://www.vannvaikuntham.com/' },

  // Karmajhiri
  { name: 'Pench Tree Lodge', category: 'Luxury', zone: 'karmajhiri', location: 'Near Sarrahiri village, about 20 minutes from Karmajhiri gate', highlights: 'Pugdundee Safaris\' lodge on 40 rewilded acres: six tree houses, ten cottages, a pool and an eye-level photography hide.', website: 'https://www.penchtreelodge.com/' },
  { name: 'Karmajhiri Forest Rest House', category: 'Deluxe', zone: 'karmajhiri', location: 'At Karmajhiri gate (forest department)', highlights: 'Simple government rooms and a dormitory with a canteen, booked through the Field Director\'s office in Seoni.' },

  // Jamtara
  { name: 'Jamtara Wilderness Camp', category: 'Luxury', zone: 'jamtara', location: 'Jamtara village, close to the little-used Jamtara gate', highlights: 'An intimate luxury tented camp with privileged access to the quietest part of Pench.' },

  // Maharashtra
  { name: 'Olive Resort, Sillari', category: 'Semi-Luxury', zone: 'sillari', location: 'At Sillari gate, Pench Maharashtra', highlights: 'Villas with private gardens, a pool and a restaurant. Family-friendly.' },
  { name: 'The Restfo Pench Tiger Resort', category: 'Deluxe', zone: 'sillari', location: 'Pipariya road, Salai, near Sillari', highlights: 'Eco-minded, family-friendly stay a short drive from Sillari gate.' },
  { name: 'MTDC Sillari', category: 'Deluxe', zone: 'sillari', location: 'Beside Sillari gate', highlights: 'Maharashtra Tourism\'s resort right next to the gate, with deluxe rooms. Great value.', website: 'https://www.mtdc.co/' },
];
