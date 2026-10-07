import Link from "next/link";

import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { shopOrdering } from "@/data/shop-ordering";
import { pageMetadata } from "@/lib/seo";
import { createWhatsAppLink } from "@/lib/whatsapp";
import forest from "@/components/products/forest-storefront.module.css";

export const metadata = pageMetadata({
  title: "Returns & Damage Support", path: "/returns-policy",
  description: "Contact Sneha within 7 days if your KumaonRang piece arrives damaged. Read the change-of-mind policy and how to ask for help with your order.",
});

export default function ReturnsPolicyPage() {
  return <main className={forest.surface}><div className={`store-page heritage-shell ${forest.shopShell}`}>
    <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Returns & damage support", href: "/returns-policy" }]} />
    <header className={`store-heading ${forest.shopHeading}`}><div className={forest.headingCopy}><p className="craft-eyebrow">Help with your order</p><h1>Returns & damage support</h1><p>If something is wrong with your piece, contact Sneha with the details so your concern can be reviewed.</p></div></header>
    <section className="store-editorial" aria-labelledby="damage-title"><h2 id="damage-title">If your piece arrives damaged</h2><p>{shopOrdering.damage}</p><p>Keep the packaging while your concern is reviewed. Sneha will discuss the resolution and any return-shipping arrangements with you. Please confirm the instructions before sending an item back.</p><div className="craft-actions"><a className="craft-button" href={createWhatsAppLink("Hi Sneha, I need help with a piece that arrived damaged. I’ll share my order details, delivery date and photos of the item and packaging.")} target="_blank" rel="noopener noreferrer">Ask Sneha for help<span className="sr-only"> (opens WhatsApp in a new tab)</span></a></div></section>
    <section className="store-editorial" aria-labelledby="change-of-mind-title"><h2 id="change-of-mind-title">Choosing your piece</h2><p>{shopOrdering.changeOfMind}</p><p>Before confirming your order, check the photos, dimensions, materials and any custom wording with Sneha. If you’re unsure about a detail, ask before the piece is prepared.</p></section>
    <section className="store-editorial" aria-labelledby="other-concerns-title"><h2 id="other-concerns-title">Other order concerns</h2><p>If you receive an incorrect item or believe your piece is defective or differs from what you agreed, contact Sneha with your order details.</p><p>This policy does not restrict your rights under applicable consumer protection law.</p><div className="craft-actions"><Link prefetch={false} href="/contact" className="craft-text-link">Contact KumaonRang</Link><Link prefetch={false} href="/shipping-policy" className="craft-text-link">Delivery & dispatch details</Link></div></section>
  </div></main>;
}
