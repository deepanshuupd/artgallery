/**
 * Pricing / discount helpers.
 *
 * The `price` field on a Product is always the actual selling price. An optional
 * `originalPrice` (MRP) represents the "was" value shown struck-through. A discount
 * is only meaningful when the MRP is strictly greater than the selling price.
 */

const priceFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

/** Formats a rupee amount as e.g. "₹1,299" (no decimals, en-IN grouping). */
export function formatPrice(amount: number): string {
  return priceFormatter.format(amount);
}

export interface Discount {
  /** Rounded whole-number percentage off, always > 0. */
  percent: number;
  /** The original (struck-through) price. */
  originalPrice: number;
}

/**
 * Returns discount details when `originalPrice` is a valid number greater than
 * `price` and the rounded percentage is positive; otherwise returns null.
 */
export function getDiscount(
  price: number,
  originalPrice?: number
): Discount | null {
  if (originalPrice == null || originalPrice <= price) return null;

  const percent = Math.round(((originalPrice - price) / originalPrice) * 100);
  if (percent <= 0) return null;

  return { percent, originalPrice };
}
