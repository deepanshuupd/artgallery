import Link from "next/link";

import { ResponsiveImage } from "@/components/responsive-image";
import { getProductPath } from "@/lib/catalog";
import { formatPrice } from "@/lib/pricing";
import { getProductImage } from "@/lib/product-image";
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

/** A quiet shelf after the collection journey: photo, name, price. */
export function ShopPicks({ products }: { products: Product[] }) {
  const picks = selectShopPicks(products);
  if (!picks.length) return null;
  return (
    <section className={styles.section} aria-labelledby="shop-picks-title">
      <div className={styles.inner}>
        <header className={styles.heading}>
          <h2 id="shop-picks-title">Sneha’s picks</h2>
          <Link prefetch={false} href="/collection" className={styles.all}>Shop all <span aria-hidden="true">→</span></Link>
        </header>
        <ul className={styles.shelf} data-product-shelf>
          {picks.map(product => {
            const image = getProductImage(product);
            return (
              <li key={product.id}>
                <Link prefetch={false} href={getProductPath(product)} className={styles.item}>
                  <span className={styles.photo}>
                    <ResponsiveImage src={image.cardSrc} alt={image.alt} fill className={styles.image}
                      sizes="(max-width: 767px) 42vw, (max-width: 1099px) 26vw, 180px" />
                  </span>
                  <span className={styles.name}>{product.name.trim()}</span>
                  <span className={styles.price}>{formatPrice(product.price)}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
