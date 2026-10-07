import { ResponsiveImage } from "@/components/responsive-image";
import Link from "next/link";
import { customerNotes } from "@/data/customer-notes";
import type { CustomerNote } from "@/data/customer-notes";
import { CustomerNotesWall } from "./customer-notes-wall";
import styles from "./customer-notes.module.css";

export function CustomerNotes() {
  return (
    <section id="customer-notes" className={styles.section} aria-labelledby="customer-notes-title">
      <div className={styles.shell}>
        <header className={styles.heading}>
          <div>
            <p className={styles.eyebrow}>Made here. Loved out there.</p>
            <h2 id="customer-notes-title">The love<br /><em>comes back.</em></h2>
          </div>
          <p className={styles.intro}>Before this website, our orders began on Instagram. These are some of the messages that came back.</p>
        </header>
      </div>
      <CustomerNotesWall>
        <div className={styles.flow}>
          <NoteRow ids={["kanishak", "family-frame", "phone-cover", "nameplate"]} />
          <NoteRow ids={["sargam", "ankita", "parcel", "tamanna", "dinesh"]} reverse />
        </div>
      </CustomerNotesWall>
      <div className={`${styles.shell} ${styles.footer}`}>
        <p>Real words. Customer-shared photographs.<br />Selected WhatsApp messages, shared with permission.</p>
        <Link href="/customer-stories" prefetch={false} className={styles.storiesLink}>More stories from our inbox</Link>
      </div>
    </section>
  );
}

function NoteRow({ ids, reverse = false }: { ids: string[]; reverse?: boolean }) {
  const notes = ids.map(id => customerNotes.find(note => note.id === id)!).filter(Boolean);
  return (
    <div className={styles.row}>
      <div className={`${styles.track} ${reverse ? styles.reverse : ""}`}>
        <div className={styles.group}>{notes.map(note => <WallNote key={note.id} note={note} />)}</div>
        {/* An inaccessible visual repeat makes the CSS loop seamless, not extra reviews. */}
        <div className={`${styles.group} ${styles.repeat}`} aria-hidden="true" inert>{notes.map(note => <WallNote key={note.id} note={note} />)}</div>
      </div>
    </div>
  );
}

function WallNote({ note }: { note: CustomerNote }) {
  return (
    <figure className={`${styles.note} ${note.photo ? styles.withPhoto : ""}`}>
      {note.photo ? (
        <div className={styles.photo}>
          <ResponsiveImage src={note.photo.src} alt={note.photo.alt} width={note.photo.width} height={note.photo.height}
            sizes="(min-width: 768px) 130px, 94px" loading="lazy" />
        </div>
      ) : null}
      <div className={styles.words}>
        <blockquote><p>“{note.excerpt}”</p></blockquote>
        <figcaption><span>{note.attribution}</span><span>{note.sourceLabel}</span></figcaption>
      </div>
    </figure>
  );
}
