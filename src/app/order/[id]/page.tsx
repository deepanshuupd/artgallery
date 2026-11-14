import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { brand } from "@/lib/brand";
import { orderLabel } from "@/lib/checkout";
import { getCustomerOrder, type CustomerOrder } from "@/lib/orders";
import { getUpiLink, getUpiPayee } from "@/lib/payment";
import { getUpiQrSvg } from "@/lib/payment-qr";
import { createWhatsAppLink, formatOrderAmount } from "@/lib/whatsapp";
import { shopOrdering } from "@/data/shop-ordering";
import { CopyUpiId } from "@/components/payment/copy-upi-id";
import { PaymentReferenceForm } from "@/components/checkout/payment-reference-form";
import styles from "@/components/checkout/checkout.module.css";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Your order", robots: { index: false, follow: false } };

type Props = { params: Promise<{ id: string }> };

const statusText: Record<CustomerOrder["status"], { label: string; tone?: "waiting" | "stopped" }> = {
  awaiting_payment: { label: "Waiting for payment", tone: "waiting" },
  payment_submitted: { label: "Payment being checked", tone: "waiting" },
  confirmed: { label: "Confirmed" },
  dispatched: { label: "Dispatched" },
  delivered: { label: "Delivered" },
  cancelled: { label: "Cancelled", tone: "stopped" },
};

export default async function OrderPage({ params }: Props) {
  const { id } = await params;
  const order = await getCustomerOrder(id);
  if (!order) notFound();

  const label = orderLabel(order.number);
  const payee = getUpiPayee();
  const note = `${brand.name} ${label}`;
  const qr = order.status === "awaiting_payment" && payee ? await getUpiQrSvg(order.total, note) : "";
  const status = statusText[order.status];
  const help = createWhatsAppLink(`Hi Sneha, this is about my ${brand.name} order ${label} (${formatOrderAmount(order.total)}).`);

  return <main className={`heritage-shell ${styles.page}`}>
    <div className={styles.intro}>
      <p className="craft-eyebrow">Order {label}</p>
      <h1>{order.status === "awaiting_payment" ? `Pay ${formatOrderAmount(order.total)} to complete your order` : `Thank you, ${order.customerName.split(" ")[0]}.`}</h1>
      <p className={styles.status} data-tone={status.tone}>{status.label}</p>
    </div>
    <div className={styles.layout}>
      <div className={styles.main}>
        {order.status === "awaiting_payment" && <section className={styles.card} aria-labelledby="pay-title">
          <h2 id="pay-title">Pay by UPI</h2>
          {payee ? <>
            <p className={styles.amount}>{formatOrderAmount(order.total)}</p>
            <ol className={styles.steps}>
              <li>Pay exactly {formatOrderAmount(order.total)} with GPay, PhonePe, Paytm or any UPI app. On a phone, use the button; on a computer, scan the code.</li>
              <li>Take a screenshot of the payment confirmation, or copy the UPI reference number (UTR).</li>
              <li>Upload or enter it below. Sneha checks the payment and confirms your order.</li>
            </ol>
            <a className={styles.primary} href={getUpiLink(payee, order.total, note)}>Open your UPI app</a>
            <p className={styles.or}>or scan with any UPI app</p>
            <div className={styles.qr} role="img" aria-label={`UPI QR code to pay ${formatOrderAmount(order.total)} to ${payee.name}`} dangerouslySetInnerHTML={{ __html: qr }} />
            <p className={styles.payee}>Paying <strong>{payee.name}</strong> · note <strong>{label}</strong></p>
            <CopyUpiId id={payee.id} />
          </> : <p className={styles.help}>Sneha will share the UPI details for this order on WhatsApp.</p>}
          <PaymentReferenceForm orderId={id} />
          <p className={styles.help}>Keep this page’s link to come back to your order. Paid but stuck? <a href={help} target="_blank" rel="noopener noreferrer">Message Sneha on WhatsApp</a> with your order number.</p>
        </section>}

        {order.status === "payment_submitted" && <section className={styles.done} aria-labelledby="received-title">
          <h2 id="received-title">We’ve received your payment details</h2>
          <p>Sneha will match them with the payment in her UPI app, then confirm order {label}. If anything needs checking, she’ll contact you on the number you gave.</p>
          <p>{shopOrdering.dispatch}</p>
          <a className={styles.secondary} href={help} target="_blank" rel="noopener noreferrer">Message Sneha on WhatsApp</a>
        </section>}

        {["confirmed", "dispatched", "delivered"].includes(order.status) && <section className={styles.done} aria-labelledby="progress-title">
          <h2 id="progress-title">{order.status === "confirmed" ? "Your order is confirmed" : order.status === "dispatched" ? "Your order is on its way" : "Your order has been delivered"}</h2>
          <p>{order.status === "confirmed" ? shopOrdering.dispatch : order.status === "dispatched" ? "Sneha has handed your parcel to the courier." : "We hope you love it. If anything arrived damaged, see our returns and damage support."}</p>
          <a className={styles.secondary} href={help} target="_blank" rel="noopener noreferrer">Questions? Message Sneha</a>
        </section>}

        {order.status === "cancelled" && <section className={styles.done} aria-labelledby="cancelled-title">
          <h2 id="cancelled-title">This order was cancelled</h2>
          <p>If you have paid and have a question about it, message Sneha with the order number.</p>
          <a className={styles.secondary} href={help} target="_blank" rel="noopener noreferrer">Message Sneha on WhatsApp</a>
        </section>}
      </div>

      <aside className={styles.summary} aria-labelledby="order-summary-title">
        <h2 id="order-summary-title">Order {label}</h2>
        <ul className={styles.lines}>{order.items.map(item => <li key={item.productId}>
          <span>{item.name.trim()}<small>{item.quantity} × {formatOrderAmount(item.price)}</small>{item.request && <small>Request: {item.request}</small>}</span>
          <strong>{formatOrderAmount(Math.round(item.price * 100) * item.quantity / 100)}</strong>
        </li>)}</ul>
        <dl>
          <div><dt>Products</dt><dd>{formatOrderAmount(order.subtotal)}</dd></div>
          <div><dt>Delivery</dt><dd>{order.delivery ? formatOrderAmount(order.delivery) : "Free"}</dd></div>
          <div className={styles.total}><dt>Total</dt><dd>{formatOrderAmount(order.total)}</dd></div>
        </dl>
        <p className={styles.note}>Delivering to {order.customerName}, {order.city} {order.pincode}.</p>
        {order.items.some(item => item.request) && <p className={styles.note}>{shopOrdering.personalisation}</p>}
        <p className={styles.note}><Link prefetch={false} href="/shipping-policy">Delivery</Link> · <Link prefetch={false} href="/returns-policy">Returns & damage</Link></p>
      </aside>
    </div>
  </main>;
}
