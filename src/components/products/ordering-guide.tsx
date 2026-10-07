import Link from "next/link";
import styles from "./ordering-guide.module.css";
import { shopOrdering } from "@/data/shop-ordering";

export function OrderingGuide() {
  return <section className={styles.guide} aria-labelledby="ordering-guide-title">
    <header><p className="craft-eyebrow">A conversation with Sneha</p><h2 id="ordering-guide-title">How your order comes together</h2><p>Choose a piece online, then confirm the details together on WhatsApp.</p></header>
    <ol className={styles.steps}>
      <li><span aria-hidden="true">01</span><div><h3>Find your piece</h3><p>Look through the photos, dimensions, materials and price. Open the order details and choose your quantity.</p></div></li>
      <li><span aria-hidden="true">02</span><div><h3>Share what matters</h3><p>Add your delivery PIN code, an occasion date or a personal request if you have one. Your message is ready to review before you open WhatsApp.</p></div></li>
      <li><span aria-hidden="true">03</span><div><h3>Confirm the details</h3><p>Discuss availability, the full total including delivery, preparation time and payment with Sneha before confirming your order.</p></div></li>
    </ol>
    <p className={styles.dispatch}>{shopOrdering.dispatch} Preparation time for made-to-order pieces and larger quantities is confirmed with Sneha.</p>
    <div className={styles.links}><Link prefetch={false} href="/shipping-policy">Delivery & dispatch →</Link><Link prefetch={false} href="/about">Meet Sneha →</Link><Link prefetch={false} href="/customer-stories">Read customer stories →</Link></div>
  </section>;
}
