import type { Metadata } from "next";

import { AboutCta } from "@/components/about/about-cta";
import { AboutHero } from "@/components/about/about-hero";
import { AboutValues } from "@/components/about/about-values";

export const metadata: Metadata = {
  title: "Meet Sneha | Our Story",
  description:
    "Meet Sneha, the woman behind KumaonRang in Pithoragarh, Uttarakhand. Discover a small business rooted in Aipan art, Pahadi keepsakes and personal gifts.",
  keywords: [
    "Pithoragarh Aipan art",
    "Uttarakhand folk art",
    "Kumaoni handmade gifts",
    "Pahadi heritage gifts",
  ],
};

export default function AboutPage() {
  return (
    <main>
      <AboutHero />
      <AboutValues />
      <AboutCta />
    </main>
  );
}
