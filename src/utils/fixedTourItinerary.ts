import type { Tour } from '../data/tours';

const nearestHubs: Record<string, string> = {
  tadoba: 'Nagpur', tipeshwar: 'Nagpur', nagzira: 'Nagpur', kanha: 'Jabalpur',
  bandhavgarh: 'Jabalpur', satpura: 'Bhopal', panna: 'Khajuraho',
  ranthambore: 'Sawai Madhopur', karanhdhla: 'Nagpur', 'jim-corbett': 'Ramnagar',
  kaziranga: 'Guwahati', dudhwa: 'Lucknow', kishanpur: 'Lucknow', pilibhit: 'Bareilly',
  rajaji: 'Haridwar', gir: 'Rajkot', manas: 'Guwahati', sunderban: 'Kolkata',
  jhalana: 'Jaipur', 'jawai-bera': 'Jodhpur', bor: 'Nagpur', 'sanjay-dubri': 'Rewa',
  bandipur: 'Mysuru',
};

function ordinal(value: number) {
  const mod100 = value % 100;
  if (mod100 >= 11 && mod100 <= 13) return `${value}th`;
  if (value % 10 === 1) return `${value}st`;
  if (value % 10 === 2) return `${value}nd`;
  if (value % 10 === 3) return `${value}rd`;
  return `${value}th`;
}

export function buildFixedTourItinerary(tour: Tour, days: number): NonNullable<Tour['itinerary']> {
  const itinerary: NonNullable<Tour['itinerary']> = [];
  const resort = 'your pre-booked resort';
  const hub = nearestHubs[tour.jungle];
  const hubLabel = hub ? `${hub} Airport / Railway Station` : 'Nearest Airport / Railway Station';
  const isMP = tour.region === 'Madhya Pradesh';
  const morningTiming = isMP ? '6:00 AM – 11:30 AM' : '6:00 AM – 10:00 AM';
  const eveningTiming = isMP ? '3:00 PM – 6:30 PM' : '2:00 PM – 6:00 PM';
  // Sunderban is a mangrove delta with no jeep tracks — every "safari" there is a
  // guided boat safari through the tidal creeks, not a jeep drive.
  const safariType = tour.jungle === 'sunderban' ? 'boat' : 'jeep';

  for (let day = 1; day <= days; day += 1) {
    if (day === 1) {
      itinerary.push({
        day,
        title: `Arrival at ${tour.jungleLabel} & Evening Safari`,
        details: [
          'Pick up from the nearest Airport / Railway Station by 9:00 AM in an AC cab.',
          `Reach ${tour.jungleLabel} by 12:00 PM.`,
          'Check in to your pre-booked resort, freshen up, and enjoy a delicious lunch.',
          `Gear up for your 1st thrilling ${safariType} safari (Safari Timing: ${eveningTiming}).`,
          'Return to the resort in the evening. Relax with high-tea and dinner, then lights off.',
        ],
        meals: 'Lunch | High-Tea | Dinner', safaris: 1,
        transfer: { from: hubLabel, to: resort }, stay: { name: resort },
      });
      continue;
    }

    const morningSafari = day === days ? (days - 1) * 2 : (day - 1) * 2;
    if (day === days) {
      itinerary.push({
        day, title: 'Morning Safari & Departure',
        details: [
          `Wake up at 5:00 AM and get ready for your ${ordinal(morningSafari)} and final ${safariType} safari, with a packed breakfast inside (Safari Timing: ${morningTiming}).`,
          'Return to the resort and enjoy breakfast.',
          `Check out from the resort and leave ${tour.jungleLabel} by 12:00 PM.`,
          `Drop at ${hubLabel} by 3:30 PM for your onward journey.`,
        ],
        meals: 'Breakfast', safaris: 1, transfer: { from: resort, to: hubLabel },
      });
      continue;
    }

    itinerary.push({
      day, title: `Full Day at ${tour.jungleLabel} – Morning & Evening Safaris`,
      details: [
        `Wake up at 5:00 AM and get ready for your ${ordinal(morningSafari)} thrilling ${safariType} safari, with a packed breakfast inside (Safari Timing: ${morningTiming}).`,
        'Return to the resort, relax, and enjoy lunch.',
        `Gear up for your ${ordinal(morningSafari + 1)} exhilarating ${safariType} safari (Safari Timing: ${eveningTiming}).`,
        'Return to the resort in the evening. Relax with high-tea and dinner, then lights off.',
      ],
      meals: 'Breakfast | Lunch | High-Tea | Dinner', safaris: 2, stay: { name: resort },
    });
  }

  return itinerary;
}
