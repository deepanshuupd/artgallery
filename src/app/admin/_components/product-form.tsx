"use client";

import { useRouter } from "next/navigation";
import { useId, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { ProductCategory } from "@/types/product";

const CATEGORIES: ProductCategory[] = [
  "Keychains",
  "Frames",
  "Fridge Magnets",
  "Personalized Gifts",
  "Curated Hampers",
];

const MAX_IMAGES = 5;

interface FormValues {
  name: string;
  category: ProductCategory;
  price: string;
  original_price: string;
  description: string;
  story: string;
  whatsapp_message: string;
  is_featured: boolean;
  is_available: boolean;
  image_url: string;
  image_urls: string[];
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
  const fieldId = useId();
  const id = (name: string) => `${fieldId}-${name}`;

  const initialImages =
    initial?.image_urls ?? (initial?.image_url ? [initial.image_url] : []);

  const [values, setValues] = useState<FormValues>({
    name: initial?.name ?? "",
    category: initial?.category ?? "Keychains",
    price: initial?.price ?? "",
    original_price: initial?.original_price ?? "",
    description: initial?.description ?? "",
    story: initial?.story ?? "",
    whatsapp_message: initial?.whatsapp_message ?? "",
    is_featured: initial?.is_featured ?? false,
    is_available: initial?.is_available ?? true,
    image_url: initialImages[0] ?? "",
    image_urls: initialImages,
    details: initial?.details ?? [""],
  });

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function set<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function syncImages(images: string[]) {
    const nextImages = images.slice(0, MAX_IMAGES);
    set("image_urls", nextImages);
    set("image_url", nextImages[0] ?? "");
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
      values.details.filter((_, currentIndex) => currentIndex !== index),
    );
  }

  function removeImage(index: number) {
    syncImages(values.image_urls.filter((_, currentIndex) => currentIndex !== index));
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    setUploading(true);
    setError("");

    const supabase = createClient();
    const remainingSlots = MAX_IMAGES - values.image_urls.length;
    const filesToUpload = files.slice(0, Math.max(remainingSlots, 0));

    if (filesToUpload.length === 0) {
      setError(`You can upload up to ${MAX_IMAGES} images.`);
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
      return;
    }

    const uploadedUrls: string[] = [];

    for (const file of filesToUpload) {
      const ext = file.name.split(".").pop();
      const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(filename, file, { upsert: true });

      if (uploadError) {
        setError("Image upload failed: " + uploadError.message);
        setUploading(false);
        if (fileRef.current) fileRef.current.value = "";
        return;
      }

      const { data } = supabase.storage.from("product-images").getPublicUrl(filename);
      uploadedUrls.push(data.publicUrl);
    }

    syncImages([...values.image_urls, ...uploadedUrls]);
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      name: values.name,
      category: values.category,
      price: parseFloat(values.price),
      original_price: values.original_price
        ? parseFloat(values.original_price)
        : null,
      description: values.description,
      story: values.story,
      whatsapp_message: values.whatsapp_message,
      is_featured: values.is_featured,
      is_available: values.is_available,
      image_url: values.image_url,
      image_urls: values.image_urls,
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

      <div>
        <p className="mb-1 block text-sm font-medium text-stone-700">
          Product Images
        </p>
        <div className="space-y-4">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="hidden"
          />
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading || values.image_urls.length >= MAX_IMAGES}
              className="rounded-md border border-stone-300 bg-white px-4 py-2 text-sm text-stone-700 hover:bg-stone-50 disabled:opacity-50"
            >
              {uploading
                ? "Uploading…"
                : `Choose Images (${values.image_urls.length}/${MAX_IMAGES})`}
            </button>
            <p className="text-xs text-stone-500">
              Upload up to {MAX_IMAGES} photos for one product.
            </p>
          </div>

          {values.image_urls.length > 0 && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {values.image_urls.map((url, index) => (
                <div
                  key={url}
                  className="relative overflow-hidden rounded-md border border-stone-200 bg-stone-50"
                >
                  <img
                    src={url}
                    alt={`Product ${index + 1}`}
                    className="h-24 w-full object-cover"
                  />
                  {index === 0 && (
                    <span className="absolute left-2 top-2 rounded-full bg-stone-900 px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-white">
                      Main
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute right-2 top-2 rounded-full bg-white/90 px-2 py-1 text-[10px] font-medium text-stone-700 shadow"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}

          {values.image_url && (
            <p className="truncate text-xs text-stone-400">
              Primary image: {values.image_url}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label
            className="mb-1 block text-sm font-medium text-stone-700"
            htmlFor={id("name")}
          >
            Name *
          </label>
          <input
            id={id("name")}
            required
            value={values.name}
            onChange={(e) => set("name", e.target.value)}
            className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
          />
        </div>
        <div>
          <label
            className="mb-1 block text-sm font-medium text-stone-700"
            htmlFor={id("category")}
          >
            Category *
          </label>
          <select
            id={id("category")}
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

      <div className="grid max-w-md gap-4 sm:grid-cols-2">
        <div>
          <label
            className="mb-1 block text-sm font-medium text-stone-700"
            htmlFor={id("price")}
          >
            Price (₹) *
          </label>
          <input
            id={id("price")}
            required
            type="number"
            min="0"
            step="1"
            value={values.price}
            onChange={(e) => set("price", e.target.value)}
            className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
          />
        </div>

        <div>
          <label
            className="mb-1 block text-sm font-medium text-stone-700"
            htmlFor={id("original_price")}
          >
            Original price (MRP)
          </label>
          <input
            id={id("original_price")}
            type="number"
            min="0"
            step="1"
            value={values.original_price}
            onChange={(e) => set("original_price", e.target.value)}
            className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
          />
          <p className="mt-1 text-xs text-stone-500">
            Leave blank if the product isn&apos;t on sale. Must be higher than the
            price to show a discount.
          </p>
        </div>
      </div>

      <div>
        <label
          className="mb-1 block text-sm font-medium text-stone-700"
          htmlFor={id("description")}
        >
          Description *
        </label>
        <textarea
          id={id("description")}
          required
          rows={3}
          value={values.description}
          onChange={(e) => set("description", e.target.value)}
          className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
        />
      </div>

      <div>
        <label
          className="mb-1 block text-sm font-medium text-stone-700"
          htmlFor={id("story")}
        >
          Product Story
        </label>
        <textarea
          id={id("story")}
          rows={3}
          value={values.story}
          onChange={(e) => set("story", e.target.value)}
          className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
        />
      </div>

      <div>
        <label
          className="mb-1 block text-sm font-medium text-stone-700"
          htmlFor={id("whatsapp_message")}
        >
          WhatsApp Order Message
        </label>
        <textarea
          id={id("whatsapp_message")}
          rows={3}
          value={values.whatsapp_message}
          onChange={(e) => set("whatsapp_message", e.target.value)}
          placeholder="Hi, I'd like to order this product…"
          className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
        />
      </div>

      <div>
        <p className="mb-1 block text-sm font-medium text-stone-700">
          Product Details (bullet points)
        </p>
        <div className="space-y-2">
          {values.details.map((detail, i) => (
            <div key={i} className="flex gap-2">
              <input
                aria-label={`Product detail ${i + 1}`}
                value={detail}
                onChange={(e) => setDetail(i, e.target.value)}
                placeholder={`Detail ${i + 1}`}
                className="flex-1 rounded-md border border-stone-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
              />
              {values.details.length > 1 && (
                <button
                  type="button"
                  aria-label={`Remove detail ${i + 1}`}
                  onClick={() => removeDetail(i)}
                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-stone-400 hover:text-red-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-400"
                >
                  <svg
                    aria-hidden="true"
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.8"
                    viewBox="0 0 24 24"
                  >
                    <path d="M6 6l12 12" />
                    <path d="M18 6L6 18" />
                  </svg>
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