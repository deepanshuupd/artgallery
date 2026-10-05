# Our Story and homepage artwork — 5 October 2026

## Implemented

- About flow: interactive Uttarakhand map → Kumaon + रंग meaning → Sneha’s art, Instagram and website story → invitation to contact/shop.
- Six selectable Kumaon district shapes. Pithoragarh is marked as the brand’s home. The marker represents the district, not an exact town/address.
- Outline, divisions and home marker appear sequentially. Reduced-motion CSS shows the finished map without the entrance animation.
- Removed the duplicated district-button row and browser focus rectangle. Pointer selection highlights the district and updates its name. Keyboard focus uses the district’s outline; Tab and Enter remain supported.
- About uses the existing catalogue photograph of Aipan Wall Decor with Pichora Background, linked to its product page, with its mobile card rendition.
- Homepage adds the owner-supplied dancer illustration after collections and before customer notes. Copy and artwork stack on phones; desktop places copy beside the artwork on a shared cream background.
- Illustration delivery files: 960 × 540 / 40,646 bytes on mobile; 1440 × 810 / 78,620 bytes on desktop. Lazy loaded, with reserved layout space. No new animation library, map service or database request.

## Geography and cultural references

- Official Kumaon division membership: https://kumaon.gov.in/about-department/introduction/
- District boundary source: https://github.com/datameet/maps/tree/master/Districts/Census_2011 — CC BY 2.5 IN. Attribution appears under the map and in `public/illustrations/ATTRIBUTION.md`.
- `scripts/generate-story-map.py` nodes the source boundaries and simplifies the shared polygon coverage together; assertions verify valid coverage and consistent regional unions. The generated JSON is 51,849 bytes (10,684 gzip). These are simplified 2011 census boundaries, not a survey map.
- Chholiya cultural reference: https://www.itbpolice.nic.in/Home/DownloadPressRelease/2113
- Artwork provenance: `public/images/culture/ATTRIBUTION.md`.

## Checks completed

- Production build passed (Next.js 15.5.19); `/about` remains prerendered.
- ESLint passed for changed TSX files; build type checking passed.
- Existing customer-notes regression suite: 7/7 passed, including the shared floating-note behaviour check.
- Chrome viewport checks: 320, 390, 430, 768 and 1440 px. No horizontal page overflow observed on the updated pages.
- All six map selections checked. Pointer focus has no rectangular outline. Keyboard Tab/Enter and the district-shaped focus indicator checked.
- Mobile loads the smaller illustration and product-photo sources. Full dancer and product-photo aspect ratios verified visually.
- Server HTML contains one H1, six interactive district paths, story text and the existing `https://www.kumaonrang.com/about` canonical.
- No browser console errors observed in the final preview tab.
- `git diff --check` passed.

## Scope and limitations

Verified against the local production preview at http://127.0.0.1:3013. No deployment/push performed. Chrome responsive viewports are not physical iPhone/Safari testing. Reduced-motion handling was checked in code; no OS reduced-motion emulation or Core Web Vitals measurement was performed. The catalogue photo URL is an existing public static asset and must be updated here if that editorial photograph changes.

## Visual proof

- `homepage-mobile.jpg`
- `homepage-desktop.jpg`
- `about-map-desktop.jpg`
