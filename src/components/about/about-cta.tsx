import Link from "next/link";
import styles from "./our-story.module.css";

export function AboutCta() {
  return (
    <section className={styles.invitation} aria-labelledby="story-invitation-title">
      <div className={styles.shell}>
        <h2 id="story-invitation-title">Let’s make something<br /><em>meant to be kept.</em></h2>
        <p>A gift for someone you love, or a reminder of home for yourself. Tell Sneha what you have in mind.</p>
        <div className={styles.actions}>
          <Link prefetch={false} href="/contact" className={styles.primaryLink}>Start a conversation</Link>
          <Link prefetch={false} href="/collection" className={styles.secondaryLink}>Explore the collection</Link>
        </div>
      </div>
    </section>
  );
}
