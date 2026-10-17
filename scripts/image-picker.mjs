// Local stock-image picker: `npm run images` → http://localhost:4400
// Searches Pixabay (needs PIXABAY_KEY in .env) and Wikimedia Commons (no key),
// saves the chosen photo as WebP to src/assets/stock/ and its credit to src/data/stockCredits.json.
// Runs only on your machine, so the API key never reaches the public site.
import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

try { process.loadEnvFile(); } catch {}
const PORT = 4400;
const OUT_DIR = path.resolve('src/assets/stock');
const CREDITS = path.resolve('src/data/stockCredits.json');
const UA = { 'User-Agent': 'WildExcursionsImagePicker/1.0 (local site-admin tool)' };
const FREE_LICENCE = /^(CC0|CC BY(-SA)? [\d.]+|Public domain|PD)/i;
const strip = (s = '') => s.replace(/<[^>]*>/g, '').trim();

// Only real wild photos taken in India: no AI images, no zoo/captive shots, India must be named.
const INDIA = /\bindia\b|tadoba|pench|kanha|bandhavgarh|ranthambh?ore|corbett|kaziranga|\bgir\b|nagarhole|kabini|bandipur|satpura|sundarbans?|panna|periyar|keoladeo|bharatpur|dudhwa|manas|melghat|umred|nagzira|mudumalai|maharashtra|madhya pradesh|karnataka|rajasthan|uttarakhand|assam|kerala|tamil nadu|gujarat|west bengal|odisha|chhattisgarh/i;
const NOT_WILD = /\bzoo|zoological|captiv|\bcage|enclosure|circus|\bpet\b|nandankanan|vandalur|alipore|ai[- ]generated|midjourney|dall-?e|stable diffusion|illustration|render|museum|taxiderm|specimen|stuffed|africa|kenya|tanzania|serengeti|masai|botswana|zambia|namibia|siberia|amur|sumatra|malaysia|thailand|nepal|sri lanka|bangladesh/i;
const inIndiaBox = (lat, lon) => lat > 6.5 && lat < 35.7 && lon > 68 && lon < 97.5;

const cache = new Map(); // Pixabay requires API responses to be cached for 24h
async function getJson(url, headers) {
  const hit = cache.get(url);
  if (hit && Date.now() - hit.t < 864e5) return hit.data;
  const data = await (await fetch(url, { headers })).json();
  cache.set(url, { t: Date.now(), data });
  return data;
}

async function pixabay(q) {
  if (!process.env.PIXABAY_KEY) throw new Error('Add PIXABAY_KEY=... to .env (free key at pixabay.com/api/docs)');
  const base = `https://pixabay.com/api/?key=${process.env.PIXABAY_KEY}&q=${encodeURIComponent(q + ' india')}&image_type=photo&safesearch=true&per_page=200&min_width=1200`;
  const pages = await Promise.all([1, 2, 3].map(p => getJson(`${base}&page=${p}`).catch(() => ({}))));
  const hits = pages.flatMap(p => p.hits ?? [])
    .filter(h => !h.isAiGenerated && INDIA.test(h.tags) && !NOT_WILD.test(h.tags)
      && q.toLowerCase().split(/\s+/).every(w => h.tags.toLowerCase().includes(w)));
  return hits.map(h => ({
    provider: 'pixabay', id: String(h.id), thumb: h.webformatURL, full: h.largeImageURL,
    title: h.tags, width: h.imageWidth, height: h.imageHeight,
    credit: { author: h.user, license: 'Pixabay Content License', licenseUrl: 'https://pixabay.com/service/license-summary/', source: h.pageURL },
  }));
}

async function commons(q) {
  const u = `https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=search&gsrnamespace=6&gsrlimit=50&gsrsearch=${encodeURIComponent(q + ' India filetype:bitmap')}&prop=imageinfo&iiprop=url|size|extmetadata&iiurlwidth=480`;
  const { query } = await getJson(u, UA);
  return Object.values(query?.pages ?? {}).flatMap(p => {
    const i = p.imageinfo?.[0], m = i?.extmetadata ?? {};
    const license = m.LicenseShortName?.value ?? '';
    const text = `${p.title} ${m.Categories?.value ?? ''} ${strip(m.ImageDescription?.value)}`;
    const lat = parseFloat(m.GPSLatitude?.value), lon = parseFloat(m.GPSLongitude?.value);
    if (!i || !FREE_LICENCE.test(license) || i.width < 1200) return [];
    if (!INDIA.test(text) || NOT_WILD.test(text) || (lat && lon && !inIndiaBox(lat, lon))) return [];
    return [{
      provider: 'commons', id: String(p.pageid), thumb: i.thumburl, full: i.url,
      title: p.title.replace(/^File:|\.\w+$/g, ''), width: i.width, height: i.height,
      credit: { author: strip(m.Artist?.value) || 'Unknown', license, licenseUrl: m.LicenseUrl?.value ?? '', source: i.descriptionurl },
    }];
  });
}

async function save({ name, alt, image }) {
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  if (!slug || !alt) throw new Error('File name and alt text are required');
  const file = path.join(OUT_DIR, `${slug}.webp`);
  // Commons throttles originals; its 1920px rendition is all we keep anyway.
  const url = image.provider === 'commons' && image.width > 1920
    ? image.thumb.replace(/\/\d+px-/, '/1920px-')
    : image.full;
  let res;
  for (let attempt = 0; attempt < 5; attempt++) {
    res = await fetch(url, { headers: UA });
    if (res.status !== 429) break;
    await new Promise((r) => setTimeout(r, (Number(res.headers.get('retry-after')) || 2 ** attempt * 3) * 1000));
  }
  if (!res.ok) throw new Error(`Download failed (${res.status})`);
  await fs.mkdir(OUT_DIR, { recursive: true });
  await sharp(Buffer.from(await res.arrayBuffer())).rotate()
    .resize({ width: 1920, withoutEnlargement: true }).webp({ quality: 78 }).toFile(file);
  const credits = JSON.parse(await fs.readFile(CREDITS, 'utf8').catch(() => '{}'));
  credits[slug] = { alt, provider: image.provider, credit: image.credit, savedAt: new Date().toISOString().slice(0, 10) };
  await fs.writeFile(CREDITS, JSON.stringify(credits, null, 2) + '\n');
  return { file: path.relative(process.cwd(), file).replaceAll('\\', '/'), slug };
}

const json = (res, code, body) => { res.writeHead(code, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(body)); };

http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  try {
    if (url.pathname === '/') {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      return res.end(await fs.readFile(new URL('./image-picker.html', import.meta.url)));
    }
    if (url.pathname === '/api/search') {
      const q = url.searchParams.get('q') ?? '';
      const fn = url.searchParams.get('provider') === 'commons' ? commons : pixabay;
      return json(res, 200, await fn(q));
    }
    if (url.pathname === '/api/save' && req.method === 'POST') {
      let body = ''; for await (const c of req) body += c;
      return json(res, 200, await save(JSON.parse(body)));
    }
    json(res, 404, { error: 'Not found' });
  } catch (e) { json(res, 500, { error: e.message }); }
}).listen(PORT, '127.0.0.1', () => console.log(`Image picker → http://localhost:${PORT}`));
