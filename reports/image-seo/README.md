# KumaonRang image discovery and AI-search plan

Research reviewed: **2 October 2026**. Scope: current public photographs and every future product upload on `https://www.kumaonrang.com`.

Storage/indexability investigation continued on **3 October 2026**.

The objective is better discovery, qualified visits and enquiries for real Kumaoni products. Google Images, Bing and AI search do not offer a setting that guarantees first place. Making content eligible for discovery is not the same as getting it indexed, selected or cited. No measured keyword-difficulty dataset or competitor-ranking dataset was supplied; the phrases below are relevant shopping intents, not certified low-difficulty keywords.

## What matters, according to primary sources

### Image discovery and presentation

Google can discover standard `<img src>` images; CSS backgrounds are not indexed as images. WebP and AVIF are supported. Meaningful page context, useful alt text and clear photographs matter; filenames provide only a light clue. Reuse a consistent URL for the same photo. A relevant photograph, rather than a generic logo, can be identified through `og:image` and `primaryImageOfPage`. These influence image selection, not guarantee it. [Google Images guidance](https://developers.google.com/search/docs/appearance/google-images)

Load noncritical photographs as they enter the viewport, without depending on clicks. Do not lazy-load the immediately visible main photograph. Google does not interact with gallery controls; inspect rendered HTML to confirm image URLs are present. [Google lazy-loading guidance](https://developers.google.com/search/docs/crawling-indexing/javascript/lazy-loading)

For product markup, use actual product photos and matching visible price/availability. Google's merchant guidance recommends clear, crawlable, high-resolution images and multiple aspect ratios; its 50,000-pixel recommendation means width × height, not 50 KB. Merchant listings require eligible purchasing pages, whereas product snippets cover a wider range of product pages. A WhatsApp enquiry flow does not automatically qualify for every merchant shopping feature. [Product overview](https://developers.google.com/search/docs/appearance/structured-data/product), [merchant image requirements](https://developers.google.com/search/docs/appearance/structured-data/merchant-listing)

`max-image-preview:large` permits larger previews; it is not a ranking boost. A `noimageindex` directive would prevent image indexing on the affected page. [Google preview controls](https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag)

### Critical finding: public photos were carrying a noindex header

The initial catalogue audit found **110 unique detail photos / 220 detail-and-card assets**. Every asset returned HTTP 200 and WebP bytes, but also `X-Robots-Tag: none`. Google's specification defines `none` as `noindex, nofollow`, including for image resources. Alt text, a sitemap and page-level preview permission cannot override this restrictive image response. [Google response-header rules](https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag)

Supabase's official Storage source supports a per-upload `x-robots-tag` override; its public-object route reads the stored value. We verified the deployed project with one temporary copy: sending `x-robots-tag: all` produced an HTTP 200 WebP response with `X-Robots-Tag: all` and the same one-year cache lifetime. Only that temporary verification copy was removed; its source was untouched. [Official upload implementation](https://github.com/supabase/storage/blob/master/src/storage/uploader.ts), [public image route](https://github.com/supabase/storage/blob/master/src/http/routes/object/getPublicObject.ts)

The chosen correction is new **byte-identical, immutable copies**, not in-place replacement, a Storage SQL edit, a query-string workaround or a paid image proxy. The migration keeps every old object and records old/new URL-keyed metadata for rollback. Estimated additional storage from the prepared manifest: **23,907,456 bytes (22.8 MiB)**. This estimate is not a guarantee of free hosting at every traffic level. Future admin uploads and the older optimization script now request the same indexing header on both variants.

### Image sitemaps

An image extension can be added to the existing sitemap or published separately. Use the `http://www.google.com/schemas/sitemap-image/1.1` namespace and `image:image` / `image:loc` elements; a page entry supports up to 1,000 images. Do not emit deprecated `image:caption`, `image:title`, `image:geo_location` or `image:license`. CDN URLs are allowed, but Google's sitemap documentation asks for both domains to be verified in Search Console. Its general image guide encourages CDN verification for error reporting. Supabase's shared hostname may not be verifiable by this business: treat this as an operational limitation, not proof that the pictures cannot be indexed. [Image sitemap specification](https://developers.google.com/search/docs/crawling-indexing/sitemaps/image-sitemaps)

### ChatGPT, Claude, Gemini and Bing are different surfaces

| Surface | Verified mechanism | Implication for KumaonRang |
| --- | --- | --- |
| ChatGPT search | `OAI-SearchBot` manages automatic search discovery. `GPTBot` is separately associated with training; `ChatGPT-User` handles user-requested visits and is not the search eligibility control. | Keep public shopping pages accessible to the search crawler and its published IP ranges. Do not silently change training preferences to pursue visibility. [Official OpenAI crawlers](https://developers.openai.com/api/docs/bots) |
| Claude search | Anthropic distinguishes `Claude-SearchBot`, `Claude-User` and training crawler `ClaudeBot`. Claude's image results are powered by Bing and include source links. | Check both Anthropic retrieval access and Bing image discovery. Allowing training is not a prerequisite to opening a public page for search. [Anthropic crawler controls](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler), [Claude image search](https://support.claude.com/en/articles/10684626-enable-and-use-web-search) |
| Google Search AI features | Ordinary Search eligibility and SEO remain relevant. Google says special AI text files and special AI schema are not required; its current guide rejects `llms.txt` ranking hacks. | Improve useful public pages and original images rather than create hidden AI-targeted pages. [AI features](https://developers.google.com/search/docs/appearance/ai-features), [generative-search guide](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide) |
| Gemini | `Google-Extended` controls use for both future Gemini training and relevant grounding. It does not determine inclusion or ranking in Google Search. Gemini can show source links, but not every answer necessarily cites a site. | Review this combined permission as an explicit business choice. Do not describe it as training-only or promise that allowing it produces recommendations. [Google crawler controls](https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers), [Gemini sources](https://support.google.com/gemini/answer/14143489?hl=en) |
| Bing and related AI discovery | Microsoft recommends canonical sitemaps, accurate modification dates and IndexNow for timely update notification. IndexNow does not guarantee crawling or indexing. | Verify the site in Bing Webmaster Tools; submit the sitemap and assess whether update notifications are useful as the catalogue grows. [Bing guidance](https://blogs.bing.com/webmaster/2025/7/Keeping-Content-Discoverable-with-Sitemaps-in-AI-Powered-Search/), [IndexNow](https://www.bing.com/indexnow/getstarted) |

Search eligibility must be checked on the deployed site and image host: a robots allowance cannot override a firewall challenge, login requirement, expired signed URL or failed image response. Changes cannot instantly rewrite a pretrained model's knowledge. No verified source here establishes that IPTC keywords, geographic EXIF fields, `llms.txt` or a particular filename forces ChatGPT/Claude/Gemini citations.

## Competitor observations, not ranking evidence

The live HTML sample from [Aipankari's Golu Devta frame](https://aipankari.com/product/golu-devta-frame/) contains six descriptive WebP files, 800 × 800 dimensions in Product image objects, and an ItemPage preferred-image association. Its gallery alts mainly repeat the product name with numbers. Initial image `src` values use placeholders with `data-src` / `data-srcset`.

The sample from [Uttarakhand Haat's Aipan collection](https://uttarakhandhaat.com/product-category/aipan-art/) contains responsive JPEGs, several camera/timestamp filenames, and a CollectionPage linked to an ImageObject. Many sampled card photographs have empty alt text; that can be appropriate when adjacent link text already communicates their purpose, so it is not automatically an accessibility failure.

These are public markup observations from a small sample, not a site-wide score or proof of why either business ranks. Our opportunity is coherent product galleries with original, product-specific descriptions and real Pithoragarh context—not imitation of competitors' copy.

## Current implementation iteration

The code iteration is designed to provide the following capabilities. Deployment and live verification are separate release gates; this document alone does not certify that production is updated.

- Add URL-keyed `image_metadata` JSONB alongside the existing product image array. Metadata remains attached to its photograph when gallery order changes; old products can use a truthful product-name fallback.
- Allow administrators to describe each uploaded photo and record dimensions. Keep the photograph URL as the lookup key, not a positional key such as `image_2`.
- Describe real product images as ImageObjects and identify the page's primary image. Do not fabricate a photographer, license, angle, material, dimension or cultural attribution.
- Include available gallery photographs in sitemap image entries automatically, including future uploads.
- Keep large-preview permission on indexable public pages, without making private/admin pages indexable.
- Preserve existing product URLs and retain all original photo objects. Change photo references only where necessary to correct the verified indexing blocker; do not bulk rename published objects solely for keyword filenames.

The established resource policy remains in [image-delivery.md](../../docs/image-delivery.md): direct public storage photographs with pre-generated WebP card/detail versions; no visitor-triggered Vercel or Supabase transformation service. New-upload targets are 960 px card / 1920 px detail, soft size budgets of 160 / 550 KiB and a quality-first approach. This work must not silently reintroduce paid transformation usage, replace full galleries with tiny thumbnails, or discard the rollback manifests.

### Data and safety requirements

1. Save only metadata for photographs belonging to that product; reject malformed or irrelevant records. Preserve older products while the new column is being rolled out.
2. Keep writes restricted to the existing authorized administrators. Public read access to catalogue descriptions does not require public upload or update permissions.
3. Never ship service-role credentials to the browser or record them in reports.
4. Treat captions as plain text, and safely serialize JSON-LD. Uploaded text must not become HTML or script.
5. Retain originals separately. A compressed storefront photograph is not an archival master.
6. Do not overwrite a year-cached file. Replacing a real photograph gets a new immutable URL; merely improving its description should retain the original URL.

**Existing authorization caveat:** the admin UI uses its email allowlist, but the inspected database/storage policies include broad authenticated access. This iteration does not widen those policies, nor does it certify that database writes are admin-only. Aligning RLS with the actual admin allowlist is a separate security task. The Supabase advisor also reports the pre-existing disabled leaked-password protection setting. [Password protection guidance](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection)

## Workflow for every future upload

1. **Name the actual product first.** Keep a natural title with its real craft/style. Use `Aipan` only when the piece is genuinely Aipan/Aipan-inspired; Pichwai, personal photo frames and other styles must keep their own identities.
2. **Choose a useful gallery.** One complete-product photograph, one meaningful close-up and one view explaining use/scale often serve customers better than six almost-identical photos. Not every product needs every shot.
3. **Review each description against the photo.** State what distinguishes the image. A number identifies a gallery position but does not prove that a photo is a back, side or detail view.
4. **Add a caption only if it helps.** Explain a visible feature, an included item or a verified making detail; do not repeat a list of keywords beneath every image.
5. **Upload once and save the product.** Use short readable filename stems based on the real product, with a collision-safe identifier. Example convention: `golu-devta-aipan-frame-<unique-id>.webp`; add an angle word only when the editor has verified that view.
6. **Check the saved public page on a phone.** Confirm the complete product remains visible, fine motif details are legible, the gallery works and the enquiry route is obvious.
7. **Confirm the saved metadata, sitemap and image responses.** Description changes must not detach from images after reorder, deletion or replacement.

Product photo alt text should convey useful visible meaning. Decorative textures need no keyword description; an empty alt is appropriate. Thumbnail controls need clear action labels without forcing screen-reader users to hear the same long description repeatedly. [W3C's alt decision tree](https://www.w3.org/WAI/tutorials/images/decision-tree/)

Do not mark every photograph “hand-painted by Sneha” merely because Sneha runs KumaonRang. Do not infer wood/MDF, measurements, religious motifs, handmade process or geographical setting from a category label. Any generated draft needs human review before it is represented as a precise photo description.

## Photo briefs and useful buying intents

The following are our recommended shoot briefs, not claims about photographs already available. Photograph real pieces in consistent daylight, keep colours honest and avoid invented hill scenery or AI-generated maker portraits. Include customer photos only with permission.

| Actual catalogue category | Useful photographs to request | Relevant intent examples to validate |
| --- | --- | --- |
| Keychains | Complete charm and hardware; a clear face/detail; genuine handheld/key-ring scale if available. Show both sides only if both are product features. | Pahadi keychains, Kumaoni keychains, Uttarakhand keepsakes; motif-specific names for the actual piece |
| Frames | Full artwork and frame boundary; a readable motif close-up; real placement and measured scale when confirmed. Back/mounting photograph if relevant. Separate Aipan-inspired pieces from other frame styles. | Aipan art frames, Golu Devta Aipan frame, Kumaoni wall art; product-specific motif and dimensions |
| Fridge Magnets | Complete magnet; real fridge placement; a close-up of painted detail. Photograph the back/attachment only if useful to explain the real item. | Pahadi fridge magnets, Uttarakhand souvenirs, Kumaon fridge magnets |
| Personalized Gifts | The real customizable area and final example, with personal details cleared for publication; presentation/packaging only if included. | Personalised Kumaoni gifts, named gift type, occasion and verified personalization option |
| Curated Hampers | Full contents together, legible item photographs and actual packaging. Make clear what is included versus styling props. Describe Pichwai jars as Pichwai, not Aipan. | Actual hamper/product name, birthday or wedding gifting where appropriate; Pichwai jar gift combo for that product |

For product pages, a buyer should be able to identify the piece, see its complete appearance, understand the important verified details and enquire without guessing. Photo briefs should answer questions such as “what is included?”, “how big is it?”, “can I personalize it?” and “how will I use it?”—not create a page for every spelling variant.

## Original small-business context

Our recommendation is to document Sneha's real work in Pithoragarh: preparing a piece, arranging a hamper, the inspiration behind a genuine motif, and how a customer customization becomes a finished object. Use her actual words, with consent; keep cultural explanations accurate and distinguish traditional Aipan practice from modern Aipan-inspired products.

Place this original context on the relevant product/guide pages, not in invisible keywords. A concise process caption plus an authentic detail photograph is more useful to this shop than generic claims such as “best premium Uttarakhand brand.” Do not invent reviews, awards, origin certifications, stock urgency, artisan biographies or shipping promises. This is a differentiation strategy, not a proven shortcut to AI recommendations.

## Rights, attribution and metadata

The owner of a photograph is not necessarily the person managing the shop. Confirm photographer/credit/copyright before publishing those fields. Google's image-rights enhancements use ImageObject or embedded IPTC data; a licensable badge requires a real license statement. Where page structured data and IPTC disagree, Google uses structured data. Compression can remove embedded attribution, so preserve confirmed rights records and original files. No license or Creative Commons permission should be invented just to eliminate a validator warning. [Google image metadata guidance](https://developers.google.com/search/docs/appearance/structured-data/image-license-metadata)

If synthetic images are introduced later, distinguish them from actual product photographs and retain the applicable provenance metadata; do not present a generated object or setting as evidence of what a customer receives. Do not copy competitors' photography or descriptions.

## Phased release and operational checklist

### Phase 1 — Technical coverage and regression tests

- [x] Retain every original object; verify byte-identical new URLs and URL-keyed metadata through a reversible indexing migration.
- [x] Check product/home image descriptions or explicitly documented truthful product-name fallbacks.
- [x] Confirm every canonical product-gallery photograph is discoverable in rendered HTML without clicking.
- [x] Validate Product/ImageObject/page-primary/share-image associations and verified encoded dimensions.
- [x] Parse image-sitemap XML; verify canonical page URLs, gallery alignment and no deprecated image tags.
- [x] Test upload, legacy primary preservation, reorder/remove, concurrent caption edits, failed-pair cleanup and persisted metadata in isolated workflow tests.
- [x] Verify the supported upload header on one temporary live Storage copy, and verify all 220 migrated public assets afterwards.
- [x] Scan generated client JavaScript and image-SEO reports for the server credential; no occurrences found.
- [ ] Align existing broad authenticated RLS with the actual admin allowlist; do not confuse UI gating with database authorization.
- [ ] Test 320/390/430 px phones and desktop; check full-photo visibility, text alternatives, gallery controls, zero new layout shift and no avoidable full-resolution downloads.

The Golu Devta gallery has been browser-tested at 320/390/430 px and 1280 px: no horizontal page overflow, images loaded, labelled 48 × 56 px photo controls, working photo selection and no console errors. This is a targeted responsive regression, not a new Lighthouse CLS measurement or a visual certification of every public page. Full-resolution photographs remain appropriate on the detail gallery; homepage/card/thumbnail views use the existing pre-generated smaller pair.

### Phase 2 — Human photograph review

- [ ] Review actual photograph-by-photograph descriptions in admin, starting with featured pieces and high-intent Aipan frames/keychains.
- [ ] Supply a real photograph for any listed product with none; do not substitute an unrelated product or pretend a placeholder is the item.
- [ ] Verify materials, measurements, customization, included hamper items and craft classification with Sneha.
- [ ] Reshoot only photographs whose lighting, clutter, colour or crop obscures the product.
- [ ] Keep attribution/permission records for maker and customer photographs.

### Phase 3 — Owner-operated search tools

- [ ] After deployment, submit/check the canonical sitemap in Google Search Console and inspect representative product URLs and their rendered images.
- [ ] Investigate the Supabase CDN-domain verification caveat. Consider a controlled image hostname only with a justified migration/redirect plan; do not rename existing assets speculatively.
- [ ] Submit the sitemap in Bing Webmaster Tools, then inspect product/image discovery and crawl errors.
- [ ] Confirm hosting/firewall rules do not challenge legitimate public search crawlers. Preserve explicit training opt-outs unless the owner deliberately changes them.
- [ ] Run Google's Rich Results Test on real deployed products; do not confuse passing markup with guaranteed rich results.

### Phase 4 — Optional merchant integrations

ChatGPT merchant-feed onboarding currently requires approval. It is a separate integration, not an automatic benefit of image SEO. Apply only if the owner wants it, then prepare compliant, current product/image URLs and verified attributes. Do not start submitting commercial feeds or enroll the business without authorization. [Official onboarding](https://developers.openai.com/commerce/guides/get-started), [product-feed specification](https://learn.chatgpt.com/commerce/specs/file-upload/products)

## Measurement: establish a baseline, then compare

Record a deployment date and compare equivalent windows, initially 28 days before/after where data exists. New-domain data may be sparse; report raw counts as well as percentages. Use longer windows when volume is small.

| Measure | What to record | Decision it informs |
| --- | --- | --- |
| Google Images | Search Console performance with search type Image: impressions, clicks, CTR, queries, product landing pages and country/device where available | Which real pieces attract relevant discovery and which descriptions/photos deserve further review |
| Bing | Webmaster Tools crawl/indexing errors, available search performance and image-query evidence; manually sample real queries without treating one result as a definitive rank | Whether Bing can discover the catalogue and where specific content gaps exist |
| AI referrals | Identifiable referrals and resulting product visits/enquiries; count citations in repeatable search-enabled prompt samples separately | Whether discovery produces useful visits, not just mentions |
| Mobile shopping | Gallery use, product-to-enquiry rate, errors and extension-free production performance | Whether photo quality and delivery support actual buying confidence |

Suggested repeatable prompt set: “Where can I find a Golu Devta Aipan frame?”, “Pahadi keychains from Kumaon”, “Uttarakhand fridge magnet gifts”, “What is Aipan art from Kumaon?” and genuine product-name queries. Record platform, date, location, search enabled/disabled, source URLs and whether the answer actually supports a purchasing decision. Answers vary; do not call a few samples an AI ranking report.

Success means more relevant discovered products, fewer crawl/access errors and more informed enquiries. A perfect Lighthouse SEO score, filename changes or allowing a bot cannot establish that KumaonRang outranks every competitor.

## Verified results and remaining release work

See [verification-2026-10-03.md](verification-2026-10-03.md) for commands, scope and evidence.

- **Storage applied:** 110 photo pairs / 220 new assets, all verified byte-for-byte and returning `X-Robots-Tag: all`; 47 product records updated, every original retained. New copies occupy 22.8 MiB. No resizing/recompression or visitor-triggered proxy was introduced.
- **Metadata applied:** additive `image_metadata` column and measured dimensions. Existing photos still use truthful product-name fallbacks until a human reviews more specific descriptions; no unverified angle, material or photographer claims were filled in.
- **Final production preview:** build and TypeScript pass; 58 public pages pass the existing SEO audit; 47 canonical product pages and 109 gallery image URLs pass the image-page/sitemap checks, including the actual homepage primary/share photo.
- **Catalogue follow-ups:** `Pahadi Happy Couple Fridge Magnet` has no photograph. Two `Om Aipan wall decor` rows currently share a public slug, so there are 48 available records but only 47 canonical product pages. The sitemap follows the router's first matching record. Product routes were not silently renamed; the duplicate needs an editorial/slug decision.
- **Live spot-check:** after the existing cache refreshed, the homepage and Golu Devta product page both returned HTTP 200 with all six sampled product-photo elements using the corrected copies. The deployed sitemap still has no image entries. These are representative page checks, not a live audit of every product.
- **Deployment pending:** code is on `codex/image-search-discoverability`, not committed/pushed/deployed in this iteration. Deploy the new cache version, image metadata/sitemap and future-upload header, then verify production galleries and `/sitemap.xml` before submitting the sitemap or claiming full live coverage.

## Repeatable local checks

Run the image helper regression suite from the repository root:

```sh
node scripts/test-product-image-seo.mjs
node scripts/test-product-image-form.mjs
node scripts/test-product-image-upload.mjs
```

It checks description/URL normalization, legacy compatibility, metadata-to-photo pairing and future-upload naming. This does not replace visually reviewing the real photographs or verifying database access.

The isolated form tests exercise real event handlers with in-memory Storage/database stubs: primary-image preservation, reorder/remove, caption edits during an upload, both indexing headers, failed-pair cleanup, save and older galleries larger than the current chooser limit. They do not create test products in production. The controlled-canvas test confirms recorded dimensions match the selected WebP bytes, including soft-budget fallback.

With an already running **production** preview, the existing public-page audit can check canonicals, unique metadata and structured product/breadcrumb presence:

```sh
node scripts/check-storefront-seo.mjs http://localhost:3001 https://www.kumaonrang.com
```

Use the actual preview port if different. Do not interpret the metadata audit alone as image indexing verification; image XML, gallery discovery, HTTP responses and owner-operated search tools remain separate checks. Save actual results with the release rather than inventing a passing score in advance.

```sh
node scripts/check-product-image-pages.mjs http://localhost:3001 https://www.kumaonrang.com
node scripts/audit-product-image-seo.mjs --report=reports/image-seo/catalogue-audit.json
```

The first checks production-rendered gallery `<img src>` elements, per-photo alt/schema agreement, known dimensions, primary/share photos and valid image-sitemap XML. The second checks the actual public Storage assets and fails if their response headers prohibit indexing. Run both: neither is an indexing/ranking guarantee.
