"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/types/product";
import { getProductPath } from "@/lib/catalog";
import { formatPrice, getDiscount } from "@/lib/pricing";

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const [failed, setFailed] = useState(false);
  const discount = getDiscount(product.price, product.originalPrice);
  return <article className="store-product">
    <Link prefetch={false} href={getProductPath(product)} className="store-product__link">
      <div className="store-product__image">
        {product.image && !failed ? <Image
          src={product.image} alt="" fill priority={priority}
          fetchPriority={priority ? "high" : undefined} quality={70}
          sizes="(max-width: 767px) calc((100vw - 56px) / 2), (max-width: 1199px) calc((100vw - 104px) / 2), 384px"
          className="object-contain" onError={() => setFailed(true)}
        /> : <div className="store-product__placeholder"><span>Kumaonरंग</span><small>Photo coming soon</small></div>}
        {discount && <span className="store-product__badge">{discount.percent}% off</span>}
      </div>
      <div className="store-product__copy">
        <p className="store-product__category">{product.category}</p>
        <h3>{product.name.trim()}</h3>
        <div className="store-product__price"><span>{formatPrice(product.price)}</span>{discount && <del>{formatPrice(discount.originalPrice)}</del>}</div>
        <p className="store-product__description">{product.description}</p>
        <span className="store-product__action">Explore this piece<span aria-hidden="true">›</span></span>
      </div>
    </Link>
  </article>;
}
