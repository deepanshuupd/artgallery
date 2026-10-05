# KumaonRang regional redesign — 5 October 2026

Implemented locally in the existing working tree. No commit, push, deployment, database update or external order message was made in this work. Earlier homepage/shop/SEO edits were preserved.

## Product and ordering experience

- Mobile layout: compact category/name/price, complete uncropped photograph, visible thumbnail rail, useful introduction and ordering area. Desktop uses a gallery and summary aligned at the top.
- Cloud white, mountain slate, cedar teal and blue mist distinguish the product page from the lilac shop. Apricot supports saved product stories; muted Aipan-inspired linework appears selectively.
- Gallery uses horizontal scroll snapping and labelled thumbnail controls. An accessible full-screen photo viewer supports previous/next, Escape and focus restoration. Original product photographs and their metadata remain intact.
- Full descriptions and saved specifications are readable below the purchase composition. The fixed-height accordion and its internal scroll area were removed. Product information is still server rendered.
- A disabled, locked “Direct order · Coming soon” button is retained below WhatsApp ordering, as requested. Quantity and the WhatsApp action lead into a native mobile bottom sheet / desktop dialog. The optional message preview, subtotal and request field remain. Listed sets are labelled “per set”.
- Quantity persists between the page and sheet. Product subtotal excludes unconfirmed delivery/customisation charges. The sheet opens a WhatsApp conversation; it does not present the request as a completed sale.
- Mobile order bar appears after the original order area has passed above the viewport. It is hidden during order/photo dialogs. Safe-area padding protects the bottom control.
- Accurate stock state, availability enquiries, saved stories and related category links remain. No product specifications, reviews, customisation guarantees or delivery promises were invented.

## Homepage origin and border

The map replaces the rotating craft wheel in the existing origin section after hampers. It shows the complete state and a Kumaon fill, with a marker identifying Pithoragarh district. Mobile stacks the complete illustration above the story; desktop uses two columns.

All thirteen Uttarakhand district polygons were merged offline; the six Kumaon districts were separately merged. Membership was checked with the Kumaon and Garhwal administrations. The reusable geometry comes from DataMeet Census 2011 districts under CC BY 2.5 India; the silhouette was visually compared with Survey of India’s 2026 state map. It is simplified administrative artwork, not a survey-accurate or navigational map. Source/license credits are visible under the map; source hashes are recorded in map-source-manifest.json.

The brief fill/marker reveal runs once using the existing homepage observer. The complete map remains available without JavaScript and in reduced motion. A thin original diamond/line/dot repeat is informed by the owner's artwork, rather than copying the watermarked or AI-modified Pinterest references. It accompanies saved product stories, a fine 10px line below the shared navigation, and the homepage origin section. The origin copy is one heading, one paragraph and one “Meet Sneha” link; extra labels, slogans, legend, compass and shopping actions were removed. Geographic labels, source attribution and the once-only Kumaon highlight remain. The floating studio offer is hidden while the origin section is on screen, preserving the offer elsewhere without covering the map.

## Shop refinement

The pine photograph and video were removed from both the shop and category routes following owner feedback. The catalogue now uses a compact introduction without a decorative scene or extra browse button. The catalogue colours, filters, search, sorting and product photography remain. No footage or poster is requested by these pages, and the forest controller is no longer part of their route dependency tree. Unreferenced, attributed media assets and controller files remain on disk for recoverability.

Product purchase slogans, decorative arrows, contact badge, the three-step ordering section and redundant product-information eyebrow labels were removed. The purchase heading is “Order details”; the gallery has plain text controls. The product information remains readable below the main purchase area. Related products use a direct heading and links without decorative arrows.

Earlier asset-budget/forest-bundle reports and screenshots describe the initial implementation and are historical; the `refined-*` screenshots show the accepted feedback implemented locally.

## Verification

- Final Next 15.5.19 production build completed, with public catalogue network access; no build warnings/errors.
- TypeScript and scoped ESLint passed. git diff --check passed after restoring the build-generated next-env.d.ts reference.
- Existing product indexability, image SEO, saved story, homepage atmosphere, customer notes and collection-journey regressions passed. The obsolete wheel-specific assertion was removed because the wheel was intentionally replaced.
- New behavioural tests: 7 forest-controller cases covering deferred sources, breakpoint selection, reduced motion, data saving, visibility, errors and cleanup; 3 dialog cases covering initial focus, Tab containment and dismissal cleanup.
- Production HTTP audit: 60 public pages, 48 product pages, 60 unique titles/descriptions, correct canonical/OG URLs, schemas, public sitemap, 404 handling and admin noindex. Image audit: 110 gallery images across 47 photographed products; all full images/alt/schema/sitemap relationships passed.
- Chrome production preview inspected at 320, 390, 430, 768 and 1440px product widths: one H1, no document horizontal overflow, phone heading sizes 25–28px. Map checked at 320/390/430px with no overflow. Portrait photos, long product name, all four bell thumbnails and keychain desktop layout were visually checked.
- Order sheet: quantity carry-over, subtotal, optional message preview, full-screen photo navigation, Escape/focus restoration, reverse Tab containment and mobile order bar verified. No WhatsApp handoff was sent.
- Initial forest playback checks are historical; the forest is now absent from both shop and category routes. No video performance claim applies to the refined design.
- Fresh production-preview browser log inspection captured no console errors. Earlier development warnings about future Next 16 image qualities and unrelated browser-extension warnings were not treated as production app failures.

## Remaining verification after release

Actual iPhone/Safari, low-end Android and throttled network profiling remain necessary before claiming LCP/CLS/INP or smoothness on every device. No Lighthouse or field Core Web Vitals score is claimed here. Asset bytes and visibility controls alone do not prove device performance. This work did not measure conversion uplift or completed sales. Existing platform usage and hosting eligibility remain as identified in the research report; no paid subscription or hosting change was made.

## Previews

- product-mobile.jpg — compact identity, full photo, ordering area.
- product-desktop.jpg — aligned gallery and summary.
- order-sheet-mobile.jpg — bottom sheet and keyboard focus state.
- home-origin-mobile.jpg / home-origin-desktop.jpg — map, story and border.
- refined-shop-mobile.jpg / refined-shop-desktop.jpg — compact shop introduction and catalogue.
- refined-product-mobile.jpg / refined-product-desktop.jpg — simplified purchase controls with locked direct order.
- refined-home-origin-mobile.jpg / refined-home-origin-desktop.jpg — simplified map and origin copy.

Local production preview: http://127.0.0.1:3013/

Source references: https://kumaon.gov.in/about-department/introduction/ ; https://garhwal.uk.gov.in/ ; https://surveyofindia.gov.in/pages/state-maps ; https://github.com/datameet/maps/tree/master/Districts/Census_2011 ; https://www.pexels.com/video/sunlight-filtering-through-pine-tree-branches-34396273/ ; https://www.pexels.com/license/ .

## Final refinement checks

The final production build and scoped ESLint passed after the owner’s simplification feedback. Product indexability, saved story, homepage atmosphere, customer notes and dialog checks passed. Chrome checks at product widths 320/390/430/768/1440px and map widths 320/390/430px found no document horizontal overflow. Direct order is disabled at each tested product width. Quantity 2 for the ₹60 bell set produces a ₹120 subtotal in the order sheet. Shop DOM contains no video or pine poster; map view hides the floating studio note. Final screenshots are named `refined-*`; detailed width checks are in refinement-verification.json. No WhatsApp handoff, push or deployment was made.
