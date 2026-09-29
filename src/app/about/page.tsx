import type { Metadata } from "next";

import { AboutCta } from "@/components/about/about-cta";
import { AboutHero } from "@/components/about/about-hero";
import { AboutValues } from "@/components/about/about-values";

export const metadata: Metadata = {
  title: "About",
  description:
    "Meet KumaonRang, a Pithoragarh gifting studio crafting Aipan-inspired art, Pahadi keepsakes, personalized gifts, and Kumaon hampers.",
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
