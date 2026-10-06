# Compact KumaonRang logo replacement — 6 October 2026

Replaced the previous mountain logo in the shared header, mobile navigation header,
footer and Organization JSON-LD. Updated the canonical legacy public logo URL too.
Regenerated the root App Router's SVG browser icon, multi-size ICO and Apple icon.

The supplied mark has a cohesive terracotta/olive palette, bilingual lettering,
mountain imagery and an Aipan ornament. Fine snow/tree/ornament details soften at
small sizes. The favicon now uses the owner's separate decorated K and mountain
tile supplied as `ChatGPT Image 6 Oct 2026, 13_46_32.png`.
The supplied logo is raster artwork; a true vector master would be useful for print
and future scaling.

The built-in image editing tool removed the paper backdrop. Its prompt requested
preservation of all lettering, colours, geometry, snow and ornament while removing
only the background and blank margins. Output was inspected before integration.
This is an extracted rendition rather than a pixel-identical original.
Asset provenance and extraction prompt: `public/brand/ATTRIBUTION.md`.

- Shared WebP asset: 512 × 231, approximately 39 KB, with transparency.
- Schema PNG asset: 1024 × 463. Existing `/brand/kumaonrang-logo.png` now serves the same current logo.
- Header display width: 120 px below 768 px; 136 px at and above 768 px.
- Removed the separate header tagline. Header measured approximately 82 px high
  on a 390 px viewport and 88 px on a 1440 px viewport, including the Aipan border.
- Footer now uses a distinct deep plum background (#342735), ivory text,
  muted gold labels and a light filtered logo without any backing rectangle.
  Explore and Shop are separate navigation columns; desktop uses four columns,
  phones use a full-width brand block followed by two link columns and contact.
- Image dimensions reserve space; header preloads the asset, footer does not.

## Verification

- Production build passed, including TypeScript checking.
- ESLint passed on edited TSX files; `git diff --check` passed.
- Chrome local production preview: homepage at 390 and 1440 px; shop at 320,
  430 and 768 px. Logo loaded successfully and header stayed within viewport width.
- Mobile navigation opened and closed successfully.
- Footer logo and Organization schema URL verified in the browser.
- New icon URLs present in the page. Agent browser adds a temporary tab badge,
  so the underlying icon files were also inspected independently.
- No browser console errors observed.
- Actual device/Safari testing and field performance measurement not performed.
- No commit, push or deployment performed.

Preview: http://127.0.0.1:3013/

Visual proof of the header: `mobile-header.jpg`, `desktop-header.jpg`.
`desktop-footer.jpg` and `mobile-footer.jpg` show the earlier sage footer and
are retained only as previous-iteration references.

## Latest plum-footer checks

Production build, TypeScript checking, ESLint and diff checks passed.
Local rendered HTML includes the new footer, current logo and both navigation
groups. Calculated text/background contrast ratios are 8.73:1 for body text,
11.21:1 for links, 8.09:1 for section labels and 7.24:1 for copyright text.
These ratios cover declared text colours, not pixels inside the logo artwork.
Browser verification was attempted, but the computer-use connection repeatedly
timed out, including its availability check. The latest footer has not yet been
visually verified in a browser; previous screenshot verification does not apply
to this iteration. No production deployment performed.
