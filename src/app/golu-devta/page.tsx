import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { getProductPath } from "@/lib/catalog";
import { goluGuideUpdated, goluQuestions as questions, goluSources as sources } from "@/lib/golu-devta-guide";
import { getProductImage } from "@/lib/product-image";
import { getProducts } from "@/lib/products";
import { formatPrice } from "@/lib/pricing";
import { pageMetadata } from "@/lib/seo";
import { getSiteUrl } from "@/lib/site";

// One family of guides: this page wears the Aipan guide's layout.
import styles from "@/app/aipan-art/aipan-art.module.css";

export const revalidate = 3600;

const description = "Who is Golu Devta, Kumaon’s god of justice? His story from Champawat, the Chitai and Ghorakhal temples, letters and bells, and a hand-painted Golu Devta Aipan frame.";
const guideMetadata = pageMetadata({ title: "Golu Devta: Kumaon’s God of Justice", path: "/golu-devta", description });
export const metadata: Metadata = { ...guideMetadata, openGraph: { ...guideMetadata.openGraph, type: "article", modifiedTime: `${goluGuideUpdated}T00:00:00+05:30` } };

function References({ numbers }: { numbers: readonly number[] }) {
  return <>{numbers.map(number => <a key={number} className={styles.reference} href={`#source-${number}`} aria-label={`Source ${number}: ${sources[number - 1].title}`}>[{number}]</a>)}</>;
}

function Chevron() {
  return <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="m9 5 7 7-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

export default async function GoluDevtaPage() {
  const products = await getProducts();
  const find = (slug: string) => products.find(product => getProductPath(product).endsWith(`/${slug}`));
  const frame = find("golu-devta-aipan-frame");
  const frameImage = frame ? getProductImage(frame) : undefined;
  const pieces = [
    { product: frame, label: "Hand-painted Aipan", action: "View the frame" },
    { product: find("set-of-2-om-mandir-bells"), label: "Bells for a home mandir", action: "View the bells" },
  ].flatMap(item => item.product ? [{ ...item, product: item.product, image: getProductImage(item.product) }] : []);
  const siteUrl = getSiteUrl();
  const url = `${siteUrl}/golu-devta`;

  return (
    <main className={styles.page}>
      <div className={`heritage-shell ${styles.breadcrumbs}`}><Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Golu Devta", href: "/golu-devta" }]} /></div>
      <JsonLd data={{
        "@context": "https://schema.org", "@type": "Article", "@id": `${url}#article`,
        headline: "Golu Devta: Kumaon’s god of justice", description, mainEntityOfPage: url,
        author: { "@type": "Organization", name: "KumaonRang", url: `${siteUrl}/about` },
        publisher: { "@type": "Organization", "@id": `${siteUrl}#business`, name: "KumaonRang", url: siteUrl },
        datePublished: `${goluGuideUpdated}T00:00:00+05:30`, dateModified: `${goluGuideUpdated}T00:00:00+05:30`,
        inLanguage: "en-IN", about: { "@type": "Thing", name: "Golu Devta, deity of Kumaon, Uttarakhand" },
        citation: sources.map(source => source.href),
        ...(frameImage?.src ? { image: frameImage.src } : {}),
      }} />
      <JsonLd data={{
        "@context": "https://schema.org", "@type": "FAQPage", "@id": `${url}#questions`,
        mainEntity: questions.map(item => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })),
      }} />

      <header className={`heritage-shell ${styles.hero}`}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>Faith & folklore · Kumaon, Uttarakhand</p>
          <span className={styles.hindi} lang="hi">गोलू देवता</span>
          <h1>Golu Devta.<br /><em>Kumaon’s god<br className={styles.desktopBreak} /> of justice.</em></h1>
          <p className={styles.heroIntro}>Golu Devta, also called Goljyu or Goriya, is worshipped across Kumaon as the god of justice. People write him letters, and tie a brass bell at his temple when a prayer is answered.</p>
          <p className={styles.byline}>By <Link href="/about" prefetch={false}>KumaonRang</Link>, Pithoragarh · Updated <time dateTime={goluGuideUpdated}>1 November 2026</time></p>
          <a className={styles.heroLink} href="#story">Read his story <Chevron /></a>
        </div>
        {frameImage?.src && <figure className={styles.heroFigure}>
          <div className={styles.heroPhoto}>
            <Image src={frameImage.src} alt={frameImage.alt} width={frameImage.width ?? 1200} height={frameImage.height ?? 1200} loading="eager" fetchPriority="high" sizes="(max-width: 767px) 100vw, 50vw" />
          </div>
          <figcaption>Golu Devta Aipan Frame, hand-painted Aipan on a Pichora-inspired ground, from KumaonRang.</figcaption>
        </figure>}
      </header>

      <nav className={`heritage-shell ${styles.contents}`} aria-label="In this guide">
        <a href="#who">Who he is</a><a href="#story">His story</a><a href="#temples">Letters & bells</a><a href="#home">At home</a><a href="#questions">Your questions</a>
      </nav>

      <article className={`heritage-shell ${styles.article}`}>
        <section id="who" className={styles.tradition} aria-labelledby="who-heading">
          <div className={styles.sectionTitle}>
            <p className={styles.eyebrow}>The judge of the hills</p>
            <h2 id="who-heading">Who is Golu Devta?</h2>
            <p className={styles.standfirst}>A family deity for many Kumaoni homes, and a court of appeal for everyone.</p>
          </div>
          <div className={styles.prose}>
            <p>Golu Devta is a deity of the Kumaoni community of Uttarakhand, known as the god of justice. He is considered a form of Gaur Bhairav, and for many villages he is the <em>kul devta</em>, the family or clan deity.<References numbers={[1]} /></p>
            <p>He goes by several names: <em>Goljyu</em> (<span lang="hi">गोलज्यू</span>), <em>Goriya</em>, after the river Gori in his story, and <em>Goreel Devta</em> in Chamoli district.<References numbers={[1, 2]} /></p>
            <div className={styles.factNote}><h3>In one line</h3><p>Golu Devta is Kumaon’s god of justice. Devotees send him written petitions and offer brass bells when a prayer is answered; his best-known temples are at <strong>Chitai</strong> near Almora, <strong>Ghorakhal</strong> near Bhowali and <strong>Champawat</strong>.<References numbers={[1, 2, 3]} /></p></div>
          </div>
        </section>

        <section id="story" className={styles.occasions} aria-labelledby="story-heading">
          <div className={styles.sectionTitle}><p className={styles.eyebrow}>A story from Champawat</p><h2 id="story-heading">The prince<br /><em>the river returned.</em></h2></div>
          <div className={styles.prose}>
            <p>The stories differ from place to place. In the version Sahapedia records, Golu is the son of King Jhal Rai of Champawat and his eighth queen, Kalinka. The seven older queens, jealous of the newborn, hid him, set a stone mortar and pestle in his place, and cast the baby into the river Gori.<References numbers={[1, 2]} /></p>
            <p>A fisherman named Bhana found the child at Gorighat and raised him. That is where the name Goriya comes from.<References numbers={[2]} /></p>
            <p>In a widely told telling, the boy returns riding a wooden horse and mocks the queens who laugh at him, until the truth of his birth comes out. The king punishes the scheming queens, and Golu takes his place, holding hearings across the kingdom and becoming known for his justice.<References numbers={[2, 3]} /></p>
            <p>He is said to still travel to hear people’s troubles. That belief lives on in the <em>Jagar</em>, where a singer, the Jagariya, calls the deity with song and drums.<References numbers={[1, 2]} /></p>
          </div>
        </section>

        <section id="temples" className={styles.technique} aria-labelledby="temples-heading">
          <p className={styles.eyebrow}>A court of letters and bells</p>
          <h2 id="temples-heading">Write to him.<br /><em>Thank him with a bell.</em></h2>
          <dl className={styles.materials}>
            <div><dt><span className={styles.riceSwatch} aria-hidden="true" />The arji</dt><dd>A petition written on plain or stamp paper, marked with vermilion and tied with red thread at the temple.<References numbers={[2, 3]} /></dd></div>
            <div><dt><span className={styles.geruSwatch} aria-hidden="true" />The bell</dt><dd>Offered once a prayer is answered. Hundreds of brass bells, many tied with red cloth, line the path at Chitai.<References numbers={[2, 3]} /></dd></div>
            <div><dt><span className={styles.lineSwatch} aria-hidden="true" />The court</dt><dd>Chitai’s priest describes the temple as a court, with Goludev as its judge.<References numbers={[2]} /></dd></div>
          </dl>
          <h3 className={styles.methodHeading}>Where to find his temples</h3>
          <ol className={styles.steps}>
            <li><strong>Chitai, near Almora.</strong> His most famous temple, about 10 km from Almora towards Binsar, among chir pines.<References numbers={[1, 3]} /></li>
            <li><strong>Ghorakhal, near Bhowali.</strong> In Nainital district, beside Sainik School Ghorakhal.<References numbers={[1]} /></li>
            <li><strong>Champawat.</strong> Considered his place of origin.<References numbers={[1]} /></li>
            <li><strong>Chamarkhan, Almora district.</strong> In Tarikhet tehsil.<References numbers={[1]} /></li>
          </ol>
          <p className={styles.processSource}>Our own <Link href="/contact" prefetch={false}>contact page</Link> borrows the idea of a letter posted to the hills. <Link href="/contact" prefetch={false}>Write to Sneha <Chevron /></Link></p>
        </section>

        <section id="home" className={styles.shop} aria-labelledby="home-heading">
          <div className={styles.shopHeading}>
            <div><p className={styles.eyebrow}>At KumaonRang</p><h2 id="home-heading">Golu Devta<br /><em>at home.</em></h2></div>
            <div className={styles.shopIntro}><p>He is often shown as a king on horseback; that image is relatively recent, and older shrines kept a sacred fire and iron weapons instead.<References numbers={[2]} /></p><p>Our Golu Devta frame brings him into a home mandir in Aipan, Kumaon’s red-and-white art. <Link href="/aipan-art" prefetch={false}>Read about Aipan</Link>.</p></div>
          </div>
          <div className={styles.buyingGuide}><h3>Choosing a Golu Devta frame</h3><p>The frame is 14 inches, with hand-painted Aipan on an MDF base, a Pichora-inspired back and a glass front. Customisation is available on request, and bulk orders are accepted. For placement, follow your family’s custom or your priest’s guidance.</p></div>
          <div className={styles.productGrid}>
            {pieces.map(({ product, image, label, action }) => (
              <Link key={product.id} className={styles.product} href={getProductPath(product)} prefetch={false}>
                {image.src && <div className={styles.productPhoto}><Image src={image.cardSrc} alt={image.alt} fill sizes="(max-width: 767px) 45vw, 500px" className={styles.productImage} /></div>}
                <div className={styles.productCopy}><p className={styles.productLabel}>{label}</p><h3>{product.name.trim()}</h3><p className={styles.price}>{formatPrice(product.price)}</p><span className={styles.productAction}>{action}<Chevron /></span></div>
              </Link>
            ))}
          </div>
          <div className={styles.personal}><p><strong>Looking for a particular image of Golu Devta?</strong><span>Ask Sneha about a custom Aipan piece for your home or family temple.</span></p><Link href="/contact" prefetch={false}>Write to Sneha <Chevron /></Link></div>
        </section>

        <section id="questions" className={styles.faqSection} aria-labelledby="questions-heading">
          <div className={styles.sectionTitle}><p className={styles.eyebrow}>Learn & choose</p><h2 id="questions-heading">Questions about<br /><em>Golu Devta.</em></h2></div>
          <div className={styles.faqs}>{questions.map(item => <details key={item.question}><summary>{item.question}<span className={styles.plus} aria-hidden="true" /></summary><p>{item.answer}{"sources" in item && item.sources && <References numbers={item.sources} />}</p></details>)}</div>
        </section>

        <aside className={styles.sources} aria-labelledby="sources-heading">
          <h2 id="sources-heading">Sources & further reading</h2>
          <ol>{sources.map((source, index) => <li key={source.href} id={`source-${index + 1}`}><a href={source.href}>{source.title}</a><span>{source.publisher}</span></li>)}</ol>
          <p>Sources checked on 1 November 2026. Stories and customs of Golu Devta vary between places and families; this guide is an introduction, and your family’s or temple’s practice comes first.</p>
        </aside>
      </article>
    </main>
  );
}
