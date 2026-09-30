import type { Metadata } from "next";

import { ProductShowcase } from "@/components/products/product-showcase";
import { getProducts } from "@/lib/products";
import { pageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  ...pageMetadata({ title: "Uttarakhand Gifts & Pahadi Souvenirs", path: "/uttarakhand-gifts", description: "Shop handmade Uttarakhand souvenirs, Kumaoni heritage gifts, personalized Pahadi gifts, Aipan art gifts, and thoughtful keepsakes from Pithoragarh." }),
  keywords: [
    "Uttarakhand souvenirs online",
    "Kumaoni heritage gifts",
    "Pahadi handmade gifts",
    "personalized Pahadi gifts",
    "aipan return gifts",
    "traditional Uttarakhand gifts",
    "gift from Uttarakhand",
  ],
};

export default async function UttarakhandGiftsPage() {
  const products = await getProducts();

  return (
    <main className="relative overflow-hidden px-4 py-14 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,rgba(201,164,106,0.16),transparent_68%)]" />
        <div className="aipan-motif absolute inset-x-0 top-24 -z-10 h-48 opacity-20" />
      </div>

      <div className="mx-auto max-w-7xl">
        <header className="max-w-4xl">
          <p className="text-[0.72rem] uppercase tracking-[0.36em] text-stone-500 sm:text-xs">
            Gifts from the Kumaon hills
          </p>
          <h1 className="mt-4 font-serif text-4xl leading-tight text-stone-900 sm:text-5xl lg:text-6xl">
            Uttarakhand gifts with a{" "}
            <span className="block text-[var(--color-rose-clay)]">
              Pahadi point of view.
            </span>
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-stone-700 sm:text-lg">
            Discover handmade Uttarakhand souvenirs, Kumaoni gifts online, and
            personalized Pahadi gifts made in Pithoragarh. From Aipan art gifts
            and souvenir magnets to keychains, frames, and curated hampers,
            every piece carries a little colour and memory from home.
          </p>
        </header>

        <ProductShowcase
          eyebrow="Shop regional keepsakes"
          products={products}
          searchPlaceholder="Search gifts, souvenirs, or occasions"
          title="Handmade gifts from Uttarakhand"
        />

        <section className="mt-20 grid gap-8 border-t border-stone-200/80 pt-12 md:grid-cols-3">
          <div>
            <h2 className="font-serif text-2xl text-stone-900">Aipan art gifts</h2>
            <p className="mt-3 text-sm leading-7 text-stone-600">
              Choose Aipan-inspired frames, handmade Aipan keychains, and small
              art gifts for people who love Uttarakhand folk art.
            </p>
          </div>
          <div>
            <h2 className="font-serif text-2xl text-stone-900">For meaningful moments</h2>
            <p className="mt-3 text-sm leading-7 text-stone-600">
              Personalised Kumaoni gifts work beautifully for birthdays,
              housewarmings, weddings, pooja gifting, and Pahadi return gifts.
            </p>
          </div>
          <div>
            <h2 className="font-serif text-2xl text-stone-900">Made in Pithoragarh</h2>
            <p className="mt-3 text-sm leading-7 text-stone-600">
              Each keepsake is finished in small batches and sent from
              Pithoragarh, Uttarakhand, with custom details arranged on WhatsApp.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
