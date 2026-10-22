import { JsonLd } from "@/components/seo/json-ld";
import { getProductPath } from "@/lib/catalog";
import { getSiteUrl } from "@/lib/site";
import type { Product } from "@/types/product";
import { getProductImage } from "@/lib/product-image";

/** Describe the same published products that are visible in the collection. */
export function CollectionSchema({ products, path, name, description }: {
  products: Product[]; path: string; name: string; description: string;
}) {
  const url = `${getSiteUrl()}${path}`;
  const byPath = new Map<string, Product>();
  for (const product of products) {
    const path = getProductPath(product);
    if (product.published !== false && !byPath.has(path)) byPath.set(path, product);
  }
  const unique = [...byPath.values()];
  const cover = unique.map(product => getProductImage(product)).find(image => image.src);
  return <JsonLd data={{
    "@context": "https://schema.org", "@type": "CollectionPage", "@id": `${url}#collection`,
    url, name, description, isPartOf: { "@id": `${getSiteUrl()}#website` },
    ...(cover ? { primaryImageOfPage: {
      "@type": "ImageObject", contentUrl: new URL(cover.src, getSiteUrl()).href,
      url: new URL(cover.src, getSiteUrl()).href, name: cover.alt,
      ...(cover.width && cover.height ? { width: cover.width, height: cover.height } : {}),
    } } : {}),
    mainEntity: {
      "@type": "ItemList", numberOfItems: unique.length,
      itemListElement: unique.map((product, index) => ({
        "@type": "ListItem", position: index + 1,
        name: product.name.trim(), url: `${getSiteUrl()}${getProductPath(product)}`,
        ...(getProductImage(product).src ? { image: new URL(getProductImage(product).src, getSiteUrl()).href } : {}),
      })),
    },
  }} />;
}
