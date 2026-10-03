# KumaonRang: P0 / P1 implementation — 3 October 2026

## Current state

The database migration and catalogue content changes are applied to the existing
Supabase project. At the time of the verification below, frontend changes were
implemented and tested locally but had **not been deployed**. The user subsequently
authorised pushing the approved changes to GitHub `main`. That push does not by
itself establish a successful production deployment. Vercel lists the `artgallery`
project but rejects direct deployment
inspection for account scope `upadhyayadeepanshu8-gmailcoms-projects` with HTTP 403.
The installed Vercel CLI has no authenticated session. Existing Aipan-guide work
was preserved and integrated.

Browser access to the local preview was declined. All results below are from
code, database checks, server-rendered HTML and HTTP responses. They do not verify
visual layout, current field Core Web Vitals or Google indexing.

## P0: production checks

No current P0 crawling/indexing blocker was confirmed. Read-only production checks
verify the preferred homepage returns 200; all alternate domain/protocol versions
redirect to `https://www.kumaonrang.com/`; robots permits public crawling and
references the canonical sitemap; invalid pages return 404; and the admin login
has noindex. HTTP apex still uses two redirects, a lower-priority optimisation.

The current production sitemap audit passes for **60 pages, including 48 product
pages**. All titles and descriptions are unique and within the existing audit's
limits, canonicals match Open Graph URLs and the preferred host, product pages
have Product/Offer schema and breadcrumbs, and each public page has one H1.
All **47 pre-existing unique product URLs still return HTTP 200** after the data
changes. These are crawlability checks; Search Console must confirm actual
Google-selected canonicals, indexed URLs and discovery/crawl statuses.

Evidence: `seo-p0-production-checks-2026-10-03.json`,
`seo-p1-current-production-verification-2026-10-03.json` and
`seo-p1-production-url-retention-2026-10-03.json`.

## P1 changes applied to the database

- Persisted a permanent `slug` and `url_category` for all 48 products. Every
  pre-existing unique URL was retained. A database unique constraint prevents
  duplicate public identities; a trigger creates a suffix for duplicate names
  and rejects later URL changes. Display names/categories remain editable.
- The owner confirmed the two ₹800 Om listings are different designs. The first
  retains `/aipan-frames/om-aipan-wall-decor`; the second uses
  `/aipan-frames/om-aipan-wall-decor-90366ff1`. Their names identify Design 1 and
  Design 2. Their prices, galleries and product identities were retained. Legacy
  ID redirects resolve to the correct individual design.
- Added `is_published` separately from `is_available`. The owner confirmed that
  availability represents current stock. Public RLS reads published rows without
  requiring stock, and excludes unpublished rows. All 48 current products remain
  published and in stock; no stock value was invented or changed.
- Updated 16 priority listings with clearer names and/or practical copy grounded
  in their existing specifications. Examples include the nameplate's dimensions
  and name-only personalisation, canvas bag care, Golu frame materials, distinct
  acrylic magnet versions and wedding brooch minimum quantity. Prices, categories,
  stories and photos remain unchanged. Duplicate specification lines were removed.

The pre-change catalogue is saved in
`seo-p1-original-catalogue-2026-10-03.json`. Exact before/after content is in
`seo-p1-content-changes-2026-10-03.json`. Restore only intended content fields using
compare-and-swap checks against the recorded after values; do not blindly replace
the catalogue or remove the permanent URL fields.

The migration files were created with the Supabase CLI and aligned to the versions
returned by the remote migration history:

- `supabase/migrations/20261003104222_product_publication_and_stable_urls.sql`
- `supabase/migrations/20261003104644_product_url_diacritics.sql`

Do not apply them again to this production database; both migrations are already
present in its history. Supabase security advisors showed no new notices. The
pre-existing leaked-password-protection notice remains outside this SEO change;
see [Supabase password protection documentation](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection).

## Frontend changes awaiting deployment

- Homepage order: hero → collections → customer notes → hampers → Meet Sneha.
- `/aipan-art` uses the user's real photograph with a descriptive alt, a neutral
  caption, Article/ImageObject metadata and responsive WebP sources. A subsequent
  CSS refinement crops the surrounding work area, retains the artwork borders
  and removes image-panel letterboxing. Original: 4,160 × 3,120 pixels / 5.13 MB;
  desktop: 1,440 × 1,080 / 557,502 bytes; mobile: 720 × 540 / 163,278 bytes. No
  maker, medium, licence or photographed product is fabricated. Prior Wikimedia
  credits are not assigned to the supplied photo. The old guide URL keeps its 308.
- Storefront queries use publication, retaining out-of-stock product pages and
  sitemap entries. Product schema maps actual stock to InStock/OutOfStock; unknown
  stock does not publish a fabricated availability value. Product cards/details
  and WhatsApp availability enquiries agree with that status.
- Admin has independent “Currently in stock” and “Published in the shop” controls,
  corresponding list labels, and a dashboard stock count. Public legacy ID lookup
  also excludes unpublished listings. Routine forms cannot overwrite URL fields.
- Product links and canonicals use the immutable URL category even when the display
  category changes. Full protection after a category move depends on deploying
  this code; the current live data has not changed category.
- The mixed gifts category now describes gifts, Kumaoni keepsakes and accessories
  rather than implying that every item can be personalised. Shop metadata targets
  shopping intent; the customer-stories title is concise and untruncated.

The stock-retention behaviour, admin controls, guide photograph and homepage order
require this frontend deployment. They are not yet claimed as live.

## Verification

- `npm run build` — passed on Next.js 15.5.19.
- `npx tsc --noEmit --incremental false` — passed.
- ESLint on modified TypeScript/TSX implementation files — passed.
- `node scripts/test-product-indexability.mjs` — passed: permanent URL lookup,
  distinct designs, drafts, real route metadata and schema, SSR product details,
  true/false/unknown stock, and out-of-stock enquiry text. No external writes.
- Product photo helper tests: 12 groups passed; product form tests: 6 groups passed,
  including independent publication/stock persistence and immutable URL payloads;
  product story render/form checks passed. No external writes.
- Database regression checks passed for duplicate-name insertion, immutable URL
  enforcement, rename/category movement, accented-name slug generation, anonymous
  out-of-stock visibility and anonymous draft exclusion. Temporary test inserts
  and changes were rolled back; the catalogue still contains exactly 48 records
  with 48 unique public URL identities.
- Local production HTML audit: 60/60 pages and 48/48 products passed. Both photo
  assets return WebP/200 and Article dimensions match the file. Hamper order, old
  guide 308, distinct Om legacy redirects, unknown-page/product/ID 404s passed.
- Production HTML audit: 60/60 pages and 48/48 products passed; all 47 earlier URLs
  returned 200. Current production checks establish catalogue compatibility, not
  publication of the pending frontend code.

Evidence: `seo-p1-local-verification-2026-10-03.json`,
`seo-p1-regression-verification-2026-10-03.json` and the production reports above.
The supplied installed Next package does not contain `node_modules/next/dist/docs/`;
official Next 15 documentation was used alongside the installed source and types.

## Remaining work

1. Restore Vercel access to the correct account, deploy the tested frontend, then
   repeat the production HTML/redirect/sitemap/schema checks and manually inspect
   the new photo and homepage ordering on mobile and desktop.
2. Supply the actual Pahadi Happy Couple Fridge Magnet photograph. That listing
   still has no photo. The Aipan guide image was not reused as a product photo.
3. Verify missing product facts with Sneha (for example, keychain dimensions and
   design-specific preparation/delivery details). These were not fabricated.
4. Check Search Console Page indexing, URL Inspection and Sitemaps for the two Om
   URLs and principal categories. Send excluded-status reasons and Google's
   selected canonical when they differ. Actual indexed status/rankings remain
   unverified. Core Web Vitals, HTTPS, Manual Actions, Security Issues and Search
   Results still require the owner's Search Console access.
5. Continue the audit's P2/P3 work after this phase: factual shipping/returns
   information, richer photo alternatives, related-product links, further image
   delivery/performance work and handling sitemap catalogue-load failures.
