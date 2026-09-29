"use client";

import { motion } from "motion/react";

import { fadeInUp } from "@/lib/motion";

const highlights = [
  "Handmade in small batches",
  "Personalized to your story",
  "Wrapped with intention",
  "From the Kumaon hills",
];

export function AboutHero() {
  return (
    <section className="relative overflow-hidden px-4 py-14 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
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
              className="mt-4 font-serif text-4xl leading-[1.08] text-stone-900 sm:text-5xl lg:text-6xl"
              transition={{ duration: 0.7, delay: 0.08, ease: "easeOut" }}
            >
              Made by hand,
              <span className="block text-[var(--color-rose-clay)]">
                made to mean something.
              </span>
            </motion.h1>

            <motion.p
              {...fadeInUp}
              className="mt-6 max-w-2xl text-base leading-8 text-stone-700 sm:text-lg"
              transition={{ duration: 0.7, delay: 0.16, ease: "easeOut" }}
            >
              KumaonRang is a small gifting studio in Pithoragarh, Uttarakhand,
              where Aipan-inspired art, Pahadi keepsakes, and personal gifts are
              made one at a time — for one person at a time.
            </motion.p>

            <motion.div
              {...fadeInUp}
              className="mt-8 space-y-5 text-sm leading-7 text-stone-600 sm:text-base sm:leading-8"
              transition={{ duration: 0.7, delay: 0.24, ease: "easeOut" }}
            >
              <p>
                What began as an afternoon habit of painting small keepsakes has
                grown into a practice rooted in colour, memory, and small
                details: hand-finished keychains, frames, magnets, and gifts
                built around names, dates, and inside jokes.
              </p>
              <p>
                KumaonRang hampers bring the same thoughtfulness to birthdays,
                weddings, festivals, and celebrations — layered with useful
                keepsakes and the warmth of something made by hand.
              </p>
              <p>
                Every order starts as a conversation on WhatsApp. Tell us who
                it&apos;s for and the moment you&apos;re marking, and we
                sketch, craft, wrap, and send it off from the Kumaon hills to
                your doorstep.
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

              <p
                aria-hidden="true"
                className="font-serif text-6xl leading-none text-[var(--color-champagne)]"
              >
                &ldquo;
              </p>
              <blockquote className="-mt-4">
                <p className="font-serif text-2xl leading-snug text-stone-900 sm:text-[1.7rem]">
                  The best gifts carry a person, a place, or a memory home.
                </p>
                <footer className="mt-4 text-[0.68rem] uppercase tracking-[0.3em] text-stone-500">
                  KumaonRang — Pithoragarh
                </footer>
              </blockquote>

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
