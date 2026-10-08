"use client";
import { useId, useState } from "react";
import styles from "./order-sheet.module.css";
export function QuantityControl({ value, onChange, minimum = 1 }: { value: number; onChange: (quantity: number) => void; minimum?: number }) {
  const id = useId();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(value));
  return <div className={styles.quantityRow}>
    <label htmlFor={id}>Quantity</label>
    <div className={styles.stepper}>
      <button type="button" aria-label="Decrease quantity" disabled={value <= minimum} onClick={() => onChange(value - 1)}>−</button>
      <input id={id} type="number" inputMode="numeric" min={minimum} max={999} step={1} required value={editing ? draft : value}
        onFocus={() => { setDraft(String(value)); setEditing(true); }} onBlur={() => setEditing(false)}
        onChange={event => { setDraft(event.currentTarget.value); const next = event.currentTarget.valueAsNumber; if (Number.isInteger(next) && next >= minimum && next <= 999) onChange(next); }} />
      <button type="button" aria-label="Increase quantity" disabled={value >= 999} onClick={() => onChange(value + 1)}>+</button>
    </div>
  </div>;
}
