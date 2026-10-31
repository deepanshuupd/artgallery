import { getProductPath } from "@/lib/catalog";
import { collections } from "@/lib/collections";
import { giftContexts } from "@/lib/gift-contexts";
import type { Product } from "@/types/product";

// Words people search with, mapped to words that appear in listings.
// Kept to occasions and spellings seen in the catalogue; nothing here describes a product.
const synonyms: Record<string, string[]> = {
  wedding: ["wedding", "barati", "bride", "ladkiwale", "brooch", "shaadi"],
  shaadi: ["wedding", "barati", "bride", "ladkiwale", "brooch"],
  marriage: ["wedding", "barati", "bride", "ladkiwale", "brooch"],
  rakhi: ["rakhi", "raksha", "roli"],
  rakshabandhan: ["rakhi", "raksha"],
  puja: ["pooja", "puja", "mandir", "temple", "devotional", "diya", "roli", "bhajan", "chalisa"],
  pooja: ["pooja", "puja", "mandir", "temple", "devotional", "diya", "roli", "bhajan", "chalisa"],
  devotional: ["devotional", "pooja", "mandir", "temple", "bhajan", "chalisa", "idol"],
  diwali: ["diwali", "festive", "diya", "candle", "bandarwar", "lakshmi", "laxmi"],
  festive: ["festive", "festival", "diwali", "diya", "candle", "bandarwar"],
  housewarming: ["housewarming", "bandarwar", "nameplate", "entrance", "door"],
  toran: ["bandarwar"],
  door: ["door", "bandarwar", "entrance", "nameplate"],
  keyring: ["keychain", "key"],
  key: ["keychain", "key"],
  magnet: ["magnet"],
  personalised: ["personalised", "personalized", "customised", "customized", "custom", "photo"],
  personalized: ["personalised", "personalized", "customised", "customized", "custom", "photo"],
  customised: ["personalised", "personalized", "customised", "customized", "custom"],
  customized: ["personalised", "personalized", "customised", "customized", "custom"],
  custom: ["personalised", "personalized", "customised", "customized", "custom"],
  return: ["return"],
  hamper: ["hamper", "combo"],
  attar: ["ittar", "attar"],
  ittar: ["ittar", "attar"],
  cap: ["topi"],
  wall: ["wall", "frame", "hanging"],
  painting: ["aipan", "painted", "artwork"],
};

// Words that describe nearly everything here, so they only help ranking.
const softWords = new Set(["gift", "kumaon", "kumaoni", "pahadi", "pahari", "uttarakhand", "uttrakhand", "handmade", "traditional"]);
const stopWords = new Set(["a", "an", "and", "the", "for", "of", "in", "to", "with", "my", "buy", "online", "from", "rs", "inr", "price"]);
const phrases: [RegExp, string][] = [
  [/\bname\s+plate/g, "nameplate"], [/\bkey\s*rings?\b/g, "keyring"], [/\braksha\s+bandhan\b/g, "rakshabandhan"],
  [/\bhouse\s*warming\b/g, "housewarming"], [/\bgriha\s*pravesh\b/g, "housewarming"], [/\bwall\s+hanging/g, "wall"],
];

// Lowercase, strip accents and emoji, and fold doubled letters and plurals so
// "rakhii", "weeding" and "keychains" meet "rakhi", "wedding" and "keychain".
function fold(word: string) {
  const single = word.replace(/(.)\1+/g, "$1");
  return single.length > 3 && single.endsWith("s") && !single.endsWith("ss") ? single.slice(0, -1) : single;
}
function words(text: string) {
  return text.normalize("NFKD").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim().split(" ").filter(Boolean).map(fold);
}

export type SearchQuery = { terms: string[]; soft: string[]; maxPrice?: number; minPrice?: number };

export function parseSearch(input: string): SearchQuery {
  let text = input.normalize("NFKD").toLowerCase();
  let maxPrice: number | undefined;
  let minPrice: number | undefined;
  text = text.replace(/(?:under|below|less than|upto|up to|within|max|<)\s*(?:rs\.?|₹|inr)?\s*(\d{2,5})/g, (_, amount) => { maxPrice = Number(amount); return " "; });
  text = text.replace(/(?:above|over|more than|min|>)\s*(?:rs\.?|₹|inr)?\s*(\d{2,5})/g, (_, amount) => { minPrice = Number(amount); return " "; });
  for (const [pattern, replacement] of phrases) text = text.replace(pattern, replacement);
  const tokens = words(text).filter(word => !stopWords.has(word));
  return {
    terms: tokens.filter(word => !softWords.has(word) && !/^\d+$/.test(word)),
    soft: tokens.filter(word => softWords.has(word)),
    maxPrice, minPrice,
  };
}

function haystack(product: Product) {
  const label = collections.find(collection => collection.category === product.category)?.label ?? "";
  const path = getProductPath(product);
  // Editorial gift guides tag a few pieces with an occasion their listing may not mention.
  const occasions = giftContexts.filter(context => (context.paths as readonly string[]).includes(path)).map(context => `${context.id} ${context.title}`).join(" ");
  return {
    name: new Set(words(product.name)),
    all: new Set(words(`${product.name} ${product.category} ${label} ${product.description} ${product.details.join(" ")} ${occasions}`)),
  };
}

function has(set: Set<string>, term: string) {
  const options = (synonyms[term] ?? [term]).flatMap(option => words(option));
  for (const word of set) if (options.some(option => option.length < 3 ? word === option : word.startsWith(option))) return true;
  return false;
}

/** Returns matching products ranked by how closely their names match, or undefined for an empty query. */
export function searchProducts(products: Product[], input: string): Product[] | undefined {
  const query = parseSearch(input);
  if (!query.terms.length && !query.soft.length && query.maxPrice === undefined && query.minPrice === undefined) return undefined;
  const scored = products.flatMap((product, index) => {
    if (query.maxPrice !== undefined && product.price > query.maxPrice) return [];
    if (query.minPrice !== undefined && product.price < query.minPrice) return [];
    const text = haystack(product);
    if (!query.terms.every(term => has(text.all, term))) return [];
    if (!query.terms.length && query.soft.length && !query.soft.some(term => has(text.all, term))) return [];
    const score = [...query.terms, ...query.soft].filter(term => has(text.name, term)).length;
    return [{ product, score, index }];
  });
  return scored.sort((a, b) => b.score - a.score || a.index - b.index).map(item => item.product);
}

/** Shortcuts shown beside the search box; each is an ordinary search, so it stays editable. */
export const searchShortcuts = [
  { label: "Wedding", query: "wedding" },
  { label: "Rakhi", query: "rakhi" },
  { label: "Puja & devotional", query: "puja" },
  { label: "Diwali & festive", query: "diwali" },
  { label: "Personalised", query: "personalised" },
  { label: "Under ₹200", query: "under 200" },
  { label: "Under ₹500", query: "under 500" },
] as const;
