import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProductDetailView } from "@/components/products/product-detail-view";
import { getProductById, products } from "@/lib/products";

type ProductDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function generateStaticParams() {
  return products.map((product) => ({
    id: product.id,
  }));
}

export async function generateMetadata({
  params,
}: ProductDetailsPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) {
    return {
      title: "Product Not Found | Art Gallery by Sneha",
    };
  }

  return {
    title: `${product.name} | Art Gallery by Sneha`,
    description: product.description,
  };
}

export default async function ProductDetailsPage({
  params,
}: ProductDetailsPageProps) {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) {
    notFound();
  }

  return <ProductDetailView product={product} />;
}
