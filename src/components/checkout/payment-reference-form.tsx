"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";
import styles from "./checkout.module.css";

const maxUpload = 5 * 1024 * 1024;
const accepted = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];

/** Phone screenshots are large PNGs; send a sharp JPEG of at most 1600 px instead. */
async function shrink(file: File): Promise<Blob> {
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, "image/jpeg", .85));
    if (blob && blob.size < file.size) return blob;
  } catch { /* A format this browser can't draw (e.g. HEIC outside Safari) is sent as it is. */ }
  return file;
}

/** After paying, the customer uploads a screenshot or types the UPI reference, so Sneha can match the payment. */
export function PaymentReferenceForm({ orderId }: { orderId: string }) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [reference, setReference] = useState("");
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");

  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);

  function choose(chosen: File | undefined) {
    setError("");
    if (!chosen) return;
    if (!chosen.type.startsWith("image/")) { setError("Choose a screenshot or photo of the payment (an image file)."); return; }
    setFile(chosen);
    setPreview(URL.createObjectURL(chosen));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    try {
      let proof = "";
      if (file) {
        setBusy("Uploading your screenshot…");
        const image = await shrink(file);
        const type = image === file ? file.type : "image/jpeg";
        if (!accepted.includes(type)) throw new Error("Choose a JPG, PNG or HEIC screenshot of the payment.");
        if (image.size > maxUpload) throw new Error("This image is too large. Take a screenshot of the payment confirmation and upload that instead.");
        const extension = type === "image/jpeg" ? "jpg" : type.split("/")[1];
        const path = `${orderId}/${Date.now()}.${extension}`;
        const { error: uploadError } = await createClient().storage.from("payment-proofs").upload(path, image, { contentType: type, upsert: false });
        if (uploadError) throw new Error("Your screenshot could not be uploaded. Try again, or enter the UPI reference number instead.");
        proof = path;
      }
      setBusy("Saving…");
      const response = await fetch(`/api/orders/${orderId}/payment`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ reference, proof }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Your payment details could not be saved.");
      router.refresh();
      // The payment card is replaced by the confirmation at the top; take the customer there.
      window.scrollTo({ top: 0, behavior: "auto" });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Please check your connection and try again.");
      setBusy("");
    }
  }

  return <form onSubmit={submit} className={styles.proof}>
    <h3>Paid? Show Sneha the payment</h3>
    <p className={styles.proofHint}>Whichever is easier: a screenshot of the payment, or the UPI reference number.</p>
    <label className={styles.upload} data-chosen={file ? "true" : undefined}>
      <input type="file" accept="image/*" onChange={event => { choose(event.currentTarget.files?.[0]); event.currentTarget.value = ""; }} />
      {/* eslint-disable-next-line @next/next/no-img-element -- a local preview of the customer's own file */}
      {preview ? <img src={preview} alt="Your payment screenshot" /> : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2" /><circle cx="9" cy="10" r="1.8" /><path d="m21 16-5-5-8 8" strokeLinejoin="round" /></svg>}
      <span><strong>{file ? "Screenshot added" : "Upload payment screenshot"}</strong>{file ? `${file.name} · tap to change` : "From your gallery or files"}</span>
    </label>
    <p className={styles.orLine}><span>or</span></p>
    <label className={styles.reference}>UPI reference number (UTR)
      <span>Usually 12 digits, on the payment receipt in your UPI app.{file ? " Optional with a screenshot." : ""}</span>
      <input inputMode="text" autoComplete="off" spellCheck={false} maxLength={40} placeholder="e.g. 412345678901" value={reference} onChange={event => { setReference(event.currentTarget.value.replace(/\s/g, "")); setError(""); }} />
    </label>
    {error && <p role="alert" className={styles.error}>{error}</p>}
    <button type="submit" className={styles.primary} disabled={Boolean(busy) || (!file && reference.length < 6)}>{busy || "Submit payment proof"}</button>
  </form>;
}
