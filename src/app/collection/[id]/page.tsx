import { notFound, permanentRedirect } from "next/navigation";

import { getProductPath } from "@/lib/catalog";
import { getProductById } from "@/lib/products";

export const dynamic = "force-dynamic";

type ProductDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProductDetailsPage({
  params,
}: ProductDetailsPageProps) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) notFound();

  permanentRedirect(getProductPath(product));
}
