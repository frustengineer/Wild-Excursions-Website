import { travellerPriceInr, type TravellerType } from '../data/pricing';

/**
 * Browser-side price display shared by the tour and departure pages.
 * Prices are rendered in Indian INR in the HTML (the SEO reference); this repaints them for the
 * chosen nationality (foreign-national uplift) and currency:
 *   [data-inr]        -> full price text, e.g. "₹22,690" / "$272"
 *   [data-inr-value]  -> number only; [data-cur-symbol] elements show the symbol
 *   [data-uplift]     -> per-element uplift (e.g. a card for another park), else the page's
 * Scripts that compute prices set data-inr-value and dispatch `prices:changed` on document.
 * Everyone starts on the Indian price in INR; Foreigner opens the currency picker.
 */
const RATES_KEY = 'we_fx_rates';
const RATES_MAX_AGE_MS = 24 * 60 * 60 * 1000;

let traveller: TravellerType = 'indian';
let curCode = 'INR';
let curSym = '₹';
let curRate = 1;
let curRates: Record<string, number> | null = null;
let initialised = false;

const pageUplift = () => Number(document.querySelector<HTMLElement>('[data-page-uplift]')?.dataset.pageUplift ?? 0);
const upliftFor = (el: HTMLElement) => (el.dataset.uplift ? Number(el.dataset.uplift) : pageUplift());

function amount(inr: number, uplift: number) {
  const price = travellerPriceInr(inr, traveller, uplift);
  if (curCode === 'INR' || !curRate) return { symbol: '₹', value: price.toLocaleString('en-IN') };
  const val = price * curRate;
  const shown = val >= 10 ? Math.round(val) : Math.round(val * 100) / 100;
  return { symbol: curSym, value: shown.toLocaleString('en-US') };
}

function repaint() {
  document.querySelectorAll<HTMLElement>('[data-inr]').forEach((el) => {
    const base = Number(el.dataset.inr);
    if (!base) return;
    const { symbol, value } = amount(base, upliftFor(el));
    el.textContent = `${symbol}${value}`;
  });
  document.querySelectorAll<HTMLElement>('[data-inr-value]').forEach((el) => {
    const base = Number(el.dataset.inrValue);
    if (base) el.textContent = amount(base, upliftFor(el)).value;
  });
  const symbol = curCode === 'INR' || !curRate ? '₹' : curSym;
  document.querySelectorAll<HTMLElement>('[data-cur-symbol]').forEach((el) => { el.textContent = symbol; });
  const fields: Record<string, string> = {
    nationality: traveller === 'foreign' ? 'Foreign national' : 'Indian national',
    displayCurrency: curCode,
  };
  document.querySelectorAll<HTMLInputElement>('input[data-pricing-field]').forEach((input) => {
    input.value = fields[input.name] ?? '';
  });
}

// Daily-cached reference rates; a stale copy is kept as the fallback if the provider is down.
async function loadRates() {
  if (curRates) return curRates;
  let stale: Record<string, number> | null = null;
  try {
    const cached = JSON.parse(localStorage.getItem(RATES_KEY) || 'null');
    if (cached?.rates) {
      if (Date.now() - cached.ts < RATES_MAX_AGE_MS) return (curRates = cached.rates);
      stale = cached.rates;
    }
  } catch {}
  try {
    const res = await fetch('https://open.er-api.com/v6/latest/INR');
    const data = await res.json();
    if (data?.rates) {
      curRates = data.rates as Record<string, number>;
      try { localStorage.setItem(RATES_KEY, JSON.stringify({ ts: Date.now(), rates: curRates })); } catch {}
    }
  } catch {}
  return (curRates ??= stale);
}

async function applyCurrency(code: string, sym: string, country: string) {
  curCode = code;
  curSym = sym;
  document.querySelectorAll<HTMLElement>('[data-country]').forEach((b) => b.classList.toggle('is-active', b.dataset.country === country));
  // The phone code follows the chosen country.
  document.querySelectorAll<HTMLSelectElement>('select.phone-country-select').forEach((select) => {
    const option = select.querySelector<HTMLOptionElement>(`option[data-iso="${country}"]`);
    if (option) option.selected = true;
  });
  if (code === 'INR') curRate = 1;
  else {
    const rates = await loadRates();
    curRate = rates?.[code] ?? 0;
  }
  repaint();
}

function setTraveller(choice: TravellerType) {
  traveller = choice;
  document.querySelectorAll<HTMLElement>('[data-traveller-pick]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.travellerPick === choice)));
  repaint();
}

export function initPriceDisplay() {
  if (initialised) return;
  initialised = true;
  const sheet = document.querySelector<HTMLElement>('[data-cur-sheet]');
  const input = sheet?.querySelector<HTMLInputElement>('[data-cur-input]');
  const items = Array.from(sheet?.querySelectorAll<HTMLButtonElement>('[data-cur-pick]') ?? []);
  const open = () => { if (sheet) { sheet.hidden = false; document.body.style.overflow = 'hidden'; input?.focus(); } };
  const close = () => { if (sheet) { sheet.hidden = true; document.body.style.overflow = ''; } };

  // Every lead form carries the nationality and currency the visitor saw.
  document.querySelectorAll<HTMLFormElement>('form[method="post"]').forEach((form) => {
    for (const name of ['nationality', 'displayCurrency']) {
      if (form.querySelector(`input[name="${name}"]`)) continue;
      const hidden = document.createElement('input');
      hidden.type = 'hidden';
      hidden.name = name;
      hidden.dataset.pricingField = '';
      form.append(hidden);
    }
  });

  document.querySelectorAll<HTMLElement>('[data-traveller-pick]').forEach((b) => b.addEventListener('click', () => {
    if (b.dataset.travellerPick === 'foreign') {
      setTraveller('foreign');
      open();
    } else {
      setTraveller('indian');
      applyCurrency('INR', '₹', 'IN');
    }
  }));
  sheet?.querySelectorAll('[data-cur-close]').forEach((el) => el.addEventListener('click', close));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && sheet && !sheet.hidden) close(); });
  items.forEach((b) => b.addEventListener('click', () => {
    applyCurrency(b.dataset.curPick ?? 'INR', b.dataset.curSym ?? '', b.dataset.country ?? '');
    close();
  }));
  input?.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    let any = false;
    items.forEach((b) => {
      const match = !q || (b.dataset.curSearch ?? '').includes(q);
      b.hidden = !match;
      if (match) any = true;
    });
    sheet?.querySelectorAll<HTMLElement>('[data-cur-group]').forEach((g) => (g.hidden = q.length > 0));
    sheet?.querySelectorAll<HTMLElement>('[data-cur-grid]').forEach((grid) => {
      grid.hidden = !Array.from(grid.querySelectorAll<HTMLElement>('[data-cur-pick]')).some((x) => !x.hidden);
    });
    const empty = sheet?.querySelector<HTMLElement>('[data-cur-empty]');
    if (empty) empty.hidden = any;
  });
  document.addEventListener('prices:changed', repaint);
  repaint();
}
