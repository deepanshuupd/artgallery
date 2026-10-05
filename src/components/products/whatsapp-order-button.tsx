"use client";
import { useState } from "react";
import { WhatsAppIcon } from "@/components/icons";
import type { Product } from "@/types/product";
import { WhatsAppOrderSheet } from "./whatsapp-order-sheet";
import orderStyles from "./order-actions.module.css";
export function WhatsAppOrderButton({ product, className = "" }: { product: Product; className?: string }) {
  const [open, setOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  return <>
    <button type="button" className={`${orderStyles.whatsapp} ${className}`} aria-haspopup="dialog" onClick={() => setOpen(true)}>
      <WhatsAppIcon className="h-5 w-5" />{product.inStock === false ? "Ask about availability" : "Order via WhatsApp"}
    </button>
    <WhatsAppOrderSheet product={product} open={open} onClose={() => setOpen(false)} quantity={quantity} onQuantityChange={setQuantity} />
  </>;
}
