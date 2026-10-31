import Link from "next/link";
import { shopUpi } from "@/data/shop-ordering";
import styles from "./upi-pay-steps.module.css";

/** What happens after the WhatsApp enquiry, with the shop's UPI QR ready to scan. */
export function UpiPaySteps({ qrSvg }: { qrSvg?: string }) {
  return <section className={styles.steps} aria-labelledby="upi-steps-title">
    <p className="craft-eyebrow">After you send it</p>
    <h3 id="upi-steps-title">Pay by UPI once your total is confirmed</h3>
    <ol>
      <li>Sneha confirms availability and the total, including delivery, in your chat.</li>
      <li>Pay that total with GPay, PhonePe, Paytm or any UPI app.</li>
      <li>Send the UPI reference number in the same chat.</li>
    </ol>
    {qrSvg && <details className={styles.qr}>
      <summary>Show the UPI QR<span aria-hidden="true">+</span></summary>
      <div className={styles.qrBody}>
        <div className={styles.code} role="img" aria-label={`UPI QR code for ${shopUpi.name}`} dangerouslySetInnerHTML={{ __html: qrSvg }} />
        <p>Paying <strong>{shopUpi.name}</strong><br />UPI ID <strong>{shopUpi.id}</strong></p>
        <p className={styles.note}>Enter the total Sneha confirms; delivery is added to the product subtotal.</p>
      </div>
    </details>}
    <Link prefetch={false} href="/pay" className={styles.link}>Open the payment page →</Link>
  </section>;
}
