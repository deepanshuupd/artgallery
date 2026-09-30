"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { isAdminEmail } from "@/lib/admin-email";
import { createClient } from "@/lib/supabase/server";

export async function refreshPublicCatalog() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !isAdminEmail(user?.email)) throw new Error("Admin access is required.");
  revalidateTag("public-products");
  revalidatePath("/", "page");
  revalidatePath("/collection", "page");
  revalidatePath("/curated-hampers", "page");
  revalidatePath("/sitemap.xml");
}
