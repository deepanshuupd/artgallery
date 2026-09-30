import type { Metadata } from "next";
import { homeTitle, homeDescription } from "@/lib/seo";

import { CuratedHampersSection } from "@/components/home/curated-hampers-section";
import { FeaturedCollections } from "@/components/home/featured-collections";
import { HeroSection } from "@/components/home/hero-section";
import { HeritageStory } from "@/components/home/heritage-story";
import { getProducts } from "@/lib/products";
import type { Product, ProductCategory } from "@/types/product";

export const metadata: Metadata = {
  title: { absolute: homeTitle },
  description: homeDescription,
  keywords: [
    "Aipan art gifts online",
    "handmade Uttarakhand souvenir",
    "Pahadi keychain Uttarakhand",
    "Kumaoni heritage gifts",
    "gift from Uttarakhand",
  ],
};

export const revalidate = 60;

// A specific product to feature per category (falls back to the first product
// in the category, then a known-good image). Categories without an entry just
// use the first product in that category.
const PREFERRED_IMAGES: Partial<
  Record<ProductCategory, { name: string; fallback: string }>
> = {
  Keychains: {
    name: "Pahadi Ladka Keychain",
    fallback:
      "https://psqdrmdyucsyiuugvitd.supabase.co/storage/v1/object/public/product-images/optimized/v1/d2582d2e4077096ce1d8d2790e1b9851412564587d27c47cf9d40aa3baf18062.webp",
  },
  Frames: {
    name: "Handmade Aipan wall decor with pichora background",
    fallback:
      "https://psqdrmdyucsyiuugvitd.supabase.co/storage/v1/object/public/product-images/optimized/v1/ea0983888853db1ff0a31cafa25ceb8c0f64ba5e054e1b72c27fe18f8a49fd0a.webp",
  },
};

const FEATURED_CATEGORIES: ProductCategory[] = [
  "Keychains",
  "Frames",
  "Fridge Magnets",
  "Personalized Gifts",
];

export default async function HomePage() {
  const products = await getProducts();
  const culturalFeaturedProduct =
    products.find((product) => /aipan|pahadi|pichora|kumaon/i.test(product.name)) ??
    products[0];

  const imageFor = (category: ProductCategory): string | undefined => {
    const preferred = PREFERRED_IMAGES[category];

    if (preferred) {
      const match = products.find(
        (product: Product) =>
          product.name.trim().toLowerCase() === preferred.name.toLowerCase()
      );
      if (match?.image) return match.image;
    }

    const firstInCategory = products.find(
      (product: Product) => product.category === category
    )?.image;

    return firstInCategory ?? preferred?.fallback;
  };

  const categoryImages: Partial<Record<ProductCategory, string>> = {};
  for (const category of FEATURED_CATEGORIES) {
    const image = imageFor(category);
    if (image) categoryImages[category] = image;
  }

  return (
    <main>
      <HeroSection featuredProduct={culturalFeaturedProduct} />
      <FeaturedCollections images={categoryImages} />
      <HeritageStory />
      <CuratedHampersSection product={products.find((product) => product.category === "Curated Hampers" && product.image)} />
    </main>
  );
}
