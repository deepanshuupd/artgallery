import Link from "next/link";
import { ContactForm } from "@/components/contact/contact-form";
import { InstagramIcon } from "@/components/icons";
import styles from "./contact.module.css";

export function ContactSection() {
  return (
    <div className={styles.shell}>
      <div className={styles.masthead}>
        <nav aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">/</span><span aria-current="page">Contact</span></nav>
        <span>Pithoragarh, Uttarakhand</span>
      </div>
      <header className={styles.heading}>
        <p className={styles.eyebrow}>The KumaonRang correspondence desk</p>
        <h1>Hello from the hills.<br /><em>Let’s talk.</em></h1>
        <p>A question, a gift, an idea still taking shape.<br className={styles.desktopBreak} /> Tell Sneha what you have in mind.</p>
      </header>
      <ContactForm />
      <aside className={styles.social} aria-label="KumaonRang on Instagram">
        <span>Keep in touch between conversations.</span>
        <div>
          <a href="https://www.instagram.com/art_gallery_05s/" target="_blank" rel="noopener noreferrer"><InstagramIcon />Art & keepsakes<span className="sr-only"> on Instagram (opens in a new tab)</span></a>
          <a href="https://www.instagram.com/snehacuratedhampers/" target="_blank" rel="noopener noreferrer"><InstagramIcon />Curated hampers<span className="sr-only"> on Instagram (opens in a new tab)</span></a>
        </div>
      </aside>
    </div>
  );
}
