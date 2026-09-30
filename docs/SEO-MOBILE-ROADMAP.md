# KumaonRang: search visibility and mobile storefront roadmap

Updated 30 September 2026. Preserve the approved homepage and real product photography. Build a distinctive, useful Kumaoni shop, not a generic luxury template. Rankings depend on competition, indexing, content, links and customer behaviour; no position or keyword difficulty is guaranteed.

## Research and audit

- [Aipankari](https://aipankari.com/) combines craft storytelling with specific shopping categories, custom work, artisan content and purchase policies.
- [Uttarakhand Haat's Aipan collection](https://uttarakhandhaat.com/product-category/aipan-art/) has a dedicated category with a large product catalogue and individual product links. Compete with specificity and a clear maker identity rather than catalogue size.
- Aipan Art Shop and Aipan Vatika surfaced in search, but their page content was not reliably retrievable; no detailed visual conclusions are drawn from them.
- The deployed shop, About, Contact, hampers and product pages inherited the homepage canonical and social metadata. Four category paths had product URLs but no category landing page.
- The shop repeated two actions on each card and animated every card. Product photographs were cropped into squares. These are unnecessary distractions on a phone.
- Existing data has duplicate public product slugs and at least one product without a photograph. Do not silently rename records: audit affected URLs and plan redirects before a data migration.

Our positioning: real keepsakes from Pithoragarh, Sneha's small-business story, honest Aipan-inspired products, useful descriptions, full product photography and uncomplicated enquiries.

## Iterations

| Iteration | Scope | Deliverable / acceptance |
| --- | --- | --- |
| 1 — Search foundations and browsing | All public page metadata; four category landing pages; product/Breadcrumb structured data; sitemap; collection cards, search and sorting | Correct self-referencing canonicals, unique titles/descriptions, crawlable category links, clear two-column mobile catalogue and no invented reviews |
| 2 — Product confidence and ordering | Product detail pages and related pieces | Lightweight swipe-friendly gallery, visible price and options, useful product-specific details, accessible enquiry action, easy return to the collection; resolve duplicate slugs with permanent redirects only after inspecting records |
| 3 — Consistent brand across every page | About, Contact, hampers, Uttarakhand gifts and Aipan guide; header/footer | Compact mobile layout, consistent editorial typography, real maker story, clear enquiry expectations, no huge empty sections or excessive decorative cards |
| 4 — Helpful content and trust | Maker/process content, genuine customer stories and confirmed business policies | Explain materials, sizes, care, customisation and lead times where verified. Obtain actual shipping/returns terms and permission for customer images; never fabricate guarantees, reviews or a physical shop |
| 5 — Measure and improve | Search Console, Bing, clean Lighthouse and enquiry funnel | Track impressions, queries, clicks and enquiries. Use actual search data to expand relevant pages, not repetitive city/keyword doorway pages |

## Initial search intent map

| Page | Main intent | Supporting phrases to validate in Search Console |
| --- | --- | --- |
| `/pahadi-keychains` | Pahadi keychains | Kumaoni keychains, Uttarakhand keychains, Pahadi keepsakes |
| `/aipan-frames` | Aipan art frames | Kumaoni wall art, Aipan-inspired gifts, Uttarakhand art frames |
| `/uttarakhand-souvenirs` | Uttarakhand souvenirs | Pahadi fridge magnets, Kumaon souvenirs, Uttarakhand magnets |
| `/kumaoni-gifts` | Personalised Kumaoni gifts | Pahadi gifts, personalised gifts from Uttarakhand |
| `/curated-hampers` | Curated gift hampers | Birthday gift hampers, wedding gift hampers, personalised gift boxes |
| `/pithoragarh-aipan-art` | Learn about Aipan and its local connection | Aipan art Pithoragarh, Kumaoni Aipan art |
| `/uttarakhand-gifts` | Choosing a gift with a regional connection | Gifts from Kumaon, handmade Uttarakhand gifts |

These are relevant intent clusters, not measured low-difficulty keywords. Avoid cannibalisation: a guide explains the craft, a category helps someone shop, a product describes one actual piece.

## Release gates

- Test 320, 390 and 430px phones, tablet and desktop: no page-wide horizontal overflow, legible text, no hidden primary actions. Aim for 44px controls and visible keyboard focus; horizontal category navigation is intentional.
- Preserve reserved image space and full-image visibility. Use appropriate responsive sizes and modern compression, not format conversion alone.
- Clean, extension-free mobile production audits: aim for performance 90+, CLS below 0.1 (ideally zero), LCP below 2.5s and TBT below 200ms. Scores vary; compare multiple equivalent runs. A 100 Lighthouse SEO score is not a ranking guarantee.
- One meaningful H1, unique metadata within the requested editorial 60/160-character budgets, canonical and Open Graph URLs agreeing, noindex for private/admin and empty categories. Google may rewrite titles/descriptions; these budgets are not Google's fixed limits.
- Product and Breadcrumb JSON-LD must match visible facts. No invented ratings, shipping terms, stock urgency or checkout features. WhatsApp ordering does not automatically qualify the site for every merchant listing feature.
- Test search, sort, empty results, category navigation, product navigation and browser back. Do not send test enquiries to Sneha.
- Keep every available product crawlable in server-rendered HTML; do not hide the catalogue behind client-only filters or pagination without links.

## Primary guidance

- [Google: ecommerce site structure](https://developers.google.com/search/docs/specialty/ecommerce/help-google-understand-your-ecommerce-site-structure)
- [Google: ecommerce URLs and canonicals](https://developers.google.com/search/docs/specialty/ecommerce/designing-a-url-structure-for-ecommerce-sites)
- [Google: product structured data](https://developers.google.com/search/docs/appearance/structured-data/product)
- [WCAG: minimum target size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)
- [Next.js 15 metadata API](https://nextjs.org/docs/15/app/api-reference/functions/generate-metadata)

The repository requests bundled Next.js documentation, but `node_modules/next/dist/docs/` is absent in the installed version. Official version-specific documentation was used instead.
