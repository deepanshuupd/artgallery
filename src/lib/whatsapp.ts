/**
 * WhatsApp Ordering Utility Functions
 * Handles the generation of WhatsApp messages and order links for products
 */

import type { Product, ProductCategory } from "@/types/product";

export interface OrderDetails {
  productName: string;
  category: ProductCategory;
  customizationInterest?: string;
  price?: number;
  quantity?: number;
}

/**
 * Generates a formatted WhatsApp message for product ordering
 * @param details - Order details containing product information
 * @returns Formatted WhatsApp message string
 */
export function generateOrderMessage(details: OrderDetails): string {
  const lines: string[] = [
    "Hi Sneha! 👋",
    "",
    "I'm interested in placing an order:",
    "",
    `📦 Product Name: ${details.productName}`,
    `📂 Category: ${details.category}`,
  ];

  if (details.price) {
    lines.push(`💰 Price: ₹${details.price}`);
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
  return `https://wa.me/?text=${encodeURIComponent(message)}`;
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
 * Creates a WhatsApp link for inquiry (without specific customization)
 * @param product - Product to inquire about
 * @returns WhatsApp link URL
 */
export function generateWhatsAppInquiryLink(product: Product): string {
  const message = `Hi Sneha! 👋\n\nI'm interested in learning more about the ${product.name} (${product.category}).\n\nPlease share:\n• Detailed product information\n• Customization options available\n• Pricing and delivery timeline\n\nThank you!`;

  return createWhatsAppLink(message);
}

/**
 * Validates WhatsApp message length (WhatsApp has character limits)
 * @param message - Message to validate
 * @returns Boolean indicating if message is within acceptable length
 */
export function isValidWhatsAppMessage(message: string): boolean {
  // WhatsApp messages can be quite long, but we'll use a reasonable limit
  const MAX_LENGTH = 4096;
  return message.length <= MAX_LENGTH;
}

/**
 * Generates a bulk order message for multiple products
 * @param products - Array of products with order details
 * @returns Formatted bulk order message
 */
export interface BulkOrderItem extends OrderDetails {
  quantity: number;
}

export function generateBulkOrderMessage(items: BulkOrderItem[]): string {
  let message = "Hi Sneha! 👋\n\nI'd like to place a bulk order:\n\n";

  let totalPrice = 0;
  items.forEach((item, index) => {
    message += `${index + 1}. ${item.productName} (${item.category})\n`;
    if (item.quantity && item.quantity > 1) {
      message += `   Quantity: ${item.quantity}\n`;
    }
    if (item.price) {
      const itemTotal = item.price * (item.quantity || 1);
      message += `   Price: ₹${itemTotal}\n`;
      totalPrice += itemTotal;
    }
    if (item.customizationInterest) {
      message += `   Customization: ${item.customizationInterest}\n`;
    }
    message += "\n";
  });

  if (totalPrice > 0) {
    message += `Total Estimated: ₹${totalPrice}\n\n`;
  }

  message += "Please confirm availability and provide exact pricing.\n\nThank you!";

  return message;
}
