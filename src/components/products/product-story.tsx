import { CraftOrnament } from "@/components/home/craft-ornament";
import styles from "./product-story.module.css";

/** The same saved story is shown on the storefront and in the admin preview. */
export function ProductStory({ story }: { story: string }) {
  if (!story.trim()) return null;

  return (
    <section className={styles.story} aria-label="The story behind this piece">
      <div className={styles.heading}>
        <CraftOrnament className={styles.ornament} />
        <h2 className={styles.label}>Behind this piece</h2>
      </div>
      <p className={styles.copy}>{story.trim()}</p>
    </section>
  );
}
