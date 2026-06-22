import productsData from "@/data/products/products.json";
import type { Product } from "@/types/product";

export const products = productsData as Product[];

export function getProductById(id: string) {
  return products.find((product) => product.id === id);
}

export function getRelatedProducts(currentProductId: string, category: string) {
  return products.filter(
    (product) =>
      product.id !== currentProductId && product.category === category,
  );
}
