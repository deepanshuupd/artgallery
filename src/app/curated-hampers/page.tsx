import type { Metadata } from "next";

import { CustomHamperCta } from "@/components/products/custom-hamper-cta";
import { ProductShowcase } from "@/components/products/product-showcase";
import { getProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Curated Hampers",
  description:
    "Explore KumaonRang hampers — thoughtful gift boxes for birthdays, weddings, festivals, and meaningful celebrations, curated from the Kumaon hills.",
  keywords: [
    "traditional Uttarakhand gifts",
    "personalized Uttarakhand gifts",
    "Kumaoni gifts online",
    "Pahadi handmade gifts",
  ],
};

export default async function CuratedHampersPage() {
  const products = await getProducts();
  const hampers = products.filter(
    (product) => product.category === "Curated Hampers"
  );

  return (
    <main className="relative overflow-hidden">
      <section className="relative px-4 py-14 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[var(--color-espresso)]" />
        <div aria-hidden="true" className="aipan-motif absolute inset-0 -z-10 opacity-20" />

        <div className="mx-auto max-w-7xl">
          <p className="text-[0.72rem] uppercase tracking-[0.38em] text-stone-300">
            KumaonRang Hampers
          </p>
          <h1 className="mt-5 max-w-2xl font-serif text-4xl leading-[1.06] text-[var(--color-porcelain)] sm:text-5xl lg:text-6xl">
            A more indulgent way
            <span className="block text-[var(--color-champagne)]">
              to gift with intention.
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-stone-300 sm:text-lg">
            Layered gift boxes for birthdays, anniversaries, weddings, and
            festivals — built around thoughtful details, meaningful keepsakes,
            and the colours of Kumaon.
          </p>
        </div>
      </section>

      <section className="relative px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <ProductShowcase
            eyebrow="Browse the edit"
            products={hampers}
            searchPlaceholder="Search by occasion or style"
            title="Hampers ready to gift"
          />
        </div>
      </section>

      <CustomHamperCta />
    </main>
  );
}
