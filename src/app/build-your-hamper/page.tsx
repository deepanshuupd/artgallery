import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { HamperBuilder } from "@/components/hamper/hamper-builder";
import { pageMetadata } from "@/lib/seo";
import styles from "@/components/hamper/hamper-builder.module.css";

export const metadata = pageMetadata({
  title: "Build Your Own Gift Hamper",
  path: "/build-your-hamper",
  description: "Choose accessories, candles and personal touches for your custom KumaonRang hamper. Review your wishlist, then ask Sneha for availability and a quote on WhatsApp.",
});

export default function BuildYourHamperPage() {
  return <main className={`heritage-shell ${styles.page}`}>
    <Breadcrumbs items={[{label:"Home",href:"/"},{label:"Gift hampers",href:"/curated-hampers"},{label:"Build your hamper",href:"/build-your-hamper"}]} />
    <header className={styles.hero}>
      <p className="craft-eyebrow">The KumaonRang hamper studio</p>
      <h1>A gift only <em>you could put together.</em></h1>
      <p>Little things, chosen for someone special. You pick the pieces. Sneha brings them together.</p>
    </header>
    <HamperBuilder />
  </main>;
}
