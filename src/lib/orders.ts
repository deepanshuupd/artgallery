import { createClient } from "@supabase/supabase-js";
import type { Product } from "@/types/product";
import { CartValidationError } from "./cart-quote";
import { priceCheckout, type CheckoutRequest } from "./checkout";

// Orders go through security-definer database functions (see the add_order_functions
// migration), so the public key is enough: the database re-prices every item itself.
function database() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL, key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key || url.includes("YOUR_PROJECT_ID")) throw new Error("Orders are not configured.");
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

/** The database's own messages (raised as P0001) are written for customers; anything else is not. */
function orderError(error: { code?: string; message?: string }) {
  return error.code === "P0001" && error.message ? new CartValidationError(error.message) : new Error(error.message || "Order failed");
}

export const validOrderId = (value: unknown): value is string =>
  typeof value === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);

export async function placeOrder(request: CheckoutRequest, products: Product[]) {
  // Friendly checks first (minimums, stock). The database then prices the order itself,
  // and the order page shows its total, so a just-changed price can't be under-charged.
  priceCheckout(request.items, products);
  const { customer } = request;
  const { data, error } = await database().rpc("place_order", {
    p_items: request.items.map(({ productId, quantity, request }) => ({ productId, quantity, request })),
    p_customer: { name: customer.name, phone: customer.phone, email: customer.email, address: customer.address, city: customer.city,
      state: customer.state, pincode: customer.pincode, occasionDate: customer.occasionDate, notes: customer.notes },
  });
  if (error) throw orderError(error);
  const order = (data as { id: string; number: number; total: number }[] | null)?.[0];
  if (!order) throw new Error("Order was not created");
  return { id: order.id, number: order.number, total: Number(order.total) };
}

export type CustomerOrder = {
  number: number; status: "awaiting_payment" | "payment_submitted" | "confirmed" | "dispatched" | "delivered" | "cancelled";
  createdAt: string; customerName: string; city: string; pincode: string; paymentSubmitted: boolean;
  items: { productId: string; name: string; price: number; quantity: number; request: string }[];
  subtotal: number; delivery: number; total: number;
};

export async function getCustomerOrder(id: string): Promise<CustomerOrder | null> {
  if (!validOrderId(id)) return null;
  const { data, error } = await database().rpc("get_order", { p_id: id });
  if (error) throw orderError(error);
  const row = (data as Record<string, unknown>[] | null)?.[0];
  if (!row) return null;
  return {
    number: Number(row.number), status: row.status as CustomerOrder["status"], createdAt: String(row.created_at),
    customerName: String(row.customer_name), city: String(row.city), pincode: String(row.pincode), paymentSubmitted: Boolean(row.payment_submitted),
    items: (row.items as CustomerOrder["items"]).map(item => ({ ...item, price: Number(item.price), quantity: Number(item.quantity) })),
    subtotal: Number(row.subtotal), delivery: Number(row.delivery), total: Number(row.total),
  };
}

/** A screenshot's storage path: the order's own folder in the private payment-proofs bucket. */
export const validProofPath = (id: string, path: unknown): path is string =>
  typeof path === "string" && path.startsWith(`${id}/`) && /^[0-9a-f-]{36}\/[A-Za-z0-9._-]{1,80}$/i.test(path);

/** Records the customer's proof of payment: a UPI reference, a screenshot, or both. */
export async function submitOrderPayment(id: string, payment: { reference?: string; proof?: string }) {
  const { data, error } = await database().rpc("submit_order_payment", { p_id: id, p_reference: payment.reference || null, p_proof: payment.proof || null });
  if (error) throw orderError(error);
  return String(data);
}
