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
