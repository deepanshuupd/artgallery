import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProductDetailView } from "@/components/products/product-detail-view";
import { getProductByPublicSlug } from "@/lib/catalog";
import { getProducts } from "@/lib/products";

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

  if (!product) return { title: "Product not found" };

  return {
    title: product.name,
    description: product.description,
  };
}

export default async function ProductDetailsPage(props: ProductDetailsPageProps) {
  const product = await findProduct(props);
  if (!product) notFound();

  return <ProductDetailView product={product} />;
}
