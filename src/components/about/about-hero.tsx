import { StoryMap } from "./story-map";
import styles from "./our-story.module.css";

export function AboutHero() {
  return (
    <section className={styles.origin} aria-labelledby="story-title" data-story-map-section>
      <div className={`${styles.shell} ${styles.originLayout}`}>
        <header className={styles.introduction}>
          <p className={styles.eyebrow}>Our story</p>
          <h1 id="story-title">It starts with<br /><em>a place called home.</em></h1>
          <p>Uttarakhand is home to two divisions: Garhwal and Kumaon. We come from Pithoragarh, in Kumaon.</p>
          <p>This is where Sneha’s story — and KumaonRang — begins.</p>
        </header>
        <StoryMap />
      </div>
    </section>
  );
}
