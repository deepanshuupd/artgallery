"use client";
import { useEffect, useRef } from "react";
/** Native top-layer dialogs contain focus and make the page behind them inert. */
export function useProductDialog(open: boolean) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    if (!open || !dialog) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = "hidden";
    dialog.querySelector<HTMLElement>("[data-dialog-focus]")?.focus();
    // Also keep reverse Tab on the first control from escaping into browser chrome.
    const containTab = (event: KeyboardEvent) => {
      if (event.key !== "Tab" || event.altKey || event.ctrlKey || event.metaKey) return;
      const controls = Array.from(dialog.querySelectorAll<HTMLElement>(
        'button:not(:disabled), a[href], input:not(:disabled), textarea:not(:disabled), select:not(:disabled), summary, [tabindex]:not([tabindex="-1"])',
      )).filter(control => control.getClientRects().length > 0);
      const first = controls[0];
      const last = controls.at(-1);
      if (!first || !last) return;
      const active = document.activeElement as HTMLElement;
      if (event.shiftKey && (active === first || !controls.includes(active))) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault(); first.focus();
      }
    };
    dialog.addEventListener("keydown", containTab);
    return () => {
      dialog.removeEventListener("keydown", containTab);
      dialog.close();
      document.body.style.overflow = previousOverflow;
      if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
    };
  }, [open]);
  return ref;
}
