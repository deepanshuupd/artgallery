/**
 * WhatsApp Ordering Utility Functions
 * Handles the generation of WhatsApp messages and order links for products
 */

import type { Product, ProductCategory } from "@/types/product";
import { getDiscount } from "@/lib/pricing";

const DEFAULT_BUSINESS_NAME = "Sneha";

function getWhatsAppBusinessNumber() {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_BUSINESS_NUMBER?.replace(/\D/g, "");
  return number || "";
}

function getWhatsAppBusinessName() {
  return process.env.NEXT_PUBLIC_WHATSAPP_BUSINESS_NAME?.trim() || DEFAULT_BUSINESS_NAME;
}

export interface OrderDetails {
  productName: string;
  category: ProductCategory;
  customizationInterest?: string;
  price?: number;
  originalPrice?: number;
  quantity?: number;
}

/**
 * Generates a formatted WhatsApp message for product ordering
 * @param details - Order details containing product information
 * @returns Formatted WhatsApp message string
 */
export function generateOrderMessage(details: OrderDetails): string {
  const businessName = getWhatsAppBusinessName();
  const lines: string[] = [
    `Hi ${businessName}! 👋`,
    "",
    "I'm interested in placing an order:",
    "",
    `📦 Product Name: ${details.productName}`,
    `📂 Category: ${details.category}`,
  ];

  if (details.price) {
    const discount = getDiscount(details.price, details.originalPrice);
    if (discount) {
      lines.push(
        `💰 Price: ₹${details.price} (was ₹${discount.originalPrice}, ${discount.percent}% off)`
      );
    } else {
      lines.push(`💰 Price: ₹${details.price}`);
    }
  }

  if (details.quantity && details.quantity > 1) {
    lines.push(`📊 Quantity: ${details.quantity}`);
  }

  if (details.customizationInterest) {
    lines.push(`✨ Customization Interest: ${details.customizationInterest}`);
  }

  lines.push(
    "",
    "Please let me know about:",
    "• Available customization options",
    "• Timeline for delivery",
    "• Exact pricing with any customizations",
    "",
    "Thank you! 🙏"
  );

  return lines.join("\n");
}

/**
 * Creates a WhatsApp direct message link with pre-filled message
 * @param message - The message to pre-fill in WhatsApp
 * @returns WhatsApp link URL
 */
export function createWhatsAppLink(message: string): string {
  const businessNumber = getWhatsAppBusinessNumber();

  if (!businessNumber) {
    return `https://wa.me/?text=${encodeURIComponent(message)}`;
  }

  return `https://api.whatsapp.com/send?phone=${businessNumber}&text=${encodeURIComponent(message)}`;
}

/**
 * Generates a complete WhatsApp order link from product and customization details
 * @param product - Product object containing name, category, and price
 * @param customizationInterest - Optional customization preferences
 * @param quantity - Optional quantity (defaults to 1)
 * @returns WhatsApp link URL
 */
export function generateWhatsAppOrderLink(
  product: Product,
  customizationInterest?: string,
  quantity: number = 1
): string {
  const orderDetails: OrderDetails = {
    productName: product.name,
    category: product.category,
    price: product.price,
    originalPrice: product.originalPrice,
    customizationInterest,
    quantity,
  };

  const message = generateOrderMessage(orderDetails);
  return createWhatsAppLink(message);
}

/**
 * Opens WhatsApp with a pre-filled order message
 * Useful for button click handlers
 * @param product - Product object
 * @param customizationInterest - Optional customization details
 * @param quantity - Optional quantity
 */
export function openWhatsAppOrder(
  product: Product,
  customizationInterest?: string,
  quantity: number = 1
): void {
  const link = generateWhatsAppOrderLink(product, customizationInterest, quantity);
  window.open(link, "_blank");
}

/**
 * Creates a WhatsApp link for a general inquiry (no specific product)
 * Used by the contact page so it shares the same business number/config
 * @returns WhatsApp link URL
 */
export function generateGeneralInquiryLink(): string {
  const message = `Hi ${getWhatsAppBusinessName()}! 👋\n\nI'd love to know more about your handmade gifts and curated hampers.\n\nThank you!`;

  return createWhatsAppLink(message);
}

/**
 * Details captured by the website contact form
 */
export interface ContactFormDetails {
  name: string;
  email: string;
  message: string;
}

/**
 * Creates a WhatsApp link carrying a website contact-form submission
 * @param details - Name, email, and message from the contact form
 * @returns WhatsApp link URL
 */
export function generateContactFormLink(details: ContactFormDetails): string {
  const lines = [
    `Hi ${getWhatsAppBusinessName()}! 👋`,
    "",
    `I'm ${details.name}, reaching out through your website:`,
    "",
    details.message,
    "",
    `You can also reach me by email at ${details.email}.`,
  ];

  return createWhatsAppLink(lines.join("\n"));
}
