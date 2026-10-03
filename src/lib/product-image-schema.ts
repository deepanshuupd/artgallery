import type { Product } from "../types/product";
import { getProductImage, getProductImageUrls } from "./product-image";

/** Match visible product photographs; only include dimensions we actually know. */
export function getProductImageObjects(product: Product, siteUrl: string) {
  return getProductImageUrls(product).map(src => {
    const image = getProductImage(product, src);
    const url = new URL(image.src, siteUrl).href;
    return {
      "@type": "ImageObject" as const,
      url,
      contentUrl: url,
      name: image.alt,
      description: image.alt,
      ...(image.caption ? { caption: image.caption } : {}),
      ...(image.width && image.height ? { width: image.width, height: image.height } : {}),
    };
  });
}
