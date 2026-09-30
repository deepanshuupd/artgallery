"use client";

import Link from "next/link";
import { useDeferredValue, useId, useState } from "react";
import { SearchIcon } from "@/components/icons";
import { ProductCard } from "@/components/products/product-card";
import { collections } from "@/lib/collections";
import { generateGeneralInquiryLink } from "@/lib/whatsapp";
import type { Product } from "@/types/product";

type ProductShowcaseProps = {
  products: Product[]; eyebrow: string; title: string; showCategoryFilter?: boolean;
  initialCategory?: string; searchPlaceholder?: string;
};

export function ProductShowcase({ products, eyebrow, title, showCategoryFilter = false, initialCategory, searchPlaceholder = "Search the collection" }: ProductShowcaseProps) {
  const searchId = useId();
  const sortId = useId();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("newest");
  const deferredQuery = useDeferredValue(query);
  const term = deferredQuery.trim().toLowerCase();
  const validCategory = [...collections.map(item => item.category), "Curated Hampers"].includes(initialCategory ?? "");
  const activeCategory = validCategory ? initialCategory : undefined;
  const filtered = products.filter(product => (!activeCategory || product.category === activeCategory) && (!term || `${product.name} ${product.category} ${product.description}`.toLowerCase().includes(term)));
  const sorted = [...filtered].sort((a, b) => sort === "price-low" ? a.price - b.price : sort === "price-high" ? b.price - a.price : sort === "featured" ? Number(b.featured) - Number(a.featured) : 0);

  return <section className="store-catalog" aria-label={title}>
    <div className="store-toolbar">
      {showCategoryFilter && <nav className="store-filters" aria-label="Shop categories">
        <Link prefetch={false} href="/collection" aria-current={!activeCategory ? "page" : undefined}>All pieces</Link>
        {collections.map(collection => <Link key={collection.slug} prefetch={false} href={`/${collection.slug}`} aria-current={activeCategory === collection.category ? "page" : undefined}>{collection.label}</Link>)}
        <Link prefetch={false} href="/curated-hampers" aria-current={activeCategory === "Curated Hampers" ? "page" : undefined}>Gift hampers</Link>
      </nav>}
      <div className="store-tools">
        <label className="store-search" htmlFor={searchId}>
          <span className="sr-only">Search products</span><SearchIcon className="h-4 w-4 shrink-0" />
          <input id={searchId} type="search" placeholder={searchPlaceholder} value={query} onChange={event => setQuery(event.target.value)} />
        </label>
        <label className="store-sort" htmlFor={sortId}><span className="sr-only">Sort products</span><select id={sortId} value={sort} onChange={event => setSort(event.target.value)}>
          <option value="newest">Newest first</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option><option value="featured">Featured first</option>
        </select></label>
      </div>
      <div className="store-results"><p className="craft-eyebrow">{eyebrow}</p><p role="status" aria-live="polite" aria-atomic="true">{sorted.length} {sorted.length === 1 ? "piece" : "pieces"}{term ? " found" : " to explore"}</p></div>
    </div>
    <h2 className="sr-only">{title}</h2>
    <div className="store-product-grid" aria-busy={query !== deferredQuery}>{sorted.map((product, index) => <ProductCard key={product.id} product={product} priority={index === 0 && !term} />)}</div>
    {sorted.length === 0 && <div className="store-empty">
      <h3>{products.length ? "Let’s find your kind of keepsake." : "Our collection will be back shortly."}</h3>
      <p>{products.length ? "Try a different word, or ask Sneha for a little help choosing." : "We couldn’t load the pieces just now. You can still speak to us directly."}</p>
      <div className="craft-actions">{query && <button className="craft-button" type="button" onClick={() => setQuery("")}>Clear search</button>}<a className="craft-text-link" href={generateGeneralInquiryLink()} target="_blank" rel="noopener noreferrer">Ask Sneha on WhatsApp</a></div>
    </div>}
  </section>;
}
