import type { Metadata } from "next";
import QRCode from "qrcode";

import { CopyUpiId } from "@/components/payment/copy-upi-id";
import { getUpiLink, getUpiPayee, parseUpiAmount } from "@/lib/payment";
import { formatPrice } from "@/lib/pricing";
import { createWhatsAppLink } from "@/lib/whatsapp";
import forest from "@/components/products/forest-storefront.module.css";
import styles from "@/components/payment/pay.module.css";

export const metadata: Metadata = {
  title: "Pay by UPI",
  description: "Pay your confirmed KumaonRang order total by UPI.",
  robots: { index: false, follow: false },
};

type Props = { searchParams: Promise<{ amount?: string | string[] }> };

export default async function PayPage({ searchParams }: Props) {
  const payee = getUpiPayee();
  const amount = parseUpiAmount((await searchParams).amount);
  const paidMessage = `Hi Sneha, I have paid${amount ? ` ${formatPrice(amount)}` : ""} by UPI for my KumaonRang order. UPI reference number: `;
  // Rendered on the server so the page ships no QR library to the browser.
  const qr = payee ? await QRCode.toString(getUpiLink(payee, amount), { type: "svg", margin: 1, errorCorrectionLevel: "M", color: { dark: "#2f241d", light: "#fffaf1" } }) : "";

  return <main className={forest.surface}><div className={`store-page heritage-shell ${forest.shopShell} ${styles.page}`}>
    <header className={styles.heading}>
      <p className="craft-eyebrow">KumaonRang · Pithoragarh</p>
      <h1>{amount ? `Pay ${formatPrice(amount)} by UPI` : "Pay by UPI"}</h1>
      <p>Pay only the total Sneha has confirmed in your WhatsApp chat, including delivery.</p>
    </header>
    {payee ? <section className={styles.card} aria-label="UPI payment details">
      <a className={`craft-button ${styles.appButton}`} href={getUpiLink(payee, amount)}>Open your UPI app</a>
      <p className={styles.or}>or scan with any UPI app</p>
      <div className={styles.qr} role="img" aria-label={`UPI QR code for ${payee.name}`} dangerouslySetInnerHTML={{ __html: qr }} />
      <p className={styles.payee}>Paying <strong>{payee.name}</strong></p>
      <CopyUpiId id={payee.id} />
    </section> : <section className={styles.card}>
      <p>Sneha will share the UPI details for your order in your WhatsApp chat.</p>
    </section>}
    <section className={styles.after} aria-labelledby="after-paying-title">
      <h2 id="after-paying-title">After paying</h2>
      <p>Send Sneha the UPI reference number from your payment app, so she can match it to your order.</p>
      <a className="craft-text-link" href={createWhatsAppLink(paidMessage)} target="_blank" rel="noopener noreferrer">Message Sneha on WhatsApp<span className="sr-only"> (opens in a new tab)</span></a>
    </section>
  </div></main>;
}
