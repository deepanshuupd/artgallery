import type { Product } from "@/types/product";
import { shopDelivery } from "@/data/shop-ordering";
import { CartValidationError, inputText, parseCartItems, parseOccasionDate, priceCartLines } from "./cart-quote";
import type { CartLine } from "./cart-state";

export const indianStates = [
  "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chandigarh", "Chhattisgarh",
  "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir",
  "Jharkhand", "Karnataka", "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
  "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal",
] as const;

export type CheckoutCustomer = { name: string; phone: string; email: string; address: string; city: string; state: string; pincode: string; occasionDate: string; notes: string };
export type CheckoutRequest = { items: CartLine[]; customer: CheckoutCustomer };
export type OrderItem = { productId: string; name: string; path: string; price: number; quantity: number; request: string };
export type CheckoutTotals = { items: OrderItem[]; subtotal: number; delivery: number; total: number };

/** Delivery for a product total, in rupees: free from the threshold, a flat charge below it. */
export function deliveryFor(subtotal: number) {
  return subtotal >= shopDelivery.freeFrom ? 0 : shopDelivery.charge;
}

/** Indian mobile numbers, accepting +91, 0 and spaces as people type them. */
export function normalisePhone(value: string) {
  const digits = value.replace(/[\s-]/g, "").replace(/^(\+91|91|0)(?=\d{10}$)/, "");
  return /^[6-9]\d{9}$/.test(digits) ? digits : "";
}

/** A UPI reference (UTR) as payment apps show it: 12 digits in most apps, letters in some. */
export function normaliseUpiReference(value: unknown) {
  const text = typeof value === "string" ? value.replace(/\s/g, "") : "";
  return /^[A-Za-z0-9]{6,35}$/.test(text) ? text : "";
}

const required = (value: unknown, maximum: number, minimum: number, message: string) => {
  const text = inputText(value, maximum).replace(/\s+/g, " ");
  if (text.length < minimum) throw new CartValidationError(message);
  return text;
};

export function parseCheckoutRequest(raw: unknown): CheckoutRequest {
  if (!raw || typeof raw !== "object") throw new CartValidationError("The checkout request is invalid.");
  const body = raw as Record<string, unknown>;
  const items = parseCartItems(body.items);
  const details = (body.customer && typeof body.customer === "object" ? body.customer : {}) as Record<string, unknown>;
  const name = required(details.name, 80, 2, "Enter the name for delivery.");
  const phone = normalisePhone(inputText(details.phone, 20));
  if (!phone) throw new CartValidationError("Enter a 10-digit Indian mobile number.");
  const email = inputText(details.email, 120);
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) throw new CartValidationError("Check the email address, or leave it empty.");
  const address = required(details.address, 300, 8, "Enter the full delivery address: house, street and area.");
  const city = required(details.city, 60, 2, "Enter the city or town.");
  const state = inputText(details.state, 60);
  if (!(indianStates as readonly string[]).includes(state)) throw new CartValidationError("Choose the state for delivery.");
  const pincode = inputText(details.pincode, 6);
  if (!/^[1-9]\d{5}$/.test(pincode)) throw new CartValidationError("Enter the 6-digit PIN code.");
  return { items, customer: { name, phone, email, address, city, state, pincode, occasionDate: parseOccasionDate(details.occasionDate), notes: inputText(details.notes, 600) } };
}

/** The order as charged: live catalogue prices, minimums and stock, plus delivery. */
export function priceCheckout(items: CartLine[], products: Product[]): CheckoutTotals {
  const { lines, subtotalPaise } = priceCartLines(items, products);
  const unavailable = lines.find(line => line.inStock === false);
  if (unavailable) throw new CartValidationError(`${unavailable.name} is out of stock. Remove it, or ask Sneha on WhatsApp about availability.`);
  const subtotal = subtotalPaise / 100;
  const delivery = deliveryFor(subtotal);
  return {
    items: lines.map(line => ({ productId: line.id, name: line.name, path: line.path, price: line.price, quantity: line.quantity, request: line.request })),
    subtotal, delivery, total: Math.round((subtotal + delivery) * 100) / 100,
  };
}

export const orderLabel = (number: number) => `KR-${number}`;
