/** Only v2 uploads guarantee a pre-generated card alongside the detail image. */
export function productCardImage(src: string): string {
  return src.replace(
    /(\/storage\/v1\/object\/public\/product-images\/optimized\/v2\/[^/?]+)\.webp$/,
    "$1-card.webp",
  );
}
