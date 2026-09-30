"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { ProductCategory } from "@/types/product";

const collections: { name: ProductCategory; label: string; note: string; action: string }[] = [
  { name: "Keychains", label: "Pahadi keychains", note: "A little reminder of home, wherever you go.", action: "Shop keychains" },
  { name: "Frames", label: "Aipan & frames", note: "The colours of Kumaon, for your favourite corner.", action: "Shop frames" },
  { name: "Fridge Magnets", label: "Fridge magnets", note: "A little piece of the hills in your everyday.", action: "Shop magnets" },
  { name: "Personalized Gifts", label: "Personalised gifts", note: "Their name. Your memories. Something to keep.", action: "Find a gift" },
];

function CollectionCard({ collection, image }: { collection: typeof collections[number]; image?: string }) {
  const [failed, setFailed] = useState(false);
  return (
    <Link href={`/collection?category=${encodeURIComponent(collection.name)}`} className="heritage-category">
      <div className={`heritage-category__photo${collection.name === "Fridge Magnets" ? " heritage-category__photo--magnets" : ""}`}>
        {image && !failed ? <Image src={image} alt={collection.label} fill sizes="(max-width: 767px) 50vw, (max-width: 1023px) 45vw, 25vw" className={collection.name === "Fridge Magnets" ? "object-cover" : "object-contain"} onError={() => setFailed(true)} /> : <span className="heritage-category__fallback">{collection.label}</span>}
      </div>
      <div className="heritage-category__copy">
        <h3>{collection.label}</h3>
        <p>{collection.note}</p>
        <span className="heritage-category__action">{collection.action}</span>
      </div>
    </Link>
  );
}

export function FeaturedCollections({ images }: { images: Partial<Record<ProductCategory, string>> }) {
  return (
    <section className="heritage-section heritage-shell" aria-labelledby="collections-title">
      <div className="craft-section-heading">
        <div><p className="craft-eyebrow">Little things. Lasting connections.</p><h2 id="collections-title">Find your piece of <em>Kumaon.</em></h2></div>
        <Link href="/collection" className="craft-text-link">Shop all pieces</Link>
      </div>
      <div className="heritage-categories">{collections.map(collection => <CollectionCard key={collection.name} collection={collection} image={images[collection.name]} />)}</div>
    </section>
  );
}
