# Product clarity verification — 8 October 2026

Story: a shopper opens a product page, sees supplied product facts, compares
relevant alternatives, chooses a permitted piece quantity and prepares a WhatsApp
enquiry. Product data comes from the existing published Supabase catalogue.

| Boundary | Evidence |
| --- | --- |
| Published catalogue → server | Read-only anonymous query returned 48 products. Legacy primary images were counted alongside galleries. |
| Server → product HTML | Existing route test passed factual summaries before ordering, retained full details, canonical URLs and actual stock schema. |
| Server → alternatives | Golu Devta recommends Om Aipan frame, Pichora-background Aipan decor and Ganesh Aipan hanging. Clicking the Om recommendation opened its correct permanent route. |
| Quantity → enquiry | Mantra counter starts at 10 pieces; decrement from 11 to 10 disables further decrease. Modal subtotal is ₹200 and preview contains quantity 10. No message was sent. |
| Responsive layout | Golu at 320px, nameplate and order dialog at 390px, Om frame at 1280px had matching viewport/document widths. Nameplate restriction wraps fully. |
| Production page checks | 63 public pages, 48 products, 4 categories; unique titles/descriptions, canonicals and relevant schema passed. See `seo-check.json`. |
| Code/build | Production build, TypeScript, targeted ESLint and extended product indexability tests passed. |

React review: recommendations remain on the server and reuse the fetched
catalogue; no extra requests or dependencies were added. Facts use a definition
list, original details remain accessible, and the product component resets its
state when navigating to a different product. Minimum quantities are shared by
both controls. The details anchor leaves space below the fixed header.

Browser console had no errors on the verified flow. The local production preview
is running on port 3013. These checks were completed locally before release.

## Remaining content limits

- Missing measurements, care guidance and scale photographs need original input
  from Sneha; see `docs/PRODUCT-CONTENT-CHECKLIST.md`.
- Roli Chawal's pair/pack price unit is unclear. Its stated two-pair minimum is
  visible, but is not mapped to the stepper or subtotal without confirmation.
- Recommendations are rules based on names/categories, not measured popularity.
- Mobile layout checks do not establish Core Web Vitals or conversion improvements.

Screenshot: `nameplate-mobile-390.jpg` shows the production-build mobile summary
and ordering controls.

## Desktop spacing correction

The photo gallery now remains beside the longer order panel while scrolling on
screens at least 768px wide and 600px high. Its photograph height fits the viewport
below the header, allowing room for thumbnails. It stops at the end of the product
layout and does not overlap the following information section.

Verified at the reported 1076 × 687 viewport and scroll position 728: the image
fills the previously empty left column, and the gallery ends at the same height
as the summary. At 390 × 844, the gallery remains static with title → photographs
→ order section, no horizontal overflow, and photo enlargement opens/closes.
Short desktop windows retain the normal scrollable gallery.

Screenshot: `desktop-spacing-1076.jpg` captures the corrected production preview
at the original reported scroll position.

## Development cache recovery

The stale `.next-dev/server/pages-manifest.json` referenced `_document.js`,
`_app.js` and `_error.js` in an empty pages directory. An existing development
server on port 3000 had shared this cache with the temporary port-3012 preview.
The port-3013 production preview, which uses `.next`, was still serving correctly.

Stopped the stale development process, moved its generated cache to a temporary
backup, and restarted one development server on port 3000. The regenerated pages
manifest is empty as expected for these App Router routes, rather than referring
to missing Pages Router files. Home and product returned 200, the not-found check
returned 404, and the product rendered in the browser without console errors.
Screenshot: `dev-cache-recovered.jpg`.

Reuse the running port-3000 development server for further edits. Do not run a
second development server against the same `.next-dev` directory. The independent
production preview remains on port 3013. No application code was changed for this
cache recovery.

## Homepage simplification

Removed the “A few pieces to start with” product grid and its unused component
and stylesheet at the owner's request. The hero leads directly into the animated
collection journey. Production build and page lint passed. Browser checks at
1076px and 390px confirmed the removed section is absent, the animated showcase
remains, and there is no horizontal overflow or console error. Screenshot:
`home-without-starting-grid.jpg`.
