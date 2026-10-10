# Selective cultural icon use

The owner's 10 October reference sheet supplies a visual direction, not a site
map. Three elements have a useful role in the current storefront:

- **Aipan menu disc:** three familiar lines, rice-white dots and leaf accents on
  geru red. The mobile header retains a visible Menu/Close label, an accessible
  button name, expanded state and keyboard/outside-click behaviour. Desktop
  navigation retains the approved right alignment and existing link treatment.
- **Aipan art tile:** a small decorative SVG alongside the existing art-guide
  link in the footer. It reinforces the link's subject without replacing its label.
- **Kumaoni house:** a decorative watercolor house beside the footer's place of
  origin. It adds warmth where the reference is relevant, without presenting it
  as Sneha’s actual home or studio.

The flowers would repeat a navigation treatment the owner rejected. Cap,
drums, festival lamp and bird would be better suited to corresponding stories
or seasonal content; there is no reason to add those destinations just to use
an illustration. The shop basket is not used as a menu or checkout control.
The search illustration is omitted because the owner removed header search;
the real catalogue search remains unchanged.

The menu and tile are native SVGs to stay crisp at small sizes and inherit the
existing component accessibility conventions. The house was adapted with the
built-in imagegen tool from `WhatsApp Image 2026-10-10 at 16.27.29.jpeg`.
Its complete prompt is in `house-prompt.txt`. The original PNG remains in the
generated-image library; the project uses a lazy-loaded 300×200 transparent WebP
at `public/images/culture/kumaoni-house-icon-v1.webp` (28,582 bytes).

Release scope: the Aipan mobile menu, Aipan art-guide marker and Kumaoni house
footer illustration. Unselected reference motifs are not included.

## Verification

- Production build and targeted ESLint passed.
- Existing studio-note rendering/placement check passed.
- Browser checks at 320, 390, 430 and 1366 pixels showed no horizontal overflow.
- Menu button and mobile links retain 44px minimum height; expanded state and
  Escape focus restoration were verified in the browser.
- House loads successfully with decorative empty alt text and lazy loading.
- The illustrated footer link opens the existing Aipan guide successfully.
- Small-screen footer controls wrap cleanly; WhatsApp text stays on one line.
- Production preview console returned no errors.

Screenshots: `mobile-menu-closed.jpg`, `mobile-menu-open.jpg`,
`mobile-footer.jpg` and `desktop-footer.jpg`.
