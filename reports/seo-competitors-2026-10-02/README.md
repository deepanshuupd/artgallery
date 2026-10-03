# KumaonRang: competitor research and first SEO iteration

**Research started: 2 October 2026. Verification completed: 3 October 2026.** Scope: India's Aipan/Pahadi keepsake market and relevant gift-hamper searches. Publication is recorded in the Git history; no database update or ranking guarantee is implied.

## Read the evidence

- [12 competitor comparisons and 61 observed page phrases](competitors.md)
- [70 prioritised keyword opportunities and 26-destination map](keyword-opportunities.md)
- [Actual Search Console baseline](search-console-baseline.md)
- `seo-audit.json`: generated after the production-preview verification.

## Where KumaonRang stands

KumaonRang has a distinctive Pithoragarh identity, a named person behind the business, direct WhatsApp ordering and an existing catalogue that matches specific Aipan and Pahadi purchase searches. Its technical foundation already includes product/category URLs, canonical tags, sitemap discovery, product structured data and internal navigation. Those are strengths to preserve, not reasons to invent dozens of extra landing pages.

The available Google data is still too small to place the domain above or below competitors numerically: the latest 24-hour report showed **3 impressions, 3 clicks and no disclosed search queries**. The page-indexing report was processing. There is no verified domain authority score, competitor traffic estimate or keyword difficulty dataset in this research. A Lighthouse SEO score is not a Google ranking score.

The qualitative competitive gap is clearer. Specialist sellers explain exact designs, materials, dimensions, named makers and custom options. Several have category and product pages devoted to the same intent. Broader Pichwai gift suppliers expose bundles, occasions and order details. KumaonRang should compete with **better first-hand product information and an easier buying decision**, not more repeated heritage language.

### Aipankari is a former reseller, now a competitor

This relationship was confirmed by the owner. Treat Aipankari as a direct commercial competitor, while avoiding assumptions about ownership of individual photos, copy or designs. Where products overlap, the useful distinction is evidence: what Sneha actually makes or curates, original process photographs, the exact item included, and the direct conversation before ordering. Do not publish comparative accusations or copy a reseller's descriptions.

## What “low difficulty” means here

The accompanying target list is ordered by editorial opportunity: **actual catalogue fit, purchase specificity, useful content we can supply, and the observed type of competing pages**. Narrow product queries are sensible first experiments, but a long phrase is not automatically easy to rank for. Search demand may be small or absent. No numeric keyword-difficulty, search-volume, CPC, backlink or Google-position values have been invented.

The 61 phrase bank entries are observations from competitor pages, not 61 measured queries those competitors rank for. The target list separately labels proposed variations. Exact competitive rankings require a dated ranking-data export with country and device settings. Search Console can establish KumaonRang's own performance, not expose competitors' private query data.

## Recommended positioning and page ownership

| Intent | Primary destination | Supporting role |
| --- | --- | --- |
| Buy or compare Aipan frames | `/aipan-frames` | Individual motif products own Golu Devta, Om and Ganesh purchase queries. |
| Buy Pahadi keychains | `/pahadi-keychains` | Individual boy, girl and couple products supply the detailed differences. |
| Buy Uttarakhand magnets | `/uttarakhand-souvenirs` | Product pages distinguish regional artwork from personalised photo magnets. |
| Personalised Kumaoni gifts | `/kumaoni-gifts` | The nameplate and canvas bag have their own product-specific intent. |
| Compare gift hampers | `/curated-hampers` | The Pichwai jar combo owns its exact bundle query. Pichwai is not labelled Aipan. |
| Choose an Uttarakhand gift | `/uttarakhand-gifts` | A helpful decision guide links to appropriate collections and products. |
| Understand Aipan and choose artwork | `/pithoragarh-aipan-art` | Cultural context and buying checks support the frame collection. |
| Learn about the business and maker | `/about` | Factual provenance, not a second generic shop landing page. |

Use spelling variants naturally on the same page. Do not create separate city, spelling or word-order pages with substantially duplicated content. Google's [ecommerce site-structure guidance](https://developers.google.com/search/docs/specialty/ecommerce/help-google-understand-your-ecommerce-site-structure?hl=en) supports useful category-to-product links; its [spam policies](https://developers.google.com/search/docs/essentials/spam-policies) explicitly cover keyword stuffing and doorway pages.

## Changes implemented in this iteration

1. **Four collection pages:** concrete product-led H1s, distinct titles/descriptions, concise selection advice, three native FAQ disclosures each, and links to the relevant buying guide. The established category navigation and heading-height reserves are retained.
2. **Two existing guides:** distinct gift-selection and Aipan-art content, visible breadcrumbs and contextual commercial links. They no longer duplicate a large general product grid. The Aipan guide references an official cultural source and distinguishes traditional practice from contemporary product materials.
3. **Hamper page:** explicit gift-hamper heading and deliberate metadata, Pichwai-combo context, breadcrumbs, and compact contents/customisation/timing answers. No unsupported delivery, bulk-order or food-content promises.
4. **Business identity:** the existing public Instagram profile is connected through Organization `sameAs`. This is entity information, not a promised ranking boost.

All new answers are server-rendered. Disclosure controls use native HTML; no extra animation library, tracking script or client-side FAQ logic was introduced. No existing product slug was changed. The homepage design and animations are untouched.

## Next iterations: practical rather than keyword-stuffed

### First: improve the 10 best-matched product pages

Start with Golu Devta, Om and Ganesh artwork; Pahadi couple/girl/boy keychains; couple magnets; the Aipan nameplate and canvas bag; and the Pichwai jar combo. For each, have the business confirm:

- Actual size, material, finish and quantity; what the order includes and what is only a photo prop.
- Who makes the piece versus what is sourced or curated; avoid saying every item is handmade locally.
- Personalisation choices, artwork approval, preparation time, delivery charges and expected delivery range.
- Useful care instructions and display/hanging requirements.
- Original close-up, scale and packaging photographs. A short genuine making sequence can differentiate from resellers.

The admin already supports product detail/story content. Do not fill missing facts with competitor specifications. The public catalogue has two historical products associated with `/aipan-frames/om-aipan-wall-decor`; resolve product identity and redirects separately before any renaming. An older audit also noted a missing magnet image: verify the live asset before making claims about its present state.

### Next: remove purchase uncertainty

Publish truthful delivery, custom-order, cancellation and return information approved by the business. Show it near ordering decisions and link it from the footer. Ask real customers for genuine reviews with permission to display them; never fabricate ratings or add unsupported review schema. Track qualified enquiries and orders rather than treating every social visit as a conversion.

### Then: grow evidence and relevant discovery

Create original answers to questions that actually appear in Search Console or customer chats. A useful guide or process story should add information that a category page cannot. Seek relevant editorial coverage or local maker features through real relationships; do not buy link packages or mass-produce near-identical articles. Check mobile loading and usability after every visual addition.

## How to judge progress

After deployment and enough reporting history, compare complete 28-day periods. Track non-brand impressions/clicks by cluster, key product visibility, enquiry rate and completed orders. Assess small query groups cautiously; one impression at position 1 is not a durable win. Review the target order with real demand and enquiry data, and retire irrelevant targets.

There is no honest promise that these changes will outrank every competitor, or do so by a certain date. This iteration supplies a stronger content foundation and a measurable plan, not guaranteed Google positions.

## Verification

Completed against the local production preview at `http://localhost:3002` on 3 October 2026:

- `npx tsc --noEmit --incremental false`: passed before the production build.
- `npm run build`: passed with public-catalogue network access. Both guides are static; the build reports 106 kB first-load JavaScript for each guide, including shared application code. No fresh Lighthouse score or field-performance improvement is claimed.
- `node scripts/check-storefront-seo.mjs http://localhost:3002 https://www.kumaonrang.com reports/seo-competitors-2026-10-02/seo-audit.json`: **58 pages, 47 product URLs and 4 category pages passed**, with 58 unique titles and descriptions, matching canonical/OG URLs, one H1 each, product/INR offer and breadcrumb checks, unknown-category 404 and admin noindex checks. The script's title/description length limits are project checks, not ranking guarantees or Google's hard display limits.
- All 26 proposed destination paths in the keyword map occur in the current audited sitemap.
- The four category controls share the same document Y position at each tested size: **403.18px at 320px width; 367.76px at 430px; 468.40px at 1280px**. No horizontal document overflow was observed. The 390px frames-to-magnets interaction also preserved the H1 height; its small viewport-coordinate difference was scroll position, not header growth.
- Both guides and the hamper page passed overflow/content checks at **320px and 1280px**. The gift guide was visually inspected at 390px; the Aipan guide at 1280px. Their native FAQs are present in server-rendered content.
- Keyboard Enter opened the tested collection and Aipan-guide FAQ controls; the latter's summary measured 52.4px high and its answer became visible.
- A local RSC/JavaScript asset error appeared before restarting this task's preview process. After restart and reload, homepage navigation, homepage-to-guide navigation and further route checks succeeded without a newer error entry. This was a local-preview recovery, not a demonstrated production defect or production fix.
- `git diff --check`: passed.

Visual evidence: [phone gift guide](gift-guide-mobile.png), [desktop Aipan guide](aipan-guide-desktop.png).

### Concurrent work boundary

Separate image-SEO changes appeared in the shared worktree during this task, including product/admin/image helpers, the sitemap and some homepage components. The research release was prepared in an isolated checkout so those changes remain outside this commit. The 58-page audit and screenshots above describe the shared preview at verification time. The isolated release also passed a production build before commit.
