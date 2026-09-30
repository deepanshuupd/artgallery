import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProductDetailView } from "@/components/products/product-detail-view";
import { getCategoryPath, getProductPath, getProductByPublicSlug } from "@/lib/catalog";
import { getProducts } from "@/lib/products";
import { pageMetadata } from "@/lib/seo";
import { getSiteUrl } from "@/lib/site";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";

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

  return pageMetadata({ title: product.name.trim(), description: `${product.name.trim()}. ${product.description || "Discover keepsakes from KumaonRang, Pithoragarh, Uttarakhand. View product details and enquire with Sneha."}`, path: getProductPath(product), image: product.image || undefined });
}

export default async function ProductDetailsPage(props: ProductDetailsPageProps) {
  const product = await findProduct(props);
  if (!product) notFound();

  const url = `${getSiteUrl()}${getProductPath(product)}`;
  return <>
    <div className="heritage-shell"><Breadcrumbs items={[{ label: "Home", href: "/" }, { label: product.category, href: `/${getCategoryPath(product.category)}` }, { label: product.name.trim(), href: getProductPath(product) }]} /></div>
    <JsonLd data={{
      "@context": "https://schema.org", "@type": "Product", "@id": `${url}#product`,
      name: product.name.trim(), description: product.description, url,
      ...(product.images.length ? { image: product.images } : product.image ? { image: [product.image] } : {}),
      brand: { "@type": "Brand", name: "KumaonRang" },
      offers: { "@type": "Offer", url, priceCurrency: "INR", price: product.price, availability: "https://schema.org/InStock", seller: { "@type": "Organization", "@id": `${getSiteUrl()}#business`, name: "KumaonRang" } },
    }} />
    <ProductDetailView product={product} />
  </>;
}
