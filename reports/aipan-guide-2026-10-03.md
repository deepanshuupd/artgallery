# Aipan art guide: editorial redesign

## Scope

Replaced the location-specific guide with `/aipan-art`. The previous `/pithoragarh-aipan-art` address returns a permanent 308 redirect. Updated the sitemap, footer, homepage story, frame collection and Uttarakhand gift guide to link to the new address.

## Research and editorial decisions

- Government of India, Office of the Development Commissioner (Handicrafts): [Uttarakhand Aipan](https://handicrafts.nic.in/crafts/All_Crafts/Craft_Categories/Miscellaneous/Folk_Painting/Uttarakhand_Aipan/UttarakhandAipanWebPage.html). Its account traces the tradition to Almora during Chand rule. The page attributes this account rather than inventing an exact origin date.
- NID Bengaluru, D’source: [Introduction](https://dsource.in/resource/aipan-uttarakhand/introduction) and [Designing process](https://dsource.in/resource/aipan-uttarakhand/designing-process). Supports the household and ritual settings, red geru ground, ground rice paste, and drawing by fingers or brushes.
- Ministry of Tourism, Incredible India: [Aipan: the vibrant folk art of Uttarakhand](https://www.incredibleindia.gov.in/en/uttarakhand/aipan-the-vibrant-folk-art-of-uttarakhand). Additional context on the tradition and its motifs.

The copy separates traditional ritual art from contemporary Aipan-inspired MDF products. It does not imply modern pieces use rice paste, promise spiritual outcomes, or claim Pithoragarh is the tradition’s sole origin. Product names, prices, photographs and links come from the existing catalogue.

## Authentic photograph

The guide now uses the photograph supplied by the user on 3 October 2026: `WhatsApp Image 2026-10-03 at 15.58.05.jpeg`. It shows red-and-white Aipan artwork with geometric panels, floral borders and footprint motifs. No artist, medium, date or licence is inferred from the photograph. The earlier Wikimedia image and its attribution file remain as unused assets; their credits are not attached to the user's photograph.

The supplied original is 4,160 × 3,120 pixels and 5,129,840 bytes. WebP variants are 1,440 × 1,080 pixels / 557,502 bytes and 720 × 540 pixels / 163,278 bytes. The layout contains the whole photograph rather than cropping the artwork. Article schema and social metadata use the real dimensions and descriptive alternative text. The image is resized and compressed without generative editing.

## Presentation and verification

- Mobile-first editorial layout: geru-coloured introduction, documented photograph, concise section navigation, material explanation, photographed shop cards, native FAQ disclosures and visible references.
- Server-rendered content; no added animation library or client-side guide logic. Product images remain lazy-loaded.
- Isolated production build passed without modifying the running preview’s production build.
- The current local production-build SEO audit passes on 60 sitemap pages, including 48 product pages: unique titles and descriptions, canonical/Open Graph agreement, one H1 per page, product schema, category breadcrumbs and admin noindex.
- Earlier browser checks applied to the preceding guide design. Browser access was declined for this revision, so the replacement photograph's visual layout has not been browser-verified. Current server HTML, both image responses, schema dimensions and the old-route redirect were checked.
- Confirmed the old route returns 308 with `Location: /aipan-art`.

These checks verify implementation and basic technical SEO; they do not establish search ranking improvements or a Lighthouse score.
