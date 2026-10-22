# Gift-guide SEO and mobile shopping — iteration 1

Implemented locally on 22 October 2026. Preview: `http://127.0.0.1:3021/uttarakhand-gifts`.

## Delivered

- Five photo-led guide examples selected from actual published, available catalogue products: Pahadi girl keychain, Golu Devta frame, Uttarakhand magnet, Aipan nameplate and Pichwai jar combo.
- Prices, names, photos, alt descriptions and immutable product links come from the existing catalogue, not manually maintained marketing prices.
- Explicit piece-based minimum quantities appear when the existing product helper identifies them. Delivery remains extra; no invented shipping or stock guarantees.
- Drafts, out-of-stock samples, missing photographs, invalid prices and unrelated replacements are excluded from featured examples. Category navigation remains if no eligible sample exists.
- Compressed existing WebP card variants, lazy image loading, reserved aspect ratios, uncropped photographs, keyboard focus states and normal crawlable anchors.
- A shorter mobile introduction and two-column phone layout, with three columns on desktop. Occasion recommendations use native details/summary, keeping their links and content in server HTML without extra client state. FAQs and cultural-guide links remain.
- Catalogue-derived Open Graph/Twitter imagery for the gift guide and all four shop category routes, using relevant real product images and supplied image dimensions when available.
- CollectionPage/ItemList metadata describes the same five visible examples; a representative primary image is included. No invented reviews, ratings or special-offer markup.
- The actual root App Router wrapper exports the metadata function and explicit static/60-second revalidation config. The homepage, database, storage, product records and Google account settings were not changed.

## Verification

Story: visitor opens the guide → server reads the cached published catalogue → pictured examples and current prices render in HTML → product anchor opens the matching product/order page. Metadata uses the same data source.

- `node scripts/test-gift-guide.mjs`: passed selection, exclusions, current price changes, minimum quantity, server-rendered images/anchors, empty-catalogue behaviour, canonical and social metadata, category previews, matching structured data and the root route export.
- `node scripts/test-gift-guide.mjs http://127.0.0.1:3021`: passed against the running preview. Guide 200, five lazy photos, five matching schema items, four category preview images, all five product links 200 with matching product prices (₹80 / ₹1,400 / ₹120 / ₹600 / ₹299 at test time).
- TypeScript and targeted ESLint checks passed; whitespace/diff check passed.
- Production build passed with live network access, without the restricted-environment catalogue revalidation errors seen in the first sandboxed attempt. Gift guide remains statically rendered with 60-second revalidation. No new client component or animation library was introduced.
- Browser: all five images loaded; canonical and Open Graph image present; two columns at 320px and 390px, three at 1280px; no horizontal overflow at those tested widths. Golu frame link opened the correct product at ₹1,400. Wedding recommendations expanded and exposed real product links.
- Screenshots: `/tmp/kumaon-gift-guide-mobile-2026-10-22.png` and `/tmp/kumaon-gift-guide-desktop-2026-10-22.png`. Temporary viewport override was reset after testing; guide preview left open.

### Existing test limitation

`scripts/test-product-indexability.mjs` fails at its assertion “Important facts are server-rendered before ordering”. Running that test with its local TS/TSX modules loaded from untouched Git HEAD reproduces the same failure. The product details route places “At a glance” after the ordering heading. No product layout was changed in this iteration; do not describe the whole pre-existing suite as green. The new focused guide test and integration checks pass separately.

## Boundaries and follow-up

- No indexing request, sitemap resubmission or service configuration change was performed. The user separately approved committing and pushing this iteration on 22 October; publication follows that approval. Existing unrelated audit/follow-up documentation was left alone.
- The Next.js generated route-types reference was restored after build verification so it does not become an unrelated source diff.
- The Supabase skill informed reuse of the existing published-catalogue read, without database/storage/auth mutations. The React checklist kept the presentation server-rendered, and the verification skill guided catalogue-to-browser/product testing.
- Bundled Next.js docs were absent from this checkout. Verified metadata and image behaviour against the official Next.js 15 docs, matching installed Next.js 15.5.19: https://nextjs.org/docs/15/app/api-reference/functions/generate-metadata and https://nextjs.org/docs/15/app/api-reference/components/image.
- Real Aipan-pattern keychain listings still require accurate catalogue/product information; no existing unrelated character keychain was renamed or fabricated.
- Image metadata helps communicate relevance but cannot guarantee a Google thumbnail or ranking improvement. No fresh Lighthouse score or conversion uplift is claimed. After deployment, assess complete Search Console windows after recrawling and measure buying outcomes separately from search clicks.
