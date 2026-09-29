"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion } from "motion/react";

import type { Product } from "@/types/product";
import { getProductPath } from "@/lib/catalog";
import { createWhatsAppLink } from "@/lib/whatsapp";
import { formatPrice, getDiscount } from "@/lib/pricing";

const productPlaceholder = "/images/placeholders/product-placeholder.svg";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const [imageError, setImageError] = useState(false);
  const [imageSrc, setImageSrc] = useState(
    typeof product.image === "string" && product.image.trim()
      ? product.image
      : productPlaceholder,
  );
  const detailsHref = getProductPath(product);
  const discount = getDiscount(product.price, product.originalPrice);

  return (
    <motion.article
      className="group h-full"
      transition={{ duration: 0.28, ease: "easeOut" }}
      whileHover={{ y: -8 }}
    >
      <div className="relative flex h-full flex-col overflow-hidden rounded-[1.4rem] border border-[rgba(168,69,48,0.18)] bg-[var(--color-biswar)] shadow-[0_14px_36px_rgba(47,36,29,0.1)] transition-shadow duration-300 group-hover:shadow-[0_24px_56px_rgba(47,36,29,0.18)]">
        <div className="aipan-motif absolute inset-x-0 top-0 h-14 opacity-35" />

        <Link className="relative block overflow-hidden" href={detailsHref}>
          <div className="absolute left-4 top-4 z-10 inline-flex rounded-full border border-[rgba(255,255,255,0.7)] bg-[rgba(255,250,241,0.9)] px-3 py-1 text-[0.62rem] font-medium uppercase tracking-[0.2em] text-[var(--color-geru)] shadow-sm">
            Kumaon made
          </div>

          <div className="absolute right-4 top-4 z-10 inline-flex rounded-full bg-[var(--color-geru)]/90 px-3 py-1 text-[0.62rem] uppercase tracking-[0.16em] text-[var(--color-biswar)]">
            {product.category}
          </div>

          <div className="relative h-72 w-full bg-[linear-gradient(160deg,rgba(168,69,48,0.2),rgba(255,250,241,0.96),rgba(80,99,79,0.15))]">
            {imageError ? (
              <div className="flex h-full w-full flex-col justify-end p-6">
                <p className="text-[0.68rem] uppercase tracking-[0.3em] text-stone-500">
                  KumaonRang
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
                  if (imageSrc !== productPlaceholder) {
                    setImageSrc(productPlaceholder);
                    return;
                  }

                  setImageError(true);
                }}
              />
            )}

            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(51,40,33,0.02),rgba(51,40,33,0.26))]" />
          </div>
        </Link>

        <div className="flex flex-1 flex-col p-5 sm:p-6">
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
            <p className="text-lg font-medium text-[var(--color-geru)]">
              {formatPrice(product.price)}
            </p>
            {discount ? (
              <>
                <span className="text-sm text-stone-400 line-through">
                  {formatPrice(discount.originalPrice)}
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
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-[rgba(168,69,48,0.24)] bg-[var(--color-porcelain)] px-6 py-3 text-sm font-medium uppercase tracking-[0.16em] text-[var(--color-geru)] transition-transform duration-300 hover:-translate-y-0.5 hover:bg-white"
              href={detailsHref}
            >
              View Details
            </Link>
            <Link
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-[var(--color-geru)] px-6 py-3 text-sm font-medium uppercase tracking-[0.16em] text-[var(--color-biswar)] shadow-[0_16px_40px_rgba(168,69,48,0.2)] transition-transform duration-300 hover:-translate-y-0.5 hover:bg-[var(--color-champagne-dark)]"
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
