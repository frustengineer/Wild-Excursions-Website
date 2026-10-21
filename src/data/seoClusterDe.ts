/**
 * German pilot pages (rendered at /de/<slug>/). Each one translates an English page in
 * seoCluster.ts; figures are read from the same data so the two languages can't drift apart.
 * Keep park, gate, zone and resort names and every price exactly as in English.
 */
import { INR_PER, UPLIFT_MAX, UPLIFT_MIN, fxRound, type SeoCard, type SeoClusterPageData } from './seoCluster';
import { bufferFees, coreFees, fullDayFees, officialSource } from './tadobaOfficial';
import { penchGypsyTotals, penchSources } from './penchOfficial';

type Cur = keyof typeof INR_PER;
const fmt = (n: number) => n.toLocaleString('de-DE');
const rupees = (n: number) => `${fmt(n)} ₹`;
const rupeeBand = (lo: number, hi: number) => `${fmt(lo)}–${fmt(hi)} ₹`;
const fx = (inr: number, cur: Cur) => fmt(fxRound(inr / INR_PER[cur]));
/** Indian Citizen INR band → Foreign National band in another currency. */
const fnBand = (lo: number, hi: number, cur: Cur) => `${fx(lo * (1 + UPLIFT_MIN), cur)}–${fx(hi * (1 + UPLIFT_MAX), cur)}`;
const quotedBand = (lo: number, hi: number, cur: Cur) => `${fx(lo, cur)}–${fx(hi, cur)}`;
const fxRow = (label: string, lo: number, hi: number, band = fnBand) => [label, `ca. ${band(lo, hi, 'EUR')} €`, `ca. ${band(lo, hi, 'GBP')} £`, `ca. ${band(lo, hi, 'USD')} US$`];
const UPLIFT_LABEL = `in Parks in Maharashtra um ${Math.round(UPLIFT_MIN * 100)} % und in allen anderen Parks um ${Math.round(UPLIFT_MAX * 100)} % höher`;
const SP_EUR = fnBand(10700, 47600, 'EUR');
const MULTI_EUR = quotedBand(2600 * INR_PER.CAD, 5200 * INR_PER.CAD, 'EUR');

const authorsCost: SeoClusterPageData['authors'] = [{ prefix: 'Written by', name: 'Hardik Patel', role: 'Founder' }, { prefix: 'Reviewed by', name: 'Tejas Paliya', role: 'Operations' }];

const tigerReserveCards: SeoCard[] = [
  { title: 'Tadoba', label: 'Maharashtra', href: '/tours/tadoba/', text: 'Trockener Laubwald, offene Ufer und viele Kern- und Pufferzonen-Tore machen Tadoba ideal für die erste Safari wie für intensive Reisen mit vielen Pirschfahrten.' },
  { title: 'Pench', label: 'Madhya Pradesh & Maharashtra', href: '/tours/pench/', text: 'Teakwald, offene Wiesen und die kurze Anreise von Nagpur passen zu kurzen Safaris und zur Kombination mit Tadoba.' },
  { title: 'Kanha', label: 'Madhya Pradesh', href: '/tours/kanha/', text: 'Weiter Salwald und Graswiesen geben Kanha eine besondere Weite; der Barasingha-Hirsch erzählt eine Naturschutzgeschichte über den Tiger hinaus.' },
  { title: 'Bandhavgarh', label: 'Madhya Pradesh', href: '/tours/bandhavgarh/', text: 'Kompakte Zonen und eine dramatische Landschaft rund um das alte Fort sorgen für konzentriertes Fährtenlesen vor eindrucksvoller Kulisse.' },
  { title: 'Ranthambore', label: 'Rajasthan', href: '/tours/ranthambore/', text: 'Seen, Ruinen und trockener Wald zeigen den Tiger in einer der bekanntesten Safarilandschaften Indiens.' },
  { title: 'Panna', label: 'Madhya Pradesh', href: '/tours/panna/', text: 'Ein wiederbelebtes Tigergebiet am Fluss Ken, gut kombinierbar mit den Tempeln von Khajuraho.' },
  { title: 'Satpura', label: 'Madhya Pradesh', href: '/tours/satpura/', text: 'Zerklüftete Hügel und abwechslungsreiche Safariformen belohnen alle, denen Landschaft, Lippenbären und ruhige Beobachtung wichtig sind.' },
];

export const seoClusterPagesDe: SeoClusterPageData[] = [
  {
    lang: 'de',
    slug: 'tigersafari-indien-fuer-auslaender', path: '/de/tigersafari-indien-fuer-auslaender/',
    title: 'Tigersafari in Indien für Ausländer: Visum & Gebühren',
    description: 'So buchen ausländische Gäste eine Tigersafari in Indien: e-Visum, Genehmigungen nur mit Reisepass, Safarigebühren in Tadoba und Pench, Zahlung und Anreise.',
    h1: 'Tigersafari in Indien für ausländische Gäste', breadcrumb: 'Tigersafari für Ausländer', eyebrow: 'Internationale Reisende · Saison 2026/27',
    hero: 'home_images/bengal-tiger-wildlife-38.webp', heroAlt: 'Bengalischer Tiger in Zentralindien, der Grund für die meisten Safarireisen',
    heroStats: [
      { value: '4+ Tage', label: 'e-Visum vor der Einreise beantragen' },
      { value: 'Reisepass', label: 'Einziger Ausweis für Ausländer in Tadoba' },
      { value: rupees(fullDayFees[1].total), label: 'Ganztagessafari in Tadoba für ausländische Gäste' },
    ],
    commercial: true, schemaType: 'Article', authors: authorsCost,
    bylineNote: 'Regeln und Gebühren aus dem offiziellen e-Visa-Portal sowie den Portalen der Reservate Tadoba und Pench, geprüft im Oktober 2026.',
    intro: 'Ausländische Gäste können jede Tigersafari in Indien buchen, aber drei Dinge laufen anders: Sie brauchen ein indisches Visum (für die meisten Nationalitäten das e-Touristenvisum, mindestens 4 Tage vor der Einreise beantragt), jede Safarigenehmigung wird auf Ihren Reisepass ausgestellt, und mehrere Reservate verlangen von ausländischen Besuchern höhere Gebühren. Dieser Ratgeber erklärt jeden Schritt, die aktuellen Gebühren für Ausländer in Tadoba und Pench sowie Zahlung und Anreise aus dem Ausland.',
    ctaLabel: 'Safari aus dem Ausland planen', ctaHref: '/customize-trip/',
    closingHeading: 'Sagen Sie uns, woher Sie anreisen',
    closingText: 'Nennen Sie uns Ihr Land, Ihren Reisemonat, die Zahl der Reisenden und die Reservate, die Sie interessieren. Sie erhalten ein aufgeschlüsseltes Angebot zu den Preisen für ausländische Gäste, und wir buchen die Genehmigungen auf Ihre Passdaten.',
    sections: [
      { id: 'schritte', kicker: 'Das Wichtigste in Kürze', heading: 'So buchen ausländische Gäste eine Tigersafari in Indien', steps: [
        { title: 'Reservate und Reisedaten wählen', text: 'Die meisten internationalen Gäste kombinieren zwei oder drei Reservate in Zentralindien in 7 bis 14 Tagen. Die Kernzonen sind vom 1. Juli bis 30. September geschlossen, planen Sie also für Oktober bis Juni.' },
        { title: 'Visum beantragen', text: 'Prüfen Sie Ihre Berechtigung und beantragen Sie das Visum mindestens 4 Tage vor der Einreise im offiziellen indischen e-Visa-Portal. Nutzen Sie nur die Regierungsseite, keine Drittanbieter.' },
        { title: 'Genehmigungen mit dem Reisepass buchen', text: 'Safarigenehmigungen werden bis zu 120 Tage im Voraus freigegeben und pro Gast ausgestellt. Dafür brauchen wir Name, Passnummer und Staatsangehörigkeit jedes Reisenden.' },
        { title: 'Anreisen', text: 'Fliegen Sie nach Delhi oder Mumbai, dann mit einem Inlandsflug nach Nagpur (Tadoba, Pench) oder Jabalpur (Kanha, Bandhavgarh) und weiter auf der Straße zu Ihrer Lodge.' },
        { title: 'Den Original-Reisepass mitnehmen', text: 'Zeigen Sie ihn bei jeder Pirschfahrt am Tor vor. Kopien und Handyfotos werden abgelehnt, und die Nummer muss genau mit der Genehmigung übereinstimmen.' },
      ] },
      { id: 'visum', kicker: 'Vor dem Abflug', heading: 'Das indische e-Touristenvisum: Was Safarireisende wissen sollten', lead: 'Laut dem offiziellen indischen e-Visa-Portal (indianvisaonline.gov.in), geprüft im Oktober 2026. Die Regeln können sich ändern, prüfen Sie Ihre Berechtigung daher im Portal, bevor Sie Flüge buchen.',
        table: { headers: ['Regel', 'Was das Portal sagt'], rows: [
          ['Antrag', 'Mindestens 4 Tage vor dem Einreisedatum'],
          ['Gültigkeit', '30 Tage, 1 Jahr oder 5 Jahre, jeweils mit mehrfacher Einreise'],
          ['Höchstaufenthalt', 'Höchstens 180 Tage pro Kalenderjahr beim 1-Jahres- und 5-Jahres-Visum'],
          ['Reisepass', 'Bei Antragstellung noch mindestens 6 Monate gültig'],
          ['Gebühr', 'Online per Karte; wird nicht erstattet, auch wenn das Visum abgelehnt wird'],
          ['Einreise', 'Nur über zugelassene Flug- und Seehäfen. Delhi, Mumbai und Nagpur gehören dazu'],
        ] },
        paragraphs: ['Ein e-Touristenvisum für 30 Tage deckt fast jede Safarireise ab. Wenn Sie innerhalb eines Jahres wiederkommen möchten, erspart Ihnen das 1-Jahres-Visum einen zweiten Antrag. Ihre Lodge muss Sie gesetzlich innerhalb von 24 Stunden nach Ankunft bei den Einwanderungsbehörden melden (Form C). Halten Sie beim Check-in also Reisepass und Visum bereit.'] },
      { id: 'gebuehren', kicker: 'Was Ausländer zahlen', heading: 'Safarigebühren für ausländische Besucher', lead: 'Die Gebühren gelten pro Gypsy (offener Geländewagen für bis zu sechs Gäste) und umfassen Eintritt, Parkführer und Fahrzeug. Die Werte für Tadoba hat das Reservat veröffentlicht; die Werte für Pench sind Richtwerte, weil Madhya Pradesh keinen Gesamtbetrag veröffentlicht.',
        table: { headers: ['Reservat und Safari', 'Indische Besucher', 'Ausländische Besucher'], rows: [
          ['Tadoba Kernzone, normale Fahrt', rupeeBand(coreFees[0].total, coreFees[3].total), 'Wie für indische Besucher'],
          ['Tadoba Pufferzone, normale Fahrt', rupeeBand(bufferFees[0].total, bufferFees[1].total), 'Wie für indische Besucher'],
          ['Tadoba Ganztagessafari', rupees(fullDayFees[0].total), rupees(fullDayFees[1].total)],
          ['Pench (MP) Kernzone', `ca. ${rupeeBand(penchGypsyTotals[0].weekday, penchGypsyTotals[0].weekend)}`, `ca. ${rupeeBand(penchGypsyTotals[1].weekday, penchGypsyTotals[1].weekend)}`],
          ['Pench (MP) Pufferzone', `ca. ${rupees(penchGypsyTotals[2].weekday)}`, `ca. ${rupees(penchGypsyTotals[3].weekday)}`],
          ['Pench, Seite Maharashtra', `ca. ${rupeeBand(penchGypsyTotals[4].weekday, penchGypsyTotals[4].weekend)}`, `ca. ${rupeeBand(penchGypsyTotals[5].weekday, penchGypsyTotals[5].weekend)}`],
        ] },
        paragraphs: ['Kanha, Bandhavgarh, Satpura und Panna werden über dasselbe Portal von Madhya Pradesh gebucht wie Pench und verlangen von ausländischen Besuchern ebenfalls mehr; wir nennen Ihnen die genauen Kosten für Ihre Daten. In einem Paket von Wild Excursions sind Genehmigung, Gypsy und Führer enthalten, Sie zahlen also nichts am Tor.', `Unsere Paketpreise für ausländische Gäste sind ${UPLIFT_LABEL} als der auf jeder Tour gezeigte Preis für indische Staatsbürger. Sie wählen Ihre Staatsangehörigkeit auf der Tourseite, und der Preis passt sich an. Alle Kosten in Euro finden Sie im <a href="/de/tigersafari-indien-kosten/">Kostenratgeber</a>.`] },
      { id: 'ausweis', kicker: 'Am Tor', heading: 'Regeln zum Reisepass auf Safari', bullets: [
        'Jeder Gast muss den Original-Ausweis zeigen, der bei der Buchung angegeben wurde. Kopien und Handyfotos werden abgelehnt.',
        'Ausländische Gäste müssen in Tadoba ihren Reisepass mitführen. Kein anderer Ausweis wird akzeptiert.',
        'Die Ausweisnummer auf der Genehmigung muss genau mit dem Dokument übereinstimmen, sonst gilt die Buchung als ungültig.',
        'In Pench sollten ausländische Gäste ihren Reisepass mitführen; der Ausweis muss zur Genehmigung passen.',
        'Kinder: In Tadoba fahren pro Gypsy bis zu zwei Kinder unter 8 Jahren kostenlos mit, in Pench (Madhya Pradesh) sind Kinder bis 5 Jahre vom Eintritt befreit.',
      ] },
      { id: 'anreise', kicker: 'Anreise', heading: 'Anreise aus dem Ausland', cards: [
        { title: 'Tadoba', label: 'Über Nagpur', href: '/how-to-reach-tadoba/international-travellers/', linkLabel: 'Anreise nach Tadoba (Englisch)', text: 'Flug nach Delhi oder Mumbai, dann 1,5 bis 2 Stunden nach Nagpur. Qatar Airways (Doha) und Air Arabia (Sharjah) fliegen direkt nach Nagpur. Die Fahrt zu den Toren dauert 2 bis 3,5 Stunden.' },
        { title: 'Pench', label: 'Über Nagpur', href: '/how-to-reach-pench/international-travellers/', linkLabel: 'Anreise nach Pench (Englisch)', text: 'Dieselben Flüge nach Nagpur, dann etwa 2 Stunden auf der Straße zum Turia-Tor auf der Seite von Madhya Pradesh, zu den Toren in Maharashtra kürzer.' },
        { title: 'Zwei Parks', label: 'Am beliebtesten', href: '/tours/tigers-of-central-india/', linkLabel: 'die 14-Tage-Reise (Englisch)', text: 'Tadoba und Pench teilen sich den Flughafen Nagpur und sind daher die einfachste Kombination. Unsere 14-tägige Reise „Tigers of Central India“ ergänzt Kanha und Bandhavgarh.' },
      ] },
      { id: 'zahlung', kicker: 'Zahlung aus dem Ausland', heading: 'Zahlung, Stornierung und Versicherung', paragraphs: ['Internationale Gäste zahlen per internationaler Banküberweisung: 50 % zur Bestätigung, den Rest 30 oder mehr Tage vor der Abreise. Erstattungen folgen einer gestaffelten Skala, die in unseren <a href="/terms/">Geschäftsbedingungen (Englisch)</a> steht; alternativ bieten wir eine kostenlose Umbuchung an.', 'Safarigenehmigungen erstattet das Reservat nur nach seinen eigenen Regeln, manche gar nicht. Schließen Sie bei der Anzahlung eine umfassende Reiseversicherung ab.'] },
      { id: 'praktisch', kicker: 'Vor Ort', heading: 'Praktische Tipps für internationale Gäste', cards: [
        { title: 'Geld', text: 'Karten funktionieren in den meisten Lodges, aber nehmen Sie etwas Rupien für Trinkgeld und Kleinigkeiten mit. Geldautomaten sind in der Nähe der Tore selten.' },
        { title: 'Telefon und Daten', text: 'In Waldnähe ist der Empfang lückenhaft. Eine indische SIM oder eSIM nach der Ankunft funktioniert am besten; laden Sie Offline-Karten herunter.' },
        { title: 'Gesundheit', text: 'Lassen Sie sich vor der Reise reisemedizinisch zu Impfungen und Malaria beraten, und nehmen Sie Sonnenschutz, Mückenschutz und Ihre Medikamente mit.' },
        { title: 'Zeitzone', text: 'In Indien gilt ganzjährig IST (UTC+5:30), ohne Sommerzeit. Nennen Sie uns bei der Anfrage Ihre Zeitzone, damit wir Sie zu einer passenden Uhrzeit anrufen.' },
      ] },
    ],
    faqHeading: 'Häufige Fragen ausländischer Gäste', faqIntro: 'Direkte Antworten auf die Fragen, die internationale Reisende uns am häufigsten stellen.',
    faqs: [
      { question: 'Dürfen Ausländer in Indien auf Tigersafari gehen?', answer: 'Ja. Ausländische Gäste können in jedem indischen Tigerreservat Safaris buchen. Sie brauchen ein gültiges indisches Visum, eine auf Ihren Reisepass gebuchte Safarigenehmigung und den Original-Reisepass am Tor.' },
      { question: 'Brauche ich für eine Tigersafari in Indien ein Visum?', answer: 'Die meisten Nationalitäten brauchen ein indisches Visum. Viele können online mindestens 4 Tage vor der Einreise ein e-Touristenvisum im offiziellen Portal indianvisaonline.gov.in beantragen. Es gibt es für 30 Tage, 1 Jahr und 5 Jahre, jeweils mit mehrfacher Einreise.' },
      { question: 'Zahlen Ausländer in Indien mehr für Safaris?', answer: `In manchen Reservaten ja. Tadoba verlangt von ausländischen Besuchern für normale Fahrten dasselbe wie von Indern, aber ${rupees(fullDayFees[1].total)} statt ${rupees(fullDayFees[0].total)} für eine Ganztagessafari. Pench und die anderen Reservate in Madhya Pradesh verlangen von ausländischen Besuchern bei jeder Fahrt eine höhere Gebühr.` },
      { question: 'Welchen Ausweis brauchen Ausländer auf Safari?', answer: 'Ihren Original-Reisepass. Tadoba akzeptiert von ausländischen Gästen keinen anderen Ausweis, lehnt Kopien und Handyfotos ab, und die Passnummer muss mit der Genehmigung übereinstimmen.' },
      { question: 'Kann ich indische Safarigenehmigungen aus dem Ausland buchen?', answer: 'Ja. Die Genehmigungen werden bis zu 120 Tage im Voraus in den offiziellen Portalen freigegeben, und wir buchen sie für Sie mit Ihren Passdaten.' },
      { question: 'Wie bezahle ich eine Safari in Indien aus dem Ausland?', answer: 'Per internationaler Banküberweisung: 50 % zur Bestätigung und den Rest 30 oder mehr Tage vor der Abreise. Wir nennen Ihnen die Preise für ausländische Gäste, auf Wunsch auch in Euro.' },
      { question: 'Welchen Flughafen nutzen Ausländer für eine Tigersafari?', answer: 'Meist Delhi oder Mumbai, dann ein Inlandsflug nach Nagpur für Tadoba und Pench oder nach Jabalpur für Kanha und Bandhavgarh. Qatar Airways und Air Arabia fliegen außerdem direkt von Doha und Sharjah nach Nagpur.' },
    ],
    published: '2026-10-21',
    sources: [
      { label: 'e-Visa-Portal der indischen Regierung: Regeln zum e-Touristenvisum', url: 'https://indianvisaonline.gov.in/evisa/tvoa.html', checked: 'Oktober 2026' },
      { label: officialSource.name, url: officialSource.url, checked: 'Oktober 2026' },
      { label: 'Pench Tiger Reserve FAQ (MPOnline)', url: penchSources.mpFaq, checked: 'Oktober 2026' },
      { label: 'Nationales Portal Indiens: Online Form C (Meldung ausländischer Gäste)', url: 'https://www.india.gov.in/online-form-c-bureau-immigration', checked: 'Oktober 2026' },
    ],
  },
  {
    lang: 'de',
    slug: 'tigersafari-indien-kosten', path: '/de/tigersafari-indien-kosten/',
    title: 'Tigersafari Indien Kosten 2026/27: Alle Preise im Überblick',
    description: 'Was eine Tigersafari in Indien wirklich kostet: Paketpreise, Genehmigungen, Jeep, Lodge und Transfers Posten für Posten, dazu Preise in Euro, Pfund und Dollar.',
    h1: 'Tigersafari in Indien: Was sie wirklich kostet', breadcrumb: 'Kosten einer Tigersafari', eyebrow: 'Preisratgeber · Saison 2026/27', hero: 'comparison',
    heroAlt: 'Safarijeep auf einer Waldpiste in einem indischen Tigerreservat', commercial: true, schemaType: 'Article', authors: authorsCost,
    bylineNote: 'Zahlen aus den aktuellen Paketpreisen von Wild Excursions und den Genehmigungskosten in Zentralindien.',
    intro: `Eine Tigersafari in Indien kostet für ausländische Gäste etwa ${SP_EUR} € pro Person für 2 bis 5 Tage in einem Park, im Doppelzimmer und ohne Flüge. Eine 10- bis 14-tägige Reise durch zwei oder drei Parks liegt je nach Lodge bei etwa ${MULTI_EUR} € pro Person. Dieser Ratgeber zerlegt die Kosten in ihre Bestandteile: Genehmigung, Jeep, Führer, Lodge, Mahlzeiten, Transfers und Steuer.`,
    ctaLabel: 'Angebot anfordern', ctaHref: '/customize-trip/',
    closingHeading: 'Ein echter Preis für Ihre Reisedaten',
    closingText: 'Nennen Sie uns Reisemonat, Personenzahl, gewünschte Reservate und Lodge-Kategorie. Sie erhalten ein aufgeschlüsseltes Angebot, in dem Genehmigung, Jeep, Führer, Unterkunft, Mahlzeiten, Transfers und Steuer einzeln stehen.',
    sections: [
      { id: 'spanne', kicker: 'Die Preisspanne', heading: 'Was eine Tigersafari in Indien kostet', lead: `Die Pakete von Wild Excursions für einen Park kosten derzeit etwa ${rupeeBand(10700, 47600)} pro Person zum Preis für indische Staatsbürger. Für ausländische Gäste sind sie ${UPLIFT_LABEL}, das sind etwa ${SP_EUR} € pro Person für 2 bis 5 Tage, im Doppelzimmer und ohne Flüge. Längere private Reisen durch mehrere Parks werden individuell kalkuliert.`,
        paragraphs: ['Die Spanne hat echte Gründe: Ein Einstieg mit 2 Tagen und 2 Pirschfahrten in einer Lodge an der Pufferzone liegt am unteren Ende, 5 Tage mit 8 Fahrten und Premium-Unterkünften am oberen. Auch die Saison zählt: In der Hochsaison und an Feiertagswochenenden sind Genehmigungen und Lodges teurer.', `Eine Reise von 10 bis 14 Tagen durch zwei oder drei Reservate (Maßstab ist unsere 14-tägige Reise <a href="/tours/tigers-of-central-india/">Tigers of Central India</a>) kostet je nach Lodge-Kategorie typischerweise <strong>etwa ${MULTI_EUR} € pro Person ohne Flüge</strong>. Solche Reisen kalkulieren wir individuell.`] },
      { id: 'posten', kicker: 'Wohin das Geld geht', heading: 'Wofür Sie tatsächlich bezahlen', lead: 'Jedes ehrliche Safari-Angebot ist die Summe dieser Posten. Lassen Sie sie sich von jedem Anbieter einzeln aufführen.',
        table: { headers: ['Posten', 'Was er abdeckt', 'Ungefähr'], rows: [
          ['Waldgenehmigung', 'Staatliche Eintrittsgenehmigung für eine Zone und eine Fahrt, pro Person', '1.000–2.500 ₹ pro Fahrt'],
          ['Gypsy (Jeep)', 'Der offene Geländewagen mit Fahrer, geteilt mit bis zu 6 Gästen oder privat', '2.500–5.500 ₹ pro Fahrt'],
          ['Parkführer', 'Der vom Forstamt am Tor zugeteilte Naturführer', '400–600 ₹ pro Fahrt'],
          ['Naturalist', 'Ihr eigener Naturalist der Lodge oder des Veranstalters für die ganze Reise', 'Im Paket enthalten'],
          ['Lodge', 'Zimmer im Doppelzimmer, der größte Unterschied zwischen Comfort, Premium und Luxus', '5.000–40.000+ ₹ pro Nacht'],
          ['Mahlzeiten', 'In einer Waldlodge meist Vollpension', 'Im Paket enthalten'],
          ['Transfers', 'Abholung am Flughafen oder Bahnhof und Fahrten zwischen Parks, privates Fahrzeug', '3.000–12.000 ₹ pro Strecke'],
          ['GST', 'Indische Steuer, auf Reisepakete in der Regel 5 %', 'In unseren Preisen enthalten'],
        ] },
        paragraphs: ['Der private Jeep ist das häufigste Upgrade: Statt eines geteilten Fahrzeugs fahren nur Sie und Ihre Mitreisenden, Sie bestimmen das Tempo, und der Naturalist ist ganz für Sie da. Mehr Zeit oder andere Wege bringt er nicht, denn die Zeiten und Pisten des Forstamts gelten weiterhin.'] },
      { id: 'dauer', kicker: 'Kosten nach Reisedauer', heading: 'Wie der Preis mit Tagen und Fahrten steigt', lead: `Pakete für einen Park zum Preis für indische Staatsbürger, pro Person, im Doppelzimmer, ohne Flüge. Für ausländische Gäste sind sie ${UPLIFT_LABEL}. Die Preise hängen von Reservat, Saison und Lodge ab; es sind aktuelle Richtwerte.`,
        table: { headers: ['Reise', 'Fahrten', 'Comfort', 'Premium'], rows: [
          ['2 Tage / 1 Nacht', '2', rupeeBand(10700, 12900), rupeeBand(15900, 19900)],
          ['3 Tage / 2 Nächte', '4', rupeeBand(20300, 24800), rupeeBand(29800, 39800)],
          ['4 Tage / 3 Nächte', '6', rupeeBand(29200, 35700), rupeeBand(44700, 60700)],
          ['5 Tage / 4 Nächte', '8', rupeeBand(38600, 47600), rupeeBand(61600, 93600)],
          ['10–14 Tage, 2–3 Parks', '5–10', `ca. ${quotedBand(2600 * INR_PER.CAD, 3800 * INR_PER.CAD, 'EUR')} €`, `ca. ${quotedBand(3600 * INR_PER.CAD, 5200 * INR_PER.CAD, 'EUR')} €`],
        ] },
        paragraphs: ['Mehr Fahrten erhöhen die Kosten für Genehmigung und Jeep linear, mehr Nächte die für Lodge und Mahlzeiten.'] },
      { id: 'waehrung', kicker: 'In Ihrer Währung', heading: 'Kosten einer Tigersafari in Euro, Pfund und Dollar', lead: `Preise für ausländische Gäste für die Pakete oben (${UPLIFT_LABEL} als die Rupien-Werte), umgerechnet zu den unten genannten Kursen. Wechselkurse schwanken; prüfen Sie vor der Planung einen aktuellen Kurs und verstehen Sie diese Werte nur als Richtwerte.`,
        table: { headers: ['Reise', 'EUR', 'GBP', 'USD'], rows: [
          fxRow('2 Tage / 1 Nacht (Comfort)', 10700, 12900),
          fxRow('3 Tage / 2 Nächte (Comfort)', 20300, 24800),
          fxRow('5 Tage / 4 Nächte (Comfort)', 38600, 47600),
          fxRow('5 Tage / 4 Nächte (Premium)', 61600, 93600),
          fxRow('14 Tage, 3 Parks (Premium)', 3800 * INR_PER.CAD, 5200 * INR_PER.CAD, quotedBand),
        ] },
        paragraphs: [`Umgerechnet zu Mittelkursen vom Oktober 2026: etwa 1 € ≈ ${INR_PER.EUR} ₹, 1 £ ≈ ${INR_PER.GBP} ₹, 1 US$ ≈ ${INR_PER.USD} ₹. Internationale Flüge sind in diesen Werten nie enthalten.`, 'Auf Wunsch nennen wir Ihnen Preise in Euro. Gezahlt wird per internationaler Banküberweisung: 50 % Anzahlung zur Bestätigung, der Rest 30 oder mehr Tage vor der Abreise. Visum, Reisepass und Genehmigungen erklärt unser <a href="/de/tigersafari-indien-fuer-auslaender/">Ratgeber für ausländische Gäste</a>.'] },
      { id: 'hebel', kicker: 'Was den Preis bewegt', heading: 'Was eine Tigersafari günstiger oder teurer macht', cards: [
        { title: 'Lodge-Kategorie', label: 'Größter Hebel', text: 'Comfort statt Premium oder Luxus kann die Kosten vor Ort mehr als verdoppeln. Die Safari selbst ändert sich dabei weit weniger als das Zimmer.' },
        { title: 'Saison', label: 'Zeitpunkt', text: 'Hochsaison (März bis Juni) und Feiertagswochenenden bringen höhere Preise für Genehmigungen und Lodges. Zwischensaison ist günstiger und kann hervorragend sein.' },
        { title: 'Privat oder geteilt', label: 'Fahrzeug', text: 'Ein privater Jeep erhöht den Preis pro Person, Teilen senkt ihn. Die meisten internationalen Gäste wählen privat.' },
        { title: 'Zahl der Fahrten', label: 'Tiefe', text: 'Vier bis sechs Fahrten sind das ehrliche Minimum, um ein Reservat zu erleben. Mehr Fahrten kosten mehr, erhöhen aber die Chancen.' },
        { title: 'Gruppengröße', label: 'Fixkosten teilen', text: 'Ein Jeep oder Transfer kostet für 2 oder 6 Personen gleich viel. Vier Reisende zahlen pro Kopf spürbar weniger als ein Paar.' },
        { title: 'Effiziente Route', label: 'Transfers', text: 'Ein günstiges Zimmer eine Stunde vom falschen Tor entfernt kostet Fahrzeit und Transfergeld. Lodges am passenden Tor sind das bessere Angebot.' },
      ] },
      { id: 'afrika', kicker: 'Der beliebte Vergleich', heading: 'Indien oder Afrika: der Kostenvergleich', paragraphs: ['Eine vergleichbare Luxussafari mit mehreren Nächten kostet in Indien meist nur einen Bruchteil einer Reise nach Ost- oder Südafrika. Auch im mittleren Preissegment ist Indien deutlich günstiger.', 'Die Erlebnisse sind nicht gleich: Indien heißt Wald und feste Pisten mit dem Tiger als Hauptdarsteller, Afrika offene Ebenen mit mehr Großkatzen und Steppentieren. Vergleichen Sie also zuerst, was Sie sehen möchten, dann den Preis.'] },
      { id: 'zahlung', kicker: 'Vor der Zahlung', heading: 'Anzahlung, Zahlung und Stornierung', paragraphs: ['Buchungen werden mit 50 % Anzahlung bestätigt; der Rest ist 30 oder mehr Tage vor der Abreise fällig. Erstattungen folgen einer gestaffelten Skala, von 100 % bei 120 oder mehr Tagen vor Abreise bis 0 % innerhalb von 30 Tagen; alternativ bieten wir eine kostenlose Umbuchung an. Die vollständigen Bedingungen stehen in unseren <a href="/terms/">Geschäftsbedingungen (Englisch)</a>.', 'Einmal ausgestellte Waldgenehmigungen sind oft nicht erstattungsfähig, unabhängig von den Bedingungen des Veranstalters. Eine umfassende Reiseversicherung, abgeschlossen bei der Anzahlung, ist sehr zu empfehlen.'] },
    ],
    faqHeading: 'Häufige Fragen zu den Kosten', faqIntro: 'Direkte Antworten darauf, was eine Tigersafari in Indien kostet und warum.',
    faqs: [
      { question: 'Was kostet eine Tigersafari in Indien?', answer: `Pakete von Wild Excursions für einen Park kosten etwa ${rupeeBand(10700, 47600)} pro Person zum Preis für indische Staatsbürger für 2 bis 5 Tage. Für ausländische Gäste (${UPLIFT_LABEL}) sind das etwa ${SP_EUR} € pro Person, im Doppelzimmer und ohne Flüge. Eine private Reise von 10 bis 14 Tagen durch mehrere Parks kostet je nach Lodge etwa ${MULTI_EUR} € pro Person ohne Flüge.` },
      { question: 'Was kostet eine Tigersafari in Indien in Euro?', answer: `Als Richtwert zu den Preisen für ausländische Gäste etwa ${SP_EUR} € für 2 bis 5 Tage in einem Park mit Comfort-Lodges und etwa ${MULTI_EUR} € pro Person für 10 bis 14 Tage durch mehrere Parks, jeweils ohne internationale Flüge.` },
      { question: 'Sind die Safarigenehmigungen im Preis enthalten?', answer: 'In einem Paket von Wild Excursions sind Waldgenehmigung, Gypsy, Fahrer, Parkführer, Lodge, Mahlzeiten, Transfers und GST enthalten. Wenn ein anderer Anbieter einen niedrigen Preis nennt, fragen Sie gezielt, ob Genehmigung und Jeep enthalten sind oder am Tor bezahlt werden.' },
      { question: 'Wie mache ich eine Tigersafari in Indien am günstigsten?', answer: `Mit 2 bis 3 Tagen in einem Reservat, geteiltem Jeep, einer Comfort-Lodge an der Pufferzone, Wochentagen in der Zwischensaison und vier Reisenden, die die Fixkosten teilen. Rechnen Sie mit etwa ${rupeeBand(10700, 24800)} pro Person zum Preis für indische Staatsbürger (für ausländische Gäste ${UPLIFT_LABEL}).` },
      { question: 'Ist eine Tigersafari in Indien günstiger als eine Safari in Afrika?', answer: 'In der Regel ja, oft deutlich, sowohl im mittleren als auch im Luxussegment. Die Erlebnisse unterscheiden sich, vergleichen Sie also zuerst, was Sie sehen möchten.' },
      { question: 'Warum gibt es keinen Festpreis für eine zweiwöchige Reise?', answer: 'Weil Lodge-Kategorie, Saison, Gruppengröße und die verfügbaren Genehmigungen den Preis stark verändern. Sobald diese feststehen, erhalten Sie ein verbindliches, aufgeschlüsseltes schriftliches Angebot.' },
    ],
    published: '2026-10-21',
  },
  {
    lang: 'de',
    slug: 'tigersafari-indien', path: '/de/tigersafari-indien/',
    title: 'Tigersafari in Indien: Der komplette Reiseplaner 2026/27',
    description: 'Tigersafari in Indien planen: die besten Reservate, die beste Reisezeit, Genehmigungen, Kern- und Pufferzonen, Kosten und Tipps von einem Veranstalter vor Ort.',
    h1: 'Tigersafari in Indien: Der komplette Reiseplaner', breadcrumb: 'Tigersafari-Ratgeber', eyebrow: 'Ratgeber · Saison 2026/27', hero: 'guide',
    heroAlt: 'Bengalischer Tiger in einem indischen Wald', commercial: false, schemaType: 'Article',
    authors: [{ prefix: 'Written by', name: 'Hardik Patel', role: 'Founder' }, { prefix: 'Written by', name: 'Abhay Gupta', role: 'Marketing/Content' }],
    bylineNote: 'Aus der Safariplanung in 24 indischen Reservaten seit 2022.',
    intro: 'Eine Tigersafari ist kein Zoobesuch mit größerem Gehege, sondern eine Reise in einen lebendigen Wald, bei der Genehmigung und Tor alles bestimmen. Dieser Ratgeber erklärt, wie Sie ein Reservat wählen, die Reise zeitlich planen, die Zonen verstehen und jeder Pirschfahrt die beste ehrliche Chance geben.',
    ctaLabel: 'Mit einem Tigerspezialisten sprechen', ctaHref: '/tiger-safari-tour-operator-india/',
    closingHeading: 'Aus der Recherche eine machbare Safari machen',
    closingText: 'Nennen Sie uns Ihre Reisedaten, Ihren Startort und Ihre Wünsche. Wir machen daraus realistische Vorschläge für Park, Genehmigung, Tor, Unterkunft und Transfer, ohne zu versprechen, was die Natur nicht garantieren kann.',
    sections: [
      { id: 'reservate', kicker: 'Zuerst die Landschaft wählen', heading: 'Die besten Tigerreservate Indiens', lead: 'Das eine „beste“ Reservat gibt es nicht. Die richtige Wahl hängt von Reisedaten, Route, Lieblingslandschaft, Toleranz gegenüber Andrang und der Zahl der Fahrten ab, die Sie dem Wald geben können.', cards: tigerReserveCards,
        paragraphs: ['Zur größeren Tigerlandschaft gehören auch <a href="/tours/jim-corbett/">Jim Corbett</a>, die Mangrovenkanäle der <a href="/tours/sunderban/">Sundarbans</a> und die Mischwälder von <a href="/tours/bandipur/">Bandipur</a>. Sie ersetzen einander nicht; jedes Gebiet bietet andere Begegnungen und braucht eine andere Logistik.'] },
      { id: 'reisezeit', kicker: 'Jahreszeit für Jahreszeit', heading: 'Die beste Reisezeit für eine Tigersafari', lead: 'Oktober bis Februar bringt kühlere Fahrten und weicheres Licht. März bis Juni ist heißer, aber schwindende Wasserstellen und lichteres Laub können die Sicht verbessern. Viele Kernzonen schließen während des Monsuns; der Zugang zu Pufferzonen ist je nach Bundesstaat und Reservat unterschiedlich.',
        paragraphs: ['Der Winter ist für Familien und Erstbesucher die angenehmste Wahl. Nehmen Sie für die erste Stunde einer Morgenfahrt warme Schichten mit: Im offenen Gypsy fühlt es sich viel kälter an, als die Vorhersage vermuten lässt. Der Sommer verlangt mehr, doch frühe Starts und Geduld an Wasserstellen werden oft belohnt.', 'Öffnungstermine, wöchentliche Ruhetage und der Betrieb der Pufferzonen können sich ändern. Betrachten Sie jeden Online-Kalender als Planungshilfe, bis das Forstamt die Genehmigung bestätigt.'] },
      { id: 'kosten', kicker: 'Ehrlich budgetieren', heading: 'Kosten einer Tigersafari in Indien', lead: `Die Pakete von Wild Excursions kosten derzeit ${rupeeBand(9390, 24590)} pro Person, je nach Reservat, Dauer und Saison. Das ist eine Spanne, kein Versprechen, dass jeder Termin in jedem Park gleich viel kostet.`,
        paragraphs: ['Genehmigungs- und Fahrzeugkosten unterscheiden sich je nach Bundesstaat. Das bestätigte Tor bestimmt, welche Lodges sinnvoll sind, die Lodge-Kategorie verändert Zimmer und Verpflegung, und ein privates Fahrzeug kostet anders als ein geteiltes. Auch Transfers zählen: Ein günstiges Zimmer kann teuer werden, wenn es vor Sonnenaufgang stundenlange Fahrten bedeutet.', 'Lassen Sie sich die Leistungen Posten für Posten nennen (Genehmigung, Gypsy, Führer, Unterkunft, Mahlzeiten, Transfers und Steuern), bevor Sie Gesamtpreise vergleichen. Alle Zahlen, auch in Euro, stehen im <a href="/de/tigersafari-indien-kosten/">Kostenratgeber</a>.'] },
      { id: 'zonen', kicker: 'Eine häufige Planungsfrage', heading: 'Kernzone oder Pufferzone', cards: [
        { title: 'Kernzone', label: 'Geschützter Lebensraum', text: 'Genehmigungen für die Kernzone sind begrenzt, oft früher ausgebucht und können mehr kosten. Sie führen auf festgelegten Routen durch streng geschützten Lebensraum, garantieren aber nie einen Tiger.' },
        { title: 'Pufferzone', label: 'Genutzter Waldrand', text: 'Pufferzonen sind oft flexibler und weniger befahren. Offene Ränder und vielfältige Pisten bieten manchmal besseres Fotolicht, und die Tiere wandern je nach Revier und Saison.' },
        { title: 'Die praktische Wahl', label: 'Erst das Tor, dann das Hotel', text: 'Legen Sie Tor und Zone fest, bevor Sie die Unterkunft buchen. Eine berühmte Lodge auf der falschen Seite eines Reservats macht jede Safari zu einem anstrengenden Transfer.' },
      ], paragraphs: ['Tigerreviere halten sich nicht an Verwaltungsgrenzen. Eine aktive Pufferzone kann in einer bestimmten Woche mehr bieten als eine ruhige Kernzone. Deshalb zählen aktuelle Bewegungen, Torzugang und Routenplanung mehr als Etiketten.'] },
      { id: 'genehmigungen', kicker: 'Was hinter der Buchung passiert', heading: 'So funktionieren Safarigenehmigungen', lead: 'Die Forstämter vergeben eine begrenzte Zahl an Genehmigungen über eigene Systeme der Bundesstaaten. Jede Buchung gilt für ein Datum, eine Fahrt, ein Reservat und meist ein Tor oder eine Zone; Namen und passende Ausweisdaten sind in der Regel Pflicht.',
        steps: [
          { title: 'Realistische Daten und Parks wählen', text: 'Beginnen Sie mit Reisedaten, Gruppengröße und Route. Ein guter Plan hält Alternativen bereit, statt auf eine ausgebuchte Zone zu bestehen.' },
          { title: 'Verfügbarkeit von Tor und Zone prüfen', text: 'Der Veranstalter gleicht verfügbare Genehmigungen mit der Geografie des Reservats und der Route ab, bevor er eine Unterkunft empfiehlt.' },
          { title: 'Genaue Gästedaten angeben', text: 'Namen und Ausweisdaten müssen übereinstimmen. Kurzfristige Namensänderungen können vom Forstamt eingeschränkt sein.' },
          { title: 'Den Original-Ausweis mitnehmen', text: 'Am Tor kann dasselbe Dokument geprüft werden, das bei der Buchung angegeben wurde. Die Meldezeiten sind fest, und wer zu spät kommt, kann die Fahrt verlieren.' },
        ], paragraphs: ['Wild Excursions übernimmt die ganze Kette, von der Genehmigung über die passende Unterkunft bis zu den Transfers, damit Sie nicht mehrere Portale und Anbieter koordinieren müssen. Wir sind keine staatliche Genehmigungsbehörde; der Zugang unterliegt letztlich den Regeln des Forstamts. Ausländische Gäste finden Visum und Passregeln im <a href="/de/tigersafari-indien-fuer-auslaender/">Ratgeber für ausländische Gäste</a>.'] },
      { id: 'zeiten', kicker: 'Den ganzen Tag planen', heading: 'Safarizeiten und Zahl der Fahrten', lead: 'Parks in Maharashtra und anderen Bundesstaaten außer Madhya Pradesh öffnen meist von 6:00 bis 10:00 Uhr und von 14:00 bis 18:00 Uhr. Parks in Madhya Pradesh öffnen meist von 6:00 bis 11:30 Uhr und von 15:00 bis 18:30 Uhr. Saisonale Anordnungen können die Meldezeiten verschieben.',
        paragraphs: ['Zwei Fahrten am Tag sind der übliche intensive Rhythmus; die Mittagspause dient Essen, Ruhe, Akkuladen und dem Austausch mit dem Naturalisten. Um wechselnde Bedingungen realistisch zu erleben, empfehlen wir vier bis sechs Fahrten insgesamt, statt eine einzelne Safari als Urteil über das Reservat zu nehmen.', 'Bei den protokollierten Fahrten im letzten Winter haben etwa 98,7 % unserer Gäste einen Tiger gesehen. Dieser Wert gilt pro Reise und beruht auf mehreren Fahrten und erfahrenen lokalen Teams; er ist keine Wahrscheinlichkeit für eine einzelne Fahrt und keine dauerhafte Garantie. Kein seriöser Veranstalter in Indien kann eine Sichtung garantieren.'] },
      { id: 'praktisch', kicker: 'Kleine Entscheidungen, bessere Fahrten', heading: 'Was Sie mitnehmen, wo Sie wohnen und wie Sie anreisen', bullets: [
        '<strong>Ausweis:</strong> Nehmen Sie den Original-Ausweis mit, der für die Genehmigung angegeben wurde; für ausländische Gäste ist das der Reisepass.',
        '<strong>Kleidung:</strong> gedeckte Farben in Schichten, im Winter eine leichte Jacke, Sonnenschutz und feste Schuhe.',
        '<strong>Optik:</strong> Ein Fernglas verwandelt ruhige Fahrten; Fotografen sollten Ersatzakkus, Speicherkarten, Staubschutz und einen Bohnensack mitnehmen.',
        '<strong>Unterkunft:</strong> Die Nähe zum Tor ist wichtiger als ein bekannter Name. Zu unserem Netzwerk gehören Baghvan, Camp Serai, Bagh Kothi, Tiger Trails und weitere Unterkünfte passend zum Reservat.',
        '<strong>Anreise:</strong> Planen Sie mit dem nächstgelegenen Flughafen oder Bahnhof und lassen Sie genug Zeit für den Straßentransfer vor der ersten Fahrt.',
      ], paragraphs: ['Eine gut geplante Safari fühlt sich ruhig an, auch wenn die Logistik komplex ist. Park, Tor, Lodge, Transfer und Fahrplan müssen als eine Route funktionieren.'] },
    ],
    faqHeading: 'Häufige Fragen zur Tigersafari', faqIntro: 'Direkte Antworten auf die Fragen vor einer ersten Tigersafari in Indien.',
    faqs: [
      { question: 'Wann ist die beste Reisezeit für eine Tigersafari in Indien?', answer: 'Oktober bis Februar ist kühler und angenehm; März bis Juni ist heißer, kann aber die Sicht an Wasserstellen verbessern. Öffnungs- und Schließzeiten der Parks unterscheiden sich, prüfen Sie das gewählte Reservat also vor der Reisebuchung.' },
      { question: 'Was ist der Unterschied zwischen Kernzone und Pufferzone?', answer: 'Kernzonen umfassen streng geschützten Lebensraum und sind oft früher ausgebucht. Pufferzonen liegen um die Kernzone, sind oft weniger voll und können ebenfalls aktive Tigerreviere enthalten. Keine der beiden Zonen garantiert eine Sichtung.' },
      { question: 'Was kostet eine Tigersafari?', answer: `Die Pakete von Wild Excursions kosten ${rupeeBand(9390, 24590)} pro Person, je nach Reservat, Saison, Dauer, Lodge-Kategorie, Fahrzeug und Transferroute. Preise in Euro stehen im Kostenratgeber.` },
      { question: 'Wie viele Safaris sollte ich buchen, um einen Tiger zu sehen?', answer: 'Wir empfehlen meist vier bis sechs Fahrten. Mehr Fahrten gleichen Wetter, Tierbewegungen und wechselnde Bedingungen aus, auch wenn kein seriöser Veranstalter eine Sichtung garantieren kann.' },
      { question: 'Muss ich die Genehmigung selbst besorgen?', answer: 'Nein. Wild Excursions kümmert sich im Rahmen der Reise um die Genehmigung, zusammen mit passendem Tor, Unterkunft, Fahrzeug und Transfers.' },
      { question: 'Welches Tigerreservat eignet sich für die erste Safari?', answer: 'Tadoba, Pench, Kanha und Bandhavgarh sind häufige erste Wahl. Was am besten passt, hängt von Reisedaten, Startort, gewünschter Landschaft und verfügbaren Genehmigungen ab.' },
    ],
  },
];
