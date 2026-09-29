import type { Metadata } from "next";
import { Tiro_Devanagari_Hindi, Cormorant_Garamond, Manrope } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";

import "./globals.css";

import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { brand } from "@/lib/brand";
import { getSiteUrl } from "@/lib/site";

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["500", "600", "700"],
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
});

const tiroDevanagari = Tiro_Devanagari_Hindi({
  subsets: ["devanagari", "latin"],
  variable: "--font-devanagari",
  weight: "400",
});

const siteUrl = getSiteUrl();

const siteDescription =
  "KumaonRang creates Aipan-inspired art, Pahadi keepsakes, personalized gifts, and curated hampers from Pithoragarh, Uttarakhand.";

const siteKeywords = [
  "Aipan art Uttarakhand",
  "handmade Aipan gifts",
  "Pahadi handmade gifts",
  "Kumaoni gifts online",
  "Uttarakhand souvenirs",
  "Pithoragarh handmade gifts",
  "personalized Uttarakhand gifts",
];

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "KumaonRang — Aipan Art & Pahadi Keepsakes from Kumaon",
    template: "%s · KumaonRang",
  },
  description: siteDescription,
  keywords: siteKeywords,
  alternates: { canonical: siteUrl },
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: brand.name,
    title: "KumaonRang — Aipan Art & Pahadi Keepsakes from Kumaon",
    description: siteDescription,
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: brand.name,
    description: siteDescription,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html data-scroll-behavior="smooth" lang="en">
      <body
        className={`${cormorantGaramond.variable} ${manrope.variable} ${tiroDevanagari.variable} min-h-screen bg-[var(--color-ivory)] text-[var(--color-espresso)] antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: brand.name,
              description: siteDescription,
              url: siteUrl,
              areaServed: "India",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Pithoragarh",
                addressRegion: "Uttarakhand",
                addressCountry: "IN",
              },
              sameAs: [],
            }),
          }}
        />
        <SiteHeader />
        {children}
        <SiteFooter />
        <Analytics />
      </body>
    </html>
  );
}
