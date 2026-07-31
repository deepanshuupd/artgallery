"use client";

import Link from "next/link";
import { motion } from "motion/react";

import { ArrowUpRightIcon, SparkleIcon } from "@/components/icons";

export function CustomHamperCta() {
  return (
    <section className="relative px-4 py-14 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <motion.div
          className="relative overflow-hidden rounded-[2.25rem] border border-[rgba(255,255,255,0.12)] bg-[linear-gradient(155deg,rgba(51,40,33,0.98),rgba(72,58,48,0.96))] px-6 py-14 text-center shadow-[0_30px_90px_rgba(0,0,0,0.22)] sm:px-10 sm:py-16 lg:py-20"
          initial={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.3 }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <div aria-hidden="true">
            <div className="absolute left-1/2 top-0 h-56 w-56 -translate-x-1/2 rounded-full bg-[rgba(201,164,106,0.18)] blur-3xl" />
            <div className="absolute -right-10 bottom-0 h-44 w-44 rounded-full bg-[rgba(185,131,116,0.14)] blur-3xl" />
            <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(201,164,106,0.86)] to-transparent" />
          </div>

          <motion.span
            animate={{ rotate: [0, 12, 0, -8, 0] }}
            className="relative inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[rgba(201,164,106,0.16)] text-[var(--color-champagne)]"
            transition={{ duration: 6, ease: "easeInOut", repeat: Number.POSITIVE_INFINITY }}
          >
            <SparkleIcon className="h-6 w-6" />
          </motion.span>

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
              className="group inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full bg-[var(--color-champagne)] px-8 py-3.5 text-sm font-medium uppercase tracking-[0.18em] text-stone-950 shadow-[0_18px_48px_rgba(201,164,106,0.2)] transition-transform duration-300 hover:-translate-y-0.5 hover:bg-[var(--color-champagne-dark)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-champagne)] focus-visible:ring-offset-2 focus-visible:ring-offset-stone-900"
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
