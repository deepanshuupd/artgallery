import type { Metadata } from "next";

import { ProductShowcase } from "@/components/products/product-showcase";
import { getProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Collection",
  description:
    "Shop KumaonRang for Aipan-inspired art, Pahadi keychains, Uttarakhand souvenirs, personalized gifts, and handmade keepsakes from Kumaon.",
  keywords: [
    "handmade Aipan keychain",
    "Aipan art frame",
    "Uttarakhand fridge magnet",
    "personalized Pahadi gifts",
    "Kumaon souvenirs online",
  ],
};

type CollectionPageProps = {
  searchParams: Promise<{ category?: string }>;
};

export default async function CollectionPage({
  searchParams,
}: CollectionPageProps) {
  const [products, { category }] = await Promise.all([
    getProducts(),
    searchParams,
  ]);

  return (
    <main className="relative overflow-hidden px-4 py-6 sm:px-6 lg:px-8 lg:py-20">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-x-0 top-0 h-48 bg-[radial-gradient(circle_at_top,rgba(201,164,106,0.12),transparent_68%)]" />
      </div>

      <div className="mx-auto max-w-7xl">
        <section className="max-w-3xl">
          <p className="text-[0.72rem] uppercase tracking-[0.36em] text-stone-500 sm:text-xs">
            Made for your everyday
          </p>
          <h1 className="mt-2 font-serif text-3xl leading-tight text-stone-900 sm:text-5xl">
            Shop KumaonRang
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-700 sm:text-lg">
            Browse Aipan art, Pahadi keychains, souvenir magnets and personal gifts
            from Pithoragarh.
          </p>
        </section>

        <ProductShowcase
          eyebrow="Browse the collection"
          initialCategory={category}
          products={products}
          showCategoryFilter
          title="Shop by category"
        />
      </div>
    </main>
  );
}
