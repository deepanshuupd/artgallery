"use client";

import Link from "next/link";
import { motion } from "motion/react";

const fadeInUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
};

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[26rem] w-[26rem] -translate-x-1/2 rounded-full bg-[rgba(201,164,106,0.16)] blur-3xl sm:h-[32rem] sm:w-[32rem]" />
        <motion.div
          animate={{ y: [0, -10, 0] }}
          className="absolute right-[-4rem] top-24 h-40 w-40 rounded-full border border-[rgba(185,131,116,0.24)] bg-[rgba(255,253,252,0.55)] blur-2xl sm:right-20"
          transition={{ duration: 7, ease: "easeInOut", repeat: Number.POSITIVE_INFINITY }}
        />
        <motion.div
          animate={{ y: [0, 12, 0] }}
          className="absolute bottom-12 left-[-3rem] h-32 w-32 rounded-full border border-[rgba(122,130,114,0.22)] bg-[rgba(255,253,252,0.68)] blur-xl sm:left-12"
          transition={{ duration: 8, ease: "easeInOut", repeat: Number.POSITIVE_INFINITY }}
        />
      </div>

      <div className="mx-auto flex min-h-[calc(100vh-88px)] w-full max-w-7xl items-center px-4 py-14 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="grid w-full items-center gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)] lg:gap-16">
          <div className="max-w-3xl">
            <motion.p
              {...fadeInUp}
              className="mb-5 text-[0.72rem] uppercase tracking-[0.38em] text-stone-500 sm:text-xs"
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              Handmade gifting boutique
            </motion.p>

            <motion.h1
              {...fadeInUp}
              className="text-4xl leading-[1.05] text-stone-900 sm:text-5xl lg:text-7xl"
              transition={{ duration: 0.7, delay: 0.08, ease: "easeOut" }}
            >
              Handcrafted keepsakes
              <span className="block text-[var(--color-rose-clay)]">
                made to hold emotion beautifully.
              </span>
            </motion.h1>

            <motion.p
              {...fadeInUp}
              className="mt-6 max-w-2xl text-base leading-8 text-stone-700 sm:mt-8 sm:text-lg"
              transition={{ duration: 0.7, delay: 0.16, ease: "easeOut" }}
            >
              Art Gallery by Sneha creates refined handmade gifts, customized
              frames, magnets, and curated hampers designed to turn heartfelt
              moments into timeless pieces.
            </motion.p>

            <motion.div
              {...fadeInUp}
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

          <motion.div
            animate={{ y: [0, -8, 0] }}
            className="relative mx-auto w-full max-w-md"
            transition={{ duration: 7, ease: "easeInOut", repeat: Number.POSITIVE_INFINITY }}
          >
            <div className="relative overflow-hidden rounded-[2rem] border border-white/60 bg-[linear-gradient(160deg,rgba(255,253,252,0.94),rgba(247,241,234,0.86))] p-6 shadow-[0_24px_80px_rgba(51,40,33,0.12)] backdrop-blur">
              <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-[var(--color-champagne)] to-transparent" />

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.5rem] bg-[linear-gradient(180deg,rgba(201,164,106,0.24),rgba(255,253,252,0.88))] p-5">
                  <p className="text-[0.68rem] uppercase tracking-[0.3em] text-stone-500">
                    Signature
                  </p>
                  <p className="mt-12 font-serif text-2xl leading-tight text-stone-900">
                    Handmade Keychains
                  </p>
                </div>

                <div className="rounded-[1.5rem] bg-[linear-gradient(180deg,rgba(185,131,116,0.2),rgba(255,253,252,0.94))] p-5">
                  <p className="text-[0.68rem] uppercase tracking-[0.3em] text-stone-500">
                    Bespoke
                  </p>
                  <p className="mt-12 font-serif text-2xl leading-tight text-stone-900">
                    Customized Frames
                  </p>
                </div>

                <div className="rounded-[1.5rem] bg-[linear-gradient(180deg,rgba(122,130,114,0.18),rgba(255,253,252,0.94))] p-5 sm:col-span-2">
                  <p className="text-[0.68rem] uppercase tracking-[0.3em] text-stone-500">
                    Premium gifting
                  </p>
                  <p className="mt-10 font-serif text-3xl leading-tight text-stone-900">
                    Sneha Curated Hampers
                  </p>
                  <p className="mt-3 max-w-sm text-sm leading-7 text-stone-600">
                    Thoughtfully styled gift boxes for celebrations, milestones,
                    and elegant personal gestures.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
