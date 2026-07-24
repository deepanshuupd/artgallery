import type { Metadata } from "next";

import { CustomHamperCta } from "@/components/products/custom-hamper-cta";
import { HamperShowcase } from "@/components/products/hamper-showcase";
import { getProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Curated Hampers | Art Gallery by Sneha",
  description:
    "Explore Sneha Curated Hampers — styled gift boxes for birthdays, anniversaries, weddings, and corporate gifting, or request a fully custom hamper of your own.",
};

export default async function CuratedHampersPage() {
  const products = await getProducts();
  const hampers = products.filter(
    (product) => product.category === "Curated Hampers"
  );

  return (
    <main className="relative overflow-hidden">
      <section className="relative px-4 py-14 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div aria-hidden="true" className="absolute inset-0 -z-10">
          <div className="absolute inset-x-0 top-0 h-full bg-[linear-gradient(180deg,rgba(51,40,33,0.98),rgba(72,58,48,0.96))]" />
          <div className="absolute left-1/2 top-16 h-72 w-72 -translate-x-1/2 rounded-full bg-[rgba(201,164,106,0.18)] blur-3xl" />
          <div className="absolute right-0 top-24 h-56 w-56 rounded-full bg-[rgba(185,131,116,0.12)] blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl">
          <p className="text-[0.72rem] uppercase tracking-[0.38em] text-stone-300">
            Sneha Curated Hampers
          </p>
          <h1 className="mt-5 max-w-2xl font-serif text-4xl leading-[1.06] text-[var(--color-porcelain)] sm:text-5xl lg:text-6xl">
            A more indulgent way
            <span className="block text-[var(--color-champagne)]">
              to gift with intention.
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-stone-300 sm:text-lg">
            Layered gift boxes styled for birthdays, anniversaries, weddings,
            festivals, and corporate gestures — handcrafted warmth with an
            editorial sense of detail.
          </p>
        </div>
      </section>

      <section className="relative px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <HamperShowcase hampers={hampers} />
        </div>
      </section>

      <CustomHamperCta />
    </main>
  );
}
