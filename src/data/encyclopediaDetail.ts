/**
 * Extra, source-checked detail for the encyclopedia pages (October 2026).
 * Distances are road approximations from the reserve FAQs and the site's how-to-reach guides;
 * rules, fees and timings live in tadobaOfficial.ts / penchOfficial.ts.
 */

export type GateDetail = {
  village: string;
  fromNagpur: string;
  fromCity?: string;
  railhead: string;
  landmarks: string;
  bestFor: string;
};

export const tadobaGateDetail: Record<string, GateDetail> = {
  moharli: { village: 'Moharli (Mohurli) village, on the Irai reservoir', fromNagpur: 'About 140–150 km · 3–3.5 hours', fromCity: 'About 30–45 km from Chandrapur · under an hour', railhead: 'Chandrapur (Delhi–Chennai trunk line)', landmarks: 'Tadoba Lake, Telia Lake, Pandharpauni meadows, Panchdhara', bestFor: 'First-time visitors, families and short trips' },
  khutwanda: { village: 'Near Mudholi and Wadala Tukum villages', fromNagpur: 'About 135 km · around 3 hours', fromCity: 'A short drive from the Moharli resort belt (around 4 km from the Sanctuary resort area)', railhead: 'Chandrapur', landmarks: 'Southern core forest, bamboo stands and the Moharli-side lake belt', bestFor: 'Travellers who missed Moharli permits and want the same country with fewer vehicles' },
  agarzari: { village: 'Agarzari, on the Moharli road', fromNagpur: 'About 140 km · around 3 hours', fromCity: 'About 20–25 km from Chandrapur, roughly 6 km before Moharli gate', railhead: 'Chandrapur', landmarks: 'Moharli-side buffer woodland and village edges', bestFor: 'Buffer safaris, the noon slot and monsoon drives' },
  junona: { village: 'Junona village and its lake', fromNagpur: 'About 140 km · around 3 hours', fromCity: 'About 25–30 km from Chandrapur', railhead: 'Chandrapur', landmarks: 'Junona lake edges and wetland, mixed buffer forest', bestFor: 'Birding, buffer drives close to Chandrapur, monsoon safaris' },
  kolara: { village: 'Kolara, near Chimur', fromNagpur: 'About 110 km via Umred–Chimur · 2–2.5 hours', fromCity: 'Chimur is the nearest town', railhead: 'Nagpur (airport and railway)', landmarks: 'Kolara core meadows and the Tadoba–Kolara road', bestFor: 'Visitors driving from Nagpur and photographers' },
  'kolara-chauradeo': { village: 'Chauradeo, beside the Kolara gate', fromNagpur: 'About 110 km · 2–2.5 hours', fromCity: 'Chimur is the nearest town', railhead: 'Nagpur', landmarks: 'Northern buffer forest connected with the Madnapur and Belara belts', bestFor: 'A buffer back-up when Kolara core is sold out' },
  navegaon: { village: 'Navegaon, on the north-west edge of the reserve', fromNagpur: 'About 115 km · around 2.5 hours', fromCity: 'Between Kolara and Moharli', railhead: 'Nagpur', landmarks: 'Navegaon core, the Ramdegi hills and temple area, Khadsangi range', bestFor: 'Repeat visitors and behaviour watchers' },
  nimdela: { village: 'Nimdhela (Nimdela), next to Navegaon', fromNagpur: 'About 115 km · around 2.5 hours', fromCity: 'Close to the Navegaon resort cluster', railhead: 'Nagpur', landmarks: 'Navegaon-side buffer woodland', bestFor: 'Quiet buffer drives on the Navegaon side' },
  pangdi: { village: 'Pangdi, on the Sindewahi–Mul side', fromNagpur: 'About 170 km · 3–3.5 hours', fromCity: 'Mul and Sindewahi are the nearest towns', railhead: 'Chandrapur or Nagpur', landmarks: 'Former Kolsa range forests and teak belts', bestFor: 'Fewer vehicles and leopard hopefuls' },
  zari: { village: 'Zari, beyond Pimpalkhut', fromNagpur: 'About 170 km · 3–3.5 hours', fromCity: 'Reached via Mul; Mama Talav near Pimpalkhut lies on the way', railhead: 'Chandrapur or Nagpur', landmarks: 'Zari meadows, Mama Talav, Kolsa-side forest', bestFor: 'Quiet drives and second or third Tadoba trips' },
};

export const tadobaZoneDetail: Record<string, { fromNagpur: string; landmarks: string; bestFor: string; resortZone: 'moharli' | 'kolara' | 'navegaon' | 'pangdi-zari' }> = {
  'moharli-zone': { fromNagpur: 'About 140–150 km (3–3.5 h); 30–45 km from Chandrapur', landmarks: 'Tadoba Lake, Telia Lake, Pandharpauni, Panchdhara, Irai reservoir edge', bestFor: 'First-timers, families, anyone with only two or three drives', resortZone: 'moharli' },
  'kolara-zone': { fromNagpur: 'About 110 km via Umred–Chimur (2–2.5 h)', landmarks: 'Kolara core meadows, Madnapur and Belara buffer belts', bestFor: 'Travellers from Nagpur, photographers, mixed core and buffer trips', resortZone: 'kolara' },
  'navegaon-zone': { fromNagpur: 'About 115 km (around 2.5 h)', landmarks: 'Navegaon core, Ramdegi hills and temple area, Nimdhela buffer, Khadsangi range', bestFor: 'Repeat visitors and photographers who want fewer vehicles', resortZone: 'navegaon' },
  'pangdi-zari-zone': { fromNagpur: 'About 170 km (3–3.5 h)', landmarks: 'Kolsa range forests, Mamla teak belts, Zari and Pangdi meadows', bestFor: 'Birders, leopard hopefuls, second- and third-time visitors', resortZone: 'pangdi-zari' },
};

export type PenchGateDetail = GateDetail & { quota?: string; weeklyOff: string; resortZone?: 'turia' | 'karmajhiri' | 'jamtara' | 'sillari'; extra?: string };

export const penchGateDetail: Record<string, PenchGateDetail> = {
  turia: { village: 'Turia, off the Nagpur–Jabalpur highway (NH44) at Khawasa', fromNagpur: '85 km via Khawasa (reserve FAQ) · about 2 hours', fromCity: '215 km from Jabalpur via Seoni and Khawasa', railhead: 'Nagpur', landmarks: 'The Pench River and teak forest of the MP core', bestFor: 'First-time Pench visitors and the widest choice of stays', quota: '34 vehicles per shift (68 a day)', weeklyOff: 'Afternoon safari closed every Wednesday', resortZone: 'turia', extra: 'An 18-seat forest-department mini bus runs from Turia at ₹510 a seat, and same-day permits are sold at the gate (next morning: 6–8 pm the evening before; afternoon: 9–11 am the same day).' },
  karmajhiri: { village: 'Karmajhiri, on the Seoni side via Suktara', fromNagpur: '135 km via Suktara (reserve FAQ) · about 3–3.5 hours', fromCity: '50 km from Seoni; 195 km from Jabalpur', railhead: 'Seoni or Nagpur', landmarks: 'Eastern Pench MP forest and meadows', bestFor: 'Fewer vehicles and a quieter core drive', quota: '6 vehicles per shift (12 a day)', weeklyOff: 'Afternoon safari closed every Wednesday', resortZone: 'karmajhiri' },
  jamtara: { village: 'Jamtara, on the Chhindwara side', fromNagpur: 'Usually reached via Chhindwara rather than Nagpur', fromCity: '59 km from Chhindwara via Chand–Maghdoun, or 80 km via Bichhua–Pathri (reserve FAQ)', railhead: 'Chhindwara or Nagpur', landmarks: 'Northern and western Pench MP forest', bestFor: 'The quietest MP core gate', quota: '4 vehicles per shift (8 a day)', weeklyOff: 'Afternoon safari closed every Wednesday', resortZone: 'jamtara' },
  sillari: { village: 'Sillari, East Pench (Maharashtra), off NH44', fromNagpur: 'About 70–75 km · around 1.5 hours', railhead: 'Nagpur', landmarks: 'Paoni buffer, the road towards Totladoh dam', bestFor: 'Short trips from Nagpur and monsoon buffer safaris', weeklyOff: 'Wednesday', resortZone: 'sillari', extra: 'The reserve runs its monsoon buffer safari from Sillari into the Paoni area while the core is closed.' },
  khursapar: { village: 'Khursapar, Maharashtra side, off NH44', fromNagpur: 'About 85–90 km from Nagpur airport', railhead: 'Nagpur', landmarks: 'Maharashtra-side Pench forest bordering the MP reserve', bestFor: 'A Nagpur-side alternative to Turia', weeklyOff: 'Tuesday', resortZone: 'sillari' },
  chorbahuli: { village: 'Chorbahuli, Maharashtra side, reached from NH44', fromNagpur: 'Reached from NH44, the same side as Sillari and Khursapar', railhead: 'Nagpur', landmarks: 'Undulating teak forest of the Chorbahuli range', bestFor: 'Quiet Maharashtra-side drives', weeklyOff: 'Monday' },
  kolitmara: { village: 'Kolitmara, West Pench, reached via Parseoni', fromNagpur: 'Reached via Parseoni and Saoner, not the NH44 side', railhead: 'Nagpur', landmarks: 'West Pench forest and the Pench–Totladoh catchment', bestFor: 'Agro-tourism and adventure add-ons on the Maharashtra side', weeklyOff: 'Check the gate’s published holiday when booking', extra: 'The Maharashtra reserve lists Kolitmara as the base for its agro-tourism and paramotoring activities.' },
};

export type TigerEvent = { date: string; text: string };

export const tigerTimelines: Record<string, TigerEvent[]> = {
  maya: [
    { date: 'c. 2010', text: 'Born in Tadoba-Andhari and orphaned young (per her 2026 biography).' },
    { date: 'March 2022', text: 'Official Tadoba Diaries records four litters and 12 cubs.' },
    { date: 'August 2023', text: 'Last seen by patrol staff in the Panchdhara area near Tadoba Lake; foot patrols and combing begin.' },
    { date: 'November 2023', text: 'Decomposed tiger remains found in compartment 82 of Tadoba beat; DNA samples sent for testing. No result has been published.' },
    { date: 'April 2026', text: 'HarperCollins publishes “Maya: The Biography of a Tiger” by Anant Sonawane, the reserve’s communications officer.' },
  ],
  waghdoh: [
    { date: 'Until 2015', text: 'Dominant male of the Telia–Moharli landscape.' },
    { date: '2015', text: 'Pushed out of the core by younger males; settles in the Devada buffer, later Junona.' },
    { date: '23 May 2022', text: 'Found dead of old age in the Sinala forest, Chandrapur range, aged about 15–18.' },
  ],
  'chota-matka': [
    { date: 'c. 2022–2025', text: 'Holds the Navegaon side and surrounding buffer.' },
    { date: '12–13 May 2025', text: 'Kills the rival male T-158 (Brahma) but is severely injured.' },
    { date: '27 August 2025', text: 'Tranquillised in the Khadsangi range and moved to the Transit Treatment Centre, Chandrapur.' },
    { date: 'Aug–Sep 2025', text: 'Bombay High Court (Nagpur bench) takes up his care in a suo motu PIL; the reserve says release to the wild is unlikely.' },
  ],
  madhu: [
    { date: '2022', text: 'Official profile places her in the Agarzari–Pardi buffer.' },
    { date: '2026', text: 'Hindi-language media report a tigress identified as Chhoti Madhu with three cubs.' },
  ],
  lara: [
    { date: '2022', text: 'Official profile records her fourth litter of four cubs.' },
    { date: '2023', text: 'Official account documents her with four cubs near a gaur kill.' },
  ],
  tara: [
    { date: '2014–2021', text: 'Radio-collared and monitored by the Wildlife Institute of India.' },
  ],
  'chhoti-tara': [
    { date: 'May 2022', text: 'Official reserve magazine lists her among females rearing cubs.' },
    { date: 'October 2025', text: 'Named in press coverage as the mother of Chhota Matka (T-126).' },
  ],
  matkasur: [
    { date: '2019', text: 'Documented at Ainbodi waterhole in the Pandharpauni landscape.' },
    { date: 'May 2024', text: 'Official Tadoba Diaries article refers to him as T-49.' },
  ],
};

export const tigerExtraSources: Record<string, string[]> = {
  maya: ['mayaBook', 'mayaRemains'],
  waghdoh: ['waghdohDeath', 'waghdohHitavada'],
  'chota-matka': ['chhotaMatkaRescue', 't158Fight', 'chhotaMatkaSaga', 'chhotaMatkaHc'],
  'chhoti-tara': ['chhotaMatkaSaga'],
  matkasur: ['chhotaMatkaSaga'],
  madhu: ['chhotiMadhuCubs'],
};

export type SpeciesDetail = {
  local: string;
  identify: string;
  size: string;
  weight: string;
  lifespan?: string;
  breeding: string;
  population: string;
  bestTime: string;
  sources: string[];
};

export const speciesDetail: Record<string, SpeciesDetail> = {
  'bengal-tiger': { local: 'Wagh (Marathi), Bagh / Sher (Hindi)', identify: 'Orange coat with black stripes unique to each animal, white underparts and white spots behind the ears.', size: 'Males about 2.7–3.1 m from nose to tail tip', weight: 'Males commonly 180–260 kg; females 100–160 kg', lifespan: 'About 10–15 years in the wild', breeding: 'Gestation of about 3.5 months; litters of 2–4 cubs that stay with the mother for roughly two years.', population: 'India: 3,682 (2022 mean estimate, about 75% of the world’s wild tigers). Maharashtra: 444. Tadoba: 80+ in the reserve, around 200 across the wider landscape.', bestTime: 'March–June, when animals gather near water; morning drives are most productive.', sources: ['ntcaTigers2022', 'tadobaSafari'] },
  'indian-leopard': { local: 'Bibat (Marathi), Tendua / Guldar (Hindi)', identify: 'Golden coat covered in rosettes (dark rings with no central spot), long tail, often seen on trees or rocks.', size: 'Body about 1–1.9 m plus a 0.6–1 m tail', weight: 'Males roughly 50–75 kg; females 30–40 kg', lifespan: 'About 12–15 years in the wild', breeding: 'Gestation of about three months; litters usually of 2–3 cubs.', population: 'India: 13,874 (2022 estimate, range 12,616–15,132). Maharashtra: 1,985, second only to Madhya Pradesh.', bestTime: 'Winter and summer mornings on quieter routes; in Tadoba the Pangdi–Kolsa side is known for leopards, including melanistic sightings.', sources: ['leopards2022', 'blackLeopardPench', 'tadobaEcology'] },
  dhole: { local: 'Kolsunda (Marathi), Jungli Kutta / Son Kutta (Hindi)', identify: 'Rust-red coat, dark bushy tail, rounded ears; almost always seen in a pack.', size: 'Body about 90 cm plus a 40–45 cm tail', weight: 'About 10–20 kg', lifespan: 'About 10 years in the wild', breeding: 'Usually one breeding pair per pack; litters of about 4–6 pups after a gestation of around two months.', population: 'IUCN Endangered: an estimated 949–2,215 mature individuals worldwide; India holds the largest share.', bestTime: 'Early mornings in winter and summer, along open tracks and meadows.', sources: ['dhole', 'tadobaResearch'] },
  'sloth-bear': { local: 'Aswal (Marathi), Bhalu (Hindi)', identify: 'Shaggy black coat, pale muzzle and a white V or Y mark on the chest; long curved claws.', size: 'Head and body about 1.4–1.9 m; 60–90 cm at the shoulder', weight: 'Males about 80–145 kg; females 55–95 kg', lifespan: 'About 20–25 years in the wild', breeding: 'Usually 1–2 cubs, which ride on the mother’s back for months.', population: 'IUCN Vulnerable; range-wide estimates vary from under 10,000 to over 20,000 and the trend is decreasing.', bestTime: 'March–June, when bears forage for mahua flowers and termites near tracks.', sources: ['slothBear', 'tadobaEcology'] },
  gaur: { local: 'Gawa (Marathi), Indian bison', identify: 'Massive dark-brown body, muscular shoulder ridge, white “stockings” on all four legs, curved horns in both sexes.', size: '1.65–2.2 m at the shoulder; males average about 1.88 m', weight: 'Males about 600–1,500 kg; females about 440–1,000 kg', breeding: 'Gestation of about nine months; usually a single calf.', population: 'IUCN Vulnerable; at most about 21,000 mature individuals worldwide (2016 estimate), most of them in India.', bestTime: 'Winter and summer, grazing in meadows and along forest roads.', sources: ['gaur', 'tadobaEcology'] },
  chital: { local: 'Chital / Spotted deer (Marathi: Thipkewala Haran)', identify: 'Rufous coat with white spots kept all year; stags carry three-tined antlers.', size: 'About 90 cm at the shoulder', weight: 'Stags about 30–75 kg; hinds 25–45 kg', breeding: 'Breeds through much of the year; usually a single fawn.', population: 'IUCN Least Concern; the most abundant deer in Central Indian tiger reserves.', bestTime: 'Year-round, especially around meadows and water at dawn and dusk.', sources: ['tadobaEcology', 'penchMhAbout'] },
  sambar: { local: 'Sambar (Marathi and Hindi)', identify: 'India’s largest deer: dark brown coarse coat, large rounded ears and, in stags, heavy three-tined antlers.', size: 'About 1–1.6 m at the shoulder', weight: 'Stags about 185–260 kg; hinds 100–160 kg', breeding: 'Usually a single fawn after a gestation of about eight months.', population: 'IUCN Vulnerable since 2008 because of hunting across its Asian range; stable in well-protected Indian reserves.', bestTime: 'Summer, when they wallow in waterholes such as Pandharpauni.', sources: ['tadobaEcology', 'penchMhAbout'] },
  nilgai: { local: 'Neelgai / Blue bull (Marathi: Rohi)', identify: 'Asia’s largest antelope: bulls are blue-grey with a white throat patch and short horns; cows are tawny.', size: 'About 1–1.5 m at the shoulder', weight: 'Bulls about 110–290 kg; cows 100–210 kg', breeding: 'Gestation of about eight to nine months; twins are common.', population: 'IUCN Least Concern and widespread, especially at forest edges and farmland.', bestTime: 'Winter, in open buffer country and forest edges.', sources: ['tadobaEcology', 'penchMhAbout'] },
  'wild-boar': { local: 'Ran Dukkar (Marathi), Jungli Suar (Hindi)', identify: 'Bristly grey-black coat, a mane along the back and tusks in adult males.', size: 'Head and body around 1–1.5 m', weight: 'Adults commonly 50–100+ kg; males larger', breeding: 'Litters of about 4–6 piglets after a gestation of just under four months.', population: 'IUCN Least Concern; abundant across Central India.', bestTime: 'Year-round, often in family groups (sounders) along tracks.', sources: ['tadobaEcology', 'penchMhAbout'] },
  'mugger-crocodile': { local: 'Magar (Marathi and Hindi), Marsh crocodile', identify: 'Broad, heavy snout — the widest of any living crocodile — and armoured olive-grey body.', size: 'Usually 2–3.5 m; large males reach 4–4.5 m', weight: 'Large males up to about 450 kg', breeding: 'A hole-nester: 25–30 eggs laid in the dry season, incubated 55–75 days, with hatchling sex set by nest temperature.', population: 'IUCN Vulnerable and on CITES Appendix I.', bestTime: 'Sunny winter afternoons on the banks of Tadoba Lake and the Pench reservoir.', sources: ['mugger', 'tadobaReports'] },
};

/**
 * Who held which part of Tadoba, and when. `basis` says how strong each claim is:
 * Official = Tadoba Diaries / reserve publication; News = dated press; Field reports = lodge and
 * naturalist accounts (2021–2025), which often disagree and are never treated as fixed fact.
 */
export type TerritoryRow = { period: string; tiger: string; area: string; note: string; basis: 'Official' | 'News' | 'Field reports' };

export const zoneTigerHistory: Record<string, { now: string; rows: TerritoryRow[] }> = {
  'moharli-zone': {
    now: 'Field reports from 2024–25 say Chhoti Tara and her daughters Roma and Bijli now use Maya’s old Pandharpauni ground, while Telia remains contested. No official territory map is published.',
    rows: [
      { period: 'Until 2015', tiger: 'Waghdoh (T-33), male', area: 'Telia–Moharli core', note: 'Dominant male until younger tigers pushed him to the Devada and Junona buffer; died of old age in May 2022.', basis: 'News' },
      { period: 'c. 2014–2022', tiger: 'Madhuri (T-10), female', area: 'Telia Dam, later Moharli buffer', note: 'Mother of the Telia sisters; moved to the buffer after her daughter Sonam displaced her.', basis: 'Official' },
      { period: 'c. 2015–2022+', tiger: 'Sonam (T-24), female', area: 'Telia Lake', note: 'The dominant Telia sister. Later challengers are reported but not officially documented.', basis: 'Official' },
      { period: 'c. 2014 – August 2023', tiger: 'Maya (T-12), female', area: 'Pandharpauni and Tadoba Lake', note: 'Tadoba’s best-known tigress; missing since August 2023 and presumed dead.', basis: 'News' },
      { period: 'c. 2019', tiger: 'Matkasur (T-49 in a 2024 official account), male', area: 'Pandharpauni landscape', note: 'Documented at Ainbodi waterhole and widely reported as the dominant core male of that period.', basis: 'Official' },
      { period: '2022', tiger: 'Lara (T-19), female', area: 'Moharli buffer, then core near the Khutwanda–Palasgaon road', note: 'Left Telia, like her mother, and settled further east.', basis: 'Official' },
      { period: '2022–2026', tiger: 'Madhu / Chhoti Madhu (T-127), female', area: 'Agarzari–Pardi and Dewada buffer', note: 'Took over much of her mother Madhuri’s buffer range; reported with three cubs in 2026.', basis: 'Official' },
      { period: 'c. 2024–2025', tiger: 'Chhoti Tara, female', area: 'Pandharpauni and Moharli core (Maya’s former area)', note: 'Reported with a March 2024 litter; daughters Roma and Bijli share the area.', basis: 'Field reports' },
    ],
  },
  'kolara-zone': {
    now: 'Field reports from 2025 name the male Xylo (born 2019) across the Kolara, Madnapur, Belara and Palasgaon buffers, with the tigress Junabai raising cubs in the Madnapur–Kolara buffer.',
    rows: [
      { period: 'Until c. 2020', tiger: 'Bajrang, male', area: 'Kolara and Moharli ranges', note: 'Long-time dominant male credited with many cubs. His later fate is not confirmed in news reports.', basis: 'Field reports' },
      { period: '2018–2025', tiger: 'Junabai, female', area: 'Madnapur–Kolara buffer', note: 'Matriarch of the Kolara side with several litters; raising two sub-adults in mid-2025.', basis: 'Field reports' },
      { period: 'c. 2022–2025', tiger: 'Xylo, male (born 2019)', area: 'Kolara, Madnapur, Belara and Palasgaon buffers', note: 'Named for an “XY” mark on his face; reported as the area’s dominant male.', basis: 'Field reports' },
      { period: 'c. 2024', tiger: 'Veera and Bela, females', area: 'Belara and Palasgaon buffers', note: 'Operators disagree on which tigress holds which gate.', basis: 'Field reports' },
    ],
  },
  'navegaon-zone': {
    now: 'Open. Since Chhota Matka was removed in August 2025, field reports describe young transient males competing for the Navegaon and Nimdela area; no new dominant male is confirmed.',
    rows: [
      { period: 'Until early 2021', tiger: 'Mowgli, male', area: 'Navegaon-side core', note: 'Reported to have lost his territory to Chhota Matka in early 2021.', basis: 'Field reports' },
      { period: '2021 – August 2025', tiger: 'Chhota Matka (T-126), male', area: 'Navegaon core and the Alizanza–Nimdela–Khadsangi buffer', note: 'Son of Matkasur and Chhoti Tara; reported to have beaten Bajrang in 2022.', basis: 'News' },
      { period: '12 May 2025', tiger: 'T-158 (Brahma), male', area: 'Umrikhora, Nimdela / Khadsangi buffer', note: 'Killed by Chhota Matka in a territorial fight; some reports give T-158 another name.', basis: 'News' },
      { period: '27 August 2025', tiger: 'Chhota Matka (T-126)', area: 'Khadsangi range, compartment 51', note: 'Tranquillised and moved to the Transit Treatment Centre, Chandrapur; release is considered unlikely.', basis: 'News' },
    ],
  },
  'pangdi-zari-zone': {
    now: 'Few dated records are public for this quieter side. Treat any named “ruler” here as unverified until the reserve publishes it.',
    rows: [
      { period: 'c. 2015–2021', tiger: 'Shivaji, male', area: 'Kolsa area', note: 'Reported as a son of Waghdoh who held the Kolsa side for years.', basis: 'Field reports' },
      { period: 'Ongoing', tiger: 'Leopards, including melanistic', area: 'Pangdi and Kolsa side', note: 'This side is better known for leopards than for named tigers.', basis: 'Field reports' },
    ],
  },
};
