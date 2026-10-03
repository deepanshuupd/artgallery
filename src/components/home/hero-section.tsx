"use client";

import Image from "next/image";
import { getProductImage } from "@/lib/product-image";
import Link from "next/link";
import { useRef, useState } from "react";
import { CraftOrnament } from "@/components/home/craft-ornament";
import { getProductPath } from "@/lib/catalog";
import { formatPrice } from "@/lib/pricing";
import type { Product } from "@/types/product";
import { useHomeAtmosphere } from "./use-home-atmosphere";
import atmosphere from "./home-atmosphere.module.css";

export function HeroSection({ featuredProduct }: { featuredProduct?: Product }) {
  const [failed, setFailed] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const image = featuredProduct ? getProductImage(featuredProduct) : undefined;
  useHomeAtmosphere(heroRef);

  return (
    <section ref={heroRef} className={`heritage-hero ${atmosphere.hero}`}>
      <div className="heritage-shell heritage-hero__grid">
        <div className="heritage-hero__copy" data-home-reveal="hero-copy">
          <p className="craft-eyebrow"><span aria-hidden="true">✦</span> Pithoragarh, Uttarakhand</p>
          <h1>The hills have a way<br />{" "}of <em>staying with you.</em></h1>
          <p className="heritage-hero__intro">In the colours of Aipan. In a familiar Pahadi face. In the little things that make a place feel like home.</p>
          <p className="heritage-hero__description">Discover Aipan-inspired art, Pahadi keepsakes and personal gifts from Kumaon — for your home, and the people who feel like it.</p>
          <div className="craft-actions">
            <Link prefetch={false} href="/collection" className="craft-button">Find your keepsake</Link>
            <Link prefetch={false} href="/curated-hampers" className="craft-text-link">Explore gift hampers</Link>
          </div>
          <div className="heritage-hero__note"><span lang="hi">पहाड़ों से, प्यार के साथ</span><span>From the hills, with love.</span></div>
        </div>

        <div className="heritage-hero__art">
          <div className="heritage-hero__ornament" data-home-float aria-hidden="true"><CraftOrnament className={atmosphere.ornamentGraphic} /></div>
          <div className={atmosphere.heroProduct} data-home-reveal="hero-product" onFocusCapture={event => { event.currentTarget.dataset.homeImmediate = "true"; }}>
          <Link prefetch={false} className="heritage-artwork" href={featuredProduct ? getProductPath(featuredProduct) : "/collection"}>
            <div className="heritage-artwork__photo">
              {image?.src && !failed ? (
                <Image src={image.cardSrc} alt={image.alt} fill priority fetchPriority="high" quality={70} sizes="(max-width: 375px) calc(100vw - 78px), (max-width: 767px) 298px, (max-width: 1199px) 28vw, 316px" className="object-contain" onError={() => setFailed(true)} />
              ) : <div className="heritage-artwork__fallback">Colour. Craft. Kumaon.</div>}
            </div>
            <div className="heritage-artwork__caption">
              <div><span className="craft-eyebrow">A piece of our hills</span><h2>{featuredProduct?.name.trim() ?? "A keepsake with a story"}</h2></div>
              <span className="heritage-artwork__price">{featuredProduct ? formatPrice(featuredProduct.price) : "Explore"}</span>
            </div>
          </Link>
          </div>
          <span className="heritage-hero__signature" lang="hi">रंग जो घर ले आएँ।</span>
        </div>
      </div>
      <div className="craft-ribbon"><span>Aipan-inspired art</span><span aria-hidden="true">✦</span><span>Pahadi keepsakes</span><span aria-hidden="true">✦</span><span>Personal gifting</span></div>
    </section>
  );
}
