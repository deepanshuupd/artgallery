import type { Metadata } from "next";
import { Tiro_Devanagari_Hindi, Cormorant_Garamond, Manrope } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";

import "./globals.css";

import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { brand } from "@/lib/brand";
import { getSiteUrl } from "@/lib/site";
import { homeTitle, homeDescription } from "@/lib/seo";

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

const siteDescription = homeDescription;

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
    default: homeTitle,
    template: "%s · KumaonRang",
  },
  description: siteDescription,
  keywords: siteKeywords,
  alternates: { canonical: siteUrl },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: brand.name,
    title: homeTitle,
    description: siteDescription,
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: homeTitle,
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
            __html: JSON.stringify([{
              "@context": "https://schema.org",
              "@type": "Organization",
              "@id": `${siteUrl}#business`,
              name: brand.name,
              description: siteDescription,
              url: siteUrl,
              logo: `${siteUrl}/brand/kumaonrang-logo-v3.png`,
              areaServed: "India",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Pithoragarh",
                addressRegion: "Uttarakhand",
                addressCountry: "IN",
              },
              sameAs: ["https://www.instagram.com/art_gallery_05s/"],
            }, {
              "@context": "https://schema.org",
              "@type": "WebSite",
              "@id": `${siteUrl}#website`,
              name: brand.name,
              url: siteUrl,
              inLanguage: "en-IN",
              publisher: { "@id": `${siteUrl}#business` },
            }]).replace(/</g, "\\u003c"),
          }}
        />
        <SiteHeader />
        {children}
        <SiteFooter />
        {process.env.VERCEL === "1" && <Analytics />}
      </body>
    </html>
  );
}
