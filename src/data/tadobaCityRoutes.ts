/**
 * "How to reach Tadoba" city pages (/how-to-reach-tadoba/<slug>/).
 * Road distances are approximate figures to the Moharli gate unless stated, rounded, and
 * cross-checked against resort and travel-guide figures (Oct 2026). Kolara and Navegaon are
 * roughly 30 km closer from Nagpur; Moharli is closer from Chandrapur and the south.
 * Flight and train details are kept general on purpose: schedules change, so pages point
 * readers to current timetables instead of naming specific services.
 */

export interface CityRoute {
  slug: string;
  city: string;
  state: string;
  tier: 'Metro' | 'Tier 2' | 'Nearby';
  distance: string;
  driveTime: string;
  bestWay: string;
  bestGate: string;
  intro: string;
  air: string;
  rail: string;
  road: string;
  plan: string[];
  tip: string;
  faqs: Array<{ question: string; answer: string }>;
}

const nagpurLeg = 'From Nagpur airport it is about 110 km (2–2.5 hours) to Kolara or Navegaon, and about 140–150 km (3–3.5 hours) to Moharli.';

export const cityRoutes: CityRoute[] = [
  {
    slug: 'mumbai-to-tadoba', city: 'Mumbai', state: 'Maharashtra', tier: 'Metro',
    distance: '750–800 km', driveTime: '11–13 hours', bestWay: 'Fly to Nagpur, then drive', bestGate: 'Any. Kolara is quickest from Nagpur airport, Moharli via Wardha if driving',
    intro: 'Mumbai is Tadoba\'s biggest source of weekend travellers, and since the Samruddhi Mahamarg opened, the road trip has become genuinely enjoyable. Still, for a short break, flying is the clear winner.',
    air: `Direct flights between Mumbai and Nagpur run several times a day and take about 1 hour 30 minutes. ${nagpurLeg} Door to gate, plan on 5–6 hours.`,
    rail: 'Nagpur sits on the Mumbai–Howrah main line, so there are several overnight trains from Mumbai (CSMT, LTT and Dadar) every day, taking roughly 11–14 hours. Book an evening departure, arrive in Nagpur in the morning and reach your resort by lunch.',
    road: 'Take the Samruddhi Mahamarg (Mumbai–Nagpur Expressway) and exit at the Wardha interchange. The expressway stretch to Wardha is around 600 km of fast, smooth road. From Wardha, continue via Warora and Chimur to Kolara or Navegaon, or via Warora and Bhadravati to Moharli. Budget 11–13 hours with stops, and fuel up on the expressway, as stations are spaced out.',
    plan: ['Fly Mumbai → Nagpur on an early flight', 'Lunch on the way, check in by 2 pm near your gate', 'Evening safari the same day if your permit allows', 'Two more days of safaris, then fly back from Nagpur'],
    tip: 'Friday evening flights from Mumbai fill fast before long weekends. If you\'re driving, start before 5 am to cross the Mumbai end before traffic builds.',
    faqs: [
      { question: 'How far is Tadoba from Mumbai?', answer: 'Tadoba is roughly 750–800 km from Mumbai by road, depending on which gate you\'re heading to. That\'s 11–13 hours via the Samruddhi Mahamarg. By air, it\'s a 1.5-hour flight to Nagpur followed by a 2–3.5 hour drive.' },
      { question: 'What is the best way to reach Tadoba from Mumbai?', answer: 'For a 2–3 night trip, fly to Nagpur and take a car to the gate. For a longer road trip, the Samruddhi Mahamarg to Wardha makes the drive comfortable in a single long day.' },
    ],
  },
  {
    slug: 'pune-to-tadoba', city: 'Pune', state: 'Maharashtra', tier: 'Metro',
    distance: '700–780 km', driveTime: '12–13 hours', bestWay: 'Fly to Nagpur, then drive', bestGate: 'Kolara or Navegaon from Nagpur airport',
    intro: 'Pune travellers have the same choice as Mumbai: a quick flight to Nagpur, or a long but scenic drive across Marathwada and Vidarbha.',
    air: `Direct Pune–Nagpur flights take about 1 hour 20 minutes. ${nagpurLeg}`,
    rail: 'Pune has direct trains to Nagpur, most of them overnight and taking roughly 14–17 hours. You can also connect via Mumbai, Daund or Manmad. Nagpur is the most practical rail hub for Tadoba.',
    road: 'The fastest road option joins the Samruddhi Mahamarg near Chhatrapati Sambhajinagar (via Ahmednagar), then runs east to the Wardha interchange and on to Tadoba via Warora. The older route via Ahmednagar, Beed, Nanded and Yavatmal to Chandrapur suits travellers heading to Moharli. Either way, it is a full day of driving.',
    plan: ['Morning flight Pune → Nagpur', 'Drive to a Kolara- or Navegaon-side resort (about 2–2.5 hours)', 'Evening buffer safari on arrival day', 'Core safaris over the next two days'],
    tip: 'If you\'re driving, break the trip at Chhatrapati Sambhajinagar or Wardha. Arriving exhausted before a 5:30 am gate time wastes your first safari.',
    faqs: [
      { question: 'How far is Tadoba from Pune?', answer: 'About 700–780 km by road depending on the route and gate, which is 12–13 hours of driving. Flying Pune to Nagpur takes around 1 hour 20 minutes, plus a 2–3.5 hour drive to the gate.' },
      { question: 'Is there a direct train from Pune to Tadoba?', answer: 'No train goes to Tadoba itself. Take a train from Pune to Nagpur (or to Chandrapur where available) and continue by road. Nagpur has the best onward car options.' },
    ],
  },
  {
    slug: 'delhi-to-tadoba', city: 'Delhi', state: 'Delhi NCR', tier: 'Metro',
    distance: '1,200–1,250 km', driveTime: '20+ hours', bestWay: 'Fly to Nagpur, then drive', bestGate: 'Kolara or Navegaon for the shortest transfer',
    intro: 'From Delhi, Tadoba is a flight-plus-drive trip. Nagpur is less than two hours away by air, and the reserve is a short transfer from there.',
    air: `Direct Delhi–Nagpur flights run several times a day and take about 1 hour 45 minutes. ${nagpurLeg}`,
    rail: 'Nagpur lies on the Delhi–Chennai trunk line, and premium overnight services on the Delhi–Chennai, Delhi–Hyderabad and Delhi–Bengaluru routes stop there, taking roughly 16–18 hours. Some trains continue south to Chandrapur or Ballarshah, closer to Moharli. Check current stops on IRCTC or NTES.',
    road: 'Driving the full 1,200 km via NH44 (Agra, Gwalior, Jhansi, Sagar, Seoni, Nagpur) takes two days. It\'s only worth it as part of a longer central India road trip that includes Pench or Kanha.',
    plan: ['Morning flight Delhi → Nagpur', 'Transfer to the resort, lunch and rest', 'Evening safari on day one', 'Combine with Pench (about 2 hours from Nagpur) for a longer tiger trip'],
    tip: 'From Delhi, Tadoba pairs beautifully with Pench. Fly into Nagpur, do both reserves, and fly out of Nagpur.',
    faqs: [
      { question: 'How far is Tadoba from Delhi?', answer: 'Around 1,200–1,250 km by road. Most travellers fly Delhi to Nagpur (about 1 hour 45 minutes) and drive 2–3.5 hours to the gate.' },
      { question: 'Which is the nearest airport to Tadoba from Delhi?', answer: 'Nagpur\'s Dr Babasaheb Ambedkar International Airport. It\'s the only airport with regular Delhi flights near Tadoba.' },
    ],
  },
  {
    slug: 'bengaluru-to-tadoba', city: 'Bengaluru', state: 'Karnataka', tier: 'Metro',
    distance: '1,000–1,050 km', driveTime: '18–19 hours', bestWay: 'Fly to Nagpur, then drive', bestGate: 'Kolara or Navegaon from Nagpur; Moharli if arriving by train via Chandrapur',
    intro: 'Bengaluru has a big, keen wildlife community, and Tadoba is one of its favourite tiger trips outside the southern reserves. It\'s an easy flight to Nagpur.',
    air: `Direct Bengaluru–Nagpur flights take about 1 hour 45 minutes. ${nagpurLeg}`,
    rail: 'Long-distance trains from Bengaluru to Nagpur and north run via Hyderabad/Kazipet and pass Ballarshah and Chandrapur, the closest railheads to Moharli. Journey times are long (roughly 18–22 hours), so this suits slow travellers.',
    road: 'The road runs via Hyderabad, Adilabad and Chandrapur, about 1,000 km. It\'s doable over two days with a night in Hyderabad.',
    plan: ['Flight Bengaluru → Nagpur', 'Transfer to a Kolara-side lodge', 'Three nights, six safaris across two zones', 'Fly back from Nagpur'],
    tip: 'Many Bengaluru travellers combine Tadoba with a Hyderabad stopover. If you\'re driving, Moharli is the most convenient gate from the south.',
    faqs: [
      { question: 'How do I reach Tadoba from Bengaluru?', answer: 'Fly from Bengaluru to Nagpur (about 1 hour 45 minutes), then drive 2–3.5 hours to the gate. By rail, trains via Hyderabad reach Chandrapur or Ballarshah, about an hour from Moharli.' },
      { question: 'How far is Tadoba from Bengaluru by road?', answer: 'Roughly 1,000–1,050 km via Hyderabad and Chandrapur, which is about 18–19 hours of driving. Most people split it over two days.' },
    ],
  },
  {
    slug: 'hyderabad-to-tadoba', city: 'Hyderabad', state: 'Telangana', tier: 'Metro',
    distance: '430–450 km', driveTime: '8–9 hours', bestWay: 'Drive, or train to Chandrapur', bestGate: 'Moharli (closest from the south)',
    intro: 'Hyderabad is one of the few big cities from which Tadoba makes a comfortable road trip, and it\'s the only metro where the train drops you closer to the reserve than Nagpur does.',
    air: `Direct Hyderabad–Nagpur flights take about 1 hour 15 minutes. ${nagpurLeg} Given the drive back south to Moharli, flying saves less time than you'd expect.`,
    rail: 'Secunderabad and Hyderabad have frequent trains north on the Delhi–Chennai trunk line that stop at Ballarshah and Chandrapur. From Chandrapur, Moharli gate is under an hour by road. This is often the smartest option.',
    road: 'Take NH44 north towards Adilabad, then head east to Chandrapur and on to Moharli. The roads are mostly good four-lane highway. Allow 8–9 hours with breaks.',
    plan: ['Early start from Hyderabad by road, or a morning train to Chandrapur', 'Lunch in Chandrapur, then check in near Moharli', 'Evening buffer safari (Junona or Agarzari)', 'Core safaris at Moharli and Khutwanda over the next two days'],
    tip: 'Base yourself at Moharli. It is the first gate you reach from the south, and the Moharli zone has Tadoba\'s widest choice of resorts.',
    faqs: [
      { question: 'How far is Tadoba from Hyderabad?', answer: 'About 430–450 km by road to Moharli gate, roughly 8–9 hours via NH44 and Chandrapur. Trains to Chandrapur bring you within an hour of the gate.' },
      { question: 'Is it better to fly or drive from Hyderabad to Tadoba?', answer: 'Driving or taking a train to Chandrapur is usually better. Flying to Nagpur adds a 3-hour drive back south to Moharli, so the time saved is small.' },
    ],
  },
  {
    slug: 'chennai-to-tadoba', city: 'Chennai', state: 'Tamil Nadu', tier: 'Metro',
    distance: '1,050–1,100 km', driveTime: '19–20 hours', bestWay: 'Fly to Nagpur, then drive', bestGate: 'Any. Kolara is quickest from Nagpur airport',
    intro: 'From Chennai, Tadoba is a flight-and-transfer trip, with the long-distance train a relaxed alternative for those with time.',
    air: `Direct Chennai–Nagpur flights take about 1 hour 50 minutes. ${nagpurLeg}`,
    rail: 'Chennai sits at the southern end of the Delhi–Chennai trunk line, and trains on it pass Ballarshah and Chandrapur before Nagpur. Journeys run roughly 18–22 hours, and Chandrapur is the closest stop to Moharli.',
    road: 'Driving via Vijayawada or Hyderabad to Chandrapur is a two-day trip of over 1,000 km. We don\'t recommend it for a safari holiday.',
    plan: ['Flight Chennai → Nagpur', 'Transfer to the resort', 'Two to three nights of safaris', 'Consider adding Pench on the way back to Nagpur'],
    tip: 'Book flights that land in Nagpur before noon so you can reach the resort in time for an evening drive.',
    faqs: [
      { question: 'How do I travel from Chennai to Tadoba?', answer: 'Fly from Chennai to Nagpur (about 1 hour 50 minutes) and drive 2–3.5 hours to the gate. Alternatively, take a long-distance train to Chandrapur, about an hour from Moharli.' },
      { question: 'How far is Tadoba from Chennai?', answer: 'Roughly 1,050–1,100 km by road, which is why nearly everyone flies to Nagpur instead.' },
    ],
  },
  {
    slug: 'kolkata-to-tadoba', city: 'Kolkata', state: 'West Bengal', tier: 'Metro',
    distance: '1,150–1,250 km', driveTime: '20+ hours', bestWay: 'Fly to Nagpur, then drive', bestGate: 'Kolara or Navegaon',
    intro: 'Kolkata\'s wildlife travellers often know the Sundarbans well. Tadoba gives them something completely different: dry deciduous forest and some of India\'s most visible tigers.',
    air: `Direct Kolkata–Nagpur flights take about 1 hour 45 minutes. ${nagpurLeg}`,
    rail: 'Nagpur is on the Howrah–Mumbai main line, with several daily trains from Howrah taking roughly 16–19 hours. From Nagpur, continue by road.',
    road: 'The road route via Jharkhand, Chhattisgarh and Raipur is well over 1,100 km and takes two days. Only consider it as part of a central India road trip.',
    plan: ['Flight Kolkata → Nagpur', 'Transfer to a Kolara-side resort (about 2–2.5 hours)', 'Three nights, five to six safaris', 'Option to add Pench or Kanha'],
    tip: 'Overnight trains from Howrah arrive in Nagpur in the morning, a relaxed, budget-friendly alternative to flying.',
    faqs: [
      { question: 'How far is Tadoba from Kolkata?', answer: 'About 1,150–1,250 km by road. Most travellers fly Kolkata to Nagpur (about 1 hour 45 minutes) or take an overnight train to Nagpur, then drive to the gate.' },
      { question: 'Which railway station is nearest to Tadoba for trains from Kolkata?', answer: 'Nagpur Junction is the practical choice from Kolkata, as Howrah–Mumbai trains run through it. Chandrapur is closer to the reserve, but it isn\'t on the Kolkata line.' },
    ],
  },
  {
    slug: 'ahmedabad-to-tadoba', city: 'Ahmedabad', state: 'Gujarat', tier: 'Metro',
    distance: '950–1,050 km', driveTime: '17–18 hours', bestWay: 'Fly to Nagpur, then drive', bestGate: 'Kolara or Navegaon',
    intro: 'For Gujarat\'s wildlife lovers, Tadoba is the natural next step after Gir: lions at home, tigers a short flight away.',
    air: `Direct Ahmedabad–Nagpur flights take about 1 hour 35 minutes. ${nagpurLeg}`,
    rail: 'Trains from Ahmedabad to Nagpur run via Surat and Jalgaon, taking roughly 17–20 hours. Some connect better via Mumbai.',
    road: 'Driving via Surat, Dhule, Jalgaon, Akola and Amravati, or joining the Samruddhi Mahamarg, is close to 1,000 km. It\'s a two-day trip.',
    plan: ['Flight Ahmedabad → Nagpur', 'Transfer to the resort', 'Two to three nights of safaris', 'Fly back from Nagpur'],
    tip: 'Pair Tadoba with Pench for a classic Vidarbha tiger circuit. Both are within easy reach of Nagpur airport.',
    faqs: [
      { question: 'How far is Tadoba from Ahmedabad?', answer: 'Roughly 950–1,050 km by road. Flying to Nagpur (about 1 hour 35 minutes) and driving 2–3.5 hours to the gate is the practical option.' },
      { question: 'Can I combine Gir and Tadoba?', answer: 'Yes, though they\'re far apart. Most people do them as separate trips, or fly Ahmedabad–Nagpur after a Gir stay to make it one lion-and-tiger holiday.' },
    ],
  },
  {
    slug: 'nagpur-to-tadoba', city: 'Nagpur', state: 'Maharashtra', tier: 'Nearby',
    distance: '110–150 km', driveTime: '2–3.5 hours', bestWay: 'Drive (car or cab)', bestGate: 'Kolara (closest), then Navegaon, then Moharli',
    intro: 'Nagpur is the gateway to Tadoba. It has the nearest airport, the biggest railway junction and the most car-hire options. How long the drive takes depends entirely on which gate you\'re heading for.',
    air: 'Nagpur\'s Dr Babasaheb Ambedkar International Airport has direct flights from every major Indian metro and a few international routes. From the airport you drive straight to the reserve.',
    rail: 'Nagpur Junction is where the Mumbai–Howrah and Delhi–Chennai trunk lines cross, so trains arrive from almost everywhere. Pre-book a cab from the station to the gate.',
    road: 'For Kolara and Navegaon, take the Nagpur–Umred–Chimur road (about 110–115 km, 2–2.5 hours). For Moharli, go via Umred–Bhisi–Chimur or via Wardha road and Warora (about 140–150 km, 3–3.5 hours). Zari and Pangdi are furthest, at around 170 km.',
    plan: ['Leave Nagpur by 11 am to reach in time for lunch and an evening safari', 'Or leave at 3 am for a same-day morning safari (tiring, but possible at Kolara)', 'Return after the last morning drive'],
    tip: 'Ask your driver to avoid night driving on the final stretch. The forest roads have wildlife and village traffic after dark.',
    faqs: [
      { question: 'How far is Tadoba from Nagpur?', answer: 'Kolara gate is about 110 km (2–2.5 hours) from Nagpur, Navegaon about 115 km, Moharli about 140–150 km (3–3.5 hours) and Zari or Pangdi around 170 km.' },
      { question: 'Which Tadoba gate is nearest to Nagpur?', answer: 'Kolara, on the Umred–Chimur side. It\'s the best choice for a short trip from Nagpur.' },
    ],
  },
  {
    slug: 'chandrapur-to-tadoba', city: 'Chandrapur', state: 'Maharashtra', tier: 'Nearby',
    distance: '30–45 km', driveTime: '45 min – 1 hour', bestWay: 'Drive (car, cab or bus)', bestGate: 'Moharli, Junona, Agarzari',
    intro: 'Chandrapur is the district town Tadoba belongs to, and it\'s the closest city to the Moharli gate. It\'s also the best railhead for travellers coming from the south.',
    air: 'Chandrapur has no commercial airport. The nearest is Nagpur, about 150 km away.',
    rail: 'Chandrapur and nearby Ballarshah stations are on the Delhi–Chennai trunk line, with trains from Hyderabad, Chennai, Bengaluru and the north. From either station, Moharli is under an hour by road.',
    road: 'Moharli gate is roughly 30–45 km from Chandrapur, about 45 minutes to an hour by road. Junona, the closest buffer gate to the city, is nearer still. State buses run to Moharli, but a car is far more practical for safari timings.',
    plan: ['Arrive in Chandrapur by train', 'Transfer to Moharli (under an hour)', 'Safaris in the Moharli zone, plus Junona and Agarzari buffers'],
    tip: 'Chandrapur hotels work for a budget trip, but staying at Moharli saves an hour of driving before each 5:30–6:30 am gate time.',
    faqs: [
      { question: 'How far is Tadoba from Chandrapur?', answer: 'Moharli gate is roughly 30–45 km from Chandrapur, about 45 minutes to an hour by road.' },
      { question: 'Is Chandrapur the nearest railway station to Tadoba?', answer: 'Yes, for the Moharli side. Chandrapur (with Ballarshah nearby) is the closest major station. Warora is useful for the Kolara side, and Nagpur has the most trains overall.' },
    ],
  },
  {
    slug: 'nashik-to-tadoba', city: 'Nashik', state: 'Maharashtra', tier: 'Tier 2',
    distance: '630–680 km', driveTime: '9–11 hours', bestWay: 'Drive via Samruddhi Mahamarg, or train to Nagpur', bestGate: 'Moharli or Kolara via Wardha',
    intro: 'Nashik sits right by the western end of the Samruddhi Mahamarg, which makes Tadoba a straightforward one-day drive.',
    air: 'Nashik has limited flights. Most travellers fly from Mumbai or drive. Nagpur is the arrival airport for Tadoba.',
    rail: 'Nashik Road is on the Mumbai–Howrah line, with several daily trains to Nagpur taking roughly 9–12 hours.',
    road: 'Join the Samruddhi Mahamarg near Igatpuri or Sinnar, drive east to the Wardha interchange, then continue via Warora to your gate. Expect 9–11 hours.',
    plan: ['Early-morning start on the Samruddhi Mahamarg', 'Lunch near Wardha', 'Check in by late afternoon', 'Safaris over the next two days'],
    tip: 'An overnight train from Nashik Road to Nagpur, then a cab to Kolara, saves a full day behind the wheel.',
    faqs: [
      { question: 'How far is Tadoba from Nashik?', answer: 'Roughly 630–680 km by road via the Samruddhi Mahamarg, around 9–11 hours.' },
      { question: 'Is there a train from Nashik to Tadoba?', answer: 'Not to Tadoba itself. Take a train from Nashik Road to Nagpur and drive 2–3.5 hours to the gate.' },
    ],
  },
  {
    slug: 'sambhajinagar-to-tadoba', city: 'Chhatrapati Sambhajinagar (Aurangabad)', state: 'Maharashtra', tier: 'Tier 2',
    distance: '500–550 km', driveTime: '7–9 hours', bestWay: 'Drive via Samruddhi Mahamarg', bestGate: 'Moharli or Kolara via Wardha',
    intro: 'Sambhajinagar is on the Samruddhi Mahamarg itself, so Tadoba is now a comfortable single day\'s drive.',
    air: 'Flights from Sambhajinagar to Nagpur are limited, and usually connect via Mumbai or Delhi. Driving is quicker.',
    rail: 'Rail connections to Nagpur are indirect. Most routes connect via Manmad or Nanded and take longer than driving.',
    road: 'Join the Samruddhi Mahamarg near the city, drive east to the Wardha interchange, then take the Warora road to your gate. Allow 7–9 hours.',
    plan: ['Morning departure on the Samruddhi Mahamarg', 'Reach the resort by mid-afternoon', 'Evening safari on arrival day if permits allow'],
    tip: 'This is one of the easiest road trips to Tadoba in Maharashtra, so it\'s ideal for a long weekend with four safaris.',
    faqs: [
      { question: 'How far is Tadoba from Aurangabad (Chhatrapati Sambhajinagar)?', answer: 'Around 500–550 km by road via the Samruddhi Mahamarg, about 7–9 hours.' },
      { question: 'What is the best route from Sambhajinagar to Tadoba?', answer: 'The Samruddhi Mahamarg east to the Wardha interchange, then via Warora to Moharli, or via Chimur to Kolara and Navegaon.' },
    ],
  },
  {
    slug: 'amravati-to-tadoba', city: 'Amravati', state: 'Maharashtra', tier: 'Tier 2',
    distance: '220–260 km', driveTime: '4–5 hours', bestWay: 'Drive', bestGate: 'Moharli or Kolara via Wardha–Warora',
    intro: 'From Amravati, Tadoba is a half-day drive, close enough for a spontaneous weekend.',
    air: 'Fly into Nagpur if you are coming from further away. From Amravati itself, driving is simplest.',
    rail: 'Trains run from Amravati and Badnera to Nagpur and Wardha. From Wardha, Tadoba is about 2.5 hours by road.',
    road: 'Drive via Wardha and Warora, then on to Chimur for Kolara and Navegaon or Bhadravati for Moharli. Allow 4–5 hours.',
    plan: ['Leave after breakfast', 'Lunch at the resort', 'Evening safari', 'Morning safari and return'],
    tip: 'A one-night, two-safari trip works from Amravati, but two nights gives you a far better chance at tigers.',
    faqs: [
      { question: 'How far is Tadoba from Amravati?', answer: 'About 220–260 km by road via Wardha and Warora, around 4–5 hours.' },
      { question: 'Can I do Tadoba as a weekend trip from Amravati?', answer: 'Yes. Leave on Saturday morning, do an evening and a morning safari, and you\'re home by Sunday evening.' },
    ],
  },
  {
    slug: 'raipur-to-tadoba', city: 'Raipur', state: 'Chhattisgarh', tier: 'Tier 2',
    distance: '330–400 km', driveTime: '6–7.5 hours', bestWay: 'Drive', bestGate: 'Kolara or Navegaon',
    intro: 'Raipur is one of the closer state capitals to Tadoba, and the drive across eastern Vidarbha is straightforward.',
    air: 'Flying Raipur to Nagpur isn\'t worth it for this distance. Drive instead.',
    rail: 'Raipur is on the Howrah–Mumbai main line, with frequent trains to Nagpur (about 4–5 hours). Continue by road from Nagpur.',
    road: 'Take NH53 towards Nagpur, turning off via Bhandara towards Umred and Chimur for Kolara and Navegaon, or continue to Nagpur and take the Umred road. Allow 6–7.5 hours.',
    plan: ['Morning start from Raipur', 'Lunch near Bhandara or Umred', 'Check in on the Kolara side by afternoon'],
    tip: 'Kolara and Navegaon are the natural gates from Raipur. Moharli adds another hour.',
    faqs: [
      { question: 'How far is Tadoba from Raipur?', answer: 'Roughly 330–400 km by road depending on the gate, about 6–7.5 hours. Kolara is the closest gate from Raipur.' },
      { question: 'How do I reach Tadoba from Raipur by train?', answer: 'Take a train from Raipur to Nagpur (about 4–5 hours) and drive 2–2.5 hours to Kolara.' },
    ],
  },
  {
    slug: 'bhopal-to-tadoba', city: 'Bhopal', state: 'Madhya Pradesh', tier: 'Tier 2',
    distance: '470–520 km', driveTime: '9–10 hours', bestWay: 'Train to Nagpur, or drive', bestGate: 'Kolara or Navegaon',
    intro: 'Bhopal is in the heart of tiger country already, with Satpura and Ratapani nearby, but Tadoba offers a different, very visible tiger population a day\'s travel south.',
    air: 'Direct flights between Bhopal and Nagpur are limited. Rail or road is usually simpler.',
    rail: 'Bhopal is on the Delhi–Chennai trunk line, so there are many daily trains to Nagpur taking roughly 6–8 hours. From Nagpur, drive to the gate.',
    road: 'Drive south via Betul and Multai to Nagpur on NH46 and NH47, then on to Kolara via Umred. Allow 9–10 hours.',
    plan: ['Morning train Bhopal → Nagpur', 'Cab to a Kolara-side resort', 'Two nights, four safaris'],
    tip: 'Combine with Satpura, which is between Bhopal and Nagpur, for a double-reserve trip.',
    faqs: [
      { question: 'How far is Tadoba from Bhopal?', answer: 'Roughly 470–520 km by road via Nagpur, around 9–10 hours. A train to Nagpur (6–8 hours) and a cab to the gate is often easier.' },
      { question: 'Can I combine Satpura and Tadoba from Bhopal?', answer: 'Yes. Satpura is about 3–4 hours from Bhopal, and Tadoba is reachable from there via Nagpur, which makes a good central India circuit.' },
    ],
  },
  {
    slug: 'jabalpur-to-tadoba', city: 'Jabalpur', state: 'Madhya Pradesh', tier: 'Tier 2',
    distance: '400–430 km', driveTime: '7–8 hours', bestWay: 'Drive via NH44', bestGate: 'Kolara or Navegaon',
    intro: 'Jabalpur is the jumping-off point for Kanha and Bandhavgarh, and Tadoba completes a classic central India tiger triangle.',
    air: 'Flights from Jabalpur to Nagpur are limited. Most people drive.',
    rail: 'Trains run from Jabalpur to Nagpur, but driving on NH44 is usually faster.',
    road: 'Drive south on NH44 via Seoni (past Pench) to Nagpur, then take the Umred road to Kolara. Allow 7–8 hours.',
    plan: ['Kanha or Bandhavgarh first', 'Drive south via Pench', 'Finish at Tadoba and fly out of Nagpur'],
    tip: 'The Jabalpur–Pench–Tadoba route lets you see three reserves with one domestic flight home.',
    faqs: [
      { question: 'How far is Tadoba from Jabalpur?', answer: 'About 400–430 km by road via NH44 and Nagpur, roughly 7–8 hours.' },
      { question: 'Can I do Kanha, Pench and Tadoba in one trip?', answer: 'Yes. Kanha to Pench to Tadoba is a popular central India circuit, starting from Jabalpur and ending at Nagpur airport.' },
    ],
  },
];

export const routeBySlug = (slug: string) => cityRoutes.find((c) => c.slug === slug);
