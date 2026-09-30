import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";

import { ProductShowcase } from "@/components/products/product-showcase";
import { getProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  ...pageMetadata({ title: "Shop Aipan Art, Pahadi Keychains & Gifts", path: "/collection", description: "Shop KumaonRang for Aipan-inspired art, Pahadi keychains, Uttarakhand souvenirs, personalized gifts, and handmade keepsakes from Kumaon." }),
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
    <main className="store-page heritage-shell">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Shop", href: "/collection" }]} />
        <header className="store-heading">
          <p className="craft-eyebrow">Little things. Lasting connections.</p>
          <h1>Find your piece of <em>Kumaon.</em></h1>
          <p>Aipan-inspired art, Pahadi keychains, souvenir magnets and personal gifts. Choose something that feels like home.</p>
        </header>

        <ProductShowcase
          eyebrow="Browse the collection"
          initialCategory={category}
          products={products}
          showCategoryFilter
          title="Shop by category"
        />
    </main>
  );
}
