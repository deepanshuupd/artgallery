"use client";

import type { Product } from "@/types/product";
import { useWhatsAppOrder } from "@/hooks/useWhatsAppOrder";

type SimpleWhatsAppButtonProps = {
  product: Product;
  className?: string;
  showIcon?: boolean;
  text?: string;
};

/**
 * Simplified WhatsApp order button without customization modal
 * Perfect for product cards and quick ordering
 */
export function SimpleWhatsAppButton({
  product,
  className = "",
  showIcon = true,
  text = "Order",
}: SimpleWhatsAppButtonProps) {
  const { handleOrder } = useWhatsAppOrder();

  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-lg bg-[#25D366] px-4 py-2 text-sm font-medium text-white transition-transform hover:-translate-y-0.5 hover:bg-[#20ba5a] ${className}`}
      onClick={() => handleOrder(product)}
      type="button"
      title={`Order ${product.name} via WhatsApp`}
    >
      {showIcon && <span>💬</span>}
      <span>{text}</span>
    </button>
  );
}
