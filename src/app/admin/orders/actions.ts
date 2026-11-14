"use server";

import { revalidatePath } from "next/cache";
import { isAdminEmail } from "@/lib/admin-email";
import { createClient } from "@/lib/supabase/server";

const statuses = ["awaiting_payment", "payment_submitted", "confirmed", "dispatched", "delivered", "cancelled"] as const;

/** Moves an order along and keeps a private note. RLS also limits this to the shop admin. */
export async function updateOrder(formData: FormData) {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !isAdminEmail(user?.email)) throw new Error("Admin access is required.");
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  const note = String(formData.get("admin_note") ?? "").trim().slice(0, 1000);
  if (!/^[0-9a-f-]{36}$/i.test(id) || !(statuses as readonly string[]).includes(status)) throw new Error("Invalid order update.");
  const { error: updateError } = await supabase.from("orders").update({ status, admin_note: note || null }).eq("id", id);
  if (updateError) throw new Error("The order could not be updated.");
  revalidatePath("/admin/orders");
  revalidatePath(`/order/${id}`);
}
