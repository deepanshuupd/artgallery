import type { Metadata } from "next";

import { ProductShowcase } from "@/components/products/product-showcase";
import { getProducts } from "@/lib/products";
import { pageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  ...pageMetadata({ title: "Aipan Art from Pithoragarh | Kumaoni Wall Decor", path: "/pithoragarh-aipan-art", description: "Explore Pithoragarh Aipan art, handmade Aipan frames, Kumaoni wall art, Pichora-inspired decor, and Pahadi heritage gifts by KumaonRang." }),
  keywords: [
    "Pithoragarh Aipan art",
    "Aipan art Pithoragarh",
    "handmade Aipan frame",
    "Aipan wall art frame",
    "Pichora frame",
    "Kumaoni wall art",
    "Pahadi heritage wall decor",
  ],
};

export default async function PithoragarhAipanArtPage() {
  const products = await getProducts();
  const artProducts = products.filter(
    (product) => product.category === "Frames" || product.category === "Keychains",
  );

  return (
    <main className="relative overflow-hidden px-4 py-14 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="aipan-motif absolute inset-x-0 top-0 h-52 opacity-25" />
        <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-[rgba(185,131,116,0.1)] blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl">
        <header className="max-w-4xl">
          <p className="text-[0.72rem] uppercase tracking-[0.36em] text-stone-500 sm:text-xs">
            A folk-art story from Kumaon
          </p>
          <h1 className="mt-4 font-serif text-4xl leading-tight text-stone-900 sm:text-5xl lg:text-6xl">
            Pithoragarh Aipan art for{" "}
            <span className="block text-[var(--color-rose-clay)]">
              modern keepsakes and walls.
            </span>
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-stone-700 sm:text-lg">
            KumaonRang creates Aipan-inspired art in Pithoragarh, Uttarakhand,
            translating the rhythm of traditional Kumaoni folk art into frames,
            wall decor, and small gifts made to travel. The collection brings
            together red-and-white Aipan character, Pahadi memories, and
            personalised details without losing the warmth of handmade work.
          </p>
        </header>

        <section className="mt-12 max-w-3xl border-l-2 border-[var(--color-champagne)] pl-5 text-sm leading-7 text-stone-600 sm:text-base">
          <h2 className="font-serif text-2xl text-stone-900">Aipan, made personal</h2>
          <p className="mt-3">
            Looking for an Aipan photo frame, a handmade Aipan frame, or Kumaoni
            wall art for a home? Tell us the occasion, colours, names, or
            photographs you have in mind. We can help shape a Pahadi heritage
            piece for a housewarming, pooja gift, wedding, or thoughtful return
            gift.
          </p>
        </section>

        <ProductShowcase
          eyebrow="Explore Aipan-inspired pieces"
          products={artProducts}
          searchPlaceholder="Search Aipan art or Pahadi decor"
          title="Frames and keepsakes from Kumaon"
        />

        <section className="mt-20 grid gap-8 border-t border-stone-200/80 pt-12 md:grid-cols-2">
          <div>
            <h2 className="font-serif text-2xl text-stone-900">A local studio, a wider home</h2>
            <p className="mt-3 text-sm leading-7 text-stone-600">
              Our work begins in Pithoragarh and travels across India as a gift,
              souvenir, or reminder of the hills. Every order is discussed
              directly so the finished piece feels connected to its recipient.
            </p>
          </div>
          <div>
            <h2 className="font-serif text-2xl text-stone-900">More than wall decor</h2>
            <p className="mt-3 text-sm leading-7 text-stone-600">
              Aipan-inspired keychains and personalised gifts make the same
              visual language easy to carry, share, and give for birthdays,
              festivals, and everyday moments.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
