import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";

import "./globals.css";

import { SiteHeader } from "@/components/layout/site-header";
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

const siteUrl = getSiteUrl();

const siteDescription =
  "Luxury handmade gifting by Sneha — personalized keychains, customized frames, fridge magnets, and curated hampers, handcrafted in Pithoragarh, Uttarakhand.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Art Gallery by Sneha — Handmade Gifting & Curated Hampers",
    template: "%s · Art Gallery by Sneha",
  },
  description: siteDescription,
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Art Gallery by Sneha",
    title: "Art Gallery by Sneha — Handmade Gifting & Curated Hampers",
    description: siteDescription,
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "Art Gallery by Sneha",
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
        className={`${cormorantGaramond.variable} ${manrope.variable} min-h-screen bg-[var(--color-ivory)] text-[var(--color-espresso)] antialiased`}
      >
        <SiteHeader />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
