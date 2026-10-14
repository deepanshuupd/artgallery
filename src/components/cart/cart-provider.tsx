"use client";
import { createContext, useContext, useEffect, useState, useSyncExternalStore, type ReactNode } from "react";
import { createCartStore, cartStorageKey, getServerCart, subscribeToCartHydration, cartClientReady, cartServerReady } from "@/lib/cart-state";

const CartContext = createContext<ReturnType<typeof createCartStore> | null>(null);
export function CartProvider({ children }: { children: ReactNode }) {
  const [store] = useState(() => createCartStore());
  useEffect(() => {
    const sync = (event: StorageEvent) => { if (event.key === cartStorageKey || event.key === null) store.sync(event.newValue); };
    window.addEventListener("storage",sync);
    return () => window.removeEventListener("storage",sync);
  },[store]);
  return <CartContext.Provider value={store}>{children}</CartContext.Provider>;
}
export function useCartActions() {
  const store = useContext(CartContext);
  if (!store) throw new Error("Cart controls need CartProvider.");
  return store;
}
export function useCart() {
  const store = useCartActions();
  const items = useSyncExternalStore(store.subscribe,store.getSnapshot,getServerCart);
  const ready = useSyncExternalStore(subscribeToCartHydration,cartClientReady,cartServerReady);
  return { items, ready, ...store };
}
