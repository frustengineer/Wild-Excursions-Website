// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

/**
 * `astro dev` doesn't serve Netlify functions, so enquiry forms fail locally with
 * "We could not submit your enquiry". This runs the real handler in the dev server.
 *
 * Submissions go to the real CRM, exactly as they will in production. Set
 * WE_DEV_DRY_RUN=1 to print the payload to the terminal instead, when you want to
 * click through the form without creating leads.
 */
const netlifyFunctionsDev = {
  name: 'we-netlify-functions-dev',
  apply: 'serve',
  configureServer(server) {
    server.middlewares.use('/.netlify/functions/submit-enquiry', async (req, res) => {
      const send = (status, body) => {
        res.statusCode = status;
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.end(JSON.stringify(body));
      };
      try {
        const chunks = [];
        for await (const chunk of req) chunks.push(chunk);
        const raw = Buffer.concat(chunks);

        if (process.env.WE_DEV_DRY_RUN) {
          console.log('\n[dev] enquiry submitted (dry run - not sent to the CRM):');
          console.log(raw.toString('utf8') || '(empty body)');
          send(200, { ok: true, dryRun: true, message: 'Dry run: lead was not sent to the CRM.' });
          return;
        }

        const mod = await import(pathToFileURL(resolve('netlify/functions/submit-enquiry.mjs')).href);
        // the function only trusts the production site, localhost and 127.0.0.1 - a phone
        // hitting the LAN address would be rejected, so present the request as localhost
        const headers = { ...req.headers, origin: 'http://localhost' };
        const request = new Request('http://localhost' + req.url, {
          method: req.method,
          headers,
          body: raw.length ? raw : undefined,
        });
        console.log('[dev] enquiry -> CRM (live)');
        // No real Netlify `context` locally — submit-enquiry.mjs falls back to
        // firing its post-response delivery work without context.waitUntil.
        const response = await mod.default(request, undefined);
        res.statusCode = response.status;
        response.headers.forEach((value, key) => res.setHeader(key, value));
        res.end(await response.text());
      } catch (error) {
        console.error('[dev] enquiry handler failed:', error);
        send(500, { ok: false, message: String(error?.message ?? error) });
      }
    });
  },
};

// https://astro.build/config
export default defineConfig({
  site: 'https://wildexcursions.in',
  trailingSlash: 'always',
  image: {
    layout: 'constrained',
    responsiveStyles: true,
    breakpoints: [320, 480, 640, 960, 1280, 1920],
  },
  vite: {
    plugins: [tailwindcss(), netlifyFunctionsDev]
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