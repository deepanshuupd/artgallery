# KumaonRang homepage colour redesign

Date: 5 October 2026

## Design decision

The homepage now treats Kumaon as a source of several colours: river blue, pine green, sunlit gold and a buransh-inspired berry, with geru retained as a craft accent. Soft coloured fields make the change visible on mobile; strong colour is reserved for shopping actions and one customer-story section. Product photographs retain their actual colours.

This is a brand and usability direction informed by research. It is not a claim that a particular hue changes every customer's emotions or guarantees higher sales.

## Research and its practical meaning

- [Elliot and Maier's colour psychology review](https://www.annualreviews.org/content/journals/10.1146/annurev-psych-010213-115035/) finds that colour can carry meaning and influence behaviour, while cautioning that context, boundaries and real-world applicability require further work. We therefore avoid universal rules such as “green creates trust.”
- [Nielsen Norman Group's visual hierarchy guidance](https://www.nngroup.com/articles/visual-hierarchy-ux-definition/) explains how relative contrast, saturation, scale and grouping guide attention. The implementation uses quiet background tints, dark readable text and a consistent primary button instead of giving every element equal visual emphasis.
- [Leiva et al.'s MobileHCI study](https://arxiv.org/html/2101.09176v1) studied 30 participants viewing 193 mobile interfaces. Text, images and location produced stronger attention patterns than colour brightness. Its Chinese-language app screenshots and free-viewing task limit generalisation to Indian ecommerce; the useful design implication is to preserve clear headings, photographs and familiar shopping paths.
- [Baymard's mobile homepage usability research](https://baymard.com/research-articles/mobile-homepage-usability) shows why a representative set of visible categories helps visitors understand a store's range. Distinct labelled category frames support KumaonRang's broader catalogue and help avoid an Aipan-only impression. Colours supplement the category names; they do not replace them.
- [WCAG's contrast guidance](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) supplies the verification thresholds: 4.5:1 for normal text and 3:1 for large text. [Use of Color](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html) requires information beyond colour alone; [Non-text Contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html) covers necessary interface cues.

### Cultural and market references

[Pithoragarh's official culture page](https://pithoragarh.nic.in/culture-heritage/) describes Aipan, decorated Pichhauras and traditions beyond one craft. [Uttarakhand Tourism](https://www.uttarakhandtourism.gov.in/) presents the region's forests, rivers, lakes and Himalayan landscapes. These are reference points for the palette; the chosen hex values are our design interpretation, not an official regional colour standard. Gold also connects with the Pichora-inspired products already in the real catalogue.

The official [Okhai](https://okhai.org/) homepage combines craft, category merchandising, gifting and artisan storytelling. [Chumbak](https://www.chumbak.com/) combines product departments, themed collections and gift shopping by occasion. These are merchandising references, not scientific evidence of colour effectiveness. Their web content was inspected; rendered CSS and mobile screenshots were not visually verified.

## Palette and section roles

The source of homepage tokens is `src/components/home/home-palette.module.css`.

| Role | Colour | Use |
| --- | --- | --- |
| Main ink / supporting copy | `#253d38` / `#495d57` | Readable text on light surfaces |
| Pine / hover | `#264f42` / `#193a30` | Consistent primary shopping actions |
| River | `#285d6a` | Heading emphasis and light-section focus outlines |
| Geru | `#994831` | Craft ornament and selected editorial accents |
| Marigold | `#ebbc62` | Warm featured-artwork arch |
| River mist | `#e4eff0` | Hero background, with a subtle sage transition |
| Chalk / paper | `#f8faf6` / `#fffaf2` | Collections field and neutral photograph surfaces |
| Category mats | `#c6dcd1`, `#f1c982`, `#bfd7df`, `#e4c6cb` | Keychains, frames, magnets and personal gifts respectively |
| Deep berry / pale berry | `#65384a` / `#f7e1df` | Customer-story band and its supporting text |
| Gold wash | `#f7e5b8` | Hamper section |
| Sage | `#e4ecdf` | Founder section |

The opening heading now directly connects the name to the offer: “Bring home the colours of Kumaon.” Category colours identify the surrounding frames without applying filters to products. One dark customer section gives the page rhythm; gold and sage then distinguish gifting from the founder's story. Hampers remain above the founder section.

## Implementation scope

The palette is scoped to the homepage's `<main>`. Shared collection and customer-note styles consume homepage variables with existing fallbacks. Shop, article, policy and customer-story page surfaces retain their current palette; the shared header and footer are outside this scope.

Existing product data, product URLs, metadata and structured data remain in place. The category grid, product links, gifting links and native occasion disclosures remain available. The redesign retains existing reduced-motion behaviour and introduces no new animation library, third-party script or image download.

## Verification

- Production build passed on Next.js 15.5.19 with network access to the live catalogue. Homepage output is 8.67 kB with 120 kB first-load JavaScript according to the Next build report; these are bundle figures, not Core Web Vitals measurements. No new runtime dependency, font or photograph was added.
- TypeScript and targeted ESLint passed. The build regenerates route types, so the standalone type check was completed after the build. The generated next-env.d.ts change was restored to the repository's original version.
- All 20 relevant existing regression checks passed: home atmosphere, collection journey, customer notes and studio postcard. The existing attribution contrast check now resolves CSS variables and checks both default and homepage palettes at the unchanged 7:1 threshold.
- All 27 explicitly checked opaque foreground/background combinations passed their applicable 4.5:1 text or 3:1 focus threshold. The lowest checked text ratio was 5.07:1; both hero gradient endpoints were included. See [numeric contrast results](homepage-palette-contrast-2026-10-05.json). This is a declared-colour check, not a complete rendered-page accessibility audit.
- Read-only HTTP verification against the local production build returned 200 for the homepage, both stylesheets, all four category destinations, hampers, about, Aipan and customer stories. The compiled homepage palette, new heading, four category links, Organization/WebPage JSON-LD, existing title/canonical and section order were present in returned HTML. See [HTTP results](homepage-http-verification-2026-10-05.json).
- The user approved local browser checks. The browser tool nevertheless rejected localhost because a saved permission setting still blocks it. No alternate browser or indirect screenshot workaround was used. Visual checks at 320/390/430 px, desktop layout, 200% zoom, sticky-card clipping, image composition and live keyboard interaction remain pending; source-level responsive safeguards were reviewed.

Local production preview: http://localhost:3012/. The browser restriction does not change the code or HTTP verification results; it limits what can be claimed about the rendered layout.

## Post-launch validation

Use the existing analytics setup, where available, to compare equivalent mobile traffic periods before and after release. Record category and hamper click-through, product-page visits, add-to-cart progression and completed orders. Segment by traffic source and device; note promotions or catalogue changes that could affect the comparison.

Ask several customers what the store sells after a short homepage scan, whether the colours feel like KumaonRang, and whether they can locate a category and hamper easily on their own phone. Check legibility and focus with accessibility tools and real devices. These checks assess the design; an uncontrolled before/after comparison cannot attribute any sales change solely to colour.
