import Link from "next/link";
import styles from "./ordering-guide.module.css";
import { shopOrdering } from "@/data/shop-ordering";

export function OrderingGuide() {
  return <section className={styles.guide} aria-labelledby="ordering-guide-title">
    <header><p className="craft-eyebrow">From Pithoragarh to your door</p><h2 id="ordering-guide-title">How your order comes together</h2><p>Check out on the website and pay by UPI, or ask Sneha on WhatsApp first.</p></header>
    <ol className={styles.steps}>
      <li><span aria-hidden="true">01</span><div><h3>Find your piece</h3><p>Look through the photos, dimensions, materials and price. Choose your quantity and add it to your cart, or tap Buy now.</p></div></li>
      <li><span aria-hidden="true">02</span><div><h3>Check out</h3><p>Add your delivery address, an occasion date or a personal request. You see the delivery charge and the full total before you place the order.</p></div></li>
      <li><span aria-hidden="true">03</span><div><h3>Pay by UPI</h3><p>Pay the exact total with any UPI app and enter the reference number. Sneha checks the payment and confirms your order.</p></div></li>
    </ol>
    <p className={styles.dispatch}>{shopOrdering.dispatch} Preparation time for made-to-order pieces and larger quantities is confirmed with Sneha.</p>
    <div className={styles.links}><Link prefetch={false} href="/bulk-orders">Wedding & bulk gifts →</Link><Link prefetch={false} href="/shipping-policy">Delivery & dispatch →</Link><Link prefetch={false} href="/about">Meet Sneha →</Link><Link prefetch={false} href="/customer-stories">Read customer stories →</Link></div>
  </section>;
}
