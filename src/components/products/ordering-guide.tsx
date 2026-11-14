import Link from "next/link";
import styles from "./ordering-guide.module.css";
import { checkoutEnabled, shopOrdering } from "@/data/shop-ordering";

export function OrderingGuide() {
  return <section className={styles.guide} aria-labelledby="ordering-guide-title">
    {checkoutEnabled
      ? <header><p className="craft-eyebrow">From Pithoragarh to your door</p><h2 id="ordering-guide-title">How your order comes together</h2><p>Check out on the website and pay by UPI, or ask Sneha on WhatsApp first.</p></header>
      : <header><p className="craft-eyebrow">A conversation with Sneha</p><h2 id="ordering-guide-title">How your order comes together</h2><p>Choose a piece online, then confirm the details together on WhatsApp.</p></header>}
    {checkoutEnabled ? <ol className={styles.steps}>
      <li><span aria-hidden="true">01</span><div><h3>Find your piece</h3><p>Look through the photos, dimensions, materials and price. Choose your quantity and add it to your cart, or tap Buy now.</p></div></li>
      <li><span aria-hidden="true">02</span><div><h3>Check out</h3><p>Add your delivery address, an occasion date or a personal request. You see the delivery charge and the full total before you place the order.</p></div></li>
      <li><span aria-hidden="true">03</span><div><h3>Pay by UPI</h3><p>Pay the exact total with any UPI app, then upload a screenshot or enter the reference number. Sneha checks the payment and confirms your order.</p></div></li>
    </ol> : <ol className={styles.steps}>
      <li><span aria-hidden="true">01</span><div><h3>Find your piece</h3><p>Look through the photos, dimensions, materials and price. Open the order details and choose your quantity.</p></div></li>
      <li><span aria-hidden="true">02</span><div><h3>Share what matters</h3><p>Add your delivery PIN code, an occasion date or a personal request if you have one. Your message is ready to review before you open WhatsApp.</p></div></li>
      <li><span aria-hidden="true">03</span><div><h3>Confirm and pay</h3><p>Agree availability, the full total including delivery and preparation time with Sneha, then pay by UPI.</p></div></li>
    </ol>}
    <p className={styles.dispatch}>{shopOrdering.dispatch} Preparation time for made-to-order pieces and larger quantities is confirmed with Sneha.</p>
    <div className={styles.links}><Link prefetch={false} href="/bulk-orders">Wedding & bulk gifts →</Link><Link prefetch={false} href="/shipping-policy">Delivery & dispatch →</Link><Link prefetch={false} href="/about">Meet Sneha →</Link><Link prefetch={false} href="/customer-stories">Read customer stories →</Link></div>
  </section>;
}
