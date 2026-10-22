import Link from "next/link";
import type { Product } from "@/types/product";
import { getProductPath } from "@/lib/catalog";
import { formatPrice } from "@/lib/pricing";
import { getMinimumPieceQuantity } from "@/lib/product-highlights";
import styles from "./collection-guide.module.css";

/** Buying answers are ordinary server HTML, shared by shoppers and crawlers. */
export function KeychainBuyingGuide({ products }: { products: Product[] }) {
  const unique = new Map<string, Product>();
  for (const product of products) {
    const path = getProductPath(product);
    if (product.published !== false && !unique.has(path)) unique.set(path, product);
  }
  const available = [...unique.values()].filter(product => product.category === "Keychains" &&
    product.published !== false && product.inStock !== false && product.name.trim() &&
    Number.isFinite(product.price) && product.price > 0);
  if (!available.length) return null;
  const prices = available.map(product => product.price);
  const low = Math.min(...prices);
  const high = Math.max(...prices);
  return <section className={`store-editorial ${styles.buyingGuide}`} aria-labelledby="keychain-gift-guide">
    <p className="craft-eyebrow">Choosing a keepsake from Kumaon</p>
    <h2 id="keychain-gift-guide">Pahadi keychains for gifts & return gifts</h2>
    <p>KumaonRang is based in Pithoragarh, Uttarakhand. Our Pahadi character and Uttarakhand designs offer a small reminder of the hills for keys or a bag. Compare the actual artwork and included pieces on each product page.</p>
    <dl className={styles.buyingFacts}>
      <div><dt>What do the available keychains cost?</dt><dd>Current listed prices {low === high ? <>are {formatPrice(low)}</> : <>range from {formatPrice(low)} to {formatPrice(high)}</>}. Delivery is extra. Set contents and minimum quantities vary by listing; a listed price is not a bulk-order quotation.</dd></div>
      <div><dt>Can I choose keychains as wedding or party return gifts?</dt><dd>Shortlist a design, then share your quantity, total budget, event date and delivery PIN code. Ask us to confirm stock, packaging, any personalisation, the final total and dispatch timing before committing to an event order.</dd></div>
      <div><dt>Are Pahadi keychains and Aipan keychains the same?</dt><dd>Pahadi describes a connection to the hills; Aipan is a particular art tradition. A Pahadi character keychain is not automatically an Aipan design. Choose from the photographs and product description, and <Link prefetch={false} href="/aipan-art">read about Aipan art</Link> if you are looking for that style.</dd></div>
    </dl>
    <h3>A few current designs to compare</h3>
    <ul className={styles.designLinks}>{available.slice(0, 3).map(product => {
      const minimum = getMinimumPieceQuantity(product);
      return <li key={getProductPath(product)}><Link prefetch={false} href={getProductPath(product)}>{product.name.trim()}</Link><span> — {formatPrice(product.price)}{minimum > 1 ? ` · minimum ${minimum} pieces` : ""}</span></li>;
    })}</ul>
    <p><Link prefetch={false} href="/uttarakhand-gifts#gift-ideas">Compare keychains with magnets, frames and other Uttarakhand gifts</Link>, or <Link prefetch={false} href="/contact">discuss your gift quantity and date</Link>.</p>
  </section>;
}
