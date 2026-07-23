import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdminUser } from "@/lib/admin";
import { ProductForm } from "../../../_components/product-form";

type EditProductPageProps = {
  params: Promise<{ id: string }>;
};

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  await requireAdminUser();
  const { id } = await params;

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (!product) notFound();

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin/products"
          className="text-sm text-stone-500 hover:text-stone-700"
        >
          ← Back to Products
        </Link>
        <h1 className="mt-2 font-serif text-3xl text-stone-900">
          Edit Product
        </h1>
        <p className="mt-1 text-sm text-stone-500">{product.name}</p>
      </div>

      <div className="rounded-xl border border-stone-200 bg-white p-6">
        <ProductForm
          mode="edit"
          productId={id}
          initial={{
            name: product.name,
            category: product.category,
            price: String(product.price),
            description: product.description,
            story: product.story,
            whatsapp_message: product.whatsapp_message,
            is_featured: product.is_featured,
            is_available: product.is_available,
            image_url: product.image_url,
            image_urls: product.image_urls ?? (product.image_url ? [product.image_url] : []),
            details: product.details ?? [""],
          }}
        />
      </div>
    </div>
  );
}
