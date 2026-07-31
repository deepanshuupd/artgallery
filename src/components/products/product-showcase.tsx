"use client";

import { AnimatePresence, motion } from "motion/react";
import { useDeferredValue, useState } from "react";

import { SearchIcon } from "@/components/icons";
import { ProductCard } from "@/components/products/product-card";
import type { Product, ProductCategory } from "@/types/product";

type ProductShowcaseProps = {
  products: Product[];
  /** Eyebrow + heading shown above the grid. */
  eyebrow: string;
  title: string;
  /** Show the category filter chips + result count (Collection page). */
  showCategoryFilter?: boolean;
  /** Preselected category when filters are shown (e.g. from `?category=`). */
  initialCategory?: string;
  searchPlaceholder?: string;
};

const filters: Array<{ label: string; value: ProductCategory | "All" }> = [
  { label: "All", value: "All" },
  { label: "Keychains", value: "Keychains" },
  { label: "Frames", value: "Frames" },
  { label: "Fridge Magnets", value: "Fridge Magnets" },
  { label: "Personalized Gifts", value: "Personalized Gifts" },
  { label: "Curated Hampers", value: "Curated Hampers" },
];

function resolveInitialFilter(initialCategory?: string): ProductCategory | "All" {
  return (
    filters.find((filter) => filter.value === initialCategory)?.value ?? "All"
  );
}

export function ProductShowcase({
  products,
  eyebrow,
  title,
  showCategoryFilter = false,
  initialCategory,
  searchPlaceholder = "Search by product, category, or style",
}: ProductShowcaseProps) {
  const [activeFilter, setActiveFilter] = useState<ProductCategory | "All">(() =>
    resolveInitialFilter(initialCategory)
  );
  const [searchQuery, setSearchQuery] = useState("");
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const normalizedQuery = deferredSearchQuery.trim().toLowerCase();

  const filteredProducts = products.filter((product) => {
    const matchesFilter =
      !showCategoryFilter ||
      activeFilter === "All" ||
      product.category === activeFilter;

    const matchesSearch =
      normalizedQuery.length === 0 ||
      product.name.toLowerCase().includes(normalizedQuery) ||
      product.category.toLowerCase().includes(normalizedQuery) ||
      product.description.toLowerCase().includes(normalizedQuery);

    return matchesFilter && matchesSearch;
  });

  // Distinguish "nothing to show at all" (likely a load problem) from an
  // active filter/search that simply matched nothing.
  const catalogEmpty = products.length === 0;

  const searchBox = (
    <label className="block">
      <span className="sr-only">Search products</span>
      <div className="flex min-h-14 items-center rounded-full border border-stone-200/80 bg-white/80 px-5 shadow-sm transition focus-within:border-stone-300 focus-within:bg-white">
        <SearchIcon className="h-4 w-4 shrink-0 text-stone-500" />
        <input
          className="w-full bg-transparent px-3 text-sm text-stone-900 outline-none placeholder:text-stone-500"
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder={searchPlaceholder}
          type="search"
          value={searchQuery}
        />
      </div>
    </label>
  );

  return (
    <div className="mt-12 sm:mt-14">
      <motion.section
        className="overflow-hidden rounded-[2rem] border border-white/70 bg-[rgba(255,253,252,0.72)] p-5 shadow-[0_20px_70px_rgba(51,40,33,0.08)] backdrop-blur sm:p-6 lg:p-8"
        initial={{ opacity: 0, y: 18 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.25 }}
        whileInView={{ opacity: 1, y: 0 }}
      >
        {showCategoryFilter ? (
          <>
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
              <div>
                <p className="text-[0.72rem] uppercase tracking-[0.34em] text-stone-500">
                  {eyebrow}
                </p>
                <h2 className="mt-3 font-serif text-3xl leading-tight text-stone-900 sm:text-4xl">
                  {title}
                </h2>
              </div>
              <div className="text-sm text-stone-600 lg:text-right">
                <span className="font-medium text-stone-900">
                  {filteredProducts.length}
                </span>{" "}
                {filteredProducts.length === 1 ? "product" : "products"} available
              </div>
            </div>

            <div className="mt-8 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,340px)] lg:items-start">
              <div className="flex flex-wrap gap-3">
                {filters.map((filter) => {
                  const isActive = activeFilter === filter.value;

                  return (
                    <button
                      key={filter.value}
                      aria-pressed={isActive}
                      className={[
                        "rounded-full px-5 py-3 text-sm uppercase tracking-[0.18em] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900/40",
                        isActive
                          ? "bg-stone-900 text-stone-50 shadow-[0_14px_36px_rgba(51,40,33,0.16)]"
                          : "border border-stone-200/80 bg-white/75 text-stone-700 hover:border-stone-300 hover:bg-white hover:text-stone-950",
                      ].join(" ")}
                      onClick={() => setActiveFilter(filter.value)}
                      type="button"
                    >
                      {filter.label}
                    </button>
                  );
                })}
              </div>

              {searchBox}
            </div>
          </>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,340px)] lg:items-center">
            <div>
              <p className="text-[0.72rem] uppercase tracking-[0.34em] text-stone-500">
                {eyebrow}
              </p>
              <h2 className="mt-3 font-serif text-3xl leading-tight text-stone-900 sm:text-4xl">
                {title}
              </h2>
            </div>
            {searchBox}
          </div>
        )}
      </motion.section>

      <AnimatePresence mode="wait">
        <motion.section
          key={`${activeFilter}-${normalizedQuery || "all"}`}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3"
          exit={{ opacity: 0, y: 10 }}
          initial={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 18 }}
              transition={{ duration: 0.35, delay: index * 0.04, ease: "easeOut" }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.section>
      </AnimatePresence>

      {filteredProducts.length === 0 ? (
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 rounded-[2rem] border border-dashed border-stone-300/80 bg-[rgba(255,253,252,0.78)] px-6 py-14 text-center shadow-sm"
          initial={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          <p className="text-[0.72rem] uppercase tracking-[0.34em] text-stone-500">
            {catalogEmpty ? "Nothing to show yet" : "No matches found"}
          </p>
          <h3 className="mt-4 font-serif text-3xl text-stone-900">
            {catalogEmpty
              ? "Our collection is on its way back."
              : "Try a different search or category."}
          </h3>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-stone-600 sm:text-base">
            {catalogEmpty
              ? "We couldn't load products just now — please check back in a moment, or reach us on WhatsApp and we'll help directly."
              : "Adjust the filter or search term to discover more handmade pieces from Art Gallery by Sneha."}
          </p>
        </motion.div>
      ) : null}
    </div>
  );
}
