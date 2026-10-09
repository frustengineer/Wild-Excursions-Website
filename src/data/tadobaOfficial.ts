/**
 * Facts published by the Tadoba-Andhari Tiger Reserve on its official portal
 * (mytadoba.mahaforest.gov.in → Book My Safari), checked October 2026.
 * Every Tadoba guide page reads from here so a rule or fee change is a one-file edit.
 */

export const officialSource = {
  name: 'Tadoba-Andhari Tiger Reserve official portal',
  url: 'https://mytadoba.mahaforest.gov.in/touristhub-wildlifesafaris',
  checked: 'October 2026',
};

export const reserveFacts = {
  totalArea: '1,727.59 sq km',
  coreArea: '625.82 sq km',
  bufferArea: '1,101.77 sq km',
  nationalParkArea: '116.55 sq km',
  andhariArea: '508.85 sq km',
  established: '1993 (Tadoba National Park, 1955 + Andhari Wildlife Sanctuary, 1986)',
  tigers: '80+ inside the reserve (official estimate), around 200 across the wider landscape',
  coreGates: 6,
  bufferGates: 16,
};

export interface TourismZone {
  key: string;
  name: string;
  core: string[];
  buffer: string[];
  side: string;
}

/** The official portal groups every gate into four tourism zones. */
export const tourismZones: TourismZone[] = [
  {
    key: 'moharli',
    name: 'Moharli Zone',
    core: ['Moharli', 'Khutwanda'],
    buffer: ['Agarzari', 'Adegaon', 'Dewada', 'Junona'],
    side: 'South-west, on the Chandrapur side, along the Irai reservoir',
  },
  {
    key: 'kolara',
    name: 'Kolara Zone',
    core: ['Kolara'],
    buffer: ['Kolara Chauradeo', 'Madnapur', 'Belara', 'Alizanza', 'Shirkada', 'Palasgaon (noon slot)'],
    side: 'North, on the Nagpur–Umred–Chimur side',
  },
  {
    key: 'navegaon',
    name: 'Navegaon Zone',
    core: ['Navegaon'],
    buffer: ['Navegaon Ramdegi', 'Nimdhela'],
    side: 'North-west, between Kolara and Moharli',
  },
  {
    key: 'pangdi-zari',
    name: 'Pangdi & Zari Zone',
    core: ['Pangdi', 'Zari'],
    buffer: ['Pangdi Aswal Chuha', 'Keslaghat', 'Zari Peth', 'Mamla', 'Somnath'],
    side: 'East and south-east, on the Sindewahi–Mul side (the old Kolsa range)',
  },
];

export interface TimingRow {
  season: string;
  morning: string;
  noon?: string;
  evening: string;
}

export const coreTimings: TimingRow[] = [
  { season: '1 Oct – 31 Oct', morning: '6:00 am – 10:00 am', evening: '2:30 pm – 6:30 pm' },
  { season: '1 Nov – 28/29 Feb', morning: '6:30 am – 10:30 am', evening: '2:00 pm – 6:00 pm' },
  { season: '1 Mar – 30 Apr', morning: '6:00 am – 10:00 am', evening: '2:30 pm – 6:30 pm' },
  { season: '1 May – 30 Jun', morning: '5:30 am – 9:30 am', evening: '3:00 pm – 7:00 pm' },
];

export const bufferTimings: TimingRow[] = [
  { season: '1 Oct – 31 Oct', morning: '6:00 am – 10:00 am', noon: '10:30 am – 1:30 pm', evening: '2:30 pm – 6:30 pm' },
  { season: '1 Nov – 28/29 Feb', morning: '6:30 am – 10:30 am', noon: '10:35 am – 1:45 pm', evening: '2:00 pm – 6:00 pm' },
  { season: '1 Mar – 30 Apr', morning: '6:00 am – 10:00 am', noon: '10:30 am – 1:35 pm', evening: '2:30 pm – 6:30 pm' },
  { season: '1 May – 30 Jun', morning: '5:30 am – 9:30 am', noon: '10:30 am – 1:35 pm', evening: '3:00 pm – 7:00 pm' },
  { season: '1 Jul – 30 Sep (monsoon)', morning: '6:00 am – 10:00 am', noon: '10:30 am – 1:00 pm', evening: '2:30 pm – 6:30 pm' },
];

export const closures = [
  { what: 'Core zone weekly holiday', when: 'Every Tuesday' },
  { what: 'Buffer zone weekly holiday', when: 'Every Wednesday' },
  { what: 'Core zone monsoon closure', when: '1 July – 30 September (reopens 1 October)' },
  { what: 'Buffer zone in monsoon', when: 'Open, subject to rain and road conditions' },
  { what: 'Unscheduled closures', when: 'Any zone can shut without notice for floods, heavy rain, strikes or emergencies' },
];

/** Full-vehicle (Gypsy) fees in ₹, for up to 6 guests in the buffer and the standard core permit. */
export const coreFees = [
  { window: 'Booked 1–59 days ahead, Mon–Fri', entry: 1800, guide: 700, gypsy: 3300, total: 5800 },
  { window: 'Booked 1–59 days ahead, Sat–Sun', entry: 2800, guide: 700, gypsy: 3300, total: 6800 },
  { window: 'Booked 60–120 days ahead, Mon–Fri', entry: 4800, guide: 700, gypsy: 3300, total: 8800 },
  { window: 'Booked 60–120 days ahead, Sat–Sun', entry: 8800, guide: 700, gypsy: 3300, total: 12800 },
];

export const bufferFees = [
  { window: 'Mon–Fri', entry: 2300, guide: 700, gypsy: 3000, total: 6000 },
  { window: 'Sat–Sun', entry: 3300, guide: 700, gypsy: 3000, total: 7000 },
];

export const fullDayFees = [
  { what: 'Full-day buffer safari, Indian visitors', total: 50000 },
  { what: 'Full-day buffer safari, foreign visitors', total: 70000 },
  { what: 'Full-day core photography safari, Indian visitors', total: 50000 },
  { what: 'Full-day core photography safari, foreign visitors', total: 70000 },
];

export const cancellation = [
  { when: '1–3 days before the safari', refund: 'No refund' },
  { when: '4–15 days before', refund: '20% of the booking amount' },
  { when: '16–59 days before', refund: '50% of the booking amount' },
  { when: '60–120 days before', refund: 'No refund (as published by the reserve)' },
  { when: 'Full-day safari', refund: 'No cancellation or refund' },
];

export const bookingRules = [
  'Regular online booking opens at 12:00 am IST, 120 days before the safari date.',
  'Tatkal booking opens at 8:00 am IST, three days before the safari date.',
  'On a full-day safari, a core Gypsy can carry up to 4 guests and a buffer Gypsy up to 6, not counting the driver and guide.',
  'Up to two children under 8 ride free per Gypsy and do not need to be named on the booking.',
  'Bookings cannot be transferred, and names cannot be swapped once confirmed.',
  'A no-show gets no refund and no reschedule.',
  'If the reserve shuts a whole zone itself, you get a full refund. Partial closures are not refunded.',
];

export const idRules = [
  'Every guest must show the original ID used at the time of booking. Photocopies and phone photos are refused.',
  'Indian visitors can use Aadhaar, passport, PAN, driving licence, voter ID or another government photo ID.',
  'Foreign nationals must carry their passport. No other ID is accepted.',
  'The ID number on the permit has to match the card exactly, or the booking is treated as invalid.',
];

export const conductRules = [
  { rule: 'Speed limit inside the reserve', detail: '20 km/h' },
  { rule: 'Gap between two safari vehicles', detail: 'At least 50 metres' },
  { rule: 'Distance from any wild animal', detail: 'At least 20 metres, for no more than 15 minutes' },
  { rule: 'Leaving the vehicle', detail: 'Only at designated points' },
  { rule: 'Phones, music, horns, shouting', detail: 'Not allowed. Using banned electronics can cost ₹5,000' },
  { rule: 'Plastic, alcohol, non-veg food, firearms, pets', detail: 'All prohibited inside the reserve' },
  { rule: 'Smoking or lighting fires', detail: 'Prohibited' },
  { rule: 'Feeding, teasing or chasing animals', detail: 'Prohibited, and a punishable offence' },
  { rule: 'Littering', detail: 'Fineable' },
  { rule: 'Late arrival', detail: 'Last entry is two hours after the slot opens; late entry is refused after that' },
];

export const officialContacts = {
  email: 'infotadoba@gmail.com',
  helpline: '9579160778',
  bookingSite: 'https://mytadoba.mahaforest.gov.in',
};

export const inr = (n: number) => `₹${n.toLocaleString('en-IN')}`;
