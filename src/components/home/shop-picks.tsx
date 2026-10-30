import Link from "next/link";

import { ProductCard } from "@/components/products/product-card";
import type { Product, ProductCategory } from "@/types/product";
import styles from "./shop-picks.module.css";

const CATEGORY_ORDER: ProductCategory[] = [
  "Frames", "Home Decor", "Keychains", "Curated Hampers", "Personalized Gifts", "Fridge Magnets",
];
const PICK_COUNT = 6;

/**
 * Featured, photographed, in-stock pieces, one category at a time so the row
 * shows the shop's range. "Featured" is set by Sneha in the admin; these are
 * her picks, not sales rankings.
 */
export function selectShopPicks(products: Product[], count = PICK_COUNT): Product[] {
  const eligible = products.filter(product => product.featured && product.image && product.inStock !== false);
  const queues = CATEGORY_ORDER.map(category => eligible.filter(product => product.category === category));
  const picks: Product[] = [];
  while (picks.length < count && queues.some(queue => queue.length)) {
    for (const queue of queues) {
      const next = queue.shift();
      if (next && picks.length < count) picks.push(next);
    }
  }
  return picks;
}

export function ShopPicks({ products }: { products: Product[] }) {
  const picks = selectShopPicks(products);
  if (!picks.length) return null;
  return (
    <section className={styles.section} aria-labelledby="shop-picks-title">
      <div className="heritage-shell">
        <div className={styles.heading}>
          <h2 id="shop-picks-title">Sneha’s picks</h2>
          <p>A few favourites from across the shop.</p>
        </div>
        <div className={`store-product-grid ${styles.grid}`}>
          {picks.map(product => <ProductCard key={product.id} product={product} sizes="(max-width: 767px) calc((100vw - 56px) / 2), 360px" />)}
        </div>
        <Link prefetch={false} href="/collection" className={`craft-text-link ${styles.all}`}>Shop all pieces</Link>
      </div>
    </section>
  );
}
