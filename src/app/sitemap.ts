import type { MetadataRoute } from "next";

import { getProducts } from "@/lib/products";
import { getSiteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();

  const staticRoutes = ["", "/collection", "/curated-hampers", "/about", "/contact"];
  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${siteUrl}${route}`,
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.8,
  }));

  let productEntries: MetadataRoute.Sitemap = [];
  try {
    const products = await getProducts();
    productEntries = products.map((product) => ({
      url: `${siteUrl}/collection/${product.id}`,
      changeFrequency: "weekly",
      priority: 0.6,
    }));
  } catch {
    // If products can't be loaded, still return the static routes.
  }

  return [...staticEntries, ...productEntries];
}
