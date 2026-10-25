# One-person shop: enquiry to repeat customer

Prepared 25 October 2026. This is an operating checklist, not new commercial terms.
No customer messages are sent, accounts created or orders collected by this document.

## The same five checks, every time

1. Confirm the linked design and selling unit: one item, pair, set or hamper.
2. Confirm exact quantity, dimensions, material, included contents and any personalisation.
3. Quote products, custom work, packaging and shipping separately, with a final payable total.
4. Separate preparation/dispatch from courier transit. Check the requested occasion date before accepting it.
5. Confirm payment arrangements and order acceptance in the chat; record the agreed specification there.

For a group order, also agree quantity **per design**, individual gift packing,
names/wording, whether a sample/proof is needed, any design-specific minimum, and
the delivery arrangement. Do not promise a sample, discount, fixed lead time or
split delivery unless it is actually available and included in the quote.

## A private log, not a public customer database

Keep the actual log in a private, access-controlled location **outside this Git
repository**. This table is an empty template only. Leave names, phone numbers,
addresses, payment details and customer messages in the appropriate private tools;
do not copy them into analytics, reports, screenshots, public files or commits.

| Local enquiry reference | Enquiry date | Source / entry route | Product URL / design | Quantity / selling unit | Quoted total incl. shipping | Status | Agreed dispatch | Follow-up permission | Outcome / reason |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

Statuses: new enquiry → awaiting details → quote shared → confirmed → dispatched
→ delivered. Also allow declined, cancelled and no response. A site click, prepared
message or WhatsApp handoff **never** means confirmed, paid or delivered.

Use a simple locally assigned reference to reconcile a chat with a log entry;
do not make customers type a long tracking code. Ask “Where did you find us?” only
when useful. A self-reported source is not reliable cross-device attribution.

## Useful replies (review and send personally)

**Before confirming:** “Thanks for choosing [design]. Please check: [quantity and
selling unit], [included pieces], [size/material], [exact custom wording],
[packaging]. Products ₹[ ], custom work/packing ₹[ ], delivery ₹[ ]; total ₹[ ].
The agreed dispatch is [ ]; courier arrival is [confirmed estimate, if known].
Please confirm these details before we arrange payment.”

**Ask permission:** “Would you like one message after delivery to check everything
arrived safely and share the relevant care guidance?” Record yes/no. Do not treat a
purchase or social follow as permission for ongoing promotions.

**After delivery, only with permission:** “Did your [piece] arrive safely? If you
have a question, send a photo here. [Only confirmed care instructions.] If you’d
like, you can share honest feedback. May we separately have your permission to
show it on the website, with your chosen name and without private details?”

Do not offer a discount conditional on a positive review, fabricate ratings,
publish screenshots without permission, send repeated chasers or auto-subscribe
buyers. Keep reminders occasional, useful and permission-based; honour opt-outs.

## Weekly review: twenty minutes, not a new full-time job

- Count qualified enquiries, quotes, confirmed orders and delivered orders separately.
- Note recurring questions, delivery uncertainty, missing product facts and reasons a quote did not progress.
- Fix the highest-friction listing first, using genuine photos and confirmed specifications.
- Compare equivalent complete 28-day Search Console windows by page/query/device.
  Keep Web and Image search separate; ignore daily zero-click noise at this scale.
- For referrals, prepare original product photos, a factual founder introduction
  and a useful guide link for relevant local features. Contact publishers only
  when authorised. No bought links or invented collaborations.

## Measurement prepared in code, deliberately not activated

`src/lib/commerce-events.ts` is **off by default**. Existing Vercel pageviews already
cover product-page visits. Prepared custom stages: `cart_add`,
`order_details_open`, `enquiry_review`, `whatsapp_handoff`. Entry is product,
photo request, cart, hamper builder or bulk. Only an entry label and optional
catalogue ID are passed; no message, PIN, customer name, date, budget or address.

The helper only runs on the preferred production hostname when enabled, respects
Do Not Track, lazy-loads the existing SDK and fails without blocking shopping.
No new dependency, cookie system, paid plan or analytics account was added.

**Activation needs an owner decision:** Vercel custom events require a supported
paid plan. Authenticated plan access was unavailable during this task. Confirm
plan/cost and data handling before enabling; do not upgrade automatically. Verify
real dashboard receipt after release, with one controlled test, and exclude test
traffic. Counts are not a user-level funnel or completed-order conversion rate.

Sources checked 25 October 2026:
- https://vercel.com/docs/analytics/custom-events
- https://vercel.com/docs/analytics/limits-and-pricing
