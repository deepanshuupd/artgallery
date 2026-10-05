"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { getProductImage, getProductImageUrls } from "@/lib/product-image";
import { formatPrice, getDiscount } from "@/lib/pricing";
import type { Product } from "@/types/product";
import { LockIcon, WhatsAppIcon } from "@/components/icons";
import { WhatsAppOrderSheet } from "./whatsapp-order-sheet";
import { QuantityControl } from "./quantity-control";
import { useProductDialog } from "./use-product-dialog";
import { ProductStory } from "./product-story";
import order from "./order-sheet.module.css";
import styles from "./product-detail.module.css";

export function ProductDetailView({ product, children }: { product: Product; children?: ReactNode }) {
  const images = getProductImageUrls(product).map(src => getProductImage(product, src));
  const discount = getDiscount(product.price, product.originalPrice);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [failedImages, setFailedImages] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [orderOpen, setOrderOpen] = useState(false);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [purchasePassed, setPurchasePassed] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const purchaseRef = useRef<HTMLDivElement>(null);
  const zoomRef = useProductDialog(zoomOpen);
  const galleryId = useId();
  const zoomTitleId = useId();
  const name = product.name.trim();
  const description = product.description.trim();
  const introduction = description.match(/^[\s\S]*?[.!?](?=\s|$)|^[^\n]+/)?.[0] ?? description;
  const selectedImage = images[activeImageIndex];
  const actionLabel = product.inStock === false ? "Ask about availability" : "Order via WhatsApp";

  useEffect(() => {
    const purchase = purchaseRef.current;
    if (!purchase) return;
    const observer = new IntersectionObserver(([entry]) => setPurchasePassed(!entry.isIntersecting && entry.boundingClientRect.bottom < 0));
    observer.observe(purchase);
    return () => observer.disconnect();
  }, []);

  function scrollToImage(index: number) {
    const carousel = carouselRef.current;
    if (!carousel) return;
    carousel.scrollTo({ left: index * carousel.clientWidth, behavior: zoomOpen || window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }
  function imageFailed(src: string) { setFailedImages(current => current.includes(src) ? current : [...current, src]); }

  return <main className={styles.page}>
    <div className={styles.shell}>
      <div className={styles.layout}>
        <section className={styles.gallery} aria-label="Product photographs">
          <div className={styles.photoFrame}>
            <div ref={carouselRef} id={galleryId} className={`${styles.carousel} no-scrollbar`} onScroll={event => {
              const container = event.currentTarget;
              setActiveImageIndex(Math.min(images.length - 1, Math.max(0, Math.round(container.scrollLeft / container.clientWidth))));
            }}>
              {images.map((image, index) => <div key={image.src} className={styles.slide}>
                {failedImages.includes(image.src) ? <p className={styles.imageFallback}>{name}<span>Image unavailable</span></p> : <Image alt={image.alt} className={styles.image} fill priority={index === 0} sizes="(max-width: 767px) calc(100vw - 32px), (max-width: 1023px) 55vw, 650px" src={image.src} onError={() => imageFailed(image.src)} />}
              </div>)}
              {!images.length && <p className={styles.imageFallback}>{name}<span>Photo coming soon</span></p>}
            </div>
            {selectedImage && !failedImages.includes(selectedImage.src) && <button type="button" className={styles.enlarge} aria-haspopup="dialog" onClick={() => setZoomOpen(true)}>Enlarge photo</button>}
          </div>
          {images.length > 1 && <div className={styles.galleryNav}>
            <div className={styles.thumbnails} aria-label="Choose a product photograph">{images.map((image, index) => <button key={image.src} type="button" onClick={() => scrollToImage(index)} className={styles.thumbnail} aria-label={`View photo ${index + 1} of ${name}`} aria-current={activeImageIndex === index ? "true" : undefined} aria-controls={galleryId}>
              {failedImages.includes(image.src) ? index + 1 : <Image alt={image.alt} aria-hidden="true" fill sizes="56px" src={image.cardSrc} className={styles.image} />}
            </button>)}</div>
            <span className={styles.counter} aria-live="polite" aria-atomic="true">{activeImageIndex + 1} / {images.length}</span>
          </div>}
          {selectedImage?.caption && <p className={styles.caption}>{selectedImage.caption}</p>}
        </section>

        <div className={styles.summary}>
          <header className={styles.identity}>
            <p className={styles.eyebrow}>{product.category}<span aria-hidden="true"> / </span>KumaonRang</p>
            <h1 id="product-title" className={styles.title}>{name}</h1>
            <div className={styles.priceLine}>
              <p className={styles.price}><span className="sr-only">Price </span>{formatPrice(product.price)}</p>
              {discount && <><del className={styles.originalPrice}><span className="sr-only">Original price </span>{formatPrice(discount.originalPrice)}</del><span className={styles.saving}>Save {discount.percent}%</span></>}
            </div>
          </header>
          <section ref={purchaseRef} className={styles.purchase} aria-labelledby="product-order-title">
            {introduction && <p className={styles.introduction}>{introduction}</p>}
            <div className={styles.purchaseBox}>
              <h2 id="product-order-title" className={styles.purchaseHeading}>Order details</h2>
              {typeof product.inStock === "boolean" && <p className={styles.availability} data-stock-state={product.inStock ? "in-stock" : "out-of-stock"}><span aria-hidden="true" />{product.inStock ? "In stock · Confirm availability for your quantity" : "Currently out of stock · Ask Sneha about availability"}</p>}
              <QuantityControl value={quantity} onChange={setQuantity} />
              <button type="button" className={order.primary} aria-haspopup="dialog" onClick={() => setOrderOpen(true)}><WhatsAppIcon className="h-5 w-5" />{actionLabel}</button>
              <button type="button" className={styles.directOrder} disabled><LockIcon className="h-4 w-4" /><span>Direct order<small>Coming soon</small></span></button>
              <p className={styles.orderHelp}>Delivery charges and custom requests are confirmed with Sneha.</p>
            </div>
            <p className={styles.contactLink}><Link prefetch={false} href="/contact">Contact KumaonRang</Link></p>
          </section>
        </div>
      </div>

      {(description || product.details.length > 0) && <section className={styles.information} aria-label="Product information">
        {description && <div><h2>About this piece</h2><p className={styles.copy}>{description}</p></div>}
        {product.details.length > 0 && <div><h2>Product details</h2><ul className={styles.detailsList}>{product.details.map((detail, index) => <li key={`${detail}-${index}`}><span aria-hidden="true">◇</span>{detail}</li>)}</ul></div>}
      </section>}
      <ProductStory story={product.story} />
      {children}
    </div>
    {purchasePassed && !orderOpen && !zoomOpen && <div className={styles.mobileBar}><div><span>Product subtotal</span><strong>{formatPrice(product.price * quantity)}</strong></div><button type="button" className={order.primary} aria-haspopup="dialog" onClick={() => setOrderOpen(true)}>{product.inStock === false ? "Ask Sneha" : "Order via WhatsApp"}</button></div>}
    <WhatsAppOrderSheet product={product} open={orderOpen} onClose={() => setOrderOpen(false)} quantity={quantity} onQuantityChange={setQuantity} />
    <dialog ref={zoomRef} className={styles.zoom} aria-labelledby={zoomTitleId} onCancel={event => { event.preventDefault(); setZoomOpen(false); }}>
      <header><h2 id={zoomTitleId} tabIndex={-1} data-dialog-focus>{name}</h2><button type="button" aria-label="Close enlarged photo" onClick={() => setZoomOpen(false)}>×</button></header>
      <div className={styles.zoomImage}>{zoomOpen && selectedImage && (failedImages.includes(selectedImage.src) ? <p className={styles.imageFallback}>{name}<span>Image unavailable</span></p> : <Image src={selectedImage.src} alt={selectedImage.alt} fill sizes="100vw" className={styles.image} onError={() => imageFailed(selectedImage.src)} />)}</div>
      <footer><button type="button" disabled={activeImageIndex <= 0} aria-label="Previous enlarged photo" onClick={() => { setActiveImageIndex(i => i - 1); scrollToImage(activeImageIndex - 1); }}>Previous</button><p>{selectedImage?.caption || `Photo ${activeImageIndex + 1} of ${images.length}`}</p><button type="button" disabled={activeImageIndex >= images.length - 1} aria-label="Next enlarged photo" onClick={() => { setActiveImageIndex(i => i + 1); scrollToImage(activeImageIndex + 1); }}>Next</button></footer>
    </dialog>
  </main>;
}
