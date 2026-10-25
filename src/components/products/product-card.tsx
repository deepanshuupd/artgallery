"use client";

import { ResponsiveImage } from "@/components/responsive-image";
import { getProductImage } from "@/lib/product-image";
import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/types/product";
import { getProductPath } from "@/lib/catalog";
import { formatPrice, getDiscount } from "@/lib/pricing";
import { AddToCartButton } from "@/components/cart/cart-controls";
import { getMinimumPieceQuantity } from "@/lib/product-highlights";
import { CameraIcon } from "@/components/icons";

export function ProductCard({ product, priority = false, sizes = "(max-width: 767px) calc((100vw - 56px) / 2), (max-width: 1199px) calc((100vw - 104px) / 2), 384px" }: { product: Product; priority?: boolean; sizes?: string }) {
  const [failed, setFailed] = useState(false);
  const discount = getDiscount(product.price, product.originalPrice);
  const image = getProductImage(product);
  return <article className="store-product">
    <Link prefetch={false} href={getProductPath(product)} className="store-product__link">
      <div className="store-product__image">
        {image.src && !failed ? <ResponsiveImage
          src={image.cardSrc} alt={image.alt} fill priority={priority}
          fetchPriority={priority ? "high" : undefined}
          sizes={sizes}
          className="object-contain" onError={() => setFailed(true)}
        /> : <div className="store-product__placeholder"><CameraIcon className="h-7 w-7" /><span>Take a closer look</span><small>{image.src ? "Photo unavailable" : "Photo on request"}</small></div>}
        {discount && <span className="store-product__badge">{discount.percent}% off</span>}
      </div>
      <div className="store-product__copy">
        <p className="store-product__category">{product.category}</p>
        <h3>{product.name.trim()}</h3>
        <div className="store-product__price"><span>{formatPrice(product.price)}</span>{discount && <del>{formatPrice(discount.originalPrice)}</del>}</div>
        {product.inStock === false && <p className="store-product__category store-product__availability">Currently out of stock</p>}
        <p className="store-product__description">{product.description}</p>
        <span className="store-product__action">View product</span>
      </div>
    </Link>
    {image.src ? <AddToCartButton productId={product.id} productName={product.name} quantity={getMinimumPieceQuantity(product)} unavailable={product.inStock === false} compact /> : <Link prefetch={false} href={`${getProductPath(product)}#product-order-title`} className="store-product__photo-request">Request a photo</Link>}
  </article>;
}
