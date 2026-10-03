import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";

import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { CustomHamperCta } from "@/components/products/custom-hamper-cta";
import { ProductShowcase } from "@/components/products/product-showcase";
import guideStyles from "@/components/products/collection-guide.module.css";
import { getProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Gift Hampers & Pichwai Jar Gift Combos",
    path: "/curated-hampers",
    description: "Explore gift hampers and Pichwai jar gift combos at KumaonRang. Choose a gift for a birthday, housewarming or celebration, and discuss custom details.",
  }),
};

export default async function CuratedHampersPage() {
  const products = await getProducts();
  const hampers = products.filter(
    (product) => product.category === "Curated Hampers"
  );

  return (
    <main className="relative overflow-hidden">
      <div className="heritage-shell">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Gift hampers", href: "/curated-hampers" }]} />
      </div>
      <section className="relative px-4 py-6 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[var(--color-espresso)]" />
        <div aria-hidden="true" className="aipan-motif absolute inset-0 -z-10 opacity-20" />

        <div className="mx-auto max-w-7xl">
          <p className="text-[0.72rem] uppercase tracking-[0.38em] text-stone-300">
            KumaonRang Hampers
          </p>
          <h1 className="mt-3 max-w-2xl font-serif text-3xl leading-[1.06] text-[var(--color-porcelain)] sm:text-5xl lg:text-6xl">
            Gift hampers,{" "}
            <span className="block text-[var(--color-champagne)]">
              with a little belonging.
            </span>
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-300 sm:text-lg">
            From Pichwai jar gift combos to carefully put-together gift boxes,
            find something for their birthday, new home or just-because moment.
            Curated by Sneha in Pithoragarh, with the person receiving it in mind.
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
          <section className="store-editorial" aria-labelledby="hamper-guide-heading">
            <h2 id="hamper-guide-heading">A gift that feels like them.</h2>
            <p>
              Begin with the person, then the occasion. Compare each hamper’s
              contents and presentation, and share your budget and date with Sneha
              before ordering. A Pichwai-inspired jar combo is a different style
              from our Aipan art; choose the one that feels right for their home.
            </p>
            <div className={guideStyles.questions}>
              <details className={guideStyles.question}>
                <summary>What is included in a gift hamper?</summary>
                <p className={guideStyles.answer}>
                  Each hamper has its own combination. Read the individual listing
                  and confirm the included items, quantities and packaging on WhatsApp.
                  For a jar combo, check whether the jars are empty or filled rather
                  than assuming food or other photographed props are included.
                </p>
              </details>
              <details className={guideStyles.question}>
                <summary>Can I make a hamper personal?</summary>
                <p className={guideStyles.answer}>
                  Share who the gift is for, the occasion and any message or changes
                  you would like. Sneha will confirm which options are possible for
                  the selected hamper, along with the price and preparation time.
                </p>
              </details>
              <details className={guideStyles.question}>
                <summary>What should I check for a date-specific or group order?</summary>
                <p className={guideStyles.answer}>
                  Send the hamper link, quantity, delivery postcode and occasion
                  date before placing an order. Availability, preparation, delivery
                  charges and timing need to be confirmed for your request.
                </p>
              </details>
            </div>
            <div className={guideStyles.guide}>
              <Link prefetch={false} href="/uttarakhand-gifts">Looking for a single keepsake? Explore our Uttarakhand gift guide.</Link>
            </div>
          </section>
        </div>
      </section>

      <CustomHamperCta />
    </main>
  );
}
