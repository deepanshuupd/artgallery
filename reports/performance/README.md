# KumaonRang performance work — 30 September 2026

## Findings

The supplied Lighthouse run scored 48 and warned that browser extensions affected it. An independent extension-free mobile audit of the live site scored 66. The main confirmed issues were a global loading placeholder moving the footer (CLS 0.293), unnecessary route prefetching, oversized image downloads, and the description being streamed outside the initial head.

Next.js was already optimizing JPEG/PNG sources for delivery. Converting originals alone would not fix blocking JavaScript or layout shifts.

## Image migration (applied to Supabase)

- 48 products inspected; 47 products had images and were updated.
- 110 unique images converted: 363,156,925 bytes → 20,135,468 bytes (94.46% smaller active source assets).
- WebP quality 82, maximum dimension 1600 px, no upscaling, EXIF orientation corrected, transparency retained.
- All new objects were checked for public readability and `image/webp` before product links changed.
- Original storage objects were not deleted. Total bucket usage therefore increases by the size of the new copies; this is a delivery improvement, not a storage cleanup.
- The existing product “Pahadi Happy Couple Fridge Magnet” has no image references; there was nothing to convert for it.

`image-migration-2026-09-30.json` records original and replacement URLs. It contains public catalog data, not credentials.

To restore original product references, run from the repository with the existing server environment configured:

```sh
node scripts/optimize-product-images.mjs --rollback /Users/deepanshuupadhyaya/Desktop/Workspace/Sneha/reports/performance/image-migration-2026-09-30.json
```

Rollback refuses to overwrite image references that have subsequently changed. It does not delete either set of storage objects. Preparation paths in the manifest are temporary; rollback does not need those local files.

## Code changes (not deployed)

- Public catalog cache and homepage regeneration every 60 seconds, with authenticated cache refresh after admin changes.
- Removed the global 60vh spinner boundary so the footer cannot paint above incomplete homepage content. The reusable loading component remains in `src/app/loading.tsx`.
- Corrected homepage metadata export; metadata is emitted in the head on all routes.
- Hero image high fetch priority; more accurate responsive image sizes; quality 70 for homepage delivery; AVIF/WebP negotiation.
- Disabled speculative prefetching on storefront navigation and homepage links, avoiding downloads of unused pages and animation code.
- Future admin uploads resize and compress to WebP before upload, use unique immutable filenames and long-lived caching.

## Verification

Both audits use Lighthouse 13.5.0, emulated mobile / Slow 4G, with browser extensions disabled. **Before is the live Vercel site; after is a local production build. Different hosting environments mean this is not an identical-environment benchmark or a guaranteed deployed score.**

| Metric | Live production before | Local production after |
| --- | ---: | ---: |
| Performance | 66 | 92 |
| SEO | 92 | 100 |
| First contentful paint | 1.1 s | 1.0 s |
| Largest contentful paint | 3.9 s | 3.3 s |
| Total blocking time | 247 ms | 52 ms |
| Cumulative layout shift | 0.294 | 0 |
| Speed index | 3.9 s | 1.0 s |

After: accessibility 100, best practices 96. There are still image-delivery opportunities (estimated 31 KiB), and LCP needs a deployed retest; it is not yet below the 2.5-second good threshold.

Production build and TypeScript checks passed. Upload preparation was checked for portrait/landscape resizing, no upscaling, WebP type/quality, cleanup and unreadable-file errors. Mobile navigation and 320/390px overflow were checked, and the compressed product photos were visually reviewed.

The two JSON Lighthouse reports retain the audit detail. Re-run against `https://www.kumaonrang.com/` after deploying the code, preferably with extensions disabled. Do not assess production speed from `next dev`.

## References

- [Next.js 15 Image component](https://nextjs.org/docs/15/app/api-reference/components/image)
- [Next.js 15 loading boundaries](https://nextjs.org/docs/15/app/api-reference/file-conventions/loading)
- [Next.js 15 cache API](https://nextjs.org/docs/15/app/api-reference/functions/unstable_cache)
- [Supabase storage upload options](https://supabase.com/docs/guides/storage/uploads/standard-uploads)
