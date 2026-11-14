import Link from "next/link";

import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { OrderingGuide } from "@/components/products/ordering-guide";
import { shopOrdering } from "@/data/shop-ordering";
import { getUpiPayee } from "@/lib/payment";
import { pageMetadata } from "@/lib/seo";
import forest from "@/components/products/forest-storefront.module.css";

export const metadata = pageMetadata({
  title: "How to Order | Speak with Sneha", path: "/how-to-order",
  description: "Order from KumaonRang: add pieces to your cart, check out with your delivery address and pay by UPI. Delivery ₹100, free from ₹1,799. Or ask Sneha on WhatsApp first.",
});

export default function HowToOrderPage() {
  return <main className={forest.surface}><div className={`store-page heritage-shell ${forest.shopShell}`}>
    <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "How to order", href: "/how-to-order" }]} />
    <header className={`store-heading ${forest.shopHeading}`}><div className={forest.headingCopy}><p className="craft-eyebrow">KumaonRang · Pithoragarh</p><h1>Let’s find your piece of Kumaon.</h1><p>Check out on the website and pay by UPI, or ask Sneha on WhatsApp first if you’d like to check the details.</p></div></header>
    <OrderingGuide />
    <section className="store-editorial" aria-labelledby="before-order-title"><h2 id="before-order-title">Before you order</h2><p>{shopOrdering.shipping} Read our <Link prefetch={false} href="/returns-policy">returns and damage-support policy</Link>. {shopOrdering.personalisation}</p><p>Prefer to talk first? Send your cart to Sneha as a WhatsApp enquiry. Opening WhatsApp starts a conversation; it does not place an order.</p></section>
    <section className="store-editorial" aria-labelledby="payment-title"><h2 id="payment-title">Paying for your order</h2><p>{shopOrdering.payment}</p>{getUpiPayee() && <p>Agreed a total with Sneha on WhatsApp? <Link prefetch={false} href="/pay">Open the UPI payment page</Link></p>}<div className="craft-actions"><Link prefetch={false} href="/collection" className="craft-button">Browse the shop</Link><Link prefetch={false} href="/contact" className="craft-text-link">Ask a question</Link></div></section>
  </div></main>;
}
