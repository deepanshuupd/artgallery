import type { Metadata } from "next";

import { AboutCta } from "@/components/about/about-cta";
import { AboutHero } from "@/components/about/about-hero";
import { AboutValues } from "@/components/about/about-values";

export const metadata: Metadata = {
  title: "About | Art Gallery by Sneha",
  description:
    "The story behind Art Gallery by Sneha — a handmade gifting studio in Pithoragarh, Uttarakhand, crafting personalized keychains, customized frames, fridge magnets, and Sneha Curated Hampers.",
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
