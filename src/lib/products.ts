import type { Product } from "@/types/product";

const supabaseConfigured =
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("YOUR_PROJECT_ID");

// Map a Supabase DB row to the Product interface used by components
function mapRow(row: Record<string, unknown>): Product {
  return {
    id: row.id as string,
    name: row.name as string,
    category: row.category as Product["category"],
    description: row.description as string,
    story: (row.story as string) ?? "",
    price: row.price as number,
    image: (row.image_url as string) ?? "",
    featured: (row.is_featured as boolean) ?? false,
    details: (row.details as string[]) ?? [],
    whatsappMessage: (row.whatsapp_message as string) ?? "",
  };
}

export async function getProducts(): Promise<Product[]> {
  if (!supabaseConfigured) {
    const data = await import("@/data/products/products.json");
    return data.default as Product[];
  }

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_available", true)
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data.map(mapRow);
}

export async function getProductById(id: string): Promise<Product | undefined> {
  if (!supabaseConfigured) {
    const data = await import("@/data/products/products.json");
    return (data.default as Product[]).find((p) => p.id === id);
  }

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return undefined;
  return mapRow(data);
}

export async function getRelatedProducts(
  currentProductId: string,
  category: string,
): Promise<Product[]> {
  if (!supabaseConfigured) {
    const data = await import("@/data/products/products.json");
    return (data.default as Product[]).filter(
      (p) => p.id !== currentProductId && p.category === category,
    );
  }

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("category", category)
    .neq("id", currentProductId)
    .eq("is_available", true)
    .limit(4);

  if (error || !data) return [];
  return data.map(mapRow);
}
