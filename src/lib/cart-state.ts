export type CartLine = { productId: string; quantity: number; request: string };
export const cartStorageKey = "kumaonrang-cart-v1";
export const emptyCart: CartLine[] = [];
export const validCartId = (value: unknown): value is string => typeof value === "string" && /^[a-zA-Z0-9_-]{1,100}$/.test(value);

/** Persist identifiers and preferences, never trust a stored price or product URL. */
export function restoreCart(value: unknown): CartLine[] {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  return value.slice(0,50).flatMap(raw => {
    if (!raw || !validCartId(raw.productId) || seen.has(raw.productId) || !Number.isInteger(raw.quantity) || raw.quantity < 1 || raw.quantity > 999) return [];
    seen.add(raw.productId);
    return [{ productId: raw.productId, quantity: raw.quantity, request: typeof raw.request === "string" ? raw.request.slice(0,250) : "" }];
  });
}

export function addCartLine(lines: CartLine[], productId: string, quantity: number): CartLine[] {
  if (!validCartId(productId) || !Number.isInteger(quantity) || quantity < 1 || quantity > 999) throw new Error("Choose a quantity between 1 and 999.");
  const existing = lines.find(line => line.productId === productId);
  if (existing && existing.quantity + quantity > 999) throw new Error("This item is already at the cart quantity limit. Adjust it in your cart.");
  if (!existing && lines.length >= 50) throw new Error("Your cart has 50 different products. Share this enquiry before starting another.");
  return existing ? lines.map(line => line.productId === productId ? { ...line, quantity: line.quantity + quantity } : line)
    : [...lines,{productId,quantity,request:""}];
}

export function createCartStore(storage?: Pick<Storage,"getItem"|"setItem">) {
  let lines: CartLine[] = [];
  const listeners = new Set<() => void>();
  try {
    storage ??= typeof window !== "undefined" ? window.localStorage : undefined;
    const raw = storage?.getItem(cartStorageKey);
    if (raw) lines = restoreCart(JSON.parse(raw));
  } catch { /* Private browsing or invalid storage must not prevent shopping. */ }
  const emit = () => listeners.forEach(listener => listener());
  const update = (next: (previous: CartLine[]) => CartLine[]) => {
    lines = next(lines);
    try { storage?.setItem(cartStorageKey,JSON.stringify(lines)); } catch { /* In-memory cart remains usable. */ }
    emit();
  };
  return {
    getSnapshot: () => lines,
    subscribe: (listener: () => void) => { listeners.add(listener); return () => { listeners.delete(listener); }; },
    add: (id: string, quantity: number) => update(previous => addCartLine(previous,id,quantity)),
    remove: (id: string) => update(previous => previous.filter(line => line.productId !== id)),
    quantity: (id: string, quantity: number) => {
      if (!Number.isInteger(quantity) || quantity < 1 || quantity > 999) return;
      update(previous => previous.map(line => line.productId === id ? {...line,quantity} : line));
    },
    request: (id: string, request: string) => update(previous => previous.map(line => line.productId === id ? {...line,request:request.slice(0,250)} : line)),
    clear: () => update(() => []),
    sync: (raw: string | null) => { try { lines = raw ? restoreCart(JSON.parse(raw)) : []; emit(); } catch { /* Ignore a malformed external update. */ } },
  };
}
export const getServerCart = () => emptyCart;
export const subscribeToCartHydration = () => () => {};
export const cartClientReady = () => true;
export const cartServerReady = () => false;
