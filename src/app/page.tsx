import type { Metadata } from "next";
import { homeTitle, homeDescription } from "@/lib/seo";
import { getSiteUrl } from "@/lib/site";
import { JsonLd } from "@/components/seo/json-ld";
import { getProductImageObjects } from "@/lib/product-image-schema";

import { CuratedHampersSection } from "@/components/home/curated-hampers-section";
import { FeaturedCollections } from "@/components/home/featured-collections";
import { HeroSection } from "@/components/home/hero-section";
import { HeritageStory } from "@/components/home/heritage-story";
import { CustomerNotes } from "@/components/home/customer-notes";
import { ColoursOfKumaon } from "@/components/home/colours-of-kumaon";
import postcardStyles from "@/components/about/studio-postcard.module.css";
import homeStyles from "@/components/home/home-palette.module.css";
import { getProducts } from "@/lib/products";
import type { Product, ProductCategory } from "@/types/product";
import { getProductImage, type ProductImageReference } from "@/lib/product-image";

function featuredProduct(products: Product[]): Product | undefined {
  return products.find((product) => product.image && /aipan|pahadi|pichora|kumaon/i.test(product.name)) ??
    products.find(product => product.image);
}

export async function generateMetadata(): Promise<Metadata> {
  const featured = featuredProduct(await getProducts());
  const image = featured ? getProductImage(featured) : undefined;
  return {
    title: { absolute: homeTitle },
    description: homeDescription,
    keywords: [
      "Aipan art gifts online",
      "handmade Uttarakhand souvenir",
      "Pahadi keychain Uttarakhand",
      "Kumaoni heritage gifts",
      "gift from Uttarakhand",
    ],
    openGraph: {
      title: homeTitle, description: homeDescription, url: getSiteUrl(), type: "website",
      siteName: "KumaonRang", locale: "en_IN",
      ...(image?.src ? { images: [{ url: image.src, alt: image.alt,
        ...(image.width && image.height ? { width: image.width, height: image.height } : {}),
      }] } : {}),
    },
    twitter: { title: homeTitle, description: homeDescription,
      card: image?.src ? "summary_large_image" : "summary",
      ...(image?.src ? { images: [image.src] } : {}),
    },
  };
}

export const revalidate = 60;

// Prefer these real catalogue photos, otherwise another available photo in the
// same category. Never revive a stale, unindexable image from a removed product.
const PREFERRED_IMAGES: Partial<Record<ProductCategory, string>> = {
  Keychains: "Pahadi Ladka Keychain",
  Frames: "Aipan Wall Decor with Pichora Background",
};

const FEATURED_CATEGORIES: ProductCategory[] = [
  "Keychains",
  "Frames",
  "Fridge Magnets",
  "Personalized Gifts",
];

export default async function HomePage() {
  const products = await getProducts();
  const culturalFeaturedProduct = featuredProduct(products);
  const primaryImage = culturalFeaturedProduct ? getProductImageObjects(culturalFeaturedProduct, getSiteUrl())[0] : undefined;

  const imageFor = (category: ProductCategory): ProductImageReference | undefined => {
    const preferred = PREFERRED_IMAGES[category];

    if (preferred) {
      const match = products.find(
        (product: Product) =>
          product.category === category && product.image &&
          product.name.trim().toLowerCase() === preferred.toLowerCase()
      );
      if (match?.image) return getProductImage(match);
    }

    const firstInCategory = products.find(
      (product: Product) => product.category === category && Boolean(product.image)
    );

    return firstInCategory ? getProductImage(firstInCategory) : undefined;
  };

  const categoryImages: Partial<Record<ProductCategory, ProductImageReference>> = {};
  for (const category of FEATURED_CATEGORIES) {
    const image = imageFor(category);
    if (image) categoryImages[category] = image;
  }

  return (
    <main className={`${postcardStyles.homePage} ${homeStyles.page}`}>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "WebPage",
        "@id": `${getSiteUrl()}#webpage`, url: getSiteUrl(), name: homeTitle,
        ...(primaryImage ? { primaryImageOfPage: primaryImage } : {}),
      }} />
      <HeroSection featuredProduct={culturalFeaturedProduct} />
      <FeaturedCollections images={categoryImages} />
      <ColoursOfKumaon />
      <CustomerNotes />
      <CuratedHampersSection product={products.find((product) => product.category === "Curated Hampers" && product.image)} />
      <HeritageStory />
    </main>
  );
}
