"use client";

import Link from "next/link";
import { motion } from "motion/react";

import { ArrowRightIcon } from "@/components/icons";

const collections = [
  {
    name: "Keychains",
    label: "Signature details",
    description:
      "Delicate handcrafted keychains designed to carry names, memories, and little moments with grace.",
    accent: "rgba(201,164,106,0.24)",
  },
  {
    name: "Frames",
    label: "Bespoke keepsakes",
    description:
      "Customized frames that turn meaningful photographs, notes, and milestones into elegant display pieces.",
    accent: "rgba(185,131,116,0.22)",
  },
  {
    name: "Fridge Magnets",
    label: "Small statement gifts",
    description:
      "Artful magnets that bring warmth and personality to everyday spaces with handcrafted charm.",
    accent: "rgba(122,130,114,0.2)",
  },
  {
    name: "Personalized Gifts",
    label: "Made around your story",
    description:
      "Thoughtful gifting pieces tailored for birthdays, anniversaries, celebrations, and heartfelt surprises.",
    accent: "rgba(151,117,95,0.18)",
  },
];

export function FeaturedCollections() {
  return (
    <section className="relative px-4 py-18 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-x-0 top-16 h-40 bg-[radial-gradient(circle_at_center,rgba(201,164,106,0.12),transparent_68%)]" />
      </div>

      <div className="mx-auto max-w-7xl">
        <motion.div
          className="mx-auto max-w-3xl text-center"
          initial={{ opacity: 0, y: 18 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.4 }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <p className="text-[0.72rem] uppercase tracking-[0.36em] text-stone-500 sm:text-xs">
            Featured collections
          </p>
          <h2 className="mt-4 text-3xl leading-tight text-stone-900 sm:text-4xl lg:text-5xl">
            Crafted for the moments
            <span className="block text-[var(--color-rose-clay)]">
              you want to remember beautifully.
            </span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-stone-700 sm:text-lg">
            Explore our most-loved handmade categories, curated with the warmth
            of gifting and the elegance of a boutique atelier.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-5 sm:mt-14 sm:grid-cols-2 xl:grid-cols-4">
          {collections.map((collection, index) => (
            <motion.div
              key={collection.name}
              className="group h-full"
              initial={{ opacity: 0, y: 24 }}
              transition={{
                duration: 0.6,
                delay: index * 0.08,
                ease: "easeOut",
              }}
              viewport={{ once: true, amount: 0.3 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -8 }}
            >
              <Link
                className="relative flex h-full min-h-[20rem] flex-col overflow-hidden rounded-[2rem] border border-white/60 bg-[rgba(255,253,252,0.82)] p-6 shadow-[0_18px_60px_rgba(51,40,33,0.08)] backdrop-blur transition-shadow duration-300 hover:shadow-[0_28px_80px_rgba(51,40,33,0.14)]"
                href="/collection"
              >
                <div
                  className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-[var(--color-champagne)] to-transparent"
                  aria-hidden="true"
                />
                <div
                  className="absolute -right-12 top-10 h-28 w-28 rounded-full blur-2xl transition-transform duration-500 group-hover:scale-110"
                  style={{ backgroundColor: collection.accent }}
                  aria-hidden="true"
                />

                <div className="relative flex h-full flex-col">
                  <p className="text-[0.68rem] uppercase tracking-[0.32em] text-stone-500">
                    {collection.label}
                  </p>

                  <h3 className="mt-5 text-3xl leading-tight text-stone-900">
                    {collection.name}
                  </h3>

                  <p className="mt-5 flex-1 text-sm leading-7 text-stone-600">
                    {collection.description}
                  </p>

                  <div className="mt-8 flex items-center justify-between border-t border-stone-200/70 pt-4 text-sm uppercase tracking-[0.18em] text-stone-800">
                    <span>Explore</span>
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-stone-300/80 bg-white/80 transition-transform duration-300 group-hover:translate-x-1">
                      <ArrowRightIcon className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
