import Link from "next/link";

import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { OrderingGuide } from "@/components/products/ordering-guide";
import { pageMetadata } from "@/lib/seo";
import forest from "@/components/products/forest-storefront.module.css";

export const metadata = pageMetadata({
  title: "How to Order | Speak with Sneha", path: "/how-to-order",
  description: "Choose your KumaonRang piece, share your delivery PIN code and occasion date, then confirm the total and timing with Sneha on WhatsApp.",
});

export default function HowToOrderPage() {
  return <main className={forest.surface}><div className={`store-page heritage-shell ${forest.shopShell}`}>
    <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "How to order", href: "/how-to-order" }]} />
    <header className={`store-heading ${forest.shopHeading}`}><div className={forest.headingCopy}><p className="craft-eyebrow">KumaonRang · Pithoragarh</p><h1>Let’s find your piece of Kumaon.</h1><p>Whether you’re choosing for yourself or someone you love, Sneha can help you check the details before you order.</p></div></header>
    <OrderingGuide />
    <section className="store-editorial" aria-labelledby="before-order-title"><h2 id="before-order-title">Before you confirm</h2><p>Ask about delivery charges, dispatch and arrival estimates, and the available payment options. Read our <Link prefetch={false} href="/returns-policy">returns and damage-support policy</Link>. For a personalised gift, check the exact wording, design and preparation time too.</p><p>Opening WhatsApp starts a conversation. Your order is confirmed with Sneha after you agree the details.</p><div className="craft-actions"><Link prefetch={false} href="/collection" className="craft-button">Browse the shop</Link><Link prefetch={false} href="/contact" className="craft-text-link">Ask a question</Link></div></section>
  </div></main>;
}
