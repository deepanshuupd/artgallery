import Link from "next/link";
import { ProductForm } from "../../_components/product-form";

export default function NewProductPage() {
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
          Add New Product
        </h1>
      </div>

      <div className="rounded-xl border border-stone-200 bg-white p-6">
        <ProductForm mode="create" />
      </div>
    </div>
  );
}
