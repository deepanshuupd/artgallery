"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion } from "motion/react";

import { ArrowRightIcon } from "@/components/icons";
import type { ProductCategory } from "@/types/product";

type FeaturedCollectionsProps = {
  /** Real product image per category, sourced from the catalog. */
  images: Partial<Record<ProductCategory, string>>;
};

type CategoryMeta = {
  name: ProductCategory;
  label: string;
  description: string;
  accent: string;
};

const collections: CategoryMeta[] = [
  {
    name: "Keychains",
    label: "Pahadi keepsakes",
    description:
      "Small handmade reminders of people, places, and hill-side memories worth carrying every day.",
    accent: "rgba(201,164,106,0.24)",
  },
  {
    name: "Frames",
    label: "Aipan & wall art",
    description:
      "Frames inspired by Kumaoni colour, Aipan detail, photographs, and the stories that belong on your wall.",
    accent: "rgba(185,131,116,0.22)",
  },
  {
    name: "Fridge Magnets",
    label: "Pieces of home",
    description:
      "Tiny handmade souvenirs with enough character to bring a little Uttarakhand into everyday spaces.",
    accent: "rgba(122,130,114,0.2)",
  },
  {
    name: "Personalized Gifts",
    label: "Made for your people",
    description:
      "Personal gifts made around names, in-jokes, celebrations, and the people you want to make feel seen.",
    accent: "rgba(151,117,95,0.18)",
  },
];

function CollectionCard({
  collection,
  image,
  index,
}: {
  collection: CategoryMeta;
  image?: string;
  index: number;
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const hasImage = Boolean(image) && !imageFailed;
  const href = `/collection?category=${encodeURIComponent(collection.name)}`;

  return (
    <motion.div
      className="group h-full"
      initial={{ opacity: 0, y: 24 }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.3 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
    >
      <Link
        className="relative flex h-full min-h-[22rem] flex-col justify-end overflow-hidden rounded-[2rem] border border-white/60 bg-[rgba(255,253,252,0.82)] shadow-[0_18px_60px_rgba(51,40,33,0.08)] backdrop-blur transition-shadow duration-300 hover:shadow-[0_28px_80px_rgba(51,40,33,0.14)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900/40"
        href={href}
      >
        {hasImage ? (
          <>
            <Image
              alt={collection.name}
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              fill
              onError={() => setImageFailed(true)}
              sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
              src={image!}
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[linear-gradient(180deg,rgba(51,40,33,0.05),rgba(51,40,33,0.35)_45%,rgba(51,40,33,0.82))]"
            />
          </>
        ) : (
          <>
            <div
              aria-hidden="true"
              className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-[var(--color-champagne)] to-transparent"
            />
            <div
              aria-hidden="true"
              className="absolute -right-12 top-10 h-28 w-28 rounded-full blur-2xl transition-transform duration-500 group-hover:scale-110"
              style={{ backgroundColor: collection.accent }}
            />
          </>
        )}

        <div className="relative flex flex-col p-6">
          <p
            className={`text-[0.68rem] uppercase tracking-[0.32em] ${
              hasImage ? "text-white/80" : "text-stone-500"
            }`}
          >
            {collection.label}
          </p>

          <h3
            className={`mt-4 text-3xl leading-tight ${
              hasImage ? "text-white" : "text-stone-900"
            }`}
          >
            {collection.name}
          </h3>

          <p
            className={`mt-4 text-sm leading-7 ${
              hasImage ? "text-white/85" : "text-stone-600"
            }`}
          >
            {collection.description}
          </p>

          <div
            className={`mt-6 flex items-center justify-between border-t pt-4 text-sm uppercase tracking-[0.18em] ${
              hasImage
                ? "border-white/25 text-white"
                : "border-stone-200/70 text-stone-800"
            }`}
          >
            <span>Explore</span>
            <span
              className={`inline-flex h-10 w-10 items-center justify-center rounded-full border transition-transform duration-300 group-hover:translate-x-1 ${
                hasImage
                  ? "border-white/40 bg-white/10"
                  : "border-stone-300/80 bg-white/80"
              }`}
            >
              <ArrowRightIcon className="h-4 w-4" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export function FeaturedCollections({ images }: FeaturedCollectionsProps) {
  return (
    <section className="relative px-4 py-18 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
      <div aria-hidden="true" className="absolute inset-0 -z-10">
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
            Made in small stories
          </p>
          <h2 className="mt-4 text-3xl leading-tight text-stone-900 sm:text-4xl lg:text-5xl">
            Keepsakes with a
            <span className="block text-[var(--color-rose-clay)]">
              Kumaoni point of view.
            </span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-stone-700 sm:text-lg">
            Explore handmade gifts that carry familiar symbols, personal details,
            and a little memory of the hills.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-5 sm:mt-14 sm:grid-cols-2 xl:grid-cols-4">
          {collections.map((collection, index) => (
            <CollectionCard
              key={collection.name}
              collection={collection}
              image={images[collection.name]}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
