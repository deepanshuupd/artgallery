import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { getProductPath } from "@/lib/catalog";
import { getProductImage } from "@/lib/product-image";
import { getProducts } from "@/lib/products";
import { formatPrice } from "@/lib/pricing";
import { pageMetadata } from "@/lib/seo";
import { getSiteUrl } from "@/lib/site";

import styles from "./aipan-art.module.css";

export const revalidate = 3600;

const photograph = {
  src: "/images/aipan/red-white-aipan-artwork.webp",
  mobileSrc: "/images/aipan/red-white-aipan-artwork-mobile.webp",
  alt: "Red-and-white Aipan artwork with geometric panels, floral borders and rows of footprint motifs",
};

const sources = [
  {
    title: "Uttarakhand Aipan",
    publisher: "Office of the Development Commissioner (Handicrafts), Government of India",
    href: "https://handicrafts.nic.in/crafts/All_Crafts/Craft_Categories/Miscellaneous/Folk_Painting/Uttarakhand_Aipan/UttarakhandAipanWebPage.html",
  },
  {
    title: "Aipan: introduction & designing process",
    publisher: "NID, Bengaluru · D’source",
    href: "https://dsource.in/resource/aipan-uttarakhand/designing-process",
  },
  {
    title: "Aipan: the vibrant folk art of Uttarakhand",
    publisher: "Incredible India, Ministry of Tourism",
    href: "https://www.incredibleindia.gov.in/en/uttarakhand/aipan-the-vibrant-folk-art-of-uttarakhand",
  },
];

export const metadata: Metadata = pageMetadata({
  title: "Aipan Art: History, Traditions & Gifts",
  path: "/aipan-art",
  description: "Discover Aipan art of Kumaon: its history, geru and rice-paste technique, ritual uses, and the contemporary frames and gifts inspired by it.",
  image: photograph.src,
  imageAlt: photograph.alt,
  imageWidth: 1440,
  imageHeight: 1080,
});

const questions = [
  {
    question: "Is every Kumaoni frame an Aipan frame?",
    answer: "No. Our frame collection includes Aipan-inspired designs, Pichora backgrounds and Pahadi jewellery displays. These are different references to Kumaon. The photographs and description tell you which tradition a piece draws from.",
  },
  {
    question: "Are the frames made with traditional rice paste?",
    answer: "An Aipan-inspired frame is a contemporary object, not necessarily a rice-paste painting. Modern pieces may use MDF, paint and a protective finish. The individual listing gives the materials; ask Sneha if a particular technique matters to you.",
  },
  {
    question: "Can I personalise an Aipan-inspired gift?",
    answer: "Selected pieces, including our customised Aipan nameplate, offer personalisation. Share your spelling, preferred script and idea with Sneha. She can confirm the available design, price and timing before you order.",
  },
  {
    question: "How should I look after an Aipan-inspired piece?",
    answer: "Care depends on the base, paint and finish. Ask for instructions for your exact piece before using water or cleaning products, or placing it in direct sun, damp conditions or outdoors. An entrance nameplate is not automatically weatherproof.",
  },
];

function Chevron() {
  return <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="m9 5 7 7-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

export default async function AipanArtPage() {
  const products = await getProducts();
  const selected = [
    { slug: "golu-devta-aipan-frame", label: "For a devotional corner", action: "View the frame" },
    { slug: "customised-aipan-nameplate", label: "For an entrance of your own", action: "Explore the nameplate" },
  ].flatMap(item => {
    const product = products.find(product => getProductPath(product).endsWith(`/${item.slug}`));
    return product ? [{ ...item, product, image: getProductImage(product) }] : [];
  });
  const siteUrl = getSiteUrl();

  return (
    <main className={styles.page}>
      <div className={`heritage-shell ${styles.breadcrumbs}`}><Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Aipan art", href: "/aipan-art" }]} /></div>
      <JsonLd data={{
        "@context": "https://schema.org", "@type": "Article",
        headline: "Aipan art: the red and white of Kumaon",
        description: "The history, materials and ritual uses of Aipan, and the contemporary pieces inspired by it.",
        mainEntityOfPage: `${siteUrl}/aipan-art`,
        author: { "@type": "Organization", name: "KumaonRang", url: siteUrl },
        publisher: { "@type": "Organization", name: "KumaonRang", url: siteUrl },
        citation: sources.map(source => source.href),
        image: { "@type": "ImageObject", contentUrl: `${siteUrl}${photograph.src}`, description: photograph.alt,
          width: 1440, height: 1080 },
      }} />

      <header className={`heritage-shell ${styles.hero}`}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>Art & culture · Kumaon, Uttarakhand</p>
          <span className={styles.hindi} lang="hi">ऐपण</span>
          <h1>Aipan art.<br /><em>The red and white<br className={styles.desktopBreak} /> of Kumaon.</em></h1>
          <p className={styles.heroIntro}>At a doorway. In a prayer room. On the seat prepared for a ceremony. In Kumaoni homes, Aipan marks a space—and the occasion it is made for.</p>
          <a className={styles.heroLink} href="#tradition">Get to know the art <Chevron /></a>
        </div>
        <figure className={styles.heroFigure}>
          <div className={styles.heroPhoto}>
            <picture>
              <source media="(max-width: 767px)" srcSet={photograph.mobileSrc} />
              <Image src={photograph.src} alt={photograph.alt} width={1440} height={1080} loading="eager" fetchPriority="high" sizes="(max-width: 767px) 100vw, 50vw" />
            </picture>
          </div>
          <figcaption>Aipan artwork shared by KumaonRang. White geometric and footprint motifs on a red ground.</figcaption>
        </figure>
      </header>

      <nav className={`heritage-shell ${styles.contents}`} aria-label="In this guide">
        <a href="#tradition">The tradition</a><a href="#technique">How it’s made</a><a href="#our-pieces">Our Aipan-inspired pieces</a><a href="#questions">Your questions</a>
      </nav>

      <article className={`heritage-shell ${styles.article}`}>
        <section id="tradition" className={styles.tradition} aria-labelledby="tradition-heading">
          <div className={styles.sectionTitle}>
            <p className={styles.eyebrow}>A living household tradition</p>
            <h2 id="tradition-heading">What is Aipan?</h2>
            <p className={styles.standfirst}>An art form with a place in the home, long before it had a place in a frame.</p>
          </div>
          <div className={styles.prose}>
            <p>Aipan is a ritual floor and wall art of Kumaon in Uttarakhand. Its familiar white lines are traditionally drawn with rice paste over a red-ochre base called <em>geru</em>. Dots, borders and geometric or devotional motifs form designs made for a particular space, deity or ceremony.<a className={styles.reference} href="#source-2" aria-label="Source 2: NID documentation">[2]</a></p>
            <h3>Where does it come from?</h3>
            <p>The Government of India’s craft account traces Aipan to Almora during the Chand dynasty’s rule, before its spread across the region. It belongs to Kumaon’s wider cultural life, rather than to Pithoragarh alone.<a className={styles.reference} href="#source-1" aria-label="Source 1: Government craft history">[1]</a></p>
            <p>The practice has traditionally been carried by women in Kumaoni households, who pass designs on within their families. Its setting is often everyday and domestic: an entrance, a courtyard, the prayer room or a <em>chowki</em>, a low seat or platform prepared for worship.<a className={styles.reference} href="#source-2" aria-label="Source 2: NID documentation">[2]</a></p>
          </div>
        </section>

        <section id="technique" className={styles.technique} aria-labelledby="technique-heading">
          <p className={styles.eyebrow}>The traditional method</p>
          <h2 id="technique-heading">Two materials.<br /><em>A language drawn by hand.</em></h2>
          <dl className={styles.materials}>
            <div><dt><span className={styles.geruSwatch} aria-hidden="true" />Geru</dt><dd>Red ochre mixed with water forms the ground. The white drawing begins once this base has dried.</dd></div>
            <div><dt><span className={styles.riceSwatch} aria-hidden="true" />Bisvar</dt><dd>Soaked rice is ground into a fine, flowing paste—the white medium used to draw the patterns.</dd></div>
            <div><dt><span className={styles.lineSwatch} aria-hidden="true" />The hand</dt><dd>The maker draws with her fingers; brushes are also documented. Lines and dots build around a central design suited to the occasion.</dd></div>
          </dl>
          <p className={styles.processSource}>Traditional process documented by NID, Bengaluru. <a href={sources[1].href}>Read the documentation <Chevron /></a></p>
        </section>

        <section className={styles.occasions} aria-labelledby="occasions-heading">
          <div className={styles.sectionTitle}><p className={styles.eyebrow}>More than decoration</p><h2 id="occasions-heading">A design for<br /><em>the occasion.</em></h2></div>
          <div className={styles.prose}>
            <p>Aipan accompanies pujas, weddings, birth ceremonies and festivals, including Lakshmi worship. The designs vary with the ceremony and the deity; an auspicious motif is part of a shared practice and belief, rather than a promise of good fortune.<a className={styles.reference} href="#source-1" aria-label="Source 1: ritual uses">[1]</a><a className={styles.reference} href="#source-2" aria-label="Source 2: patterns for ceremonies">[2]</a></p>
            <p>That is why the pattern matters as much as the colours. A contemporary piece may borrow Aipan’s borders and geometry without serving the same purpose as a ritual floor painting.</p>
          </div>
        </section>

        <section id="our-pieces" className={styles.shop} aria-labelledby="pieces-heading">
          <div className={styles.shopHeading}>
            <div><p className={styles.eyebrow}>At KumaonRang</p><h2 id="pieces-heading">From the floor<br /><em>to a frame.</em></h2></div>
            <div className={styles.shopIntro}><p>Our Aipan-inspired frames and selected personalised gifts carry the red-and-white designs into objects you can keep. An MDF frame has a different base and finish from traditional rice-paste work; the materials are listed with each piece.</p><Link className={styles.collectionLink} href="/aipan-frames" prefetch={false}>Explore Aipan & frames <Chevron /></Link></div>
          </div>
          <div className={styles.productGrid}>
            {selected.map(({ product, image, label, action }) => (
              <Link key={product.id} className={styles.product} href={getProductPath(product)} prefetch={false}>
                {image.src && <div className={styles.productPhoto}><Image src={image.cardSrc} alt={image.alt} fill sizes="(max-width: 767px) 45vw, 500px" className={styles.productImage} /></div>}
                <div className={styles.productCopy}><p className={styles.productLabel}>{label}</p><h3>{product.name}</h3><p className={styles.price}>{formatPrice(product.price)}</p><span className={styles.productAction}>{action}<Chevron /></span></div>
              </Link>
            ))}
          </div>
          <div className={styles.personal}><p><strong>Have a name or a place in mind?</strong><span>Talk to Sneha about a piece for your home or someone you’re gifting.</span></p><Link href="/contact" prefetch={false}>Let’s make it personal <Chevron /></Link></div>
        </section>

        <section id="questions" className={styles.faqSection} aria-labelledby="questions-heading">
          <div className={styles.sectionTitle}><p className={styles.eyebrow}>Before you choose</p><h2 id="questions-heading">Questions about<br /><em>Aipan-inspired gifts.</em></h2></div>
          <div className={styles.faqs}>{questions.map(item => <details key={item.question}><summary>{item.question}<span className={styles.plus} aria-hidden="true" /></summary><p>{item.answer}</p></details>)}</div>
        </section>

        <aside className={styles.sources} aria-labelledby="sources-heading">
          <h2 id="sources-heading">Further reading</h2>
          <ol>{sources.map((source, index) => <li key={source.href} id={`source-${index + 1}`}><a href={source.href}>{source.title}</a><span>{source.publisher}</span></li>)}</ol>
          <p>The artwork photograph was supplied by KumaonRang. The materials and maker of the pictured artwork are not specified; the traditional technique described above is based on the cited documentation.</p>
        </aside>
      </article>
    </main>
  );
}
