import Image from "next/image";
import Link from "next/link";
import styles from "./our-story.module.css";

// Existing catalogue photograph; the card rendition is sufficient on phones.
const frameImage = "https://psqdrmdyucsyiuugvitd.supabase.co/storage/v1/object/public/product-images/optimized/v2/handmade-aipan-wall-decor-with-pichora-background-indexable-5e671ce8d1df803d98ac06e7bd75feba5d82fab9df7c0ad2014d03c09c2911b4";

export function AboutValues() {
  return <>
    <section className={styles.meaning} aria-labelledby="name-meaning-title">
      <div className={`${styles.shell} ${styles.meaningLayout}`}>
        <div>
          <p className={styles.eyebrow}>The name we carry</p>
          <h2 id="name-meaning-title" className={styles.name}>Kumaon <span aria-hidden="true">+</span> <span lang="hi">रंग</span></h2>
          <p className={styles.translation}>The colours of Kumaon.</p>
        </div>
        <div className={styles.prose}>
          <p><strong>Kumaon</strong> is our region, in the eastern part of Uttarakhand. <strong>Rang (रंग)</strong> means colour. Together, they hold the idea behind everything we share.</p>
          <p>The red and white of Aipan. The greens of the hills. The colours of a festival, a familiar face, a memory of home. KumaonRang brings those connections into art, keepsakes and gifts you can make part of your own life.</p>
        </div>
      </div>
    </section>
    <section className={styles.journey} aria-labelledby="sneha-story-title">
      <div className={`${styles.shell} ${styles.journeyLayout}`}>
        <figure className={styles.artwork}>
          <Link href="/aipan-frames/handmade-aipan-wall-decor-with-pichora-background" prefetch={false}>
            <picture>
              <source media="(max-width: 767px)" srcSet={`${frameImage}-card.webp`} />
              <Image src={`${frameImage}.webp`} alt="Framed red and white Om Aipan artwork on a yellow Pichora-inspired background" width={1200} height={1600} sizes="(max-width: 767px) calc(100vw - 40px), 532px" />
            </picture>
          </Link>
          <figcaption><Link href="/aipan-frames/handmade-aipan-wall-decor-with-pichora-background" prefetch={false}>Aipan wall decor with a Pichora background</Link></figcaption>
        </figure>
        <div className={styles.journeyCopy}>
          <p className={styles.eyebrow}>Sneha · Pithoragarh</p>
          <h2 id="sneha-story-title">An interest in art.<br /><em>A connection to home.</em></h2>
          <div className={styles.storyChapter}>
            <h3>Giving that connection a form</h3>
            <p>Sneha’s enthusiasm for art and curiosity about her Kumaoni heritage came together in making. Frames, Aipan-inspired work and keepsakes became ways to share the culture she felt connected to.</p>
          </div>
          <div className={styles.storyChapter}>
            <h3>Sharing it on Instagram</h3>
            <p>She began posting her work on Instagram. The response from customers gave her the encouragement to keep creating and to grow KumaonRang beyond those first conversations.</p>
          </div>
          <div className={styles.storyChapter}>
            <h3>A home for the growing collection</h3>
            <p>That support led to this website: a place to explore the pieces, find a gift and speak directly with Sneha. Art, Pahadi culture and the everyday details of Uttarakhand continue to shape what comes next.</p>
          </div>
          <a className={styles.textLink} href="https://www.instagram.com/art_gallery_05s/" target="_blank" rel="noopener noreferrer">Visit Sneha’s Instagram<span className="sr-only"> (opens in a new tab)</span></a>
        </div>
      </div>
    </section>
  </>;
}
