import Link from "next/link";

import { ResponsiveImage } from "@/components/responsive-image";
import styles from "./home-doorway.module.css";

/**
 * The homepage as a Kumaoni doorway: Aipan is drawn on the threshold (dehli)
 * to welcome guests, so the red-and-white border sits beneath the arch.
 */
export function HomeDoorway() {
  return (
    <section className={styles.doorway} aria-labelledby="welcome-title">
      <div className={styles.inner}>
        <div className={styles.entrance} aria-hidden="true">
          <div className={styles.arch}>
            <ResponsiveImage className={styles.welcome} src="/images/culture/kumaoni-welcome-v1.webp" alt=""
              width={1024} height={1536} sizes="(max-width: 767px) 56vw, 380px" priority />
          </div>
          <div className={styles.threshold} />
        </div>
        <div className={styles.copy}>
          <p className={styles.place}>Pithoragarh · Uttarakhand</p>
          <h1 id="welcome-title">Aipan art &amp; Pahadi gifts <em>from Kumaon</em></h1>
          <p className={styles.intro}>Frames, keychains, hampers and personalised gifts from Sneha’s small shop in the hills.</p>
          <div className={styles.actions}>
            <Link prefetch={false} href="/collection" className={styles.primary}>Shop the collection</Link>
            <Link prefetch={false} href="/curated-hampers" className={styles.secondary}>Gift hampers <span aria-hidden="true">→</span></Link>
          </div>
          <ul className={styles.promises}>
            <li>Made in Pithoragarh</li>
            <li>Order on WhatsApp</li>
            <li>Ready pieces dispatch in 2–3 days</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
