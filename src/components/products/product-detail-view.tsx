"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { motion } from "motion/react";

import type { Product } from "@/types/product";
import { ArrowLeftIcon } from "@/components/icons";
import { formatPrice, getDiscount } from "@/lib/pricing";
import { WhatsAppOrderButton } from "./whatsapp-order-button";

type ProductDetailViewProps = {
  product: Product;
};

export function ProductDetailView({ product }: ProductDetailViewProps) {
  const [imageError, setImageError] = useState(false);
  const images = product.images?.length ? product.images : [product.image];
  const discount = getDiscount(product.price, product.originalPrice);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [failedImageSrc, setFailedImageSrc] = useState<string | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  const activeImage = images[activeImageIndex] ?? images[0] ?? product.image;

  function scrollToImage(index: number) {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const slide = carousel.children.item(index) as HTMLElement | null;
    if (!slide) return;

    carousel.scrollTo({
      left: slide.offsetLeft,
      behavior: "smooth",
    });
  }

  return (
    <main className="relative overflow-hidden px-4 py-5 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
      <div className="absolute inset-0 -z-10">
        <div className="aipan-motif absolute inset-x-0 top-0 h-56 opacity-25" />
      </div>

      <div className="mx-auto max-w-7xl">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="mb-4"
          initial={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          <Link
            className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.18em] text-stone-600 transition-colors hover:text-[var(--color-geru)]"
            href="/collection"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Collection
          </Link>
        </motion.div>

        <section className="grid gap-4 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)] lg:items-start">
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-[1.5rem] border border-[rgba(168,69,48,0.18)] bg-[var(--color-biswar)] shadow-[0_20px_60px_rgba(47,36,29,0.12)]"
            initial={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
          >
            <div className="aipan-motif absolute inset-x-0 top-0 h-16 opacity-30" />
            <div className="relative">
              <div
                ref={carouselRef}
                className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto scroll-smooth"
                onScroll={(event) => {
                  const container = event.currentTarget;
                  const nextIndex = Math.round(container.scrollLeft / container.clientWidth);
                  if (nextIndex !== activeImageIndex) {
                    setActiveImageIndex(nextIndex);
                    setImageError(false);
                  }
                }}
              >
                {images.map((image, index) => (
                  <div
                    key={image}
                    className="relative h-[18rem] min-w-full snap-center bg-[linear-gradient(160deg,rgba(201,164,106,0.18),rgba(255,253,252,0.96),rgba(185,131,116,0.15))] sm:h-[34rem] lg:h-[42rem]"
                  >
                      {index === activeImageIndex && (imageError || failedImageSrc === activeImage) ? (
                      <div className="flex h-full w-full flex-col justify-end p-8 sm:p-10">
                        <p className="text-[0.72rem] uppercase tracking-[0.36em] text-stone-500">
                          KumaonRang
                        </p>
                        <p className="mt-4 max-w-lg font-serif text-4xl leading-tight text-stone-900 sm:text-5xl">
                          {product.name}
                        </p>
                      </div>
                    ) : (
                      <Image
                        alt={`${product.name} ${index + 1}`}
                        className="object-contain"
                        fill
                        priority={index === 0}
                        sizes="(max-width: 1024px) 100vw, 58vw"
                          src={image}
                        onError={() => {
                          if (index === activeImageIndex) {
                              setFailedImageSrc(image);
                            setImageError(true);
                          }
                        }}
                      />
                    )}
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(51,40,33,0.02),rgba(51,40,33,0.18))]" />
                  </div>
                ))}
              </div>

              {images.length > 1 && (
                <>
                  <div className="pointer-events-none absolute bottom-4 left-1/2 z-10 -translate-x-1/2 rounded-full bg-white/75 px-3 py-1.5 text-[0.68rem] uppercase tracking-[0.24em] text-stone-700 backdrop-blur">
                    Swipe to view more
                  </div>

                  <div className="absolute bottom-4 right-4 z-10 flex gap-2">
                    {images.map((image, index) => (
                      <button
                        key={`${image}-${index}`}
                        type="button"
                        onClick={() => {
                          setActiveImageIndex(index);
                          setFailedImageSrc(null);
                          setImageError(false);
                          scrollToImage(index);
                        }}
                        className={[
                          "h-2.5 rounded-full transition-all",
                          activeImageIndex === index
                            ? "w-8 bg-stone-900"
                            : "w-2.5 bg-white/90",
                        ].join(" ")}
                        aria-label={`View image ${index + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </motion.div>

          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[1.5rem] border border-[rgba(168,69,48,0.18)] bg-[var(--color-biswar)] p-4 shadow-[0_16px_44px_rgba(47,36,29,0.1)] sm:p-8"
            initial={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.55, delay: 0.08, ease: "easeOut" }}
          >
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex rounded-full border border-[rgba(168,69,48,0.22)] bg-[var(--color-porcelain)] px-4 py-2 text-[0.68rem] font-medium uppercase tracking-[0.22em] text-[var(--color-geru)]">
                Kumaon made
              </span>
              <span className="inline-flex rounded-full bg-[var(--color-geru)] px-4 py-2 text-[0.68rem] uppercase tracking-[0.22em] text-[var(--color-biswar)]">
                {product.category}
              </span>
              {product.featured ? (
                <span className="inline-flex rounded-full bg-[rgba(201,164,106,0.2)] px-4 py-2 text-[0.68rem] font-medium uppercase tracking-[0.22em] text-stone-800">
                  Featured
                </span>
              ) : null}
            </div>

            <h1 className="mt-3 font-serif text-3xl leading-tight text-stone-900 sm:text-5xl">
              {product.name}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1.5">
              <p className="text-2xl font-medium text-[var(--color-geru)]">
                {formatPrice(product.price)}
              </p>
              {discount ? (
                <>
                  <span className="text-lg text-stone-400 line-through">
                    {formatPrice(discount.originalPrice)}
                  </span>
                  <span className="rounded-full bg-[rgba(201,164,106,0.2)] px-3 py-1 text-[0.68rem] font-medium uppercase tracking-[0.16em] text-stone-800">
                    {discount.percent}% off
                  </span>
                </>
              ) : null}
            </div>

            <div className="mt-4">
              <WhatsAppOrderButton product={product} />
            </div>

            <p className="mt-4 text-sm leading-6 text-stone-700 sm:text-base">
              {product.description}
            </p>

            <div className="mt-8 grid gap-4 rounded-xl border border-[rgba(168,69,48,0.16)] bg-[var(--color-porcelain)] p-5">
              <p className="text-[0.72rem] uppercase tracking-[0.34em] text-stone-500">
                Product details
              </p>
              <ul className="grid gap-3 text-sm leading-7 text-stone-700">
                {product.details.map((detail) => (
                  <li key={detail} className="flex items-start gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-champagne)]" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[rgba(168,69,48,0.24)] bg-[var(--color-porcelain)] px-6 py-3 text-sm font-medium uppercase tracking-[0.16em] text-[var(--color-geru)] transition-transform duration-300 hover:-translate-y-0.5 hover:bg-white"
                href="/collection"
              >
                <ArrowLeftIcon className="h-4 w-4" />
                Back to Collection
              </Link>
            </div>
          </motion.div>
        </section>

        <motion.section
          animate={{ opacity: 1, y: 0 }}
          className="mt-10 rounded-[1.5rem] border border-[rgba(168,69,48,0.18)] bg-[var(--color-biswar)] p-4 shadow-[0_16px_44px_rgba(47,36,29,0.1)] sm:p-8 lg:mt-12"
          initial={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.55, delay: 0.14, ease: "easeOut" }}
        >
          <div className="max-w-4xl">
            <p className="text-[0.72rem] uppercase tracking-[0.34em] text-stone-500">
              Product story
            </p>
            <h2 className="mt-4 font-serif text-3xl leading-tight text-stone-900 sm:text-4xl">
              The feeling behind the piece.
            </h2>
            <p className="mt-6 text-base leading-8 text-stone-700 sm:text-lg">
              {product.story}
            </p>
          </div>
        </motion.section>
      </div>
    </main>
  );
}
