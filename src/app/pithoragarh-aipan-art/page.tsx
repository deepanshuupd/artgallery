import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { pageMetadata } from "@/lib/seo";

import styles from "../uttarakhand-gifts/gift-guides.module.css";

export const dynamic = "force-static";

export const metadata: Metadata = pageMetadata({
  title: "Aipan Art from Pithoragarh: A Buying Guide",
  path: "/pithoragarh-aipan-art",
  description:
    "Understand Aipan's Kumaoni roots and choose an Aipan-inspired frame or nameplate. A practical guide to designs, materials and display from KumaonRang.",
});

const questions = [
  {
    question: "Is every Kumaoni frame an Aipan frame?",
    answer:
      "No. The frame collection brings together different references to Kumaon, including Aipan-inspired designs, Pichora backgrounds and Pahadi jewellery displays. Choose by the artwork and product description rather than assuming every regional design is Aipan.",
  },
  {
    question: "Are the frames made with traditional rice paste?",
    answer:
      "An Aipan-inspired product is not automatically made with the traditional rice-paste and red-ochre method. Contemporary pieces can use MDF and other modern materials. Check the material and finish on the individual listing, and ask if the technique matters to your choice.",
  },
  {
    question: "How should I look after an Aipan-inspired piece?",
    answer:
      "Care depends on the base, paint and finish. Ask for instructions for the exact piece before using water or cleaning products, placing it in direct sun, or hanging it in a damp or outdoor area. A nameplate is not necessarily weatherproof simply because it is intended for an entrance.",
  },
];

export default function PithoragarhAipanArtPage() {
  return (
    <main className={`heritage-shell ${styles.page}`}>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Aipan art guide", href: "/pithoragarh-aipan-art" },
        ]}
      />

      <header className={styles.hero}>
        <div>
          <p className="craft-eyebrow">Aipan art · Pithoragarh, Kumaon</p>
          <h1>Aipan art, <em>from tradition to your home.</em></h1>
          <p className={styles.intro}>
            Choosing Aipan art from Pithoragarh starts with the design, but the
            material and the place you will display it matter too. Here is a
            short guide to the tradition behind our Aipan-inspired pieces,
            and the details to consider before bringing one home.
          </p>
        </div>
        <div className={`${styles.quickNote} ${styles.artNote}`}>
          <p className="craft-eyebrow">The familiar colours</p>
          <p>White lines. A red ground. A connection to Kumaon.</p>
          <Link className={styles.textLink} href="/aipan-frames" prefetch={false}>
            Explore Aipan & frames <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </header>

      <section className={styles.tradition} aria-labelledby="aipan-tradition">
        <div>
          <p className="craft-eyebrow">Know the art</p>
          <h2 id="aipan-tradition">What is traditional Aipan?</h2>
        </div>
        <div>
          <p>
            Aipan is a folk-art tradition of Kumaon in Uttarakhand. Traditional
            designs use white rice paste over a red-ochre ground, called geru,
            on surfaces such as floors and walls. Geometric patterns and
            devotional motifs connect the art with household ceremonies and
            festivals.
          </p>
          <p>
            An Aipan-inspired MDF frame is a contemporary way to bring that
            visual language into a home. Its base and finish are different from
            a traditional rice-paste floor painting. Read each product&apos;s
            material details to understand the piece you are choosing.
          </p>
          <p className={styles.source}>
            About the tradition: <a href="https://handicrafts.nic.in/crafts/All_Crafts/Craft_Categories/Miscellaneous/Folk_Painting/Uttarakhand_Aipan/UttarakhandAipanWebPage.html">Office of the Development Commissioner (Handicrafts)</a>.
          </p>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="choose-aipan">
        <div className={styles.sectionHeading}>
          <p className="craft-eyebrow">Choose with a place in mind</p>
          <h2 id="choose-aipan">A corner, a doorway, a connection.</h2>
        </div>
        <div className={styles.artGrid}>
          <article className={styles.artCard}>
            <p className={styles.kicker}>For a devotional corner</p>
            <h3>Choose a meaningful motif.</h3>
            <p>
              Our frame collection includes Golu Devta, Om and Ganesh designs.
              For a gift, choose imagery the recipient welcomes in their home;
              for a particular ritual, confirm the design suits your family&apos;s
              practice.
            </p>
            <Link className={styles.textLink} href="/aipan-frames/golu-devta-aipan-frame" prefetch={false}>
              View the Golu Devta frame <span aria-hidden="true">↗</span>
            </Link>
          </article>
          <article className={styles.artCard}>
            <p className={styles.kicker}>For a personal entrance</p>
            <h3>Start with the name.</h3>
            <p>
              An Aipan-inspired nameplate brings a personal detail to a doorway.
              For the Customised Aipan Nameplate, discuss the exact spelling,
              script and available layout, along with how and where you plan to
              mount it.
            </p>
            <Link className={styles.textLink} href="/kumaoni-gifts/customised-aipan-nameplate" prefetch={false}>
              View the Aipan nameplate <span aria-hidden="true">↗</span>
            </Link>
          </article>
          <article className={styles.artCard}>
            <p className={styles.kicker}>For a different memory of home</p>
            <h3>Look beyond one art form.</h3>
            <p>
              A Pichora-background frame or a traditional Pahadi jewellery
              display offers another way to celebrate Kumaon. These are
              distinct design choices; compare the colours, objects and
              composition with the room you have in mind.
            </p>
            <Link className={styles.textLink} href="/aipan-frames" prefetch={false}>
              Compare the frame collection <span aria-hidden="true">↗</span>
            </Link>
          </article>
        </div>
      </section>

      <section className={styles.checklist} aria-labelledby="aipan-details">
        <div className={styles.sectionHeading}>
          <p className="craft-eyebrow">Before you order</p>
          <h2 id="aipan-details">Three details worth checking.</h2>
        </div>
        <dl>
          <div><dt>Size & display</dt><dd>Measure the space. Confirm the overall dimensions and whether a stand or hanging hardware is included.</dd></div>
          <div><dt>Material & finish</dt><dd>Check the base, surface and care instructions. Ask whether the piece suits its intended indoor or sheltered location.</dd></div>
          <div><dt>Personal details</dt><dd>Customisation varies. Confirm the available changes, final text, price and timing before agreeing to an order.</dd></div>
        </dl>
        <Link className={styles.textLink} href="/contact" prefetch={false}>
          Ask about a piece <span aria-hidden="true">↗</span>
        </Link>
      </section>

      <section className={styles.faqSection} aria-labelledby="aipan-questions">
        <div className={styles.sectionHeading}>
          <p className="craft-eyebrow">A little more to know</p>
          <h2 id="aipan-questions">Questions about Aipan-inspired gifts.</h2>
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
          <p className="craft-eyebrow">Choosing for someone else?</p>
          <h2>Find the gift that fits their everyday.</h2>
          <p>
            Compare frames with <Link href="/pahadi-keychains" prefetch={false}>Pahadi keychains</Link>,{" "}
            <Link href="/uttarakhand-souvenirs" prefetch={false}>souvenir magnets</Link>,{" "}
            <Link href="/kumaoni-gifts" prefetch={false}>personalised gifts</Link> and{" "}
            <Link href="/curated-hampers" prefetch={false}>curated hampers</Link>.
          </p>
        </div>
        <Link className={styles.textLink} href="/uttarakhand-gifts" prefetch={false}>
          Read the Uttarakhand gift guide <span aria-hidden="true">↗</span>
        </Link>
      </aside>
    </main>
  );
}
