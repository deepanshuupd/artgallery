# Product page refinement

## Design decisions

- Remove the large information card. Keep the product, name, price and one primary action visually clear on the same warm canvas as the homepage.
- Keep full photographs uncropped in a reserved-ratio gallery. The gallery is top-aligned, not sticky or vertically centred in a row that grows when copy expands.
- Use native, consistently labelled description and details accordions. Content is already in server HTML, not loaded only after a tap. Keep visible summaries at least 62px high.
- Keep the active WhatsApp action green. Direct order remains a real disabled button, with a muted surface, lock and explicit Coming soon text. Do not invent urgency, customer reviews, delivery promises or stock claims.
- Reuse `products.story` for the editorial closing section. Admin's Product story / closing note field has a shared live preview; a blank value hides the section. Create/edit payloads and Supabase mapping already persist this field, so no migration is needed. The fixed brand tagline has been removed.
- Preserve existing canonical URLs, descriptions, Product/Offer markup and breadcrumbs. Good UX and structured data support discoverability, but do not guarantee rankings or conversion lifts.

## Research

- [Baymard: mobile product content and vertically collapsed sections](https://baymard.com/research-articles/avoid-using-subpages): consistent, informative labels improve scanning and avoid separate product-information subpages.
- [Baymard: avoid horizontal product-information tabs](https://baymard.com/research-articles/avoid-horizontal-tabs): keep important sections discoverable in the page's reading order.
- [Google: mobile-first indexing](https://developers.google.com/search/docs/crawling-indexing/mobile/mobile-sites-mobile-first-indexing): retain equivalent content on mobile and desktop; accordions may save space, but primary content must not require interaction to load.
- [Google: Product structured data](https://developers.google.com/search/docs/appearance/structured-data/product): keep product information accurate and present in the HTML.
- [Apple buying pages](https://www.apple.com/shop/buy-iphone) and [CRED](https://cred.club/): visual references for editorial hierarchy, restraint and a clear primary action, interpreted within KumaonRang's existing palette rather than copied.

## Checks

Run `npm run build`, `node scripts/check-product-story.mjs`, and `node scripts/check-storefront-seo.mjs http://localhost:3002` against a running production preview.

Also check gallery toggle stability, 320–430px phone widths, desktop layout, photo selection, the enquiry dialog and a hamper product in the browser. Live admin save verification requires an authenticated admin session; render-only tests never write product records.
