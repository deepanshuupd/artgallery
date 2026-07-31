"use client";

import { useEffect, useId, useRef, useState } from "react";
import { motion } from "motion/react";

import { WhatsAppIcon } from "@/components/icons";
import { formatPrice } from "@/lib/pricing";
import type { Product } from "@/types/product";
import { generateOrderMessage, openWhatsAppOrder } from "@/lib/whatsapp";

type WhatsAppOrderButtonProps = {
  product: Product;
  className?: string;
};

export function WhatsAppOrderButton({
  product,
  className = "",
}: WhatsAppOrderButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [customization, setCustomization] = useState("");
  const [quantity, setQuantity] = useState(1);

  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const quantityRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const close = () => setIsOpen(false);

  // Focus the first field on open; restore focus to the trigger on close.
  useEffect(() => {
    if (!isOpen) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    quantityRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }

      // Basic focus trap: keep Tab within the dialog.
      if (event.key === "Tab" && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previouslyFocused?.focus?.();
    };
  }, [isOpen]);

  const handleOrder = () => {
    openWhatsAppOrder(product, customization || undefined, quantity);
    setCustomization("");
    setQuantity(1);
    close();
  };

  const orderMessage = generateOrderMessage({
    productName: product.name,
    category: product.category,
    price: product.price,
    originalPrice: product.originalPrice,
    customizationInterest: customization || undefined,
    quantity,
  });

  return (
    <>
      <button
        ref={triggerRef}
        className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-stone-900 px-6 py-3 text-sm font-medium uppercase tracking-[0.18em] text-stone-50 shadow-[0_18px_44px_rgba(51,40,33,0.18)] transition-transform duration-300 hover:-translate-y-0.5 hover:bg-stone-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:ring-offset-2 ${className}`}
        onClick={() => setIsOpen(true)}
        type="button"
      >
        <WhatsAppIcon className="h-4 w-4" />
        Order via WhatsApp
      </button>

      {isOpen ? (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={close}
            role="presentation"
          />

          <motion.div
            ref={dialogRef}
            animate={{ opacity: 1, scale: 1 }}
            aria-labelledby={titleId}
            aria-modal="true"
            className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2"
            initial={{ opacity: 0, scale: 0.95 }}
            role="dialog"
            transition={{ duration: 0.2 }}
          >
            <div className="max-h-[85vh] overflow-y-auto rounded-[1.6rem] border border-white/70 bg-[rgba(255,253,252,0.98)] p-6 shadow-[0_24px_90px_rgba(51,40,33,0.15)] backdrop-blur sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <h3
                  className="font-serif text-2xl leading-tight text-stone-900 sm:text-3xl"
                  id={titleId}
                >
                  Customize your order
                </h3>
                <button
                  aria-label="Close"
                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-stone-200 text-stone-600 transition hover:bg-stone-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900/40"
                  onClick={close}
                  type="button"
                >
                  <svg
                    aria-hidden="true"
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.8"
                    viewBox="0 0 24 24"
                  >
                    <path d="M6 6l12 12" />
                    <path d="M18 6L6 18" />
                  </svg>
                </button>
              </div>

              <div className="mt-6 space-y-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-600">
                    Product
                  </p>
                  <p className="mt-2 text-base text-stone-800">{product.name}</p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-600">
                    Category
                  </p>
                  <p className="mt-2 text-base text-stone-800">
                    {product.category}
                  </p>
                </div>

                <div>
                  <label
                    className="block text-xs font-semibold uppercase tracking-[0.18em] text-stone-600"
                    htmlFor={`${titleId}-quantity`}
                  >
                    Quantity
                  </label>
                  <input
                    ref={quantityRef}
                    className="mt-2 w-full rounded-lg border border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-900 placeholder-stone-400 transition-colors focus:border-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900"
                    id={`${titleId}-quantity`}
                    min="1"
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    type="number"
                    value={quantity}
                  />
                </div>

                <div>
                  <label
                    className="block text-xs font-semibold uppercase tracking-[0.18em] text-stone-600"
                    htmlFor={`${titleId}-customization`}
                  >
                    Customization interest (optional)
                  </label>
                  <textarea
                    className="mt-2 w-full rounded-lg border border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-900 placeholder-stone-400 transition-colors focus:border-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900"
                    id={`${titleId}-customization`}
                    onChange={(e) => setCustomization(e.target.value)}
                    placeholder="e.g. personalized with my name, or custom colors"
                    rows={3}
                    value={customization}
                  />
                </div>

                <div className="rounded-lg border border-stone-200/70 bg-white/60 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-stone-600">
                      Estimated total
                    </span>
                    <span className="text-lg font-semibold text-stone-900">
                      {formatPrice(product.price * quantity)}
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-600">
                    Message preview
                  </p>
                  <div className="mt-2 max-h-40 overflow-y-auto whitespace-pre-wrap rounded-lg border border-stone-200/70 bg-white/60 p-3 text-xs leading-relaxed text-stone-700">
                    {orderMessage}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  className="flex-1 rounded-full border border-stone-200 bg-white px-4 py-2.5 text-sm font-medium uppercase tracking-[0.18em] text-stone-900 transition-colors hover:bg-stone-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900/40"
                  onClick={close}
                  type="button"
                >
                  Cancel
                </button>
                <button
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[var(--color-whatsapp)] px-4 py-2.5 text-sm font-medium uppercase tracking-[0.18em] text-white shadow-lg transition-transform hover:-translate-y-0.5 hover:bg-[var(--color-whatsapp-dark)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-whatsapp)] focus-visible:ring-offset-2"
                  onClick={handleOrder}
                  type="button"
                >
                  <WhatsAppIcon className="h-4 w-4" />
                  Send on WhatsApp
                </button>
              </div>
            </div>
          </motion.div>
        </>
      ) : null}
    </>
  );
}
