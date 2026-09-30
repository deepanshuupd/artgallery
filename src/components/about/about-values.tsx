"use client";

import { motion } from "motion/react";

import {
  GiftIcon,
  HeartIcon,
  PaletteIcon,
  SparkleIcon,
} from "@/components/icons";

const values = [
  {
    title: "Rooted in Kumaon",
    description:
      "Aipan-inspired patterns, Pahadi keepsakes and the colours of the hills keep a connection to home at the centre of the collection.",
    icon: PaletteIcon,
    accent: "rgba(201,164,106,0.24)",
  },
  {
    title: "Room for your story",
    description:
      "A name, a photograph, a shared memory. Talk to Sneha about the personal touches available for the gift you have in mind.",
    icon: HeartIcon,
    accent: "rgba(185,131,116,0.22)",
  },
  {
    title: "Gifting as an experience",
    description:
      "Choosing a gift starts with the person it is for. Share the occasion and your ideas, and explore something that feels right for them.",
    icon: GiftIcon,
    accent: "rgba(122,130,114,0.2)",
  },
  {
    title: "A small business, growing",
    description:
      "Every purchase, recommendation and return visit helps Sneha grow KumaonRang while keeping its connection to Pithoragarh close.",
    icon: SparkleIcon,
    accent: "rgba(151,117,95,0.18)",
  },
];

const processSteps = [
  {
    step: "01",
    title: "Share the story",
    description:
      "Message us on WhatsApp with the occasion, the person, and any ideas you already love.",
  },
  {
    step: "02",
    title: "Make it personal",
    description:
      "Discuss the available designs, personalisation, price and timing with Sneha before confirming your order.",
  },
  {
    step: "03",
    title: "Plan the delivery",
    description:
      "Confirm the delivery details and any occasion date when ordering, so you know what to expect.",
  },
];

export function AboutValues() {
  return (
    <section className="relative px-4 py-7 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="absolute inset-x-0 top-10 h-40 bg-[radial-gradient(circle_at_center,rgba(201,164,106,0.12),transparent_68%)]" />
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
            What we stand by
          </p>
          <h2 className="mt-4 text-3xl leading-tight text-stone-900 sm:text-3xl lg:text-5xl">
            What keeps this small business
            <span className="block text-[var(--color-rose-clay)]">
              close to its roots.
            </span>
          </h2>
        </motion.div>

        <div className="mt-6 grid gap-5 sm:mt-14 sm:grid-cols-2 xl:grid-cols-4">
          {values.map((value, index) => {
            const Icon = value.icon;

            return (
              <motion.article
                key={value.title}
                className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-white/60 bg-[rgba(255,253,252,0.82)] p-6 shadow-[0_18px_60px_rgba(51,40,33,0.08)] backdrop-blur transition-shadow duration-300 hover:shadow-[0_28px_80px_rgba(51,40,33,0.14)]"
                initial={{ opacity: 0, y: 24 }}
                transition={{ duration: 0.6, delay: index * 0.08, ease: "easeOut" }}
                viewport={{ once: true, amount: 0.3 }}
                whileHover={{ y: -8 }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <div
                  aria-hidden="true"
                  className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-[var(--color-champagne)] to-transparent"
                />
                <div
                  aria-hidden="true"
                  className="absolute -right-12 top-10 h-28 w-28 rounded-full blur-2xl transition-transform duration-500 group-hover:scale-110"
                  style={{ backgroundColor: value.accent }}
                />

                <div className="relative flex h-full flex-col">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-stone-200/70 bg-white/80 text-stone-800 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105">
                    <Icon />
                  </span>

                  <h3 className="mt-3 text-xl leading-tight text-stone-900">
                    {value.title}
                  </h3>

                  <p className="mt-4 flex-1 text-sm leading-6 text-stone-600">
                    {value.description}
                  </p>
                </div>
              </motion.article>
            );
          })}
        </div>

        <div className="mt-8 sm:mt-24">
          <motion.div
            className="mx-auto max-w-3xl text-center"
            initial={{ opacity: 0, y: 18 }}
            transition={{ duration: 0.65, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.4 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <p className="text-[0.72rem] uppercase tracking-[0.36em] text-stone-500 sm:text-xs">
              How it works
            </p>
            <h2 className="mt-4 text-3xl leading-tight text-stone-900 sm:text-3xl">
              From your idea to their hands.
            </h2>
          </motion.div>

          <ol className="mt-6 grid gap-5 sm:grid-cols-3">
            {processSteps.map((item, index) => (
              <motion.li
                key={item.step}
                className="relative rounded-xl border border-stone-200/70 bg-white/60 p-6 backdrop-blur sm:p-7"
                initial={{ opacity: 0, y: 24 }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
                viewport={{ once: true, amount: 0.3 }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <span
                  aria-hidden="true"
                  className="font-serif text-5xl leading-none text-[var(--color-champagne)]"
                >
                  {item.step}
                </span>
                <h3 className="mt-4 text-xl leading-tight text-stone-900 sm:text-2xl">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-stone-600">
                  {item.description}
                </p>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
