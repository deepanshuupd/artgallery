import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { ProductShowcase } from "@/components/products/product-showcase";
import { findCollection } from "@/lib/collections";
import { getProducts } from "@/lib/products";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ category: string }> };
export async function generateMetadata({ params }: Props) {
  const collection = findCollection((await params).category);
  if (!collection) return { title: "Collection not found", robots: { index: false } };
  const hasProducts = (await getProducts()).some(product => product.category === collection.category);
  return {
    ...pageMetadata({ title: collection.title, description: collection.description, path: `/${collection.slug}` }),
    ...(!hasProducts ? { robots: { index: false, follow: true } } : {}),
  };
}

export default async function CategoryPage({ params }: Props) {
  const collection = findCollection((await params).category);
  if (!collection) notFound();
  const products = (await getProducts()).filter(product => product.category === collection.category);
  return <main className="store-page heritage-shell">
    <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Shop", href: "/collection" }, { label: collection.label, href: `/${collection.slug}` }]} />
    <header className="store-heading"><p className="craft-eyebrow">{collection.label} · From Pithoragarh</p><h1>{collection.heading}</h1><p>{collection.intro}</p></header>
    <ProductShowcase products={products} eyebrow={collection.label} title={`Explore ${collection.label.toLowerCase()}`} showCategoryFilter initialCategory={collection.category} />
    <section className="store-editorial"><h2>{collection.note}</h2><p>{collection.detail}</p></section>
  </main>;
}
