"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion } from "motion/react";

import { getProductPath } from "@/lib/catalog";
import { fadeInUpMount } from "@/lib/motion";
import type { Product } from "@/types/product";

type HeroSectionProps = {
  featuredProduct?: Product;
};

export function HeroSection({ featuredProduct }: HeroSectionProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const showProductImage = Boolean(featuredProduct?.image) && !imageFailed;

  return (
    <section className="relative overflow-hidden px-4 pb-14 pt-8 sm:px-6 sm:pb-20 sm:pt-12 lg:px-8 lg:pb-24">
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="absolute inset-x-0 top-0 h-[34rem] bg-[linear-gradient(115deg,rgba(164,65,42,0.12),rgba(247,241,234,0.25)_52%,rgba(87,101,78,0.11))]" />
        <div className="absolute inset-0 opacity-[0.045] [background-image:linear-gradient(45deg,transparent_47%,var(--color-espresso)_48%,var(--color-espresso)_52%,transparent_53%),linear-gradient(-45deg,transparent_47%,var(--color-espresso)_48%,var(--color-espresso)_52%,transparent_53%)] [background-size:28px_28px]" />
      </div>

      <div className="mx-auto grid min-h-[calc(100vh-156px)] max-w-7xl items-center gap-10 py-10 lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.86fr)] lg:gap-16 lg:py-14">
        <div className="max-w-3xl">
          <motion.p
            {...fadeInUpMount}
            className="text-[0.72rem] uppercase tracking-[0.38em] text-stone-600 sm:text-xs"
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            Pithoragarh · Uttarakhand
          </motion.p>

          <motion.h1
            {...fadeInUpMount}
            className="mt-5 text-5xl leading-[0.98] text-stone-900 sm:text-6xl lg:text-7xl"
            transition={{ duration: 0.7, delay: 0.08, ease: "easeOut" }}
          >
            A little piece of
            <span className="block text-[var(--color-rose-clay)]">Kumaon, made to keep.</span>
          </motion.h1>

          <motion.p
            {...fadeInUpMount}
            className="mt-7 max-w-2xl text-base leading-8 text-stone-700 sm:text-lg"
            transition={{ duration: 0.7, delay: 0.16, ease: "easeOut" }}
          >
            Aipan-inspired art, Pahadi keepsakes, and personal gifts handcrafted
            for the people, places, and memories that feel like home.
          </motion.p>

          <motion.div
            {...fadeInUpMount}
            className="mt-9 flex flex-col gap-3 sm:flex-row"
            transition={{ duration: 0.7, delay: 0.24, ease: "easeOut" }}
          >
            <Link
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-stone-900 px-7 py-3 text-sm font-medium uppercase tracking-[0.18em] text-stone-50 shadow-[0_16px_40px_rgba(51,40,33,0.2)] transition-transform duration-300 hover:-translate-y-0.5 hover:bg-stone-800"
              href="/collection"
            >
              Explore the collection
            </Link>
            <Link
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-[rgba(51,40,33,0.18)] bg-[rgba(255,253,252,0.78)] px-7 py-3 text-sm font-medium uppercase tracking-[0.18em] text-stone-900 transition-transform duration-300 hover:-translate-y-0.5 hover:bg-white"
              href="/curated-hampers"
            >
              Curated hampers
            </Link>
          </motion.div>
        </div>

        <motion.div
          {...fadeInUpMount}
          className="relative mx-auto w-full max-w-xl"
          transition={{ duration: 0.75, delay: 0.18, ease: "easeOut" }}
        >
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2.35rem] bg-[var(--color-espresso)] shadow-[0_28px_80px_rgba(51,40,33,0.24)]">
            {showProductImage ? (
              <Image
                alt={featuredProduct?.name ?? "Handmade Kumaoni gift"}
                className="object-cover"
                fill
                onError={() => setImageFailed(true)}
                priority
                sizes="(max-width: 1024px) 100vw, 42vw"
                src={featuredProduct!.image}
              />
            ) : (
              <div className="flex h-full flex-col justify-end bg-[linear-gradient(145deg,#6e281e,#332821)] p-8 text-[var(--color-porcelain)] sm:p-10">
                <p className="text-[0.68rem] uppercase tracking-[0.34em] text-[var(--color-champagne)]">Art Gallery by Sneha</p>
                <p className="mt-4 max-w-sm text-4xl leading-tight">Made with a memory of the hills.</p>
              </div>
            )}
            <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_42%,rgba(38,25,19,0.76))]" />
            <div className="absolute inset-x-6 bottom-6 flex items-end justify-between gap-4 text-[var(--color-porcelain)] sm:inset-x-8 sm:bottom-8">
              <div>
                <p className="text-[0.65rem] uppercase tracking-[0.3em] text-white/75">Handmade in Kumaon</p>
                <p className="mt-2 font-serif text-2xl leading-tight sm:text-3xl">{featuredProduct?.name ?? "A keepsake with a story"}</p>
              </div>
              {featuredProduct ? (
                <Link
                  aria-label={`View ${featuredProduct.name}`}
                  className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/40 bg-white/10 text-xl transition hover:bg-white/20"
                  href={getProductPath(featuredProduct)}
                >
                  ↗
                </Link>
              ) : null}
            </div>
          </div>
          <div aria-hidden="true" className="absolute -bottom-5 -left-5 -z-10 h-28 w-28 rounded-full border border-[var(--color-rose-clay)]/30 bg-[var(--color-ivory)]" />
        </motion.div>
      </div>
    </section>
  );
}
