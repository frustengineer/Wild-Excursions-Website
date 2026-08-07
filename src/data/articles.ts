import hero1 from '../assets/hero-carousel/1.jpg';
import hero2 from '../assets/hero-carousel/2.jpg';
import hero3 from '../assets/hero-carousel/3.jpg';
import hero4 from '../assets/hero-carousel/4.jpg';
import hero5 from '../assets/hero-carousel/5.jpg';
import hero6 from '../assets/hero-carousel/6.jpg';
import hero7 from '../assets/hero-carousel/7.jpg';
import tigerPanna from '../../tiger_PANNA.jpg';
import stockHero1 from '../../stock/hero1.jpg';
import stockHero2 from '../../stock/hero2.jpg';

export interface ArticleSection {
  heading?: string;
  paragraphs: string[];
}

export interface Article {
  slug: string;
  title: string;
  date: string;
  readTime: string;
  excerpt: string;
  image: ImageMetadata;
  sections: ArticleSection[];
}

export const articles: Article[] = [
  {
    slug: 'tracking-tigers-first-timers-guide-tadoba',
    title: "Tracking Tigers: A First-Timer's Guide to Tadoba",
    date: 'November 8, 2025',
    readTime: '6 min read',
    excerpt:
      'What to actually expect on your first tiger safari in Tadoba — picking a zone, reading the jungle, and why patience matters more than luck.',
    image: hero1,
    sections: [
      {
        heading: 'Why Tadoba',
        paragraphs: [
          "Tadoba-Andhari Tiger Reserve is Maharashtra's oldest and largest national park, and for a lot of first-time safari travelers, it's the easiest place to fall in love with tiger tracking. The forest is drier and more open than the sal forests further east, which means sightings tend to happen in the open rather than deep in cover you can't see into.",
          "It's also a working, well-run reserve — permits are organized, gates run on a strict schedule, and the naturalists who work these zones do it every single day of the season. That structure matters more than people expect on a first trip.",
        ],
      },
      {
        heading: 'Picking your zone and gate',
        paragraphs: [
          "Tadoba is split into multiple entry gates, each opening onto a different combination of territories. Some zones are known for reliable resident tigresses with cubs, others for wide lake views where the sightings are rarer but the scenery does the work. There's no single 'best' gate — it depends on the season, on which female is denning where that month, and on what you actually want out of the drive.",
          'This is the one decision worth not making yourself. A good local operator tracks which zone had activity in the last few days, not which zone had a good writeup two seasons ago.',
        ],
      },
      {
        heading: 'What a game drive actually looks like',
        paragraphs: [
          "Mornings start early — you're usually at the gate before sunrise, engines off, waiting for the forest department to open the barrier. The first hour is the coolest part of the day, and it's when the jungle is most active: deer calling, langurs moving through the canopy, the light still soft enough to see well into the undergrowth.",
          "A lot of a safari is just driving slowly and looking — not at a tiger, but at everything else. Alarm calls from a langur troop or a spotted deer herd are usually the first real clue something is moving nearby, long before you see stripes.",
        ],
      },
      {
        heading: 'Reading the jungle for signs',
        paragraphs: [
          'Fresh pugmarks in the dust on the track, scratch marks on a tree at roughly shoulder height, a scent marking on a bush at a trail junction — these are the things naturalists are quietly reading the entire drive, well before anything is visible. Learning to notice even one or two of these yourself changes the whole experience from waiting for a sighting to actively tracking one.',
        ],
      },
      {
        heading: 'What to pack and wear',
        paragraphs: [
          "Neutral colors — greens, browns, khakis — not black or white, which stand out and can unsettle wildlife at close range. Mornings in the open jeep are cold even in a warm climate, so a layer you can shed by mid-morning is worth it. Bring more water than you think you need, and don't skip the sunscreen; you're exposed for hours at a time.",
          "Most of all, come in with the right expectation: a tiger sighting is never guaranteed on any single drive, anywhere. What is guaranteed is a forest that's worth paying attention to, tiger or no tiger.",
        ],
      },
    ],
  },
  {
    slug: 'monsoon-safaris-best-sightings',
    title: 'Monsoon Safaris: Why the Rains Bring Out the Best Sightings',
    date: 'November 4, 2025',
    readTime: '5 min read',
    excerpt:
      "Most travelers skip the rains. Here's why the parks that stay open through monsoon can offer some of the sharpest, greenest safaris of the year.",
    image: hero2,
    sections: [
      {
        heading: 'The season everyone skips',
        paragraphs: [
          "Most Central Indian tiger reserves close for a stretch during the monsoon, but a few core zones and buffer areas stay open, and the ones that do are a completely different experience from the dry, dusty safaris of peak summer. Fewer travelers make the trip, which means fewer jeeps at every sighting and a much quieter forest overall.",
        ],
      },
      {
        heading: 'Green season, sharper sightings',
        paragraphs: [
          'Counterintuitively, a lush, green forest can make for better sightings, not worse. Waterholes are no longer the only source of water, so animals spread out rather than clustering at one or two known points — but the grass and undergrowth also stay shorter in the weeks right after the rains ease, before it grows tall and thick, giving a window of unusually open visibility across the same terrain that looks impenetrable in peak monsoon.',
          "It's also breeding and denning season for a lot of species. Birdlife in particular is at its most active and vividly plumaged, and the forest is loud in a way it simply isn't during the dry months.",
        ],
      },
      {
        heading: 'What changes on a monsoon drive',
        paragraphs: [
          "Tracks can be muddy, drives can be slower, and the weather is unpredictable enough that you plan for both sun and sudden rain in the same three-hour window. Naturalists read the terrain differently too — a lot of the alarm-call tracking that works in dry season is quieter now, so more of the tracking relies on reading movement and fresh signs directly.",
        ],
      },
      {
        heading: 'Practical monsoon safari tips',
        paragraphs: [
          'Pack a proper rain layer, not just an umbrella — jeeps are open, and you will get caught in a shower at some point. Waterproof your camera gear or bring a dry bag. And go in prepared for a slower, quieter kind of safari: fewer big-ticket sightings guaranteed on paper, but often a more atmospheric, less crowded forest than you get in the busiest months of the year.',
        ],
      },
    ],
  },
  {
    slug: 'elephants-at-dawn-kanha',
    title: 'Elephants at Dawn: A Morning in Kanha National Park',
    date: 'November 8, 2025',
    readTime: '5 min read',
    excerpt:
      'The meadows of Kanha come alive in the first hour after sunrise. A look at why the earliest gate entry is worth the cold, early wake-up call.',
    image: hero3,
    sections: [
      {
        heading: 'Before sunrise at the gate',
        paragraphs: [
          "Kanha's gates open in the dark, and the drive in is done mostly by headlamp and the first grey light of dawn. It's genuinely cold in the open jeep at that hour, even in a place most people picture as tropical — the meadows hold the night's chill until the sun clears the treeline.",
        ],
      },
      {
        heading: 'The meadows wake up',
        paragraphs: [
          "Kanha is built around wide, rolling grassland meadows ringed by sal forest, and that landscape is a big part of why early mornings here feel different from denser parks. As the light comes up, the meadows fill in stages — first the deer herds moving out to graze, then the calls starting up across the treeline, then, if you're patient and lucky, larger movement at the forest edge.",
          "This is also prime habitat for barasingha, the hard-ground swamp deer that Kanha is credited with bringing back from the edge of local extinction through decades of dedicated conservation work — a story the naturalists here are genuinely proud to tell, and one worth asking about on the drive.",
        ],
      },
      {
        heading: 'Why mornings matter more than evenings',
        paragraphs: [
          "Animals are more active in the cool hours right after sunrise, before the heat sets in and the forest goes quiet through the middle of the day. A morning drive typically covers more ground activity — more calls, more movement, more of the forest actually doing something — than the equivalent evening slot, even though both are officially the same length.",
        ],
      },
      {
        heading: 'What to bring',
        paragraphs: [
          'A proper warm layer for the drive out — this is the detail first-timers underestimate most. Binoculars are worth more here than almost anywhere else, given how much of the early activity happens at meadow-edge distance rather than right beside the track. And bring patience: the best moments in Kanha tend to reward simply sitting still and watching a treeline rather than chasing a report of movement across the park.',
        ],
      },
    ],
  },
  {
    slug: 'birds-of-pench',
    title: 'Beyond the Big Cat: The Birds of Pench',
    date: 'November 8, 2025',
    readTime: '5 min read',
    excerpt:
      "Pench has one of the richest bird checklists of any reserve in Central India. A guide to slowing down and looking up on your next safari.",
    image: hero4,
    sections: [
      {
        heading: 'A park built for more than tigers',
        paragraphs: [
          "Pench sits along the Pench River, straddling the Maharashtra–Madhya Pradesh border, and its mix of teak forest, riverine habitat, and open grassland supports one of the richest bird lists of any Central Indian reserve. It's easy to spend an entire safari focused on tiger tracks and miss most of it — which is exactly what a lot of first-time visitors do.",
        ],
      },
      {
        heading: 'What to look — and listen — for',
        paragraphs: [
          "Raptors are a highlight: crested serpent eagles perched motionless over the canopy, changeable hawk-eagles working the treeline, and the occasional Pallid harrier over open grass in winter. Along the river and waterholes, look for storks, herons, and — if you time it right — the Indian pitta, a small, brilliantly colored bird that's more often heard than seen.",
          "Kingfishers are almost guaranteed near any water body, and the forest canopy itself is loud with drongos, minivets, and woodpeckers for anyone willing to actually stop and listen instead of scanning only for movement on the ground.",
        ],
      },
      {
        heading: 'Best birding hours and spots',
        paragraphs: [
          "Early morning and the last hour before gate closing are consistently the most active windows, same as for larger mammals. Water bodies are the single best return-on-time investment — a ten-minute stop at a quiet waterhole in the right season can turn up more species than an hour of driving.",
        ],
      },
      {
        heading: 'Bringing binoculars, not just a zoom lens',
        paragraphs: [
          "A telephoto lens is built for a single subject at a distance; binoculars are built for scanning a whole treeline quickly, which is what birding actually rewards. If tiger tracking is the reason you booked the trip, the birds are the reason a lot of travelers end up booking a second one.",
        ],
      },
    ],
  },
  {
    slug: 'camping-under-stars-central-india',
    title: 'Camping Under Stars: Nights in the Central Indian Wilderness',
    date: 'November 4, 2025',
    readTime: '6 min read',
    excerpt:
      "There's a version of a safari trip that doesn't end when the gate closes. A look at what a night under canvas near the reserve is actually like.",
    image: hero5,
    sections: [
      {
        heading: 'Why stay outside the resort walls',
        paragraphs: [
          "Most safari stays are comfortable lodges just outside the buffer zone — good beds, hot water, a restaurant. There's nothing wrong with that. But a night camping closer to the forest edge, under canvas, gives you something a lodge room can't: the sounds of the jungle don't stop when the safari does.",
        ],
      },
      {
        heading: 'What a night under canvas is actually like',
        paragraphs: [
          "Tented camps set up for this are more comfortable than the word 'camping' usually implies — real beds, proper linens, an attached bathroom in most cases — but the walls are canvas, not concrete, and that changes how you experience the evening. Dinner is often around an open fire, with naturalists sharing stories from the day's drives rather than a printed menu and a hotel dining room.",
        ],
      },
      {
        heading: 'Sounds of the forest after dark',
        paragraphs: [
          "This is the real reason to do it. Once the generators quiet down and the camp settles, the forest doesn't. Sambar deer alarm calls carry a long way at night, jackals call across open ground, and on a good night, something larger moving through the dark nearby is close enough to hear plainly, even if you never see it. It's a different, quieter kind of encounter with the wild than anything from inside a jeep.",
        ],
      },
      {
        heading: 'Practical notes on wilderness camping',
        paragraphs: [
          "Nights get cold, even in seasons that are warm by day — pack for it. Torches and headlamps are essential once the sun is down, since camps deliberately keep artificial light low to stay in character with the setting. And go in with realistic expectations: this is about atmosphere and immersion, not a guaranteed close encounter. The value is in the stillness and the sound of a forest that doesn't know you're listening.",
        ],
      },
    ],
  },
  {
    slug: 'leopards-at-last-light',
    title: "Leopards at Last Light: Spotting Central India's Shyest Big Cat",
    date: 'November 14, 2025',
    readTime: '5 min read',
    excerpt:
      "Leopards are more common than tigers in most reserves and far harder to see. Here's why dusk changes your odds — and how to actually look.",
    image: hero6,
    sections: [
      {
        heading: 'The cat that outnumbers the tiger',
        paragraphs: [
          "In almost every Central Indian reserve, leopards outnumber tigers by a wide margin — and yet most travelers leave having seen far fewer of them. It's not a numbers problem, it's a behavior one. Leopards are solitary, mostly nocturnal, and built to disappear in dappled shade in a way tigers, with their bold stripes on open ground, simply aren't.",
        ],
      },
      {
        heading: 'Why the last hour of light matters',
        paragraphs: [
          "Leopards start moving as the day cools, well before a tiger typically does, which makes the final hour before gate-closing one of the best windows of the entire day. They favor rocky outcrops, riverine trees, and forest edges bordering open ground — places with both cover and a vantage point.",
          'A naturalist scanning for leopard won\'t be looking at the road. They\'ll be scanning tree branches, boulder tops, and the tree line thirty to fifty meters back — because a leopard draped over a branch at dusk can look exactly like a broken shadow until it moves.',
        ],
      },
      {
        heading: 'Reading the other animals',
        paragraphs: [
          "Langur alarm calls are the single most reliable leopard indicator in the forest — sharper and more panicked than the calls they give for a tiger, and usually aimed straight up into the canopy rather than out toward the ground. If you hear langurs going off directly overhead rather than across open ground, look up into the trees, not down the track.",
        ],
      },
      {
        heading: 'Setting realistic expectations',
        paragraphs: [
          "A leopard sighting is rarely a long, relaxed encounter the way a resting tiger can be. It's often a silhouette on a branch, a tail hanging below a canopy line, or a shape crossing the road in under three seconds. Treat it as a different kind of prize than a tiger sighting — quicker, quieter, and worth exactly as much for how hard it is to earn.",
        ],
      },
    ],
  },
  {
    slug: 'sloth-bears-of-satpura',
    title: "The Sloth Bears of Satpura: India's Most Overlooked Predator",
    date: 'November 14, 2025',
    readTime: '5 min read',
    excerpt:
      'Satpura is one of the few Indian reserves where you can safari on foot and by boat, not just by jeep — and its sloth bears are the reason many travelers come back a second time.',
    image: hero7,
    sections: [
      {
        heading: 'A reserve built differently',
        paragraphs: [
          "Satpura Tiger Reserve in Madhya Pradesh runs on a different model from most Indian parks. Alongside jeep safaris, it permits walking safaris and boat safaris on the Denwa River backwaters — a rare combination that changes the pace of the entire visit from a drive-and-spot format to something closer to actual tracking.",
        ],
      },
      {
        heading: 'Why sloth bears, specifically',
        paragraphs: [
          "Sloth bears are shaggy, near-sighted, and surprisingly fast when startled, and Satpura's rocky, forested terrain is some of the best sloth bear habitat left in Central India. They're most active early morning and again after dusk, often digging at termite mounds or turning over rocks and logs for grubs — a very different rhythm of activity from the cats.",
          "Because they hunt largely by smell rather than sight, sloth bears are also one of the few large animals you can sometimes approach on foot with an experienced guide, at a safe and regulated distance, in the specific zones where walking safaris are permitted.",
        ],
      },
      {
        heading: 'What a walking safari changes',
        paragraphs: [
          'On foot, tracking shifts from scanning open ground at speed to reading the terrain up close — a scuffed termite mound, claw marks on a tree trunk, overturned stones along a slope. It is slower and it asks more of you, but it is also the closest most travelers ever get to the actual mechanics of tracking, rather than watching someone else do it from a jeep seat.',
        ],
      },
      {
        heading: 'Planning a Satpura trip',
        paragraphs: [
          'Because walking and boat safaris run in limited numbers and specific zones, Satpura rewards a bit more advance planning than a standard jeep-only reserve. Go in with an open itinerary rather than a single must-see animal in mind — the reserve\'s real strength is the range of ways it lets you experience the forest, not any one guaranteed sighting.',
        ],
      },
    ],
  },
  {
    slug: 'ranthambore-fort-safaris',
    title: "Ranthambore's Ruins: Safaris Through a Living Fort",
    date: 'November 18, 2025',
    readTime: '5 min read',
    excerpt:
      'A 10th-century fort still stands inside Ranthambore\'s core zone, and its lakes and ruins are some of the most photographed tiger territory in India.',
    image: tigerPanna,
    sections: [
      {
        heading: 'A reserve with a fort inside it',
        paragraphs: [
          'Most tiger reserves are pure wilderness. Ranthambore is not — a UNESCO World Heritage fort dating back to the 10th century sits inside the core forest, its walls, gates, and stepwells scattered through the reserve rather than fenced off from it. Tigers use the ruins as territory like any other feature of the landscape: sunning themselves on old stone terraces, drinking from step-wells built for people who left centuries ago.',
        ],
      },
      {
        heading: 'The lakes that define the landscape',
        paragraphs: [
          "Padam Talab, Rajbagh, and Malik Talab — the three main lakes inside the reserve — are where a huge share of Ranthambore's most iconic sightings happen, tigers wading through open water or resting at the lake's edge in full view, without the dense cover that makes sightings harder elsewhere. The combination of open water, ruined architecture, and crocodile and bird activity around the lakes makes this some of the most photogenic terrain of any Indian reserve.",
        ],
      },
      {
        heading: 'Zones and why they matter here',
        paragraphs: [
          "Ranthambore is divided into numbered zones, and which ones you're allotted has a real effect on the trip — some zones cover the lake systems and see the most consistent sightings, others are quieter, more forested territory with a different, less crowded character. Permits are allotted by the forest department in advance, which is exactly why booking zone strategy matters more here than in most reserves.",
        ],
      },
      {
        heading: "What to notice beyond the tiger",
        paragraphs: [
          'Even without a sighting, the fort itself is worth the drive — banyan roots growing through centuries-old archways, langurs perched on collapsed battlements, peacocks calling from old temple steps. Ranthambore rewards travelers who treat the ruins as part of the safari, not just scenery to drive past on the way to a tiger.',
        ],
      },
    ],
  },
  {
    slug: 'packing-checklist-first-indian-safari',
    title: 'Packing for Your First Indian Safari: A Practical Checklist',
    date: 'November 20, 2025',
    readTime: '4 min read',
    excerpt:
      "No fabric will get you a tiger sighting, but the wrong kit will make three hours in an open jeep a lot harder than it needs to be. Here's what actually matters.",
    image: stockHero1,
    sections: [
      {
        heading: 'Clothing: color and layers over fashion',
        paragraphs: [
          "Stick to muted greens, browns, and khakis — bright colors and stark white or black both stand out and can put wildlife on edge at close range. Layers matter more than any single item: mornings in an open jeep are genuinely cold, even in a place you'd otherwise think of as warm, and that changes fast once the sun clears the treeline.",
        ],
      },
      {
        heading: 'What to actually put in the bag',
        paragraphs: [
          'Binoculars, not just a camera — a lot of what happens on a good drive is at a distance no lens fully closes. A dust-proof bag or cover for any electronics, since safari tracks are unpaved and genuinely dusty in dry season. More water than feels necessary, sunscreen, and a hat with a strap that will not blow off in an open vehicle moving at speed.',
        ],
      },
      {
        heading: 'What to leave behind',
        paragraphs: [
          'Perfume and strong scented products — wildlife notices them well before you notice wildlife. Anything bright red or bright white. And, generally, any expectation that a single drive owes you a specific sighting. The kit is there to make three or four hours outdoors comfortable regardless of what shows up, not to guarantee what does.',
        ],
      },
      {
        heading: 'A short, honest checklist',
        paragraphs: [
          'Neutral-colored layers, a warm outer layer for early starts, binoculars, sunscreen, a hat, more water than you think you need, a dust cover for cameras and phones, and comfortable closed shoes for any walking sections. That short list covers the vast majority of what actually matters once you are in the jeep.',
        ],
      },
    ],
  },
  {
    slug: 'naturalists-vs-guides',
    title: "Naturalists vs. Guides: Why Who's Driving Your Jeep Matters",
    date: 'November 22, 2025',
    readTime: '4 min read',
    excerpt:
      'Two jeeps can drive the exact same route and come back with completely different trips. The difference is almost always the person reading the forest, not the forest itself.',
    image: stockHero2,
    sections: [
      {
        heading: 'The gap between a driver and a naturalist',
        paragraphs: [
          "Every safari jeep needs a driver and a forest department guide by regulation, but the quality of the experience usually comes down to something regulation doesn't cover: whether the naturalist in the vehicle actually knows the specific territory, the resident animals, and how to read the forest in real time — or is simply following whichever jeep ahead seems to have found something.",
        ],
      },
      {
        heading: 'What a good naturalist is actually doing',
        paragraphs: [
          "They're reading alarm calls and placing them — which direction, how far, which species is calling and why that matters. They know which female is holding which territory this season, which waterhole is active in the current heat, and which stretch of the last zone had fresh pugmarks yesterday morning. None of that is visible to a passenger; all of it shapes where the jeep goes next.",
        ],
      },
      {
        heading: 'Why this matters more than the zone you get',
        paragraphs: [
          'Two jeeps assigned the exact same zone on the exact same morning can have completely different drives, because one naturalist reads a distant alarm call correctly and repositions early, while the other keeps driving the main track waiting for a radio report from someone else. The zone sets the boundaries; the naturalist decides how well those boundaries actually get used.',
        ],
      },
      {
        heading: 'What to ask before you book',
        paragraphs: [
          "It's a fair question to ask any operator: who is actually in the jeep, and do they work these specific zones regularly, or just generally know the park? The honest answer to that question tells you more about the trip you're about to have than almost anything else in the itinerary.",
        ],
      },
    ],
  },
];
