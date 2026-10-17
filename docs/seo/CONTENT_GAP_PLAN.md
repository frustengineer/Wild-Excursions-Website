# Content gap build plan: outrank Pugdundee Safaris

Owner: Hardik Patel · Written 17 Oct 2026 · Executor: Claude Code, working in this repo (`D:\WE_website`)

This plan turns the competitor gap analysis into pages on wildexcursions.in. Read all of it before writing any page. The work list is `docs/seo/page-build-list.csv`. Work through it in batch order, one batch per branch/PR.

---

## 1. Goal

Pugdundee Safaris (pugdundeesafaris.com) ranks for most Central India safari searches. We already beat them on Tadoba and Pench: city route pages, gate pages and famous tigers. We lose on:

1. **The other parks we sell**: Kanha, Bandhavgarh, Satpura, Panna and Kaziranga have tour pages but no guide pages (how to reach, zones and gates, things to do, resorts, best time).
2. **India-level head terms**: best places to see tigers, best jungle safari, best time for tiger safari, night safari, full-day safari.
3. **Wildlife knowledge pages** that build topical authority: tiger facts, white tiger, black panther, cheetah, species, birds.

Each new page must be **the best result for its keyword**, not just a page that exists. Section 5 defines "best".

## 2. Inputs you have

| File | What it is |
|---|---|
| `docs/seo/page-build-list.csv` | 70 pages to build or expand: batch, priority, URL, template, keywords, competitor benchmark files, word target, notes, pages that must link to it, and a `status` column (`todo` → `drafted` → `built` → `done`) |
| `docs/seo/competitor-outlines.csv` | H1, H2 and H3 outline and word count of every readable competitor page |
| `../pugdundeesafaris_copy/www.pugdundeesafaris.com/` | Full offline mirror of the competitor site (HTML). The `competitor_benchmark_files` paths in the build list point here |
| `D:\WE_SEO_Content_Gap.xlsx` | The original gap analysis. For Hardik; you don't need it |

## 3. Hard rules

1. **Never copy competitor text.** Use their pages only as a checklist of subtopics and a length benchmark. Don't paste or closely paraphrase sentences, headings or lists. Every page must pass the overlap check in §6.
2. **Never invent facts.** This covers fees, timings, distances, tiger names and IDs, resort names, sightings and statistics. Each one comes from an official or primary source:
   - forest department portals: mahaforest / mytadoba, mponline / MP Forest, Assam Forest
   - NTCA status reports, IUCN
   - a resort's own website
   
   Record the source in the data file with a "checked <date>" comment, the way `tadobaOfficial.ts` and `tadobaResorts.ts` do. If you can't verify something, leave it out or mark it in the code `// TODO(hardik): confirm`. Never guess.
3. **Prices come from code, never hard-coded in copy.** Tour prices come from `src/data/tours.ts` and `src/data/pricing.ts` (`foreignerUplift`). Permit fees go in a park's `*Official.ts` data file.
4. **Reuse existing patterns** (§4). Don't invent a new layout when one already exists. New parks follow the Tadoba/Pench file and URL conventions exactly.
5. **One page per keyword.** Before creating a page, search `src/` and `dist/` for pages that already target the keyword. Known overlaps to handle:
   - `/best-time-for-tiger-safari-india/` replaces `/guides/best-time-to-visit/`. Add a 301 in `public/_redirects` and update internal links.
   - `/best-places-to-see-tigers-in-india/` must differ in intent from `/blogs/national-parks/` (a list of parks) and `/best-wildlife-national-parks-india/` (how to choose a park). The new page ranks *where tiger sightings are best*. Cross-link all three.
   - `/blogs/tiger-facts/` must not duplicate `/wildlife/bengal-tiger/`. The species page is the ID card; the blog is the facts and FAQ piece. Link both ways.
6. **Don't touch unrelated uncommitted work.** On 17 Oct these files had uncommitted changes: `PenchLanding.astro`, `SafariBookingPage.astro`, `TadobaLanding.astro`, `index.astro`. Ask Hardik before starting. Work on a branch per batch: `content/batch-1-head-terms`, etc.
7. **Keep the existing SEO plumbing working.** Every page needs:
   - one H1, a title of 70 characters or less, and a meta description of 120–160 characters
   - a canonical URL with a trailing slash (`trailingSlash: 'always'`)
   - JSON-LD that includes `dateModified`, which the sitemap uses for `lastmod`
   - an author from `src/data/authors.ts`
   
   `npm run build && npm run check:seo` must pass with no new errors.

## 4. Template map: which existing pattern each page type copies

| Code | Page type | Copy this pattern | Data lives in | Route |
|---|---|---|---|---|
| **T1** | India-level guide / commercial hub | `/tiger-safari-india/` | add an entry to `seoClusterPages` in `src/data/seoCluster.ts` | `src/pages/[seo].astro`; no new route file |
| **T2** | Blog article | `/blogs/best-time-to-visit-tadoba/`, `/blogs/umred-karhandla-wildlife-sanctuary-guide/` | add an entry to `articleContent` in `src/data/seoArticles.ts` **and** its image to `articleImages` at the same index | `src/pages/blogs/[slug].astro` |
| **T3a** | Gate / zone directory + gate pages | `/tadoba/gates/` and `/tadoba/gates/[slug]/` | gates in `src/data/encyclopedia.ts`, per-gate detail in `encyclopediaDetail.ts`, fees and timings in a new `src/data/<park>Official.ts` | new `src/pages/<park>/gates/index.astro` + `[slug].astro` |
| **T3b** | Famous tigers hub + tiger pages | `/tadoba/famous-tigers/` | `tigers` in `encyclopedia.ts` (add a `park` field), timelines in `encyclopediaDetail.ts` | new `src/pages/<park>/famous-tigers/...` |
| **T3c** | Species page | `/wildlife/[slug]/` | `species` + `speciesDetail` | existing `src/pages/wildlife/[slug].astro` |
| **T4a** | How-to-reach hub + city pages | `/how-to-reach-tadoba/` + `[slug]` | new `src/data/<park>CityRoutes.ts` (same `CityRoute` shape) | new `src/pages/how-to-reach-<park>/` |
| **T4b** | X vs Y comparison | `src/pages/moharli-vs-kolara-tadoba.astro` | inline rows, or the park's data file | new `src/pages/<a>-vs-<b>-<park>.astro` |
| **T4c** | Best resorts list | `src/pages/best-resorts-in-tadoba.astro` + `TadobaResortCard` | new `src/data/<park>Resorts.ts` (same `Resort` shape) | new `src/pages/best-resorts-in-<park>.astro` |
| **T5** | Park map (new) | none yet. Build `/tadoba/map/` first | original SVG drawn from the gate and zone data you already have | `src/pages/<park>/map.astro` |

### Generalise before you multiply (Batch 0)

Several pieces are Tadoba-specific and will break or mislead on other parks:

- **`src/pages/wildlife/[slug].astro`** hard-codes *"In Central India it lives in both Tadoba and Pench"*. Add a `whereToSee: { park, href }[]` field to `speciesDetail`, render from it, and backfill the 10 existing species. Do this before adding rhino, wolf and the other new species.
- **`TadobaGuideLayout.astro`** and **`TadobaResortCard.astro`** are named for Tadoba. Check whether any copy, colours or breadcrumbs are Tadoba-only. If they are, add a `park` prop (defaulting to Tadoba so nothing changes). Don't rename the files.
- **`tigers` in `encyclopedia.ts`** has no park field. Add `park: 'tadoba'` to the existing entries before adding Pench, Kanha or Bandhavgarh tigers, and filter by park in each hub.
- **Bare-folder redirects:** add `/kanha/` → `/tours/kanha/` (and the same for each new park folder) in `public/_redirects`, matching the existing `/tadoba/` rule.

After Batch 0, the build output for existing Tadoba and Pench pages must not change apart from intended fixes. Diff `dist/` before and after.

## 5. Quality bar: what "better than Pugdundee" means

A page is done only when it passes all 10 checks.

1. **Covers every subtopic the competitor covers.** Open each `competitor_benchmark_files` page, list its H2/H3 subtopics, and make sure each is answered in our page in our own words. Put that checklist in the PR description.
2. **Answers first.** Start with a 40–60 word quick answer: the `quickAnswer` field on T2/T3, the intro on T1. It should state the direct answer with the key number. This is what Google snippets and AI answers quote.
3. **Adds what they lack.** At least three of the following:
   - fact table with 2026–27 fees and timings, with source and checked date
   - distance and drive-time table
   - month-by-month table
   - an "edge" or verdict comparison
   - an operator's "how we'd plan it" section with a sample itinerary
   - price ranges pulled from `tours.ts`
4. **Current.** Use "2026–27" in the title or H1 for time-sensitive topics (fees, timings, booking, best time). The competitor's pages are mostly 2020–2024.
5. **Length.** Hit the CSV's `target_words`, which is the competitor's longest page plus 15%. Add depth, not filler. For listicle monsters (owls at 7,400 words, hornbills at 5,000), cap at about 3,000 words and win on structure, ID tables and where-to-see.
6. **FAQs.** 6–10 real questions with direct answers, rendered with FAQPage JSON-LD (existing templates already do this). Source questions from Google "People also ask" for the keyword, and from the competitor's FAQs as topics, never their wording.
7. **E-E-A-T.**
   - Byline from `authors.ts`: Hardik Patel as default writer; Nagendra Soni as reviewer on booking and pricing pages.
   - `date` and `updatedDate`.
   - A "Sources" list on any page with facts or figures.
   - First-hand details where Hardik supplies them (see §8). Never invent experiences or sightings.
8. **Internal links.**
   - **Out:** at least 5 contextual links to related guides, the park's `/tours/<park>/` page and the booking page. Use descriptive anchors.
   - **In:** add links from every page in the CSV's `link_from` column, and from the relevant hub (`/blogs/`, `/guides/`, `/wildlife/`, park gate directory).
   - No orphans.
9. **Media.**
   - Hero plus at least 2 in-body images from our own folders (`home_images/`, `tour_images/`, `tour_jungle/`, `src/assets/`), with descriptive alt text.
   - Never hotlink or reuse competitor images.
   - If no fitting image exists (Kanha, Bandhavgarh and Satpura have only one hero each), use the park hero and list the gap for Hardik.
10. **Clean build.** `npm run build` and `npm run check:seo` pass. The title is unique. The page appears in the sitemap and, for park or guide pages, in `/llms.txt` where relevant.

## 6. Per-page workflow

For each row in `page-build-list.csv`, in order:

1. **Read the benchmark.** Open the competitor files. Note their H2/H3 subtopics, word count and any facts to verify independently.
2. **Research.** Get the facts from official or primary sources. Note URL and date checked.
3. **Outline.** Write the H2 list as the union of the competitor's subtopics, "People also ask" questions and our extras from §5.3. Add one H2 that only an operator could write.
4. **Data first.** Add or extend the data file (§4), then the route if a new one is needed.
5. **Write the copy.** Use our house voice (§7).
6. **Link.** Add outbound links and the inbound links from the `link_from` pages and hubs.
7. **Overlap check.** Write a small script `scripts/overlap-check.mjs` once and reuse it.
   - It builds 8-word shingles from our page's visible text and from every file under `../pugdundeesafaris_copy/www.pugdundeesafaris.com/blog/`.
   - It fails if more than 2% of our shingles appear in any single competitor page.
   - It must run against `dist/<route>/index.html`.
8. **Build and audit.** Run `npm run build && npm run check:seo && node scripts/overlap-check.mjs <route>`.
9. **Self-review against §5.** Paste the 10-point checklist, ticked, into the PR description.
10. **Update and commit.** Set `status` in the CSV and commit with a message like `Add /how-to-reach-kanha/ hub (content gap batch 3)`.

At the end of each batch, open one PR. Its description lists the pages, the checklists, the source list and a **"Needs Hardik"** list (§8).

## 7. House voice (match the existing pages)

- Plain, specific and practical, from an operator who runs these safaris. Short sentences. Exact numbers with units: "~110 km, 2–2.5 hours", "₹5,800–₹12,800 per Gypsy".
- Indian English, INR first. Use "Gypsy" (not "jeep") where the forest department does.
- No hype words ("breathtaking", "unforgettable", "nestled", "paradise") and no exclamation marks.
- Tell readers the honest trade-offs: which gate is worse for what, when not to go.
- CTAs follow the existing style: "Share your dates for a free quote within 24 hours."

## 8. What Claude Code needs from Hardik

Ask for these in each batch's PR. Don't block on them; ship with the safe default and list the gap.

- Photos for Kanha, Bandhavgarh, Satpura, Panna and Kaziranga (gates, resorts, wildlife). Default: the park hero from `tour_jungle/`.
- Partner resort list per park, with any preferred properties. Default: list only resorts verifiable on official or own websites, with no "partner" claims.
- First-hand notes: best recent sightings, favourite zone and why, a guest story (with permission). Default: leave out.
- Confirmation of night and full-day safari availability and pricing we actually sell. Default: official fees only, and "on request" for packages.
- A decision on the `/guides/top-things-to-do-in-tadoba/` move to `/blogs/things-to-do-in-tadoba/`. Default: expand in place.

## 9. Batches

Counts are from `page-build-list.csv`. City and gate sub-pages under a hub count as part of that hub's row.

| Batch | Scope | Pages | Why this order |
|---|---|---|---|
| 0 | Generalise templates (§4), overlap script, redirects | — | Unblocks everything else |
| 1 | India head terms: best places for tigers, best jungle safari, best time, leopards, night safari, full-day safari, Big Five | 7 | Highest volume; uses existing T1/T2 templates, so fastest to ship |
| 2 | Pench gaps: things to do, famous tigers, black panther, Jungle Book | 4 | Our own park; competitor ranks here |
| 3 | Kanha: how to reach (+9 cities), gates (+gate pages), Khatia vs Mukki, things to do, resorts, best time, famous tigers, birds | 8 hubs (~25 URLs) | We sell Kanha tours with no guide pages behind them |
| 4 | Bandhavgarh: same set | 6 hubs (~20 URLs) | Same |
| 5 | Satpura, Panna, Kaziranga, Tipeshwar, Tadoba map, Jabalpur | 11 | Remaining parks we sell |
| 6 | Authority: tiger knowledge, species, birds, culture, niche safari types, other park maps | 29 | Topical authority and internal-link fuel |
| 7 | Expand thin existing pages (birds of Pench, things to do in Tadoba, gaur, mugger) | 5 | Cheap wins on pages Google already knows |

Suggested pace: Batches 0–1 in week 1. One park batch per 1–2 weeks after that.

## 10. Measuring it

- After each batch, submit the new URLs in Google Search Console (Hardik).
- After 4–6 weeks, compare impressions and positions for each page's `primary_keyword`. Rows that show impressions but rank in positions 8–20 come back for a refresh pass, which is cheaper than writing new pages.
- Revisit fast-moving pages quarterly: cheetah/Kuno, fees, famous tigers.
