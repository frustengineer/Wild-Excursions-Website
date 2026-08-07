import type { Tour } from '../data/tours';

export interface Departure {
  dateSlug: string;
  dateLabel: string;
  startLabel: string;
  duration: string;
  price: number;
  originalPrice: number;
  monthKey: string;
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
  };
}

// Fixed Friday-start weekend departures for Oct/Nov/Dec 2026 — 4 per month, used for every
// tour regardless of duration (the trip's own night count determines the return date).
const WEEKEND_FRIDAYS_2026 = [
  new Date(2026, 9, 2),
  new Date(2026, 9, 9),
  new Date(2026, 9, 16),
  new Date(2026, 9, 23),
  new Date(2026, 10, 6),
  new Date(2026, 10, 13),
  new Date(2026, 10, 20),
  new Date(2026, 10, 27),
  new Date(2026, 11, 4),
  new Date(2026, 11, 11),
  new Date(2026, 11, 18),
  new Date(2026, 11, 25),
];

export function generateDepartures(tour: Tour): Departure[] {
  const nights = (parseInt(tour.duration, 10) || 3) - 1;
  return WEEKEND_FRIDAYS_2026.map((friday) => buildDeparture(tour, friday, addDays(friday, nights)));
}
