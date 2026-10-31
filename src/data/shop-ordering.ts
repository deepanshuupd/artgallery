// Business guidance confirmed by the owner on 7 October 2026.
// Dispatch means handing the parcel to the courier, not arrival at the destination.
export const shopOrdering = {
  shipping: "Delivery charges depend on the packed parcel’s weight and dimensions. Sneha confirms the delivery charge and full order total before you confirm your order.",
  dispatch: "If your requested quantity is in stock, dispatch takes 2–3 days.",
  madeToOrder: "For pieces that need drawing or making, preparation time depends on the product and quantity. Sneha confirms the timing for your order in your chat.",
  damage: "If your piece arrives damaged, please contact Sneha within 7 days of receiving it, with your order details and clear photos of the item and packaging.",
  // Added 31 October 2026: payment by UPI, with no payment gateway.
  payment: "Pay by UPI once Sneha has confirmed your order total, including delivery, on WhatsApp. Scan the QR code or pay to the UPI ID she shares, then send her the UPI reference number.",
  changeOfMind: "Change-of-mind returns, exchanges and refunds are not accepted, including for personalised pieces.",
} as const;

// Read from Sneha's PhonePe QR on 31 October 2026. UPI works from any UPI app, not only PhonePe.
export const shopUpi = { id: "8266064457@ibl", name: "Sneha Upadhyaya" } as const;
