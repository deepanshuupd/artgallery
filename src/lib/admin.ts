import { redirect } from "next/navigation";

import { isAdminEmail } from "@/lib/admin-email";
import { createClient } from "@/lib/supabase/server";

export async function requireAdminUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!isAdminEmail(user?.email)) {
    redirect("/admin/login");
  }

  return user;
}