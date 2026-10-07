"use client";

import { useId, useState, type FormEvent } from "react";
import { WhatsAppIcon } from "@/components/icons";
import { generateContactFormLink, generateGeneralInquiryLink } from "@/lib/whatsapp";
import styles from "./contact.module.css";

type Values = { name: string; email: string; message: string };
type Errors = Partial<Record<keyof Values, string>>;
const initialValues: Values = { name: "", email: "", message: "" };
const enquiries = [
  { label: "A piece I love", subject: "Product enquiry", detail: "Availability, details & the little things.", prompt: "Which piece caught your eye? Add its name and any questions…", hint: "A product name or link helps Sneha find the piece you mean." },
  { label: "Make it personal", subject: "Personalisation", detail: "A name, a memory, something yours.", prompt: "Tell Sneha about the piece and the personal detail you’d like to add…", hint: "Share your idea, the product and when you need it. Sneha will confirm what’s possible." },
  { label: "A gift to remember", subject: "Gifts & bulk orders", detail: "One thoughtful gift, or a whole occasion.", prompt: "Who is it for? Share the occasion, quantity, date and budget if you have one…", hint: "An occasion, budget, quantity and delivery city are a helpful starting point." },
  { label: "My order / something else", subject: "Order help / general enquiry", detail: "An update, a question, or just hello.", prompt: "How can Sneha help? If it’s about an order, include your order reference…", hint: "For order help, include the product or order reference. Please don’t share payment details." },
];
function validate(values: Values): Errors {
  const errors: Errors = {};
  if (values.name.trim().length < 2) errors.name = "Please share your name.";
  if (values.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) errors.email = "Please enter a valid email address.";
  if (values.message.trim().length < 10) errors.message = "Please add a little more detail (at least 10 characters).";
  return errors;
}

export function ContactForm() {
  const id = useId();
  const [values, setValues] = useState<Values>(initialValues);
  const [errors, setErrors] = useState<Errors>({});
  const [draftLink, setDraftLink] = useState("");
  const [topic, setTopic] = useState(0);

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
    // A noopener window can return null even when opened. Keep a real link available.
    window.open(link, "_blank", "noopener,noreferrer");
  }
  return (
    <section className={styles.desk} aria-label="Start a conversation with Sneha">
      <div className={styles.choices}>
        <fieldset className={styles.topics}>
          <legend><span className={styles.step}>01</span> What brings you here?</legend>
          <div className={styles.topicList}>
            {enquiries.map((item, index) => (
              <button key={item.subject} type="button" aria-pressed={topic === index} aria-controls={`${id}-letter`} onClick={() => { setTopic(index); setDraftLink(""); }}>
                <span className={styles.topicNumber} aria-hidden="true">0{index + 1}</span>
                <span><strong>{item.label}</strong><small>{item.detail}</small></span>
                <span className={styles.selection} aria-hidden="true">{topic === index ? "✓" : "+"}</span>
              </button>
            ))}
          </div>
        </fieldset>
        <div className={styles.direct}>
          <span>Already know what to say?</span>
          <a href={generateGeneralInquiryLink()} target="_blank" rel="noopener noreferrer"><WhatsAppIcon />Chat directly on WhatsApp<span className="sr-only"> (opens in a new tab)</span></a>
        </div>
        <p className={styles.deskSignature}>From your screen to Sneha’s.<br /><span>A real person, behind every piece.</span></p>
      </div>
      <form id={`${id}-letter`} className={styles.form} noValidate onSubmit={submit}>
        <div className={styles.letterTop}>
          <span><span className={styles.step}>02</span> Your note</span>
          <span className={styles.stamp} aria-hidden="true"><svg viewBox="0 0 60 30" fill="none"><path d="m3 26 17-21 14 17 8-12 15 16M13 14l7-9 7 9-7-3-7 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /></svg>KUMAONRANG</span>
        </div>
        <div className={styles.addressee}><span>To</span><strong>Sneha</strong><span>at KumaonRang</span></div>
        <div className={styles.subject} aria-live="polite" aria-atomic="true"><span>About</span><strong key={enquiry.subject}>{enquiry.subject}</strong></div>
        <div className={styles.fieldRow}>
          <div className={styles.field}>
            <label htmlFor={`${id}-name`}>Your name</label>
            <input id={`${id}-name`} name="name" autoComplete="name" required maxLength={100} value={values.name} onChange={e => change("name", e.target.value)} aria-invalid={!!errors.name} aria-describedby={errors.name ? `${id}-name-error` : undefined} placeholder="How should we address you?" />
            {errors.name && <p id={`${id}-name-error`} className={styles.error} role="alert">{errors.name}</p>}
          </div>
          <div className={styles.field}>
            <label htmlFor={`${id}-email`}>Email <span>(optional)</span></label>
            <input id={`${id}-email`} name="email" type="email" autoComplete="email" maxLength={254} value={values.email} onChange={e => change("email", e.target.value)} aria-invalid={!!errors.email} aria-describedby={errors.email ? `${id}-email-error` : undefined} placeholder="you@example.com" />
            {errors.email && <p id={`${id}-email-error`} className={styles.error} role="alert">{errors.email}</p>}
          </div>
        </div>
        <div className={styles.field}>
          <label htmlFor={`${id}-message`}>Your message</label>
          <textarea id={`${id}-message`} name="message" required maxLength={3000} rows={4} value={values.message} onChange={e => change("message", e.target.value)} aria-invalid={!!errors.message} aria-describedby={`${id}-hint${errors.message ? ` ${id}-message-error` : ""}`} placeholder={enquiry.prompt} />
          <p id={`${id}-hint`} className={styles.hint}>{enquiry.hint}</p>
          {errors.message && <p id={`${id}-message-error`} className={styles.error} role="alert">{errors.message}</p>}
        </div>
        <div>
          <button className={styles.formButton} type="submit"><WhatsAppIcon />Continue on WhatsApp<span className="sr-only"> (opens in a new tab)</span></button>
          <p className={styles.formNote}>Review your note in WhatsApp, then press send.<br />Nothing is sent automatically.</p>
        </div>
        {draftLink && <div className={styles.draft} role="status">
          <p>Your draft is ready. Review it and press send in WhatsApp.</p>
          <a href={draftLink} target="_blank" rel="noopener noreferrer">Open WhatsApp again<span className="sr-only"> (opens in a new tab)</span></a>
        </div>}
      </form>
    </section>
  );
}
