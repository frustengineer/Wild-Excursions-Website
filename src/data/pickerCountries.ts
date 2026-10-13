import { COUNTRY_CODES } from './countryCodes';
import { currencies } from './currencies';

/** A country in the price picker; prices show in its currency, but the picker only names the country. */
export interface PickerCountry {
  iso: string;
  name: string;
  currency: string;
  symbol: string;
}

const EURO_COUNTRIES = ['AT', 'BE', 'HR', 'CY', 'EE', 'FI', 'FR', 'DE', 'GR', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PT', 'SK', 'SI', 'ES'];

/** Shown first, in this order. */
const POPULAR = ['IN', 'US', 'GB', 'DE', 'FR', 'CN', 'AU', 'CA', 'SG', 'AE'];

// Every supported currency maps to its country (a currency code starts with the ISO country code),
// and the euro maps to each eurozone country.
const all: PickerCountry[] = currencies.flatMap((c) => {
  const isos = c.code === 'EUR' ? EURO_COUNTRIES : [c.code.slice(0, 2)];
  return isos.flatMap((iso) => {
    const country = COUNTRY_CODES.find((entry) => entry.iso === iso);
    return country ? [{ iso, name: country.name, currency: c.code, symbol: c.symbol }] : [];
  });
});

export const popularCountries = POPULAR.map((iso) => all.find((c) => c.iso === iso)).filter((c): c is PickerCountry => Boolean(c));
export const otherCountries = all.filter((c) => !POPULAR.includes(c.iso)).sort((a, b) => a.name.localeCompare(b.name));
export const countryFlagUrl = (iso: string) => `https://flagcdn.com/${iso.toLowerCase()}.svg`;
