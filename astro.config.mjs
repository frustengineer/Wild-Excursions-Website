// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://wildexcursions.in',
  trailingSlash: 'always',
  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [
    sitemap({
      // Exclude the ~1,500 dated departure pages (/tours/{jungle}/{slug}/{departure}/) from the
      // sitemap — they're noindex'd and canonicalize to their parent tour page, so they shouldn't
      // compete for crawl budget or dilute ranking signals across near-duplicate content.
      filter: (page) => !/\/tours\/[^/]+\/[^/]+\/[^/]+\/$/.test(new URL(page).pathname),
      // lastmod defaults to the build time for every URL — better than the previous total
      // absence of the field, which left every page looking equally (and permanently) stale.
      serialize: (item) => ({ ...item, lastmod: new Date().toISOString() }),
    }),
  ]
});