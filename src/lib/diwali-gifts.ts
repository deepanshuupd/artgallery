import { searchProducts } from "@/lib/product-search";
import type { Product } from "@/types/product";

// Groups are searches over the live catalogue, so the page follows stock
// without anyone editing it. Each piece appears once, in its first group.
const groups = [
  { id: "doorway", title: "For the doorway", note: "Bandarwars to hang at the main door or puja room.", queries: ["bandarwar"] },
  { id: "light", title: "Diyas & candles", note: "Diyas and candles to light at home or tuck into a gift.", queries: ["diya", "candle"] },
  { id: "puja", title: "For the puja corner", note: "Temple bells, roli-chawal and devotional keepsakes.", queries: ["temple bell", "roli", "chalisa", "potli", "idol"] },
  { id: "aipan", title: "Aipan for the home temple", note: "Hand-painted Aipan Ganesh and Om pieces for the wall.", queries: ["ganesh aipan", "om aipan"] },
  { id: "gifts", title: "Ready to give", note: "Hampers and combos to bring when you visit.", queries: ["hamper", "combo"] },
] as const;

// Rakhi pieces share candles and roli with Diwali listings but belong to another festival;
// a piece also named for pooja (roli-chawal) still fits.
const isRakhiOnly = (name: string) => /rakh/i.test(name) && !/poo?ja|puja/i.test(name);

export function getDiwaliGroups(products: Product[]) {
  const shown = new Set<string>();
  return groups.map(group => {
    const pieces: Product[] = [];
    for (const product of group.queries.flatMap(query => searchProducts(products, query) ?? [])) {
      if (shown.has(product.id) || product.published === false || isRakhiOnly(product.name)) continue;
      shown.add(product.id);
      pieces.push(product);
    }
    return { ...group, products: pieces };
  }).filter(group => group.products.length > 0);
}
