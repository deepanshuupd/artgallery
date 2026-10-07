# Homepage performance investigation — 7 October 2026

## What caused the low score?

The existing incognito Chrome Lighthouse report scored **51**: FCP 1.7 s,
LCP 6.7 s, TBT 25 ms, CLS 1. The whole document was reported as shifting.
This was not evidence of a large JavaScript execution bottleneck: TBT was low.

Two findings need to be distinguished:

1. **Audit setup affected the result.** The original responsive toolbar was
   768 px wide, while Lighthouse audited at 412 px. Repeating the audit on the
   *unchanged live site* with the toolbar already at 412 px produced **83**,
   LCP 4.2 s and CLS 0. A clean, unmodified local production build similarly
   reproduced 51 when starting at 768 px, but 76 with CLS 0 when starting at
   412 px. This points to the viewport transition as the source of the extreme
   whole-page CLS penalty in this setup. It is not a code-fixed CLS improvement.
2. **Image delivery had a real, reproducible problem.** Global
   `images.unoptimized: true` deliberately avoids paid runtime transformations,
   but Next's `sizes`/`quality` props alone then do not generate smaller files.
   The homepage downloaded full card/review/logo files even for small mobile
   slots. The comparable live report estimated 397,399 bytes (388 KiB) of
   image-delivery savings. The LCP element was the featured Golu Devta frame.

The original report also recorded a React hydration error. It did not reproduce
in the clean local production build, even when that build scored 51. No warnings
were suppressed and no speculative hydration changes were made. Recheck the live
console after deployment; the available evidence does not establish its cause.

## Implemented changes

- Generated offline, content-hashed width variants for ten existing public
  homepage photos/logo sources. Photos have AVIF plus WebP fallback; the logo
  stays WebP for crisp lettering.
- Added real `srcset`/`sizes` selection for the hero, category photos, gift photo,
  review photos and shared brand mark. Unknown/new admin upload URLs retain
  their exact original source, so the manifest cannot display a stale photo.
- Explicitly preload only the hero's AVIF candidates, with an eager/high-priority
  fallback image. Verified the browser downloads one hero format, not both.
- Kept below-fold images lazy, intrinsic dimensions/layout slots, existing alt
  text, animation hooks and image-error fallbacks.
- Serve derivatives from the site's own origin with one-year immutable caching.
  Existing Supabase originals, database rows and paid-optimizer settings were
  **not changed**.

The final mobile report fetched the hero as a 540 px AVIF: 44,648 transfer bytes
(including HTTP overhead), versus the original 88,524-byte WebP payload.
Side-by-side visual inspection preserved the painted frame's fine detail.

## Measured results

Incognito Chrome / Lighthouse 13.4.1, navigation audit, emulated Moto G Power,
simulated Slow 4G. Set the responsive viewport to 412 px **before** auditing.

| Run | Performance | FCP | LCP | TBT | CLS | Speed Index |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Original live report; starting viewport 768 px | 51 | 1.7 s | 6.7 s | 25 ms | 1 | 2.2 s |
| Unchanged live control; starting viewport 412 px | 83 | 1.5 s | 4.2 s | 179 ms | 0 | 2.4 s |
| Clean local baseline; starting viewport 412 px | 76 | 1.6 s | 6.5 s | 70 ms | 0 | 1.6 s |
| Optimized local production build; 412 px | **88** | **1.4 s** | **3.9 s** | **57 ms** | **0** | **1.6 s** |
| Repeat optimized local production audit; 412 px | **89** | **1.1 s** | **3.8 s** | **60 ms** | **0** | **1.3 s** |

Final accessibility / best practices / SEO: **100 / 100 / 100**.
Estimated image-delivery waste: **48 KiB**, down from **388 KiB** in the
comparable live control. These are individual lab runs, not field metrics or a
guaranteed production score. Local hosting, CDN/cache state and analytics differ;
do not advertise this as a pure code-driven 51 → 88 improvement.

Remaining limitation: simulated mobile LCP is still 3.9 s, above the good 2.5 s
threshold. Fonts and render-blocking CSS remain in the dependency chain. Measure
the deployed build under consistent conditions before further font/style tuning;
avoid removing branding, animations or analytics without evidence.

## Verification

- Isolated `next build`: passes compilation, lint and TypeScript validation.
- `npx tsc --noEmit --incremental false`: passes.
- 24 tests pass across responsive assets, SSR discovery/fallback, motion,
  reduced-motion behavior, category transitions and customer notes.
- Storefront SEO checker: 60 pages, 48 products, 60 unique titles/descriptions.
- Native Chrome mobile and full-width desktop visual checks: photos load and
  preserve their framing; existing choreography remains intact.
- Checked immutable asset response headers and actual AVIF requests.
- No database/storage mutation performed. At the end of the initial investigation,
  these changes were local only; the owner subsequently requested a main-branch release.

Local production preview: `http://localhost:3006/`.
Raw exported audit files (local temporary evidence):

- `/tmp/www.kumaonrang.com-20261007T173814.json` — original 51 report.
- `/tmp/www.kumaonrang.com-20261007T182147.json` — live 412 px control.
- `/tmp/localhost_3006-20261007T182411.json` — optimized 88 report.
- `/tmp/localhost_3006-20261007T183021.json` — repeat optimized 89 report.

Regenerate variants when featured/category imagery changes:

```sh
node scripts/prepare-responsive-images.mjs /path/to/new-lighthouse-report.json
node --test scripts/test-responsive-images.mjs
```

The generator retains previously approved manifest sources and accepts new known
public Supabase bucket URLs observed in that report, plus existing logo/review assets.
New URLs work without generation,
but need new derivatives to receive the same size savings.

## Reference

[Next.js 15 Image documentation](https://nextjs.org/docs/15/app/api-reference/components/image)
explains `unoptimized` behavior. [React image documentation](https://react.dev/reference/react-dom/components/img)
documents eager-image preload behavior and the `picture` exception; the explicit
typed preload prevents duplicate format downloads. [MDN picture](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/picture)
documents browser format selection and fallback.
