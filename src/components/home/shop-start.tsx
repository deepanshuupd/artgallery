import Link from "next/link";

import { ProductCard } from "@/components/products/product-card";
import type { Product, ProductCategory } from "@/types/product";
import styles from "./shop-start.module.css";

const startingPoints: Array<{ category: ProductCategory; prefer: RegExp }> = [
  { category: "Frames", prefer: /golu devta/i },
  { category: "Keychains", prefer: /pahadi ladka/i },
  { category: "Fridge Magnets", prefer: /uttarakhand/i },
  { category: "Personalized Gifts", prefer: /name\s?plate/i },
];

export function ShopStart({ products }: { products: Product[] }) {
  const pieces = startingPoints.flatMap(({ category, prefer }) => {
    const available = products.filter(product => product.category === category && product.image && product.inStock !== false);
    const piece = available.find(product => prefer.test(product.name)) ?? available.find(product => product.featured) ?? available[0];
    return piece ? [piece] : [];
  });
  if (!pieces.length) return null;

  return <section className={styles.section} aria-labelledby="shop-start-title">
    <div className="heritage-shell">
      <header className={styles.heading}>
        <div><p className="craft-eyebrow">From Sneha’s shop in Pithoragarh</p><h2 id="shop-start-title">A few pieces to start with.</h2><p>A corner of home, a small keepsake, or something personal. Take a closer look at the photos, price and details.</p></div>
        <Link prefetch={false} href="/collection" className="craft-text-link">Browse the whole shop →</Link>
      </header>
      <div className="store-product-grid">{pieces.map(product => <ProductCard key={product.id} product={product} />)}</div>
      <div className={styles.note}><p>Have a gifting date or a personal request? Talk it through with Sneha before confirming your order.</p><Link prefetch={false} href="/how-to-order">See how ordering works →</Link></div>
    </div>
  </section>;
}
