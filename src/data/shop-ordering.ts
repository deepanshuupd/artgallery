// The website checkout (Buy now, /checkout, UPI on the order page) stays off until the
// delivery rule is final. Turn it on with NEXT_PUBLIC_CHECKOUT_ENABLED=true: in Vercel's
// environment for production (then redeploy), or in .env.local to try it locally.
// While it is off, ordering works as before: a WhatsApp enquiry, then UPI once Sneha confirms.
export const checkoutEnabled = process.env.NEXT_PUBLIC_CHECKOUT_ENABLED === "true";

// Delivery rule confirmed by the owner on 14 November 2026: ₹100 on orders
// whose product total is below ₹1,799, free from ₹1,799.
export const shopDelivery = { charge: 100, freeFrom: 1799 } as const;

// Business guidance confirmed by the owner on 7 October 2026.
// Dispatch means handing the parcel to the courier, not arrival at the destination.
export const shopOrdering = {
  shipping: checkoutEnabled
    ? "Delivery is ₹100 on orders below ₹1,799 and free on orders of ₹1,799 or more (product total). The delivery charge is shown at checkout before you pay."
    : "Delivery charges depend on the packed parcel’s weight and dimensions. Sneha confirms the delivery charge and full order total before you confirm your order.",
  dispatch: "If your requested quantity is in stock, dispatch takes 2–3 days.",
  madeToOrder: "For pieces that need drawing or making, preparation time depends on the product and quantity. Sneha confirms the timing for your order in your chat.",
  damage: "If your piece arrives damaged, please contact Sneha within 7 days of receiving it, with your order details and clear photos of the item and packaging.",
  // Updated 14 November 2026: checkout on the website, paid by UPI with no payment gateway.
  payment: checkoutEnabled
    ? "Pay by UPI at checkout: scan the QR code or open your UPI app with the exact total, then upload a screenshot or enter the UPI reference number. Sneha checks the payment and confirms your order. You can also ask her on WhatsApp first and pay once she confirms."
    : "Pay by UPI once Sneha has confirmed your order total, including delivery, on WhatsApp. Scan the QR code or pay to the UPI ID she shares, then send her the UPI reference number.",
  // Confirmed by the owner on 14 November 2026.
  personalisation: "If a personalisation request needs extra cost, Sneha messages you before making it. You can pay the difference or cancel for a full refund.",
  changeOfMind: "Change-of-mind returns, exchanges and refunds are not accepted, including for personalised pieces.",
} as const;

// Read from Sneha's PhonePe QR on 31 October 2026. UPI works from any UPI app, not only PhonePe.
export const shopUpi = { id: "8266064457@ibl", name: "Sneha Upadhyaya" } as const;
