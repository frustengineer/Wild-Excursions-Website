import type { APIRoute } from 'astro';
import { tours } from '../data/tours';
import { foreignerUplift } from '../data/pricing';
import { generateDepartures } from '../utils/departures';

// /llms.txt — a plain-text summary for AI assistants and answer engines (llmstxt.org).
// Built from the tour data, so parks and prices stay in step with the site.
export const GET: APIRoute = ({ site }) => {
  const url = (path: string) => new URL(path, site).toString();
  const inr = (n: number) => `₹${n.toLocaleString('en-IN')}`;
  const parks = Array.from(new Map(tours.map((t) => [t.jungle, t])).values()).map((first) => {
    const parkTours = tours.filter((t) => t.jungle === first.jungle);
    const days = [...new Set(parkTours.map((t) => parseInt(t.duration, 10)))].sort((a, b) => a - b);
    return {
      ...first,
      from: Math.min(...parkTours.map((t) => t.price)),
      days: `${days[0]}–${days[days.length - 1]} days`,
      customOnly: parkTours.every((t) => generateDepartures(t).length === 0),
    };
  });
  const lowest = Math.min(...parks.map((p) => p.from));

  const body = `# Wild Excursions

> Wild Excursions is an Indian wildlife safari operator based in Maharashtra that plans naturalist-led tiger and wildlife safari packages in ${parks.length} Indian national parks and reserves, including Tadoba, Pench, Kanha, Bandhavgarh, Ranthambore and Jim Corbett. Packages start from ${inr(lowest)} per person (Indian citizen price) and bundle forest permits, jeep safaris, stay, meals, naturalist guiding and transfers.

## Key facts

- Website: ${url('/')}
- Phone / WhatsApp: +91 77559 58493
- Email: info@wildexcursions.in
- Package prices are per person, include 5% GST, and are shown for Indian citizens. Foreign nationals pay a higher package price because forest permits cost more for them: +20% for parks in Maharashtra and +40% for parks elsewhere in India. Indian citizens living abroad pay the Indian price.
- Trips run as fixed-date departures (2 to 5 days) at most parks, or on your own dates as a customised trip at the same price.
- Cancellation: 100% refund 120+ days before departure, 75% at 60+ days, 50% at 45–60 days, 25% at 30–45 days, no refund within 30 days; free rebooking instead of a refund. A 50% advance confirms a booking.
- Wildlife sightings are never guaranteed; zones, gates and timings are set by each forest department.

## Parks and tour packages

${parks.map((p) => `- [${p.jungleLabel} tour packages](${url(`/tours/${p.jungle}/`)}): ${p.region}. ${p.days}, from ${inr(p.from)} per person (Indian citizen; foreign nationals +${Math.round(foreignerUplift(p.region) * 100)}%).${p.customOnly ? ' Customised dates only.' : ''}`).join('\n')}

## Safari booking guides

- [Tadoba jungle safari booking](${url('/tadoba-jungle-safari-booking/')}): zones, gates, timings and permits
- [Pench jungle safari booking](${url('/pench-jungle-safari-booking/')})
- [Kanha jungle safari booking](${url('/kanha-jungle-safari-booking/')})
- [Bandhavgarh jungle safari booking](${url('/bandhavgarh-jungle-safari-booking/')})
- [Ranthambore jungle safari booking](${url('/ranthambore-jungle-safari-booking/')})
- [Jim Corbett jungle safari booking](${url('/jim-corbett-jungle-safari-booking/')})
- [Tadoba National Park safari package](${url('/tadoba-national-park/')})
- [Pench National Park safari package](${url('/pench-national-park/')})

## India safari planning guides

- [Best places to see tigers in India](${url('/best-places-to-see-tigers-in-india/')}): 10 reserves ranked by sighting reliability, access, season and cost
- [Best jungle safari in India](${url('/best-jungle-safari-in-india/')}): 12 parks compared by species
- [Best time for a tiger safari in India](${url('/best-time-for-tiger-safari-india/')}): month by month, with park closures
- [Best places to see leopards in India](${url('/best-places-to-see-leopards-in-india/')})
- [Night safari in Tadoba and Pench](${url('/night-safari-tadoba-pench/')}): not permitted in 2026–27 after the Supreme Court's November 2025 night-tourism ban
- [Full-day safari in Tadoba and Pench](${url('/full-day-safari-tadoba-pench/')}): official fees and rules
- [Big Five of India](${url('/blogs/big-five-of-india/')}): tiger, leopard, Asian elephant, one-horned rhino, Asiatic lion
- [Things to do in Pench](${url('/blogs/things-to-do-in-pench/')}): safaris on both sides, the Turia mini-bus, the solar boat safari, birding
- [Famous tigers of Pench](${url('/pench/famous-tigers/')}): Collarwali (T-15), Langdi (T-20) and their family line
- [Black panther in India](${url('/blogs/black-panther-in-india/')}): melanistic leopards, Kabini, Pench's Bagheera
- [Pench and The Jungle Book](${url('/blogs/pench-jungle-book-mowgli/')}): Kipling's Seeonee and the real wildlife

## More

- [All tour packages](${url('/tours/')})
- [Tiger safari tours in India](${url('/tiger-safari-tours/')})
- [India wildlife tours from Canada](${url('/india-wildlife-tours-from-canada/')})
- [Safari planning guides](${url('/guides/')})
- [Wildlife encyclopedia](${url('/wildlife-encyclopedia/')})
- [Blog](${url('/blogs/')})
- [FAQs](${url('/faqs/')})
- [Customise a trip](${url('/customize-trip/')})
- [About Wild Excursions](${url('/about/')})
- [Contact](${url('/contact/')})
- [Terms and cancellation policy](${url('/terms/')})
`;

  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
