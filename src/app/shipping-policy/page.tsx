import Link from "next/link";

import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { shopOrdering } from "@/data/shop-ordering";
import { pageMetadata } from "@/lib/seo";
import forest from "@/components/products/forest-storefront.module.css";

export const metadata = pageMetadata({
  title: "Delivery Charges & Dispatch", path: "/shipping-policy",
  description: "See how KumaonRang quotes delivery charges, dispatches in-stock pieces in 2–3 days, and confirms preparation time for made-to-order gifts.",
});

export default function ShippingPolicyPage() {
  return <main className={forest.surface}><div className={`store-page heritage-shell ${forest.shopShell}`}>
    <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Delivery & dispatch", href: "/shipping-policy" }]} />
    <header className={`store-heading ${forest.shopHeading}`}><div className={forest.headingCopy}><p className="craft-eyebrow">Before you order</p><h1>Delivery & dispatch</h1><p>Every order has its own size, quantity and destination. Confirm the cost and timing with Sneha before placing your order.</p></div></header>
    <section className="store-editorial" aria-labelledby="shipping-charge-title"><h2 id="shipping-charge-title">How delivery charges are calculated</h2><p>{shopOrdering.shipping}</p><p>Share your delivery PIN code and the pieces and quantities you’d like. A frame and a small keychain can have different packing and shipping requirements.</p></section>
    <section className="store-editorial" aria-labelledby="dispatch-title"><h2 id="dispatch-title">When your order is dispatched</h2><p>{shopOrdering.dispatch} The quantity you need is checked with Sneha before confirmation.</p><p>{shopOrdering.madeToOrder}</p></section>
    <section className="store-editorial" aria-labelledby="occasion-title"><h2 id="occasion-title">Ordering for a special date?</h2><p>Tell Sneha your occasion date when you enquire. Dispatch is the day your parcel leaves the shop; it is different from the day it arrives. Courier transit time is considered separately when you discuss your delivery estimate.</p><p>Confirm that both preparation and delivery fit your date before placing an order.</p><div className="craft-actions"><Link prefetch={false} href="/how-to-order" className="craft-button">How to order</Link><Link prefetch={false} href="/contact" className="craft-text-link">Ask Sneha about delivery</Link></div></section>
  </div></main>;
}
