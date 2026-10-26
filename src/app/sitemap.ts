import type { MetadataRoute } from "next";

import { getProducts } from "@/lib/products";
import { getProductPath } from "@/lib/catalog";
import { getSiteUrl } from "@/lib/site";
import { collections } from "@/lib/collections";
import { getProductImage, getProductImageUrls } from "@/lib/product-image";
import { getGiftGuideCover, getGiftGuideIdeas } from "@/lib/gift-guide";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();

  const staticRoutes = [
    "",
    "/collection",
    "/curated-hampers",
    "/build-your-hamper",
    "/bulk-orders",
    "/uttarakhand-gifts",
    "/aipan-art",
    "/about",
    "/customer-stories",
    "/contact",
    "/how-to-order",
    "/shipping-policy",
    "/returns-policy",
  ];
  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${siteUrl}${route}`,
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.8,
  }));

  let productEntries: MetadataRoute.Sitemap = [];
  try {
    const products = await getProducts();
    const ideas = getGiftGuideIdeas(products);
    const guideCover = getGiftGuideCover(products);
    const guideEntry = staticEntries.find(entry => entry.url === `${siteUrl}/uttarakhand-gifts`);
    if (guideEntry && guideCover) {
      guideEntry.images = [new URL(getProductImage(guideCover).src, siteUrl).href];
    }
    staticEntries.push(...collections
      .filter(collection => products.some(product => product.category === collection.category))
      .map(collection => {
        const representative = ideas.find(idea => idea.category === collection.category)?.product ??
          products.find(product => product.category === collection.category && getProductImage(product).src);
        return { url: `${siteUrl}/${collection.slug}`, changeFrequency: "weekly" as const, priority: 0.8,
          ...(representative ? { images: [new URL(getProductImage(representative).src, siteUrl).href] } : {}),
        };
      }));
    productEntries = products.map((product) => ({
      url: `${siteUrl}${getProductPath(product)}`,
      changeFrequency: "weekly",
      priority: 0.6,
      images: getProductImageUrls(product).map(src => new URL(src, siteUrl).href),
    }));
  } catch {
    // If products can't be loaded, still return the static routes.
  }

  // Multiple catalogue records may currently share a public product slug.
  // List each public URL once without changing existing product routes.
  // Match the product router's first record, not a different duplicate's gallery.
  const unique = new Map<string, MetadataRoute.Sitemap[number]>();
  for (const entry of [...staticEntries, ...productEntries]) {
    if (!unique.has(entry.url)) unique.set(entry.url, entry);
  }
  return [...unique.values()];
}
