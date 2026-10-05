# KumaonRang: an illustrated dusk shop

Date: 5 October 2026

Status: implemented locally. Initial build, source and local production HTTP checks passed. Subsequent product corrections and Chrome responsive checks are recorded in [the product layout follow-up](product-layout/fixes-2026-10-05.md).

## Design direction

The shop has a distinct woodland setting: an original vector panorama of layered hills, deodar and pine silhouettes, mist and a restrained amber sun. Cool indigo and lavender define the browsing environment; cedar tones appear in the landscape and supporting accents. Product photographs and reading surfaces stay light and clear.

The redesign changes the page composition as well as its colours. The shop uses an illustrated introduction and a practical browsing workspace. Category navigation forms a sidebar on desktop and a horizontal rail on mobile. Following customer feedback, product pages lead with the gallery on phones and use one aligned product/enquiry panel on desktop, with related pieces from the same category.

The catalogue still represents Aipan frames, Pahadi keychains, souvenir magnets and selected gifts. The forest suggests the broader landscape of Kumaon, while the actual products supply their own reds, yellows and other colours.

## Research and creative references

- The [Government of Uttarakhand's forest description](https://pauri.nic.in/forest/) identifies both chir pine and deodar in the region. Deodar provides the cedar reference; chir pine is a distinct tree. The artwork and exact colours are a creative interpretation of the landscape, not an official regional palette or botanical guide.
- [NN/G's visual hierarchy research](https://www.nngroup.com/articles/visual-hierarchy-ux-definition/) describes how relative contrast, saturation, scale and grouping guide attention. The implementation separates atmospheric scenery from practical controls and product information.
- [NN/G's category and listing page research](https://www.nngroup.com/articles/ecommerce-homepages-listing-pages/) supports clear categories, meaningful names, useful photographs and visible prices. The redesigned workspace keeps those choices accessible instead of requiring shoppers to explore a decorative scene to find them.
- [NN/G's product page research](https://www.nngroup.com/articles/ecommerce-product-pages/) supports useful images and descriptions, visible price and availability, and a clear purchase route. The product heading and enquiry panel make these jobs explicit.
- [W3C's minimum contrast guidance](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) specifies 4.5:1 for ordinary text and 3:1 for qualifying large text. Plain reading surfaces and a protected text area over the landscape make those combinations more predictable. Numeric verification is recorded below, separately from visual testing.

The following are creative references, not conversion studies or copied asset sources:

- [Olly Moss's Firewatch work](https://ollymoss.com/firewatch), alongside the [official Firewatch site](https://www.firewatchgame.com/), provides a reference for stylised wilderness composition. KumaonRang's illustration uses original shapes and a different cool palette; no Firewatch assets are reused.
- [Boreas Design Shop](https://boreasbrand.com/) and [its catalogue](https://boreasbrand.com/collections/all) connect illustrated landscapes with place-based souvenirs, clear regional groupings and practical shopping controls.
- [Atomicchild](https://atomicchild.com/) is an artist-led outdoor brand with explicit collections and product prices, useful as a reference for keeping an expressive identity compatible with direct browsing.

No colour is assumed to produce trust, engagement or sales automatically. The references inform hierarchy and composition; this site's conversion effect would need customer feedback or measured behavioural testing.

## Colour roles

Shared shop and product tokens are scoped through `src/components/products/forest-storefront.module.css`.

| Role | Value | Purpose |
| --- | --- | --- |
| Dusk ink | `#303650` | Main text and product names |
| Indigo action | `#394463` | Selected navigation and shopping links |
| Mist lavender | `#F0EFF6` | Browsing environment |
| Cedar blue-green | `#315C61` | Supporting cultural and story accents |
| Amber | `#E8C384` | A small sun and warm decorative accent |
| Supporting copy | `#555B70` | Descriptions, captions and secondary information |
| Light reading/photo surface | `#FFFEFD` | Product photographs, cards and enquiry panel |
| Pale lavender panel | `#E9E6F0` | Gallery surround and supporting sections |
| Control border | `#777A91` | Search, sorting and navigation boundaries |

Supporting copy, borders, hover states and pale panels complete the system. Product photo wells remain near white. The forest is not painted over photographs: real artwork colours are retained, and images use `object-fit: contain`.

## Original vector art

`public/illustrations/kumaon-dusk-forest.svg` contains an original authored landscape. Its layered ridges, reused deodar/pine symbols, mist bands and amber sun create a recognisable forest panorama, rather than a small faint corner ornament. The asset is approximately 4.1 KB at the initial source inspection. Its separate illustration colours include distant lavender hills (`#B7B9D1`), blue-grey ridges (`#91A0B8` to `#60758B`) and deep foreground trees (`#293D53`).

The illustration is decorative. Text, navigation and shopping information remain HTML content. It has no interactive hotspots, animation loop or parallax. The page uses a static SVG and CSS, without an illustration library, new third-party scripts or heavy raster background photographs.

Unlike the earlier treatment's inline-only corner motif, the full panorama is one small local SVG request. Existing product photographs and fonts remain the main media resources. No measured improvement in Core Web Vitals is claimed from this design alone.

## Shop and category structure

- `/collection` has a distinct illustrated introduction with a direct route to the catalogue.
- `/pahadi-keychains`, `/aipan-frames`, `/uttarakhand-souvenirs` and `/kumaoni-gifts` share the new browsing system and retain their useful guide and question content.
- Category navigation displays actual catalogue totals. Search results have their own live result announcement, so the category totals and current matches serve different purposes.
- On desktop, the category list sits beside the search, sort and product workspace. On mobile, it becomes a horizontal navigation rail above the workspace.
- Product cards retain meaningful names, actual prices, explicit out-of-stock wording and direct links to their canonical detail pages. The lighter image wells preserve the visible details of red-and-white Aipan art and small keychains.

## Product page structure

- Mobile reading order begins with the full photograph gallery, then the compact product heading, price and enquiry panel.
- Desktop uses a larger gallery alongside one aligned panel containing the product heading and enquiry information.
- Stock remains an explicit text statement. The existing WhatsApp flow remains the available enquiry/order route; the direct-order control stays disabled and labelled as coming soon.
- Product description and details use accessible animated disclosure buttons inside a stable scrollable information area. Actual story content appears when present.
- Related products from the same category create a practical onward browsing route rather than an illustrated dead end. No invented ratings, delivery promises or product claims are added.
- Canonical URLs, product metadata, JSON-LD, catalogue values and stock semantics are retained.

The dedicated curated-hamper listing and homepage retain their existing route treatments. Individual hamper products using the shared product detail template receive the product-page design.

## Mobile, accessibility and performance protections

- Product content and shopping controls remain readable without interacting with the forest artwork.
- The mobile illustration framing keeps the forest recognisable while leaving a readable area for the heading. Its visual balance still requires a real browser check.
- Selected categories retain labels and `aria-current`; state is not conveyed only by colour. Focus indicators remain explicit.
- Search and sort controls keep labelled, usable targets; category links, thumbnails and ordering controls retain their accessible semantics.
- The gallery keeps swipe/scroll-snap behaviour, visible thumbnails and an image count when multiple photographs exist. Reduced-motion handling remains in place.
- Product names can wrap, detail panels use `min-width: 0`, and photographs fit inside their wells without forced cropping.
- No additional animation library, font, third-party script, decorative raster image or background-scroll event loop is introduced.
- Existing client filtering, gallery navigation and WhatsApp ordering continue. Category counts and related products use actual catalogue data.

## Affected files

- `public/illustrations/kumaon-dusk-forest.svg`
- `src/components/products/forest-storefront.module.css`
- `src/components/products/forest-canopy.tsx`
- `src/app/collection/page.tsx`
- `src/app/[category]/page.tsx`
- `src/app/[category]/[slug]/page.tsx`
- `src/components/products/product-showcase.tsx`
- `src/components/products/product-card.tsx`
- `src/components/products/product-detail-view.tsx`
- `src/components/products/product-detail.module.css`
- `src/components/products/collection-guide.module.css`
- `src/components/products/product-story.module.css`

## Verification

| Check | Result | Scope and limits |
| --- | --- | --- |
| Production build | PASS | Next.js 15.5.19. Build estimates show 119 KB first-load JavaScript for shop/category routes and 121 KB for product routes. These are bundle estimates, not Core Web Vitals measurements. |
| TypeScript | PASS | Type checking completed. |
| Targeted ESLint | PASS | Changed source files checked. |
| CSS parsing | PASS | Five changed CSS modules parsed successfully. |
| Product indexability and story regressions | PASS | Existing regression checks completed. |
| Local production HTTP and SEO | PASS | Live-catalogue check covered 60 public sitemap pages, including four category routes and 48 product pages. All 60 titles and descriptions were unique. This does not establish Google's indexing status. |
| Shop structure and category counts | PASS | 41 shop pieces: six keychains, 12 frames, five magnets and 18 gifts; seven hampers remain separate. Totals matched actual cards across all four category routes, with one category navigation and one selected category. Served CSS included the dusk palette and 184px desktop sidebar. |
| Product structure and related links | PASS | All 48 product pages had one main element and name → gallery → enquiry document order. Each showed one to three unique real public related-product URLs, excluding the current product. This verifies rendered HTML structure, not visual positioning or interactive behaviour. |
| Image map coverage | Verified | 48 products checked; 47 had photographs. The map contained 110 gallery photographs and 110 unique image URLs. The no-photo product retains its fallback rather than an invented image. |
| SVG XML validation | PASS | `xmllint` accepted the original illustration. |
| Served illustration | PASS | HTTP 200, `image/svg+xml`, 4,126 bytes. |
| Declared opaque colour combinations | PASS | All 41 checked pairs passed their thresholds. Lowest checked text contrast: 5.47:1; lowest checked essential UI contrast: 3.69:1. These are source-derived colour checks, not a browser accessibility audit. |

Contrast evidence: [shop-forest-contrast-2026-10-05.json](shop-forest-contrast-2026-10-05.json).

Rendered structure evidence: [shop-layout-verification-2026-10-05.json](shop-layout-verification-2026-10-05.json).

Local preview: [shop on port 3013](http://127.0.0.1:3013/collection). The preview requires the local production server to remain running.

**Initial visual browser QA was blocked.** After the user explicitly selected Chrome for the product corrections, browser access became available. The [follow-up verification](product-layout/fixes-2026-10-05.md) records actual responsive product-page checks, screenshots, accordion stability and order-dialog focus behaviour. Earlier verification rows above describe the initial redesign snapshot, including its previous product reading order; the follow-up supersedes that product layout. The shop illustration's own visual review remains outside these product checks.
