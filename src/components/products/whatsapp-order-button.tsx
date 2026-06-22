"use client";

import { useState } from "react";
import { motion } from "motion/react";
import type { Product } from "@/types/product";
import { openWhatsAppOrder, generateOrderMessage } from "@/lib/whatsapp";

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

  const handleOrder = () => {
    openWhatsAppOrder(product, customization || undefined, quantity);
    // Reset form after opening WhatsApp
    setTimeout(() => {
      setIsOpen(false);
      setCustomization("");
      setQuantity(1);
    }, 300);
  };

  const orderMessage = generateOrderMessage({
    productName: product.name,
    category: product.category,
    price: product.price,
    customizationInterest: customization || undefined,
    quantity,
  });

  return (
    <>
      {/* Order Button */}
      <button
        className={`inline-flex min-h-12 items-center justify-center rounded-full bg-stone-900 px-6 py-3 text-sm font-medium uppercase tracking-[0.18em] text-stone-50 shadow-[0_18px_44px_rgba(51,40,33,0.18)] transition-transform duration-300 hover:-translate-y-0.5 hover:bg-stone-800 ${className}`}
        onClick={() => setIsOpen(true)}
        type="button"
      >
        💬 Order via WhatsApp
      </button>

      {/* Modal Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
          role="presentation"
        />
      )}

      {/* Order Customization Modal */}
      <motion.div
        animate={{ opacity: isOpen ? 1 : 0, scale: isOpen ? 1 : 0.95 }}
        className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 transform"
        transition={{ duration: 0.25 }}
        style={{ pointerEvents: isOpen ? "auto" : "none" }}
      >
        <div className="rounded-[1.6rem] border border-white/70 bg-[rgba(255,253,252,0.98)] p-6 shadow-[0_24px_90px_rgba(51,40,33,0.15)] backdrop-blur sm:p-8">
          <h3 className="font-serif text-2xl leading-tight text-stone-900 sm:text-3xl">
            Customize Your Order
          </h3>

          <div className="mt-6 space-y-5">
            {/* Product Name Display */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-stone-600">
                Product
              </label>
              <p className="mt-2 text-base text-stone-800">{product.name}</p>
            </div>

            {/* Category Display */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-stone-600">
                Category
              </label>
              <p className="mt-2 text-base text-stone-800">{product.category}</p>
            </div>

            {/* Quantity Selector */}
            <div>
              <label
                className="block text-xs font-semibold uppercase tracking-[0.18em] text-stone-600"
                htmlFor="quantity"
              >
                Quantity
              </label>
              <input
                className="mt-2 w-full rounded-lg border border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-900 placeholder-stone-400 transition-colors focus:border-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900"
                id="quantity"
                min="1"
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                type="number"
                value={quantity}
              />
            </div>

            {/* Customization Interest */}
            <div>
              <label
                className="block text-xs font-semibold uppercase tracking-[0.18em] text-stone-600"
                htmlFor="customization"
              >
                Customization Interest (Optional)
              </label>
              <textarea
                className="mt-2 w-full rounded-lg border border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-900 placeholder-stone-400 transition-colors focus:border-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900"
                id="customization"
                onChange={(e) => setCustomization(e.target.value)}
                placeholder="e.g., 'Personalized with my name' or 'Custom colors'"
                rows={3}
                value={customization}
              />
            </div>

            {/* Price Display */}
            <div className="rounded-lg border border-stone-200/70 bg-white/60 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-stone-600">Estimated Total:</span>
                <span className="text-lg font-semibold text-stone-900">
                  ₹{product.price * quantity}
                </span>
              </div>
            </div>

            {/* Message Preview */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-stone-600">
                Message Preview
              </label>
              <div className="mt-2 max-h-40 overflow-y-auto rounded-lg border border-stone-200/70 bg-white/60 p-3 text-xs leading-relaxed text-stone-700 whitespace-pre-wrap">
                {orderMessage}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex gap-3">
            <button
              className="flex-1 rounded-full border border-stone-200 bg-white px-4 py-2.5 text-sm font-medium uppercase tracking-[0.18em] text-stone-900 transition-colors hover:bg-stone-50"
              onClick={() => setIsOpen(false)}
              type="button"
            >
              Cancel
            </button>
            <button
              className="flex-1 rounded-full bg-[#25D366] px-4 py-2.5 text-sm font-medium uppercase tracking-[0.18em] text-white shadow-lg transition-transform hover:-translate-y-0.5 hover:bg-[#20ba5a]"
              onClick={handleOrder}
              type="button"
            >
              💬 Send on WhatsApp
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}
