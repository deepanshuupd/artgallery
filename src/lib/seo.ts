import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/site";

export const homeTitle = "KumaonRang | Aipan Art, Pahadi Keychains & Gifts";

export const homeDescription =
  "Shop Aipan art, Pahadi keychains, personalised gifts and curated hampers from Kumaon. Discover keepsakes rooted in Pithoragarh, Uttarakhand.";

export function conciseText(value: string, limit: number): string {
  const text = value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  if (text.length <= limit) return text;
  const shortened = text.slice(0, limit - 1);
  const boundary = shortened.lastIndexOf(" ");
  return `${boundary > limit / 2 ? shortened.slice(0, boundary) : shortened}…`;
}

/** Each indexable page owns its canonical and share metadata, not the homepage. */
export function pageMetadata({ title, description, path, image, imageAlt, imageWidth, imageHeight }: {
  title: string; description: string; path: string; image?: string;
  imageAlt?: string; imageWidth?: number; imageHeight?: number;
}): Metadata {
  const fullTitle = `${conciseText(title, 47)} | KumaonRang`;
  const summary = conciseText(description, 160);
  const url = `${getSiteUrl()}${path}`;
  return {
    title: { absolute: fullTitle },
    description: summary,
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle, description: summary, url, type: "website",
      siteName: "KumaonRang", locale: "en_IN",
      ...(image ? { images: [{ url: image, alt: imageAlt || title,
        ...(imageWidth && imageHeight ? { width: imageWidth, height: imageHeight } : {}),
      }] } : {}),
    },
    twitter: {
      card: image ? "summary_large_image" : "summary", title: fullTitle,
      description: summary, ...(image ? { images: [image] } : {}),
    },
  };
}
