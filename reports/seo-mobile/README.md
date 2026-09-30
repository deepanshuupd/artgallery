# Iteration 1 verification — 30 September 2026

This is a **local production preview**, not a new live deployment. Branch: `codex/seo-mobile-polish`.

## Checks

- Production build and TypeScript validation pass.
- Repeatable audit: `node scripts/check-storefront-seo.mjs http://localhost:3001 https://www.kumaonrang.com reports/seo-mobile/seo-audit.json`.
- All 58 sitemap URLs return 200 and have one H1, unique titles at most 60 characters, unique descriptions at most 160, correct canonical paths/hosts and matching Open Graph URLs. Unknown categories return 404; admin login is noindex.
- Four collection landing pages and 47 distinct product URLs verified. Products have Product/Offer schema; products and collections have BreadcrumbList schema. JSON parsing checks syntax, not Google's rich-result eligibility.
- Search for `golu` returns one product. A nonexistent query returns a clear-search action and enquiry alternative. Clearing restores the catalogue. Ascending-price sorting verified across all rendered prices.
- Category navigation goes to a dedicated page and displays the correct six keychains. A card opens the expected product and browser Back returns to its category. No WhatsApp message or contact form was submitted.
- Category controls at least 44px tall and no document-wide horizontal overflow at 320, 390, 430, 768 and 1280px.
- Main public pages (home, collection, three other categories, About, Contact, hampers and two guides) checked for overflow at 320 and 1280px. This is not a claim that every possible interaction is already perfect.

## Clean mobile Lighthouse

Final production shop audit with extension-free headless Chrome, simulated mobile/slow network:

| Category / metric | Result |
| --- | --- |
| Performance | 91 |
| Accessibility | 100 |
| Best practices | 100 |
| SEO | 100 |
| LCP | 3.5s |
| TBT | 40ms |
| CLS | 0 |

The initial run scored 89 performance. Final scores vary by run; LCP still needs improvement against the 2.5s target. No ranking improvement is asserted from this laboratory score. Analytics is rendered only on Vercel, avoiding its unavailable endpoint in the local preview while retaining deployed analytics.

## Next iteration / known data limitations

- Two records share `aipan-frames/om-aipan-wall-decor`; 48 catalogue records currently produce 47 distinct URLs. Audit the records and preserve existing URLs with redirects before changing slug behaviour.
- `Pahadi Happy Couple Fridge Magnet` has no source photograph. The catalogue shows an honest placeholder; its Product schema cannot supply a missing image. Obtain the real photograph, not a fabricated substitute.
- Product detail pages retain their existing motion-heavy gallery, tiny carousel dots and redundant back link. These are iteration 2, alongside product-specific facts, clearer enquiry flow and additional mobile testing.
- Actual shipping, returns, lead times and verified customer material are needed for trust/content work. Do not invent them.

Screenshots: `category-mobile.png` and `category-desktop.png`.
