import type { Metadata } from "next";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";

import "./globals.css";

import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { brand } from "@/lib/brand";
import { getSiteUrl } from "@/lib/site";
import { homeTitle, homeDescription } from "@/lib/seo";
import { CartProvider } from "@/components/cart/cart-provider";

// Self-hosted so builds never depend on fetching Google Fonts. Files are
// Google Fonts sources subset to Latin + ₹ (and Devanagari for Tiro), limited
// to the weights used; licences are in ./fonts/OFL-*.txt.
const cormorantGaramond = localFont({
  src: "./fonts/cormorant-garamond-latin.woff2",
  variable: "--font-heading",
  weight: "500 700",
  adjustFontFallback: "Times New Roman",
});

const manrope = localFont({
  src: "./fonts/manrope-latin.woff2",
  variable: "--font-body",
  weight: "400 700",
});

const tiroDevanagari = localFont({
  src: "./fonts/tiro-devanagari-hindi.woff2",
  variable: "--font-devanagari",
  weight: "400",
  adjustFontFallback: "Times New Roman",
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
              sameAs: ["https://www.instagram.com/kumaonrang/"],
              // Google's URL-based policy option preserves the full damage and
              // statutory-rights wording without inventing a return window.
              hasMerchantReturnPolicy: {
                "@type": "MerchantReturnPolicy",
                "@id": `${siteUrl}/returns-policy#policy`,
                merchantReturnLink: `${siteUrl}/returns-policy`,
              },
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
        <a className="skip-link" href="#main-content">Skip to content</a>
        <CartProvider>
        <SiteHeader />
        <div id="main-content" tabIndex={-1}>{children}</div>
        <SiteFooter />
        {process.env.VERCEL === "1" && <Analytics />}
        </CartProvider>
      </body>
    </html>
  );
}
