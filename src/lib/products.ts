import { cache } from "react";
import { unstable_cache } from "next/cache";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

import type { Product } from "@/types/product";
import { getProductImageUrls, normalizeImageMetadata } from "@/lib/product-image";

const supabaseConfigured =
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("YOUR_PROJECT_ID");

// The fallback JSON (used when Supabase isn't configured) may omit optional
// fields like `images`. Normalize it so consumers always receive a well-formed
// Product — in particular a non-undefined `images` array.
function normalizeProduct(raw: Partial<Product> & { image?: string }): Product {
  const images = getProductImageUrls(raw);

  return {
    id: raw.id ?? "",
    slug: raw.slug,
    name: raw.name ?? "",
    category: raw.category as Product["category"],
    description: raw.description ?? "",
    story: raw.story ?? "",
    price: raw.price ?? 0,
    originalPrice: raw.originalPrice,
    image: images[0] || "",
    images,
    imageMetadata: normalizeImageMetadata(raw.imageMetadata, images),
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
  const imageUrls = getProductImageUrls({
    image: typeof row.image_url === "string" ? row.image_url : "",
    images: Array.isArray(row.image_urls) ? row.image_urls : [],
  });

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
    image: imageUrls[0] || "",
    images: imageUrls,
    imageMetadata: normalizeImageMetadata(row.image_metadata, imageUrls),
    featured: (row.is_featured as boolean) ?? false,
    details: (row.details as string[]) ?? [],
    whatsappMessage: (row.whatsapp_message as string) ?? "",
  };
}

// Public catalog reads do not depend on the visitor's auth cookies. Cache them
// across requests so the homepage can be served as complete, stable HTML.
// Version the cached data shape so the image-metadata rollout cannot prerender
// new sitemaps from an older deployment's descriptions/URL snapshot.
const getAvailableProducts = unstable_cache(async (): Promise<Product[]> => {
  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_available", true)
    .order("created_at", { ascending: false });

  if (error || !data) throw new Error("The product catalog could not be loaded.");
  return data.map(mapRow);
}, ["public-product-catalog", "image-metadata-v1"], { revalidate: 60, tags: ["public-products"] });

export const getProducts = cache(async (): Promise<Product[]> => {
  if (!supabaseConfigured) return loadFallbackProducts();
  return getAvailableProducts();
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
