# KumaonRang: AI discovery and image search

Implemented locally on 22 October 2026. Production deployment is still required. No paid service or additional analytics package was introduced.

## What this work targets

Help shoppers and retrieval systems understand what KumaonRang sells, where it is based, and which real product matches a query. The initial targets are Pahadi keychains, Uttarakhand/Kumaon gifts, regional souvenirs, Aipan frames and small event return gifts. Search access, indexing, a mention, a linked citation, a referral visit and an order are separate outcomes.

## Implemented

- Explicit search/retrieval crawler groups in robots.txt for OAI-SearchBot, ChatGPT-User, Claude-SearchBot, Claude-User, Googlebot, Googlebot-Image and Bing. All groups repeat the admin/API exclusions. The former wildcard already allowed public crawling; this makes the policy explicit rather than claiming to remove a previous AI block. Robots directives do not secure private routes and do not override hosting firewalls.
- A server-rendered buying guide within the existing `/pahadi-keychains` category. It explains current catalogue prices, party/wedding return-gift enquiries and the difference between Pahadi characters and Aipan artwork. It links genuine products and excludes drafts and unavailable items from its price range. No duplicate keyword landing pages were created.
- Collection structured data now includes representative product imagery and per-item images, deduplicated using the public router's first published record.
- The gift guide and four shop categories now have representative images in the sitemap, alongside the existing full product galleries. No fabricated last-modified dates or deprecated image-sitemap fields.
- Homepage primary-image structured data now identifies a photo visibly used by its collection journey. The brand icon remains its social-sharing image.
- Product cards and the gift guide now use the existing offline responsive-image component, with AVIF sources, WebP fallbacks, actual width descriptors, alt text and lazy loading below the fold. The initial priority card still loads eagerly. Full product-detail photos remain available for inspection.
- Added 41 card-image sets to the six existing catalogue sets: 47 public card sources now have offline variants. For the 41 additional sources, the originals totalled 2,463,038 bytes, compared with 529,190 bytes for their 256px WebPs and 407,061 bytes for their 256px AVIFs. These are file-size comparisons at that width, not measured whole-page/Core Web Vitals improvements. Browsers choose larger variants when required.

The generator `node scripts/prepare-catalogue-card-images.mjs` reads publicly rendered catalogue images, checks source indexing headers, and writes local immutable derivatives. It does not change database rows or storage objects. Regenerate after new uploads become public, then deploy the assets and manifest together. Unknown/replaced images fall back to their original URL, avoiding a stale-photo match. Existing sources and new uploads must retain accurate image descriptions; do not add visual details without examining the photographs.

## Measuring real AI referrals without buying tools

The existing root layout already mounts Vercel Web Analytics on Vercel. Use the production project's **Analytics > Referrers** panel and inspect, when present:

| Referrer hostname | Likely source |
| --- | --- |
| chatgpt.com, chat.openai.com | ChatGPT |
| claude.ai | Claude |
| gemini.google.com | Gemini |
| perplexity.ai | Perplexity |
| copilot.microsoft.com | Copilot |

Choose a referrer row to inspect its landing pages. Compare complete 28-day windows and record the release date. These hostnames are a reporting checklist, not evidence that visits from them have already occurred.

Referrer suppression, copied links, mobile app handoffs and tracking blockers can make AI visits appear direct or unmeasured. A `google.com` referral cannot by itself distinguish ordinary Search from AI Overviews/AI Mode. UTM filters are plan-dependent; this implementation relies on the existing Referrers report and does not purchase an upgrade. Do not rewrite missing referrers or classify ordinary Google traffic as Gemini to inflate results.

AI crawlers generally do not generate browser pageviews. Inspect hosting request/firewall logs for crawler requests separately; a user-agent string can be spoofed. A crawler request is not a recommendation or a shopper visit. Synthetic UA checks below only verify the server response.

The connected Vercel API returned HTTP 403 for the project's team scope when retrieving the referral baseline on 22 October. No claim of zero/current AI referrals can be made from that failed request. The owner can read the dashboard or authorize the existing connection for the correct team; reconnecting the entire service is not inherently necessary.

## Next work, in priority order

1. Deploy this release and run the HTTP checks below against `https://www.kumaonrang.com`. Confirm production WAF/bot rules do not challenge the verified search crawlers; leave unrelated protections intact. This was not verified through the Vercel API because of its access error.
2. Publish actual Aipan keychain products if they are sold, using original photos and confirmed material, size, included pieces, price and personalisation options. The 22 October Search Console review found Aipan-keychain queries but no clearly labelled matching live product. A Pahadi character must not simply be renamed Aipan to capture the query.
3. Improve the most exposed image-search products first: the Aipan nameplate, Golu Devta frame, Pichora frame and Pahadi girl keychain. Add real front/detail/in-use scale photos and accurate individual alt descriptions/captions. Preserve useful image URLs when only editing text; do not rename all indexed images solely for keywords.
4. Add first-hand evidence to existing pages: actual custom-order examples, the artist's process and real event-gift quantities with customer permission. Confirm delivery/dispatch details and distinguish handmade regional products from other gift accessories. The site's existing customer stories are useful evidence; do not fabricate reviews or ratings.
5. Build genuine external references: local craft/tourism features and maker profiles, with links to the relevant guide or photographed product. Keep the business name, website and location consistent. These require owner outreach and editorial participation, not code-generated mentions or purchased links.
6. In Search Console/Bing Webmaster Tools, review priority pages for crawl/index eligibility, compare Web and Image Search separately, and request indexing selectively when appropriate. Existing successful sitemap submissions need not be repeated on every release. Do not interpret all excluded URLs as errors.
7. Repeat a fixed, small prompt sample in ChatGPT, Claude and Gemini with web search enabled where available. Record date, exact prompt, service/mode, cited URL and whether the product actually fits. Example prompts: “Where can I buy Pahadi keychains online?”, “Uttarakhand return gifts for a wedding”, “Aipan art frames from Kumaon”, and “Personalised gifts from Pithoragarh”. Record absence as well as presence; results vary with context and locale. Compare with identifiable human referral visits, not screenshots alone.

## Verification commands

Final local production verification passed: build with the live catalogue and no catalogue-revalidation errors, TypeScript, targeted ESLint, 12 image-metadata regression groups, six responsive-image tests, and the gift-guide/buying-answer/schema checks. HTTP checks passed for all five priority landing pages and all 48 product pages in the 64-page sitemap, covering 110 gallery-image references. Forty-seven product pages have photos; one currently has no gallery and should receive a genuine photograph. This verifies markup/image references rather than claiming every remote gallery asset was freshly downloaded. All six keychain card photographs also loaded successfully as AVIF in the browser, with no horizontal overflow at the inspected desktop viewport. Homepage source-photo matching and its separate brand sharing preview passed.

Pre-push UI review also passed at 360px and 390px mobile widths and 1280px desktop width: keychain catalogue, gift guide, loaded product images, search, price sorting, photo enlargement and product-to-cart-to-server-prepared-enquiry flow. The test cart item was removed afterward; no customer message or order was sent. The new keychain guide heading now has a 120px anchor offset so the sticky header does not cover it. Eighteen existing cart/mobile-buying regression tests passed, and the final network-enabled production build and HTTP checks were repeated after that CSS correction.

The broader image-page check initially caught an existing homepage mismatch and assumed the old product-based sharing preview. The homepage schema was corrected to match a visible collection image, and the check now accepts exact offline derivatives while separately verifying the intentional brand preview. All checks above passed again after that correction.

```sh
node scripts/test-gift-guide.mjs
node scripts/test-product-image-seo.mjs
node --test scripts/test-responsive-images.mjs
npx tsc --noEmit --incremental false
npm run build
npm run start -- --hostname 127.0.0.1 --port 3024
node scripts/check-ai-discovery.mjs http://127.0.0.1:3024
node scripts/test-gift-guide.mjs http://127.0.0.1:3024
node scripts/check-product-image-pages.mjs http://127.0.0.1:3024
```

Production builds need network access to load the published catalogue. A sandboxed build can compile successfully while logging catalogue revalidation failures; do not accept that alone as a live-data check. Use a network-enabled build and inspect its rendered pages.

## Why no special “AI ranking” file

There is no universal submission that guarantees inclusion in ChatGPT, Claude or Gemini. Google says its AI Search features use normal SEO eligibility and do not require special AI text files or schema. We prioritized indexable pages, accurate product/image data, useful answers and reporting. OpenAI search access is separate from GPTBot training access. Google's Google-Extended token concerns Gemini training/grounding, while Googlebot governs Google Search; this release leaves the existing wildcard permission for Google-Extended unchanged.

## Primary references

- [OpenAI search/retrieval crawler documentation](https://developers.openai.com/api/docs/bots)
- [Anthropic crawler controls](https://privacy.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler)
- [Google AI features and websites](https://developers.google.com/search/docs/appearance/ai-features)
- [Google image SEO guidance](https://developers.google.com/search/docs/appearance/google-images)
- [Google crawler and Google-Extended controls](https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers)
- [Vercel Analytics dimensions and referrers](https://vercel.com/docs/analytics/using-web-analytics)
- [Vercel Analytics filtering and plan-dependent UTM filters](https://vercel.com/docs/analytics/filtering)

The installed Next.js 15.5.19 package has no `node_modules/next/dist/docs/` directory. Implementation was checked against the official [Next.js 15 robots guide](https://nextjs.org/docs/15/app/api-reference/file-conventions/metadata/robots) and route/metadata conventions instead.
