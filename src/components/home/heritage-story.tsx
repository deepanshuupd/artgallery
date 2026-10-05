import Link from "next/link";
import { UttarakhandMap } from "./uttarakhand-map";
import styles from "./origin-story.module.css";

export function HeritageStory() {
  return <section className={`heritage-story-section ${styles.origin}`} aria-labelledby="heritage-title">
    <div className={`${styles.layout} heritage-shell`}>
      <UttarakhandMap />
      <div className={styles.copy} data-home-reveal="story-copy">
        <h2 id="heritage-title">Our home in Kumaon</h2>
        <p>Sneha started KumaonRang in Pithoragarh, Uttarakhand. Aipan art, Pahadi keepsakes and gifts bring the colours and culture of these hills into everyday life.</p>
        <Link prefetch={false} href="/about" className={styles.storyLink}>Meet Sneha</Link>
      </div>
    </div>
  </section>;
}
