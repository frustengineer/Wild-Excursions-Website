/**
 * Builds the /resorts/ directory data from the WE planner database (we-trivago backend).
 *
 *   node scripts/import-resort-directory.mjs --db "C:/path/to/we-trivago/backend/data/wild-excursions.sqlite"
 *
 * Writes src/data/resortDirectory.json and copies up to --max-photos resized photos per resort
 * into src/assets/resorts/<id>/. Opens the database read-only.
 *
 * Only fields that come from a real source are exported:
 *   - name, park/zone and room-category names: "Wild Excursions — Resort & Room Category Reference" (Oct 2026)
 *   - address, coordinates, rating, review count, Maps link: Google Places, as fetched by the planner backend
 *   - photos: the resort photos imported from the WE Google Drive
 * The planner's tier, prices, amenities, room specs and generated descriptions are placeholders
 * for the booking demo and are deliberately NOT exported.
 */
import { createRequire } from 'node:module';
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import sharp from 'sharp';

const args = Object.fromEntries(
  process.argv.slice(2).reduce((pairs, arg, i, all) => (arg.startsWith('--') ? [...pairs, [arg.slice(2), all[i + 1]]] : pairs), []),
);
if (!args.db) {
  console.error('Usage: node scripts/import-resort-directory.mjs --db <wild-excursions.sqlite> [--media <media dir>] [--max-photos 12]');
  process.exit(1);
}

const dbPath = resolve(args.db);
const backendDir = resolve(dirname(dbPath), '..');
const mediaDir = resolve(args.media ?? join(backendDir, 'media'));
const maxPhotos = Number(args['max-photos'] ?? 12);
const root = resolve(import.meta.dirname, '..');
const assetsDir = join(root, 'src/assets/resorts');
const outFile = join(root, 'src/data/resortDirectory.json');

// better-sqlite3 lives in the planner backend, not in this site's dependencies
const Database = createRequire(join(backendDir, 'package.json'))('better-sqlite3');
const db = new Database(dbPath, { readonly: true, fileMustExist: true });

/** planner range name -> site park slug + zone label from the reference document */
const RANGES = {
  Kolara: { park: 'tadoba', zone: 'Kolara' },
  Moharli: { park: 'tadoba', zone: 'Moharli' },
  Navegaon: { park: 'tadoba', zone: 'Navegaon' },
  'Pangadi & Zari': { park: 'tadoba', zone: 'Pangdi & Zari' },
  Pench: { park: 'pench', zone: null },
  Bandhavgarh: { park: 'bandhavgarh', zone: null },
  'Khatia Gate': { park: 'kanha', zone: 'Khatia' },
  'Mukki Gate': { park: 'kanha', zone: 'Mukki' },
  'Madhai Gate': { park: 'satpura', zone: 'Madhai' },
  'Churna Gate': { park: 'satpura', zone: 'Churna' },
  Panna: { park: 'panna', zone: null },
  Tipeshwar: { park: 'tipeshwar', zone: null },
  'Umred - Karhandla': { park: 'umred-karhandla', zone: null },
};

// uploaded photos carry a millisecond-timestamp prefix; anything else is a stock placeholder
const isUploadedPhoto = (src) => /^\/media\/\d{10,}-/.test(src);

const resorts = db.prepare('SELECT id, range_name, name, details_json FROM resorts ORDER BY range_name, name').all();
const roomStmt = db.prepare('SELECT name FROM room_types WHERE resort_id = ? ORDER BY price_per_night, name');
const out = [];

mkdirSync(assetsDir, { recursive: true });

for (const row of resorts) {
  const range = RANGES[row.range_name];
  if (!range) {
    console.warn(`skip ${row.id}: unknown range "${row.range_name}"`);
    continue;
  }
  const d = JSON.parse(row.details_json);
  const photos = [...new Set((d.gallery ?? []).filter(isUploadedPhoto))];

  const dir = join(assetsDir, row.id);
  rmSync(dir, { recursive: true, force: true });
  let saved = 0;
  for (const src of photos) {
    if (saved >= maxPhotos) break;
    const file = join(mediaDir, src.replace('/media/', ''));
    if (!existsSync(file)) {
      console.warn(`missing photo for ${row.id}: ${file}`);
      continue;
    }
    // some Drive imports came through as solid black frames
    const { channels } = await sharp(file).stats();
    if (channels.slice(0, 3).every((c) => c.mean < 8)) {
      console.warn(`skip blank photo for ${row.id}: ${src}`);
      continue;
    }
    mkdirSync(dir, { recursive: true });
    saved += 1;
    await sharp(file)
      .rotate()
      .resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 78 })
      .toFile(join(dir, `${String(saved).padStart(2, '0')}.webp`));
  }

  out.push({
    id: row.id,
    name: row.name,
    park: range.park,
    zone: range.zone,
    address: d.googleAddress ?? null,
    lat: d.googleLat ?? null,
    lng: d.googleLng ?? null,
    googleRating: d.googleRating ?? null,
    googleReviewCount: d.googleReviewCount ?? null,
    googleMapsUrl: d.googleMapsUrl ?? null,
    ratingCheckedAt: d.googleReviewsFetchedAt ? d.googleReviewsFetchedAt.slice(0, 10) : null,
    rooms: roomStmt.all(row.id).map((r) => r.name),
    photos: saved,
  });
  console.log(`${row.id}: ${saved} photo(s)`);
}

writeFileSync(outFile, JSON.stringify(out, null, 2) + '\n');
console.log(`\nWrote ${out.length} resorts to ${outFile}`);
