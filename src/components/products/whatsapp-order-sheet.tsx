"use client";
import Image from "next/image";
import { useId, useState } from "react";
import { WhatsAppIcon } from "@/components/icons";
import { getProductImage } from "@/lib/product-image";
import { formatPrice } from "@/lib/pricing";
import { generateOrderMessage, openWhatsAppOrder } from "@/lib/whatsapp";
import type { Product } from "@/types/product";
import { QuantityControl } from "./quantity-control";
import { useProductDialog } from "./use-product-dialog";
import { getMinimumPieceQuantity, getProductHighlights } from "@/lib/product-highlights";
import styles from "./order-sheet.module.css";
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
  const minimumOrder = getProductHighlights(product).find(fact => fact.label === "Minimum order");
  const message = generateOrderMessage({ productName: product.name, category: product.category, price: product.price, originalPrice: product.originalPrice, quantity, customizationInterest: request.trim(), inStock: product.inStock, deliveryPincode, occasionDate });
  return <dialog ref={ref} className={styles.dialog} aria-labelledby={titleId} onCancel={event => { event.preventDefault(); onClose(); }}
    onClick={event => { if (event.target !== event.currentTarget) return; const rect = event.currentTarget.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) onClose(); }}>
    <header className={styles.sheetHeader}>
      <div><h2 id={titleId} tabIndex={-1} data-dialog-focus>{product.inStock === false ? "Ask about this piece" : "Order details"}</h2></div>
      <button type="button" className={styles.close} aria-label="Close order details" onClick={onClose}>×</button>
    </header>
    <form onSubmit={event => { event.preventDefault(); openWhatsAppOrder(product, request.trim() || undefined, quantity, deliveryPincode || undefined, occasionDate || undefined); onClose(); }}>
      <div className={styles.sheetBody}>
        <div className={styles.productSummary}>
          <div className={styles.summaryImage}>{image.src && !imageFailed && <Image src={image.cardSrc} alt={image.alt} fill sizes="72px" onError={() => setImageFailed(true)} />}</div>
          <div><p>{product.category}</p><h3>{product.name}</h3><span>{formatPrice(product.price)} <small>{/\bset\s+of\s+\d+/i.test(product.name) ? "per set" : "each"}</small></span></div>
        </div>
        {minimumOrder && <p className={styles.help}>Minimum order: {minimumOrder.value}</p>}
        <QuantityControl value={quantity} onChange={onQuantityChange} minimum={getMinimumPieceQuantity(product)} />
        <div className={styles.deliveryFields}>
          <label htmlFor={pincodeId}>Delivery PIN code <span>Optional</span><input id={pincodeId} type="text" inputMode="numeric" autoComplete="postal-code" pattern="[0-9]{6}" maxLength={6} placeholder="6-digit PIN code" value={deliveryPincode} onChange={event => setDeliveryPincode(event.currentTarget.value.replace(/\D/g, ""))} /></label>
          <label htmlFor={occasionId}>Occasion date <span>Optional</span><input id={occasionId} type="date" value={occasionDate} onChange={event => setOccasionDate(event.currentTarget.value)} /></label>
        </div>
        <label className={styles.requestLabel} htmlFor={requestId}>Anything you’d like to ask? <span>Optional</span></label>
        <textarea id={requestId} className={styles.request} rows={3} maxLength={1000} placeholder="A gifting occasion, delivery question or personal request…" value={request} onChange={event => setRequest(event.currentTarget.value)} />
        <p className={styles.help}>In-stock quantities dispatch in 2–3 days. Made-to-order pieces and larger quantities may take longer. Share your date so Sneha can check what’s possible and confirm the delivery charge.</p>
        <details className={styles.preview}><summary>Preview your message</summary><pre>{message}</pre></details>
      </div>
      <footer className={styles.sheetFooter}>
        <div className={styles.subtotal}><span>Product subtotal</span><strong>{formatPrice(product.price * quantity)}</strong></div>
        <button className={styles.primary} type="submit"><WhatsAppIcon className="h-5 w-5" />Continue to WhatsApp</button>
        <p>This opens a chat. Your order is confirmed with Sneha.</p>
      </footer>
    </form>
  </dialog>;
}
