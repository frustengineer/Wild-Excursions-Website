export interface TopicGuide {
  slug: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  overview: string;
  tourSlugs: string[];
  sections: { title: string; text: string; bullets: string[] }[];
  offer: { title: string; text: string; code: string };
  faqs: { question: string; answer: string }[];
}

export const topicGuides: TopicGuide[] = [
  {
    slug: 'places-to-visit-in-maharashtra', eyebrow: 'Explore Maharashtra', title: 'Wild places to visit in Maharashtra',
    subtitle: 'Tiger country, quiet teak forests and compact reserves within reach of Nagpur.',
    overview: 'Maharashtra is one of India’s easiest states for building a multi-reserve wildlife trip. Tadoba offers the strongest all-round safari circuit, while Tipeshwar, Nagzira and Umred–Karhandla reward travellers who prefer quieter drives and less familiar landscapes.',
    tourSlugs: ['tadoba-tiger-safari','tadoba-extended-safari','tipeshwar-weekend-safari','nagzira-tiger-safari','karanhdhla-weekend-safari','karanhdhla-extended-safari'],
    sections: [
      { title: 'Choose the right reserve', text: 'Tadoba suits a first tiger safari; Tipeshwar is compact and relaxed; Nagzira brings lakes and mixed forest; Umred–Karhandla works beautifully for short extensions from Nagpur.', bullets: ['Tadoba: best-developed safari circuit', 'Tipeshwar: low jeep density', 'Nagzira: birding and scenic woodland', 'Umred–Karhandla: convenient short escape'] },
      { title: 'How long to plan', text: 'Allow three nights for one reserve or five to seven nights for a two-reserve itinerary. More drives improve your chances without turning the holiday into a rushed checklist.', bullets: ['2–4 drives for a short break', '6 drives for serious wildlife time', 'Add a rest afternoon between reserves'] },
    ],
    offer: { title: 'Maharashtra multi-park offer', text: 'Book two Maharashtra reserves together and get a complimentary Nagpur airport or railway-station transfer.', code: 'MAHAWILD' },
    faqs: [
      { question: 'Which Maharashtra reserve is best for a first safari?', answer: 'Tadoba is the strongest first choice because it combines multiple gates, experienced naturalists and a broad range of stays.' },
      { question: 'Can two reserves be combined?', answer: 'Yes. Tadoba with Umred–Karhandla or Nagzira makes an efficient road itinerary from Nagpur.' },
      { question: 'How early should permits be booked?', answer: 'Book peak-season core-zone drives as early as possible; availability is limited and linked to visitor ID details.' },
    ],
  },
  {
    slug: 'places-to-visit-in-madhya-pradesh', eyebrow: 'The Heart of India', title: 'Wild places to visit in Madhya Pradesh',
    subtitle: 'Sal forests, grasslands, river valleys and some of India’s most celebrated tiger landscapes.',
    overview: 'Madhya Pradesh offers exceptional variety. Kanha is expansive and atmospheric, Bandhavgarh is compact and tiger-focused, Pench mixes teak forest with open meadows, Satpura adds walking and water-based experiences, and Panna pairs wildlife with dramatic plateaus.',
    tourSlugs: ['kanha-tiger-safari','bandhavgarh-extended-safari','bandhavgarh-tiger-safari','pench-weekend-safari','satpura-wildlife-safari','panna-tiger-safari'],
    sections: [
      { title: 'Five distinct landscapes', text: 'No two reserves feel the same, which makes Madhya Pradesh ideal for a longer circuit rather than a single rushed stop.', bullets: ['Kanha for scale and classic sal forest', 'Bandhavgarh for concentrated safari time', 'Pench for accessible family trips', 'Satpura for varied activities', 'Panna for scenery and heritage pairings'] },
      { title: 'Build a logical circuit', text: 'Kanha and Bandhavgarh combine naturally. Pench works well from Nagpur, while Satpura pairs with Bhopal and Panna with Khajuraho.', bullets: ['Keep road transfers under one per day', 'Spend at least three nights per major reserve', 'Use arrival and departure days as recovery time'] },
    ],
    offer: { title: 'Central India circuit saving', text: 'Save ₹3,000 per person when you combine any two Madhya Pradesh safari packages of three nights or longer.', code: 'MPCIRCUIT' },
    faqs: [
      { question: 'Kanha or Bandhavgarh—which should I choose?', answer: 'Choose Kanha for landscape and a slower immersive trip; choose Bandhavgarh when tiger-focused drives are the priority.' },
      { question: 'Which airport is most useful?', answer: 'Jabalpur serves Kanha and Bandhavgarh, Nagpur is practical for Pench, Bhopal for Satpura, and Khajuraho for Panna.' },
      { question: 'Is Madhya Pradesh suitable for families?', answer: 'Yes. Pench and Kanha are particularly comfortable choices with good lodge options and manageable safari schedules.' },
    ],
  },
  {
    slug: 'top-safaris-in-tadoba', eyebrow: 'Tadoba–Andhari', title: 'Top safaris in Tadoba',
    subtitle: 'Pick the right trip length, gate strategy and number of drives for Maharashtra’s flagship tiger reserve.',
    overview: 'The best Tadoba itinerary depends less on a famous gate and more on current animal movement, permit availability and how many drives you can realistically enjoy. Our short, classic, extended and grand formats use the same on-ground planning with progressively more safari time.',
    tourSlugs: ['tadoba-short-safari','tadoba-tiger-safari','tadoba-extended-safari','tadoba-grand-safari'],
    sections: [
      { title: 'How many safaris?', text: 'Two drives introduce the park; four make a balanced weekend; six or eight allow zone changes as sightings shift.', bullets: ['Short: 2 drives', 'Classic: 4 drives', 'Extended: 6 drives', 'Grand: 8 drives'] },
      { title: 'Core and buffer strategy', text: 'A strong itinerary can include both. Core zones offer established routes, while buffers often produce excellent sightings with different terrain and fewer expectations.', bullets: ['Select gates before choosing a lodge', 'Avoid long cross-gate transfers', 'Keep one flexible drive where possible'] },
    ],
    offer: { title: 'Extra-drive Tadoba offer', text: 'Book an extended or grand safari and receive ₹2,000 off your package price.', code: 'TADOBA2000' },
    faqs: [
      { question: 'Which Tadoba gate is best?', answer: 'There is no permanently best gate. The practical choice depends on recent movement, permit availability and the location of your lodge.' },
      { question: 'Are tiger sightings guaranteed?', answer: 'No ethical operator can guarantee a wild sighting. More well-planned drives improve opportunity, but wildlife remains unpredictable.' },
      { question: 'What should I carry?', answer: 'Neutral clothing, a light layer for winter mornings, sun protection, binoculars and a camera with dust protection are useful.' },
    ],
  },
  {
    slug: 'top-safaris-in-kanha', eyebrow: 'Kanha National Park', title: 'Top safaris in Kanha',
    subtitle: 'Deeper sal forest, broad meadows and itineraries designed around the scale of Kanha.',
    overview: 'Kanha rewards time. Its zones are large, its landscapes change through the day, and wildlife encounters often emerge from patient tracking rather than quick circuits. Choose from two to eight drives depending on whether this is a short introduction or a dedicated photography trip.',
    tourSlugs: ['kanha-short-safari','kanha-tiger-safari','kanha-extended-safari','kanha-grand-safari'],
    sections: [
      { title: 'A safari for slow observation', text: 'Kanha is as memorable for barasingha, gaur, wild dogs and forest light as it is for tigers.', bullets: ['Use binoculars in open meadows', 'Allow time for zone transfers', 'Pair morning light with relaxed lodge afternoons'] },
      { title: 'Choose your trip length', text: 'Four drives suit most first visits. Six or eight drives give photographers more light conditions and a better chance to follow changing wildlife activity.', bullets: ['2 drives: quick introduction', '4 drives: balanced first trip', '6–8 drives: immersive safari'] },
    ],
    offer: { title: 'Kanha early-booking offer', text: 'Reserve a four-night Kanha safari at least 90 days ahead and save ₹2,500 per person.', code: 'KANHAEARLY' },
    faqs: [
      { question: 'How many nights are ideal in Kanha?', answer: 'Three or four nights work well for most visitors, providing four to six game drives without excessive travel fatigue.' },
      { question: 'Which animals can be seen besides tigers?', answer: 'Kanha is important for hard-ground barasingha and also supports gaur, wild dogs, leopards and rich birdlife.' },
      { question: 'Is Kanha good for photography?', answer: 'Yes. Meadows, sal forest and long sightlines provide varied backgrounds, especially during early and late light.' },
    ],
  },
  {
    slug: 'top-things-to-do-in-tadoba', eyebrow: 'Beyond the Game Drive', title: 'Top things to do in Tadoba',
    subtitle: 'Explore Tadoba through wildlife drives, water, village life, forest walks, conservation and photography.',
    overview: 'Tadoba is best known for tiger safaris, but a rewarding visit can include much more than jeep drives. Add a boat safari, a guided village experience, nature trails, bird photography and responsible conservation activities to experience the wider Tadoba landscape at a slower pace.',
    tourSlugs: ['tadoba-short-safari','tadoba-tiger-safari','tadoba-extended-safari','tadoba-grand-safari'],
    sections: [
      { title: 'Jungle safari', text: 'A guided jeep safari remains the signature Tadoba experience. Morning and afternoon drives explore core and buffer routes chosen around permits, gate access and recent wildlife movement.', bullets: ['Look for tigers, leopards, sloth bears, gaur and wild dogs', 'Carry binoculars and wear neutral-coloured clothing', 'Book permits early for peak travel dates'] },
      { title: 'Boat safari', text: 'Where local conditions and permissions allow, a boat experience offers a quieter view of Tadoba’s water bodies and surrounding habitat.', bullets: ['Excellent for landscapes and water birds', 'Best enjoyed in softer morning or evening light', 'Availability depends on season and local operations'] },
      { title: 'Village visit', text: 'A respectful guided village visit introduces travellers to local livelihoods, food traditions, crafts and daily life around the reserve.', bullets: ['Choose community-led experiences', 'Ask before photographing people', 'Support local produce and handmade goods'] },
      { title: 'Jungle trail', text: 'Guided nature trails in permitted areas reveal tracks, plants, insects and bird calls that are easy to miss from a safari vehicle.', bullets: ['Walk only in authorised zones with a trained guide', 'Wear closed shoes and carry water', 'Keep voices low and follow safety instructions'] },
      { title: 'Tree plantation', text: 'Join a verified lodge or community conservation activity focused on suitable native species and long-term care rather than one-time planting.', bullets: ['Use locally appropriate native trees', 'Prefer programmes that monitor survival', 'Avoid planting inside protected habitat without approval'] },
      { title: 'Bird photography', text: 'Tadoba’s lakes, bamboo, teak forest and village edges support raptors, owls, kingfishers, water birds and many smaller species.', bullets: ['Use a telephoto lens without disturbing birds', 'Photograph from designated paths and vehicles', 'Early mornings offer active birds and gentle light'] },
      { title: 'More experiences', text: 'Round out the trip with stargazing, cycling in suitable areas, local meals, nature interpretation, lodge activities and relaxed time around the forest edge.', bullets: ['Try a naturalist-led evening talk', 'Plan a local food experience', 'Keep one unscheduled afternoon to slow down'] },
    ],
    offer: { title: 'Tadoba activity package', text: 'Book a three-night Tadoba safari and get one local nature or community activity for free.', code: 'TADOBAEXPLORE' },
    faqs: [
      { question: 'Are all activities available throughout the year?', answer: 'No. Boat experiences, trails and community activities depend on weather, local permissions, operating schedules and safety conditions.' },
      { question: 'Can these activities be added to any Tadoba tour?', answer: 'Most can be added when timing and location permit. We plan them around confirmed safari gates so the itinerary remains practical.' },
      { question: 'Are jungle trails conducted inside the tiger reserve?', answer: 'Walking is offered only in authorised areas and must follow current forest-department rules with an approved guide.' },
      { question: 'Is bird photography suitable for beginners?', answer: 'Yes. A naturalist can help identify species, understand behaviour and choose ethical shooting distances.' },
    ],
  },
  {
    slug: 'explore-jungle-lodges', eyebrow: 'Stay Close to Nature', title: 'Explore jungle lodges',
    subtitle: 'Comfortable, characterful bases selected around safari gates—not brochure photographs.',
    overview: 'A good jungle lodge reduces transfer time, serves meals around drive schedules and understands early starts, dust and unpredictable returns. We match each stay to the booked gate, group style and budget instead of treating accommodation as an afterthought.',
    tourSlugs: ['tadoba-tiger-safari','pench-weekend-safari','kanha-tiger-safari','bandhavgarh-tiger-safari','satpura-wildlife-safari','kaziranga-wildlife-safari'],
    sections: [
      { title: 'What we check', text: 'Our lodge shortlist prioritises location, sleep quality, hygiene, flexible meals and staff who understand safari timings.', bullets: ['Practical distance from the gate', 'Early breakfast and packed-meal support', 'Reliable hot water and clean rooms', 'Naturalist access and quiet common spaces'] },
      { title: 'Choose your lodge style', text: 'Pick a simple wildlife-focused base, a family-friendly resort or a small eco-lodge with more privacy. The most expensive stay is not always the best operational fit.', bullets: ['Value lodge for drive-heavy itineraries', 'Pool and open space for families', 'Small inventory for quiet stays'] },
    ],
    offer: { title: 'Stay-and-safari upgrade', text: 'Book four nights with six safaris and receive a complimentary meal-plan upgrade at selected lodges.', code: 'LODGEPLUS' },
    faqs: [
      { question: 'Are lodges inside national parks?', answer: 'Most stays are outside reserve gates or in designated buffer landscapes; exact distance varies by park and gate.' },
      { question: 'Are meals included?', answer: 'Most packages include meals, but inclusions are clearly stated in the final itinerary before payment.' },
      { question: 'Can you arrange adjoining family rooms?', answer: 'We can request adjoining or nearby rooms, subject to lodge layout and availability.' },
    ],
  },
  {
    slug: 'discover-luxury-stays', eyebrow: 'Elevated Wilderness', title: 'Discover luxury jungle stays',
    subtitle: 'Private villas, thoughtful service and seamless safaris without losing the forest connection.',
    overview: 'Luxury in the jungle should mean space, calm service, excellent food and strong naturalists—not simply decorative rooms. These trips can be upgraded with premium stays, private transfers and customised pacing for couples, families or small groups.',
    tourSlugs: ['tadoba-grand-safari','kanha-grand-safari','bandhavgarh-grand-safari','ranthambore-grand-safari','satpura-grand-safari','jim-corbett-grand-safari'],
    sections: [
      { title: 'What premium includes', text: 'We build upgrades around the whole journey: airport assistance, comfortable road transfers, preferred room categories and private experiences where permitted.', bullets: ['Private chauffeured transfers', 'Premium rooms or villas', 'Curated dining and sundowners', 'Dedicated trip coordination'] },
      { title: 'Luxury with purpose', text: 'The right high-end lodge remains locally grounded through architecture, food, guiding and conservation practices.', bullets: ['Smaller lodge inventory', 'Strong naturalist teams', 'Responsible water and waste practices'] },
    ],
    offer: { title: 'Luxury safari privilege', text: 'Book a four-night premium stay and receive complimentary private airport transfers for two guests.', code: 'WILDPRIVÉ' },
    faqs: [
      { question: 'Can every tour be upgraded?', answer: 'Most itineraries can be upgraded, subject to premium lodge availability near the confirmed safari gate.' },
      { question: 'Are safari vehicles private?', answer: 'Private vehicle arrangements depend on park rules and permit type; we explain the available option before booking.' },
      { question: 'Can dietary preferences be handled?', answer: 'Yes. Share requirements in advance so the lodge and transfer teams can prepare appropriately.' },
    ],
  },
  {
    slug: 'getting-to-the-jungles', eyebrow: 'Travel Planning', title: 'Getting to India’s jungles',
    subtitle: 'The practical route guide for flights, rail connections and final road transfers.',
    overview: 'Safari planning starts with the gate, not only the park name. We coordinate arrival times with lodge distance, check-in rules and the reporting time for your first drive so that a delayed transfer does not cost a permit.',
    tourSlugs: ['tadoba-tiger-safari','pench-tiger-safari','kanha-tiger-safari','bandhavgarh-tiger-safari','ranthambore-tiger-safari','kaziranga-wildlife-safari'],
    sections: [
      { title: 'Useful gateways', text: 'Nagpur serves Tadoba and Pench; Jabalpur serves Kanha and Bandhavgarh; Jaipur connects Ranthambore by road or rail; Guwahati is the main gateway for Kaziranga.', bullets: ['Nagpur: Tadoba, Pench, Umred', 'Jabalpur: Kanha, Bandhavgarh', 'Jaipur/Sawai Madhopur: Ranthambore', 'Guwahati: Kaziranga'] },
      { title: 'Plan a safe arrival window', text: 'Avoid landing immediately before an afternoon safari. Road conditions, baggage delays and park reporting times leave little margin.', bullets: ['Arrive the previous evening when possible', 'Share flight or train details early', 'Keep photo ID accessible for permits'] },
    ],
    offer: { title: 'Door-to-jungle transfer', text: 'Book any three-night safari package and get free return transfer to the nearest major airport.', code: 'ROADTOWILD' },
    faqs: [
      { question: 'Are transfers included in tour prices?', answer: 'Some packages include transfers and others list them separately. Your final proposal shows every inclusion before payment.' },
      { question: 'Can you arrange railway-station pickups?', answer: 'Yes. We arrange private pickups from practical stations based on train timing and the confirmed safari gate.' },
      { question: 'What happens if a flight is delayed?', answer: 'Our team coordinates with the driver and lodge, but park reporting times are fixed; arriving a day early is the safest plan.' },
    ],
  },
  {
    slug: 'best-time-to-visit', eyebrow: 'Season by Season', title: 'Best time to visit India’s jungles',
    subtitle: 'Choose between cool weather, dramatic summer sightings and lush shoulder-season landscapes.',
    overview: 'There is no single perfect month. Winter is comfortable and atmospheric, late spring concentrates wildlife around water, and shoulder months can bring greener scenery and fewer travellers. The right choice depends on photography, comfort and species priorities.',
    tourSlugs: ['tadoba-tiger-safari','kanha-tiger-safari','bandhavgarh-tiger-safari','satpura-wildlife-safari','ranthambore-tiger-safari','jim-corbett-tiger-safari'],
    sections: [
      { title: 'October to February', text: 'Cool mornings, pleasant afternoons and attractive forest colour make this the most comfortable period.', bullets: ['Carry layers for dawn drives', 'Excellent for families', 'Peak dates need early permits'] },
      { title: 'March to June', text: 'Heat increases, foliage thins and animals visit remaining water more often. This can be rewarding for focused wildlife travellers.', bullets: ['Plan hydration and sun protection', 'Choose air-conditioned stays', 'Rest between drives'] },
      { title: 'Monsoon and reopening', text: 'Many core zones close during the monsoon, while selected buffers or parks may operate under local rules. Conditions and opening dates vary.', bullets: ['Confirm current park notifications', 'Expect route changes after rain', 'Consider birding and landscape-focused trips'] },
    ],
    offer: { title: 'Shoulder-season advantage', text: 'Travel from October to March and receive ₹1,500 off on selected three-night safari packages.', code: 'GREENWINDOW' },
    faqs: [
      { question: 'What is the best month for tiger sightings?', answer: 'Warmer months often improve visibility near water, but sightings remain unpredictable in every season.' },
      { question: 'When is the weather most comfortable?', answer: 'November through February generally offers the coolest conditions, especially during early-morning drives.' },
      { question: 'Are parks open during monsoon?', answer: 'Core-zone closures are common and dates vary by reserve. Always confirm current notifications before arranging travel.' },
    ],
  },
];
