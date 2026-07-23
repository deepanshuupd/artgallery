"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { motion } from "motion/react";

import type { Product } from "@/types/product";
import { WhatsAppOrderButton } from "./whatsapp-order-button";

type ProductDetailViewProps = {
  product: Product;
};

const priceFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export function ProductDetailView({ product }: ProductDetailViewProps) {
  const [imageError, setImageError] = useState(false);
  const images = product.images.length > 0 ? product.images : [product.image];
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
    <main className="relative overflow-hidden px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-x-0 top-0 h-56 bg-[radial-gradient(circle_at_top,rgba(201,164,106,0.14),transparent_68%)]" />
      </div>

      <div className="mx-auto max-w-7xl">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
          initial={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          <Link
            className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.18em] text-stone-600 transition-colors hover:text-stone-900"
            href="/collection"
          >
            <svg
              aria-hidden="true"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.8"
              viewBox="0 0 24 24"
            >
              <path d="M19 12H5" />
              <path d="m12 19-7-7 7-7" />
            </svg>
            Back to Collection
          </Link>
        </motion.div>

        <section className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)] lg:items-start">
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-[2.2rem] border border-white/70 bg-[rgba(255,253,252,0.86)] shadow-[0_24px_90px_rgba(51,40,33,0.1)]"
            initial={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
          >
            <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[var(--color-champagne)] to-transparent" />
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
                    className="relative h-[24rem] min-w-full snap-center bg-[linear-gradient(160deg,rgba(201,164,106,0.18),rgba(255,253,252,0.96),rgba(185,131,116,0.15))] sm:h-[34rem] lg:h-[42rem]"
                  >
                      {index === activeImageIndex && (imageError || failedImageSrc === activeImage) ? (
                      <div className="flex h-full w-full flex-col justify-end p-8 sm:p-10">
                        <p className="text-[0.72rem] uppercase tracking-[0.36em] text-stone-500">
                          Art Gallery by Sneha
                        </p>
                        <p className="mt-4 max-w-lg font-serif text-4xl leading-tight text-stone-900 sm:text-5xl">
                          {product.name}
                        </p>
                      </div>
                    ) : (
                      <Image
                        alt={`${product.name} ${index + 1}`}
                        className="object-cover"
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
            className="rounded-[2.2rem] border border-white/70 bg-[rgba(255,253,252,0.78)] p-6 shadow-[0_20px_80px_rgba(51,40,33,0.08)] backdrop-blur sm:p-8"
            initial={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.55, delay: 0.08, ease: "easeOut" }}
          >
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex rounded-full border border-stone-200/80 bg-white/80 px-4 py-2 text-[0.68rem] font-medium uppercase tracking-[0.22em] text-stone-800">
                Handmade
              </span>
              <span className="inline-flex rounded-full bg-stone-900 px-4 py-2 text-[0.68rem] uppercase tracking-[0.22em] text-stone-50">
                {product.category}
              </span>
              {product.featured ? (
                <span className="inline-flex rounded-full bg-[rgba(201,164,106,0.2)] px-4 py-2 text-[0.68rem] font-medium uppercase tracking-[0.22em] text-stone-800">
                  Featured
                </span>
              ) : null}
            </div>

            <h1 className="mt-6 font-serif text-4xl leading-tight text-stone-900 sm:text-5xl">
              {product.name}
            </h1>

            <p className="mt-4 text-2xl font-medium text-[var(--color-rose-clay)]">
              {priceFormatter.format(product.price)}
            </p>

            <p className="mt-6 text-base leading-8 text-stone-700">
              {product.description}
            </p>

            <div className="mt-8 grid gap-4 rounded-[1.6rem] border border-stone-200/70 bg-white/70 p-5">
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

            <Link
              className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-stone-900 px-6 py-3 text-sm font-medium uppercase tracking-[0.18em] text-stone-50 shadow-[0_18px_44px_rgba(51,40,33,0.18)] transition-transform duration-300 hover:-translate-y-0.5 hover:bg-stone-800 sm:w-auto"
              href="/collection"
              rel="noreferrer"
            >
              ← Back to Collection
            </Link>

            <WhatsAppOrderButton className="mt-8 ml-3 align-bottom" product={product} />
          </motion.div>
        </section>

        <motion.section
          animate={{ opacity: 1, y: 0 }}
          className="mt-10 rounded-[2.2rem] border border-white/70 bg-[rgba(255,253,252,0.78)] p-6 shadow-[0_20px_80px_rgba(51,40,33,0.08)] backdrop-blur sm:p-8 lg:mt-12"
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
