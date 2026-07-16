import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

async function getStats() {
  try {
    const supabase = await createClient();
    const [{ count: total }, { count: featured }, { count: unavailable }] =
      await Promise.all([
        supabase
          .from("products")
          .select("*", { count: "exact", head: true }),
        supabase
          .from("products")
          .select("*", { count: "exact", head: true })
          .eq("is_featured", true),
        supabase
          .from("products")
          .select("*", { count: "exact", head: true })
          .eq("is_available", false),
      ]);
    return { total: total ?? 0, featured: featured ?? 0, unavailable: unavailable ?? 0 };
  } catch {
    return { total: 0, featured: 0, unavailable: 0 };
  }
}

export default async function AdminDashboard() {
  const stats = await getStats();

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-stone-900">Dashboard</h1>
        <p className="mt-1 text-sm text-stone-500">
          Manage your gallery products and content.
        </p>
      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-3 gap-4">
        {[
          { label: "Total Products", value: stats.total },
          { label: "Featured", value: stats.featured },
          { label: "Hidden / Unavailable", value: stats.unavailable },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-stone-200 bg-white p-5"
          >
            <p className="text-sm text-stone-500">{stat.label}</p>
            <p className="mt-1 font-serif text-3xl text-stone-900">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link
          href="/admin/products"
          className="flex flex-col gap-1 rounded-xl border border-stone-200 bg-white p-6 transition hover:border-stone-300 hover:shadow-sm"
        >
          <span className="font-medium text-stone-800">Manage Products</span>
          <span className="text-sm text-stone-500">
            Add, edit or remove products from the gallery.
          </span>
        </Link>
        <Link
          href="/admin/products/new"
          className="flex flex-col gap-1 rounded-xl border border-stone-800 bg-stone-800 p-6 transition hover:bg-stone-700"
        >
          <span className="font-medium text-white">Add New Product</span>
          <span className="text-sm text-stone-300">
            Upload a new artwork or keepsake to the shop.
          </span>
        </Link>
      </div>
    </div>
  );
}
