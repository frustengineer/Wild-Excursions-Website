/**
 * German pilot. While GERMAN_LIVE is false the /de/ pages are noindex, left out of the sitemap,
 * carry no hreflang, and English pages don't link to them. Flip it to true once a native speaker
 * has reviewed every German page; that one change publishes them to search engines.
 */
export const GERMAN_LIVE = true;

/** English path → German path, for every page that has a German version. */
export const germanPaths = {
  '/india-tiger-safari-for-foreigners/': '/de/tigersafari-indien-fuer-auslaender/',
  '/tiger-safari-cost-india/': '/de/tigersafari-indien-kosten/',
  '/tiger-safari-india/': '/de/tigersafari-indien/',
};

/** hreflang link set for a page that exists in both languages (empty until German is live). */
export function languageAlternates(path) {
  const englishPath = Object.keys(germanPaths).find((en) => en === path || germanPaths[en] === path);
  if (!GERMAN_LIVE || !englishPath) return [];
  return [
    { hreflang: 'en', href: englishPath },
    { hreflang: 'de', href: germanPaths[englishPath] },
    { hreflang: 'x-default', href: englishPath },
  ];
}
