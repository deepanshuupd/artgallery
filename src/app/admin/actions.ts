"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { isAdminEmail } from "@/lib/admin-email";
import { getCategoryPath, slugify } from "@/lib/catalog";
import { submitToIndexNow } from "@/lib/indexnow";
import { getSiteUrl } from "@/lib/site";
import { createClient } from "@/lib/supabase/server";
import type { ProductCategory } from "@/types/product";

export async function refreshPublicCatalog() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !isAdminEmail(user?.email)) throw new Error("Admin access is required.");
  revalidateTag("public-products");
  revalidatePath("/", "page");
  revalidatePath("/collection", "page");
  revalidatePath("/curated-hampers", "page");
  revalidatePath("/sitemap.xml");

  // Tell Bing and other IndexNow engines what just changed: products saved in
  // the last few minutes plus the listings that show them. Never blocks a save.
  try {
    const since = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    const { data } = await supabase.from("products").select("name,slug,category,url_category,is_published").gte("updated_at", since);
    const site = getSiteUrl();
    const changed = (data ?? []).filter(row => row.is_published !== false).map(row => {
      const category = getCategoryPath((row.url_category ?? row.category) as ProductCategory);
      return [`${site}/${category}/${row.slug?.trim() || slugify(row.name)}`, `${site}/${category}`];
    }).flat();
    if (changed.length) await submitToIndexNow([...changed, `${site}/`, `${site}/collection`]);
  } catch {}
}
