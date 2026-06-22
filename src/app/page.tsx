import { CuratedHampersSection } from "@/components/home/curated-hampers-section";
import { FeaturedCollections } from "@/components/home/featured-collections";
import { HeroSection } from "@/components/home/hero-section";

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <FeaturedCollections />
      <CuratedHampersSection />
    </main>
  );
}
