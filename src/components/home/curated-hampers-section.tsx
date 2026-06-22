"use client";

import Link from "next/link";
import { motion } from "motion/react";

const hamperCategories = [
  {
    name: "Birthday Hampers",
    note: "Joyful, intimate, and beautifully wrapped for memorable celebrations.",
  },
  {
    name: "Anniversary Hampers",
    note: "Romantic gifting with layered details, keepsakes, and warm sentiment.",
  },
  {
    name: "Corporate Hampers",
    note: "Refined presentation crafted for clients, teams, and thoughtful brand gestures.",
  },
  {
    name: "Wedding Hampers",
    note: "Elegant curation for bridal moments, ceremonies, and cherished family gifting.",
  },
  {
    name: "Festive Hampers",
    note: "Seasonal gifting designed to feel abundant, graceful, and celebratory.",
  },
];

export function CuratedHampersSection() {
  return (
    <section className="relative px-4 py-18 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-x-0 top-0 h-full bg-[linear-gradient(180deg,rgba(51,40,33,0.98),rgba(72,58,48,0.96))]" />
        <div className="absolute left-1/2 top-16 h-72 w-72 -translate-x-1/2 rounded-full bg-[rgba(201,164,106,0.18)] blur-3xl" />
        <div className="absolute right-0 top-24 h-56 w-56 rounded-full bg-[rgba(185,131,116,0.12)] blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-stretch">
          <motion.div
            className="relative overflow-hidden rounded-[2.25rem] border border-[rgba(255,255,255,0.12)] bg-[linear-gradient(155deg,rgba(255,253,252,0.12),rgba(255,253,252,0.04))] p-7 shadow-[0_30px_90px_rgba(0,0,0,0.22)] backdrop-blur-sm sm:p-8 lg:p-10"
            initial={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.3 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(201,164,106,0.86)] to-transparent" />

            <p className="text-[0.72rem] uppercase tracking-[0.38em] text-stone-300">
              Sneha Curated Hampers
            </p>

            <h2 className="mt-5 max-w-2xl text-3xl leading-[1.06] text-[var(--color-porcelain)] sm:text-4xl lg:text-5xl">
              A more indulgent way
              <span className="block text-[var(--color-champagne)]">
                to gift with intention.
              </span>
            </h2>

            <p className="mt-6 max-w-2xl text-base leading-8 text-stone-300 sm:text-lg">
              Designed as an elevated sub-brand, our curated hampers blend
              handcrafted warmth with an editorial sense of styling, detail, and
              celebration.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {hamperCategories.slice(0, 2).map((item, index) => (
                <motion.div
                  key={item.name}
                  className="rounded-[1.75rem] border border-[rgba(255,255,255,0.1)] bg-[rgba(255,253,252,0.06)] p-5"
                  initial={{ opacity: 0, y: 20 }}
                  transition={{
                    duration: 0.55,
                    delay: 0.12 + index * 0.1,
                    ease: "easeOut",
                  }}
                  viewport={{ once: true, amount: 0.4 }}
                  whileInView={{ opacity: 1, y: 0 }}
                >
                  <p className="text-[0.68rem] uppercase tracking-[0.3em] text-[var(--color-champagne)]">
                    Signature edit
                  </p>
                  <h3 className="mt-8 text-2xl leading-tight text-[var(--color-porcelain)]">
                    {item.name}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-stone-300">
                    {item.note}
                  </p>
                </motion.div>
              ))}
            </div>

            <motion.div
              className="mt-8"
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.32, ease: "easeOut" }}
              viewport={{ once: true, amount: 0.4 }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <Link
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-[var(--color-champagne)] px-7 py-3 text-sm font-medium uppercase tracking-[0.18em] text-stone-950 shadow-[0_18px_48px_rgba(201,164,106,0.2)] transition-transform duration-300 hover:-translate-y-0.5 hover:bg-[#d6b27a]"
                href="/curated-hampers"
              >
                Explore Curated Hampers
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            className="grid gap-5"
            initial={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.7, delay: 0.12, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.25 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <div className="grid gap-5 sm:grid-cols-2">
              {hamperCategories.slice(2, 4).map((item) => (
                <motion.article
                  key={item.name}
                  className="group relative overflow-hidden rounded-[2rem] border border-[rgba(255,255,255,0.1)] bg-[linear-gradient(170deg,rgba(255,253,252,0.12),rgba(255,253,252,0.04))] p-6 shadow-[0_20px_70px_rgba(0,0,0,0.16)]"
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <div className="absolute -right-10 top-8 h-24 w-24 rounded-full bg-[rgba(201,164,106,0.16)] blur-2xl transition-transform duration-500 group-hover:scale-110" />
                  <p className="relative text-[0.68rem] uppercase tracking-[0.3em] text-stone-300">
                    Curated series
                  </p>
                  <h3 className="relative mt-10 text-3xl leading-tight text-[var(--color-porcelain)]">
                    {item.name}
                  </h3>
                  <p className="relative mt-4 text-sm leading-7 text-stone-300">
                    {item.note}
                  </p>
                </motion.article>
              ))}
            </div>

            <motion.article
              className="relative overflow-hidden rounded-[2rem] border border-[rgba(255,255,255,0.1)] bg-[linear-gradient(140deg,rgba(201,164,106,0.2),rgba(255,253,252,0.08))] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.18)] sm:p-8"
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-[rgba(255,255,255,0.24)] to-transparent" />
              <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
                <div>
                  <p className="text-[0.68rem] uppercase tracking-[0.3em] text-stone-200">
                    Seasonal feature
                  </p>
                  <h3 className="mt-5 text-3xl leading-tight text-[var(--color-porcelain)] sm:text-4xl">
                    {hamperCategories[4].name}
                  </h3>
                  <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-200 sm:text-base">
                    {hamperCategories[4].note} Layered textures, warm tones, and
                    premium details make this collection feel especially rich and
                    celebratory.
                  </p>
                </div>

                <Link
                  className="inline-flex min-h-12 items-center justify-center rounded-full border border-[rgba(255,255,255,0.22)] bg-[rgba(255,253,252,0.08)] px-6 py-3 text-sm font-medium uppercase tracking-[0.18em] text-[var(--color-porcelain)] transition-transform duration-300 hover:-translate-y-0.5 hover:bg-[rgba(255,253,252,0.14)]"
                  href="/curated-hampers"
                >
                  View the Edit
                </Link>
              </div>
            </motion.article>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
