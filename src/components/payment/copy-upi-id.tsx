"use client";

import { useState } from "react";
import styles from "./pay.module.css";

export function CopyUpiId({ id }: { id: string }) {
  const [copied, setCopied] = useState(false);
  return <div className={styles.upiId}>
    <span><small>UPI ID</small><strong>{id}</strong></span>
    <button type="button" onClick={async () => {
      try { await navigator.clipboard.writeText(id); setCopied(true); } catch { setCopied(false); }
    }}>{copied ? "Copied" : "Copy"}</button>
    <span className="sr-only" role="status">{copied ? "UPI ID copied" : ""}</span>
  </div>;
}
