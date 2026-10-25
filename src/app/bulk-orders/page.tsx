import Image from "next/image";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { BulkOrderForm } from "@/components/products/bulk-order-form";
import { JsonLd } from "@/components/seo/json-ld";
import { getBulkProducts } from "@/lib/bulk-orders";
import { getGiftGuideIdeas } from "@/lib/gift-guide";
import { getProducts } from "@/lib/products";
import { getProductImage } from "@/lib/product-image";
import { getProductPath } from "@/lib/catalog";
import { formatPrice } from "@/lib/pricing";
import { pageMetadata } from "@/lib/seo";
import { getSiteUrl } from "@/lib/site";
import styles from "@/components/products/bulk-orders.module.css";

export const dynamic = "force-dynamic";
export const metadata = pageMetadata({ title: "Wedding Return Gifts & Bulk Gift Enquiries", path: "/bulk-orders", description: "Plan wedding return gifts, team gifts or a family celebration with Sneha at KumaonRang. Browse real pieces and share quantity, budget, date and packaging needs." });

export default async function BulkOrdersPage() {
  const products = await getProducts();
  const examples = getGiftGuideIdeas(products).filter(idea => idea.category !== "Frames" && idea.product);
  return <main className={`heritage-shell ${styles.page}`}>
    <JsonLd data={{ "@context": "https://schema.org", "@type": "WebPage", "@id": `${getSiteUrl()}/bulk-orders#page`, url: `${getSiteUrl()}/bulk-orders`, name: "Wedding return gifts & bulk gift enquiries", description: "Discuss quantities, designs, packaging and delivery with Sneha at KumaonRang in Pithoragarh.", isPartOf: { "@id": `${getSiteUrl()}#website` } }} />
    <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Wedding & bulk gifts", href: "/bulk-orders" }]} />
    <header className={styles.intro}>
      <p className="craft-eyebrow">Wedding · Family · Team gifting</p>
      <h1>Many gifts.<br /><em>The same personal care.</em></h1>
      <p>Little reminders of Kumaon, for the people coming together. Plan your wedding return gifts, team thank-yous or family celebration with Sneha in Pithoragarh.</p>
      <a className={styles.primary} href="#bulk-enquiry">Plan your gifts</a>
      <p className={styles.hint}>A small business, a conversation with the person behind it. Quantities and timing are confirmed individually.</p>
    </header>
    {examples.length > 0 && <section className={styles.ideas} aria-labelledby="bulk-ideas-title"><h2 id="bulk-ideas-title">A few places to begin.</h2><p>Explore existing designs, then discuss the quantity and finishing touches. Each listing shows its own photos, details and selling unit.</p>
      <div className={styles.grid}>{examples.map(({ product, title }) => {
        if (!product) return null;
        const image = getProductImage(product);
        return <Link key={product.id} href={getProductPath(product)} prefetch={false} className={styles.piece}><div><Image src={image.cardSrc} alt={image.alt} fill sizes="(max-width: 767px) 44vw, 260px" /></div><span>{title}</span><h3>{product.name.trim()}</h3><p>{formatPrice(product.price)} <small>listed price · view details</small></p></Link>;
      })}</div>
    </section>}
    <div className={styles.planning}>
      <BulkOrderForm products={getBulkProducts(products)} />
      <aside className={styles.checklist} aria-labelledby="bulk-check-title"><p className="craft-eyebrow">Before you confirm</p><h2 id="bulk-check-title">Know what’s in every gift.</h2><ol><li><strong>The exact piece</strong><p>Design, materials, dimensions and the number of pieces included in each gift.</p></li><li><strong>The finishing touches</strong><p>Names, notes and individual packaging, with any additional costs agreed first.</p></li><li><strong>The practical details</strong><p>Available quantity, preparation time, delivery charge and whether your occasion date is feasible.</p></li></ol><p>Sneha confirms the itemised total and payment arrangements on WhatsApp before you place an order.</p><nav aria-label="Gifting help"><Link prefetch={false} href="/shipping-policy">Delivery & dispatch</Link><Link prefetch={false} href="/customer-stories">Real customer messages</Link><Link prefetch={false} href="/build-your-hamper">Choose your own hamper</Link></nav></aside>
    </div>
    <section className={styles.questions} aria-labelledby="bulk-questions-title"><h2 id="bulk-questions-title">A little clarity, before we begin.</h2><details><summary>Is there a minimum quantity?</summary><p>It depends on the design and custom work. Some listings have their own stated minimum. Share your preferred piece and quantity so Sneha can confirm what is possible; there is no blanket minimum promised here.</p></details><details><summary>Can these arrive before my event?</summary><p>Share your occasion date and delivery PIN code before ordering. Requested quantities already in stock dispatch in 2–3 days; larger quantities and made-to-order work need preparation time confirmed separately. Dispatch is not the courier’s arrival date.</p></details><details><summary>Can I mix pieces or add gift packing?</summary><p>Tell Sneha the designs, quantity per design and packaging you have in mind. Contents, availability, additional costs and timing are confirmed for your request. Photographed props are not automatically included.</p></details></section>
  </main>;
}
