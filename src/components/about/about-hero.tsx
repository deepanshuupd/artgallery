"use client";

import { motion } from "motion/react";

import { fadeInUp } from "@/lib/motion";

const highlights = [
  "Run by Sneha",
  "Based in Pithoragarh",
  "Rooted in Kumaon",
  "A growing small business",
];

export function AboutHero() {
  return (
    <section className="relative overflow-hidden px-4 py-7 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
      <div aria-hidden="true" className="aipan-motif absolute inset-0 -z-10 opacity-20" />

      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)] lg:gap-16">
          <div className="max-w-3xl">
            <motion.p
              {...fadeInUp}
              className="text-[0.72rem] uppercase tracking-[0.36em] text-stone-500 sm:text-xs"
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              Our story
            </motion.p>

            <motion.h1
              {...fadeInUp}
              className="mt-4 font-serif text-3xl leading-[1.08] text-stone-900 sm:text-5xl lg:text-6xl"
              transition={{ duration: 0.7, delay: 0.08, ease: "easeOut" }}
            >
              For the places and people
              <span className="block text-[var(--color-rose-clay)]">
                that feel like home.
              </span>
            </motion.h1>

            <motion.p
              {...fadeInUp}
              className="mt-6 max-w-2xl text-sm leading-6 text-stone-700 sm:text-lg"
              transition={{ duration: 0.7, delay: 0.16, ease: "easeOut" }}
            >
              KumaonRang is run by Sneha, a woman from Pithoragarh, Uttarakhand,
              building a small business around a connection that is deeply
              personal: the place she calls home.
            </motion.p>

            <motion.div
              {...fadeInUp}
              className="mt-8 space-y-5 text-sm leading-6 text-stone-600 sm:text-base sm:leading-8"
              transition={{ duration: 0.7, delay: 0.24, ease: "easeOut" }}
            >
              <p>
                The red and white of Aipan. A familiar Pahadi face. A gift that
                reminds someone of their people. These are the connections at
                the heart of KumaonRang — bringing a sense of belonging into
                everyday things, whether you live in the hills or miss them
                from far away.
              </p>
              <p>
                Growing a small business is about more than reaching more
                people. It is about giving them a reason to care. Here, that
                reason is a personal connection: to a place, to a memory, or to
                the person you are choosing a gift for. From a small keychain
                to a celebration hamper, there is room for all of those stories.
              </p>
              <p>
                When you choose KumaonRang, share it with a friend, or come
                back for another gift, you help Sneha’s business take its next
                step. That is how this story grows — through real people
                finding something here that feels like their own.
              </p>
            </motion.div>
          </div>

          <motion.div
            {...fadeInUp}
            className="relative mx-auto w-full max-w-md"
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          >
            <div className="relative overflow-hidden rounded-[1.5rem] border border-[rgba(168,69,48,0.2)] bg-[var(--color-biswar)] p-7 shadow-[0_18px_48px_rgba(47,36,29,0.12)] sm:p-8">
              <div aria-hidden="true" className="aipan-motif absolute inset-x-0 top-0 h-16 opacity-30" />

              <p className="relative font-serif text-4xl leading-tight text-[var(--color-geru)]">Kumaon + रंग</p>
              <p className="relative mt-4 text-sm leading-7 text-stone-700">
                A place, and its colours. Our name holds both — the Kumaon hills
                Sneha comes from, and the colour she is sharing through this
                small business.
              </p>
              <p className="mt-5 font-serif text-xl text-stone-900">
                Small beginnings. A connection worth growing.
              </p>

              <ul className="mt-8 grid grid-cols-1 gap-3 min-[420px]:grid-cols-2">
                {highlights.map((highlight, index) => (
                  <motion.li
                    key={highlight}
                    className="flex items-center gap-2.5 rounded-2xl border border-stone-200/70 bg-white/70 px-4 py-3 text-xs font-medium leading-5 text-stone-700"
                    initial={{ opacity: 0, y: 12 }}
                    transition={{ duration: 0.45, delay: 0.3 + index * 0.08, ease: "easeOut" }}
                    viewport={{ once: true, amount: 0.4 }}
                    whileInView={{ opacity: 1, y: 0 }}
                  >
                    <span
                      aria-hidden="true"
                      className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-champagne)]"
                    />
                    {highlight}
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
