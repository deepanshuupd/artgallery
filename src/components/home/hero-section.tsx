"use client";

import Link from "next/link";
import { motion } from "motion/react";

import { fadeInUpMount } from "@/lib/motion";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[26rem] w-[26rem] -translate-x-1/2 rounded-full bg-[rgba(201,164,106,0.16)] blur-3xl sm:h-[32rem] sm:w-[32rem]" />
        <motion.div
          animate={{ y: [0, -10, 0] }}
          className="absolute right-[-4rem] top-24 h-40 w-40 rounded-full border border-[rgba(185,131,116,0.24)] bg-[rgba(255,253,252,0.55)] blur-2xl sm:right-24"
          transition={{ duration: 7, ease: "easeInOut", repeat: Number.POSITIVE_INFINITY }}
        />
        <motion.div
          animate={{ y: [0, 12, 0] }}
          className="absolute bottom-16 left-[-3rem] h-32 w-32 rounded-full border border-[rgba(122,130,114,0.22)] bg-[rgba(255,253,252,0.68)] blur-xl sm:left-16"
          transition={{ duration: 8, ease: "easeInOut", repeat: Number.POSITIVE_INFINITY }}
        />
      </div>

      <div className="mx-auto flex min-h-[calc(100vh-160px)] w-full max-w-4xl flex-col items-center justify-center px-4 py-20 text-center sm:px-6 sm:py-24 lg:px-8">
        <motion.p
          {...fadeInUpMount}
          className="mb-5 text-[0.72rem] uppercase tracking-[0.38em] text-stone-500 sm:text-xs"
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          Handmade gifting boutique
        </motion.p>

        <motion.h1
          {...fadeInUpMount}
          className="text-4xl leading-[1.05] text-stone-900 sm:text-6xl lg:text-7xl"
          transition={{ duration: 0.7, delay: 0.08, ease: "easeOut" }}
        >
          Handcrafted keepsakes
          <span className="block text-[var(--color-rose-clay)]">
            made to hold emotion beautifully.
          </span>
        </motion.h1>

        <motion.p
          {...fadeInUpMount}
          className="mt-6 max-w-2xl text-base leading-8 text-stone-700 sm:mt-8 sm:text-lg"
          transition={{ duration: 0.7, delay: 0.16, ease: "easeOut" }}
        >
          Art Gallery by Sneha creates refined handmade gifts, customized frames,
          magnets, and curated hampers designed to turn heartfelt moments into
          timeless pieces.
        </motion.p>

        <motion.div
          {...fadeInUpMount}
          className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row"
          transition={{ duration: 0.7, delay: 0.24, ease: "easeOut" }}
        >
          <Link
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-stone-900 px-7 py-3 text-sm font-medium uppercase tracking-[0.18em] text-stone-50 shadow-[0_16px_40px_rgba(51,40,33,0.2)] transition-transform duration-300 hover:-translate-y-0.5 hover:bg-stone-800"
            href="/collection"
          >
            Explore Collection
          </Link>
          <Link
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-[rgba(51,40,33,0.14)] bg-[rgba(255,253,252,0.8)] px-7 py-3 text-sm font-medium uppercase tracking-[0.18em] text-stone-900 transition-transform duration-300 hover:-translate-y-0.5 hover:bg-white"
            href="/curated-hampers"
          >
            Explore Hampers
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
