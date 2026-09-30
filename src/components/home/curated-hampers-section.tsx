"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { CraftOrnament } from "@/components/home/craft-ornament";
import { getProductPath } from "@/lib/catalog";
import type { Product } from "@/types/product";

const occasions = [
  { title: "Birthdays & anniversaries", text: "A personal note, a familiar memory, a keepsake picked just for them." },
  { title: "Weddings & return gifts", text: "A little piece of Kumaon to share with the people who celebrate with you." },
  { title: "Festivals & celebrations", text: "Warm colours and meaningful gifts for the moments that bring everyone together." },
  { title: "Teams & thoughtful thank-yous", text: "Talk to us about gifting for your team, clients or a special gathering." },
];

export function CuratedHampersSection({ product }: { product?: Product }) {
  const [failed, setFailed] = useState(false);
  return (
    <section className="heritage-gifting">
      <div className="heritage-shell heritage-gifting__grid">
        <div className="heritage-gifting__visual">
          <CraftOrnament className="heritage-gifting__ornament" />
          {product?.image && !failed ? (
            <Link href={getProductPath(product)} className="heritage-gifting__photo">
              <div className="heritage-gifting__image"><Image src={product.image} alt={product.name} fill sizes="(max-width: 767px) 85vw, 40vw" className="object-contain" onError={() => setFailed(true)} /></div>
              <span>{product.name}</span>
            </Link>
          ) : <p className="heritage-gifting__fallback">For someone<br /><em>who feels like home.</em></p>}
        </div>
        <div>
          <p className="craft-eyebrow">The joy of giving</p>
          <h2>More than a gift.<br /><em>A little belonging.</em></h2>
          <p className="heritage-gifting__intro">Thoughtful hampers with keepsakes, personal touches and the warmth of Kumaon. Tell us who it is for. We’ll help you find the right fit.</p>
          <div className="heritage-occasions">{occasions.map(item => <details key={item.title}><summary>{item.title}<span aria-hidden="true">+</span></summary><p>{item.text}</p></details>)}</div>
          <Link href="/curated-hampers" className="craft-button craft-button--light">Explore curated hampers</Link>
        </div>
      </div>
    </section>
  );
}
