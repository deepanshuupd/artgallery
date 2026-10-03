import type { Product, ProductCategory } from "@/types/product";

/**
 * Public category paths intentionally use the language customers search for,
 * while the database can keep its simple internal category labels.
 */
const categoryPaths: Record<ProductCategory, string> = {
  Keychains: "pahadi-keychains",
  Frames: "aipan-frames",
  "Fridge Magnets": "uttarakhand-souvenirs",
  "Personalized Gifts": "kumaoni-gifts",
  "Curated Hampers": "curated-hampers",
};

const categoryByPath = new Map(
  Object.entries(categoryPaths).map(([category, path]) => [path, category as ProductCategory]),
);

/** Name-based fallback for demo data; live products persist their first slug. */
export function slugify(value: string): string {
  const slug = value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || "handmade-gift";
}

export function getCategoryPath(category: ProductCategory): string {
  return categoryPaths[category];
}

export function getCategoryFromPath(
  categoryPath: string,
): ProductCategory | undefined {
  return categoryByPath.get(categoryPath);
}

export function getProductSlug(product: Product): string {
  return product.slug?.trim() || slugify(product.name);
}

export function getProductPath(product: Product): string {
  return `/${getCategoryPath(product.urlCategory ?? product.category)}/${getProductSlug(product)}`;
}

export function getProductByPublicSlug(
  products: Product[],
  categoryPath: string,
  productSlug: string,
): Product | undefined {
  const category = getCategoryFromPath(categoryPath);
  if (!category) return undefined;

  return products.find(
    (product) =>
      product.published !== false &&
      (product.urlCategory ?? product.category) === category && getProductSlug(product) === productSlug,
  );
}
