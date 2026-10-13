// Probable visitor country from Netlify's CDN geolocation. Used only to pre-select a display
// currency; visitors can always change it, and nationality is never inferred from it.
export default async (request, context) =>
  Response.json(
    { country: context.geo?.country?.code ?? null },
    { headers: { 'Cache-Control': 'private, no-store' } }
  );
