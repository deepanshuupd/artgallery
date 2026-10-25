"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState, type FormEvent } from "react";
import type { CartProduct, CartQuote, CartDetails } from "@/lib/cart-quote";
import { formatOrderAmount, orderUnit } from "@/lib/whatsapp";
import { useCart } from "./cart-provider";
import { CartIcon } from "./cart-controls";
import { QuantityControl } from "@/components/products/quantity-control";
import { WhatsAppIcon } from "@/components/icons";
import styles from "./cart.module.css";
import { OrderMessagePreview } from "@/components/products/order-message-preview";
import { commerceEvent } from "@/lib/commerce-events";

function CartPhoto({ product }: { product: CartProduct }) {
  const [failed, setFailed] = useState(false);
  return <div className={styles.photo}>{product.image && !failed ? <Image src={product.image} alt={product.alt} fill sizes="100px" onError={() => setFailed(true)} /> : <CartIcon />}</div>;
}

export function CartPage({ catalog, catalogFailed = false }: { catalog: CartProduct[]; catalogFailed?: boolean }) {
  const cart = useCart();
  const router = useRouter();
  const [details, setDetails] = useState<CartDetails>({deliveryPincode:"",occasionDate:"",request:""});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [review, setReview] = useState<{source:string;quote:CartQuote}|null>(null);
  const reviewRef = useRef<HTMLHeadingElement>(null);
  const products = new Map([...catalog,...(review?.quote.lines || [])].map(product => [product.id,product]));
  const payload = JSON.stringify({items:cart.items,...details});
  const quote = review?.source === payload ? review.quote : null;
  const subtotal = cart.items.reduce((sum,line) => sum+Math.round((products.get(line.productId)?.price || 0)*100)*line.quantity,0)/100;
  const missing = cart.items.some(line => !products.has(line.productId));
  const changeDetail = (field: keyof CartDetails, value: string) => { setDetails(previous => ({...previous,[field]:value})); setError(""); };
  async function prepare(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setBusy(true); setReview(null);
    try {
      const response = await fetch("/api/cart/quote",{method:"POST",headers:{"Content-Type":"application/json"},body:payload});
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Your enquiry could not be prepared.");
      setReview({source:payload,quote:result});
      commerceEvent("enquiry_review", "cart");
      requestAnimationFrame(() => { reviewRef.current?.focus({preventScroll:true}); reviewRef.current?.scrollIntoView({block:"start",behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"}); });
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Please check your connection and try again."); }
    finally { setBusy(false); }
  }

  return <main className={`heritage-shell ${styles.page}`}>
    <div className={styles.intro}><p className="craft-eyebrow">Your KumaonRang collection</p><h1>A few things to bring home.</h1><p>Your cart stays on this device. Review the pieces, then share one enquiry with Sneha.</p></div>
    {!cart.ready ? <p className={styles.empty} role="status">Loading your cart…</p> : !cart.items.length ? <div className={styles.empty}>
      <CartIcon /><h2>Your cart is waiting for a little colour.</h2><p>Browse the shop and add the pieces you love. You can combine products in one WhatsApp enquiry.</p><Link className={styles.primary} href="/collection">Browse the shop →</Link>
    </div> : <div className={styles.layout}>
      <section aria-label="Products in your cart" className={styles.items}>
        <div className={styles.sectionTitle}><h2>Your chosen pieces <span>{cart.items.length}</span></h2><Link prefetch={false} href="/collection">Keep browsing →</Link></div>
        {catalogFailed && <div className={styles.error} role="alert"><p>Product details could not be loaded. Your cart is still saved.</p><button type="button" onClick={() => router.refresh()}>Try loading product details again</button></div>}
        {cart.items.map(line => {
          const product = products.get(line.productId);
          const unit = product ? orderUnit(product.name,product.category) : null;
          return <article key={line.productId} className={styles.item} aria-label={product?.name || "Unavailable product"}>
            {product ? <>
              <Link prefetch={false} href={product.path} className={styles.photoLink} aria-label={`View ${product.name}`}><CartPhoto key={product.image} product={product} /></Link>
              <div className={styles.itemBody}><div className={styles.itemTitle}><Link prefetch={false} href={product.path}><h3>{product.name}</h3></Link><button type="button" className={styles.remove} onClick={() => cart.remove(line.productId)} aria-label={`Remove ${product.name} from cart`}>Remove</button></div>
                <p className={styles.unit}>{formatOrderAmount(product.price)} per {unit?.one}</p>
                {product.inStock === false && <p className={styles.stock}>Currently out of stock. Sneha will confirm restock availability.</p>}
                {line.quantity < product.minimum && <p className={styles.stock}>Minimum order: {product.minimum}. <button type="button" onClick={() => cart.quantity(line.productId,product.minimum)}>Update to {product.minimum}</button></p>}
                <div className={styles.itemQuantity}><QuantityControl value={line.quantity} minimum={product.minimum} label={`${product.name} quantity (${unit?.many})`} onChange={value => { cart.quantity(line.productId,value); setError(""); }} /><strong>{formatOrderAmount(Math.round(product.price*100)*line.quantity/100)}</strong></div>
                <label className={styles.itemRequest}>Request for this item <span>Optional</span><input maxLength={250} placeholder="Names, colours, fragrance or a design request…" value={line.request} onChange={event => cart.request(line.productId,event.currentTarget.value)} /></label>
              </div>
            </> : <div className={styles.unavailable}><h3>{catalogFailed ? "Product details temporarily unavailable" : "This product is no longer listed"}</h3><p>{catalogFailed ? "Try loading the catalogue again before reviewing your enquiry." : "Remove it to continue with the other pieces in your cart."}</p><button type="button" className={styles.remove} onClick={() => cart.remove(line.productId)}>Remove unavailable product</button></div>}
          </article>;
        })}
      </section>
      <aside className={styles.summary} aria-labelledby="cart-summary-title"><p className="craft-eyebrow">One enquiry, all your pieces</p><h2 id="cart-summary-title">Order summary</h2><dl><div><dt>Products</dt><dd>{cart.items.length}</dd></div><div><dt>Total quantity</dt><dd>{cart.items.reduce((sum,line) => sum+line.quantity,0)}</dd></div><div className={styles.total}><dt>Product subtotal</dt><dd>{catalogFailed || missing ? "To be checked" : formatOrderAmount(subtotal)}</dd></div><div><dt>Shipping</dt><dd>Confirmed by Sneha</dd></div></dl><p>Availability, personalisation costs, shipping and delivery timing are confirmed in your WhatsApp chat.</p><a href="#cart-details" className={styles.summaryLink}>Add details & review ↓</a></aside>
      <form className={styles.checkout} onSubmit={prepare} id="cart-details">
        <p className="craft-eyebrow">The finishing details</p><h2>Where shall these go?</h2>
        <div className={styles.fields}><label>Delivery PIN code <span>Optional</span><input type="text" inputMode="numeric" autoComplete="postal-code" pattern="[0-9]{6}" maxLength={6} placeholder="6-digit PIN code" value={details.deliveryPincode} onChange={event => changeDetail("deliveryPincode",event.currentTarget.value.replace(/\D/g,""))} /></label><label>Occasion date <span>Optional</span><input type="date" value={details.occasionDate} onInput={event => changeDetail("occasionDate",event.currentTarget.value)} onChange={event => changeDetail("occasionDate",event.currentTarget.value)} /></label></div>
        <label className={styles.orderNotes}>Anything else for this order? <span>Optional</span><textarea rows={3} maxLength={600} placeholder="A gift note, packaging preference or delivery question…" value={details.request} onChange={event => changeDetail("request",event.currentTarget.value)} /></label>
        {error && <div role="alert" className={styles.error}><p>{error}</p><button type="button" onClick={() => router.refresh()}>Refresh product details</button></div>}
        {missing && !catalogFailed && <p className={styles.error}>Remove the products that are no longer listed before continuing.</p>}
        <p className={styles.help}>We’ll check the current catalogue before preparing your message. Shipping is quoted separately; this enquiry does not confirm an order.</p>
        <button type="submit" className={styles.primary} disabled={busy || missing || catalogFailed}>{busy ? "Checking your pieces…" : "Review my order enquiry →"}</button>
      </form>
      {quote && <section className={styles.review} aria-labelledby="cart-review-title"><p className="craft-eyebrow">Ready for Sneha</p><h2 id="cart-review-title" ref={reviewRef} tabIndex={-1}>Your enquiry, all together.</h2><p>Current product subtotal: <strong>{formatOrderAmount(quote.subtotal)}</strong>. Check the message below, then send it in WhatsApp.</p><OrderMessagePreview message={quote.message} defaultOpen /><a className={styles.primary} href={quote.url} target="_blank" rel="noopener noreferrer" onClick={() => commerceEvent("whatsapp_handoff", "cart")}><WhatsAppIcon />Continue to WhatsApp</a><p className={styles.help}>Nothing is sent automatically. Your cart stays saved; Sneha confirms the final total and delivery in the chat.</p></section>}
    </div>}
  </main>;
}
