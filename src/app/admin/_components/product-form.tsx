"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useId, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { prepareProductImages } from "@/lib/product-image-upload";
import { createProductImageStem, getProductImageUrls, normalizeImageMetadata, productCardImage, PRODUCT_IMAGE_UPLOAD_OPTIONS } from "@/lib/product-image";
import { refreshPublicCatalog } from "@/app/admin/actions";
import { ProductStory } from "@/components/products/product-story";
import type { Product, ProductCategory } from "@/types/product";

const CATEGORIES: ProductCategory[] = [
  "Keychains",
  "Frames",
  "Fridge Magnets",
  "Personalized Gifts",
  "Curated Hampers",
];

const MAX_IMAGES = 5;

type ImageMetadataMap = NonNullable<Product["imageMetadata"]>;

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
  is_published: boolean;
  image_url: string;
  image_urls: string[];
  image_metadata: ImageMetadataMap;
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

  const initialImages = getProductImageUrls({ image: initial?.image_url, images: initial?.image_urls });

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
    is_published: initial?.is_published ?? true,
    image_url: initialImages[0] ?? "",
    image_urls: initialImages,
    image_metadata: normalizeImageMetadata(initial?.image_metadata, initialImages),
    details: initial?.details ?? [""],
  });

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function set<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function syncImages(images: string[]) {
    // Preserve any older catalog record with more than the current upload limit.
    const nextImages = images;
    setValues(prev => ({
      ...prev,
      image_urls: nextImages,
      image_url: nextImages[0] ?? "",
      image_metadata: normalizeImageMetadata(prev.image_metadata, nextImages),
    }));
  }

  function setImageMetadata(url: string, field: "alt" | "caption", value: string) {
    setValues(prev => ({
      ...prev,
      image_metadata: { ...prev.image_metadata, [url]: { ...prev.image_metadata[url], [field]: value } },
    }));
  }

  function moveImage(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= values.image_urls.length) return;
    const reordered = [...values.image_urls];
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
    syncImages(reordered);
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

    const productName = values.name.trim();
    if (!productName) {
      setError("Enter the product name before uploading photos so their filenames describe this piece.");
      document.getElementById(id("name"))?.focus();
      if (fileRef.current) fileRef.current.value = "";
      return;
    }

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
    const uploadedMetadata: ImageMetadataMap = {};

    try {
      for (const file of filesToUpload) {
        const variants = await prepareProductImages(file);
        const stem = createProductImageStem(productName, crypto.randomUUID());
        const paths = [`${stem}-card.webp`, `${stem}.webp`];
        // Publish the detail URL only after both files exist.
        const uploadedPaths: string[] = [];
        try {
          for (const [index, variant] of [variants.card, variants.detail].entries()) {
            const { error: uploadError } = await supabase.storage
              .from("product-images")
              .upload(paths[index], variant, PRODUCT_IMAGE_UPLOAD_OPTIONS);
            if (uploadError) throw new Error("Image upload failed: " + uploadError.message);
            uploadedPaths.push(paths[index]);
          }
        } catch (uploadError) {
          if (uploadedPaths.length) await supabase.storage.from("product-images").remove(uploadedPaths);
          throw uploadError;
        }
        const { data } = supabase.storage.from("product-images").getPublicUrl(paths[1]);
        uploadedUrls.push(data.publicUrl);
        uploadedMetadata[data.publicUrl] = {
          alt: productName,
          width: variants.width,
          height: variants.height,
          cardWidth: variants.cardWidth,
          cardHeight: variants.cardHeight,
        };
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Image upload failed.");
    } finally {
      // Merge with the latest fields: editing an existing photo's caption while
      // another photo uploads must not lose that work.
      setValues(prev => {
        const imageUrls = [...prev.image_urls, ...uploadedUrls].slice(0, MAX_IMAGES);
        return {
          ...prev,
          image_urls: imageUrls,
          image_url: imageUrls[0] ?? "",
          image_metadata: normalizeImageMetadata({ ...prev.image_metadata, ...uploadedMetadata }, imageUrls),
        };
      });
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (saving || uploading) return;
    if (!values.name.trim()) {
      setError("Enter the product name before saving this piece.");
      document.getElementById(id("name"))?.focus();
      return;
    }
    setSaving(true);
    setError("");

    const payload = {
      name: values.name.trim(),
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
      is_published: values.is_published,
      image_url: values.image_url,
      image_urls: values.image_urls,
      image_metadata: normalizeImageMetadata(
        Object.fromEntries(values.image_urls.map(url => [url, {
          ...values.image_metadata[url],
          alt: values.image_metadata[url]?.alt?.trim() || values.name.trim(),
        }])),
        values.image_urls,
      ),
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

    // The save has succeeded. A cache-refresh failure must not invite another
    // submission (and a duplicate product); the cache also expires after 60s.
    await refreshPublicCatalog().catch(() => {});
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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700" htmlFor={id("name")}>
            Name *
          </label>
          <input
            id={id("name")}
            required
            disabled={uploading || saving}
            value={values.name}
            onChange={(e) => set("name", e.target.value)}
            className="w-full rounded-md border border-stone-300 px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-stone-400"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700" htmlFor={id("category")}>
            Category *
          </label>
          <select
            id={id("category")}
            disabled={uploading || saving}
            value={values.category}
            onChange={(e) => set("category", e.target.value as ProductCategory)}
            className="min-h-11 w-full rounded-md border border-stone-300 px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-stone-400"
          >
            {CATEGORIES.map((category) => <option key={category} value={category}>{category}</option>)}
          </select>
        </div>
      </div>

      <div>
        <p className="mb-1 block text-sm font-medium text-stone-700">
          Product Images
        </p>
        <div className="space-y-4">
          <input
            ref={fileRef}
            type="file"
            accept="image/*,.heic,.heif,.hif"
            multiple
            onChange={handleImageUpload}
            className="hidden"
          />
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading || saving || !values.name.trim() || values.image_urls.length >= MAX_IMAGES}
              className="min-h-11 rounded-md border border-stone-300 bg-white px-4 py-2 text-sm text-stone-700 hover:bg-stone-50 disabled:opacity-50"
            >
              {uploading
                ? "Uploading…"
                : `Choose Images (${values.image_urls.length}/${MAX_IMAGES})`}
            </button>
            <p className="text-xs text-stone-500">
              {values.name.trim()
                ? `Upload up to ${MAX_IMAGES} photos. Each gets a readable filename and sharp, compressed shop and detail versions.`
                : "Enter the product name first to give your photos descriptive filenames."}
            </p>
          </div>

          {values.image_urls.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {values.image_urls.map((url, index) => (
                <div
                  key={url}
                  className="overflow-hidden rounded-md border border-stone-200 bg-stone-50"
                >
                  <div className="relative">
                    <Image
                      src={productCardImage(url)}
                      alt={values.image_metadata[url]?.alt?.trim() || values.name.trim() || "Product photograph"}
                      className="h-40 w-full object-contain"
                      height={96}
                      width={160}
                    />
                    {index === 0 && (
                      <span className="absolute left-2 top-2 rounded-full bg-stone-900 px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-white">
                        Main
                      </span>
                    )}
                    <button
                      type="button"
                      disabled={uploading || saving}
                      aria-label={`Remove photograph ${index + 1}`}
                      onClick={() => removeImage(index)}
                      className="absolute right-2 top-2 min-h-11 rounded-md bg-white/90 px-3 py-1 text-xs font-medium text-stone-700 shadow disabled:opacity-50"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="space-y-3 border-t border-stone-200 p-3">
                    <div>
                      <label htmlFor={id(`image-alt-${index}`)} className="mb-1 block text-xs font-medium text-stone-700">
                        Photo {index + 1} description (alt text)
                      </label>
                      <textarea
                        id={id(`image-alt-${index}`)}
                        aria-describedby={id("image-description-help")}
                        rows={2}
                        maxLength={300}
                        disabled={saving}
                        value={values.image_metadata[url]?.alt ?? ""}
                        placeholder={values.name.trim() || "Describe what is visible in this photograph"}
                        onChange={(event) => setImageMetadata(url, "alt", event.target.value)}
                        className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-stone-400"
                      />
                    </div>
                    <div>
                      <label htmlFor={id(`image-caption-${index}`)} className="mb-1 block text-xs font-medium text-stone-700">
                        Photo caption (optional)
                      </label>
                      <textarea
                        id={id(`image-caption-${index}`)}
                        rows={2}
                        maxLength={500}
                        disabled={saving}
                        value={values.image_metadata[url]?.caption ?? ""}
                        placeholder="A short note to show below this product photograph"
                        onChange={(event) => setImageMetadata(url, "caption", event.target.value)}
                        className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-stone-400"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button type="button" aria-label={`Move photograph ${index + 1} earlier`} disabled={index === 0 || uploading || saving}
                        onClick={() => moveImage(index, -1)} className="min-h-11 flex-1 rounded-md border border-stone-300 bg-white px-2 text-xs text-stone-700 disabled:opacity-40">Move earlier</button>
                      <button type="button" aria-label={`Move photograph ${index + 1} later`} disabled={index === values.image_urls.length - 1 || uploading || saving}
                        onClick={() => moveImage(index, 1)} className="min-h-11 flex-1 rounded-md border border-stone-300 bg-white px-2 text-xs text-stone-700 disabled:opacity-40">Move later</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <p id={id("image-description-help")} className="text-xs leading-relaxed text-stone-500">
            Describe the visible design and view in natural words. Use only details you can verify, not a list of search keywords. If left blank, the product name is used. Captions are optional and appear beneath the photo on its product page.
          </p>

          {values.image_url && (
            <p className="truncate text-xs text-stone-400">
              Primary image: {values.image_url}
            </p>
          )}
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
        <p className="mt-1 text-xs leading-relaxed text-stone-500">
          The first sentence introduces the piece near its price. The complete description appears in the About this piece accordion and is used for search metadata.
        </p>
      </div>

      <div>
        <label
          className="mb-1 block text-sm font-medium text-stone-700"
          htmlFor={id("story")}
        >
          Product story / closing note (optional)
        </label>
        <textarea
          id={id("story")}
          aria-describedby={id("story-help")}
          rows={3}
          value={values.story}
          onChange={(e) => set("story", e.target.value)}
          placeholder="What inspired this piece? Tell its story in your own words."
          className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
        />
        <p id={id("story-help")} className="mt-1 text-xs leading-relaxed text-stone-500">
          Saved separately for each product. Appears below the photographs and product details, replacing the fixed brand tagline. Leave blank to hide that section. This also applies to gift hampers.
        </p>
        {values.story.trim() && <div className="mt-4 rounded-xl border border-stone-200 bg-[#fffaf1] px-5 pb-6">
          <p className="pt-4 text-xs font-medium text-stone-500">Storefront preview</p>
          <ProductStory story={values.story} />
        </div>}
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
            id={id("is-available")}
            type="checkbox"
            checked={values.is_available}
            onChange={(e) => set("is_available", e.target.checked)}
            className="rounded"
          />
          Currently in stock
        </label>
        <label className="flex cursor-pointer items-center gap-2 text-sm text-stone-700">
          <input id={id("is-published")} type="checkbox" checked={values.is_published}
            onChange={(e) => set("is_published", e.target.checked)} className="rounded" />
          Published in the shop
        </label>
      </div>
      <p className="text-xs leading-relaxed text-stone-500">
        Out-of-stock products keep their page and show their stock status. Unpublish to hide a listing.
        Product URLs stay the same when you edit a name or category.
      </p>

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
