# Product discovery improvements — 13 October 2026

Updated 13 live catalogue products and implemented contextual internal links for the nine previously linked only from shop and category pages. Product content changes are live in Supabase. This repository change supplies the guide and cross-link implementation; visitors receive it when the commit is deployed.

## What changed

- The Uttarakhand gift guide now resolves actual published products into five shopping contexts: devotional gifts, Rakhi gifts, wedding gifts, keychain keepsakes and Pahadi keepsakes.
- Relevant product pages link to companions and the corresponding guide section. These are standard anchors in server-rendered HTML, without a new client-side widget or additional images.
- Removed or unpublished products disappear from editorial links automatically. Canonical URL duplicates and links back to the current product are excluded.
- Guide links have a minimum 44px touch target, responsive columns, visible focus styles and heading offsets below the sticky header.
- Existing product URLs, categories, prices, stock and photographs were preserved. Saved catalogue descriptions also feed metadata and Product structured data.

## Seller-confirmed details

- Pahadi Topi: cotton, universal fit.
- Ittar: the seller corrected the earlier combined-set answer. Final pricing is ₹100 for each bottle, with four fragrance choices: Ante Hayati, Shanaya, Magnetic and Maruf Pink. The existing catalogue specifies a 5 ml bottle size.
- Customisable hamper: includes a clutcher with the other listed accessories, note, cork light and packaging. Contents can be changed, with the final price increasing or decreasing accordingly.

Other rewrites use the existing published specifications. Unknown measurements, candle burn times and similar facts were not invented. The Roli-Chawal bottle-height entry had no unit; shoppers are asked to confirm dimensions before ordering.

## Relevant language used

These phrases describe the actual items and shopping uses. They are not a measured search-volume list or a guarantee of indexing.

| Product | Descriptive phrases |
| --- | --- |
| Pahadi Topi | cotton Pahadi topi, Kumaoni-inspired cap, Uttarakhand souvenir |
| Guardian Bell keychain | metal-alloy keychain, evil eye charm, bike/car keys |
| Om bells | Om mandir/temple bells, 2-inch metal bells, set of two, pooja room |
| Mantra counter | digital finger tally counter, mantra chanting, jaap, minimum ten pieces |
| Ram Lalla idol | resin Shri Ram Lalla idol, car dashboard, home temple, devotional gift |
| Handmade Rakhi | handmade MDF rakhi, Raksha Bandhan, Rakhi gifting |
| Roli-Chawal | pooja thali, Rakhi ceremony, shagun, minimum two pairs |
| Ittar | alcohol-free ittar/attar, 5 ml bottle, named fragrances, per-bottle price |
| Wedding brooches | MDF Barati/Ladkiwale brooches, wedding party, minimum two pieces |
| Flower candles | actual colour, lavender/rose where supplied, soya wax where supplied, tea light, hamper/return gifts |
| Accessories hamper | customisable hamper, clutcher, personalised note, birthday/bridesmaid gifts, contents-dependent pricing |

## Verification

- Re-read all 13 database rows and compared the saved names, descriptions and specifications with the prepared changes. Prices and permanent URL fields matched the originals.
- Verified the 13 live production product pages, including their Product schema names, descriptions, prices and URLs.
- Audited all 63 preview routes: 48 product pages, four categories, correct canonical/schema checks, and unique page titles/descriptions.
- Compared the preview link graph with the earlier 13 October live audit: every one of the nine targeted products now has 4–6 distinct linking pages, compared with two before. See `link-comparison.json` for sources.
- Production build, TypeScript, targeted ESLint and the product-indexability checks passed. Additional checks exercise published-only contexts, canonical deduplication, removal of empty groups, exclusion of self-links and actual anchors in rendered guide/product HTML.
- Mobile and desktop visual checks cover the guide and a product-to-guide flow. Browser evidence is saved alongside this report.

`content-changes.json` contains the before/after catalogue fields for review and recovery. The database update checked original values and ran in one transaction, preventing partial changes or overwriting a concurrent edit.

## Research basis

The implementation follows [Google's ecommerce site-structure guidance](https://developers.google.com/search/docs/specialty/ecommerce/help-google-understand-your-ecommerce-site-structure) on crawlable category/product links and relevant cross-links, and [Google's helpful-content guidance](https://developers.google.com/search/docs/fundamentals/creating-helpful-content) on clear, accurate information for people. More keywords do not guarantee that a discovered URL will be crawled or indexed. Google still makes that decision after processing the pages.

No indexing requests or Search Console validation were submitted. The link improvements must be deployed before Google can see them.
