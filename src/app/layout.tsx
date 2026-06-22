import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";

import "./globals.css";

import { SiteHeader } from "@/components/layout/site-header";

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

export const metadata: Metadata = {
  title: "Art Gallery by Sneha",
  description: "Luxury handmade gifting and curated hampers by Sneha.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${cormorantGaramond.variable} ${manrope.variable} min-h-screen bg-[var(--color-ivory)] text-[var(--color-espresso)] antialiased`}
      >
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
