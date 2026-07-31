import { CuratedHampersSection } from "@/components/home/curated-hampers-section";
import { FeaturedCollections } from "@/components/home/featured-collections";
import { HeroSection } from "@/components/home/hero-section";
import { getProducts } from "@/lib/products";
import type { Product, ProductCategory } from "@/types/product";

export const dynamic = "force-dynamic";

// A specific product to feature per category (falls back to the first product
// in the category, then a known-good image). Categories without an entry just
// use the first product in that category.
const PREFERRED_IMAGES: Partial<
  Record<ProductCategory, { name: string; fallback: string }>
> = {
  Keychains: {
    name: "Pahadi Ladka Keychain",
    fallback:
      "https://psqdrmdyucsyiuugvitd.supabase.co/storage/v1/object/public/product-images/1784226676459.jpeg",
  },
  Frames: {
    name: "Handmade Aipan wall decor with pichora background",
    fallback:
      "https://psqdrmdyucsyiuugvitd.supabase.co/storage/v1/object/public/product-images/1784829433073-qvqke5znec.jpeg",
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
      <HeroSection />
      <FeaturedCollections images={categoryImages} />
      <CuratedHampersSection />
    </main>
  );
}
