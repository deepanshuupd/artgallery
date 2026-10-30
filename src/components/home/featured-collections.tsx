"use client";

import type { ProductCategory } from "@/types/product";
import type { ProductImageReference } from "@/lib/product-image";
import { KumaonCollectionJourney } from "./kumaon-collection-journey";

export function FeaturedCollections({ images, fromPrices }: {
  images: Partial<Record<ProductCategory, ProductImageReference>>;
  fromPrices?: Partial<Record<ProductCategory, number>>;
}) {
  return <KumaonCollectionJourney images={images} fromPrices={fromPrices} />;
}
