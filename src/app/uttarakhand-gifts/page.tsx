import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { pageMetadata } from "@/lib/seo";

import styles from "./gift-guides.module.css";

export const dynamic = "force-static";

export const metadata: Metadata = pageMetadata({
  title: "Uttarakhand Gift Guide: What to Choose",
  path: "/uttarakhand-gifts",
  description:
    "Choose a thoughtful Uttarakhand gift: compare Pahadi keychains, Aipan frames, souvenir magnets, personalised pieces and hampers for your occasion.",
});

const giftIdeas = [
  {
    number: "01",
    occasion: "For an everyday reminder",
    title: "Pahadi keychains",
    description:
      "A small gift for a friend, sibling or someone moving away from home. Start with the Pahadi boy, girl and couple designs, then choose the character that feels most like them.",
    href: "/pahadi-keychains",
    link: "Explore keychains",
  },
  {
    number: "02",
    occasion: "For a favourite corner",
    title: "Aipan & heritage frames",
    description:
      "For a housewarming or a family home, consider an Aipan-inspired frame. Choose devotional imagery to suit the recipient, or explore Pichora and Pahadi jewellery display frames for a different connection to Kumaon.",
    href: "/aipan-frames",
    link: "Explore frames",
  },
  {
    number: "03",
    occasion: "For a memory of the hills",
    title: "Souvenir magnets",
    description:
      "A regional fridge magnet keeps a place in view without needing a whole wall. It is a useful starting point for a travel keepsake or a small thank-you gift; check that the recipient has a magnetic surface to display it.",
    href: "/uttarakhand-souvenirs",
    link: "Explore souvenir magnets",
  },
  {
    number: "04",
    occasion: "For something that is theirs",
    title: "Personalised Kumaoni gifts",
    description:
      "A nameplate can mark a new home, while a personalised photo piece can hold a shared memory. Start with a product that offers customisation, then confirm the wording, photograph and available options.",
    href: "/kumaoni-gifts",
    link: "Explore personalised gifts",
  },
  {
    number: "05",
    occasion: "For a gift with a few parts",
    title: "Curated hampers",
    description:
      "A hamper suits someone who enjoys opening a collection of little things. Compare the listed contents as carefully as the presentation, and pick a combination the recipient will use or display.",
    href: "/curated-hampers",
    link: "Explore hampers",
  },
];

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

export default function UttarakhandGiftsPage() {
  return (
    <main className={`heritage-shell ${styles.page}`}>
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
            A reminder of home, a new beginning, a little thank-you. Start with
            the person and the place your gift will live, then find a keepsake
            from our Pithoragarh studio that belongs in their story.
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
        <div className={styles.giftGrid}>
          {giftIdeas.map((idea) => (
            <article className={styles.giftCard} key={idea.href}>
              <span className={styles.number} aria-hidden="true">{idea.number}</span>
              <div>
                <p className={styles.kicker}>{idea.occasion}</p>
                <h3>{idea.title}</h3>
                <p>{idea.description}</p>
                <Link className={styles.textLink} href={idea.href} prefetch={false}>
                  {idea.link} <span aria-hidden="true">↗</span>
                </Link>
              </div>
            </article>
          ))}
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
        <Link className={styles.textLink} href="/pithoragarh-aipan-art" prefetch={false}>
          Read the Aipan art guide <span aria-hidden="true">↗</span>
        </Link>
      </aside>
    </main>
  );
}
