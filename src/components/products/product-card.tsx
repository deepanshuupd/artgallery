"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion } from "motion/react";

import type { Product } from "@/types/product";
import { createWhatsAppLink } from "@/lib/whatsapp";
import { getDiscount } from "@/lib/pricing";

type ProductCardProps = {
  product: Product;
};

const priceFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export function ProductCard({ product }: ProductCardProps) {
  const [imageError, setImageError] = useState(false);
  const [imageSrc, setImageSrc] = useState(product.image);
  const detailsHref = `/collection/${product.id}`;
  const discount = getDiscount(product.price, product.originalPrice);

  return (
    <motion.article
      className="group h-full"
      transition={{ duration: 0.28, ease: "easeOut" }}
      whileHover={{ y: -8 }}
    >
      <div className="relative flex h-full flex-col overflow-hidden rounded-[2rem] border border-white/70 bg-[rgba(255,253,252,0.88)] shadow-[0_20px_70px_rgba(51,40,33,0.08)] backdrop-blur transition-shadow duration-300 group-hover:shadow-[0_28px_90px_rgba(51,40,33,0.14)]">
        <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-[var(--color-champagne)] to-transparent" />

        <Link className="relative block overflow-hidden" href={detailsHref}>
          <div className="absolute left-5 top-5 z-10 inline-flex rounded-full border border-[rgba(255,255,255,0.65)] bg-[rgba(255,253,252,0.82)] px-3 py-1 text-[0.65rem] font-medium uppercase tracking-[0.22em] text-stone-800 shadow-sm backdrop-blur">
            Handmade
          </div>

          <div className="absolute right-5 top-5 z-10 inline-flex rounded-full bg-stone-900/80 px-3 py-1 text-[0.62rem] uppercase tracking-[0.18em] text-stone-50">
            {product.category}
          </div>

          <div className="relative h-72 w-full bg-[linear-gradient(160deg,rgba(201,164,106,0.18),rgba(255,253,252,0.96),rgba(185,131,116,0.15))]">
            {imageError ? (
              <div className="flex h-full w-full flex-col justify-end p-6">
                <p className="text-[0.68rem] uppercase tracking-[0.3em] text-stone-500">
                  Art Gallery by Sneha
                </p>
                <p className="mt-3 max-w-[14rem] font-serif text-3xl leading-tight text-stone-900">
                  {product.name}
                </p>
              </div>
            ) : (
              <Image
                alt={product.name}
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
                src={imageSrc}
                onError={() => {
                  if (imageSrc !== "/images/placeholders/product-placeholder.svg") {
                    setImageSrc("/images/placeholders/product-placeholder.svg");
                    return;
                  }

                  setImageError(true);
                }}
              />
            )}

            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(51,40,33,0.02),rgba(51,40,33,0.26))]" />
          </div>
        </Link>

        <div className="flex flex-1 flex-col p-6">
          <div className="flex items-start justify-between gap-4">
            <Link href={detailsHref}>
              <h3 className="font-serif text-2xl leading-tight text-stone-900 transition-colors duration-300 hover:text-[var(--color-rose-clay)]">
                {product.name}
              </h3>
            </Link>
            {product.featured ? (
              <span className="shrink-0 rounded-full bg-[rgba(201,164,106,0.18)] px-3 py-1 text-[0.62rem] font-medium uppercase tracking-[0.18em] text-stone-800">
                Featured
              </span>
            ) : null}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-x-2.5 gap-y-1">
            <p className="text-lg font-medium text-[var(--color-rose-clay)]">
              {priceFormatter.format(product.price)}
            </p>
            {discount ? (
              <>
                <span className="text-sm text-stone-400 line-through">
                  {priceFormatter.format(discount.originalPrice)}
                </span>
                <span className="rounded-full bg-[rgba(201,164,106,0.18)] px-2.5 py-0.5 text-[0.62rem] font-medium uppercase tracking-[0.14em] text-stone-800">
                  {discount.percent}% off
                </span>
              </>
            ) : null}
          </div>

          <p className="mt-4 flex-1 text-sm leading-7 text-stone-600">
            {product.description}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-stone-200/80 bg-white/80 px-6 py-3 text-sm font-medium uppercase tracking-[0.18em] text-stone-900 transition-transform duration-300 hover:-translate-y-0.5 hover:bg-white"
              href={detailsHref}
            >
              View Details
            </Link>
            <Link
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-stone-900 px-6 py-3 text-sm font-medium uppercase tracking-[0.18em] text-stone-50 shadow-[0_16px_40px_rgba(51,40,33,0.18)] transition-transform duration-300 hover:-translate-y-0.5 hover:bg-stone-800"
              href={createWhatsAppLink(product.whatsappMessage)}
              rel="noreferrer"
              target="_blank"
            >
              WhatsApp Order
            </Link>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
