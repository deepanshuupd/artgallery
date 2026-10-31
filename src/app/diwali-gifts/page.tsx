import Link from "next/link";

import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { ProductCard } from "@/components/products/product-card";
import { CollectionSchema } from "@/components/seo/collection-schema";
import { shopOrdering } from "@/data/shop-ordering";
import { getDiwaliGroups } from "@/lib/diwali-gifts";
import { getProducts } from "@/lib/products";
import { pageMetadata } from "@/lib/seo";
import forest from "@/components/products/forest-storefront.module.css";
import styles from "@/components/products/diwali-gifts.module.css";

export const dynamic = "force-dynamic";

const description = "Diwali gifts and decor from KumaonRang in Pithoragarh: bandarwars for the doorway, brass diyas and candles, puja essentials and ready-to-give hampers. Pay by UPI.";

export const metadata = pageMetadata({ title: "Diwali Gifts & Decor from Kumaon", path: "/diwali-gifts", description });

export default async function DiwaliGiftsPage() {
  const groups = getDiwaliGroups(await getProducts());
  const products = groups.flatMap(group => group.products);
  return <main className={forest.surface}><div className={`store-page heritage-shell ${forest.shopShell}`}>
    <CollectionSchema products={products} path="/diwali-gifts" name="Diwali gifts & decor" description={description} />
    <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Diwali gifts", href: "/diwali-gifts" }]} />
    <header className={`store-heading ${forest.shopHeading}`}><div className={forest.headingCopy}>
      <p className="craft-eyebrow">KumaonRang · Pithoragarh</p>
      <h1>Diwali gifts &amp; decor</h1>
      <p>A bandarwar for the door, a diya to light, something for the puja corner or a hamper to carry when you visit.</p>
    </div></header>
    <p className={styles.timing}><strong>Ordering for a date?</strong> {shopOrdering.dispatch} Share your delivery PIN code and the date you need it by, and Sneha will confirm whether it can arrive in time.</p>
    {groups.length ? groups.map(group => <section key={group.id} className={styles.group} aria-labelledby={`diwali-${group.id}`}>
      <header><h2 id={`diwali-${group.id}`}>{group.title}</h2><p>{group.note}</p></header>
      <div className="store-product-grid">{group.products.map(product => <ProductCard key={product.id} product={product} />)}</div>
    </section>) : <p className={styles.timing}>The Diwali pieces are being restocked. <Link prefetch={false} href="/collection">Browse the shop</Link> or ask Sneha on WhatsApp.</p>}
    <section className="store-editorial" aria-labelledby="diwali-order-title">
      <h2 id="diwali-order-title">Gifting to many people?</h2>
      <p>For office or family gifting in larger quantities, share the pieces, quantity and date, and Sneha will confirm what is possible. {shopOrdering.payment}</p>
      <div className="craft-actions"><Link prefetch={false} href="/bulk-orders" className="craft-button">Plan bulk gifts</Link><Link prefetch={false} href="/how-to-order" className="craft-text-link">How ordering works</Link></div>
    </section>
  </div></main>;
}
