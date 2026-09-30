"use client";

import type { ProductCategory } from "@/types/product";
import { KumaonCollectionJourney } from "./kumaon-collection-journey";

export function FeaturedCollections({ images }: { images: Partial<Record<ProductCategory, string>> }) {
  return <KumaonCollectionJourney images={images} />;
}
