"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import type { CartProduct } from "@/lib/cart-quote";
import { deliveryFor, indianStates, type CheckoutCustomer } from "@/lib/checkout";
import { formatOrderAmount, orderUnit } from "@/lib/whatsapp";
import { shopDelivery, shopOrdering } from "@/data/shop-ordering";
import { useCart } from "@/components/cart/cart-provider";
import { CartIcon } from "@/components/cart/cart-controls";
import styles from "./checkout.module.css";

const emptyCustomer: CheckoutCustomer = { name: "", phone: "", email: "", address: "", city: "", state: "", pincode: "", occasionDate: "", notes: "" };

export function CheckoutPage({ catalog, catalogFailed = false }: { catalog: CartProduct[]; catalogFailed?: boolean }) {
  const cart = useCart();
  const router = useRouter();
  const [customer, setCustomer] = useState(emptyCustomer);
  const [website, setWebsite] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const products = new Map(catalog.map(product => [product.id, product]));
  const lines = cart.items.map(line => ({ line, product: products.get(line.productId) }));
  const blocked = lines.find(({ line, product }) => !product || product.inStock === false || line.quantity < product.minimum);
  const subtotal = lines.reduce((sum, { line, product }) => sum + Math.round((product?.price || 0) * 100) * line.quantity, 0) / 100;
  const delivery = deliveryFor(subtotal);
  const total = subtotal + delivery;
  const hasRequests = cart.items.some(line => line.request.trim());
  const change = (field: keyof CheckoutCustomer, value: string) => { setCustomer(previous => ({ ...previous, [field]: value })); setError(""); };

  async function placeOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true); setError("");
    try {
      const response = await fetch("/api/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ items: cart.items, customer, website }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Your order could not be placed.");
      cart.clear();
      router.push(`/order/${result.id}`);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Please check your connection and try again.");
      setBusy(false);
    }
  }

  if (!cart.ready) return <main className={`heritage-shell ${styles.page}`}><p className={styles.empty} role="status">Loading your cart…</p></main>;
  if (!cart.items.length) return <main className={`heritage-shell ${styles.page}`}><div className={styles.empty}>
    <CartIcon /><h1>Your cart is empty.</h1><p>Add the pieces you love, then check out here.</p><Link className={styles.primary} href="/collection">Browse the shop →</Link>
  </div></main>;

  return <main className={`heritage-shell ${styles.page}`}>
    <div className={styles.intro}><p className="craft-eyebrow">Checkout</p><h1>Where shall these go?</h1><p>Add your delivery details, then pay by UPI on the next step. <Link prefetch={false} href="/cart">Back to cart</Link></p></div>
    <div className={styles.layout}>
      <aside className={styles.summary} aria-labelledby="checkout-summary-title">
        <h2 id="checkout-summary-title">Your order</h2>
        <ul className={styles.lines}>{lines.map(({ line, product }) => <li key={line.productId}>
          <span>{product ? product.name : "Unavailable product"}<small>{product ? `${line.quantity} ${line.quantity === 1 ? orderUnit(product.name, product.category).one : orderUnit(product.name, product.category).many} × ${formatOrderAmount(product.price)}` : "Remove it from your cart"}</small>{line.request && <small>Request: {line.request}</small>}</span>
          <strong>{product ? formatOrderAmount(Math.round(product.price * 100) * line.quantity / 100) : "—"}</strong>
        </li>)}</ul>
        <dl>
          <div><dt>Products</dt><dd>{formatOrderAmount(subtotal)}</dd></div>
          <div><dt>Delivery</dt><dd>{delivery ? formatOrderAmount(delivery) : "Free"}</dd></div>
          <div className={styles.total}><dt>Total</dt><dd>{formatOrderAmount(total)}</dd></div>
        </dl>
        <p className={styles.note}>{delivery ? `Add ${formatOrderAmount(shopDelivery.freeFrom - subtotal)} more for free delivery (free from ${formatOrderAmount(shopDelivery.freeFrom)}).` : "Your order has free delivery."}</p>
        {hasRequests && <p className={styles.note}>{shopOrdering.personalisation}</p>}
      </aside>

      <form className={styles.form} onSubmit={placeOrder}>
        <h2>Delivery details</h2>
        <div className={styles.fields}>
          <label>Full name<input required autoComplete="name" maxLength={80} value={customer.name} onChange={event => change("name", event.currentTarget.value)} /></label>
          <label>Mobile number<span>For delivery and order updates</span><input required type="tel" inputMode="tel" autoComplete="tel-national" maxLength={16} placeholder="10-digit mobile" value={customer.phone} onChange={event => change("phone", event.currentTarget.value)} /></label>
          <label className={styles.wide}>Address<span>House, street, area and landmark</span><textarea required rows={3} autoComplete="street-address" maxLength={300} value={customer.address} onChange={event => change("address", event.currentTarget.value)} /></label>
          <label>City or town<input required autoComplete="address-level2" maxLength={60} value={customer.city} onChange={event => change("city", event.currentTarget.value)} /></label>
          <label>PIN code<input required inputMode="numeric" autoComplete="postal-code" pattern="[1-9][0-9]{5}" maxLength={6} placeholder="6 digits" value={customer.pincode} onChange={event => change("pincode", event.currentTarget.value.replace(/\D/g, ""))} /></label>
          <label className={styles.wide}>State<select required autoComplete="address-level1" value={customer.state} onChange={event => change("state", event.currentTarget.value)}><option value="">Choose a state</option>{indianStates.map(state => <option key={state}>{state}</option>)}</select></label>
          <label>Email<span>Optional</span><input type="email" autoComplete="email" maxLength={120} value={customer.email} onChange={event => change("email", event.currentTarget.value)} /></label>
          <label>Occasion date<span>Optional</span><input type="date" value={customer.occasionDate} onInput={event => change("occasionDate", event.currentTarget.value)} onChange={event => change("occasionDate", event.currentTarget.value)} /></label>
          <label className={styles.wide}>Notes for Sneha<span>Optional</span><textarea rows={2} maxLength={600} placeholder="A gift note or packaging preference…" value={customer.notes} onChange={event => change("notes", event.currentTarget.value)} /></label>
          <label className={styles.trap} aria-hidden="true">Website<input tabIndex={-1} autoComplete="off" value={website} onChange={event => setWebsite(event.currentTarget.value)} /></label>
        </div>
        {catalogFailed && <p role="alert" className={styles.error}>Product details could not be loaded. <button type="button" onClick={() => router.refresh()}>Try again</button></p>}
        {blocked && !catalogFailed && <p role="alert" className={styles.error}>{!blocked.product ? "A product in your cart is no longer listed." : blocked.product.inStock === false ? `${blocked.product.name} is out of stock.` : `${blocked.product.name}: minimum order is ${blocked.product.minimum}.`} <Link prefetch={false} href="/cart">Update your cart</Link></p>}
        {error && <p role="alert" className={styles.error}>{error}</p>}
        <button type="submit" className={styles.primary} disabled={busy || Boolean(blocked) || catalogFailed}>{busy ? "Placing your order…" : `Place order · ${formatOrderAmount(total)}`}</button>
        <p className={styles.help}>Next, pay {formatOrderAmount(total)} by UPI with GPay, PhonePe, Paytm or any UPI app. {shopOrdering.dispatch} <Link prefetch={false} href="/shipping-policy">Delivery</Link> · <Link prefetch={false} href="/returns-policy">Returns & damage</Link></p>
      </form>
    </div>
  </main>;
}
