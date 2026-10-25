"use client";

import { useState, useRef, type FormEvent } from "react";
import { prepareBulkEnquiry, type BulkEnquiry, type BulkProduct } from "@/lib/bulk-orders";
import { formatPrice } from "@/lib/pricing";
import { WhatsAppIcon } from "@/components/icons";
import { OrderMessagePreview } from "./order-message-preview";
import styles from "./bulk-orders.module.css";
import { commerceEvent } from "@/lib/commerce-events";

export function BulkOrderForm({ products }: { products: BulkProduct[] }) {
  const [details, setDetails] = useState<BulkEnquiry>({ occasion: "", quantity: "", budget: "", date: "", pincode: "", packaging: "" });
  const [path, setPath] = useState("");
  const [review, setReview] = useState<{ source: string; message: string; url: string } | null>(null);
  const [error, setError] = useState("");
  const reviewRef = useRef<HTMLHeadingElement>(null);
  const source = JSON.stringify({ details, path });
  const prepared = review?.source === source ? review : null;
  const selected = products.find(product => product.path === path);
  function update(field: keyof BulkEnquiry, value: string) {
    setDetails(previous => ({ ...previous, [field]: value }));
    setError("");
  }
  function prepare(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      setReview({ source, ...prepareBulkEnquiry(details, selected) });
      commerceEvent("enquiry_review", "bulk");
      setError("");
      requestAnimationFrame(() => reviewRef.current?.focus());
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Please check your details."); }
  }
  return <section id="bulk-enquiry" className={styles.enquiry} aria-labelledby="bulk-enquiry-title">
    <header><p className="craft-eyebrow">A brief for Sneha</p><h2 id="bulk-enquiry-title">Let’s make it personal.</h2><p>Start with a quantity. Add what you know; we can work out the rest together.</p></header>
    <form onSubmit={prepare} className={styles.form}>
      <label>Preferred piece <span>Optional</span><select value={path} onChange={event => { setPath(event.currentTarget.value); setError(""); }}><option value="">Help me choose</option>{products.map(product => <option key={product.path} value={product.path}>{product.name}</option>)}</select></label>
      {selected && <p className={styles.hint}>Listed at {formatPrice(selected.price)} per {selected.unit}. This is a reference price, not a bulk quote or stock commitment.</p>}
      <div className={styles.fields}>
        <label>Number of gifts <span>Required</span><input required type="number" inputMode="numeric" min="1" max="9999" step="1" placeholder="e.g. 30" value={details.quantity} onChange={event => update("quantity", event.currentTarget.value)} /></label>
        <label>Budget per gift (₹) <span>Optional</span><input type="number" inputMode="decimal" min="0.01" step="0.01" placeholder="Your budget" value={details.budget} onChange={event => update("budget", event.currentTarget.value)} /></label>
        <label>Occasion <span>Optional</span><select value={details.occasion} onChange={event => update("occasion", event.currentTarget.value)}><option value="">Choose an occasion</option><option>Wedding / return gifts</option><option>Team / client gifts</option><option>Family celebration</option><option>Festival</option><option>Another occasion</option></select></label>
        <label>Occasion date <span>Optional</span><input type="date" value={details.date} onInput={event => update("date", event.currentTarget.value)} onChange={event => update("date", event.currentTarget.value)} /></label>
      </div>
      <label>Delivery PIN code <span>Optional · helps check delivery</span><input type="text" inputMode="numeric" autoComplete="postal-code" pattern="[0-9]{6}" maxLength={6} placeholder="6-digit PIN code" value={details.pincode} onChange={event => update("pincode", event.currentTarget.value.replace(/\D/g, ""))} /></label>
      <label>Packaging or personalisation <span>Optional</span><textarea rows={3} maxLength={600} placeholder="For example, individual gift packing, names, a note, or a mix of designs…" value={details.packaging} onChange={event => update("packaging", event.currentTarget.value)} /></label>
      <p className={styles.hint}>Availability, minimum quantities, packaging, custom work and timing are checked for your particular request. Delivery is quoted separately. No bulk discount or arrival date is assumed.</p>
      {error && <p role="alert" className={styles.error}>{error}</p>}
      <button type="submit" className={styles.primary}>Review my gift enquiry</button>
    </form>
    {prepared && <div className={styles.review}>
      <h3 tabIndex={-1} ref={reviewRef}>Your brief, ready for Sneha.</h3>
      <OrderMessagePreview message={prepared.message} defaultOpen />
      <a className={styles.primary} href={prepared.url} target="_blank" rel="noopener noreferrer" onClick={() => commerceEvent("whatsapp_handoff", "bulk")}><WhatsAppIcon className="h-5 w-5" />Continue to WhatsApp</a>
      <p className={styles.hint}>Press send in WhatsApp when you’re ready. Nothing is sent automatically, and no order is placed here.</p>
    </div>}
  </section>;
}
