# KumaonRang customer wall and release verification

## Direction

The chosen design is a living customer wall: a contrasting geru-red section after the collection, with real customer photographs, unboxed quotations and two slowly moving rows. It acknowledges the Instagram business that preceded the website. There are no customer totals, manufactured ratings, initial-avatar pills, invented photographs or review pop-ups. The repeat needed for a seamless CSS loop is hidden from accessibility APIs and inert; it does not represent additional customers.

Other directions considered were a static editorial photo spread and an inbox-style screenshot collage. The first was less lively; the second made private-message UI dominate the brand and increased image weight. The selected wall keeps the actual message evidence on an ordinary, server-rendered `/customer-stories` page, inside native disclosures.

Research informing this direction:

- [Baymard: authenticity and DTC reviews](https://baymard.com/research-articles/user-reviews-dtc) — preserve real evidence and distinguish its source rather than presenting invented verification or ratings.
- [Baymard: DTC informational needs](https://baymard.com/research-articles/dtc-users-informational-needs) — connect the products to the people and business behind them.
- [W3C: pause, stop, hide](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide) — an explicit pause control for automatic movement.
- [web.dev: animation guidance](https://web.dev/articles/animations-guide) — transform/opacity rather than layout-changing animation.
- [Next.js 15: Server and Client Components](https://nextjs.org/docs/15/app/getting-started/server-and-client-components) — server-render the words/photos and isolate browser behaviour in a small client component. The repository's suggested `node_modules/next/dist/docs/` directory is absent in installed Next 15.5.19, so the versioned official documentation was used.

## Readability refinement

Customer names are now 14px/600 weight; source descriptions such as “Includes forwarded feedback” are 13px with comfortable line spacing, at both phone and desktop sizes. The same refinement applies to attribution on the stories page. Supporting intro, permission text, links and motion controls were also enlarged.

Against `#813c2d`, names use `#fffaf1` (7.72:1) and supporting text uses `#fff0e1` (7.18:1). A regression test protects both mobile-base font sizes and at least 7:1 contrast. This exceeds the [W3C minimum contrast requirement for normal text](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html); readable sizes are important in addition to numerical contrast.

## Genuine evidence and privacy

- Nine distinct notes from the supplied screenshots; the second Sargam screenshot was not counted as another customer.
- All displayed excerpts retain the received wording. Ankita's forwarded feedback and keychain design feedback are labelled as such; no unsupported verified-purchase claim.
- New redacted customer names stay private. Headers, phone numbers, shipping/tracking details and the nameplate's house identifier are excluded.
- Twelve inspected derivatives are stored in the existing public `product-images/customer-notes/v1` Supabase folder with content-hashed filenames. Original screenshots were not uploaded. No storage-policy or database changes.
- Nine evidence crops are lossless WebP and locally tested pixel-identical to the approved source crops. Three photographic derivatives are compressed WebP, metadata-free, approximately 121 KiB combined. The homepage does not load the large message screenshots.
- No new runtime dependencies. CSS handles motion; an IntersectionObserver pauses offscreen, document visibility pauses background tabs, and reduced-motion preferences disable movement. A Resume-focus issue found during testing was corrected.

## Verification before pushing main

- Production build passed compilation, lint/type validation, page generation and tracing.
- Six regression scripts: 22 Node tests passed, including seven customer-wall tests; image form/SEO/upload scripts also report their isolated workflow groups passing. Studio-postcard and product-story render checks passed.
- Production SEO audit: 59 public pages, unique titles/descriptions, expected canonicals/Open Graph URLs, one H1, valid unknown-route 404 and admin noindex checks passed.
- Production image audit: valid XML sitemap, 47 product pages, 46 with photos, 109 described gallery images, matching sitemap/schema/visible-image URLs, thumbnail alt text and homepage share image checks passed. One catalogued product has no photograph and uses the existing intentional fallback.
- Browser checks against the production build on localhost:3001: 320px and 390px phones, 768px breakpoint and normal desktop. No horizontal overflow in inspected main routes; no captured browser console errors or framework error overlay.
- Mobile menu-to-shop navigation closes correctly; product search and sorting work; featured product navigation, gallery selection and details disclosure work.
- Homepage Pause/Resume works while the control retains focus; photos load from public storage. Nine customer-story articles render; closed evidence images initially remain unloaded/lazy; opening the original frame message loads the correct crop.
- Home, About, Contact and Hampers inspected at 320px. Customer attribution and original-message disclosure inspected at 320px/390px, and homepage typography inspected at tablet/desktop sizes.

These are targeted automated and browser checks, not a guarantee of zero possible bugs, physical-device testing or a fresh Lighthouse measurement. No ranking or performance-score promise is made.

The release includes all pending source/asset/report changes requested by the user, including the earlier mobile featured-artwork refinement and product-thumbnail alt improvement. Generated Next type-reference changes and Supabase CLI cache are not release content.
