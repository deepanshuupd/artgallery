"use client";
import { useState } from "react";
import { WhatsAppIcon } from "@/components/icons";
import type { Product } from "@/types/product";
import { WhatsAppOrderSheet } from "./whatsapp-order-sheet";
import { getProductImage } from "@/lib/product-image";
import orderStyles from "./order-actions.module.css";
import { commerceEvent } from "@/lib/commerce-events";
export function WhatsAppOrderButton({ product, className = "" }: { product: Product; className?: string }) {
  const [open, setOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  return <>
    <button type="button" className={`${orderStyles.whatsapp} ${className}`} aria-haspopup="dialog" onClick={() => { setOpen(true); commerceEvent("order_details_open", getProductImage(product).src ? "product" : "photo_request", product.id); }}>
      <WhatsAppIcon className="h-5 w-5" />{!getProductImage(product).src ? "Request a photo" : product.inStock === false ? "Ask about availability" : "Order via WhatsApp"}
    </button>
    <WhatsAppOrderSheet product={product} open={open} onClose={() => setOpen(false)} quantity={quantity} onQuantityChange={setQuantity} />
  </>;
}
