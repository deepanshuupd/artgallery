# KumaonRang: a shop people feel confident buying from

Updated 7 October 2026. The immediate buying experience remains WhatsApp, as
confirmed by the owner. Preserve existing product URLs, honest cultural labels,
real photographs and the KumaonRang identity.

## Buyer questions

1. **Is this for me?** Show actual products, prices and useful collection choices
   early. Help shoppers distinguish home decor, small keepsakes and personal gifts.
2. **What will arrive?** Give dimensions, materials, included pieces, photographs
   showing scale and detail, and the exact scope of personalisation.
3. **Can I trust this shop?** Connect products to Sneha's real story and the existing
   customer messages. Do not label all products as made by Sneha without evidence,
   invent ratings, or present enquiry clicks as completed orders.
4. **Can it arrive in time?** Separate preparation, dispatch and courier transit.
   Display the owner's actual guidance and quote the full total before confirmation.
5. **What happens next?** Make WhatsApp ordering understandable, with optional PIN
   code, quantity, occasion date and custom request, plus a message preview.

These are hypotheses to evaluate against actual enquiries and confirmed orders,
not guaranteed conversion or ranking improvements.

## Business guidance confirmed today

- Shipping charges depend on packed weight and dimensions; no flat price or free
  shipping threshold has been invented.
- Requested quantities already in stock dispatch in 2–3 days. No business-day
  definition or courier arrival guarantee was supplied.
- Making/drawing and larger quantities need preparation time confirmed individually.
- The owner requests damage reports within one week of receipt and does not accept
  change-of-mind returns. Replacement/refund choice, return shipping costs and
  resolution timing have not been specified. Public wording asks customers to
  confirm the resolution and shipping arrangements with Sneha.
- Consumer protection rights remain preserved for defective, incorrect or
  misdescribed goods; the policy does not impose an absolute refusal of remedies.

Shared confirmed text lives in `src/data/shop-ordering.ts`.

## First implementation: shopping and ordering confidence

- Homepage: actual products with prices before the animated collection journey;
  clearer shop CTA and founder context; customer proof before the cultural section.
- Product: removed unavailable direct-checkout action; visible dispatch, delivery
  and damage-support information; ordering guide and founder/customer-story links.
- WhatsApp: country-code correction; optional PIN code and occasion date carried
  into the preview and prepared enquiry. An occasion date is a request to check
  feasibility, not a promised arrival date.
- Published routes: `/how-to-order`, `/shipping-policy`, `/returns-policy`.
  Linked in the footer and sitemap. Their appearance in Google remains unverified.
- Contact and shop pages explain what to share and how confirmation works.

No production deployment, database migration, product price change, outbound
message, payment integration, new tracker or fabricated product fact is included.

## Next 90 days

| Period | Priority | Owner and completion evidence |
| --- | --- | --- |
| Days 1–7 | Review and release this first iteration; confirm damage remedies and payment methods; collect GSC baseline | Engineering: live HTTP/HTML and mobile checks. Sneha: confirm actual commercial terms. |
| Days 8–21 | Improve 8–12 products with the clearest customer demand | Sneha: dimensions, materials, scale/close-up photos, personalisation boundaries. Engineering: surface confirmed facts. |
| Days 22–35 | Refine collection choices and related products using existing inventory | Engineering/content: distinct shopping purposes, relevant products, retained URLs. New Aipan categories require actual matching products. |
| Days 36–60 | Publish 3–4 buying/process guides; use them in Instagram and relevant partnerships | Sneha/content: original process evidence and customer questions. Track enquiries by product and source. |
| Days 61–90 | Reach 6–8 useful guides total; improve pages using collected evidence | Review query/page traffic, qualified enquiries, confirmed orders, delivery problems and contribution margin. |

Obtain actual dimensions and care instructions before writing them. Do not create
new SKUs, cultural origin claims or city pages solely for keywords. No universal
word-count quota is used.

## Measurement and release decisions

Measure product views, order-detail opens and WhatsApp handoffs separately from
confirmed and fulfilled orders. Add analytics only once the data source, consent
handling and order reconciliation are chosen. A simple order log can record
product, source, quoted total, confirmed status and outcome; avoid public exposure
of customer information.

Compare equivalent 28-day GSC windows by query, page, country and device. Diagnose
indexing exclusions individually. Do not prune useful young pages for having zero
impressions, or treat a Lighthouse score as a ranking forecast.

After release, verify the preferred production host and consolidate the permanent
Vercel hostname while preserving development/preview access. Merchant Center is
deferred while the shop uses an enquiry-only ordering flow. Google Business Profile
requires actual in-person eligibility; nationwide parcel shipping is insufficient.

## Research used

- Etsy: [Building buyer trust](https://www.etsy.com/seller-handbook/article/6-ways-to-build-trust-with-buyers/39525144574)
- Etsy: [Telling the shop story](https://www.etsy.com/in-en/seller-handbook/article/22636178725)
- Baymard: [Shipping costs on product pages](https://baymard.com/research-articles/show-shipping-costs-on-product-pages)
- Baymard: [Showing product scale](https://baymard.com/research-articles/in-scale-product-images)
- Government of India: [Consumer Protection (E-Commerce) Rules](https://consumeraffairs.gov.in/public/upload/files/E%20commerce%20rules_1732703966.pdf), especially rule 7(4).

The installed Next.js package is 15.5.19 and has no bundled `dist/docs` directory;
the official version-specific Server/Client Component and Link guides were read
before editing.
