"use client";

// Off until the owner confirms a supported analytics plan and data handling.
// Vercel custom events are paid-plan features. No new service is provisioned here.
export const commerceMeasurementEnabled = false;
type Entry = "product" | "photo_request" | "cart" | "hamper_builder" | "bulk";
type CommerceEvent = "cart_add" | "order_details_open" | "enquiry_review" | "whatsapp_handoff";

/** Never accepts customer text, names, PINs, dates, messages or full URLs. */
export function commerceEvent(event: CommerceEvent, entry: Entry, productId?: string) {
  if (!commerceMeasurementEnabled || typeof window === "undefined" || window.location.hostname !== "www.kumaonrang.com" || navigator.doNotTrack === "1") return;
  // Lazy import: no extra analytics dependency is loaded on the default path.
  void import("@vercel/analytics").then(({ track }) => {
    track(event, { entry, ...(productId ? { product: productId.slice(0, 64) } : {}) });
  }).catch(() => { /* Measurement must never interrupt shopping. */ });
}
