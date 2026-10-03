import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { customerNotes } from "@/data/customer-notes";
import { pageMetadata } from "@/lib/seo";
import styles from "@/components/home/customer-notes.module.css";

export const metadata: Metadata = pageMetadata({
  title: "Customer Stories | Words from the KumaonRang Community",
  path: "/customer-stories",
  description: "Customer-shared photos and genuine WhatsApp feedback from KumaonRang’s Instagram orders: Aipan frames, Pahadi keepsakes and personalised gifts.",
});

export default function CustomerStoriesPage() {
  const order = ["family-frame", "kanishak", "phone-cover", "nameplate", "sargam", "ankita", "parcel", "tamanna", "dinesh"];
  return (
    <main className={styles.storiesPage}>
      <header className={styles.storiesHeader}>
        <div>
          <Link href="/" prefetch={false} className={styles.backLink}>Back to KumaonRang</Link>
          <h1>Little things.<br />Real connections.</h1>
          <p>Our orders began with conversations on Instagram. Here are selected messages and photographs customers sent back on WhatsApp—about the things they received, gave and helped us make personal.</p>
        </div>
      </header>
      <div className={styles.inbox}>
        {order.map(id => customerNotes.find(note => note.id === id)!).filter(Boolean).map(note => (
          <article key={note.id} id={note.id} className={styles.inboxNote}>
            {note.photo ? <figure className={styles.inboxPhoto}><Image src={note.photo.src} alt={note.photo.alt}
              width={note.photo.width} height={note.photo.height} sizes="(min-width: 768px) 170px, 104px" loading="lazy" /></figure> : null}
            <p className={styles.noteContext}>{note.context}</p>
            <blockquote>{note.messages.map((message, index) => <p key={index}>{message}</p>)}</blockquote>
            <p className={styles.byline}>{note.attribution}</p>
            <p className={styles.source}>{note.sourceLabel}{note.date ? <> · <time dateTime={note.date.iso}>{note.date.label}</time></> : null}</p>
            <details className={styles.evidence}>
              <summary>Original WhatsApp message</summary>
              <a href={note.screenshot.src} target="_blank" rel="noopener noreferrer" aria-label="Open the cropped original screenshot at full size in a new tab">
                <Image src={note.screenshot.src} alt={`Original cropped WhatsApp feedback: ${note.context}`} width={note.screenshot.width} height={note.screenshot.height} loading="lazy" unoptimized />
              </a>
              <p>Shared with permission. This is an exact crop of the original screenshot, with private details excluded. Quotes on this page are excerpts; the screenshot preserves the original wording and emojis.</p>
            </details>
            <Link href={note.shop.href} prefetch={false} className={styles.inboxShop}>{note.shop.label}</Link>
          </article>
        ))}
        <p className={styles.inboxFooter}>Shared with permission, with private details cropped out. Some names are kept private. Design feedback and forwarded messages are labelled.</p>
      </div>
    </main>
  );
}
