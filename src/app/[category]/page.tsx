import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { ProductShowcase } from "@/components/products/product-showcase";
import { collections, findCollection } from "@/lib/collections";
import { getProducts } from "@/lib/products";
import { pageMetadata } from "@/lib/seo";
import { CollectionSchema } from "@/components/seo/collection-schema";
import styles from "@/components/products/collection-guide.module.css";
import forest from "@/components/products/forest-storefront.module.css";

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
  const catalogue = await getProducts();
  const products = catalogue.filter(product => product.category === collection.category);
  const categoryCounts = Object.fromEntries(collections.map(item => [item.category, catalogue.filter(product => product.category === item.category).length]));
  return <main className={forest.surface}>
    <CollectionSchema products={products} path={`/${collection.slug}`} name={collection.title} description={collection.description} />
    <div className={`store-page heritage-shell ${forest.shopShell}`}>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Shop", href: "/collection" }, { label: collection.label, href: `/${collection.slug}` }]} />
      <header className={`store-heading ${forest.shopHeading}`}>
        <div className={forest.headingCopy}>
          <p className="craft-eyebrow">{collection.label} · Pithoragarh</p>
          <h1>{collection.heading}</h1>
          <p>{collection.intro}</p>
        </div>
      </header>
      <ProductShowcase products={products} categoryCounts={categoryCounts} eyebrow={collection.label} title={`Explore ${collection.label.toLowerCase()}`} showCategoryFilter initialCategory={collection.category} />
      <section className="store-editorial" aria-labelledby="collection-guide-title">
        <h2 id="collection-guide-title">{collection.note}</h2>
        <p>{collection.detail}</p>
        <div className={styles.questions}>
          {collection.questions.map(({ question, answer }) => <details key={question} className={styles.question}>
            <summary>{question}</summary>
            <p className={styles.answer}>{answer}</p>
          </details>)}
        </div>
        <div className={styles.guide}>
          <p>{collection.guide.lead}</p>
          <Link prefetch={false} href={collection.guide.href}>{collection.guide.label}<span aria-hidden="true"> →</span></Link>
        </div>
      </section>
    </div>
  </main>;
}
