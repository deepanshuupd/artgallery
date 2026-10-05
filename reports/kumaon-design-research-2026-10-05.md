# KumaonRang: place, craft, movement and purchasing

Research and design plan, 5 October 2026. No application changes are part of this research pass. Earlier local implementation changes remain in the workspace.

## Recommended direction

Build the identity around Uttarakhand: the place, people, landscape, craft and gifts. Aipan is one important expression within that identity. The homepage establishes origin; the shop helps visitors choose; the product page answers questions and makes ordering straightforward. Give each page one prominent regional visual rather than repeating all motifs everywhere.

## Reference findings

- The first supplied Pinterest pin is explicitly titled as Warli artwork from Shutterstock, and the displayed image is watermarked. It shows narrow white geometric, scalloped and hanging borders on red. Use its rhythm and restraint as inspiration; do not label that asset as authentic Kumaoni Aipan or copy the stock image into the site. https://in.pinterest.com/pin/291326669652689168/
- The second supplied pin displays white linear, dotted, curved and floral border designs on brown. Pinterest marks it “AI modified.” Its light linework is a useful visual reference, but its traditional provenance is unverified. https://in.pinterest.com/pin/1078612179537644150/
- Prefer an original border informed by the actual Aipan photograph already supplied by the user, with Sneha reviewing the motifs. Start with a small repeat of lines, triangles, dots and scallops. Keep ritual symbols in relevant art/story contexts rather than repurposing them as commercial control icons.
- Awwwards product references from the preceding research remain useful: John Hardy for gallery/purchase hierarchy; CREMERI for compact product information; Jacques Marie Mage for editorial craft presentation. These are visual references, not evidence of conversion results.

## Homepage: locate the brand in Kumaon

The current code orders sections as HeroSection, FeaturedCollections, CustomerNotes, CuratedHampersSection, HeritageStory. Place the map within HeritageStory after the hampers, replacing the floating craft wheel and enlarging the visual part of the section. This preserves early access to the catalogue and gifts while giving the origin story a memorable image.

Desktop: a large, complete Uttarakhand silhouette occupies approximately half the section; copy occupies the other half. The state outline can extend behind the composition, but the recognisable outline, division boundary and labels should remain visible. Keep decoration away from body copy. Mobile: a complete map above the copy, around 240–300px wide depending on the viewport; do not crop it into an unrecognisable background fragment.

Suggested copy direction: “From Kumaon, with a little piece of home.” Explain that Sneha and KumaonRang are based in Pithoragarh. Do not imply that every catalogue item is manufactured there unless its product information confirms that. Place a small Pithoragarh city marker on the map, with the existing business story nearby. One primary shop link, with the maker story and Aipan article as quieter supporting links.

### Geographic accuracy

The Kumaon divisional administration lists six districts: Almora, Bageshwar, Champawat, Nainital, Pithoragarh and Udham Singh Nagar. The Garhwal divisional site lists Chamoli, Dehradun, Haridwar, Pauri Garhwal, Rudraprayag, Tehri Garhwal and Uttarkashi.

Use the current administrative division as the definition of the highlighted region. Merge the six Kumaon district polygons, using the same boundary dataset as the Uttarakhand outline. The shared edge with the seven Garhwal district polygons becomes the division line. Do not approximate Kumaon as the right half of the state, omit the plains district of Udham Singh Nagar, or invent a straight north–south boundary. Administrative boundaries should not be presented as an exact boundary of all cultural identities.

Verified references:

- https://kumaon.gov.in/about-department/introduction/
- https://garhwal.uk.gov.in/
- https://surveyofindia.gov.in/pages/state-maps — lists an Uttarakhand map, 1st/2026, scale 1:500,000.
- https://stategisportal.nic.in/stategisportal/Home/Map/5 — official state GIS reference.
- https://bageshwar.nic.in/how-to-reach/ — identifies Chamoli to the west.
- https://pithoragarh.nic.in/history/ — identifies neighbouring Bageshwar and Chamoli.
- https://pauri.nic.in/geography/ — describes its neighbours, including Almora and Nainital.

The district membership is verified. A reusable boundary file and the final vector geometry have NOT been obtained or validated in this pass: the state GIS request and Survey of India download/browser navigation failed. Before drawing the final asset, obtain a usable source with suitable reuse terms and cross-check its geometry against the official map. Record the source/version. Build and simplify the geometry offline, preserving shared boundaries; ship only the small SVG, with no mapping SDK or map API calls.

### Map motion

Show the full outline immediately, then introduce the Kumaon fill and the Pithoragarh marker in a single restrained sequence of roughly 1.5–2 seconds as the section enters view. Finish in a stable, legible state. Keep the map and labels visible with JavaScript disabled or reduced motion enabled. Prefer opacity and small transforms; avoid a perpetual glowing/pulsing map. Provide nearby text identifying Kumaon so colour is not the only explanation.

## Aipan border placement

Use one thin, original motif band at the boundary of the origin-story section and an occasional smaller divider for product craft stories. On mobile, start with a 12–20px strip and generous breathing space around text. On desktop, a restrained vertical edge can accompany the origin panel. Use muted geru or white on a coloured surface. Do not frame every product, button, photograph and testimonial: repetition would weaken the special role of the craft motif and compete with merchandise.

## Shop: real wind in the trees

The current ForestCanopy is a static decorative div with an SVG background. Changing that background's position would move the whole image and would not reproduce natural branch motion.

Recommended prototype: a short, silent, stationary-camera video of real deodar/pine branches, edited into a restrained cinemagraph-like scene. Motion comes from fine branches and needles; the camera and trunk remain stable. Use verified Uttarakhand footage when claiming a place, or describe an unverified source only as a forest scene. Source owned or appropriately licensed footage. No suitable clip has been selected yet.

Keep this scene inside the shop introduction, away from filters, product photography and prices. On a phone it should be a shallow landscape panel rather than a full-screen introduction. Product results should follow promptly. The product purchase area should remain still.

Delivery: a compressed still poster loads first; attach one appropriate video source only after critical content is ready, the scene is visible, and motion is permitted. Use muted inline playback; handle autoplay rejection by retaining the poster. Pause out of view and when the document is hidden. Offer a clearly labelled pause control if motion continues, and a static experience for reduced-motion and detected data-saving preferences. Capability detection is imperfect, so the poster must always be a complete acceptable design.

Alternative if the footage cannot meet quality/performance targets: an original detailed SVG with a few separately moving branch groups. This is smaller and more controllable but remains illustration, so it is a fallback rather than a promise of photographic realism.

## Product page: convert interest into an order

Rebuild the composition rather than restyling the current large information card. Mobile structure:

1. Compact product identity and clear price; approximately 24–28px heading, with natural wrapping.
2. Uncropped photograph, visible thumbnails, swipe navigation and accessible enlargement.
3. Short factual introduction, accurate stock state, quantity and one WhatsApp order action.
4. Useful product facts in readable sections: use existing details and collect missing materials, dimensions, contents, care and relevant personalisation information instead of inventing them.
5. Craft/product story, when present, with a restrained border and an appropriate regional visual.
6. Delivery/returns guidance and relevant related items.

Desktop uses a gallery and compact purchase column aligned at the top. Extended content belongs below this composition. Remove the disabled “Direct order — Coming soon” control. A mobile purchase bar may appear when the original purchase action is off-screen; hide it during dialogs, accommodate the safe area and leave enough bottom space for content.

Replace the current fixed-height, internally scrolling details box. Show the key facts directly and let longer content expand smoothly below the purchase composition. Keep the gallery and ordering controls stable. Later page content necessarily moves when inline content grows; do not promise zero movement while revealing arbitrary amounts of text.

The WhatsApp sheet should carry over quantity, show a small product summary and product subtotal, permit an optional request, and offer “Continue to WhatsApp.” Delivery charges remain explicitly unconfirmed unless reliable rules exist. Message preview can be optional. Do not present the handoff as a completed purchase, and do not promise customisation for all products when the data does not establish eligibility.

## Colour and customer decision-making

Starting palette: cloud white #FAFBF8, mountain slate #263C46, cedar teal #28564F, mist blue #E7EEF1, apricot #F2D7BC and restrained buransh red #A64049. These are proposed visual roles, not a scientifically proven conversion palette; contrast must be measured before use. Keep the buying action consistently distinct and let product colours remain accurate.

Use origin to build recognition, actual product photography to explain the object, genuine customer comments for reassurance, and clear specifications/delivery guidance to reduce uncertainty. Use gift occasions and price ranges only where they map to real catalogue items. Avoid fabricated stock urgency, reviews, discounts or delivery promises.

Baymard's general ecommerce research identifies extra costs, delivery, trust and checkout complexity as abandonment factors. Its US checkout findings cannot be treated as measured results for KumaonRang's WhatsApp ordering journey. https://baymard.com/lists/cart-abandonment-rate

Measure product views → order-sheet opens → WhatsApp handoffs. These events still do not establish completed sales. Completed orders need reconciliation with actual order records. Judge the redesign by those outcomes and customer usability, not time spent watching the trees. Establish existing analytics coverage before selecting any instrumentation; do not introduce per-frame or scroll-event database writes.

## Performance and hosting constraints

Targets below are proposed budgets, NOT measured asset sizes or guarantees:

| Asset / change | Starting target |
|---|---|
| Simplified map plus border graphics | <=40 KB compressed combined |
| Forest poster on mobile | <=80 KB |
| Optional mobile forest clip | <=500 KB per selected source |
| Optional desktop forest clip | <=1 MB per selected source |
| Additional animation controller JS | <=5 KB compressed, no animation library |
| New database requests for decoration | Zero |

Detailed moving foliage compresses poorly; if a clip looks muddy or causes regression at the budget, retain the still image/fallback rather than raising the page cost silently. A 500 KB clip downloaded on 10,000 uncached visits is roughly 5 GB of transfer before other assets. CDN caching reduces origin work but does not make delivery to every visitor free of bandwidth accounting.

Use versioned static assets in the repository and verified cache headers. No map API, paid animation service, new realtime subscription, image-generation request during visits, WebGL scene or GIF is needed. Reserve image/video dimensions; prioritise merchandise loading and avoid large animated filters/blur. Profile on mobile: CSS animation and small file size alone do not prove smoothness.

The app currently has images.unoptimized=true in next.config.ts. Next Image therefore does not automatically create responsive optimised versions for these assets. Create suitable poster/product sizes ahead of time and serve actual variants where needed; do not merely assume the configured deviceSizes optimises source bytes.

Supabase currently lists Free allowances of 500 MB database, 1 GB file storage, 5 GB egress and 5 GB cached egress, with image transformations not included. This research did not inspect the account's actual usage. Keep decorative assets out of Supabase to reserve its capacity for catalogue data and product media. https://supabase.com/pricing

Vercel's current Hobby documentation restricts that plan to non-commercial personal use. A selling business cannot assume that staying below technical quotas makes Hobby the appropriate plan. Confirm an eligible hosting plan or alternative before a production release; local design research/prototyping can proceed. No subscription or hosting change is authorised by this report. https://vercel.com/docs/plans/hobby

Technical references:

- https://web.dev/articles/lazy-loading-video — poster, preload and loading strategies; video rather than GIF.
- https://web.dev/articles/animations-and-performance — prefer transform/opacity and measure rendering cost.
- https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide — control for automatic movement lasting more than five seconds beside other content.

## Next implementation sequence

1. Prepare and review one mobile product composition using the bell and keychain products, including the complete ordering flow. Preserve URLs, metadata, schema and the existing catalogue.
2. Obtain/validate map geometry and create the static homepage origin composition; add its brief reveal only once the static layout works.
3. Create the original narrow border and test it at phone size, using it only at the selected story boundaries.
4. Select real forest footage, export one small mobile and desktop treatment plus posters, and compare performance against the current static header. Retain motion only if it meets the budget and looks natural.
5. Verify 320–430px phones, tablets and desktops; image shapes, long names, missing photos, out-of-stock products, large text, keyboard, reduced motion, slow networks and iOS inline playback. Run the existing build/type/lint/SEO checks after implementation.

Remaining implementation inputs: reusable validated map geometry; suitable licensed/owned forest footage; confirmed product delivery/customisation facts where absent; actual hosting eligibility and usage; existing analytics coverage. No further general style research is required before producing the first concrete mobile design.
