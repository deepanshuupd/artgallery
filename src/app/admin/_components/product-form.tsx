"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { ProductCategory } from "@/types/product";

const CATEGORIES: ProductCategory[] = [
  "Keychains",
  "Frames",
  "Fridge Magnets",
  "Personalized Gifts",
  "Curated Hampers",
];

interface FormValues {
  name: string;
  category: ProductCategory;
  price: string;
  description: string;
  story: string;
  whatsapp_message: string;
  is_featured: boolean;
  is_available: boolean;
  image_url: string;
  details: string[];
}

interface ProductFormProps {
  mode: "create" | "edit";
  productId?: string;
  initial?: Partial<FormValues>;
}

export function ProductForm({ mode, productId, initial }: ProductFormProps) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [values, setValues] = useState<FormValues>({
    name: initial?.name ?? "",
    category: initial?.category ?? "Keychains",
    price: initial?.price ?? "",
    description: initial?.description ?? "",
    story: initial?.story ?? "",
    whatsapp_message: initial?.whatsapp_message ?? "",
    is_featured: initial?.is_featured ?? false,
    is_available: initial?.is_available ?? true,
    image_url: initial?.image_url ?? "",
    details: initial?.details ?? [""],
  });

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState(initial?.image_url ?? "");

  function set<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function setDetail(index: number, value: string) {
    const next = [...values.details];
    next[index] = value;
    set("details", next);
  }

  function addDetail() {
    set("details", [...values.details, ""]);
  }

  function removeDetail(index: number) {
    set(
      "details",
      values.details.filter((_, i) => i !== index),
    );
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    const supabase = createClient();
    const ext = file.name.split(".").pop();
    const filename = `${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(filename, file, { upsert: true });

    if (uploadError) {
      setError("Image upload failed: " + uploadError.message);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage
      .from("product-images")
      .getPublicUrl(filename);

    set("image_url", data.publicUrl);
    setImagePreview(data.publicUrl);
    setUploading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      name: values.name,
      category: values.category,
      price: parseFloat(values.price),
      description: values.description,
      story: values.story,
      whatsapp_message: values.whatsapp_message,
      is_featured: values.is_featured,
      is_available: values.is_available,
      image_url: values.image_url,
      details: values.details.filter(Boolean),
    };

    const supabase = createClient();

    if (mode === "create") {
      const { error: dbError } = await supabase.from("products").insert(payload);
      if (dbError) {
        setError(dbError.message);
        setSaving(false);
        return;
      }
    } else {
      const { error: dbError } = await supabase
        .from("products")
        .update(payload)
        .eq("id", productId);
      if (dbError) {
        setError(dbError.message);
        setSaving(false);
        return;
      }
    }

    router.push("/admin/products");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Image */}
      <div>
        <label className="mb-1 block text-sm font-medium text-stone-700">
          Product Image
        </label>
        <div className="flex items-start gap-4">
          {imagePreview && (
            <img
              src={imagePreview}
              alt="preview"
              className="h-24 w-24 rounded-md object-cover"
            />
          )}
          <div className="flex-1">
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="rounded-md border border-stone-300 bg-white px-4 py-2 text-sm text-stone-700 hover:bg-stone-50 disabled:opacity-50"
            >
              {uploading ? "Uploading…" : "Choose Image"}
            </button>
            {values.image_url && (
              <p className="mt-1 truncate text-xs text-stone-400">
                {values.image_url}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Name + Category */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">
            Name *
          </label>
          <input
            required
            value={values.name}
            onChange={(e) => set("name", e.target.value)}
            className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">
            Category *
          </label>
          <select
            value={values.category}
            onChange={(e) => set("category", e.target.value as ProductCategory)}
            className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Price */}
      <div className="max-w-xs">
        <label className="mb-1 block text-sm font-medium text-stone-700">
          Price (₹) *
        </label>
        <input
          required
          type="number"
          min="0"
          step="1"
          value={values.price}
          onChange={(e) => set("price", e.target.value)}
          className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
        />
      </div>

      {/* Description */}
      <div>
        <label className="mb-1 block text-sm font-medium text-stone-700">
          Description *
        </label>
        <textarea
          required
          rows={3}
          value={values.description}
          onChange={(e) => set("description", e.target.value)}
          className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
        />
      </div>

      {/* Story */}
      <div>
        <label className="mb-1 block text-sm font-medium text-stone-700">
          Product Story
        </label>
        <textarea
          rows={3}
          value={values.story}
          onChange={(e) => set("story", e.target.value)}
          className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
        />
      </div>

      {/* WhatsApp message */}
      <div>
        <label className="mb-1 block text-sm font-medium text-stone-700">
          WhatsApp Order Message
        </label>
        <textarea
          rows={3}
          value={values.whatsapp_message}
          onChange={(e) => set("whatsapp_message", e.target.value)}
          placeholder="Hi, I'd like to order this product…"
          className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
        />
      </div>

      {/* Details bullets */}
      <div>
        <label className="mb-1 block text-sm font-medium text-stone-700">
          Product Details (bullet points)
        </label>
        <div className="space-y-2">
          {values.details.map((detail, i) => (
            <div key={i} className="flex gap-2">
              <input
                value={detail}
                onChange={(e) => setDetail(i, e.target.value)}
                placeholder={`Detail ${i + 1}`}
                className="flex-1 rounded-md border border-stone-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
              />
              {values.details.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeDetail(i)}
                  className="text-stone-400 hover:text-red-500"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addDetail}
            className="text-sm text-stone-500 hover:text-stone-700"
          >
            + Add detail
          </button>
        </div>
      </div>

      {/* Flags */}
      <div className="flex gap-6">
        <label className="flex cursor-pointer items-center gap-2 text-sm text-stone-700">
          <input
            type="checkbox"
            checked={values.is_featured}
            onChange={(e) => set("is_featured", e.target.checked)}
            className="rounded"
          />
          Featured product
        </label>
        <label className="flex cursor-pointer items-center gap-2 text-sm text-stone-700">
          <input
            type="checkbox"
            checked={values.is_available}
            onChange={(e) => set("is_available", e.target.checked)}
            className="rounded"
          />
          Available for order
        </label>
      </div>

      {/* Submit */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={saving || uploading}
          className="rounded-md bg-stone-800 px-6 py-2 text-sm font-medium text-white transition hover:bg-stone-700 disabled:opacity-50"
        >
          {saving ? "Saving…" : mode === "create" ? "Add Product" : "Save Changes"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-md border border-stone-300 px-6 py-2 text-sm text-stone-600 hover:bg-stone-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
