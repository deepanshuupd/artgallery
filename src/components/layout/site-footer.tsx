import Link from "next/link";

import { BrandMark } from "@/components/layout/brand-mark";
import { brand } from "@/lib/brand";
import { navigationItems } from "@/lib/navigation";
import { generateGeneralInquiryLink } from "@/lib/whatsapp";
import { collections } from "@/lib/collections";
import styles from "./site-footer.module.css";

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.shell}>
        <div className={styles.layout}>
          <div className={styles.identity}>
            <Link prefetch={false} className={styles.logo} href="/">
              <BrandMark priority={false} />
            </Link>
            <p>{brand.descriptor}. Aipan-inspired art, Pahadi keepsakes, and personal gifts made in Pithoragarh.</p>
          </div>

          <div>
            <p className={styles.heading}>Explore</p>
            <nav className={styles.links} aria-label="Footer navigation">
              {navigationItems.map(item => <Link prefetch={false} key={item.href} href={item.href}>{item.label}</Link>)}
              <Link prefetch={false} href="/uttarakhand-gifts">Uttarakhand gifts</Link>
              <Link prefetch={false} href="/aipan-art">Aipan art guide</Link>
            </nav>
          </div>

          <div>
            <p className={styles.heading}>Shop</p>
            <nav className={styles.links} aria-label="Shop collections">
              {collections.map(collection => <Link key={collection.slug} prefetch={false} href={"/" + collection.slug}>{collection.label}</Link>)}
            </nav>
          </div>

          <div className={styles.contact}>
            <div>
              <p className={styles.heading}>From the hills</p>
              <p className={styles.address}>Pithoragarh, Uttarakhand<br />India</p>
            </div>
            <a className={styles.whatsapp} href={generateGeneralInquiryLink()} rel="noreferrer" target="_blank">
              Chat on WhatsApp<span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>
        </div>
        <div className={styles.bottom}>
          <p>© {new Date().getFullYear()} KumaonRang. Made in Kumaon.</p>
          <p>Colour · Craft · Keepsakes</p>
        </div>
      </div>
    </footer>
  );
}
