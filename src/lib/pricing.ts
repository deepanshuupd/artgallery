/**
 * Pricing / discount helpers.
 *
 * The `price` field on a Product is always the actual selling price. An optional
 * `originalPrice` (MRP) represents the "was" value shown struck-through. A discount
 * is only meaningful when the MRP is strictly greater than the selling price.
 */

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
