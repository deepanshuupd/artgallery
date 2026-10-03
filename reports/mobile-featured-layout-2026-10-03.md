# Mobile featured artwork refinement

Previous image-SEO work was committed and pushed to `main` at `49be1e0` before this UI change. The live image-page check then passed: valid sitemap XML, 58 public pages, 47 product pages and 109 gallery photos. These mobile UI changes are separate, on `codex/mobile-featured-layout`, and have not been pushed.

## Changes

- Phone-only rules below 768 px cap the arch at 336 px and center it, rather than expanding it across a wide phone around a 260 px card.
- The card fills the available interior. Padding is 28 px above, 12 px on the sides and below; the linework is smaller and quieter.
- The caption gives a wrapping product title and the price separate columns. The full photograph is preserved with `object-fit: contain`.
- The responsive image-size hint matches the new layout. The existing direct WebP delivery, alt text, image SEO, priority loading and desktop composition are retained. No new JavaScript, dependencies or image transformations.

## Verification

- Production build, non-incremental TypeScript check, atmosphere/journey/story/postcard checks and `git diff --check` passed.
- In-app browser checked widths 320, 360, 390, 430, 600, 767 and the 768 px breakpoint. Also checked 320 × 568. Document scroll width did not exceed its client width. Classic browser scrollbars reduce the content width by 15 px on scrolled screenshots; this is not horizontal overflow.
- Card remained within the mobile backdrop, image loaded in contain mode, caption did not overflow and title/price did not overlap.
- At 390 px before scrolling: original arch 350 px, card 260 px, side clearance 45 px, top clearance 64 px. Revised arch 336 px, card 312 px, side clearance 12 px, top clearance 28 px. The complete photograph is slightly larger; this is a reduction in decorative whitespace, not a claim that every phone's total hero height is shorter.
- At 1440 × 900, the settled grid, arch, product card, photo and caption rectangles and styles exactly matched the recorded pre-change baseline. Initial entrance-animation geometry was excluded from this comparison.
- Clicking the featured card at the smallest phone width opened `/aipan-frames/golu-devta-aipan-frame`, with its real photographs and price. No captured console errors or error overlay.

This is targeted responsive verification, not a physical-device or new Lighthouse audit.
