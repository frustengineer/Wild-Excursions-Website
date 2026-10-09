/**
 * Tadoba stays for /best-resorts-in-tadoba/.
 * Existence + website: the reserve's "Where to Stay" list (mytadoba.mahaforest.gov.in/wheretostay).
 * Location + facilities: each resort's own website, checked October 2026.
 * Category is our own grading from facilities and published room rates, not an official star rating.
 */

export type ResortCategory = 'Luxury' | 'Semi-Luxury' | 'Deluxe';
export type ResortZone = 'moharli' | 'kolara' | 'navegaon' | 'pangdi-zari';

export interface Resort {
  name: string;
  category: ResortCategory;
  zone: ResortZone;
  location: string;
  highlights: string;
  website?: string;
}

export const resortZones: Array<{ key: ResortZone; name: string; gates: string; blurb: string }> = [
  {
    key: 'moharli',
    name: 'Moharli & Khutwanda (Moharli zone)',
    gates: 'Moharli, Khutwanda core · Agarzari, Dewada, Adegaon, Junona buffer',
    blurb: 'The biggest cluster of stays in Tadoba, most of them along the Irai reservoir between Moharli and Bhamdeli villages. Best base for first-timers and for the Moharli-side buffers.',
  },
  {
    key: 'kolara',
    name: 'Kolara (Kolara zone)',
    gates: 'Kolara core · Madnapur, Belara, Alizanza, Kolara Chauradeo, Shirkada, Palasgaon buffer',
    blurb: 'Closest to Nagpur, on the Umred–Chimur side. Several of Tadoba\'s finest luxury lodges sit along the Kolara gate road and around Masal village.',
  },
  {
    key: 'navegaon',
    name: 'Navegaon (Navegaon zone)',
    gates: 'Navegaon core · Navegaon Ramdegi, Nimdhela buffer',
    blurb: 'A smaller, quieter cluster right at Navegaon gate, well placed for the Ramdegi and Nimdhela buffers.',
  },
  {
    key: 'pangdi-zari',
    name: 'Zari & Pangdi (Pangdi & Zari zone)',
    gates: 'Zari, Pangdi core · Pangdi Aswal Chuha, Keslaghat, Zari Peth, Mamla, Somnath buffer',
    blurb: 'The quiet eastern side of the reserve. Only a few lodges, which is exactly the appeal.',
  },
];

export const resorts: Resort[] = [
  // ---------- Moharli zone ----------
  { name: 'Irai Safari Retreat', category: 'Luxury', zone: 'moharli', location: 'Bhamdeli village, about 2.7 km from Moharli gate', highlights: 'Rooms and suites overlooking the Irai reservoir, swimming pool, in-house restaurant, TOFTigers-certified.', website: 'https://www.iraisafariretreat.com/' },
  { name: 'Tadoba Jungle Camp', category: 'Luxury', zone: 'moharli', location: 'Near Moharli gate, about 15 minutes\' drive', highlights: 'Twelve safari cottages on 10 acres of reforested land with Irai Lake views, pool, stargazing telescopes, bonfire and poolside dinners.', website: 'https://www.tadobajunglecamp.com/' },
  { name: 'Limban Resort', category: 'Luxury', zone: 'moharli', location: 'Mudholi village, minutes from Khutwanda and Moharli gates', highlights: '16 suites, pods, canvas tents and cottages, a forest spa, pool and machan. Stay and safaris are planned and confirmed together.', website: 'https://limban.com/' },
  { name: 'Waghoba Eco Lodge', category: 'Luxury', zone: 'moharli', location: 'Wadala Tukum village, about 15 min to Khutwanda and 30 min to Moharli gate', highlights: 'Pugdundee Safaris\' eco-luxe lodge on 12 acres at the buffer edge. Naturalist-led, strong sustainability record.', website: 'https://www.waghobaecolodge.com/' },
  { name: 'Tadoba Van Vilas', category: 'Luxury', zone: 'moharli', location: 'Mohurli, behind Bhamdeli bus stop, near Irai Lake', highlights: 'Premium cottages, some with private Jacuzzis, plus pool, kids\' pool and a family villa on 6 acres.', website: 'https://www.tadobavanvilas.in/' },
  { name: 'tigress@ghosri', category: 'Luxury', zone: 'moharli', location: 'Ghosri village, Bhadravati, in the reserve\'s buffer landscape', highlights: 'Just six rooms in a villa and cottage on a private conservancy, with its own waterholes, camera traps and a pool. Very intimate.', website: 'https://www.tigressghosri.com/' },
  { name: 'Tathastu Tadoba (Tiger Village Resort)', category: 'Semi-Luxury', zone: 'moharli', location: 'Moharli village, about 1 km from Moharli gate', highlights: 'Cottages and family suites, pool, spa, bar, kayaking, cycling and stargazing.', website: 'https://www.tathasturesorts.com/resorts/tadoba' },
  { name: 'The Pugmark Jungle Lodge', category: 'Semi-Luxury', zone: 'moharli', location: 'About 0.9 km from Moharli gate, on the banks of Irai Lake', highlights: 'Villas, AC cottages and eco family cottages, pool, watchtower, library and kids\' play area.', website: 'https://www.thepugmark.in/' },
  { name: 'The Sanctuary Tadoba Resort', category: 'Semi-Luxury', zone: 'moharli', location: 'About 2 km from Moharli gate and 4 km from Khutwanda gate', highlights: 'Rooms with terraces, pool, jungle-view machan, lawns and wheelchair-friendly access.', website: 'https://www.sanctuarytadobaresort.com/' },
  { name: 'Tiger Trails Jungle Lodge', category: 'Semi-Luxury', zone: 'moharli', location: 'Chichghat valley, adjacent to Khutwanda gate', highlights: 'One of Tadoba\'s original wildlife lodges, surrounded on three sides by forest.', website: 'https://www.indianadventures.net/' },
  { name: 'Avadale Tadoba', category: 'Deluxe', zone: 'moharli', location: 'About 100 m from Moharli gate, near Junona', highlights: 'Walk-to-the-gate location. 12 rooms and in-house restaurant. Not for stag groups.', website: 'https://avadale.in/our-resorts/tadoba' },
  { name: 'Tadoba Tiger Valley Resort', category: 'Deluxe', zone: 'moharli', location: 'At Moharli gate, about 1 km from Junona buffer', highlights: 'Practical base right at the gate for the Moharli core and Junona, Dewada and Agarzari buffers. Sister property Tadoba Tiger Resort nearby.', website: 'https://www.tadobatigervalleyresort.com/' },
  { name: 'Royal Tiger Resort', category: 'Deluxe', zone: 'moharli', location: 'Moharli village', highlights: 'Standard and deluxe rooms plus a six-bed family unit, restaurant and lawns.', website: 'https://www.royaltigertadoba.in/' },
  { name: 'MTDC Resort Tadoba', category: 'Deluxe', zone: 'moharli', location: 'Near Moharli gate', highlights: 'The state tourism corporation\'s resort, with VIP cottages and dormitories. A good-value government option.', website: 'https://www.mtdc.co/' },
  { name: 'Camp Serai Tiger', category: 'Deluxe', zone: 'moharli', location: 'About 5 km from Moharli gate, walking distance to Irai Lake', highlights: 'Cottages plus 10- and 14-bed dormitories for groups and schools, all meals included, bird-watching machan.', website: 'https://www.seraitiger.com/' },

  // ---------- Kolara zone ----------
  { name: 'The Bamboo Forest Safari Lodge', category: 'Luxury', zone: 'kolara', location: 'Masal Tukum, on Lake Masal, about 6 km before Kolara gate', highlights: '19 villas, bungalows and chalets, spa, bar and lounge, naturalist walks by the lake. One of Tadoba\'s most acclaimed lodges.', website: 'https://bambooforest.in/' },
  { name: 'Svasara Jungle Lodge', category: 'Luxury', zone: 'kolara', location: 'About 300 m from Kolara gate', highlights: '12 suites on 10 acres, pool and spa, the Teakhouse restaurant and evening wildlife documentaries.', website: 'https://www.svasararesorts.com/' },
  { name: 'WelcomHeritage Tadoba Vanya Villas Resort & Spa', category: 'Luxury', zone: 'kolara', location: 'Chaiti Tukum, Kolara gate road', highlights: 'Private villas, pool, spa and fine dining from the WelcomHeritage collection.', website: 'https://www.welcomheritagehotels.in/welcomheritage-tadoba-vanya-villas-resort/chandrapur-resorts' },
  { name: 'Mahua Tola', category: 'Luxury', zone: 'kolara', location: 'About 6 km from Kolara gate, along a seasonal river', highlights: 'A 7.5-acre boutique retreat with ethnic-inspired architecture by Mahua Resorts.', website: 'https://mahuaresorts.com/resorts/mahua-tola/' },
  { name: 'Trees N Tigers', category: 'Luxury', zone: 'kolara', location: 'Manemohadi, Chimur side, about 15 minutes from the gates', highlights: 'Luxury safari tents with private plunge pools, in-house bakery and fine dining. Pet-friendly.', website: 'https://www.treesntigers.com/lodge-tadoba' },
  { name: '7 Tigers Resort', category: 'Semi-Luxury', zone: 'kolara', location: 'Masal Bk village, 3–4 km from Kolara gate', highlights: 'Large wood-panelled rooms and suites, pool, spa and multi-cuisine restaurant.', website: 'https://www.7tigersresort.com/tadoba' },
  { name: 'Tadoba Tiger King Resort', category: 'Semi-Luxury', zone: 'kolara', location: 'About 1 km from Kolara gate', highlights: '18 rooms from standard to premium plus a dormitory, pool, game zone, à la carte and buffet dining.', website: 'https://www.tadobatigerkingresort.com/' },
  { name: 'Tiger\'s Empire Resort', category: 'Semi-Luxury', zone: 'kolara', location: 'Kolara gate', highlights: 'Suites, pool, spa and multi-cuisine dining. Convenient for Kolara core and buffer drives.', website: 'https://www.tigersempire.in/' },
  { name: 'Bagh Kothi Wildlife Resort', category: 'Semi-Luxury', zone: 'kolara', location: 'Kolara village, beside the forest edge', highlights: 'Machan-style elevated cottages with glass verandas, BBQ garden and bird-watching tower. Pet-friendly.', website: 'https://www.baghkothi.com/' },
  { name: 'Sylvon Woods Resort', category: 'Semi-Luxury', zone: 'kolara', location: 'Kolara gate road, Masal Kh.', highlights: 'AC cottages in native woodland with an on-site restaurant and bonfire deck, close enough for unhurried early starts.' },
  { name: 'TaaruVann Jungle Lodge', category: 'Deluxe', zone: 'kolara', location: 'Near Kolara gate', highlights: 'Double and twin rooms set around lawns. A simple, comfortable base for Kolara-side drives.', website: 'https://www.taaruvann.com/' },
  { name: 'Jungle Meadows (Jayshree Meadows)', category: 'Deluxe', zone: 'kolara', location: 'Kolara', highlights: 'Small, budget-friendly stay listed by the reserve, close to the Kolara gate.' },
  { name: 'Chimur Tiger Resort', category: 'Deluxe', zone: 'kolara', location: 'About 3 km from Kolara gate', highlights: '20 rooms. A straightforward value option on the Kolara side.' },

  // ---------- Navegaon zone ----------
  { name: 'Jharna Jungle Lodge', category: 'Semi-Luxury', zone: 'navegaon', location: 'About 400 m from Navegaon gate', highlights: '22 cottages and premium rooms, pool, kids\' play area, conference hall, naturalists on site.', website: 'https://www.jharnaresort.com/' },
  { name: 'Tigers Heaven Resort', category: 'Deluxe', zone: 'navegaon', location: 'Under 15 minutes from Navegaon gate', highlights: 'Super deluxe, deluxe and cottage rooms on 7 acres, with an organic farm and bonfire evenings.', website: 'https://www.tigersheavenresort.co.in/' },

  // ---------- Pangdi & Zari zone ----------
  { name: 'Red Earth Tadoba', category: 'Luxury', zone: 'pangdi-zari', location: 'Pimpalkutt, near Zari gate', highlights: '15 acres with an Andhari tributary running through, cottages built around existing trees, spa, wade pool and bush dinners.', website: 'https://www.redearth.in/destination/tadoba-wildlife-lodge' },
  { name: 'Tadoba Footprint Resort', category: 'Semi-Luxury', zone: 'pangdi-zari', location: 'At Pangdi and Shirkada gates', highlights: 'Deluxe rooms and suites with an infinity pool facing the forest and farm-to-table dining.', website: 'https://www.tadobafootprintresort.com/' },
];

/** Listed by the reserve, but we could not independently confirm their gate or facilities. */
export const otherListedStays: Array<{ name: string; website?: string }> = [
  { name: 'Alizanza Camp' },
  { name: 'Bodhivan Resort' },
  { name: 'Chhawa Resort' },
  { name: 'FDCM West Chanda forest rest houses' },
  { name: 'Gaurav Natural Stay Resort' },
  { name: 'Gondwana Resort', website: 'https://gondwana-jungle-homes.netlify.app/' },
  { name: 'Hotel Tiger Inn' },
  { name: 'Irai Trail Resort' },
  { name: 'Mogli Oxyzone' },
  { name: 'Orchid Jungle Camp Resort', website: 'https://www.orchidsjunglecamp.com/' },
  { name: 'Saras Resort' },
  { name: 'Tadoba Safari Resort' },
  { name: 'Tadoba Trail Villa Resort' },
  { name: 'Tadoba Wildlife Resort' },
  { name: 'Zeal Tadoba Resort' },
];
