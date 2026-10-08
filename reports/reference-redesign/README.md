# Reference-based homepage redesign

The homepage follows the owner's supplied desktop/mobile welcome compositions:
cream and forest-green typography, Kumaoni welcome illustration, mist-blended
village panorama and Aipan borders. The existing collection journey remains.
The removed introductory product grid has not been restored.

The studio note retains its existing 10% follower offer, social destinations
and manual WhatsApp claim, with illustrated stationery and a scrollable native
dialog. Decorative images do not contain the real offer text or controls.

## Final navigation

The homepage now uses the same shared header as the Shop, Hampers and other
pages, as requested by the owner. Logo size, centred container, uppercase links,
terracotta active-page treatment, hamper sparkles, pale cream background,
sticky behaviour and subtle Aipan divider all come from the shared component.
The mobile menu also uses the same existing toggle and five-link layout.
Desktop navigation is aligned to the right edge of the shared header container
on every page. There are no homepage-specific navigation styles or decorative triggers.

Escape restores focus; outside clicks, navigation and resizing into desktop
close the mobile menu. Hidden links are inert. The Buransh asset and its delivery
variants were removed in the preceding revision. Catalogue search remains
available in the shop.

## Artwork

Created with the built-in imagegen tool from the supplied visual references:

- `public/images/culture/kumaoni-welcome-v1.webp`
- `public/images/culture/kumaon-village-v1.webp`
- `public/images/culture/studio-note-decoration-v1.webp`

These are decorative generated illustrations, not photographs of the maker,
her studio or products. Original tool outputs remain in the generated-image
library; project delivery assets and alpha-preserving, hash-addressed WebP
variants are saved in the repository. Prompts are recorded in
[artwork-prompts.json](artwork-prompts.json). Rejected navigation experiments
and their unused delivery assets are excluded from this release.

## Verification

- Responsive navigation checks at 320, 390, 768, 1024 and 1366 pixels.
- Shared mobile menu targets are at least 44px high; no phone overflow.
- Keyboard Escape restores focus; outside clicks and desktop resizing close the menu.
- Mobile Shop link opens the catalogue successfully; production console has no errors.
- Native offer dialog remains scrollable (verified in the preceding artwork pass).
- Catalogue search returns the expected Golu Devta result.
- 16 existing motion/image-delivery tests and the studio-note check pass.
- Targeted ESLint and production build pass.
- Before the navigation-only revision, production SEO audit passed on 63 pages, including 48 product pages,
  four category pages and 63 public internal links.

Release scope: the reference-based welcome artwork, illustrated studio note
and shared header with desktop navigation aligned to the right.
