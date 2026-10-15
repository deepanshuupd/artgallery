# WhatsApp ordering improvements — 15 October 2026

## Scope

Improve the existing enquiry workflow, not replace it with a checkout or send
messages automatically. Covered single products, cart orders, ready-made curated
hampers and the custom-hamper builder. No database, storage, authentication or
payment changes. No WhatsApp messages sent during verification.

## Changes

- Shared item formatting: shop/flow heading, product name and category, up to
  three short explicitly labelled catalogue facts, quantity, selling unit, unit
  price, line total, item-specific request and canonical product link.
- No copied marketing paragraphs, discount claims, invented contents or prices.
- Distinct quoted customer requests versus factual catalogue information.
- Cart-wide notes stay separate from individual item requests. The existing
  server quote still checks current published products/prices and minimum orders;
  client-supplied prices remain untrusted.
- Selling units distinguish items, sets, pairs and hampers. The order sheet and
  cart show the same units. Cart number inputs now retain accessible names even
  where their visual labels are hidden.
- Dates are readable (for example, `22 Nov 2026`) and timezone-independent.
- Product subtotals remain estimates. Shipping, customisation costs, availability,
  delivery timing, payment options and the final total are confirmed in the chat.
- Custom hampers show the number of hampers, per-hamper quantities and totals
  across all hampers. Gift-note wording is separate from assembly/design requests.
  The message asks for per-hamper and whole-order quotes without inventing prices.
- A shared mobile-friendly preview and copy-message fallback cover all paths.
  The customer must review the draft and press Send in WhatsApp; opening the app
  does not place, pay for or confirm an order.

## Verification

- `node --test scripts/test-cart.mjs scripts/test-hamper-builder.mjs scripts/test-product-indexability.mjs`: 24 tests pass.
- `npx tsc --noEmit --incremental false`: passes.
- Isolated production build: passes compilation, lint and type checking.
- Browser: Golu Devta frame, quantity 2, current unit price ₹1,400, subtotal ₹2,800,
  catalogue size/material and item request appear correctly. Copy confirmation works.
- Browser: real cart quote API refreshes catalogue data; prepared preview exactly
  equals the decoded `wa.me` text; final heading identifies KumaonRang, not just
  the WhatsApp contact name. Optional date renders as `22 Nov 2026`.
- Browser: Pichwai Jar Gift Combo, quantity 2 hampers, current unit price ₹299,
  item/subtotal ₹598 and consistent selling-unit labels.
- Browser: three custom hampers, one pendant/pair of earrings/personal note each:
  every selected type shows 1 per hamper and 3 total. Gift-note wording and the
  special request survive. Preview equals link text; no invented rupee amount.
- Phone width 390 px: page and dialog widths both 390 px, no horizontal overflow.
  Desktop width restored to 1440 px; page width matches. No browser console errors
  in the checked product flow.
- All WhatsApp checks stopped before opening/sending a chat. Existing carts and
  public catalogue data were not cleared or modified; only synthetic selections
  were created on the isolated local preview origin.

Preview: `http://localhost:3017/`. The agent-created tab is left at the custom
hamper review, with synthetic sample details, for inspection. Mobile screenshot:
`/tmp/kumaon-whatsapp-order-preview-2026-10-15.jpg`.

The unrelated Aipan-guide working changes were preserved. No commit or push was
requested or performed in this turn.

## Practical next step for fulfilment

Keep the enquiry separate from the confirmed order. After checking the request,
reply with the agreed items/quantities, customisation, total including shipping,
dispatch/delivery expectations and payment instructions, then ask the customer to
confirm. Do not describe the website draft as a saved order or generate a fake
order number when no order record exists.
