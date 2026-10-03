"use client";

import type { ProductCategory } from "@/types/product";
import type { ProductImageReference } from "@/lib/product-image";
import { KumaonCollectionJourney } from "./kumaon-collection-journey";

export function FeaturedCollections({ images }: { images: Partial<Record<ProductCategory, ProductImageReference>> }) {
  return <KumaonCollectionJourney images={images} />;
}
