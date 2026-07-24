import { CuratedHampersSection } from "@/components/home/curated-hampers-section";
import { FeaturedCollections } from "@/components/home/featured-collections";
import { HeroSection, type HeroHighlight } from "@/components/home/hero-section";
import { getProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

const HERO_PRODUCT_NAMES = {
  keychain: "Pahadi Ladka Keychain",
  frame: "Handmade Aipan wall decor with pichora background",
  hamper: "Curated Hamper",
};

// Known-good image URLs from Supabase storage, used if the name lookup
// below doesn't find a match (e.g. the product was renamed in the DB).
const HERO_FALLBACK_IMAGES = {
  keychain:
    "https://psqdrmdyucsyiuugvitd.supabase.co/storage/v1/object/public/product-images/1784226676459.jpeg",
  frame:
    "https://psqdrmdyucsyiuugvitd.supabase.co/storage/v1/object/public/product-images/1784829433073-qvqke5znec.jpeg",
  hamper:
    "https://psqdrmdyucsyiuugvitd.supabase.co/storage/v1/object/public/product-images/1784826909910-1dn6yd5ca7g.jpeg",
};

export default async function HomePage() {
  const products = await getProducts();

  const findByName = (name: string) =>
    products.find(
      (product) => product.name.trim().toLowerCase() === name.toLowerCase()
    );

  const highlights: HeroHighlight[] = [
    {
      eyebrow: "Signature",
      title: "Handmade Keychains",
      href: "/collection?category=Keychains",
      image:
        findByName(HERO_PRODUCT_NAMES.keychain)?.image ??
        HERO_FALLBACK_IMAGES.keychain,
      fallbackGradient:
        "bg-[linear-gradient(180deg,rgba(201,164,106,0.24),rgba(255,253,252,0.88))]",
    },
    {
      eyebrow: "Bespoke",
      title: "Customized Frames",
      href: "/collection?category=Frames",
      image:
        findByName(HERO_PRODUCT_NAMES.frame)?.image ??
        HERO_FALLBACK_IMAGES.frame,
      fallbackGradient:
        "bg-[linear-gradient(180deg,rgba(185,131,116,0.2),rgba(255,253,252,0.94))]",
    },
    {
      eyebrow: "Premium gifting",
      title: "Sneha Curated Hampers",
      description:
        "Thoughtfully styled gift boxes for celebrations, milestones, and elegant personal gestures.",
      href: "/curated-hampers",
      image:
        findByName(HERO_PRODUCT_NAMES.hamper)?.image ??
        HERO_FALLBACK_IMAGES.hamper,
      fallbackGradient:
        "bg-[linear-gradient(180deg,rgba(122,130,114,0.18),rgba(255,253,252,0.94))]",
    },
  ];

  return (
    <main>
      <HeroSection highlights={highlights} />
      <FeaturedCollections />
      <CuratedHampersSection />
    </main>
  );
}
