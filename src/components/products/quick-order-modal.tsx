"use client";

import type { Product } from "@/types/product";
import { useState } from "react";
import { motion } from "motion/react";
import { openWhatsAppOrder, generateOrderMessage } from "@/lib/whatsapp";

type QuickOrderModalProps = {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
};

/**
 * Reusable modal component for quick WhatsApp orders
 * Can be used in multiple places across the application
 */
export function QuickOrderModal({
  product,
  isOpen,
  onClose,
}: QuickOrderModalProps) {
  const [customization, setCustomization] = useState("");
  const [quantity, setQuantity] = useState(1);

  const handleOrder = () => {
    openWhatsAppOrder(product, customization || undefined, quantity);
    setTimeout(() => {
      onClose();
      setCustomization("");
      setQuantity(1);
    }, 300);
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
      {/* Modal Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
          role="presentation"
        />
      )}

      {/* Modal Content */}
      <motion.div
        animate={{ opacity: isOpen ? 1 : 0, scale: isOpen ? 1 : 0.95 }}
        className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 transform"
        transition={{ duration: 0.25 }}
        style={{ pointerEvents: isOpen ? "auto" : "none" }}
      >
        <div className="rounded-[1.6rem] border border-white/70 bg-[rgba(255,253,252,0.98)] p-6 shadow-[0_24px_90px_rgba(51,40,33,0.15)] backdrop-blur sm:p-8">
          <h3 className="font-serif text-2xl leading-tight text-stone-900 sm:text-3xl">
            Order {product.name}
          </h3>

          <div className="mt-6 space-y-5">
            {/* Product Info */}
            <div className="rounded-lg border border-stone-200/70 bg-white/60 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-600">
                Product
              </p>
              <p className="mt-2 text-base text-stone-800">{product.name}</p>
              <p className="mt-1 text-sm text-stone-600">{product.category}</p>
            </div>

            {/* Quantity Selector */}
            <div>
              <label
                className="block text-xs font-semibold uppercase tracking-[0.18em] text-stone-600"
                htmlFor="qty"
              >
                Quantity
              </label>
              <input
                className="mt-2 w-full rounded-lg border border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-900 placeholder-stone-400 transition-colors focus:border-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900"
                id="qty"
                min="1"
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                type="number"
                value={quantity}
              />
            </div>

            {/* Customization */}
            <div>
              <label
                className="block text-xs font-semibold uppercase tracking-[0.18em] text-stone-600"
                htmlFor="custom"
              >
                Customization (Optional)
              </label>
              <textarea
                className="mt-2 w-full rounded-lg border border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-900 placeholder-stone-400 transition-colors focus:border-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900"
                id="custom"
                onChange={(e) => setCustomization(e.target.value)}
                placeholder="Any special requests?"
                rows={3}
                value={customization}
              />
            </div>

            {/* Price */}
            <div className="rounded-lg border border-stone-200/70 bg-white/60 p-4">
              <span className="text-sm text-stone-600">Estimated:</span>
              <p className="mt-1 text-xl font-semibold text-stone-900">
                ₹{product.price * quantity}
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-6 flex gap-3">
            <button
              className="flex-1 rounded-full border border-stone-200 bg-white px-4 py-2.5 text-sm font-medium uppercase tracking-[0.18em] text-stone-900 transition-colors hover:bg-stone-50"
              onClick={onClose}
              type="button"
            >
              Cancel
            </button>
            <button
              className="flex-1 rounded-full bg-[#25D366] px-4 py-2.5 text-sm font-medium uppercase tracking-[0.18em] text-white shadow-lg transition-transform hover:-translate-y-0.5 hover:bg-[#20ba5a]"
              onClick={handleOrder}
              type="button"
            >
              💬 Send
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}
