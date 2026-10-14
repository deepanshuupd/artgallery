"use client";
import Link from "next/link";
import { useState } from "react";
import { useCart, useCartActions } from "./cart-provider";
import styles from "./cart-controls.module.css";

export function CartIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M5 7h14l1 14H4L5 7Z" strokeLinejoin="round"/><path d="M8 8V6a4 4 0 0 1 8 0v2" strokeLinecap="round"/></svg>;
}
export function CartLink({ onClick }: { onClick?: () => void }) {
  const { items } = useCart();
  const count = items.reduce((sum,line) => sum+line.quantity,0);
  return <Link href="/cart" prefetch={false} className={styles.cartLink} onClick={onClick} aria-label={count ? `Cart, ${count} items` : "Cart, empty"}>
    <CartIcon /><span>Cart</span>{count>0 && <span className={styles.badge} aria-hidden="true">{count>99 ? "99+" : count}</span>}
  </Link>;
}
export function AddToCartButton({ productId, productName, quantity = 1, unavailable = false, compact = false }: { productId: string; productName?: string; quantity?: number; unavailable?: boolean; compact?: boolean }) {
  const { add } = useCartActions();
  const [status, setStatus] = useState("");
  const [error, setError] = useState(false);
  return <div className={`${styles.addControl} ${compact ? styles.compact : ""}`}>
    <button type="button" className={styles.addButton} disabled={unavailable} aria-label={productName ? unavailable ? `${productName}: out of stock` : `Add ${productName} to cart` : undefined} onClick={() => {
      try { add(productId,quantity); setStatus(`${quantity} ${quantity===1 ? "item" : "items"} added to cart.`); setError(false); }
      catch (cause) { setStatus(cause instanceof Error ? cause.message : "Could not add this item."); setError(true); }
    }}><CartIcon />{unavailable ? "Out of stock" : "Add to cart"}</button>
    {status && <p className={styles.addStatus} role={error ? "alert" : "status"}>{status} {!error && <Link prefetch={false} href="/cart">View cart →</Link>}</p>}
  </div>;
}
