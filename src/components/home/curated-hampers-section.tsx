"use client";

import { ResponsiveImage } from "@/components/responsive-image";
import { getProductImage } from "@/lib/product-image";
import Link from "next/link";
import { useState } from "react";
import { CraftOrnament } from "@/components/home/craft-ornament";
import { getProductPath } from "@/lib/catalog";
import type { Product } from "@/types/product";
import atmosphere from "./home-atmosphere.module.css";

const occasions = [
  { title: "Birthdays & anniversaries", text: "A personal note, a familiar memory, a keepsake picked just for them." },
  { title: "Weddings & return gifts", text: "A little piece of Kumaon to share with the people who celebrate with you." },
  { title: "Festivals & celebrations", text: "Warm colours and meaningful gifts for the moments that bring everyone together." },
  { title: "Teams & thoughtful thank-yous", text: "Talk to us about gifting for your team, clients or a special gathering." },
];

export function CuratedHampersSection({ product }: { product?: Product }) {
  const [failed, setFailed] = useState(false);
  const image = product ? getProductImage(product) : undefined;
  return (
    <section className={`heritage-gifting ${atmosphere.gifting}`}>
      <div className="heritage-shell heritage-gifting__grid">
        <div className="heritage-gifting__visual">
          <div className="heritage-gifting__ornament" data-home-float aria-hidden="true"><CraftOrnament className={atmosphere.ornamentGraphic} /></div>
          {product && image?.src && !failed ? (
            <div className={atmosphere.giftProduct} data-home-reveal="gifting-product" onFocusCapture={event => { event.currentTarget.dataset.homeImmediate = "true"; }}>
            <Link prefetch={false} href={getProductPath(product)} className="heritage-gifting__photo">
              <div className="heritage-gifting__image"><ResponsiveImage src={image.cardSrc} alt={image.alt} fill sizes="(max-width: 767px) calc(100vw - 52px), 420px" className="object-contain" onError={() => setFailed(true)} /></div>
              <span>{product.name}</span>
            </Link>
            </div>
          ) : <p className="heritage-gifting__fallback">For someone<br /><em>who feels like home.</em></p>}
        </div>
        <div data-home-reveal="gifting-copy">
          <p className="craft-eyebrow">The joy of giving</p>
          <h2>More than a gift.<br /><em>A little belonging.</em></h2>
          <p className="heritage-gifting__intro">Thoughtful hampers with keepsakes, personal touches and the warmth of Kumaon. Tell us who it is for. We’ll help you find the right fit.</p>
          <div className="heritage-occasions">{occasions.map(item => <details key={item.title}><summary>{item.title}<span aria-hidden="true">+</span></summary><p>{item.text}</p></details>)}</div>
          <Link prefetch={false} href="/curated-hampers" className="craft-button craft-button--light">Explore curated hampers</Link>
        </div>
      </div>
    </section>
  );
}
