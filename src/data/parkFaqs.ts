export interface ParkFaq {
  question: string;
  answer: string;
}

export const parkFaqsByJungle: Record<string, ParkFaq[]> = {
  tadoba: [
    {
      question: 'Will I definitely see a tiger on my Tadoba safari?',
      answer:
        "No sighting is ever guaranteed on a wild safari, but Tadoba is one of the more reliable Indian reserves for it — its drier, more open terrain gives naturalists better visibility than denser forests, and jeep safaris here are regularly rewarded with sightings.",
    },
    {
      question: "What's the best time to visit Tadoba National Park?",
      answer:
        'The park is open October through June. For the best odds of a tiger sighting, aim for March to June, when the dry heat concentrates wildlife around shrinking waterholes and thinner foliage improves visibility. November to February brings cooler, more comfortable weather and is better for birding.',
    },
    {
      question: 'How many days should I plan for a Tadoba safari trip?',
      answer:
        '2–3 days is usually enough to cover the main safari zones — Moharli, Kolara, Navegaon, and Pangadi/Zari — across multiple drives, which meaningfully improves your overall sighting odds compared to a single-day visit.',
    },
    {
      question: 'Is a naturalist guide compulsory on safari?',
      answer:
        "Yes. Every Tadoba safari requires a government-registered guide on board — they're trained to read pugmarks and alarm calls, know the zones, and are responsible for visitor safety throughout the drive.",
    },
    {
      question: 'Are elephant safaris available in Tadoba?',
      answer:
        "No — Tadoba only offers jeep safaris and shared canter safaris. There's no elephant safari option at this reserve.",
    },
    {
      question: 'When does Tadoba close for the season?',
      answer:
        'Most core zones close during the monsoon months (July–September) for the forest to recover, though several buffer zones stay open through the rains for travelers who want a quieter, greener visit.',
    },
  ],
  tipeshwar: [
    {
      question: "What's the best time to visit Tipeshwar Tiger Reserve?",
      answer:
        'The reserve is open October through June. March to May gives the best odds of a tiger sighting as the dry season pushes wildlife toward water sources, while October to February is cooler and greener if you prefer more comfortable safari hours.',
    },
    {
      question: 'How many safaris run per day at Tipeshwar?',
      answer:
        "Just 24 jeeps a day across the two entry gates — 12 from Sunna Gate and 12 from Mathani Gate, split evenly between morning and evening. That's a small fraction of what bigger reserves allow, so it stays noticeably less crowded.",
    },
    {
      question: 'Are night safaris available at Tipeshwar?',
      answer:
        "No — only morning and evening drives run here. The sanctuary closes after the evening slot to keep disturbance to wildlife to a minimum.",
    },
    {
      question: 'Which gate should I use — Sunna or Mathani?',
      answer:
        'Sunna Gate is the more convenient option for most visitors, since it sits closer to Pandharkawada and NH44 and is easier to reach from Nagpur or Amravati. Mathani Gate is the other entry point into the core zone.',
    },
    {
      question: 'When does Tipeshwar close for the season?',
      answer: 'Safaris pause through the monsoon months, July to September, and resume in October.',
    },
    {
      question: 'How far in advance should I book a Tipeshwar safari?',
      answer:
        'At least 30 days ahead if you\'re travelling in peak season (November–February) — permits are limited to just 24 jeeps a day, so popular slots fill up fast.',
    },
  ],
  nagzira: [
    {
      question: "What's the best time to visit Nagzira Wildlife Sanctuary?",
      answer:
        'Winter — October to February — is the best window, with cool temperatures (10–28°C) and clearer visibility for spotting tigers, leopards, and sloth bears. The sanctuary is open October 1 to June 30 each year.',
    },
    {
      question: 'Is Nagzira closed on any particular day?',
      answer: 'Yes — Nagzira is closed to visitors every Thursday, so plan your safari days around that.',
    },
    {
      question: 'How many entry gates does Nagzira have?',
      answer:
        'Eight in total — Nagzira, Kosamtondi, Murpar, Murdoli, Balapur, Pongezari, Mangezari, and Chorkhamara. Chorkhamara is particularly known for its dense forest and hilly terrain, with strong odds for tiger, leopard, and sloth bear sightings.',
    },
    {
      question: 'What are the safari timings at Nagzira?',
      answer:
        'They shift with the season — roughly 6:30–10:30 AM and 2:00–6:00 PM from November to February, moving to 6:00–10:00 AM and 2:30–6:30 PM from March to June.',
    },
    {
      question: 'What wildlife can I expect at Nagzira besides tigers?',
      answer:
        'Leopards and sloth bears are a real possibility here alongside tigers, and the sanctuary is also known for its bird life — it stays green and active well past the winter months.',
    },
    {
      question: 'What should I carry on a Nagzira safari?',
      answer: 'Valid photo ID, binoculars, a camera, a hat, insect repellent, and water — mornings and evenings can be cool, so a light layer helps too.',
    },
  ],
  kanha: [
    {
      question: "What's the best time to visit Kanha National Park?",
      answer:
        'The park is open October 15 to June 30. November to February brings cool, comfortable weather that\'s great for general wildlife viewing and birding, while March to June offers better tiger visibility as the vegetation thins out.',
    },
    {
      question: 'What are the safari zones at Kanha?',
      answer: 'Four zones are open for jeep safaris — Kisli, Mukki, Kanha, and Sarhi — each entered through its own gate.',
    },
    {
      question: 'Is Kanha closed on any particular day?',
      answer: 'Evening safaris are closed every Wednesday across the park — only the morning drive runs that day.',
    },
    {
      question: 'How long does a Kanha safari last?',
      answer: 'Around 4–5 hours per drive — the morning safari starts at sunrise, and the evening safari runs from roughly 3 PM until sunset.',
    },
    {
      question: 'How far in advance can I book a Kanha safari?',
      answer: 'Permits open up to 120 days ahead, and it\'s worth booking early for peak season (December–May) since popular zones sell out.',
    },
    {
      question: 'Are core zone safaris more expensive than buffer zones?',
      answer: 'Yes — core zone permits at Kanha cost more than buffer zone ones, though buffer zones still offer solid wildlife encounters at a lower price.',
    },
  ],
  bandhavgarh: [
    {
      question: "What's the best time to visit Bandhavgarh National Park?",
      answer:
        'The reserve is open October 15 to June 30. November to February is cooler and more comfortable, while March to mid-June — despite the heat, which can cross 40°C — gives the best odds of a tiger sighting as water sources shrink.',
    },
    {
      question: 'Which Bandhavgarh zone should I pick?',
      answer:
        'Tala zone has the highest tiger density here, plus meadows and views of the historic Bandhavgarh Fort, making it the go-to for first-timers — though it does get the most tourist traffic. Magadhi and Khitauli are quieter alternatives with good sighting chances of their own.',
    },
    {
      question: 'Is Bandhavgarh really that good for tiger sightings?',
      answer: "It has one of the highest tiger densities of any reserve in the world, which is why sightings here tend to be more consistent than at many other parks.",
    },
    {
      question: 'Can I do a walking safari in Bandhavgarh?',
      answer: 'No — walking inside the reserve isn\'t permitted. All safaris here are done by jeep.',
    },
    {
      question: 'How far ahead should I book a Bandhavgarh safari?',
      answer: 'As early as possible — permits are limited and can sell out up to 120 days before your travel date, especially for Tala zone.',
    },
    {
      question: 'When is Bandhavgarh closed for the season?',
      answer: 'The park shuts for safaris from July 1 to September 30 during the monsoon.',
    },
  ],
  pench: [
    {
      question: "What's the best time to visit Pench National Park?",
      answer:
        'The park is open mid-October to June 30. November to February is the most popular window — cool weather, migratory birds, and consistent tiger sightings — while May and June can be excellent too, as scarce water concentrates wildlife around remaining sources.',
    },
    {
      question: 'How many safari zones does Pench have?',
      answer:
        'Six gates in total — three core, three buffer. Turia zone has the highest wildlife density and best visibility; Karmajhiri and Jhamtara are the other popular core zones.',
    },
    {
      question: 'Are any Pench gates closed on specific days?',
      answer:
        'Yes — on the Maharashtra side, Khursapar Gate is closed Tuesdays and Sillari Gate is closed Wednesdays. On the Madhya Pradesh side, core-zone evening safaris are closed on Wednesdays.',
    },
    {
      question: 'Does Pench offer a night safari?',
      answer:
        'Yes — but only in the Wolf Sanctuary buffer zone (Rukhad and Khawasa), from 5:30 to 8:30 PM. Since it\'s a buffer zone, it stays open year-round, even through the monsoon.',
    },
    {
      question: 'How many people can ride in a safari jeep at Pench?',
      answer: 'Six passengers maximum per vehicle, and visitors aren\'t permitted to get out of the jeep during the drive.',
    },
    {
      question: 'Is Pench closed on any festivals?',
      answer: 'Yes — alongside the monsoon closure (July to mid-October), Pench also closes for Diwali, Republic Day, and Holi.',
    },
  ],
  satpura: [
    {
      question: 'What makes Satpura different from other tiger reserves?',
      answer:
        "It's one of the few Indian reserves where you're not limited to jeep safaris — Satpura also permits guided walking safaris and boat safaris, giving you a genuinely different way to experience the forest.",
    },
    {
      question: 'What is the boat safari at Satpura like?',
      answer:
        "It runs on the Denwa River, the lifeline of the park, and is a good way to take in the Satpura hills while watching for crocodiles and mammals coming down to the water's edge.",
    },
    {
      question: 'Is the walking safari safe?',
      answer:
        'Yes — it\'s done under strict supervision, always with a trained naturalist and forest staff accompanying the group, and follows a set route through the forest.',
    },
    {
      question: "What's the best time to visit Satpura?",
      answer:
        'October to March is the most comfortable window, with cool weather and active wildlife. The park is open October through June and closed for the monsoon (July–September).',
    },
    {
      question: 'What are the gate timings at Satpura?',
      answer: 'Roughly 6 AM to 5 PM, with closures on Holi, Diwali, and throughout the monsoon months.',
    },
    {
      question: 'Is Satpura good for sloth bear sightings?',
      answer: 'Yes — its rocky, forested terrain is some of the best sloth bear habitat left in Central India, alongside its resident tigers.',
    },
  ],
  panna: [
    {
      question: "Is it true Panna's tigers were reintroduced?",
      answer:
        "Yes. Panna's tigers were locally extinct by 2009, and what followed was one of India's most closely watched reintroduction programs, with tigers translocated from Bandhavgarh, Kanha, and Pench. The population has grown steadily since, with active breeding and multiple litters of cubs recorded in recent years.",
    },
    {
      question: "What's the best time to visit Panna National Park?",
      answer:
        'October to March is pleasant and great for birding; April to June gives the best odds of a tiger sighting as the dry season draws animals to the Ken River and remaining water sources. The park is open October 1 to June 30.',
    },
    {
      question: 'Which gate should I enter Panna from?',
      answer:
        'Madla is the most popular and accessible core gate, set among open grasslands and riverine forest near the Ken River. Hinauta is the other main core entry point.',
    },
    {
      question: 'Does Panna offer a night safari?',
      answer:
        "Yes — a rarity among Indian reserves. The Jhinna buffer zone runs night safaris where you can spot nocturnal wildlife like civets, honey badgers, and the rare rusty-spotted cat.",
    },
    {
      question: 'Is Panna closed on any particular day?',
      answer: 'Evening safaris are closed every Wednesday across the reserve.',
    },
    {
      question: 'When is Panna closed for the season?',
      answer: 'Core zones close for the monsoon from July 1 to September 30.',
    },
  ],
  karanhdhla: [
    {
      question: "What's the best time to visit Umred Karhandla (UKTR)?",
      answer:
        'November to March is the most comfortable window. The park is open October 15 to June 30 and closed through the monsoon.',
    },
    {
      question: 'How many entry gates does Umred Karhandla have?',
      answer:
        'Three — Karhandla Gate (about 8 km from Umred town), Gothangaon Gate (about 33 km), and Pauni Gate (about 35 km).',
    },
    {
      question: 'Is Umred Karhandla closed on any particular day?',
      answer: 'Yes — Karhandla and Gothangaon gates are closed on Mondays, and Pauni Gate is closed on Tuesdays.',
    },
    {
      question: 'Can I take my own vehicle on safari here?',
      answer: 'No — private vehicles aren\'t permitted inside the sanctuary. You\'ll need to book an authorized safari gypsy.',
    },
    {
      question: 'What are the safari timings at Umred Karhandla?',
      answer: 'Morning drives run 6:00–10:00 AM (gate entry allowed until 8:00 AM), and evening drives run 2:00–6:00 PM (entry until 4:30 PM).',
    },
    {
      question: 'What wildlife will I see besides tigers?',
      answer: 'Indian gaur (bison), deer, peacocks, and a range of smaller mammals — the sanctuary sees far fewer visitors than the bigger reserves nearby, so it feels noticeably quieter.',
    },
  ],
  ranthambore: [
    {
      question: "What's the best time to visit Ranthambore National Park?",
      answer:
        'November to April brings the mildest weather. For the best odds of a tiger sighting specifically, aim for March to May, when the dry season concentrates wildlife around water bodies.',
    },
    {
      question: 'How many safari zones does Ranthambore have?',
      answer:
        'Ten in total. Zones 1–5 close during the monsoon (July–September) while Zones 6–10 stay open year-round. Zones 2 and 3 are considered prime tiger territory, and Zones 4 and 5 see frequent sightings around water bodies.',
    },
    {
      question: 'How long does a Ranthambore safari last?',
      answer: 'Around 3 to 3.5 hours per drive.',
    },
    {
      question: 'How many safaris run per day at Ranthambore?',
      answer: 'Two — one in the morning and one in the afternoon — from October through June.',
    },
    {
      question: 'Do safari timings change with the season?',
      answer:
        'Yes — winter safaris run roughly 7:30–10:30 AM and 3:00–5:30 PM, while summer safaris shift earlier and later, around 6:30–9:30 AM and 4:00–6:30 PM, to work around sunrise and sunset.',
    },
    {
      question: 'Which zones are best for a first-time visitor?',
      answer: 'Zones 2 through 5 are generally recommended for the most consistent tiger sightings, particularly for travelers on a single-day visit.',
    },
  ],
};
