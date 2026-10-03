import type { Product, ProductImageMetadata } from "../types/product";

type ImageProduct = Pick<Product, "name"> & Partial<Pick<Product, "image" | "images" | "imageMetadata">>;

export type ProductImageReference = ProductImageMetadata & {
  src: string;
  cardSrc: string;
  alt: string;
};

// Storage otherwise defaults to X-Robots-Tag: none, which prevents indexing.
// Keep this on BOTH immutable variants; no runtime image proxy is needed.
export const PRODUCT_IMAGE_UPLOAD_OPTIONS = {
  contentType: "image/webp",
  cacheControl: "31536000",
  upsert: false,
  headers: { "x-robots-tag": "all" },
} as const;

/** Only v2 uploads guarantee a pre-generated card alongside the detail image. */
export function productCardImage(src: string): string {
  return src.replace(
    /(\/storage\/v1\/object\/public\/product-images\/optimized\/v2\/[^/?]+)\.webp$/,
    "$1-card.webp",
  );
}

function imageUrl(value: unknown): string {
  if (typeof value !== "string") return "";
  const src = value.trim();
  if (!src || /[\u0000-\u001f\u007f\\]/.test(src)) return "";
  if (src.startsWith("/") && !src.startsWith("//")) return src;
  try {
    const url = new URL(src);
    return ["https:", "http:"].includes(url.protocol) && !url.username && !url.password ? src : "";
  } catch {
    return "";
  }
}

/** Legacy image-only rows and empty galleries still expose their primary image. */
export function getProductImageUrls(product: Partial<Pick<Product, "image" | "images">>): string[] {
  const candidates: unknown[] = [product.image, ...(Array.isArray(product.images) ? product.images : [])];
  return [...new Set(candidates.map(imageUrl).filter(Boolean))];
}

function plainObject(value: unknown): value is Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function plainText(value: unknown, maxLength: number): string | undefined {
  if (typeof value !== "string") return undefined;
  const text = value.replace(/<[^>]*>/g, " ").replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim();
  return text ? text.slice(0, maxLength).trim() : undefined;
}

function dimension(value: unknown): number | undefined {
  return typeof value === "number" && Number.isInteger(value) && value > 0 && value <= 20000 ? value : undefined;
}

/** Ignore malformed/unrelated metadata. No inferred materials, views or rights. */
export function normalizeImageMetadata(raw: unknown, urls: string[]): Record<string, ProductImageMetadata> {
  const result: Record<string, ProductImageMetadata> = {};
  if (!plainObject(raw)) return result;
  for (const src of [...new Set(urls.map(imageUrl).filter(Boolean))]) {
    if (!Object.prototype.hasOwnProperty.call(raw, src)) continue;
    const value = raw[src];
    if (!plainObject(value)) continue;
    const metadata: ProductImageMetadata = {};
    const alt = plainText(Object.hasOwn(value, "alt") ? value.alt : undefined, 300);
    const caption = plainText(Object.hasOwn(value, "caption") ? value.caption : undefined, 500);
    if (alt) metadata.alt = alt;
    if (caption) metadata.caption = caption;
    for (const key of ["width", "height", "cardWidth", "cardHeight"] as const) {
      const size = dimension(Object.hasOwn(value, key) ? value[key] : undefined);
      if (size) metadata[key] = size;
    }
    if (Object.keys(metadata).length) result[src] = metadata;
  }
  return result;
}

export function getProductImage(product: ImageProduct, source?: string): ProductImageReference {
  const urls = getProductImageUrls(product);
  const requested = imageUrl(source);
  const src = requested && urls.includes(requested) ? requested : urls[0] ?? "";
  const metadata = normalizeImageMetadata(product.imageMetadata, urls)[src] ?? {};
  return {
    ...metadata,
    src,
    cardSrc: productCardImage(src),
    alt: metadata.alt ?? plainText(product.name, 300) ?? "Product photograph",
  };
}

/** Preserve the immutable v2 card pairing; readable names are only a light SEO clue. */
export function createProductImageStem(name: string, token: string): string {
  if (!/^[a-zA-Z0-9-]{1,80}$/.test(token)) throw new Error("Invalid image identifier.");
  const slug = name.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80).replace(/-+$/g, "") || "product";
  return `optimized/v2/${slug}-${token.toLowerCase()}`;
}
