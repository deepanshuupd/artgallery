"use client";

import { useCallback } from "react";
import type { Product } from "@/types/product";
import { openWhatsAppOrder, generateOrderMessage, type OrderDetails } from "@/lib/whatsapp";

/**
 * Hook for WhatsApp ordering functionality
 * Provides easy access to WhatsApp order functions with product data
 */
export function useWhatsAppOrder() {
  const handleOrder = useCallback(
    (
      product: Product,
      customizationInterest?: string,
      quantity: number = 1
    ) => {
      openWhatsAppOrder(product, customizationInterest, quantity);
    },
    []
  );

  const getOrderMessage = useCallback(
    (details: OrderDetails) => {
      return generateOrderMessage(details);
    },
    []
  );

  return {
    handleOrder,
    getOrderMessage,
  };
}
