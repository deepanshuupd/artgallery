import Link from "next/link";
import { requireAdminUser } from "@/lib/admin";
import { DeleteProductButton } from "./_components/delete-product-button";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  await requireAdminUser();
  let products: Array<Record<string, unknown>> = [];

  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data } = await supabase
      .from("products")
      .select("id, name, category, price, is_featured, is_available, image_url")
      .order("created_at", { ascending: false });
    products = data ?? [];
  } catch {}

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl text-stone-900">Products</h1>
          <p className="mt-1 text-sm text-stone-500">
            {products.length} product{products.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex w-full items-center justify-center rounded-md bg-stone-800 px-4 py-2 text-sm font-medium text-white hover:bg-stone-700 sm:w-auto"
        >
          + Add Product
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="rounded-xl border border-dashed border-stone-300 bg-white py-16 text-center">
          <p className="text-stone-500">No products yet.</p>
          <Link
            href="/admin/products/new"
            className="mt-3 inline-block text-sm text-stone-700 underline"
          >
            Add your first product
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-4 md:hidden">
            {products.map((p) => (
              <article
                key={p.id as string}
                className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  {p.image_url ? (
                    <img
                      src={p.image_url as string}
                      alt=""
                      className="h-16 w-16 shrink-0 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="h-16 w-16 shrink-0 rounded-lg bg-stone-100" />
                  )}

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h2 className="truncate font-medium text-stone-900">
                          {p.name as string}
                        </h2>
                        <p className="mt-1 text-sm text-stone-500">
                          {p.category as string}
                        </p>
                      </div>

                      <p className="shrink-0 text-sm font-medium text-stone-900">
                        ₹{(p.price as number).toLocaleString("en-IN")}
                      </p>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {(p.is_featured as boolean) && (
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-700">
                          Featured
                        </span>
                      )}
                      {!(p.is_available as boolean) && (
                        <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-600">
                          Hidden
                        </span>
                      )}
                      {(p.is_available as boolean) && !(p.is_featured as boolean) && (
                        <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">
                          Live
                        </span>
                      )}
                    </div>

                    <div className="mt-4 flex items-center gap-4 text-sm">
                      <Link
                        href={`/admin/products/${p.id}/edit`}
                        className="font-medium text-stone-600 hover:text-stone-900"
                      >
                        Edit
                      </Link>
                      <DeleteProductButton id={p.id as string} />
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="hidden overflow-hidden rounded-xl border border-stone-200 bg-white md:block">
            <table className="w-full text-sm">
            <thead className="border-b border-stone-100 bg-stone-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-stone-600">
                  Product
                </th>
                <th className="px-4 py-3 text-left font-medium text-stone-600">
                  Category
                </th>
                <th className="px-4 py-3 text-left font-medium text-stone-600">
                  Price
                </th>
                <th className="px-4 py-3 text-left font-medium text-stone-600">
                  Status
                </th>
                <th className="px-4 py-3 text-right font-medium text-stone-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {products.map((p) => (
                <tr key={p.id as string} className="hover:bg-stone-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {p.image_url ? (
                        <img
                          src={p.image_url as string}
                          alt=""
                          className="h-10 w-10 rounded-md object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-md bg-stone-100" />
                      )}
                      <span className="font-medium text-stone-800">
                        {p.name as string}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-stone-600">
                    {p.category as string}
                  </td>
                  <td className="px-4 py-3 text-stone-600">
                    ₹{(p.price as number).toLocaleString("en-IN")}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      {(p.is_featured as boolean) && (
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-700">
                          Featured
                        </span>
                      )}
                      {!(p.is_available as boolean) && (
                        <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-600">
                          Hidden
                        </span>
                      )}
                      {(p.is_available as boolean) && !(p.is_featured as boolean) && (
                        <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">
                          Live
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/admin/products/${p.id}/edit`}
                        className="text-stone-500 hover:text-stone-800"
                      >
                        Edit
                      </Link>
                      <DeleteProductButton id={p.id as string} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </>
      )}
    </div>
  );
}
