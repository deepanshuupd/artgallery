# Image SEO verification — 3 October 2026

Branch: `codex/image-search-discoverability`. Final production preview: `http://localhost:3001`. The application changes are not committed, pushed or deployed by this task. Unrelated worktree edits were preserved.

## Applied to the scoped Supabase project

- Added `public.products.image_metadata` as non-null JSONB with object validation; no new public-write grants or RLS changes.
- Backfilled measured detail/card dimensions on 47 records; verified all persisted updates. One product had no photograph. [Dimension snapshot](dimension-backfill-2026-10-03.json)
- Initial audit: 48 available records, 47 with photos, 110 unique detail photos / 220 WebP assets. Every response returned HTTP 200 but `X-Robots-Tag: none`. [Before audit](catalogue-audit-2026-10-03.json)
- Tested the supported upload override on one temporary copy. It returned `X-Robots-Tag: all`; only the temporary copy was then removed, not its source.
- Copied 110 immutable detail/card pairs, preserving SHA-256 byte equality. Every new response was verified before product references changed. Updated 47 records with compare-and-swap protections and persisted metadata verification. Every original remains available. [Rollback manifest](indexing-migration-2026-10-03.json)
- Additional stored bytes: **23,907,456 (22.8 MiB)**. The old catalogue and originals were not recompressed, overwritten or deleted.
- Final read-only audit: **220/220 HTTP 200, zero download failures, zero indexing-header blockers**. All formats WebP, all response headers `X-Robots-Tag: all`, GET cache lifetime `public, max-age=31536000`. Largest detail 353,718 bytes; largest card 96,810 bytes. [After audit](catalogue-audit-after-indexing-2026-10-03.json)

The saved manifest can restore the original product URL/metadata references using `--rollback`. That also restores the old indexing limitation. Rollback does not delete either set of objects. Resuming an incomplete apply requires the original prepared directory and its byte files; the copied report is enough for reference rollback, not an archival backup of the photos.

## Production code checks

Commands run successfully on the final code:

```sh
npm run build
npx tsc --noEmit --incremental false
node scripts/test-product-image-seo.mjs
node scripts/test-product-image-form.mjs
node scripts/test-product-image-upload.mjs
node scripts/check-product-story.mjs
node scripts/test-kumaon-journey.mjs
node scripts/test-home-atmosphere.mjs
node scripts/check-studio-postcard.mjs
node scripts/check-storefront-seo.mjs http://localhost:3001 https://www.kumaonrang.com reports/image-seo/page-seo-audit-2026-10-03.json
node scripts/check-product-image-pages.mjs http://localhost:3001 https://www.kumaonrang.com reports/image-seo/image-page-audit-2026-10-03.json
node scripts/audit-product-image-seo.mjs --report=reports/image-seo/catalogue-audit-after-indexing-2026-10-03.json
```

Results:

- Next.js 15.5.19 production build compiles, lints and type-checks. Shared first-load JS remains 102 kB; homepage/product-detail first-load JS is 119 kB. These bundle sizes are not Lighthouse performance scores.
- 12 pure helper regression groups; 5 isolated form workflow groups; chosen-encoding dimension/quality/cleanup check; existing story, journey, atmosphere and postcard tests all pass. Form tests use in-memory service stubs, not fake products in the live database.
- 58 public pages, four category pages, 47 canonical product pages; 58 unique titles/descriptions within the existing 60/160 character constraints. Admin login remains noindex and unknown categories return 404. [Public-page audit](page-seo-audit-2026-10-03.json)
- Valid image-sitemap XML (`xmllint`), 47 product pages, 46 with photographs, 109 discoverable gallery photographs. HTML `img src`, alt text, ImageObject, OG image, dimensions and primary-image association agree. Homepage primary/share photo also matches its actual featured product. [Image-page audit](image-page-audit-2026-10-03.json)
- A stale cached sitemap/gallery mismatch was found during verification. The catalogue data-shape cache key is now versioned for the new image metadata; final rebuilt sitemap and product checks pass from the initial response.
- Local scanning found no server-key value in generated client JS or image-SEO reports. No credential values are included in the evidence.

## Targeted browser check

Real product: `/aipan-frames/golu-devta-aipan-frame`.

- Tested 320, 390 and 430 px mobile widths and 1280 px desktop.
- Page scroll width matched the viewport at each tested width; no horizontal document overflow.
- Actual migrated images loaded, keeping the previous appearance and complete-product `object-contain` presentation.
- Photo-selection controls are labelled, 48 × 56 px, and selecting photograph 2 then returning to photograph 1 updated the selected photo and counter.
- No browser console errors captured. Temporary viewport overrides were reset.

This is not a full accessibility audit, a new Lighthouse run or field Core Web Vitals measurement.

## Remaining decisions / release gates

1. Deploy the branch's application changes. An early live check still served old cached URLs; the final check showed the refreshed homepage and Golu Devta page using corrected copies (six of six sampled photo elements on each page, HTTP 200). The live `/sitemap.xml` still has zero image entries. It did not use a Vercel image proxy. The new image sitemap, structured metadata and future-upload header require deployment. Verify deployed pages/sitemap, not only the database.
2. Supply a genuine photo for `Pahadi Happy Couple Fridge Magnet`.
3. Resolve the two `Om Aipan wall decor` records' shared public slug with the owner; do not fabricate distinct routes or silently rewrite an existing indexed route.
4. Review product-name fallback descriptions against the actual photos before specifying particular views, materials or cultural motifs. Photographer/rights metadata needs verified ownership.
5. Check Google Search Console/Bing sitemap discovery, then collect actual Image impressions/clicks and AI referrals. Eligibility and valid schema do not establish indexing or competitor rank.
6. Existing broad authenticated database/storage policies and disabled leaked-password protection are separate security follow-ups. This image task did not widen access or claim to fix them. [Supabase password protection](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection)
