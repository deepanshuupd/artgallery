import { JsonLd } from "@/components/seo/json-ld";
import { getProductPath } from "@/lib/catalog";
import { getSiteUrl } from "@/lib/site";
import type { Product } from "@/types/product";

/** Describe the same published products that are visible in the collection. */
export function CollectionSchema({ products, path, name, description }: {
  products: Product[]; path: string; name: string; description: string;
}) {
  const url = `${getSiteUrl()}${path}`;
  const unique = [...new Map(products.map(product => [getProductPath(product), product])).values()];
  return <JsonLd data={{
    "@context": "https://schema.org", "@type": "CollectionPage", "@id": `${url}#collection`,
    url, name, description, isPartOf: { "@id": `${getSiteUrl()}#website` },
    mainEntity: {
      "@type": "ItemList", numberOfItems: unique.length,
      itemListElement: unique.map((product, index) => ({
        "@type": "ListItem", position: index + 1,
        name: product.name.trim(), url: `${getSiteUrl()}${getProductPath(product)}`,
      })),
    },
  }} />;
}
