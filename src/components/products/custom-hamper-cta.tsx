"use client";

import Link from "next/link";
import { motion } from "motion/react";

import { ArrowUpRightIcon, SparkleIcon } from "@/components/icons";

export function CustomHamperCta() {
  return (
    <section className="relative px-4 py-14 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <motion.div
          className="relative overflow-hidden rounded-[1.5rem] border border-[rgba(168,69,48,0.35)] bg-[var(--color-geru)] px-6 py-14 text-center shadow-[0_24px_60px_rgba(47,36,29,0.24)] sm:px-10 sm:py-16 lg:py-20"
          initial={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.3 }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <div aria-hidden="true">
            <div className="aipan-motif absolute inset-0 opacity-30" />
            <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(255,250,241,0.72)] to-transparent" />
          </div>

          <span className="relative inline-flex h-14 w-14 items-center justify-center rounded-xl border border-white/25 bg-white/10 text-[var(--color-biswar)]">
            <SparkleIcon className="h-6 w-6" />
          </span>

          <p className="relative mt-6 text-[0.72rem] uppercase tracking-[0.38em] text-stone-300">
            Not finding the one
          </p>

          <h2 className="relative mx-auto mt-5 max-w-2xl text-3xl leading-[1.1] text-[var(--color-porcelain)] sm:text-4xl lg:text-5xl">
            Create your own
            <span className="block text-[var(--color-champagne)]">
              custom hamper.
            </span>
          </h2>

          <p className="relative mx-auto mt-5 max-w-xl text-base leading-8 text-stone-300">
            Tell us the occasion, the person, and your budget — we&apos;ll
            curate a one-of-a-kind hamper built entirely around your story.
          </p>

          <div className="relative mt-9 flex justify-center">
            <Link
            className="group inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full bg-[var(--color-biswar)] px-8 py-3.5 text-sm font-medium uppercase tracking-[0.18em] text-[var(--color-geru)] shadow-[0_18px_48px_rgba(47,36,29,0.2)] transition-transform duration-300 hover:-translate-y-0.5 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-biswar)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-geru)]"
              href="/contact"
            >
              Design my custom hamper
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                <ArrowUpRightIcon className="h-4 w-4" />
              </span>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
