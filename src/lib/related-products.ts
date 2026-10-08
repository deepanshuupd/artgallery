import type { Product } from "@/types/product";
import { getProductPath } from "@/lib/catalog";
import { getProductImageUrls } from "@/lib/product-image";

// Names describe the piece being sold; descriptions can mention unrelated hamper contents.
function productFamily(product: Product): string | undefined {
  const name = product.name.toLowerCase();
  if (/nameplate/.test(name)) return "nameplates";
  if (product.category === "Frames" && /aipan/.test(name)) return "aipan-decor";
  if (/photo/.test(name) && product.category === "Frames") return "photo-frames";
  if (/photo/.test(name) && product.category === "Fridge Magnets") return "photo-magnets";
  if (/pahadi|kumaon|uttarakhand/.test(name) && /Keychains|Fridge Magnets/.test(product.category)) return "regional-keepsakes";
  if (product.category === "Curated Hampers" || /hamper|gift (?:box|combo)/.test(name)) return "gift-boxes";
  if (/candle|tea\s*light|t\s*light/.test(name)) return "candles";
  if (/diya/.test(name)) return "diyas";
  if (/\bbags?\b/.test(name)) return "bags";
  if (/\bbells?\b/.test(name) && product.category !== "Keychains") return "temple-bells";
  return undefined;
}

/** Rank public, photographed alternatives by purpose, stock and nearby price. */
export function selectRelatedProducts(product: Product, products: Product[], limit = 3): Product[] {
  const family = productFamily(product);
  const narrowCategory = product.category !== "Personalized Gifts";
  const seen = new Set([getProductPath(product)]);
  return products.filter(item => {
    const path = getProductPath(item);
    if (item.id === product.id || seen.has(path) || item.published === false || !getProductImageUrls(item).length) return false;
    const relevant = family ? productFamily(item) === family : narrowCategory && item.category === product.category;
    if (!relevant) return false;
    seen.add(path);
    return true;
  }).sort((a, b) =>
    Number(a.inStock === false) - Number(b.inStock === false) ||
    Number(b.category === product.category) - Number(a.category === product.category) ||
    Math.abs(a.price - product.price) - Math.abs(b.price - product.price) ||
    getProductPath(a).localeCompare(getProductPath(b))
  ).slice(0, Math.max(0, limit));
}
