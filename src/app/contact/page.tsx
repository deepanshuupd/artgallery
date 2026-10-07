import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

import { ContactSection } from "@/components/contact/contact-section";
import styles from "@/components/contact/contact.module.css";

export const metadata: Metadata = {
  ...pageMetadata({ title: "Contact Sneha | Custom Gifts & Orders", path: "/contact", description: "Contact KumaonRang for Aipan-inspired gifts, Pahadi keychains, personalized keepsakes, and Kumaon hampers from Pithoragarh, Uttarakhand." }),
  keywords: [
    "order handmade gifts from Uttarakhand",
    "custom Aipan gifts",
    "Pithoragarh handmade gifts",
    "Uttarakhand wedding return gifts",
  ],
};

export default function ContactPage() {
  return (
    <main className={styles.page}>
      <ContactSection />
    </main>
  );
}
