import { brand } from "@/lib/brand";
import { shopUpi } from "@/data/shop-ordering";

// Payment goes straight to the shop's UPI ID: no gateway, so no fees.
export function getUpiPayee() {
  return /^[\w.-]{2,256}@[a-zA-Z][\w]{1,63}$/.test(shopUpi.id) ? { id: shopUpi.id, name: shopUpi.name } : undefined;
}

/** Accepts the confirmed total from a link Sneha shares, e.g. /pay?amount=1240. */
export function parseUpiAmount(value: string | string[] | undefined) {
  const text = Array.isArray(value) ? value[0] : value;
  if (!text || !/^\d{1,6}(\.\d{1,2})?$/.test(text)) return undefined;
  const amount = Number(text);
  return amount >= 1 && amount <= 100000 ? amount : undefined;
}

export function getUpiLink(payee: { id: string; name: string }, amount?: number) {
  const params = new URLSearchParams({ pa: payee.id, pn: payee.name, cu: "INR", tn: `${brand.name} order` });
  if (amount) params.set("am", amount.toFixed(2));
  // Some UPI apps only read the ID with a literal "@".
  return `upi://pay?${params.toString().replace(/\+/g, "%20").replace(/%40/g, "@")}`;
}
