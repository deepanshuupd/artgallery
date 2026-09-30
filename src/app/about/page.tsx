import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

import { AboutCta } from "@/components/about/about-cta";
import { AboutHero } from "@/components/about/about-hero";
import { AboutValues } from "@/components/about/about-values";
import styles from "@/components/about/studio-postcard.module.css";

export const metadata: Metadata = {
  ...pageMetadata({ title: "Our Story | A Small Business from Kumaon", path: "/about", description: "Meet Sneha, the woman behind KumaonRang in Pithoragarh, Uttarakhand. Discover a small business rooted in Aipan art, Pahadi keepsakes and personal gifts." }),
  keywords: [
    "Pithoragarh Aipan art",
    "Uttarakhand folk art",
    "Kumaoni handmade gifts",
    "Pahadi heritage gifts",
  ],
};

export default function AboutPage() {
  return (
    <main className={styles.page}>
      <AboutHero />
      <AboutValues />
      <AboutCta />
    </main>
  );
}
