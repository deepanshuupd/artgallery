import Link from "next/link";

import styles from "./gifting-paths.module.css";

const paths = [
  { href: "/curated-hampers", title: "Ready gift hampers", note: "Boxes and combos, chosen by Sneha." },
  { href: "/build-your-hamper", title: "Build your own hamper", note: "Pick the pieces, then confirm with Sneha." },
  { href: "/bulk-orders", title: "Wedding & bulk gifts", note: "Return gifts, favours and group orders." },
  { href: "/kumaoni-gifts", title: "Personalised keepsakes", note: "Names, photos and custom wording." },
];

export function GiftingPaths() {
  return (
    <section className={styles.section} aria-labelledby="gifting-title">
      <div className={styles.inner}>
        <h2 id="gifting-title">Gifting for an occasion</h2>
        <ul className={styles.list}>
          {paths.map(path => (
            <li key={path.href}>
              <Link prefetch={false} href={path.href} className={styles.path}>
                <span className={styles.title}>{path.title}</span>
                <span className={styles.note}>{path.note}</span>
                <span className={styles.arrow} aria-hidden="true">→</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
