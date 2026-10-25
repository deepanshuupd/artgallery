import type { Product } from "@/types/product";
import { getProductPath } from "@/lib/catalog";
import { getProductImage } from "@/lib/product-image";
import { getSiteUrl } from "@/lib/site";
import { createWhatsAppLink, formatOrderAmount, formatOrderDate, orderEnquiryHeading, orderUnit, quoteOrderRequest } from "@/lib/whatsapp";

export type BulkProduct = { path: string; name: string; price: number; unit: string };
export type BulkEnquiry = {
  occasion: string; quantity: string; budget: string; date: string;
  pincode: string; packaging: string;
};

/** Real, photographed catalogue choices; inclusion is not a promise of bulk stock. */
export function getBulkProducts(products: Product[]): BulkProduct[] {
  const unique = new Map<string, BulkProduct>();
  for (const product of products) {
    const path = getProductPath(product);
    if (product.published === false || product.inStock === false || !getProductImage(product).src ||
      !product.name.trim() || !Number.isFinite(product.price) || product.price <= 0 || unique.has(path)) continue;
    unique.set(path, { path, name: product.name.trim(), price: product.price, unit: orderUnit(product.name, product.category).one });
  }
  return [...unique.values()];
}

export function prepareBulkEnquiry(details: BulkEnquiry, product?: BulkProduct) {
  const quantity = Number(details.quantity);
  const budget = Number(details.budget);
  if (!/^\d+$/.test(details.quantity) || !Number.isSafeInteger(quantity) || quantity < 1 || quantity > 9999) throw new Error("Enter a quantity between 1 and 9,999 gifts.");
  if (details.budget && (!/^\d+(?:\.\d{1,2})?$/.test(details.budget) || !Number.isFinite(budget) || budget <= 0)) throw new Error("Enter a positive budget per gift, or leave it blank.");
  if (details.pincode && !/^\d{6}$/.test(details.pincode)) throw new Error("Enter a 6-digit delivery PIN code, or leave it blank.");
  if (details.date && (!/^\d{4}-\d{2}-\d{2}$/.test(details.date) || formatOrderDate(details.date) === details.date)) throw new Error("Check your occasion date.");
  const message = [orderEnquiryHeading("Wedding & bulk gifts"), "From: KumaonRang website /bulk-orders", "",
    ...(details.occasion.trim() ? ["Occasion:", quoteOrderRequest(details.occasion.slice(0, 120))] : []),
    product ? `Preferred design: ${product.name}` : "Design: please help me choose",
    ...(product ? [`Product link: ${getSiteUrl()}${product.path}`, `Listed reference price: ${formatOrderAmount(product.price)} per ${product.unit} (not a bulk quote)`] : []),
    `Gifts needed: ${quantity}`,
    ...(details.budget ? [`Budget per gift: ${formatOrderAmount(budget)} (please confirm what fits, including packaging)`] : []),
    ...(details.date ? [`Occasion date: ${formatOrderDate(details.date)}`] : []),
    ...(details.pincode ? [`Delivery PIN code: ${details.pincode}`] : []),
    ...(details.packaging.trim() ? ["", "Packaging / personalisation request:", quoteOrderRequest(details.packaging.slice(0, 600))] : []),
    "", "Please confirm the design, pieces per gift, available quantity, any minimum order, packaging, preparation and delivery timing, and an itemised total including shipping before I decide.",
    "This is a quote enquiry, not a confirmed order.",
  ].join("\n");
  return { message, url: createWhatsAppLink(message) };
}
