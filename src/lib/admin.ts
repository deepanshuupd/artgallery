import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

const DEFAULT_ADMIN_EMAIL = "sneha@gmail.com";

function getAllowedAdminEmail() {
  return process.env.ADMIN_EMAIL?.trim() || DEFAULT_ADMIN_EMAIL;
}

export async function requireAdminUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const allowedEmail = getAllowedAdminEmail();

  if (!user || user.email?.toLowerCase() !== allowedEmail.toLowerCase()) {
    redirect("/admin/login");
  }

  return user;
}