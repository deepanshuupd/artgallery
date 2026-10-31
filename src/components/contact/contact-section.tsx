import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { ContactForm } from "@/components/contact/contact-form";
import { InstagramIcon, WhatsAppIcon } from "@/components/icons";
import { generateGeneralInquiryLink, getWhatsAppBusinessNumber } from "@/lib/whatsapp";
import styles from "./contact.module.css";

// "919876543210" reads as "+91 98765 43210".
function displayNumber(number: string) {
  return /^91\d{10}$/.test(number) ? `+91 ${number.slice(2, 7)} ${number.slice(7)}` : number ? `+${number}` : "";
}

export function ContactSection() {
  const phone = displayNumber(getWhatsAppBusinessNumber());
  return (
    <div className={styles.shell}>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Contact", href: "/contact" }]} />
      <header className={styles.heading}>
        <p className="craft-eyebrow">Contact · Pithoragarh, Uttarakhand</p>
        <h1>Write to<br /><em>the hills.</em></h1>
        <p>A question, a gift, an idea still taking shape. Pick a stamp, write to Sneha in Pithoragarh, and post it. Your letter arrives on WhatsApp.</p>
      </header>

      <a className={styles.primaryWay} href={generateGeneralInquiryLink()} target="_blank" rel="noopener noreferrer">
        <WhatsAppIcon />
        <span><strong>In a hurry? WhatsApp Sneha</strong>{phone && <small>{phone}</small>}</span>
        <span aria-hidden="true">→</span>
        <span className="sr-only"> (opens in a new tab)</span>
      </a>

      <ContactForm />

      <section className={styles.ways} aria-label="KumaonRang on Instagram">
        <a className={styles.way} href="https://www.instagram.com/kumaonrang/" target="_blank" rel="noopener noreferrer">
          <InstagramIcon /><span><strong>Art & keepsakes</strong><small>@kumaonrang on Instagram</small></span><span className="sr-only"> on Instagram (opens in a new tab)</span>
        </a>
        <a className={styles.way} href="https://www.instagram.com/snehacuratedhampers/" target="_blank" rel="noopener noreferrer">
          <InstagramIcon /><span><strong>Gift hampers</strong><small>@snehacuratedhampers on Instagram</small></span><span className="sr-only"> on Instagram (opens in a new tab)</span>
        </a>
      </section>

      <nav className={styles.help} aria-label="Answers before you write">
        <p>Your question may already be answered</p>
        <Link prefetch={false} href="/how-to-order">How ordering works</Link>
        <Link prefetch={false} href="/pay">Paying by UPI</Link>
        <Link prefetch={false} href="/shipping-policy">Delivery & dispatch</Link>
        <Link prefetch={false} href="/returns-policy">Damage & returns</Link>
        <Link prefetch={false} href="/bulk-orders">Wedding & bulk gifts</Link>
      </nav>
    </div>
  );
}
