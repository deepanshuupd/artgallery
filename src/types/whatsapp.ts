/**
 * WhatsApp Ordering Types
 * Comprehensive type definitions for the WhatsApp ordering system
 */

import type { Product, ProductCategory } from "./product";

/**
 * Details required for generating an order message
 */
export interface OrderDetails {
  /** Name of the product */
  productName: string;

  /** Product category */
  category: ProductCategory;

  /** User's customization preferences or requests */
  customizationInterest?: string;

  /** Product price in INR */
  price?: number;

  /** Order quantity */
  quantity?: number;
}

/**
 * Item in a bulk order
 */
export interface BulkOrderItem extends OrderDetails {
  /** Quantity is required for bulk orders */
  quantity: number;
}

/**
 * WhatsApp message configuration
 */
export interface WhatsAppMessageConfig {
  /** Pre-filled message text */
  message: string;

  /** Whether to open in new window */
  newWindow?: boolean;

  /** Optional callback after message generation */
  onMessageGenerated?: (message: string) => void;

  /** Optional validation function */
  validate?: (message: string) => boolean;
}

/**
 * WhatsApp order link configuration
 */
export interface WhatsAppOrderLinkConfig {
  /** Product to order */
  product: Product;

  /** Optional customization details */
  customization?: string;

  /** Order quantity (default: 1) */
  quantity?: number;

  /** Include price in message */
  includePrice?: boolean;

  /** Include quantity in message */
  includeQuantity?: boolean;
}

/**
 * WhatsApp API response types
 */
export interface WhatsAppResponse {
  /** Success status */
  success: boolean;

  /** Response message */
  message: string;

  /** Error details if any */
  error?: Error;

  /** Generated link or message */
  data?: string;
}

/**
 * WhatsApp button configuration
 */
export interface WhatsAppButtonConfig {
  /** Product to order */
  product: Product;

  /** Button text */
  text?: string;

  /** Show WhatsApp icon */
  showIcon?: boolean;

  /** CSS classes */
  className?: string;

  /** Button size */
  size?: "sm" | "md" | "lg";

  /** Button variant */
  variant?: "primary" | "secondary" | "ghost";

  /** Callback on click */
  onClick?: () => void;

  /** Callback after WhatsApp opens */
  onOpen?: () => void;
}

/**
 * Modal state and configuration
 */
export interface QuickOrderModalState {
  /** Modal visibility */
  isOpen: boolean;

  /** Selected product */
  product?: Product;

  /** Current customization text */
  customization: string;

  /** Current quantity */
  quantity: number;

  /** Generated message preview */
  messagePreview: string;

  /** Calculated total price */
  totalPrice: number;

  /** Validation errors */
  errors?: Record<string, string>;
}

/**
 * Analytics event for order tracking
 */
export interface WhatsAppOrderEvent {
  /** Event type */
  type: "order_initiated" | "order_sent" | "error" | "inquiry";

  /** Product ID */
  productId: string;

  /** Timestamp */
  timestamp: Date;

  /** Order quantity */
  quantity: number;

  /** Whether customization was requested */
  hasCustomization: boolean;

  /** Order total price */
  price: number;

  /** Additional metadata */
  metadata?: Record<string, any>;
}


