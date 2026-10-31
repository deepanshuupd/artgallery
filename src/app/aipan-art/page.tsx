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
import { aipanSources as sources, aipanDesigns, aipanMotifs, aipanQuestions as questions, aipanGuideUpdated } from "@/lib/aipan-guide";

import styles from "./aipan-art.module.css";

export const revalidate = 3600;

const photograph = {
  src: "/images/aipan/red-white-aipan-artwork.webp",
  mobileSrc: "/images/aipan/red-white-aipan-artwork-mobile.webp",
  alt: "Red-and-white Aipan artwork with geometric panels, floral borders and rows of footprint motifs",
};

const guideMetadata = pageMetadata({
  title: "Aipan Art of Uttarakhand: Types & History",
  path: "/aipan-art",
  description: "Explore Kumaoni Aipan art: history, geru and bisvar, chowki designs, Lakshmi footprints, Diwali traditions and Aipan-inspired frames and gifts.",
  image: photograph.src,
  imageAlt: photograph.alt,
  imageWidth: 1440,
  imageHeight: 1080,
});
export const metadata: Metadata = { ...guideMetadata, openGraph: { ...guideMetadata.openGraph, type: "article", modifiedTime: `${aipanGuideUpdated}T00:00:00+05:30` } };

function References({ numbers }: { numbers: readonly number[] }) {
  return <>{numbers.map(number => <a key={number} className={styles.reference} href={`#source-${number}`} aria-label={`Source ${number}: ${sources[number - 1].title}`}>[{number}]</a>)}</>;
}

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
        "@id": `${siteUrl}/aipan-art#article`,
        headline: "Aipan art of Uttarakhand: history, types, motifs and traditions",
        description: "A sourced guide to Kumaoni Aipan painting, traditional chowki designs, geru and bisvar, ceremonial uses and contemporary gifts.",
        mainEntityOfPage: `${siteUrl}/aipan-art`,
        author: { "@type": "Organization", name: "KumaonRang", url: `${siteUrl}/about` },
        publisher: { "@type": "Organization", "@id": `${siteUrl}#business`, name: "KumaonRang", url: siteUrl },
        // First published with commit be178db (3 October 2026).
        datePublished: "2026-10-03T00:00:00+05:30",
        dateModified: `${aipanGuideUpdated}T00:00:00+05:30`,
        inLanguage: "en-IN",
        about: { "@type": "Thing", name: "Aipan art of Kumaon, Uttarakhand" },
        articleSection: ["History", "Materials and technique", "Types of Aipan", "Motifs", "Contemporary gifts"],
        citation: sources.map(source => source.href),
        image: { "@type": "ImageObject", contentUrl: `${siteUrl}${photograph.src}`, description: photograph.alt,
          width: 1440, height: 1080 },
      }} />

      <header className={`heritage-shell ${styles.hero}`}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>Art & culture · Kumaon, Uttarakhand</p>
          <span className={styles.hindi} lang="hi">ऐपण</span>
          <h1>Aipan art<br />of Uttarakhand.<br /><em>The red and white<br className={styles.desktopBreak} /> of Kumaon.</em></h1>
          <p className={styles.heroIntro}>A guide to Kumaoni Aipan painting: where it comes from, how it is made, and why a Lakshmi Chowki, a wedding patta and a doorway pattern each have their own place.</p>
          <p className={styles.byline}>By <Link href="/about" prefetch={false}>KumaonRang</Link> · Updated <time dateTime={aipanGuideUpdated}>15 October 2026</time></p>
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
        <a href="#tradition">History & meaning</a><a href="#technique">Materials & method</a><a href="#types">Types of Aipan</a><a href="#motifs">Motifs & symbols</a><a href="#our-pieces">Frames & gifts</a><a href="#questions">Your questions</a>
      </nav>

      <article className={`heritage-shell ${styles.article}`}>
        <section id="tradition" className={styles.tradition} aria-labelledby="tradition-heading">
          <div className={styles.sectionTitle}>
            <p className={styles.eyebrow}>A living household tradition</p>
            <h2 id="tradition-heading">What is Aipan?</h2>
            <p className={styles.standfirst}>An art form with a place in the home, long before it had a place in a frame.</p>
          </div>
          <div className={styles.prose}>
            <p>Aipan is a ritual floor and wall painting tradition of the Kumaon region of Uttarakhand, India. Its white rice-paste patterns sit on a red-ochre ground called <em>geru</em>. Designs mark household entrances, prayer spaces and places prepared for ceremonies.<References numbers={[1, 6]} /></p>
            <h3>What does the name Aipan mean?</h3>
            <p>You may see the spellings <em>Aipan</em> and <em>Aepan</em>, alongside the Kumaoni name <span lang="hi">ऐपण</span>. NID’s account connects the word with Sanskrit <em>lepana</em>, meaning coating or plastering. Explanations of the name differ between sources.<References numbers={[6]} /></p>
            <h3>Where does it come from?</h3>
            <p>The government craft account and Project FUEL’s documentation with the Uttarakhand Handloom and Handicraft Development Council associate Aipan’s development with Almora and Chand rule. They do not establish a single invention date.<References numbers={[1, 4]} /></p>
            <p>Asha Upreti’s cultural documentation records the practice across Almora, Nainital and Pithoragarh, including Gangolihat. Aipan is part of Kumaon’s shared heritage; Pithoragarh is where our shop connects with that tradition.<References numbers={[10]} /></p>
            <h3>The women who carry the tradition</h3>
            <p>Much of its knowledge has passed through women in families, through watching, practising and preparing the home together. Project FUEL also documents artisan Namita Tiwari’s work teaching younger women. Learning the meaning of a design is part of learning to draw it.<References numbers={[4]} /></p>
            <div className={styles.factNote}><h3>Aipan’s GI recognition</h3><p>The official registry lists <strong>Uttarakhand Aipan</strong> under application <strong>648</strong>, with a registration certificate dated <strong>14 September 2021</strong>. The applicant is Ulka Nidhi Swayat Sahkarita of Pithoragarh. This craft registration does not certify every Aipan-inspired item or retailer.<References numbers={[8]} /></p></div>
          </div>
        </section>

        <section id="technique" className={styles.technique} aria-labelledby="technique-heading">
          <p className={styles.eyebrow}>The traditional method</p>
          <h2 id="technique-heading">Two materials.<br /><em>A language drawn by hand.</em></h2>
          <dl className={styles.materials}>
            <div><dt><span className={styles.geruSwatch} aria-hidden="true" />Geru</dt><dd>Red ochre mixed with water creates the ground for the white drawing.</dd></div>
            <div><dt><span className={styles.riceSwatch} aria-hidden="true" />Bisvar / biswar</dt><dd>A rice paste gives the design its white lines. Rice preparation varies between documented accounts.</dd></div>
            <div><dt><span className={styles.lineSwatch} aria-hidden="true" />Fingers & brushes</dt><dd>The hand draws the pattern directly. Brushes, including a cotton-tipped bamboo stick, are also documented.</dd></div>
          </dl>
          <h3 className={styles.methodHeading}>How traditional Aipan is made</h3>
          <ol className={styles.steps}>
            <li><strong>Prepare the surface.</strong> Clean and smooth the working area. NID records cow-dung preparation for some traditional earthen surfaces; cement floors are treated differently.</li>
            <li><strong>Lay the red ground.</strong> Apply the geru mixture and let it dry before drawing.</li>
            <li><strong>Prepare the white paste.</strong> In NID’s process, soaked rice is ground with water until it flows without becoming watery.</li>
            <li><strong>Build the design.</strong> Draw the ceremonial centre, then fit lines, borders and dots to the space.</li>
          </ol>
          <p className={styles.processSource}>Traditional process documented by NID, Bengaluru. <a href={sources[1].href}>Read the documentation <Chevron /></a></p>
        </section>

        <section id="types" className={styles.designSection} aria-labelledby="types-heading">
          <div className={styles.sectionTitle}><p className={styles.eyebrow}>A pattern with a purpose</p><h2 id="types-heading">Types of Aipan art:<br /><em>chowkis, peeths & pattas.</em></h2></div>
          <div className={styles.prose}><p>A <em>chowki</em> is a seat or platform prepared for worship; a <em>peeth</em> is a ritual seat or ground. The name often tells you who or what the design is for. These examples appear in NID’s documentation and regional cultural accounts.<References numbers={[5, 7]} /></p><p>The wider Kumaoni art tradition also includes wall patterns, figure paintings and clay images. Asha Upreti’s survey discusses these as related forms; a <em>dikara</em>, for example, is a clay image, not a floor-painted chowki.<References numbers={[10]} /></p></div>
          <div className={styles.designGrid}>{aipanDesigns.map(design => <div className={styles.design} key={design.id} id={design.id}><p className={styles.eyebrow}>{design.occasion}</p><h3>{design.name}</h3><p>{design.description}<References numbers={design.sources} /></p></div>)}</div>
          <p className={styles.sectionNote}>These are examples, not a complete list. NID also documents Chamunda Hast Chowki. Names, spellings and arrangements can vary; for a ceremony, follow the practice of your family or officiant.<References numbers={[5]} /></p>
        </section>

        <section id="motifs" className={styles.motifSection} aria-labelledby="motifs-heading">
          <div className={styles.sectionTitle}><p className={styles.eyebrow}>Reading the pattern</p><h2 id="motifs-heading">Aipan motifs<br /><em>and their meaning.</em></h2></div>
          <dl className={styles.motifs}>{aipanMotifs.map(motif => <div key={motif.name}><dt>{motif.name}</dt><dd>{motif.description}<References numbers={motif.sources} /></dd></div>)}</dl>
          <p className={styles.sectionNote}>A 2020 study by G.B. Pant University researchers distinguishes prescribed ritual centres from the surrounding decoration. That helps explain why two pieces can share a red-and-white palette yet have different ceremonial meanings.<References numbers={[11]} /></p>
        </section>

        <section className={styles.occasions} aria-labelledby="occasions-heading">
          <div className={styles.sectionTitle}><p className={styles.eyebrow}>More than decoration</p><h2 id="occasions-heading">A design for<br /><em>the occasion.</em></h2></div>
          <div className={styles.prose}>
            <h3>Aipan for Diwali and Lakshmi puja</h3><p>Lakshmi worship is one of its familiar festive settings. A prepared chowki and footprint motifs make the home part of the ceremony.<References numbers={[1, 5]} /></p>
            <h3>Weddings, births and janeu ceremonies</h3><p>These occasions call for their own preparations and designs. Upreti’s documentation also connects visual patterns with ceremony songs and the shared work of family members.<References numbers={[10]} /></p>
            <h3>Doorways and everyday spaces</h3><p>Aipan belongs at thresholds as well as on ceremonial seats. A doorway pattern introduces the visitor to the home; the setting helps explain the work.<References numbers={[3]} /></p>
            <p>Auspicious meanings belong to cultural belief and practice. A decorative frame can recall those traditions without being the ritual painting required for a particular ceremony.</p>
          </div>
        </section>

        <section id="our-pieces" className={styles.shop} aria-labelledby="pieces-heading">
          <div className={styles.shopHeading}>
            <div><p className={styles.eyebrow}>At KumaonRang</p><h2 id="pieces-heading">From the floor<br /><em>to a frame.</em></h2></div>
            <div className={styles.shopIntro}><p>NID documents Aipan motifs adapted to wall hangings, photo frames, coasters, stationery and textiles. Contemporary Aipan-inspired home decor gives the pattern a new surface and everyday use.<References numbers={[9]} /></p><p>At KumaonRang, start with how the piece will live in your home: a devotional frame for a pooja corner, wall art for a shared room, or a customised nameplate for an entrance. Check the base, dimensions and finish on each listing.</p><Link className={styles.collectionLink} href="/aipan-frames" prefetch={false}>Explore Aipan art frames <Chevron /></Link></div>
          </div>
          <div className={styles.buyingGuide}><h3>Choosing an Aipan-inspired gift</h3><p>For a housewarming, compare the artwork with the recipient’s room and beliefs. For a personalised nameplate, confirm the exact wording, script and placement. For Diwali or wedding return gifts, share your quantity and occasion date early so Sneha can check availability and preparation time.</p><p><Link href="/uttarakhand-gifts" prefetch={false}>Find Uttarakhand gift ideas</Link><span aria-hidden="true"> · </span><Link href="/kumaoni-gifts" prefetch={false}>Browse personalised keepsakes</Link><span aria-hidden="true"> · </span><Link href="/build-your-hamper" prefetch={false}>Build a gift hamper</Link></p></div>
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
          <div className={styles.sectionTitle}><p className={styles.eyebrow}>Learn & choose</p><h2 id="questions-heading">Questions about<br /><em>Aipan art & gifts.</em></h2></div>
          <div className={styles.faqs}>{questions.map(item => <details key={item.question}><summary>{item.question}<span className={styles.plus} aria-hidden="true" /></summary><p>{item.answer}{"sources" in item && item.sources && <References numbers={item.sources} />}</p></details>)}</div>
        </section>

        <aside className={styles.sources} aria-labelledby="sources-heading">
          <h2 id="sources-heading">Sources & further reading</h2>
          <ol>{sources.map((source, index) => <li key={source.href} id={`source-${index + 1}`}><a href={source.href}>{source.title}</a><span>{source.publisher}</span></li>)}</ol>
          <p>The artwork photograph was supplied by KumaonRang. The materials and maker of the pictured artwork are not specified; the traditional technique described above is based on the cited documentation.</p>
          <p>This guide brings together craft documentation, cultural accounts and our current catalogue. Sources checked on 15 October 2026. Ritual descriptions are an introduction to the tradition; local practice may differ.</p>
        </aside>
      </article>
    </main>
  );
}
