import tigerForest from '../assets/hero-carousel/bengal-tiger-forest-hero-06.webp';
import tigerRunning from '../assets/hero-carousel/bengal-tiger-running-hero-03.webp';
import tigerGrassland from '../assets/hero-carousel/bengal-tiger-grassland-hero-02.webp';
import penchHero from '../../tour_jungle/pench_tour_hero-v2.webp';
import kanhaHero from '../../tour_jungle/kanha.webp';
import bandhavgarhHero from '../../tour_jungle/bandhavgarh.webp';
import ranthamboreHero from '../../tour_jungle/ranthombore.webp';
import corbettHero from '../../tour_jungle/jim_corbett.webp';
import tigerFamily from '../../tour_images/bengal-tiger-family-tour.webp';
import tigerJeep from '../../tour_images/bengal-tiger-safari-jeep-tour.webp';
import forestRoad from '../../tour_images/forest-safari-road-tour.webp';
import elephantGrassland from '../../tour_images/asian-elephant-grassland-tour.webp';

export interface SafariBookingPageData {
  slug: string;
  jungle: string;
  name: string;
  fullName: string;
  region: string;
  title: string;
  description: string;
  eyebrow: string;
  subtitle: string;
  heroImage: ImageMetadata;
  heroAlt: string;
  zonesImage: ImageMetadata;
  zonesAlt: string;
  bottomImage: ImageMetadata;
  bottomAlt: string;
  quickAnswer: string;
  howToIntro: string;
  howToSteps: Array<{ name: string; text: string }>;
  officialLinks: Array<{ label: string; href: string }>;
  bestTimeIntro: string;
  seasons: Array<{ label: string; text: string }>;
  bestTimeNote: string;
  zonesIntro: string;
  zoneBullets: Array<{ label: string; text: string }>;
  zoneNote: string;
  zoneCaption: string;
  zoneRows: Array<{ zone: string; gates: string; density: string; bestFor: string }>;
  chargesIntro: string;
  timingsIntro: string;
  timings: Array<{ label: string; text: string }>;
  timingsNote: string;
  reachIntro: string;
  reachCaption: string;
  reachFirstColumn: string;
  reachRows: Array<{ place: string; distance: string; time: string }>;
  reachNote: string;
  packagesIntro: string;
  safariRules: string[];
  thingsToCarry: string[];
  relatedGuides: Array<{ href: string; label: string; blurb: string }>;
  faqs: Array<{ question: string; answer: string }>;
}

const sharedRules = [
  'Carry the same original photo ID used for the permit; names and document numbers must match.',
  'Follow the naturalist and driver at all times. Do not leave the vehicle or ask wildlife to be approached.',
  'Keep voices low, never feed animals, and take all litter back out of the reserve.',
  'Avoid flash photography and drones. Commercial equipment may require separate permission.',
];

const sharedCarry = [
  'Original government photo ID for every traveller, including children where required',
  'Neutral-coloured layers, a light jacket for winter mornings, hat and sunglasses',
  'Binoculars and a camera with spare batteries and memory cards',
  'Water, sunscreen and a dust scarf; use a soft bag that fits inside the safari vehicle',
];

const commonGuides = (jungle: string, label: string) => [
  { href: `/tours/${jungle}/`, label: `${label} Tour Packages`, blurb: `Compare every ${label} itinerary, duration and current starting price.` },
  { href: '/tiger-safari-india/', label: 'Tiger Safari in India', blurb: 'Compare India’s leading tiger reserves and choose the right season.' },
  { href: '/wildlife-photography-tours-india/', label: 'Wildlife Photography Tours', blurb: 'Plan longer drives, flexible pacing and camera-friendly vehicles.' },
  { href: '/guides/best-time-to-visit/', label: 'Best Time to Visit India’s Jungles', blurb: 'A season-by-season guide to weather, access and wildlife activity.' },
];

export const safariBookingPages: Record<string, SafariBookingPageData> = {
  pench: {
    slug: 'pench-jungle-safari-booking',
    jungle: 'pench',
    name: 'Pench',
    fullName: 'Pench Tiger Reserve',
    region: 'Madhya Pradesh and Maharashtra',
    title: 'Pench Jungle Safari Booking 2026 | Permits, Zones & Packages',
    description: 'Plan a Pench jungle safari with permit guidance, gate-matched stays and naturalist-led drives. Compare zones, seasons and packages from ₹10,690.',
    eyebrow: 'Safari Booking Assistance',
    subtitle: 'Book permits, gate-matched stays and naturalist-led drives across the Madhya Pradesh and Maharashtra sides of Pench.',
    heroImage: tigerForest,
    heroAlt: 'Bengal tiger walking through a sunlit forest on an Indian jungle safari',
    zonesImage: penchHero,
    zonesAlt: 'Forest landscape in Pench Tiger Reserve',
    bottomImage: forestRoad,
    bottomAlt: 'Open safari track through a teak forest near Pench',
    quickAnswer: 'Choose the state side first, then your dates, entry gate and number of drives. Pench permits are issued through different official systems in Madhya Pradesh and Maharashtra, so your resort and transfers should be matched to the confirmed gate.',
    howToIntro: 'Pench crosses a state border. The most important booking decision is not simply core or buffer—it is whether your permit is for the Madhya Pradesh or Maharashtra side.',
    howToSteps: [
      { name: 'Choose the Pench side', text: 'Turia, Karmajhiri and Jamtara are on the Madhya Pradesh side; Sillari, Khursapar and other gates are booked through Maharashtra.' },
      { name: 'Fix dates and safari count', text: 'Two nights and four drives is a practical first trip. Add more drives when wildlife photography is the priority.' },
      { name: 'Check gate-specific availability', text: 'Permits are linked to a particular zone or gate. Availability can differ sharply across the two state portals.' },
      { name: 'Submit traveller ID details', text: 'Send every traveller’s name, age and accepted photo-ID details exactly as they appear on the document.' },
      { name: 'Match the stay and transfer', text: 'Stay close to the confirmed gate. Crossing between distant Pench gates before dawn can make an otherwise simple itinerary impractical.' },
    ],
    officialLinks: [
      { label: 'Madhya Pradesh forest booking portal', href: 'https://forest.mponline.gov.in/' },
      { label: 'Pench Maharashtra official site', href: 'https://penchtigerreserve.maharashtra.gov.in/' },
    ],
    bestTimeIntro: 'Pench changes character through the season: green and photogenic after the rains, cool in winter, and increasingly dry as summer concentrates wildlife near water.',
    seasons: [
      { label: 'October – November', text: 'Fresh foliage, pleasant temperatures and strong landscape photography.' },
      { label: 'December – February', text: 'Cool mornings and comfortable full-day travel for families and first-time visitors.' },
      { label: 'March – June', text: 'Hotter, drier conditions with wildlife increasingly using waterholes.' },
      { label: 'July – September', text: 'Core access is restricted; selected Maharashtra buffer routes may operate subject to local conditions.' },
    ],
    bestTimeNote: 'The Madhya Pradesh tourism season is generally mid-October to June. Maharashtra publishes month-specific drive times and any monsoon buffer access separately.',
    zonesIntro: 'Pench has one connected forest but two administrative booking systems. A good itinerary treats each confirmed gate as a separate logistics base.',
    zoneBullets: [
      { label: 'Madhya Pradesh', text: 'Turia is the best-known entry, with Karmajhiri and Jamtara providing access to different parts of the reserve.' },
      { label: 'Maharashtra', text: 'Sillari, Khursapar, Kolitmara, Chorbahuli, Maudi, Banera, Khubala and Surewani are among the official gates.' },
    ],
    zoneNote: 'No gate guarantees a tiger sighting. Select by live permit availability, recent habitat use, transfer time and the quality of the overall route plan.',
    zoneCaption: 'Pench safari areas and entry planning',
    zoneRows: [
      { zone: 'Turia zone', gates: 'Turia, MP', density: 'Popular', bestFor: 'First visits and established tourism infrastructure' },
      { zone: 'Karmajhiri zone', gates: 'Karmajhiri, MP', density: 'Moderate', bestFor: 'Longer forest routes and repeat visitors' },
      { zone: 'Jamtara zone', gates: 'Jamtara, MP', density: 'Lower', bestFor: 'Quieter access from the Chhindwara side' },
      { zone: 'Maharashtra sectors', gates: 'Sillari, Khursapar and others', density: 'Varies by gate', bestFor: 'Gate-specific itineraries and alternate availability' },
    ],
    chargesIntro: 'The payable safari total depends on the state portal, zone, vehicle type, nationality, guide fees and current department rules. Our displayed package prices combine the planned permits, vehicle, naturalist and stay instead of presenting a government fee that may change.',
    timingsIntro: 'Pench normally operates morning and afternoon drives, with entry and exit moving through the season to follow daylight.',
    timings: [
      { label: 'Morning safari', text: 'Typically begins around sunrise and runs for roughly four hours.' },
      { label: 'Afternoon safari', text: 'Starts after lunch and finishes at the notified closing time before dusk.' },
    ],
    timingsNote: 'On the Maharashtra side, notified slots range from about 5:30–9:30 AM in late summer to 6:30–10:30 AM in winter. Always follow the time printed on the permit.',
    reachIntro: 'Nagpur is the most convenient airport for Turia and the Maharashtra gates. Jabalpur and Seoni are useful alternatives for the eastern Madhya Pradesh entrances.',
    reachCaption: 'Approximate road distances to Pench entry areas',
    reachFirstColumn: 'Route',
    reachRows: [
      { place: 'Nagpur to Turia', distance: 'About 85 km', time: '2–2.5 hours' },
      { place: 'Nagpur to Karmajhiri', distance: 'About 135 km', time: '3–3.5 hours' },
      { place: 'Jabalpur to Turia', distance: 'About 215 km', time: '4.5–5 hours' },
      { place: 'Seoni to Karmajhiri', distance: 'About 50 km', time: '1–1.5 hours' },
    ],
    reachNote: 'Drive times are approximate. Confirm your exact gate before booking a flight, train, hotel or transfer.',
    packagesIntro: 'Every package below is planned around confirmed Pench access and includes the safari vehicle, naturalist and a stay positioned for the selected gate.',
    safariRules: sharedRules,
    thingsToCarry: sharedCarry,
    relatedGuides: [
      ...commonGuides('pench', 'Pench'),
      { href: '/blogs/tadoba-safari-vs-pench-safari/', label: 'Tadoba vs Pench Safari', blurb: 'Compare access, forest character and the trip style of two neighbouring tiger landscapes.' },
    ],
    faqs: [
      { question: 'How do I book a Pench jungle safari?', answer: 'First choose the Madhya Pradesh or Maharashtra side, then select a date, zone or gate, vehicle option and traveller IDs. The permit must be booked through the official system for that side.' },
      { question: 'Which Pench gate is best?', answer: 'There is no guaranteed best gate. Turia has the most established tourism base, while Karmajhiri, Jamtara and the Maharashtra gates can suit different dates, routes and availability.' },
      { question: 'Is Pench in Madhya Pradesh or Maharashtra?', answer: 'Pench spans both states. Each side has separate gates and booking arrangements, so confirm the state and gate before choosing accommodation.' },
      { question: 'What is the best time for a Pench safari?', answer: 'October to February is comfortable and green; March to June is hotter and wildlife tends to concentrate closer to water. Access is subject to notified seasonal closures.' },
      { question: 'How many safaris should I book in Pench?', answer: 'Four drives over two nights is a useful starting point. Photographers and repeat visitors often choose six or more drives to cover different routes.' },
      { question: 'How much does a Pench safari package cost?', answer: 'The package price varies by duration, gate, stay and permit availability. Current Wild Excursions packages on this page start from ₹10,690 per person.' },
      { question: 'Can I use the same resort for every Pench gate?', answer: 'Not always. Some gates are far apart, and crossing between them before a morning safari can be difficult. Match the resort to the confirmed gate.' },
      { question: 'Are tiger sightings guaranteed in Pench?', answer: 'No. Pench is a wild landscape and sightings depend on animal movement, weather and chance. More well-planned drives improve opportunity but never guarantee a sighting.' },
    ],
  },

  kanha: {
    slug: 'kanha-jungle-safari-booking',
    jungle: 'kanha',
    name: 'Kanha',
    fullName: 'Kanha Tiger Reserve',
    region: 'Madhya Pradesh',
    title: 'Kanha Jungle Safari Booking 2026 | Zones, Permits & Packages',
    description: 'Book a Kanha jungle safari with zone planning, permits, gate-matched stays and naturalist drives. Compare timings and packages from ₹11,900.',
    eyebrow: 'Safari Booking Assistance',
    subtitle: 'Plan permits, stays and naturalist-led drives across Kanha’s sal forests, meadows and four core tourism zones.',
    heroImage: tigerGrassland,
    heroAlt: 'Bengal tiger standing in tall grass during an Indian wildlife safari',
    zonesImage: kanhaHero,
    zonesAlt: 'Grassland and forest habitat in Kanha National Park',
    bottomImage: elephantGrassland,
    bottomAlt: 'Wildlife crossing open grassland during a central India safari',
    quickAnswer: 'Choose your travel dates, preferred core or buffer zone and entry side before booking. Kanha permits are zone-specific, so Khatia, Mukki or Sarhi accommodation should be selected only after the safari plan is clear.',
    howToIntro: 'Kanha is large enough that the wrong gate can add hours of road travel. Build the permit plan first and place the stay on the matching side of the reserve.',
    howToSteps: [
      { name: 'Choose the entry side', text: 'Khatia serves the western side, Mukki the south, and Sarhi the north-east. Your zone plan should guide this choice.' },
      { name: 'Select the safari mix', text: 'Use four or more drives to mix core and buffer routes rather than relying on one zone.' },
      { name: 'Check zone permits', text: 'Kanha, Kisli, Mukki and Sarhi are distinct core tourism zones with separate availability.' },
      { name: 'Submit matching ID details', text: 'Traveller information must match the original photo ID carried to the gate.' },
      { name: 'Confirm stay and transfers', text: 'Choose accommodation near the booked gate and allow a generous road buffer on arrival day.' },
    ],
    officialLinks: [{ label: 'Madhya Pradesh forest booking portal', href: 'https://forest.mponline.gov.in/' }],
    bestTimeIntro: 'Kanha’s open meadows and sal forest look different in every part of the tourism season, so the ideal month depends on comfort, photography and heat tolerance.',
    seasons: [
      { label: 'Mid-October – November', text: 'Lush post-monsoon landscape, soft light and comfortable afternoons.' },
      { label: 'December – February', text: 'Cold mornings, clear days and excellent weather for longer trips.' },
      { label: 'March – April', text: 'Warmer drives, thinning vegetation and a strong balance of comfort and wildlife activity.' },
      { label: 'May – June', text: 'Very hot, dusty conditions with wildlife increasingly tied to remaining water.' },
    ],
    bestTimeNote: 'The notified tourism season is generally from mid-October to 30 June, subject to forest department orders and weather.',
    zonesIntro: 'Kanha’s four core tourism zones are supported by buffer routes around the reserve. The best plan balances permit availability with the correct entry gate.',
    zoneBullets: [
      { label: 'Core zones', text: 'Kanha, Kisli, Mukki and Sarhi have zone-specific permits and established day-safari routes.' },
      { label: 'Buffer areas', text: 'Khatia, Khapa and Sijhora provide additional routes and can add variety to a multi-drive itinerary.' },
    ],
    zoneNote: 'Zone names are not sighting guarantees. Tiger and barasingha movement changes with water, fire lines, prey and disturbance.',
    zoneCaption: 'Kanha tourism zones and practical entry sides',
    zoneRows: [
      { zone: 'Kanha', gates: 'Usually planned from Khatia', density: 'Popular', bestFor: 'Iconic meadows and first-time itineraries' },
      { zone: 'Kisli', gates: 'Khatia side', density: 'Moderate to popular', bestFor: 'Mixed sal forest and meadow routes' },
      { zone: 'Mukki', gates: 'Mukki', density: 'Moderate', bestFor: 'Southern access and longer stays' },
      { zone: 'Sarhi', gates: 'Sarhi', density: 'Generally quieter', bestFor: 'North-eastern access and repeat visitors' },
    ],
    chargesIntro: 'Kanha costs vary with the zone, permit category, vehicle sharing, nationality, guide charges and accommodation. The package table uses current Wild Excursions prices and bundles the planned permit, vehicle, naturalist and stay.',
    timingsIntro: 'Kanha operates a morning and afternoon visitor window, with exact gate times adjusted for sunrise, sunset and seasonal forest orders.',
    timings: [
      { label: 'Morning safari', text: 'Early gate reporting followed by a drive of roughly four hours.' },
      { label: 'Afternoon safari', text: 'A shorter post-lunch drive that ends before the notified evening gate closure.' },
    ],
    timingsNote: 'Arrive at the gate before the reporting time on the permit. Late arrival can result in a shortened drive or denied entry.',
    reachIntro: 'Jabalpur, Raipur and Nagpur are the main flight and rail approaches. The best hub depends on whether the itinerary uses Khatia, Mukki or Sarhi.',
    reachCaption: 'Approximate road distances to Kanha entry gates',
    reachFirstColumn: 'Entry gate',
    reachRows: [
      { place: 'Khatia from Jabalpur', distance: 'About 160 km', time: '4–4.5 hours' },
      { place: 'Khatia from Nagpur', distance: 'About 220 km', time: '5–6 hours' },
      { place: 'Mukki from Raipur', distance: 'About 210 km', time: '5–5.5 hours' },
      { place: 'Sarhi from Jabalpur', distance: 'About 150 km', time: '4–4.5 hours' },
    ],
    reachNote: 'Road times vary with route condition and village traffic. Do not book a safari too close to your flight or train arrival.',
    packagesIntro: 'These Kanha packages include planned safari access, vehicle, naturalist and accommodation near the appropriate entry side.',
    safariRules: sharedRules,
    thingsToCarry: sharedCarry,
    relatedGuides: commonGuides('kanha', 'Kanha'),
    faqs: [
      { question: 'How do I book a Kanha jungle safari?', answer: 'Select the dates, zone and vehicle option on the official Madhya Pradesh portal, enter matching traveller ID details, then arrange a stay close to the relevant gate.' },
      { question: 'What are the core safari zones in Kanha?', answer: 'The four core tourism zones are Kanha, Kisli, Mukki and Sarhi. Buffer routes include Khatia, Khapa and Sijhora.' },
      { question: 'Which gate should I use for Kanha?', answer: 'Use Khatia for the western side, Mukki for the south and Sarhi for the north-east. The correct choice follows your confirmed zone permits.' },
      { question: 'What is the best time to visit Kanha?', answer: 'Mid-October to February is coolest, March and April balance comfort with drier habitat, and May to June is hottest with wildlife more dependent on water.' },
      { question: 'How many days are enough for Kanha?', answer: 'Plan at least two nights and four drives. Three or four nights gives better scope to mix zones and absorb weather or wildlife movement changes.' },
      { question: 'How much does a Kanha safari package cost?', answer: 'Prices depend on duration, stay, permit type and availability. The current packages shown on this page start from ₹11,900 per person.' },
      { question: 'Is Kanha suitable for children and older travellers?', answer: 'Yes, with sensible preparation. Winter mornings can be very cold and drives are bumpy, so choose warm layers, an appropriate vehicle seat and a comfortable lodge near the gate.' },
      { question: 'Are tiger sightings guaranteed in Kanha?', answer: 'No. All sightings are governed by natural animal movement and chance. Multiple drives across well-chosen zones improve opportunity but cannot guarantee a tiger.' },
    ],
  },

  bandhavgarh: {
    slug: 'bandhavgarh-jungle-safari-booking',
    jungle: 'bandhavgarh',
    name: 'Bandhavgarh',
    fullName: 'Bandhavgarh Tiger Reserve',
    region: 'Madhya Pradesh',
    title: 'Bandhavgarh Jungle Safari Booking 2026 | Zones & Packages',
    description: 'Plan a Bandhavgarh jungle safari with zone permits, gate-side stays and naturalist drives. Compare Tala, Magadhi, Khitauli and packages from ₹11,900.',
    eyebrow: 'Safari Booking Assistance',
    subtitle: 'Book zone permits, gate-side stays and guided drives across Bandhavgarh’s compact tiger habitat and historic forest landscape.',
    heroImage: tigerRunning,
    heroAlt: 'Bengal tiger moving through forest habitat during a wildlife safari',
    zonesImage: bandhavgarhHero,
    zonesAlt: 'Forest habitat in Bandhavgarh Tiger Reserve',
    bottomImage: tigerFamily,
    bottomAlt: 'Bengal tiger family resting in forest habitat',
    quickAnswer: 'Choose dates and a mix of Tala, Magadhi, Khitauli or buffer permits, submit exact traveller IDs, and stay near Tala village or the appropriate gate. Popular core permits can sell early, so build the safari plan before locking flights.',
    howToIntro: 'Bandhavgarh’s tourism areas are easier to understand than its reputation suggests: three core zones, three principal buffer zones and accommodation concentrated around Tala.',
    howToSteps: [
      { name: 'Choose dates and drive count', text: 'Four drives is a useful minimum; six or more gives a better chance to rotate through different habitat.' },
      { name: 'Build a zone mix', text: 'Combine available Tala, Magadhi and Khitauli permits, adding buffer routes when they improve the schedule.' },
      { name: 'Book through the official system', text: 'Permits are date, shift and zone specific on the Madhya Pradesh forest portal.' },
      { name: 'Submit exact photo-ID details', text: 'The original document at the gate must match the information printed on the permit.' },
      { name: 'Confirm Tala-side logistics', text: 'Most lodges use Tala as a base, but early transfers should still be checked against the assigned gate.' },
    ],
    officialLinks: [{ label: 'Madhya Pradesh forest booking portal', href: 'https://forest.mponline.gov.in/' }],
    bestTimeIntro: 'Bandhavgarh’s season moves from green forest and cool mornings into hot, open summer conditions around the remaining water sources.',
    seasons: [
      { label: 'Mid-October – November', text: 'Green scenery, comfortable afternoons and atmospheric forest light.' },
      { label: 'December – February', text: 'Cold dawns, pleasant days and the easiest weather for most travellers.' },
      { label: 'March – April', text: 'Warmer temperatures, less foliage and strong all-round safari conditions.' },
      { label: 'May – mid-June', text: 'Intense heat and dust; wildlife increasingly concentrates near water.' },
    ],
    bestTimeNote: 'The usual notified tourism season runs from mid-October to mid-June, but the forest department can alter access dates and routes.',
    zonesIntro: 'Bandhavgarh has three well-known core zones and surrounding buffer landscapes. Each permit is tied to a zone, so a balanced itinerary matters more than chasing one famous name.',
    zoneBullets: [
      { label: 'Core zones', text: 'Tala, Magadhi and Khitauli offer established tourism routes through different terrain.' },
      { label: 'Buffer zones', text: 'Dhamokhar, Johila and Panpatha expand route options and often have lighter vehicle pressure.' },
    ],
    zoneNote: 'Tala is popular, but tiger ranges cross administrative boundaries. Current movement, permit availability and the total number of drives should guide the plan.',
    zoneCaption: 'Bandhavgarh core and buffer zones compared',
    zoneRows: [
      { zone: 'Tala', gates: 'Tala', density: 'Most popular', bestFor: 'First visits and classic Bandhavgarh scenery' },
      { zone: 'Magadhi', gates: 'Magadhi access', density: 'Popular', bestFor: 'Mixed habitat and multi-zone itineraries' },
      { zone: 'Khitauli', gates: 'Khitauli access', density: 'Moderate', bestFor: 'Quieter drives and varied wildlife' },
      { zone: 'Buffer routes', gates: 'Dhamokhar, Johila, Panpatha', density: 'Generally lower', bestFor: 'Extra drives and alternate availability' },
    ],
    chargesIntro: 'The total changes with zone, permit type, vehicle sharing, nationality, guide charges and accommodation. Our package prices bundle the planned permit, vehicle, naturalist and stay while official fees remain subject to the Madhya Pradesh portal.',
    timingsIntro: 'Day visitors enter in morning and afternoon shifts. Exact reporting, entry and exit times change with daylight and the notified season.',
    timings: [
      { label: 'Morning safari', text: 'Reports before sunrise and normally runs for around four hours.' },
      { label: 'Afternoon safari', text: 'Begins after lunch and closes before dusk at the time stated on the permit.' },
    ],
    timingsNote: 'Allow enough time to reach the assigned gate. Vehicle formalities and identity checks happen before entry.',
    reachIntro: 'Umaria is the closest railhead, while Jabalpur is the most commonly used airport. Katni is another useful railway connection.',
    reachCaption: 'Approximate road distances to Bandhavgarh tourism zones',
    reachFirstColumn: 'Entry area',
    reachRows: [
      { place: 'Tala from Umaria', distance: 'About 32 km', time: '45–60 minutes' },
      { place: 'Tala from Katni', distance: 'About 100 km', time: '2.5–3 hours' },
      { place: 'Tala from Jabalpur', distance: 'About 167 km', time: '4–4.5 hours' },
      { place: 'Khitauli from Umaria', distance: 'About 37 km', time: 'About 1 hour' },
    ],
    reachNote: 'Keep arrival day free of tight safari connections, especially when reaching Jabalpur by a delayed flight.',
    packagesIntro: 'These Bandhavgarh itineraries combine zone planning, safari vehicle, naturalist and a comfortable stay near the relevant entry side.',
    safariRules: sharedRules,
    thingsToCarry: sharedCarry,
    relatedGuides: commonGuides('bandhavgarh', 'Bandhavgarh'),
    faqs: [
      { question: 'How do I book a Bandhavgarh jungle safari?', answer: 'Choose a date, shift and zone on the official Madhya Pradesh forest portal, enter exact traveller ID details, then arrange the vehicle, guide and a suitable Tala-side stay.' },
      { question: 'What are the safari zones in Bandhavgarh?', answer: 'The core tourism zones are Tala, Magadhi and Khitauli. Important buffer routes include Dhamokhar, Johila and Panpatha.' },
      { question: 'Is Tala the best Bandhavgarh zone?', answer: 'Tala is famous and popular, but it is not a guarantee. Tigers use multiple zones, and a mix of available routes is often more useful than relying on Tala alone.' },
      { question: 'What is the best time to visit Bandhavgarh?', answer: 'December to February has the easiest weather. March and April are warmer with less foliage, while May to mid-June is very hot and wildlife is more dependent on water.' },
      { question: 'How many safaris should I book?', answer: 'Book at least four drives over two nights. Six or more drives provide better zone variety for a long-distance or photography-focused trip.' },
      { question: 'How much does a Bandhavgarh package cost?', answer: 'The price depends on stay category, safari count and permit availability. Current packages displayed on this page start from ₹11,900 per person.' },
      { question: 'Which station is closest to Bandhavgarh?', answer: 'Umaria is the closest commonly used railhead, roughly 32 km from Tala. Katni has more rail connections but is farther away.' },
      { question: 'Are tiger sightings guaranteed?', answer: 'No. Bandhavgarh is a natural wild habitat. Careful route planning and multiple drives improve opportunity but cannot guarantee any animal sighting.' },
    ],
  },

  ranthambore: {
    slug: 'ranthambore-jungle-safari-booking',
    jungle: 'ranthambore',
    name: 'Ranthambore',
    fullName: 'Ranthambore Tiger Reserve',
    region: 'Rajasthan',
    title: 'Ranthambore Jungle Safari Booking 2026 | Zones & Packages',
    description: 'Book a Ranthambore jungle safari with official permit guidance, Gypsy or canter planning, stays and packages from ₹12,690.',
    eyebrow: 'Safari Booking Assistance',
    subtitle: 'Plan permits, Gypsy or canter seats, naturalist-led drives and a Sawai Madhopur stay for Rajasthan’s landmark tiger reserve.',
    heroImage: ranthamboreHero,
    heroAlt: 'Bengal tiger in the dry forest landscape of Ranthambore',
    zonesImage: tigerForest,
    zonesAlt: 'Tiger walking through dry deciduous tiger habitat',
    bottomImage: tigerJeep,
    bottomAlt: 'Open safari vehicle watching a Bengal tiger on a forest track',
    quickAnswer: 'Choose travel dates, vehicle format and safari shifts, then submit matching traveller IDs through the Rajasthan forest booking system. Stay in or near Sawai Madhopur and book early for high-demand winter weekends and holidays.',
    howToIntro: 'Ranthambore booking combines a dated permit, a safari shift, a Gypsy or canter format, identity details and a zone allocation or preference under current forest rules.',
    howToSteps: [
      { name: 'Choose dates and shifts', text: 'Plan at least three or four drives if Ranthambore is the main purpose of the trip.' },
      { name: 'Select Gypsy or canter', text: 'A Gypsy is smaller and more flexible; a canter is a larger shared vehicle and can provide alternate availability.' },
      { name: 'Check the official portal', text: 'Use the Rajasthan Forest Department booking route and read the current allocation and cancellation rules.' },
      { name: 'Enter exact traveller IDs', text: 'Carry the original documents that match every name and number on the permit.' },
      { name: 'Confirm Sawai Madhopur logistics', text: 'Keep the hotel, pickup point and reporting time aligned with the safari booking.' },
    ],
    officialLinks: [{ label: 'Rajasthan Forest safari booking page', href: 'https://forest.rajasthan.gov.in/content/raj/forest/en/citizen-services/safari-zoo-ticket-booking.html' }],
    bestTimeIntro: 'Ranthambore is open through the cooler winter and dry summer season, with a visible shift from green post-monsoon forest to hot, sparse late-season habitat.',
    seasons: [
      { label: 'October – November', text: 'Greener scenery, comfortable weather and attractive fort-and-forest photography.' },
      { label: 'December – February', text: 'Cold mornings and the most popular travel period; book well ahead.' },
      { label: 'March – April', text: 'Warm days, drier vegetation and a strong balance for safari travel.' },
      { label: 'May – June', text: 'Very hot conditions, fewer casual visitors and increasing use of water sources.' },
    ],
    bestTimeNote: 'The regular season generally runs from October through June, subject to weather and Rajasthan Forest Department notifications.',
    zonesIntro: 'Ranthambore’s tourism routes are divided into ten numbered zones. Zone access and assignment procedures can change, so treat portal rules—not old blog posts—as authoritative.',
    zoneBullets: [
      { label: 'Zones 1–5', text: 'Older park routes associated with the fort, lakes and central tourism landscape.' },
      { label: 'Zones 6–10', text: 'Outer and adjoining landscapes with different terrain, water and vehicle patterns.' },
    ],
    zoneNote: 'A numbered zone is not a sighting promise. Tigers move between territories, and every drive depends on recent movement and chance.',
    zoneCaption: 'Ranthambore zone groups and safari character',
    zoneRows: [
      { zone: 'Zones 1–2', gates: 'Assigned reporting route', density: 'Popular', bestFor: 'Classic dry forest and escarpment scenery' },
      { zone: 'Zones 3–5', gates: 'Assigned reporting route', density: 'Popular', bestFor: 'Lake, fort and mixed woodland landscapes' },
      { zone: 'Zones 6–8', gates: 'Outer tourism routes', density: 'Varies', bestFor: 'Open terrain and alternate availability' },
      { zone: 'Zones 9–10', gates: 'More distant outer routes', density: 'Often lower', bestFor: 'Repeat visits and broader landscapes' },
    ],
    chargesIntro: 'The booking total varies with Gypsy or canter format, permit rules, traveller category, guide and transfer arrangements, and the chosen stay. The packages below combine the planned components in one price.',
    timingsIntro: 'Ranthambore uses two daily visitor shifts. Exact entry and exit times move with the season and are shown on the confirmed booking.',
    timings: [
      { label: 'Morning safari', text: 'Begins around sunrise; winter reporting is later than in the warmer months.' },
      { label: 'Afternoon safari', text: 'Begins after lunch and ends before sunset at the notified gate time.' },
    ],
    timingsNote: 'Pickup and reporting procedures vary by booking format. Be ready before the stated time and keep original IDs accessible.',
    reachIntro: 'Sawai Madhopur is the safari base and has direct rail links from major cities. Jaipur is the most useful airport for most visitors.',
    reachCaption: 'Approximate routes to Ranthambore and Sawai Madhopur',
    reachFirstColumn: 'Route',
    reachRows: [
      { place: 'Sawai Madhopur station to park area', distance: 'About 14 km', time: '25–35 minutes' },
      { place: 'Jaipur airport to Sawai Madhopur', distance: 'About 180 km', time: '3.5–4.5 hours' },
      { place: 'Kota to Sawai Madhopur', distance: 'About 140 km', time: 'Around 3 hours' },
      { place: 'Delhi to Sawai Madhopur', distance: 'About 380 km', time: '7–8 hours by road' },
    ],
    reachNote: 'Train travel is often more reliable than a same-day road connection from Delhi. Keep the first safari clear of tight arrival times.',
    packagesIntro: 'These Ranthambore packages combine the planned safari format, naturalist arrangements, local transfers and a Sawai Madhopur stay.',
    safariRules: sharedRules,
    thingsToCarry: sharedCarry,
    relatedGuides: commonGuides('ranthambore', 'Ranthambore'),
    faqs: [
      { question: 'How do I book a Ranthambore jungle safari?', answer: 'Choose dates, shifts and Gypsy or canter format through the Rajasthan Forest Department route, submit exact traveller IDs and follow the current zone-allocation rules.' },
      { question: 'What is the difference between a Gypsy and a canter?', answer: 'A Gypsy is a smaller open vehicle, while a canter carries a larger shared group. Availability, pricing and pickup procedures can differ.' },
      { question: 'Which Ranthambore zone is best?', answer: 'No zone guarantees a tiger. Zones 1–5 cover older central routes and zones 6–10 cover wider outer landscapes; current animal movement matters more than reputation.' },
      { question: 'What is the best time to visit Ranthambore?', answer: 'October to February is most comfortable and popular. March and April are warmer, while May and June are very hot with wildlife more dependent on water.' },
      { question: 'How many Ranthambore safaris should I book?', answer: 'Three or four drives is a sensible minimum for a tiger-focused trip. More drives provide more zone and weather variety.' },
      { question: 'How much does a Ranthambore package cost?', answer: 'It depends on vehicle type, stay, safari count and permit availability. Current packages shown here start from ₹12,690 per person.' },
      { question: 'Where should I stay for Ranthambore?', answer: 'Stay in or near Sawai Madhopur on a route compatible with your safari pickup and reporting point. Confirm logistics before paying for the hotel.' },
      { question: 'Are tiger sightings guaranteed?', answer: 'No. Ranthambore is a wild reserve. Multiple drives and experienced route planning improve opportunity but cannot guarantee a sighting.' },
    ],
  },

  'jim-corbett': {
    slug: 'jim-corbett-jungle-safari-booking',
    jungle: 'jim-corbett',
    name: 'Jim Corbett',
    fullName: 'Corbett Tiger Reserve',
    region: 'Uttarakhand',
    title: 'Jim Corbett Jungle Safari Booking 2026 | Zones & Packages',
    description: 'Book a Jim Corbett jungle safari with zone-specific permits, Ramnagar stays and guided drives. Compare seasons and packages from ₹10,790.',
    eyebrow: 'Safari Booking Assistance',
    subtitle: 'Plan official zone permits, Ramnagar-side stays and guided drives across Corbett’s riverine forest and Himalayan foothills.',
    heroImage: corbettHero,
    heroAlt: 'Bengal tiger in the forest landscape of Corbett Tiger Reserve',
    zonesImage: tigerGrassland,
    zonesAlt: 'Tiger moving through tall grass in a riverine wildlife habitat',
    bottomImage: forestRoad,
    bottomAlt: 'Forest safari road through an Indian tiger reserve',
    quickAnswer: 'Choose a Corbett zone by its seasonal opening, entry gate and travel time from Ramnagar, then book only through the official Corbett portal or a clearly identified package operator. Bijrani and Dhikala are seasonal; Jhirna, Dhela and Garjia are listed for year-round access subject to conditions.',
    howToIntro: 'Corbett is not one interchangeable safari area. Each zone has a separate gate, operating season and route, and Dhikala also has distinct day-canter and overnight formats.',
    howToSteps: [
      { name: 'Choose the safari format', text: 'Decide between a day jeep safari, a Dhikala canter visit or an eligible overnight forest-rest-house plan.' },
      { name: 'Match the zone to the season', text: 'Check current opening dates before selecting Bijrani, Dhikala, Durgadevi, Sonanadi, Pakhro or a year-round-listed zone.' },
      { name: 'Use the official Corbett portal', text: 'Avoid lookalike booking sites. Corbett’s own website explicitly identifies the authorised online portal.' },
      { name: 'Submit exact traveller IDs', text: 'Names, ages and document details must match the original IDs carried to the gate.' },
      { name: 'Plan from Ramnagar', text: 'Set the pickup and stay according to the entry gate; early drives leave little room for cross-town delays.' },
    ],
    officialLinks: [{ label: 'Official Corbett booking portal', href: 'https://corbettgov.org/' }],
    bestTimeIntro: 'The right Corbett month depends heavily on the zone. Some routes are listed year-round, while the best-known seasonal zones open only after the monsoon.',
    seasons: [
      { label: 'Mid-October – November', text: 'Bijrani reopens first; temperatures settle and the post-monsoon forest remains green.' },
      { label: 'Mid-November – February', text: 'Dhikala and other seasonal zones reopen; mornings are cold and clear.' },
      { label: 'March – April', text: 'Comfortable to warm weather with broad seasonal-zone access.' },
      { label: 'May – June', text: 'Hot, dusty drives; several seasonal zones close around mid- or late June.' },
    ],
    bestTimeNote: 'Jhirna, Dhela and Garjia are listed by the official portal as throughout-year zones, but weather or management orders can still suspend access.',
    zonesIntro: 'Corbett’s zones differ in gate, habitat, opening season and safari format. Check current official status rather than assuming every zone opens together.',
    zoneBullets: [
      { label: 'Seasonal zones', text: 'Bijrani usually opens from 15 October; Dhikala, Durgadevi, Sonanadi and Pakhro are listed from 15 November with June closures.' },
      { label: 'Throughout-year listed zones', text: 'Jhirna, Dhela and Garjia can operate outside the core season when weather and road conditions allow.' },
    ],
    zoneNote: 'Dhikala day visits usually use a canter format, while overnight access follows separate accommodation and permit rules.',
    zoneCaption: 'Corbett tourism zones, gates and usual season',
    zoneRows: [
      { zone: 'Bijrani', gates: 'Amdanda', density: 'Popular', bestFor: 'Day jeep safaris, usually 15 Oct–30 Jun' },
      { zone: 'Dhikala', gates: 'Dhangari', density: 'Controlled format', bestFor: 'Canter or eligible overnight plans, usually 15 Nov–15 Jun' },
      { zone: 'Jhirna and Dhela', gates: 'Dhela gate', density: 'Varies', bestFor: 'Throughout-year listed day access' },
      { zone: 'Durgadevi / Sonanadi / Pakhro', gates: 'Zone-specific gates', density: 'Generally lower', bestFor: 'Seasonal routes, usually 15 Nov–15 Jun' },
    ],
    chargesIntro: 'Corbett prices vary by zone, day-jeep or canter format, permit category, vehicle, guide and accommodation. Use the official portal for current permit components; the packages below show combined trip pricing.',
    timingsIntro: 'Corbett runs morning and afternoon day-safari windows, but reporting times and drive lengths differ by zone and month.',
    timings: [
      { label: 'Morning safari', text: 'Early reporting at the assigned gate, with timing adjusted for seasonal daylight.' },
      { label: 'Afternoon safari', text: 'Post-lunch entry and return before the zone’s notified evening closure.' },
    ],
    timingsNote: 'The official portal currently states that mobile phones are prohibited in core tourism zones. Follow the latest permit and gate instructions.',
    reachIntro: 'Ramnagar is the gateway town and the practical base for day safaris. Pantnagar is the nearest commonly used airport; Delhi is the main long-distance road origin.',
    reachCaption: 'Approximate routes to Ramnagar and Corbett',
    reachFirstColumn: 'Route',
    reachRows: [
      { place: 'Ramnagar station to local hotels/gates', distance: 'Roughly 0–20 km', time: '15–45 minutes' },
      { place: 'Pantnagar airport to Ramnagar', distance: 'About 80 km', time: '2–2.5 hours' },
      { place: 'Delhi to Ramnagar', distance: 'About 250 km', time: '5.5–7 hours' },
      { place: 'Dehradun airport to Ramnagar', distance: 'About 220 km', time: '5–6 hours' },
    ],
    reachNote: 'Gate distances vary significantly. Confirm the booked zone before choosing a Ramnagar-area resort or arranging a pickup.',
    packagesIntro: 'These Corbett packages combine the appropriate safari format, guide arrangements and a stay positioned for the selected gate.',
    safariRules: [
      ...sharedRules,
      'Mobile phones are currently prohibited in core tourism zones; check the latest official notice before arrival.',
    ],
    thingsToCarry: sharedCarry,
    relatedGuides: commonGuides('jim-corbett', 'Jim Corbett'),
    faqs: [
      { question: 'How do I book a Jim Corbett jungle safari?', answer: 'Choose the zone, date, shift and safari format on the official Corbett portal, enter exact traveller IDs, then match the Ramnagar stay and transfer to the entry gate.' },
      { question: 'Which Corbett zones are open all year?', answer: 'The official portal lists Jhirna, Dhela and Garjia for throughout-year access, subject to weather, road and management conditions.' },
      { question: 'When do Bijrani and Dhikala open?', answer: 'The official zone table lists Bijrani from 15 October to 30 June and Dhikala from 15 November to 15 June, subject to current orders.' },
      { question: 'Can I take a jeep into Dhikala for a day safari?', answer: 'Dhikala day tourism commonly uses a canter format. Jeep access is connected to eligible overnight arrangements and current official rules.' },
      { question: 'What is the best time to visit Jim Corbett?', answer: 'Mid-November to February offers cool weather and broad seasonal access. March to June is warmer and drier. The right month depends on the zone you want.' },
      { question: 'How much does a Jim Corbett package cost?', answer: 'The total depends on zone, format, stay and permit availability. Current packages displayed here start from ₹10,790 per person.' },
      { question: 'Are mobile phones allowed on a Corbett safari?', answer: 'The official portal currently says mobile phones are prohibited in core tourism zones. Check the latest notice and leave the phone securely at your hotel or as instructed.' },
      { question: 'Are tiger sightings guaranteed in Corbett?', answer: 'No. Corbett is a large natural landscape. A carefully selected zone and multiple drives improve opportunity but cannot guarantee a tiger sighting.' },
    ],
  },
};
