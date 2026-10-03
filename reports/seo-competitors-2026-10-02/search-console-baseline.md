# KumaonRang Google Search baseline

Observed read-only in the owner's Google Search Console on **2 October 2026**. Property: `sc-domain:kumaonrang.com`. Search type: Web. No country, device or query filter was applied. This is a snapshot, not an exported historical dataset.

## What the available data actually says

| View | Clicks | Impressions | CTR | Average position | Query rows |
| --- | ---: | ---: | ---: | ---: | --- |
| Latest 24 hours, chart 1–2 October | 3 | 3 | 100% | 1.3 | No data disclosed |
| 3-month selector, displayed chart only 28–29 September | 0 | 0 | 0% | 0 | No data disclosed |

The latest-data indicator was approximately 8.5 hours behind during inspection. The **Page indexing** report said it was processing data and to check again in a day or so; it did not provide a usable indexed-page count.

Interpretation: there is too little reported data to establish a non-brand ranking baseline, trend, market share or conversion rate. The 1.3 position is an average for the tiny reported sample, **not a rank of 1.3 for “Aipan art” or any other identified keyword**. The zeroes in the longer-period view do not establish that the site has no Google visibility; the 24-hour view already reports impressions and clicks.

Search Console omits some low-volume queries for privacy. Without disclosed query rows, the observed traffic cannot reliably be labelled branded or non-branded. See Google's explanations of [performance metrics](https://support.google.com/webmasters/answer/7042828?hl=en) and [missing query data](https://support.google.com/webmasters/answer/17011259?hl=en).

## Page-level observations in the 24-hour view

These positions are **page aggregates across undisclosed queries**, not keyword ranks. All paths below use `https://www.kumaonrang.com`.

| Page path | Clicks | Impressions | Average position |
| --- | ---: | ---: | ---: |
| `/` | 2 | 2 | 1.5 |
| `/aipan-frames/handmade-aipan-spiritual-decor` | 0 | 2 | 3.0 |
| `/curated-hampers/rakhii-hamper` | 0 | 2 | 5.0 |
| `/kumaoni-gifts/3-layer-lotus-brass-diya` | 0 | 2 | 6.0 |
| `/pahadi-keychains/i-uttarakhand-pahadi-couple-keychain` | 0 | 2 | 7.0 |
| `/aipan-frames/customized-black-photo-frame` | 0 | 1 | 6.0 |
| `/aipan-frames/ram-naam-frame` | 0 | 1 | 6.0 |
| `/aipan-frames/om-aipan-wall-decor` | 0 | 1 | 7.0 |
| `/uttarakhand-souvenirs/personalized-arcylic-fridge-magnet-without-stand` | 0 | 1 | 7.0 |
| `/aipan-frames/handmade-ganesh-aipan-wall-decor` | 0 | 1 | 8.0 |
| `/aipan-frames/handmade-om-aipan-wall-frame` | 0 | 1 | 9.0 |
| `/uttarakhand-souvenirs/pahadi-happy-couple-fridge-magnet` | 0 | 1 | 9.0 |
| `/curated-hampers/the-happiness-box` | 0 | 1 | 10.0 |

Do not sum these rows to reconstruct the property headline. Search Console's [property and page aggregation differ](https://support.google.com/webmasters/answer/17011364?hl=en); the report is also sparse and recent.

## Public technical snapshot

- The production sitemap returned HTTP 200 and contained **58 unique public URLs**: 47 product pages, four category pages and seven other pages.
- An exact-domain discovery query returned no results in the research search tool. This is **not** Google's URL Inspection tool and is not evidence that the site is deindexed. The Search Console observations above are stronger evidence of some Google visibility.
- The sitemap establishes URL publication, not stock, indexation or rankings.

## Measurement after this iteration

1. Once reporting is populated, compare complete 28-day periods with the previous 28 days. Also keep an annotated deployment date; today's changes have not yet been deployed.
2. Review queries per destination cluster: Aipan frames, keychains, magnets, personalised gifts and hampers. Separate searches containing KumaonRang spelling variants from non-brand discovery.
3. Record impressions, clicks, CTR and average position together. Filter India/mobile when there is enough data to avoid misleading tiny samples.
4. Track product enquiries and completed orders separately from rankings. A WhatsApp button click is an enquiry signal, not proof of a sale.
5. Use URL Inspection for key commercial pages if indexing remains unclear. Do not submit repetitive requests or create duplicate keyword pages.
6. For exact competitor keyword ranks, search volume and difficulty, obtain a dated India database export from a ranking-data provider such as Ahrefs or Semrush. Keep provider estimates separate from Search Console's first-party site data.
