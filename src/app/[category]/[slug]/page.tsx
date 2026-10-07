import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ProductDetailView } from "@/components/products/product-detail-view";
import { ProductCard } from "@/components/products/product-card";
import { getCategoryPath, getProductPath, getProductByPublicSlug } from "@/lib/catalog";
import { getProducts } from "@/lib/products";
import { pageMetadata } from "@/lib/seo";
import { getSiteUrl } from "@/lib/site";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { getProductImage } from "@/lib/product-image";
import { getProductImageObjects } from "@/lib/product-image-schema";
import forest from "@/components/products/forest-storefront.module.css";
import guideStyles from "@/components/products/collection-guide.module.css";

export const dynamic = "force-dynamic";

type ProductDetailsPageProps = {
  params: Promise<{
    category: string;
    slug: string;
  }>;
};

async function findProduct({ params }: ProductDetailsPageProps) {
  const [{ category, slug }, products] = await Promise.all([params, getProducts()]);
  return { product: getProductByPublicSlug(products, category, slug), products };
}

export async function generateMetadata(
  props: ProductDetailsPageProps,
): Promise<Metadata> {
  const { product } = await findProduct(props);

  if (!product) return { title: "Product not found", robots: { index: false } };

  const image = getProductImage(product);
  return pageMetadata({ title: product.name.trim(), description: product.description.trim() || `${product.name.trim()}. ${product.details.join(" ") || "View photos, price and product details, and enquire with Sneha at KumaonRang, Pithoragarh."}`, path: getProductPath(product), image: image.src || undefined, imageAlt: image.alt, imageWidth: image.width, imageHeight: image.height });
}

export default async function ProductDetailsPage(props: ProductDetailsPageProps) {
  const { product, products } = await findProduct(props);
  if (!product) notFound();

  const url = `${getSiteUrl()}${getProductPath(product)}`;
  const images = getProductImageObjects(product, getSiteUrl());
  const related = products.filter(item => item.category === product.category && item.id !== product.id).slice(0, 3);
  const isAipan = /aipan/i.test(`${product.name} ${product.description}`);
  const isRegional = isAipan || /pahadi|kumaon|uttarakhand/i.test(product.name);
  return <div className={`${forest.surface} ${forest.productSurface}`}>
    <div className="heritage-shell"><Breadcrumbs items={[{ label: "Home", href: "/" }, { label: product.category, href: `/${getCategoryPath(product.category)}` }, { label: product.name.trim(), href: getProductPath(product) }]} /></div>
    <JsonLd data={{
      "@context": "https://schema.org", "@type": "Product", "@id": `${url}#product`,
      name: product.name.trim(), description: product.description, url,
      ...(product.id ? { productID: product.id } : {}),
      category: product.category,
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
    <ProductDetailView product={product}>
      {related.length > 0 && <section className={forest.related} aria-labelledby="related-products-title">
        <header>
          <div><h2 id="related-products-title">Related products</h2></div>
          <Link prefetch={false} href={`/${getCategoryPath(product.category)}`}>See all {product.category.toLowerCase()}</Link>
        </header>
        <div className="store-product-grid">{related.map(item => <ProductCard key={item.id} product={item} />)}</div>
      </section>}
      {isRegional && <nav className={guideStyles.productGuides} aria-label="Product buying guides">
        <p>More about these keepsakes</p>
        {isAipan && <Link prefetch={false} href="/aipan-art">Learn about Aipan art</Link>}
        <Link prefetch={false} href="/uttarakhand-gifts">Uttarakhand gift ideas</Link>
      </nav>}
    </ProductDetailView>
  </div>;
}
