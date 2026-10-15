"use client";

import { useState } from "react";
import styles from "./order-message-preview.module.css";

/** One identical draft for the preview, copy fallback and WhatsApp handoff. */
export function OrderMessagePreview({ message, defaultOpen = false }: { message: string; defaultOpen?: boolean }) {
  const [result, setResult] = useState({ message: "", text: "" });
  async function copy() {
    try {
      await navigator.clipboard.writeText(message);
      setResult({ message, text: "Message copied. Paste it into your WhatsApp chat with Sneha." });
    } catch {
      setResult({ message, text: "Couldn’t copy automatically. You can select and copy the message below." });
    }
  }
  return <details className={styles.preview} open={defaultOpen || undefined}>
    <summary>Preview your WhatsApp message</summary>
    <div className={styles.content}>
      <p>The * marks add emphasis in WhatsApp. Review this draft, then press send there.</p>
      <button type="button" onClick={copy}>Copy message</button>
      <p role="status" aria-live="polite">{result.message === message ? result.text : ""}</p>
      <pre tabIndex={0} aria-label="Prepared WhatsApp message">{message}</pre>
    </div>
  </details>;
}
