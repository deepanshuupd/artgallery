"use client";

import Link from "next/link";
import { motion } from "motion/react";

export function AboutCta() {
  return (
    <section className="relative px-4 py-7 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <motion.div
          className="relative overflow-hidden rounded-[1.5rem] border border-[rgba(168,69,48,0.32)] bg-[var(--color-geru)] px-6 py-7 text-center shadow-[0_24px_60px_rgba(47,36,29,0.22)] sm:px-10 sm:py-16 lg:py-20"
          initial={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.3 }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <div aria-hidden="true">
            <div className="aipan-motif absolute inset-0 opacity-30" />
            <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(255,250,241,0.8)] to-transparent" />
          </div>

          <p className="relative text-[0.72rem] uppercase tracking-[0.38em] text-stone-300">
            Start something personal
          </p>

          <h2 className="relative mx-auto mt-5 max-w-2xl text-3xl leading-[1.1] text-[var(--color-porcelain)] sm:text-3xl lg:text-5xl">
            Let&apos;s make something
            <span className="block text-[var(--color-champagne)]">
              meant to be kept.
            </span>
          </h2>

          <p className="relative mx-auto mt-5 max-w-xl text-sm leading-6 text-stone-300">
            A custom piece, a curated hamper, or just an idea you can&apos;t
            quite describe yet — share it with Sneha and start a conversation.
          </p>

          <div className="relative mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-[var(--color-biswar)] px-7 py-3 text-sm font-medium uppercase tracking-[0.18em] text-[var(--color-geru)] shadow-[0_18px_48px_rgba(47,36,29,0.2)] transition-transform duration-300 hover:-translate-y-0.5 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-biswar)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-geru)]"
              href="/contact"
            >
              Start a conversation
            </Link>
            <Link
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-[rgba(255,255,255,0.22)] bg-[rgba(255,253,252,0.08)] px-7 py-3 text-sm font-medium uppercase tracking-[0.18em] text-[var(--color-porcelain)] transition-transform duration-300 hover:-translate-y-0.5 hover:bg-[rgba(255,253,252,0.14)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-900"
              href="/collection"
            >
              Explore the collection
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
