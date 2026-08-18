import type { Tour } from '../data/tours';

export interface Departure {
  dateSlug: string;
  dateLabel: string;
  startLabel: string;
  duration: string;
  price: number;
  originalPrice: number;
  monthKey: string;
  soldOut: boolean;
}

// Jungles with a sold-out block on specific weekends below — the lodges are fully booked for
// these dates regardless of trip duration, so every departure overlapping the window is closed.
const SOLD_OUT_JUNGLES = ['tadoba', 'kanha', 'bandhavgarh'];
const SOLD_OUT_WINDOWS: { start: Date; end: Date }[] = [
  { start: new Date(2026, 9, 2), end: new Date(2026, 9, 4) },   // Oct 2–4, 2026
  { start: new Date(2026, 9, 16), end: new Date(2026, 9, 18) }, // Oct 16–18, 2026
  { start: new Date(2026, 10, 6), end: new Date(2026, 10, 8) }, // Nov 6–8, 2026
  { start: new Date(2026, 10, 13), end: new Date(2026, 10, 15) }, // Nov 13–15, 2026
];

function isSoldOut(jungle: string, start: Date, end: Date): boolean {
  if (!SOLD_OUT_JUNGLES.includes(jungle)) return false;
  return SOLD_OUT_WINDOWS.some((window) => start <= window.end && end >= window.start);
}

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTH_SLUGS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

function addDays(date: Date, days: number) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function buildDeparture(tour: Tour, start: Date, end: Date): Departure {
  const sameMonth = start.getMonth() === end.getMonth();
  const startLabel = `${MONTH_NAMES[start.getMonth()]} ${start.getDate()}`;
  const endLabel = sameMonth ? `${end.getDate()}` : `${MONTH_NAMES[end.getMonth()]} ${end.getDate()}`;
  const dateLabel = `${startLabel}–${endLabel}, ${end.getFullYear()}`;
  const dateSlug = `${MONTH_SLUGS[start.getMonth()]}-${start.getDate()}-${start.getFullYear()}`;

  return {
    dateSlug,
    dateLabel,
    startLabel: `${startLabel}, ${start.getFullYear()}`,
    duration: tour.duration,
    price: tour.price,
    originalPrice: tour.originalPrice,
    monthKey: `${start.getFullYear()}-${start.getMonth()}`,
    soldOut: isSoldOut(tour.jungle, start, end),
  };
}

// Each duration always departs on the same weekday so the trip lines up with a weekend,
// however long it runs: 2D/1N is Sat–Sun, 3D/2N Fri–Sun, 4D/3N Thu–Sun, 5D/4N Wed–Sun.
const DURATION_PATTERN: Record<string, { startDay: number; nights: number }> = {
  '2 days & 1 night': { startDay: 6, nights: 1 },
  '3 days & 2 nights': { startDay: 5, nights: 2 },
  '4 days & 3 nights': { startDay: 4, nights: 3 },
  '5 days & 4 nights': { startDay: 3, nights: 4 },
};

// The booking window: October 2026 through March 2027.
const RANGE_MONTHS: { year: number; month: number }[] = (() => {
  const months: { year: number; month: number }[] = [];
  let year = 2026;
  let month = 9; // October (0-indexed)
  for (let i = 0; i < 6; i += 1) {
    months.push({ year, month });
    month += 1;
    if (month > 11) {
      month = 0;
      year += 1;
    }
  }
  return months;
})();

// Group A — high-demand, close-to-base jungles: every matching weekend of every month gets a
// departure, for every duration.
const WEEKEND_HEAVY_JUNGLES = ['tadoba', 'pench', 'kanha', 'bandhavgarh', 'panna', 'umred-karhandla', 'tipeshwar', 'satpura'];

// Group B — far-flung jungles that need more lead time to plan and staff: only 2 departures a
// month, and none before Nov 15 (the booking window doesn't open earlier for these).
const FAR_JUNGLES = ['jim-corbett', 'kaziranga', 'dudhwa', 'kishanpur', 'pilibhit', 'rajaji', 'gir', 'manas'];

// Everything else (currently nagzira, ranthambore) is Group C: 2 departures a month, same as
// Group B, but without the Nov-15 cutoff — handled by the shared "else" branch below.

function datesForWeekdayInMonth(year: number, month: number, weekday: number): Date[] {
  const dates: Date[] = [];
  const cursor = new Date(year, month, 1);
  while (cursor.getMonth() === month) {
    if (cursor.getDay() === weekday) dates.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }
  return dates;
}

// Deterministic shuffle — stable across builds (same seed always gives the same order) but
// varies per jungle/tour/month so different parks don't all show identical calendar dates.
function seededShuffle<T>(items: T[], seed: string): T[] {
  let state = 0;
  for (let i = 0; i < seed.length; i += 1) state = (state * 31 + seed.charCodeAt(i)) >>> 0;
  if (state === 0) state = 1;

  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    state = (state * 1103515245 + 12345) & 0x7fffffff;
    const j = state % (i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function generateDepartures(tour: Tour): Departure[] {
  const pattern = DURATION_PATTERN[tour.duration] ?? { startDay: 5, nights: (parseInt(tour.duration, 10) || 3) - 1 };
  const isWeekendHeavy = WEEKEND_HEAVY_JUNGLES.includes(tour.jungle);
  const isFar = FAR_JUNGLES.includes(tour.jungle);

  const departures: Departure[] = [];

  for (const { year, month } of RANGE_MONTHS) {
    // Far jungles' booking window only opens after Nov 15 — skip October entirely, and trim
    // November down to dates after the 15th.
    if (isFar && year === 2026 && month === 9) continue;

    let candidates = datesForWeekdayInMonth(year, month, pattern.startDay);
    if (isFar && year === 2026 && month === 10) {
      candidates = candidates.filter((date) => date.getDate() > 15);
    }

    if (isWeekendHeavy) {
      for (const start of candidates) {
        departures.push(buildDeparture(tour, start, addDays(start, pattern.nights)));
      }
    } else {
      const picked = seededShuffle(candidates, `${tour.slug}-${year}-${month}`)
        .slice(0, Math.min(2, candidates.length))
        .sort((a, b) => a.getTime() - b.getTime());
      for (const start of picked) {
        departures.push(buildDeparture(tour, start, addDays(start, pattern.nights)));
      }
    }
  }

  return departures;
}
