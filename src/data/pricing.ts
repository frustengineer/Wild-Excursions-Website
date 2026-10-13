import type { Tour } from './tours';

export type TravellerType = 'indian' | 'foreign';

/**
 * Foreign-national prices are the Indian price plus a park-region uplift. Change the rule here
 * and every page using the pricing engine follows. Currency conversion happens after this.
 */
const FOREIGNER_UPLIFT_BY_REGION: Partial<Record<Tour['region'], number>> = {
  Maharashtra: 0.2,
};
const DEFAULT_FOREIGNER_UPLIFT = 0.4;

export const foreignerUplift = (region?: Tour['region']) =>
  (region && FOREIGNER_UPLIFT_BY_REGION[region]) ?? DEFAULT_FOREIGNER_UPLIFT;

export const travellerPriceInr = (indianPriceInr: number, traveller: TravellerType, uplift: number) =>
  traveller === 'foreign' ? Math.round(indianPriceInr * (1 + uplift)) : indianPriceInr;

const EURO_COUNTRIES = ['AT', 'BE', 'HR', 'CY', 'EE', 'FI', 'FR', 'DE', 'GR', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PT', 'SK', 'SI', 'ES'];

const CURRENCY_BY_COUNTRY: Record<string, string> = {
  IN: 'INR', US: 'USD', GB: 'GBP', CN: 'CNY', AU: 'AUD', CA: 'CAD', SG: 'SGD', AE: 'AED',
  NZ: 'NZD', JP: 'JPY', CH: 'CHF', SE: 'SEK', NO: 'NOK', DK: 'DKK', HK: 'HKD', MY: 'MYR',
  TH: 'THB', ZA: 'ZAR', SA: 'SAR', QA: 'QAR', KW: 'KWD', BH: 'BHD', OM: 'OMR', LK: 'LKR',
  NP: 'NPR', BD: 'BDT', ID: 'IDR', PH: 'PHP', KR: 'KRW', IL: 'ILS', MX: 'MXN', BR: 'BRL',
  TR: 'TRY', RU: 'RUB', PL: 'PLN', CZ: 'CZK', HU: 'HUF', RO: 'RON', KE: 'KES', TZ: 'TZS',
  UG: 'UGX', NG: 'NGN', EG: 'EGP', MA: 'MAD', PK: 'PKR', VN: 'VND', TW: 'TWD', AR: 'ARS',
  CL: 'CLP', CO: 'COP',
  ...Object.fromEntries(EURO_COUNTRIES.map((country) => [country, 'EUR'])),
};

/** Visitors from a country we have no currency for see USD. */
export const currencyForCountry = (country: string) => CURRENCY_BY_COUNTRY[country.toUpperCase()] ?? 'USD';
