"use client";

import Image from "next/image";
import { getProductImage, getProductImageUrls } from "@/lib/product-image";
import Link from "next/link";
import { useId, useRef, useState } from "react";

import type { Product } from "@/types/product";
import { ArrowLeftIcon, LockIcon } from "@/components/icons";
import { formatPrice, getDiscount } from "@/lib/pricing";
import { WhatsAppOrderButton } from "./whatsapp-order-button";
import { ProductStory } from "./product-story";
import orderStyles from "./order-actions.module.css";
import styles from "./product-detail.module.css";

type ProductDetailViewProps = { product: Product };

export function ProductDetailView({ product }: ProductDetailViewProps) {
  const images = getProductImageUrls(product).map(src => getProductImage(product, src));
  const discount = getDiscount(product.price, product.originalPrice);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [failedImages, setFailedImages] = useState<string[]>([]);
  const carouselRef = useRef<HTMLDivElement>(null);
  const galleryId = useId();
  const name = product.name.trim();
  const description = product.description.trim();
  const introduction = description.match(/^[\s\S]*?[.!?](?=\s|$)|^[^\n]+/)?.[0] ?? description;

  function scrollToImage(index: number) {
    const carousel = carouselRef.current;
    if (!carousel) return;
    carousel.scrollTo({
      left: index * carousel.clientWidth,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    });
  }

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <Link prefetch={false} className={styles.back} href={product.category === "Curated Hampers" ? "/curated-hampers" : "/collection"}>
          <ArrowLeftIcon className="h-4 w-4" /> {product.category === "Curated Hampers" ? "Back to hampers" : "Back to shop"}
        </Link>

        <div className={styles.layout}>
          <section className={styles.gallery} aria-label="Product photographs">
            <div
              ref={carouselRef}
              id={galleryId}
              className={`${styles.carousel} no-scrollbar`}
              onScroll={(event) => {
                const container = event.currentTarget;
                const index = Math.round(container.scrollLeft / container.clientWidth);
                setActiveImageIndex(Math.min(images.length - 1, Math.max(0, index)));
              }}
            >
              {images.map((image, index) => (
                <div key={image.src} className={styles.slide}>
                  <div className={styles.imageSpace}>
                    {failedImages.includes(image.src) ? (
                      <p className={styles.imageFallback}>{name}<span>Image unavailable</span></p>
                    ) : (
                      <Image
                        alt={image.alt}
                        className={styles.image}
                        fill
                        priority={index === 0}
                        sizes="(max-width: 767px) calc(100vw - 72px), (max-width: 1023px) 560px, (max-width: 1280px) 50vw, 600px"
                        src={image.src}
                        onError={() => setFailedImages((failed) => failed.includes(image.src) ? failed : [...failed, image.src])}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
            {!images.length && <div className={styles.imageSpaceEmpty}><p className={styles.imageFallback}>{name}<span>Photo coming soon</span></p></div>}

            {images.length > 1 && (
              <div className={styles.galleryNav}>
                <div className={styles.thumbnails} aria-label="Choose a product photograph">
                  {images.map((image, index) => (
                    <button
                      key={image.src}
                      type="button"
                      onClick={() => scrollToImage(index)}
                      className={styles.thumbnail}
                      aria-label={`View photo ${index + 1} of ${name}`}
                      aria-current={activeImageIndex === index ? "true" : undefined}
                      aria-controls={galleryId}
                    >
                      {failedImages.includes(image.src) ? index + 1 : (
                        <Image alt={image.alt} aria-hidden="true" fill sizes="64px" src={image.cardSrc} className={styles.image} />
                      )}
                    </button>
                  ))}
                </div>
                <span className={styles.counter} aria-live="polite" aria-atomic="true">
                  {activeImageIndex + 1} <span>/ {images.length}</span>
                </span>
              </div>
            )}
            {images[activeImageIndex]?.caption && <p className={styles.caption}>{images[activeImageIndex].caption}</p>}
          </section>

          <section className={styles.info} aria-labelledby="product-title">
            <p className={styles.eyebrow}>{product.category}<span aria-hidden="true">·</span>KumaonRang</p>
            <h1 id="product-title" className={styles.title}>{name}</h1>
            {introduction && <p className={styles.introduction}>{introduction}</p>}
            <div className={styles.priceLine}>
              <p className={styles.price}>{formatPrice(product.price)}</p>
              {discount && <>
                <span className={styles.originalPrice}><span className="sr-only">Original price </span>{formatPrice(discount.originalPrice)}</span>
                <span className={styles.saving}>Save {discount.percent}%</span>
              </>}
            </div>

            {typeof product.inStock === "boolean" && <p className={styles.orderNote}>
              {product.inStock ? "In stock. Confirm your quantity and delivery with Sneha." : "Currently out of stock. Ask Sneha about availability before ordering."}
            </p>}

            <div className={orderStyles.actions}>
              <WhatsAppOrderButton product={product} />
              <button className={orderStyles.comingSoon} type="button" disabled>
                <LockIcon className="h-4 w-4" />
                <span className={orderStyles.comingSoonCopy}>
                  <span>Direct order</span>
                  <span className={orderStyles.badge}>Coming soon</span>
                </span>
              </button>
            </div>
            <p className={styles.orderNote}>Have something personal in mind? Share it with Sneha when you enquire.</p>

            <div className={styles.productContent}>
              {description && <details className={styles.disclosure}>
                <summary><h2>About this piece</h2><span className={styles.plus} aria-hidden="true" /></summary>
                <div className={styles.disclosureBody}><p className={styles.copy}>{description}</p></div>
              </details>}
              {product.details.length > 0 && <details className={styles.disclosure}>
                <summary><h2>Product details</h2><span className={styles.plus} aria-hidden="true" /></summary>
                <div className={styles.disclosureBody}>
                  <ul className={styles.detailsList}>
                    {product.details.map((detail, index) => <li key={`${detail}-${index}`}>{detail}</li>)}
                  </ul>
                </div>
              </details>}
            </div>
          </section>
        </div>
        <ProductStory story={product.story} />
      </div>
    </main>
  );
}
