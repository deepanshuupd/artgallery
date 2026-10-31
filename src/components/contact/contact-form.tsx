"use client";

import { useId, useState, useSyncExternalStore, type FormEvent } from "react";
import { WhatsAppIcon } from "@/components/icons";
import { generateContactFormLink } from "@/lib/whatsapp";
import { PillarBox, StampArt } from "./postal-art";
import styles from "./contact.module.css";

type Values = { name: string; email: string; message: string };
type Errors = Partial<Record<keyof Values, string>>;
const initialValues: Values = { name: "", email: "", message: "" };
const subscribeToHydration = () => () => {};
// Pithoragarh head post office: the letter is addressed where Sneha works.
const pin = "262501".split("");
const enquiries = [
  { label: "A piece I love", word: "प्रेम", subject: "Product enquiry", prompt: "Which piece caught your eye? Add its name and any questions…", hint: "A product name or link helps Sneha find the piece you mean." },
  { label: "Make it personal", word: "नाम", subject: "Personalisation", prompt: "Tell Sneha about the piece and the personal detail you’d like to add…", hint: "Share your idea, the product and when you need it. Sneha will confirm what’s possible." },
  { label: "A gift to remember", word: "उपहार", subject: "Gifts & bulk orders", prompt: "Who is it for? Share the occasion, quantity, date and budget if you have one…", hint: "An occasion, budget, quantity and delivery city are a helpful starting point." },
  { label: "My order / something else", word: "डाक", subject: "Order help / general enquiry", prompt: "How can Sneha help? If it’s about an order, include your order reference…", hint: "For order help, include the product or order reference. Please don’t share payment details." },
];
function validate(values: Values): Errors {
  const errors: Errors = {};
  if (values.name.trim().length < 2) errors.name = "Please share your name.";
  if (values.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) errors.email = "Please enter a valid email address.";
  if (values.message.trim().length < 10) errors.message = "Please add a little more detail (at least 10 characters).";
  return errors;
}
const postmarkDate = () => new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "2-digit" }).toUpperCase();

export function ContactForm() {
  const id = useId();
  const ready = useSyncExternalStore(subscribeToHydration, () => true, () => false);
  const [values, setValues] = useState<Values>(initialValues);
  const [errors, setErrors] = useState<Errors>({});
  const [draftLink, setDraftLink] = useState("");
  const [topic, setTopic] = useState(0);
  // Bumped on each successful send so the letter-posting animation can replay.
  const [posts, setPosts] = useState(0);

  const enquiry = enquiries[topic];

  function change(field: keyof Values, value: string) {
    setValues(current => ({ ...current, [field]: value }));
    setErrors(current => ({ ...current, [field]: undefined }));
    setDraftLink("");
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    const firstInvalid = (Object.keys(nextErrors) as (keyof Values)[])[0];
    if (firstInvalid) {
      event.currentTarget.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }
    const message = `${enquiry.subject}\n\n${values.message.trim()}`;
    const link = generateContactFormLink({ name: values.name.trim(), email: values.email.trim(), message });
    setDraftLink(link);
    setPosts(count => count + 1);
    // Opened within the click so pop-up blockers allow it; a noopener window can return null even when opened.
    window.open(link, "_blank", "noopener,noreferrer");
  }

  return (
    <section className={styles.desk} aria-label="Write to Sneha">
      <fieldset className={styles.stamps}>
        <legend><span className={styles.step}>1</span> Choose a stamp for your letter</legend>
        <div className={styles.stampRow}>
          {enquiries.map((item, index) => (
            <button key={item.subject} type="button" className={styles.stampButton} data-kind={index} aria-pressed={topic === index} aria-controls={`${id}-letter`} onClick={() => { setTopic(index); setDraftLink(""); }}>
              <span className={styles.stamp}><StampArt kind={index} /><span className={styles.stampWord} lang="hi">{item.word}</span></span>
              <span className={styles.stampLabel}>{item.label}</span>
            </button>
          ))}
        </div>
      </fieldset>

      <form id={`${id}-letter`} className={styles.letter} noValidate onSubmit={submit} data-posted={posts > 0 && !!draftLink}>
        <p className={styles.legendLine}><span className={styles.step}>2</span> Write your letter</p>
        <div className={styles.ilc}>
          <div className={styles.ilcHead} aria-hidden="true"><span lang="hi">अंतर्देशीय पत्र</span><span>INLAND LETTER</span></div>
          <div className={styles.envelope}>
            <address className={styles.address}>
              <span className={styles.to}>To,</span>
              <strong>Sneha</strong>
              <span>KumaonRang</span>
              <span>Pithoragarh, Uttarakhand</span>
              <span className={styles.pin} aria-label="PIN code 262501">{pin.map((digit, index) => <span key={index} aria-hidden="true">{digit}</span>)}</span>
            </address>
            <div className={styles.stampSlot} aria-hidden="true">
              <span key={topic} className={`${styles.stamp} ${styles.stuck}`} data-kind={topic}><StampArt kind={topic} /><span className={styles.stampWord} lang="hi">{enquiry.word}</span></span>
              <svg className={styles.postmark} viewBox="0 0 100 100">
                <defs><path id={`${id}-arc`} d="M14 50a36 36 0 0 1 72 0" /><path id={`${id}-arc-low`} d="M18 52a32 32 0 0 0 64 0" /></defs>
                <circle cx="50" cy="50" r="44" /><circle cx="50" cy="50" r="30" />
                <text><textPath href={`#${id}-arc`} startOffset="50%" textAnchor="middle">PITHORAGARH H.O.</textPath></text>
                <text><textPath href={`#${id}-arc-low`} startOffset="50%" textAnchor="middle" dominantBaseline="hanging">262501</textPath></text>
                <text x="50" y="54" textAnchor="middle" className={styles.postmarkDate}>{ready ? postmarkDate() : ""}</text>
                <path d="M96 38c8-4 16 4 24 0s16 4 24 0M96 50c8-4 16 4 24 0s16 4 24 0M96 62c8-4 16 4 24 0s16 4 24 0" />
              </svg>
            </div>
          </div>
          <p className={styles.subject} aria-live="polite" aria-atomic="true"><span>Subject:</span> <strong key={enquiry.subject}>{enquiry.subject}</strong></p>
          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <label htmlFor={`${id}-name`}>From</label>
              <input id={`${id}-name`} name="name" autoComplete="name" required maxLength={100} value={values.name} onChange={e => change("name", e.target.value)} aria-invalid={!!errors.name} aria-describedby={errors.name ? `${id}-name-error` : undefined} placeholder="Your name" />
              {errors.name && <p id={`${id}-name-error`} className={styles.error} role="alert">{errors.name}</p>}
            </div>
            <div className={styles.field}>
              <label htmlFor={`${id}-email`}>Reply to <span>(email, optional)</span></label>
              <input id={`${id}-email`} name="email" type="email" autoComplete="email" maxLength={254} value={values.email} onChange={e => change("email", e.target.value)} aria-invalid={!!errors.email} aria-describedby={errors.email ? `${id}-email-error` : undefined} placeholder="you@example.com" />
              {errors.email && <p id={`${id}-email-error`} className={styles.error} role="alert">{errors.email}</p>}
            </div>
          </div>
          <div className={styles.field}>
            <label htmlFor={`${id}-message`}>Dear Sneha,</label>
            <textarea id={`${id}-message`} name="message" required maxLength={3000} rows={5} value={values.message} onChange={e => change("message", e.target.value)} aria-invalid={!!errors.message} aria-describedby={`${id}-hint${errors.message ? ` ${id}-message-error` : ""}`} placeholder={enquiry.prompt} />
            <p id={`${id}-hint`} className={styles.hint}>{enquiry.hint}</p>
            {errors.message && <p id={`${id}-message-error`} className={styles.error} role="alert">{errors.message}</p>}
          </div>
        </div>

        <div className={styles.postRow}>
          <div className={styles.postAction}>
            <button className={styles.formButton} type="submit" disabled={!ready}><WhatsAppIcon />Post it on WhatsApp<span className="sr-only"> (opens in a new tab)</span></button>
            <p className={styles.formNote}>Your letter opens in WhatsApp for you to check and send. Nothing is sent automatically.</p>
          </div>
          <div className={styles.box}>
            <span key={posts} className={styles.folded} aria-hidden="true" />
            <PillarBox className={styles.pillar} />
          </div>
        </div>
        {draftLink && <div className={styles.draft} role="status">
          <p>Posted! Your letter is waiting in WhatsApp; press send there.</p>
          <a href={draftLink} target="_blank" rel="noopener noreferrer">Open WhatsApp again<span className="sr-only"> (opens in a new tab)</span></a>
        </div>}
      </form>
    </section>
  );
}
