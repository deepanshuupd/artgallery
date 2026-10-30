import Link from "next/link";

import { UttarakhandMap } from "./uttarakhand-map";
import styles from "./home-story.module.css";

/** Origin and plain-language context, linking the guides search visitors look for. */
export function HomeStory() {
  return (
    <section className={styles.story} aria-labelledby="heritage-title">
      <div className={styles.inner}>
        <UttarakhandMap />
        <div className={styles.copy}>
          <h2 id="heritage-title">From Pithoragarh, in Kumaon</h2>
          <p>
            KumaonRang is Sneha’s small shop in Pithoragarh, Uttarakhand. It brings{" "}
            <Link prefetch={false} href="/aipan-art">Aipan art</Link>, the red-and-white folk art of Kumaon, and
            Pahadi keepsakes into frames, keychains, magnets and gifts, alongside hampers and personalised pieces.
          </p>
          <p>
            Choosing for someone else? Start with our{" "}
            <Link prefetch={false} href="/uttarakhand-gifts">Uttarakhand gift guide</Link>.
          </p>
          <Link prefetch={false} href="/about" className={styles.meet}>Meet Sneha <span aria-hidden="true">→</span></Link>
        </div>
      </div>
    </section>
  );
}
