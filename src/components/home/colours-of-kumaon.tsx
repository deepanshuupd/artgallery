import Image from "next/image";
import Link from "next/link";
import styles from "./colours-of-kumaon.module.css";

export function ColoursOfKumaon() {
  return (
    <section className={styles.section} aria-labelledby="kumaon-colours-title">
      <div className={`heritage-shell ${styles.layout}`}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>Our culture, in colour</p>
          <h2 id="kumaon-colours-title">Kumaon,<br /><em>in full colour.</em></h2>
          <p>From the colour of Chholiya to the patterns of Aipan, our culture finds its way into the art and keepsakes we share.</p>
          <Link href="/uttarakhand-gifts" prefetch={false} className={styles.link}>Explore Uttarakhand gifts</Link>
        </div>
        <div className={styles.artwork}>
          <picture>
            <source media="(max-width: 767px)" srcSet="/images/culture/kumaoni-dancer-mobile.webp" />
            <Image src="/images/culture/kumaoni-dancer.webp" width={1440} height={810}
              alt="Illustration of a Chholiya dancer in red, blue and yellow, holding a sword and shield"
              sizes="(max-width: 767px) 680px, 900px" />
          </picture>
        </div>
      </div>
    </section>
  );
}
