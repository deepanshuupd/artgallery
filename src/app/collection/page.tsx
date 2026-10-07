import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";

import { ProductShowcase } from "@/components/products/product-showcase";
import forest from "@/components/products/forest-storefront.module.css";
import { getProducts } from "@/lib/products";
import { CollectionSchema } from "@/components/seo/collection-schema";
import { collections } from "@/lib/collections";
import { OrderingGuide } from "@/components/products/ordering-guide";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  ...pageMetadata({ title: "Shop Aipan Products & Pahadi Gifts", path: "/collection", description: "Browse Aipan frames, Pahadi keychains, Uttarakhand souvenir magnets and selected personalised gifts. Compare designs and product details at KumaonRang." }),
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
  const activeCategory = collections.find(collection => collection.category === category)?.category;

  return (
    <main className={`${forest.surface} ${forest.pineBackdrop}`}>
      <CollectionSchema products={products.filter(product => product.category !== "Curated Hampers" && (!activeCategory || product.category === activeCategory))} path="/collection" name="Shop Aipan Products & Pahadi Gifts" description="Browse Aipan frames, Pahadi keychains, Uttarakhand souvenir magnets and selected personalised gifts." />
      <div className={`store-page heritage-shell ${forest.shopShell}`}>
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Shop", href: "/collection" }]} />
        <header className={`store-heading ${forest.shopHeading}`}>
          <div className={forest.headingCopy}>
            <p className="craft-eyebrow">KumaonRang · Pithoragarh</p>
            <h1>The shop</h1>
            <p>Aipan art, Pahadi keepsakes and thoughtful gifts from Kumaon.</p>
          </div>
        </header>

        <ProductShowcase
          eyebrow="Browse the collection"
          initialCategory={category}
          products={products}
          showCategoryFilter
          title="Shop by category"
        />
        <OrderingGuide />
      </div>
    </main>
  );
}
