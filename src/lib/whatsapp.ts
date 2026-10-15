import type { Product, ProductCategory } from "@/types/product";
import { brand } from "@/lib/brand";
import { getProductPath } from "@/lib/catalog";
import { getSiteUrl } from "@/lib/site";
import { getProductHighlights } from "@/lib/product-highlights";

function getWhatsAppBusinessNumber() {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_BUSINESS_NUMBER?.replace(/\D/g, "") ?? "";
  if (/^\d{10}$/.test(number)) return `91${number}`;
  if (/^0\d{10}$/.test(number)) return `91${number.slice(1)}`;
  return number;
}
function getWhatsAppBusinessName() {
  return process.env.NEXT_PUBLIC_WHATSAPP_BUSINESS_NAME?.trim() || brand.name;
}
const amountFormatter = new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",minimumFractionDigits:0,maximumFractionDigits:2});
export const formatOrderAmount = (amount: number) => amountFormatter.format(amount);

// The receiver's configured name may be Sneha; identify the shop in every order.
export const orderEnquiryHeading = (kind: string) => `*${brand.name} | ${kind} enquiry*`;
const oneLine = (value: string) => value.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
/** Keep customer text distinct from catalogue prices and generated instructions. */
export const quoteOrderRequest = (value: string) => value.trim().split(/\r?\n/).map(line => `> ${line}`).join("\n");
export function formatOrderDate(value: string): string {
  const date = new Date(`${value}T00:00:00Z`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || Number.isNaN(date.getTime()) || date.toISOString().slice(0,10) !== value) return value;
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(date);
}
export function orderDeliveryLines(pincode?: string, date?: string): string[] {
  if (!pincode && !date) return [];
  return ["", "*Delivery*", ...(pincode ? [`Delivery PIN code: ${pincode}`] : []), ...(date ? [`Occasion date: ${formatOrderDate(date)}`] : [])];
}
/** Only explicit catalogue facts; no generated sales copy or inferred specs. */
export function productOrderFacts(product: Pick<Product, "details">): string[] {
  return getProductHighlights(product)
    .filter(fact => ["Size", "Material", "Included"].includes(fact.label))
    .map(fact => `${fact.label}: ${oneLine(fact.value)}`)
    .filter(fact => fact.length <= 180).slice(0,3);
}
export function orderUnit(name: string, category?: ProductCategory) {
  if (category === "Curated Hampers") return { one: "hamper", many: "hampers" };
  if (/\bset\s+of\b/i.test(name)) return { one: "set", many: "sets" };
  if (/\bpair\s+of\b/i.test(name)) return { one: "pair", many: "pairs" };
  return { one: "item", many: "items" };
}
export function orderItemLines(details: OrderDetails, index = 1): string[] {
  const quantity = details.quantity ?? 1;
  const unit = orderUnit(details.productName, details.category);
  const lines = [`*${index}. ${oneLine(details.productName)}*`, `Category: ${details.category}`,
    ...(details.facts ?? []), `Quantity: ${quantity} ${quantity === 1 ? unit.one : unit.many}`];
  if (typeof details.price === "number" && Number.isFinite(details.price) && details.price >= 0) {
    lines.push(`Unit price: ${formatOrderAmount(details.price)} per ${unit.one}`,
      `Item total: ${formatOrderAmount(Math.round(details.price*100)*quantity/100)}`);
  }
  if (details.inStock === false) lines.push("Availability: please confirm restock");
  if (details.customizationInterest?.trim()) lines.push("Request for this item:", quoteOrderRequest(details.customizationInterest));
  if (details.productUrl) lines.push(`Product link: ${details.productUrl}`);
  return lines;
}
export const orderEstimateNote = "Estimate only. Shipping and any customisation costs are extra, to be confirmed.";
export const orderConfirmationNote = "Please confirm availability, delivery timing, payment options and the final total before I place the order.";

export interface OrderDetails {
  productName: string; category: ProductCategory; customizationInterest?: string;
  price?: number; originalPrice?: number; quantity?: number; inStock?: boolean;
  deliveryPincode?: string; occasionDate?: string; productUrl?: string;
  facts?: string[];
}
/** A compact enquiry with explicit quantities, current selling price and product reference. */
export function generateOrderMessage(details: OrderDetails): string {
  const kind = details.inStock === false ? "Availability" : details.category === "Curated Hampers" ? "Curated hamper" : "Order";
  const lines = [orderEnquiryHeading(kind), "From: KumaonRang website", "", ...orderItemLines(details)];
  if (typeof details.price === "number" && Number.isFinite(details.price) && details.price >= 0) {
    lines.push("", `*Product subtotal: ${formatOrderAmount(Math.round(details.price*100)*(details.quantity ?? 1)/100)}*`, orderEstimateNote);
  }
  lines.push(...orderDeliveryLines(details.deliveryPincode, details.occasionDate), "", orderConfirmationNote);
  return lines.join("\n");
}
export function createWhatsAppLink(message: string): string {
  const number = getWhatsAppBusinessNumber();
  return `https://wa.me/${number ? number : ""}?text=${encodeURIComponent(message)}`;
}
export function generateProductOrderMessage(product: Product, customizationInterest?: string, quantity = 1, deliveryPincode?: string, occasionDate?: string): string {
  return generateOrderMessage({productName:product.name,category:product.category,price:product.price,quantity,inStock:product.inStock,customizationInterest,deliveryPincode,occasionDate,facts:productOrderFacts(product),productUrl:`${getSiteUrl()}${getProductPath(product)}`});
}
export function generateWhatsAppOrderLink(product: Product, customizationInterest?: string, quantity = 1, deliveryPincode?: string, occasionDate?: string): string {
  return createWhatsAppLink(generateProductOrderMessage(product,customizationInterest,quantity,deliveryPincode,occasionDate));
}
export function openWhatsAppOrder(product: Product, customizationInterest?: string, quantity = 1, deliveryPincode?: string, occasionDate?: string): void {
  window.open(generateWhatsAppOrderLink(product,customizationInterest,quantity,deliveryPincode,occasionDate),"_blank","noopener,noreferrer");
}
export function generateGeneralInquiryLink(): string {
  return createWhatsAppLink(`${getWhatsAppBusinessName()} | Product enquiry\n\nI would like information about your handmade gifts and gift hampers.`);
}
export interface ContactFormDetails { name: string; email: string; message: string }
export function generateContactFormLink(details: ContactFormDetails): string {
  return createWhatsAppLink([`${getWhatsAppBusinessName()} | Website enquiry`,`Name: ${details.name}`,...(details.email ? [`Email: ${details.email}`] : []),"",details.message].join("\n"));
}
