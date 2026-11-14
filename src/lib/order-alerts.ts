import { getSiteUrl } from "./site";
import { formatOrderAmount } from "./whatsapp";
import { orderLabel } from "./checkout";

// WhatsApp alerts to the shop owner through CallMeBot's free personal API
// (https://www.callmebot.com/blog/free-api-whatsapp-messages/). Sneha activates it
// once from her own WhatsApp; the number and key then live in Vercel's environment
// as CALLMEBOT_PHONE (with country code, e.g. +919876543210) and CALLMEBOT_APIKEY.
// Without them, alerts are simply off. Messages leave out customers' phone numbers
// and addresses: those stay in the admin.

export function alertsConfigured() {
  return Boolean(process.env.CALLMEBOT_PHONE && process.env.CALLMEBOT_APIKEY);
}

/** Sends one WhatsApp message to the owner. Never throws: an order must not fail because an alert did. */
export async function sendShopAlert(text: string) {
  const phone = process.env.CALLMEBOT_PHONE?.replace(/[^\d+]/g, ""), apikey = process.env.CALLMEBOT_APIKEY?.trim();
  if (!phone || !apikey) return false;
  try {
    const url = `https://api.callmebot.com/whatsapp.php?${new URLSearchParams({ phone, text, apikey })}`;
    const response = await fetch(url, { signal: AbortSignal.timeout(10000), cache: "no-store" });
    if (!response.ok) console.error("Shop alert was not sent", response.status);
    return response.ok;
  } catch (error) {
    console.error("Shop alert was not sent", error);
    return false;
  }
}

type AlertItem = { name: string; quantity: number };
const itemLines = (items: AlertItem[]) => items.slice(0, 6).map(item => `• ${item.quantity} × ${item.name.trim()}`).concat(items.length > 6 ? [`• and ${items.length - 6} more`] : []);
const firstName = (name: string) => name.trim().split(/\s+/)[0];

export function newOrderAlert(order: { number: number; total: number; customerName: string; city: string; items: AlertItem[] }) {
  return [
    `🛍️ *New order ${orderLabel(order.number)}* · ${formatOrderAmount(order.total)}`,
    `${firstName(order.customerName)}, ${order.city}`,
    ...itemLines(order.items),
    "Waiting for payment.",
    `${getSiteUrl()}/admin/orders?show=awaiting_payment`,
  ].join("\n");
}

export function paymentAlert(order: { number: number; total: number; customerName: string }, sent: { screenshot: boolean; reference?: string }) {
  const proof = [sent.screenshot && "a screenshot", sent.reference && `UPI ref ${sent.reference}`].filter(Boolean).join(" and ");
  return [
    `💰 *Payment sent for ${orderLabel(order.number)}* · ${formatOrderAmount(order.total)}`,
    `${firstName(order.customerName)} sent ${proof}. Check it in PhonePe, then confirm the order.`,
    `${getSiteUrl()}/admin/orders`,
  ].join("\n");
}
