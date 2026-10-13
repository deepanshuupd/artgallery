import Link from "next/link";
import { ArrowUpRightIcon } from "@/components/icons";
import { HamperBasketArt } from "@/components/hamper/hamper-art";
import styles from "./custom-hamper-cta.module.css";

export function CustomHamperCta() {
  return <section className={styles.section} aria-labelledby="custom-hamper-heading">
    <div className={styles.invitation}>
      <div className={styles.copy}>
        <p className="craft-eyebrow">The KumaonRang hamper studio</p>
        <h2 id="custom-hamper-heading">A little of this.<br /><em>A lot of thought.</em></h2>
        <p>Pick the little things they’ll love. Fill your basket, tuck in a note, and let Sneha bring your very own hamper together.</p>
        <Link prefetch={false} href="/build-your-hamper" className={styles.button}>Design my custom hamper <ArrowUpRightIcon /></Link>
        <span className={styles.assurance}>Choose first. Availability & pricing confirmed with Sneha.</span>
      </div>
      <div className={styles.visual}>
        <span className={styles.stamp}>Chosen by you<br /><em>packed with love</em></span>
        <HamperBasketArt pieces={[{id:"pendant"},{id:"scrunchie"},{id:"keychain"},{id:"note"},{id:"candle"}]} />
        <p>Every little piece, picked for them.</p>
      </div>
    </div>
  </section>;
}
