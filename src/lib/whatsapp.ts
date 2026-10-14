import type { Product, ProductCategory } from "@/types/product";
import { brand } from "@/lib/brand";
import { getProductPath } from "@/lib/catalog";
import { getSiteUrl } from "@/lib/site";

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

export interface OrderDetails {
  productName: string; category: ProductCategory; customizationInterest?: string;
  price?: number; originalPrice?: number; quantity?: number; inStock?: boolean;
  deliveryPincode?: string; occasionDate?: string; productUrl?: string;
}
/** A compact enquiry with explicit quantities, current selling price and product reference. */
export function generateOrderMessage(details: OrderDetails): string {
  const quantity = details.quantity ?? 1;
  const lines = [`${getWhatsAppBusinessName()} | ${details.inStock === false ? "Availability enquiry" : "Order enquiry"}`,"",`Product: ${details.productName}`,`Quantity: ${quantity}`];
  if (typeof details.price === "number" && Number.isFinite(details.price)) {
    lines.push(`Unit price: ${formatOrderAmount(details.price)}`,`Product subtotal: ${formatOrderAmount(Math.round(details.price*100)*quantity/100)}`);
  }
  if (details.inStock === false) lines.push("Availability: please confirm restock");
  if (details.productUrl) lines.push(details.productUrl);
  if (details.customizationInterest?.trim()) lines.push("",`Request: ${details.customizationInterest.trim()}`);
  if (details.deliveryPincode) lines.push(`Delivery PIN code: ${details.deliveryPincode}`);
  if (details.occasionDate) lines.push(`Occasion date: ${details.occasionDate}`);
  lines.push("","Please confirm availability, shipping, delivery timing and the final total.");
  return lines.join("\n");
}
export function createWhatsAppLink(message: string): string {
  const number = getWhatsAppBusinessNumber();
  return `https://wa.me/${number ? number : ""}?text=${encodeURIComponent(message)}`;
}
export function generateProductOrderMessage(product: Product, customizationInterest?: string, quantity = 1, deliveryPincode?: string, occasionDate?: string): string {
  return generateOrderMessage({productName:product.name,category:product.category,price:product.price,quantity,inStock:product.inStock,customizationInterest,deliveryPincode,occasionDate,productUrl:`${getSiteUrl()}${getProductPath(product)}`});
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
