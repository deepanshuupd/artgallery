import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { pageMetadata } from "@/lib/seo";
import { getProducts } from "@/lib/products";
import { getProductPath } from "@/lib/catalog";
import { getGiftContexts } from "@/lib/gift-contexts";
import { getGiftGuideCover, getGiftGuideIdeas } from "@/lib/gift-guide";
import { getProductImage } from "@/lib/product-image";
import { formatPrice } from "@/lib/pricing";
import { getMinimumPieceQuantity } from "@/lib/product-highlights";
import { getSiteUrl } from "@/lib/site";
import { JsonLd } from "@/components/seo/json-ld";

import styles from "./gift-guides.module.css";

export const dynamic = "force-static";
export const revalidate = 60;

const guideMetadata = {
  title: "Uttarakhand Gift Guide: What to Choose",
  path: "/uttarakhand-gifts",
  description:
    "Choose a thoughtful Uttarakhand gift: compare Pahadi keychains, Aipan frames, souvenir magnets, personalised pieces and hampers for your occasion.",
};

export async function generateMetadata(): Promise<Metadata> {
  const cover = getGiftGuideCover(await getProducts());
  const image = cover ? getProductImage(cover) : undefined;
  return pageMetadata({
    ...guideMetadata,
    image: image?.src, imageAlt: image?.alt,
    imageWidth: image?.width, imageHeight: image?.height,
  });
}

const questions = [
  {
    question: "What makes a thoughtful gift for someone who misses Uttarakhand?",
    answer:
      "Choose a detail they recognise: a Pahadi character for their keys, a regional motif for the fridge, or an Aipan-inspired piece for their home. Think about where they will use it; a familiar design is more personal when it fits their everyday life.",
  },
  {
    question: "Can I order these as wedding or event return gifts?",
    answer:
      "Keychains and magnets are worth considering for a set of small gifts. Before choosing, share the product, quantity, budget, event date and delivery postcode through the contact page. Availability, any personalisation, packaging, price and timing need to be confirmed for your order.",
  },
  {
    question: "Can every gift be personalised?",
    answer:
      "Options vary by product. Check the individual listing and ask which changes are possible before ordering. For names, provide the exact spelling and preferred script; for photo gifts, ask what image quality and crop will work best.",
  },
];

export default async function UttarakhandGiftsPage() {
  const products = await getProducts();
  const contexts = getGiftContexts(products);
  const ideas = getGiftGuideIdeas(products);
  const pieces = ideas.flatMap(idea => idea.product ? [idea.product] : []);
  const cover = getGiftGuideCover(products);
  const coverImage = cover ? getProductImage(cover) : undefined;
  const url = `${getSiteUrl()}/uttarakhand-gifts`;
  return (
    <main className={`heritage-shell ${styles.page}`}>
      <JsonLd data={{
        "@context": "https://schema.org", "@type": "CollectionPage",
        "@id": `${url}#guide`, url, name: guideMetadata.title,
        description: guideMetadata.description,
        ...(coverImage ? {
          primaryImageOfPage: {
            "@type": "ImageObject",
            url: new URL(coverImage.src, getSiteUrl()).href,
            name: coverImage.alt,
          },
        } : {}),
        mainEntity: {
          "@type": "ItemList", name: "Gift ideas from the current KumaonRang catalogue",
          numberOfItems: pieces.length,
          itemListElement: pieces.map((product, index) => ({
            "@type": "ListItem", position: index + 1, name: product.name.trim(),
            url: `${getSiteUrl()}${getProductPath(product)}`,
            image: new URL(getProductImage(product).src, getSiteUrl()).href,
          })),
        },
      }} />
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Uttarakhand gift guide", href: "/uttarakhand-gifts" },
        ]}
      />

      <header className={styles.hero}>
        <div>
          <p className="craft-eyebrow">The KumaonRang gift guide</p>
          <h1>Gifts from Uttarakhand, <em>chosen for them.</em></h1>
          <p className={styles.intro}>
            For someone who misses the hills, a new home or a little thank-you.
            Find a keepsake from our Pithoragarh studio that feels like them.
          </p>
        </div>
        <div className={styles.quickNote}>
          <p className="craft-eyebrow">A good place to begin</p>
          <p>Something to carry. Something to display. Something to make their own.</p>
          <a className={styles.textLink} href="#gift-ideas">Find their kind of gift <span aria-hidden="true">↓</span></a>
        </div>
      </header>

      <section className={styles.section} aria-labelledby="gift-ideas">
        <div className={styles.sectionHeading}>
          <p className="craft-eyebrow">Five ways to give</p>
          <h2 id="gift-ideas">Choose by the way they will enjoy it.</h2>
        </div>
        <p className={styles.priceNote}>Listed prices exclude delivery. Check each piece’s contents, custom options and minimum order.</p>
        <div className={`${styles.giftGrid} ${styles.visualGrid}`}>
          {ideas.map((idea) => {
            const product = idea.product;
            const image = product ? getProductImage(product) : undefined;
            const minimum = product ? getMinimumPieceQuantity(product) : 1;
            return (
              <article className={styles.giftCard} key={idea.href}>
                <p className={styles.kicker}>{idea.occasion}</p>
                <h3>{idea.title}</h3>
                {product && image && (
                  <Link href={getProductPath(product)} prefetch={false} className={styles.productLink}>
                    <span className={styles.photo}>
                      <Image src={image.cardSrc} alt={image.alt} fill loading="lazy"
                        sizes="(max-width: 639px) calc((100vw - 80px) / 2), (max-width: 1023px) 42vw, 360px"
                        className={styles.productImage} />
                    </span>
                    <span className={styles.productName}>{product.name.trim()}</span>
                    <span className={styles.productPrice}>{formatPrice(product.price)}</span>
                    {minimum > 1 && <span className={styles.minimum}>Minimum order: {minimum} pieces</span>}
                    <span className={styles.viewPiece}>View this piece <span aria-hidden="true">›</span></span>
                  </Link>
                )}
                <p className={styles.giftDescription}>{idea.description}</p>
                <Link className={styles.textLink} href={idea.href} prefetch={false}>
                  {idea.link} <span aria-hidden="true">›</span>
                </Link>
              </article>
            );
          })}
          <aside className={styles.noteCard}>
            <p className="craft-eyebrow">Before you decide</p>
            <h3>Leave room for the details.</h3>
            <p>
              Check dimensions, materials and what is included in the listing.
              For a fixed occasion, share your date and delivery postcode before
              confirming. For a personalised piece, agree on the final spelling
              and design details too.
            </p>
            <Link className={styles.textLink} href="/contact" prefetch={false}>
              Talk through your gift <span aria-hidden="true">↗</span>
            </Link>
          </aside>
        </div>
      </section>

      {contexts.length > 0 && <section className={styles.section} aria-labelledby="occasion-pieces">
        <div className={styles.sectionHeading}>
          <p className="craft-eyebrow">A few pieces to consider</p>
          <h2 id="occasion-pieces">For their everyday life, or a shared celebration.</h2>
        </div>
        <div className={styles.giftGrid}>
          {contexts.map(context => <details className={styles.occasion} key={context.id} id={context.id}>
            <summary>{context.title}</summary>
            <div className={styles.occasionBody}>
              <p>{context.description}</p>
              <ul className={styles.pieceLinks}>
                {context.products.map(product => <li key={getProductPath(product)}>
                  <Link className={styles.textLink} href={getProductPath(product)} prefetch={false}>
                    {product.name.trim()} <span aria-hidden="true">↗</span>
                  </Link>
                </li>)}
              </ul>
            </div>
          </details>)}
        </div>
      </section>}

      <section className={styles.faqSection} aria-labelledby="gift-questions">
        <div className={styles.sectionHeading}>
          <p className="craft-eyebrow">A little help choosing</p>
          <h2 id="gift-questions">Questions before you gift.</h2>
        </div>
        <div className={styles.faqs}>
          {questions.map((item) => (
            <details key={item.question}>
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <aside className={styles.related}>
        <div>
          <p className="craft-eyebrow">Look a little closer</p>
          <h2>Drawn to the red and white?</h2>
          <p>Learn what traditional Aipan is, and what to check when choosing an Aipan-inspired frame.</p>
        </div>
        <Link className={styles.textLink} href="/aipan-art" prefetch={false}>
          Read the Aipan art guide <span aria-hidden="true">↗</span>
        </Link>
      </aside>
    </main>
  );
}
