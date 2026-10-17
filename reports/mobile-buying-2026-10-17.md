# Mobile buying — first implementation pass

## Changes

- Mobile homepage illustration uses a shorter, viewport-aware slot; one concise introduction replaces repeated visible copy. Existing desktop gallery work is preserved.
- Product pages offer a bottom purchase bar from the initial gallery, showing the selected quantity, subtotal and separate-delivery caveat.
- A single IntersectionObserver hides that duplicate action when the inline buying controls are sufficiently visible. The bar is hidden for order and zoom dialogs and on desktop.
- Inline cart and WhatsApp actions precede specifications and lengthy fulfilment copy.
- Native, keyboard-operable “Delivery & order support” disclosure retains dispatch, shipping and damage/returns information and policy links.
- Existing catalogue prices, minimum quantities, cart validation and WhatsApp message generation are unchanged.

## Verification

- TypeScript: `tsc --noEmit --incremental false` passed.
- 34 tests passed across mobile buying, cart, product dialogs, responsive images and homepage atmosphere.
- Isolated Next.js 15.5.19 production build passed. An existing Supabase Edge Runtime compatibility warning remains; no integration or dependency changes were made for this task.
- Homepage at 390 × 844: shop action bottom approximately 572px; both actions visible without scrolling, no horizontal overflow.
- Homepage at 320 × 568: both action bottoms approximately 501px; no horizontal overflow.
- Product mobile purchase bar visible beside gallery, hides beside inline actions, and shows cart-add feedback.
- Changed quantity from 1 to 2: WhatsApp order sheet showed ₹2,800 and restored focus to its trigger after dismissal. Did not continue to WhatsApp.
- Added 1 from the bar and 2 from the inline action: cart and server-validated enquiry showed 3 × ₹1,400 = ₹4,200. Removed the test cart item afterward.
- Desktop at 1440 × 900: purchase bar is `display: none`; gallery remained at top 110px, height 658px across opening/closing the disclosure after the browser scrolled the control into view.
- No captured browser warning/error logs in the checked product/cart flow.

## Preview

- Isolated production preview: http://localhost:3021/
- Mobile homepage screenshot: `/tmp/kumaon-mobile-home-20261017.jpg`
- Mobile product screenshot: `/tmp/kumaon-mobile-buying-20261017.jpg`

No production deployment, order transmission or catalogue/database changes. No fresh Lighthouse or real-user performance score is claimed. Existing unrelated changes were preserved.

## Commit selection

The mobile-only hero changes were staged independently of the separate desktop redesign and responsive-image work. An export of the exact staged snapshot passed its production build and all 33 applicable regression tests. The earlier 34-test preview included one additional, unrelated responsive-image test that is not part of this commit.
