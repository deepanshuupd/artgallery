"use client";
import Image from "next/image";
import { useId, useState } from "react";
import { CameraIcon, WhatsAppIcon } from "@/components/icons";
import { getProductImage } from "@/lib/product-image";
import { formatPrice } from "@/lib/pricing";
import { createWhatsAppLink, generateProductPhotoRequest, generateProductOrderMessage, openWhatsAppOrder, orderUnit } from "@/lib/whatsapp";
import type { Product } from "@/types/product";
import { QuantityControl } from "./quantity-control";
import { useProductDialog } from "./use-product-dialog";
import { getMinimumPieceQuantity, getProductHighlights } from "@/lib/product-highlights";
import styles from "./order-sheet.module.css";
import { OrderMessagePreview } from "./order-message-preview";
import { commerceEvent } from "@/lib/commerce-events";
export function WhatsAppOrderSheet({ product, open, onClose, quantity, onQuantityChange }: {
  product: Product; open: boolean; onClose: () => void; quantity: number; onQuantityChange: (quantity: number) => void;
}) {
  const ref = useProductDialog(open);
  const titleId = useId();
  const requestId = useId();
  const pincodeId = useId();
  const occasionId = useId();
  const [request, setRequest] = useState("");
  const [deliveryPincode, setDeliveryPincode] = useState("");
  const [occasionDate, setOccasionDate] = useState("");
  const [imageFailed, setImageFailed] = useState(false);
  const image = getProductImage(product);
  const needsPhoto = !image.src;
  const unit = orderUnit(product.name,product.category);
  const minimumOrder = getProductHighlights(product).find(fact => fact.label === "Minimum order");
  const message = needsPhoto ? generateProductPhotoRequest(product, request.trim()) : generateProductOrderMessage(product,request.trim(),quantity,deliveryPincode,occasionDate);
  return <dialog ref={ref} className={styles.dialog} aria-labelledby={titleId} onCancel={event => { event.preventDefault(); onClose(); }}
    onClick={event => { if (event.target !== event.currentTarget) return; const rect = event.currentTarget.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) onClose(); }}>
    <header className={styles.sheetHeader}>
      <div><h2 id={titleId} tabIndex={-1} data-dialog-focus>{needsPhoto ? "See this piece first" : product.inStock === false ? "Ask about this piece" : "Order details"}</h2></div>
      <button type="button" className={styles.close} aria-label={needsPhoto ? "Close photo request" : "Close order details"} onClick={onClose}>×</button>
    </header>
    <form onSubmit={event => {
      event.preventDefault();
      commerceEvent("whatsapp_handoff", needsPhoto ? "photo_request" : "product", product.id);
      if (needsPhoto) {
        window.open(createWhatsAppLink(message), "_blank", "noopener,noreferrer");
      } else {
        openWhatsAppOrder(product, request.trim() || undefined, quantity, deliveryPincode || undefined, occasionDate || undefined);
      }
      onClose();
    }}>
      <div className={styles.sheetBody}>
        <div className={styles.productSummary}>
          <div className={styles.summaryImage}>{image.src && !imageFailed ? <Image src={image.cardSrc} alt={image.alt} fill sizes="72px" onError={() => setImageFailed(true)} /> : <CameraIcon className="h-6 w-6" />}</div>
          <div><p>{product.category}</p><h3>{product.name}</h3><span>{formatPrice(product.price)} <small>per {unit.one}</small></span></div>
        </div>
        {needsPhoto ? <p className={styles.help}>Ask Sneha for a current photograph of this exact design, its dimensions and what’s included. This is a photo enquiry, with no order commitment.</p> : <>
        {minimumOrder && <p className={styles.help}>Minimum order: {minimumOrder.value}</p>}
        <QuantityControl value={quantity} onChange={onQuantityChange} minimum={getMinimumPieceQuantity(product)} label={`Quantity (${unit.many})`} />
        <details className={styles.optionalDetails}>
          <summary>Add delivery or personalisation details <span>Optional</span></summary>
        <div className={styles.deliveryFields}>
          <label htmlFor={pincodeId}>Delivery PIN code <span>Optional</span><input id={pincodeId} type="text" inputMode="numeric" autoComplete="postal-code" pattern="[0-9]{6}" maxLength={6} placeholder="6-digit PIN code" value={deliveryPincode} onChange={event => setDeliveryPincode(event.currentTarget.value.replace(/\D/g, ""))} /></label>
          <label htmlFor={occasionId}>Occasion date <span>Optional</span><input id={occasionId} type="date" value={occasionDate} onInput={event => setOccasionDate(event.currentTarget.value)} onChange={event => setOccasionDate(event.currentTarget.value)} /></label>
        </div>
        <label className={styles.requestLabel} htmlFor={requestId}>Personalisation or a request for this item <span>Optional</span></label>
        <textarea id={requestId} className={styles.request} rows={3} maxLength={1000} placeholder="Exact names or wording, colour, fragrance or a design request…" value={request} onChange={event => setRequest(event.currentTarget.value)} />
        <p className={styles.help}>Share your PIN code or occasion date so Sneha can check delivery and what’s possible. You can also discuss these in WhatsApp.</p>
        </details>
        </>}
        {needsPhoto && <><label className={styles.requestLabel} htmlFor={requestId}>Anything you’d like to see or ask? <span>Optional</span></label>
        <textarea id={requestId} className={styles.request} rows={3} maxLength={1000} placeholder="For example, the back of the magnet or a photo showing its size…" value={request} onChange={event => setRequest(event.currentTarget.value)} /></>}
        {!needsPhoto && <p className={styles.help}>{product.inStock === false ? "Availability and preparation time are confirmed with Sneha." : "In-stock quantities dispatch in 2–3 days. Made-to-order pieces and larger quantities may take longer."} Delivery is extra.</p>}
        <OrderMessagePreview message={message} />
      </div>
      <footer className={styles.sheetFooter}>
        <div className={styles.subtotal}><span>{needsPhoto ? "Listed price · delivery extra" : "Product subtotal"}</span><strong>{formatPrice(product.price * (needsPhoto ? 1 : quantity))}</strong></div>
        <button className={styles.primary} type="submit"><WhatsAppIcon className="h-5 w-5" />Continue to WhatsApp</button>
        <p>{needsPhoto ? "Review the photo request and press send in WhatsApp. Nothing is sent automatically." : "Review the draft and press send in WhatsApp. Nothing is sent automatically; Sneha confirms the final total and delivery."}</p>
      </footer>
    </form>
  </dialog>;
}
