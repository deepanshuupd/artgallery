"use client";

import Link from "next/link";
import { useDeferredValue, useEffect, useId, useRef, useState } from "react";
import { SearchIcon } from "@/components/icons";
import { ProductCard } from "@/components/products/product-card";
import { collections } from "@/lib/collections";
import { searchProducts, searchShortcuts } from "@/lib/product-search";
import { generateGeneralInquiryLink } from "@/lib/whatsapp";
import type { Product, ProductCategory } from "@/types/product";
import styles from "./product-showcase.module.css";

type ProductShowcaseProps = {
  products: Product[]; eyebrow: string; title: string; showCategoryFilter?: boolean;
  initialCategory?: string; searchPlaceholder?: string;
  categoryCounts?: Partial<Record<ProductCategory, number>>;
  compactTools?: boolean;
};

export function ProductShowcase({ products, eyebrow, title, showCategoryFilter = false, initialCategory, searchPlaceholder = "Search the collection", categoryCounts, compactTools = false }: ProductShowcaseProps) {
  const searchId = useId();
  const sortId = useId();
  const filtersRef = useRef<HTMLElement>(null);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("newest");
  const deferredQuery = useDeferredValue(query);
  const term = deferredQuery.trim().toLowerCase();
  const validCategory = collections.some(item => item.category === initialCategory);
  const activeCategory = validCategory ? initialCategory : undefined;
  const catalog = showCategoryFilter ? products.filter(product => product.category !== "Curated Hampers") : products;
  const counts = categoryCounts ?? Object.fromEntries(collections.map(collection => [collection.category, catalog.filter(product => product.category === collection.category).length]));
  const allCount = Object.values(counts).reduce<number>((total, count) => total + (count ?? 0), 0);
  // A search on the whole shop also finds hampers, which otherwise have their own page.
  const scope = activeCategory ? catalog.filter(product => product.category === activeCategory) : term ? products : catalog;
  const filtered = searchProducts(scope, term) ?? scope;
  // Search results arrive ranked by relevance, which "Newest first" keeps.
  const sorted = [...filtered].sort((a, b) => sort === "price-low" ? a.price - b.price : sort === "price-high" ? b.price - a.price : sort === "featured" ? Number(b.featured) - Number(a.featured) : 0);
  const shortcuts = <div className={styles.shortcuts} role="group" aria-label="Quick searches">
    {searchShortcuts.map(shortcut => <button key={shortcut.query} type="button" aria-pressed={term === shortcut.query} onClick={() => setQuery(term === shortcut.query ? "" : shortcut.query)}>{shortcut.label}</button>)}
  </div>;

  useEffect(() => {
    const filters = filtersRef.current;
    const selected = filters?.querySelector<HTMLElement>('[aria-current="page"]');
    if (!filters || !selected) return;
    // Reveal the selected category horizontally without moving the page.
    const bounds = filters.getBoundingClientRect();
    const item = selected.getBoundingClientRect();
    if (item.right > bounds.right) filters.scrollLeft += item.right - bounds.right;
    else if (item.left < bounds.left) filters.scrollLeft -= bounds.left - item.left;
  }, [activeCategory]);

  const tools = <div className="store-tools">
    <label className="store-search" htmlFor={searchId}>
      <span className="sr-only">Search products</span><SearchIcon className="h-4 w-4 shrink-0" />
      <input id={searchId} type="search" placeholder={searchPlaceholder} value={query} onChange={event => setQuery(event.target.value)} />
    </label>
    <label className="store-sort" htmlFor={sortId}><span className="sr-only">Sort products</span><select id={sortId} value={sort} onChange={event => setSort(event.target.value)}>
      <option value="newest">Newest first</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option><option value="featured">Featured first</option>
    </select></label>
  </div>;
  const results = <div className="store-results"><p className="craft-eyebrow">{eyebrow}</p><p role="status" aria-live="polite" aria-atomic="true">{sorted.length} {sorted.length === 1 ? "piece" : "pieces"}{term ? " found" : " to explore"}</p></div>;

  return <section id="shop-catalogue" className="store-catalog" data-category-navigation={showCategoryFilter ? "true" : undefined} aria-label={title}>
    {showCategoryFilter && <nav ref={filtersRef} className="store-filters" aria-label="Shop categories">
      <p className="store-filters__heading">Browse by type</p>
      <Link prefetch={false} scroll={false} href="/collection" aria-current={!activeCategory ? "page" : undefined}><span>All pieces</span><span className="store-filters__count">{allCount}<span className="sr-only"> pieces</span></span></Link>
      {collections.map(collection => <Link key={collection.slug} prefetch={false} scroll={false} href={`/${collection.slug}`} aria-current={activeCategory === collection.category ? "page" : undefined}><span>{collection.label}</span><span className="store-filters__count">{counts[collection.category] ?? 0}<span className="sr-only"> pieces</span></span></Link>)}
    </nav>}
    <div className="store-catalog-main">
    <div className={`store-toolbar ${compactTools ? styles.compactToolbar : ""}`}>
      {compactTools ? <>{results}<details className={styles.toolsDisclosure}><summary>Search &amp; sort<span aria-hidden="true">+</span></summary>{tools}</details></> : <>{tools}{!activeCategory && shortcuts}{results}</>}
    </div>
    <h2 className="sr-only">{title}</h2>
    <div className="store-product-grid" aria-busy={query !== deferredQuery}>{sorted.map((product, index) => <ProductCard key={product.id} product={product} priority={index === 0 && !term} sizes={showCategoryFilter ? "(max-width: 767px) calc((100vw - 54px) / 2), (max-width: 1023px) calc((100vw - 102px) / 2), (max-width: 1279px) calc((100vw - 320px) / 3), 300px" : undefined} />)}</div>
    {sorted.length === 0 && <div className="store-empty">
      <h3>{term ? "Let’s find your kind of keepsake." : "No pieces here right now."}</h3>
      <p>{term ? activeCategory ? "Try a different word, browse all pieces, or ask Sneha for a little help choosing." : "Try a quick search above, a different word, or ask Sneha for a little help choosing." : activeCategory && allCount > 0 ? "There are no pieces in this category right now. Explore another category, or ask Sneha about availability." : "There are no pieces to browse just now. You can still speak to Sneha about availability."}</p>
      <div className="craft-actions">{query && <button className="craft-button" type="button" onClick={() => setQuery("")}>Clear search</button>}{activeCategory && allCount > 0 && <Link prefetch={false} href="/collection" className="craft-text-link">Browse all pieces</Link>}<a className="craft-text-link" href={generateGeneralInquiryLink()} target="_blank" rel="noopener noreferrer">Ask Sneha on WhatsApp</a></div>
    </div>}
    </div>
  </section>;
}
