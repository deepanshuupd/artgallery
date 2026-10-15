# Mobile storefront UI audit — 15 October 2026

## Scope

Reviewed the public shopping experience: homepage, shop, all four category pages, curated hampers, hamper builder, populated cart, About, Contact, Aipan guide, gift guide, customer stories, ordering and policy pages, and representative normal, bulk-minimum and ready-made hamper product pages. This covers 20 public routes, with additional interaction checks in search results, menus, modal dialogs and hamper steps.

Phone checks used 320 × 740, 375 × 812 and 390 × 844 viewports. Short landscape checks used 568 × 320 and 667 × 375. Nine key routes were also checked at 768 × 900 and 1280 × 800. These are browser viewport checks, not physical iPhone/Android device certification.

## Findings and changes

| Issue | Evidence | Resolution |
| --- | --- | --- |
| Landscape navigation clipped the last link | At 568 × 320, Contact extended to y=343, below the viewport | Limit the expanded menu to the available viewport height and allow scrolling inside it. Contact is now reachable. |
| Order-sheet footer crowded short screens | The sticky footer occupied about 185 px in a 375 px-high viewport | Let it scroll normally below 600 px height and while an input is focused. Keep the sheet header and close button sticky. |
| Form fields needed clearance from modal chrome | Fields near the bottom competed with persistent controls | Add scroll clearance; a focused personalisation field fits below the sticky header on the landscape sheet. |
| Basket consumed too much space during hamper details | The illustrated basket summary occupied about 200 px above the form | Keep the illustration during selection; use a compact summary during details/review. It measures about 102 px at 390 px width. |
| Hamper overlays left little space in landscape | Sticky basket, page header and action bar compete in a 320 px-high viewport | Make basket and action bar scroll normally on short screens, and account for that when moving between steps. |
| Small map districts were difficult touch targets | Champawat measured about 30 × 31 px at 320 px width | Add a labelled 48 px-high native district picker on phones, synchronized with the existing map and status text. |
| Catalogue sort controls used 13 px text | All shop/category sort selectors inherited this size | Use 16 px text for easier reading and to reduce focus-zoom problems on phones. |
| Contact submit could run before React was ready | An immediate pre-hydration click produced a normal form GET navigation | Disable submission until the client controls are ready; normal validation then focuses the first invalid field. |
| Repeated header navigation lacked a keyboard bypass | No skip target existed | Add a visible-on-focus “Skip to content” link and focusable content target. Verified focus moves to `main-content`. |
| Studio-note close control scrolled away | At 320 × 740 after scrolling, its bottom was above the viewport | Keep the close button sticky within the note while preserving the paper layout. |

The previously corrected product-grid layout was retained and checked: all 41 catalogue cards include their cart buttons, including expanded confirmation feedback, without overlapping the next row.

## Verification

- Production build, TypeScript and targeted ESLint passed.
- Cart tests: 14 passed. Hamper-builder tests: 9 passed.
- Public SEO regression check: 64 sitemap pages, 48 product pages and 65 public links passed.
- Initial narrow-phone sweep: no page-wide horizontal overflow on the reviewed public routes.
- Tablet/desktop sweep: no horizontal overflow or header navigation/cart collision on nine key routes at each width.
- Search, sort, no-result recovery and category navigation worked at 375 px. The selected category remained visible in the horizontal filter strip.
- District selection updated the map and announced district. Contact validation focused the name field below the sticky header.
- Hamper selection → personalisation → review produced a WhatsApp draft link; no message was sent.
- Landscape order fields remained reachable and the close button stayed visible.
- Homepage first-load JavaScript remains 122 kB in the production build. No dependency was added.

Screenshots and machine-readable observations are saved outside the repository in `/private/tmp/kumaonrang-mobile-audit-2026-10-15/`. Existing Aipan research and WhatsApp message changes in the workspace were preserved. The fixes are local and have not been committed or deployed by this audit.

Final production checks also confirmed that the studio-note close button remains at y=48–92 after scrolling 118.5 px at 320 × 740, and dismisses the note successfully. The photo viewer filled the phone viewport without horizontal overflow and closed with Escape. A final six-route production sweep at 320 px found no horizontal overflow or visible form inputs below 16 px. The temporary two-piece hamper draft used by the audit was restored to its initial empty state.
