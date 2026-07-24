"use client";

import { AnimatePresence, motion } from "motion/react";
import { useDeferredValue, useState } from "react";

import { ProductCard } from "@/components/products/product-card";
import type { Product } from "@/types/product";

type HamperShowcaseProps = {
  hampers: Product[];
};

export function HamperShowcase({ hampers }: HamperShowcaseProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const normalizedQuery = deferredSearchQuery.trim().toLowerCase();

  const filteredHampers = hampers.filter((hamper) => {
    if (normalizedQuery.length === 0) return true;

    return (
      hamper.name.toLowerCase().includes(normalizedQuery) ||
      hamper.description.toLowerCase().includes(normalizedQuery)
    );
  });

  return (
    <div className="mt-12 sm:mt-14">
      <motion.section
        className="overflow-hidden rounded-[2rem] border border-white/70 bg-[rgba(255,253,252,0.72)] p-5 shadow-[0_20px_70px_rgba(51,40,33,0.08)] backdrop-blur sm:p-6 lg:p-8"
        initial={{ opacity: 0, y: 18 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.25 }}
        whileInView={{ opacity: 1, y: 0 }}
      >
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,340px)] lg:items-center">
          <div>
            <p className="text-[0.72rem] uppercase tracking-[0.34em] text-stone-500">
              Browse the edit
            </p>
            <h2 className="mt-3 font-serif text-3xl leading-tight text-stone-900 sm:text-4xl">
              Hampers ready to gift
            </h2>
          </div>

          <label className="block">
            <span className="sr-only">Search hampers</span>
            <div className="flex min-h-14 items-center rounded-full border border-stone-200/80 bg-white/80 px-5 shadow-sm transition focus-within:border-stone-300 focus-within:bg-white">
              <svg
                aria-hidden="true"
                className="h-4 w-4 shrink-0 text-stone-500"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
              <input
                className="w-full bg-transparent px-3 text-sm text-stone-900 outline-none placeholder:text-stone-500"
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search by occasion or style"
                type="search"
                value={searchQuery}
              />
            </div>
          </label>
        </div>
      </motion.section>

      <AnimatePresence mode="wait">
        <motion.section
          key={normalizedQuery || "all"}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3"
          exit={{ opacity: 0, y: 10 }}
          initial={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          {filteredHampers.map((hamper, index) => (
            <motion.div
              key={hamper.id}
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 18 }}
              transition={{ duration: 0.35, delay: index * 0.04, ease: "easeOut" }}
            >
              <ProductCard product={hamper} />
            </motion.div>
          ))}
        </motion.section>
      </AnimatePresence>

      {filteredHampers.length === 0 ? (
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 rounded-[2rem] border border-dashed border-stone-300/80 bg-[rgba(255,253,252,0.78)] px-6 py-14 text-center shadow-sm"
          initial={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          <p className="text-[0.72rem] uppercase tracking-[0.34em] text-stone-500">
            No matches found
          </p>
          <h3 className="mt-4 font-serif text-3xl text-stone-900">
            Try a different search term.
          </h3>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-stone-600 sm:text-base">
            Or tell us what you have in mind — every hamper here started as a
            custom request too.
          </p>
        </motion.div>
      ) : null}
    </div>
  );
}
