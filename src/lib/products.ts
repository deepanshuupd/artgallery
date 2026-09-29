import { cache } from "react";

import type { Product } from "@/types/product";

const supabaseConfigured =
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("YOUR_PROJECT_ID");

// The fallback JSON (used when Supabase isn't configured) may omit optional
// fields like `images`. Normalize it so consumers always receive a well-formed
// Product — in particular a non-undefined `images` array.
function normalizeProduct(raw: Partial<Product> & { image?: string }): Product {
  const image = typeof raw.image === "string" ? raw.image.trim() : "";
  const images =
    Array.isArray(raw.images)
      ? raw.images.filter(
          (candidate): candidate is string =>
            typeof candidate === "string" && candidate.trim().length > 0,
        )
      : image
        ? [image]
        : [];

  return {
    id: raw.id ?? "",
    slug: raw.slug,
    name: raw.name ?? "",
    category: raw.category as Product["category"],
    description: raw.description ?? "",
    story: raw.story ?? "",
    price: raw.price ?? 0,
    originalPrice: raw.originalPrice,
    image: image || images[0] || "",
    images,
    featured: raw.featured ?? false,
    details: raw.details ?? [],
    whatsappMessage: raw.whatsappMessage ?? "",
  };
}

async function loadFallbackProducts(): Promise<Product[]> {
  const data = await import("@/data/products/products.json");
  return (data.default as Array<Partial<Product> & { image?: string }>).map(
    normalizeProduct
  );
}

// Map a Supabase DB row to the Product interface used by components
function mapRow(row: Record<string, unknown>): Product {
  const imageUrls = Array.isArray(row.image_urls)
    ? row.image_urls.filter(
        (image): image is string =>
          typeof image === "string" && image.trim().length > 0,
      )
    : typeof row.image_url === "string" && row.image_url.trim()
      ? [row.image_url.trim()]
      : [];

  const imageUrl =
    imageUrls[0] ??
    (typeof row.image_url === "string" ? row.image_url.trim() : "");

  return {
    id: row.id as string,
    slug: typeof row.slug === "string" ? row.slug : undefined,
    name: row.name as string,
    category: row.category as Product["category"],
    description: row.description as string,
    story: (row.story as string) ?? "",
    price: row.price as number,
    originalPrice:
      row.original_price != null ? Number(row.original_price) : undefined,
    image: imageUrl,
    images: imageUrls,
    featured: (row.is_featured as boolean) ?? false,
    details: (row.details as string[]) ?? [],
    whatsappMessage: (row.whatsapp_message as string) ?? "",
  };
}

export const getProducts = cache(async (): Promise<Product[]> => {
  if (!supabaseConfigured) {
    return loadFallbackProducts();
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
});

export const getProductById = cache(
  async (id: string): Promise<Product | undefined> => {
    if (!supabaseConfigured) {
      const products = await loadFallbackProducts();
      return products.find((p) => p.id === id);
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
);

export async function getRelatedProducts(
  currentProductId: string,
  category: string,
): Promise<Product[]> {
  if (!supabaseConfigured) {
    const products = await loadFallbackProducts();
    return products.filter(
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
