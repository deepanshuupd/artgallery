import type { Metadata } from "next";
import { defaultShareImage, homeTitle, homeDescription } from "@/lib/seo";
import { getSiteUrl } from "@/lib/site";
import { JsonLd } from "@/components/seo/json-ld";

import { CuratedHampersSection } from "@/components/home/curated-hampers-section";
import { FeaturedCollections } from "@/components/home/featured-collections";
import { HeroSection } from "@/components/home/hero-section";
import { HeritageStory } from "@/components/home/heritage-story";
import { CustomerNotes } from "@/components/home/customer-notes";
import { ColoursOfKumaon } from "@/components/home/colours-of-kumaon";
import { ShopPicks } from "@/components/home/shop-picks";
import postcardStyles from "@/components/about/studio-postcard.module.css";
import homeStyles from "@/components/home/home-palette.module.css";
import { getProducts } from "@/lib/products";
import type { Product, ProductCategory } from "@/types/product";
import { getProductImage, type ProductImageReference } from "@/lib/product-image";

// Sharing the homepage represents the brand, not whichever product is featured.
// Keep product-page previews independent, with their own catalogue photos.
export const metadata: Metadata = {
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
    images: [{ ...defaultShareImage, url: `${getSiteUrl()}${defaultShareImage.url}`, type: "image/png" }],
  },
  twitter: { title: homeTitle, description: homeDescription,
    card: "summary_large_image",
    images: [`${getSiteUrl()}${defaultShareImage.url}`],
  },
};

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
  const categoryFromPrices: Partial<Record<ProductCategory, number>> = {};
  for (const category of FEATURED_CATEGORIES) {
    const image = imageFor(category);
    if (image) categoryImages[category] = image;
    const prices = products.filter(product => product.category === category && product.inStock !== false && product.price > 0).map(product => product.price);
    if (prices.length) categoryFromPrices[category] = Math.min(...prices);
  }

  // Describe a photograph actually displayed in the collection journey, rather
  // than an unrelated first catalogue record. Sharing still uses the brand icon.
  const primaryPhoto = categoryImages.Frames ?? categoryImages.Keychains;
  const primaryImage = primaryPhoto ? {
    "@type": "ImageObject", url: new URL(primaryPhoto.src, getSiteUrl()).href,
    contentUrl: new URL(primaryPhoto.src, getSiteUrl()).href,
    name: primaryPhoto.alt, description: primaryPhoto.alt,
    ...(primaryPhoto.caption ? { caption: primaryPhoto.caption } : {}),
    ...(primaryPhoto.width && primaryPhoto.height ? { width: primaryPhoto.width, height: primaryPhoto.height } : {}),
  } : undefined;

  return (
    <main className={`${postcardStyles.homePage} ${homeStyles.page}`}>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "WebPage",
        "@id": `${getSiteUrl()}#webpage`, url: getSiteUrl(), name: homeTitle,
        ...(primaryImage ? { primaryImageOfPage: primaryImage } : {}),
      }} />
      <HeroSection />
      <FeaturedCollections images={categoryImages} fromPrices={categoryFromPrices} />
      <ShopPicks products={products} />
      <CustomerNotes />
      <ColoursOfKumaon />
      <CuratedHampersSection product={products.find((product) => product.category === "Curated Hampers" && product.image)} />
      <HeritageStory />
    </main>
  );
}
