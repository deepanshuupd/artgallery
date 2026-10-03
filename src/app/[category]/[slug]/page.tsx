import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProductDetailView } from "@/components/products/product-detail-view";
import { getCategoryPath, getProductPath, getProductByPublicSlug } from "@/lib/catalog";
import { getProducts } from "@/lib/products";
import { pageMetadata } from "@/lib/seo";
import { getSiteUrl } from "@/lib/site";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { getProductImage } from "@/lib/product-image";
import { getProductImageObjects } from "@/lib/product-image-schema";

export const dynamic = "force-dynamic";

type ProductDetailsPageProps = {
  params: Promise<{
    category: string;
    slug: string;
  }>;
};

async function findProduct({ params }: ProductDetailsPageProps) {
  const [{ category, slug }, products] = await Promise.all([params, getProducts()]);
  return getProductByPublicSlug(products, category, slug);
}

export async function generateMetadata(
  props: ProductDetailsPageProps,
): Promise<Metadata> {
  const product = await findProduct(props);

  if (!product) return { title: "Product not found", robots: { index: false } };

  const image = getProductImage(product);
  return pageMetadata({ title: product.name.trim(), description: `${product.name.trim()}. ${product.description || "Discover keepsakes from KumaonRang, Pithoragarh, Uttarakhand. View product details and enquire with Sneha."}`, path: getProductPath(product), image: image.src || undefined, imageAlt: image.alt, imageWidth: image.width, imageHeight: image.height });
}

export default async function ProductDetailsPage(props: ProductDetailsPageProps) {
  const product = await findProduct(props);
  if (!product) notFound();

  const url = `${getSiteUrl()}${getProductPath(product)}`;
  const images = getProductImageObjects(product, getSiteUrl());
  return <>
    <div className="heritage-shell"><Breadcrumbs items={[{ label: "Home", href: "/" }, { label: product.category, href: `/${getCategoryPath(product.category)}` }, { label: product.name.trim(), href: getProductPath(product) }]} /></div>
    <JsonLd data={{
      "@context": "https://schema.org", "@type": "Product", "@id": `${url}#product`,
      name: product.name.trim(), description: product.description, url,
      ...(images.length ? { image: images } : {}),
      brand: { "@type": "Brand", name: "KumaonRang" },
      offers: { "@type": "Offer", url, priceCurrency: "INR", price: product.price,
        ...(typeof product.inStock === "boolean" ? { availability: product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock" } : {}),
        seller: { "@type": "Organization", "@id": `${getSiteUrl()}#business`, name: "KumaonRang" } },
    }} />
    <JsonLd data={{
      "@context": "https://schema.org", "@type": "WebPage", "@id": `${url}#webpage`,
      url, name: product.name.trim(), mainEntity: { "@id": `${url}#product` },
      ...(images.length ? { primaryImageOfPage: images[0] } : {}),
    }} />
    <ProductDetailView product={product} />
  </>;
}
