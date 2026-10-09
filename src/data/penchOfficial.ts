/**
 * Pench facts for the Pench planning guides. Sources, checked October 2026:
 * - MP side: Pench Tiger Reserve FAQ + MPOnline portal (forest.mponline.gov.in) — gates, quotas,
 *   2026–27 timings, closures, cancellation, ID, vehicle and child rules, mini bus.
 * - Maharashtra side: Maharashtra Forest Department ecotourism portal (mahaecotourism.gov.in);
 *   timings follow the state's standard safari schedule.
 * - Per-Gypsy totals (permit + guide + vehicle) are not published as one figure by MP; the
 *   totals below are current market totals cross-checked across operator listings — label them
 *   as approximate wherever they appear.
 */
import type { TimingRow } from './tadobaOfficial';

export const penchSources = {
  mpFaq: 'https://forest.mponline.gov.in/Images/PenchFAQ.pdf',
  mpPortal: 'https://forest.mponline.gov.in/',
  mhPortal: 'https://www.mahaecotourism.gov.in/',
  checked: 'October 2026',
};

export const penchFacts = {
  mpArea: '1,179.63 sq km',
  mpCore: '411.33 sq km',
  mpBuffer: '768.30 sq km',
  mhArea: '741.22 sq km',
  mhCore: '257.26 sq km',
  mhBuffer: '483.96 sq km',
  tigersMp: 77,
  tigersMh: 41,
  tigerYear: 2022,
  history: 'Sanctuary 1977, national park 1983, tiger reserve November 1992 (MP side)',
};

export interface PenchSide {
  key: 'mp' | 'mh';
  name: string;
  core: string[];
  buffer: string[];
  booking: string;
  note: string;
}

export const penchSides: PenchSide[] = [
  {
    key: 'mp',
    name: 'Madhya Pradesh side (Pench National Park)',
    core: ['Turia', 'Karmajhiri', 'Jamtara'],
    buffer: ['Rukhad', 'Telia', 'Khawasa', 'Kumbhpani'],
    booking: 'MPOnline (forest.mponline.gov.in), 120 days ahead',
    note: 'The classic Pench of the Jungle Book country, in Seoni and Chhindwara districts. Turia is the main gate.',
  },
  {
    key: 'mh',
    name: 'Maharashtra side (Pench Tiger Reserve, Nagpur)',
    core: ['Sillari', 'Khursapar', 'Chorbahuli', 'Khubala'],
    buffer: ['Buffer routes off the same gates'],
    booking: 'Maharashtra Forest Department ecotourism portal',
    note: 'Closer to Nagpur, quieter, with its own booking system and gate-wise weekly holidays.',
  },
];

/** MP core quotas per the reserve's FAQ (vehicles per shift). */
export const mpGateQuota = [
  { gate: 'Turia', perShift: 34, perDay: 68 },
  { gate: 'Karmajhiri', perShift: 6, perDay: 12 },
  { gate: 'Jamtara', perShift: 4, perDay: 8 },
  { gate: 'Buffer (Rukhad, Telia)', perShift: 15, perDay: 30 },
];

/** MP side, 2026–27 entry/exit times published on MPOnline. */
export const mpTimings: TimingRow[] = [
  { season: 'October – November', morning: '6:00 am – 11:30 am', evening: '3:00 pm – 6:00 pm' },
  { season: 'December – January', morning: '6:20 am – 11:30 am', evening: '3:00 pm – 6:00 pm' },
  { season: 'February – March', morning: '6:10 am – 11:30 am', evening: '3:00 pm – 6:30 pm' },
  { season: 'April – June', morning: '5:30 am – 11:00 am', evening: '3:30 pm – 7:00 pm' },
];

/** Maharashtra side, as published on penchtigerreserve.maharashtra.gov.in/ecotourism (checked October 2026). */
export const mhTimings: TimingRow[] = [
  { season: '1 Oct – 31 Oct', morning: '6:00 am – 10:00 am', evening: '2:30 pm – 6:30 pm' },
  { season: '1 Nov – 31 Jan', morning: '6:30 am – 10:30 am', evening: '2:00 pm – 6:00 pm' },
  { season: '1 Feb – 31 Mar', morning: '6:00 am – 10:00 am', evening: '2:30 pm – 6:30 pm' },
  { season: '1 Apr – 30 Jun', morning: '5:30 am – 9:30 am', evening: '3:00 pm – 7:00 pm' },
];

export const penchClosures = [
  { what: 'MP core: weekly', when: 'Afternoon safaris closed every Wednesday' },
  { what: 'MP core: festivals', when: 'Afternoon safaris closed on Holi and Diwali' },
  { what: 'Core monsoon closure (both states)', when: '1 July – 30 September (reopens 1 October)' },
  { what: 'Maharashtra gates: weekly', when: 'Each gate has its own day off: Sillari Wednesday, Khursapar Tuesday, Chorbahuli Monday' },
];

/** Approximate total per Gypsy (permit + guide + vehicle), current season. */
export const penchGypsyTotals = [
  { what: 'MP core: Indian visitors', weekday: 10100, weekend: 10700 },
  { what: 'MP core: foreign visitors', weekday: 13500, weekend: 14700 },
  { what: 'MP buffer: Indian visitors', weekday: 8500, weekend: 8500 },
  { what: 'MP buffer: foreign visitors', weekday: 9300, weekend: 9300 },
  { what: 'Maharashtra side: Indian visitors', weekday: 7200, weekend: 7700 },
  { what: 'Maharashtra side: foreign visitors', weekday: 8000, weekend: 8500 },
];

/** MP permit cancellation scale, per the reserve's FAQ (portal charges are never refunded). */
export const mpCancellation = [
  { when: '60 days or more before the safari', refund: 'Full permit amount refunded' },
  { when: '30–59 days before', refund: '25% of the permit value deducted' },
  { when: '15–29 days before', refund: '50% deducted' },
  { when: '5–14 days before', refund: '75% deducted' },
  { when: 'Less than 5 days before', refund: 'No refund' },
];

export const mpBookingRules = [
  'Permits open on MPOnline 120 days ahead (the portal releases the new date at 11 am).',
  'Full-vehicle and single-seat permits are both sold. A Gypsy carries up to 6 guests plus the driver and a compulsory guide.',
  'Current (same-day) permits are sold at the Turia, Karmajhiri and Jamtara gates: for the next morning between 6 and 8 pm the evening before, and for the afternoon between 9 and 11 am the same day.',
  'The permit fee covers entry only. The guide and the registered Gypsy are paid separately at the gate, and private vehicles are not allowed in.',
  'Children up to 5 years old are exempt from the entry fee.',
  'A full-vehicle permit stays valid for one hour after the scheduled entry time, and a single-seat permit for 30 minutes. After that it is cancelled.',
  'Permits can be rescheduled online from the same MPOnline login.',
];

export const penchIdRules = [
  'Carry the entry permit and one original photo ID: Aadhaar, voter ID, driving licence, PAN, government employee card, passport or student ID.',
  'Foreign nationals should carry their passport.',
  'The ID must match the details on the permit.',
];

export const penchConduct = [
  { rule: 'Leaving the vehicle in the core', detail: 'Strictly prohibited. Only safaris on designated routes are allowed' },
  { rule: 'Phones', detail: 'Allowed on the MP side, but kept on silent' },
  { rule: 'Feeding or teasing animals', detail: 'Prohibited' },
  { rule: 'Clothing', detail: 'Avoid bright colours. Wear warm layers from November to February' },
  { rule: 'Plants and streams', detail: 'Don\'t touch plants, eat leaves or fruit, or drink from streams' },
  { rule: 'Cameras', detail: 'Still and video cameras are free on regular safaris' },
];

export const mpMiniBus = { seats: 18, price: 510, gate: 'Turia' };

export const inr = (n: number) => `₹${n.toLocaleString('en-IN')}`;
