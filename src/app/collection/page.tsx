import { CollectionShowcase } from "@/components/products/collection-showcase";
import { getProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function CollectionPage() {
  const products = await getProducts();

  return (
    <main className="relative overflow-hidden px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-x-0 top-0 h-48 bg-[radial-gradient(circle_at_top,rgba(201,164,106,0.12),transparent_68%)]" />
      </div>

      <div className="mx-auto max-w-7xl">
        <section className="max-w-3xl">
          <p className="text-[0.72rem] uppercase tracking-[0.36em] text-stone-500 sm:text-xs">
            Signature collection
          </p>
          <h1 className="mt-4 font-serif text-4xl leading-tight text-stone-900 sm:text-5xl">
            Handmade pieces
            <span className="block text-[var(--color-rose-clay)]">
              curated with warmth and detail.
            </span>
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-stone-700 sm:text-lg">
            Explore our collection of personalized keepsakes, elegant decor, and
            gifting pieces designed to feel intimate, thoughtful, and premium.
          </p>
        </section>

        <CollectionShowcase products={products} />
      </div>
    </main>
  );
}
