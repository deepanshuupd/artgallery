import type { Product, ProductCategory } from "@/types/product";
import { getProductPath } from "@/lib/catalog";
import { getProductImage } from "@/lib/product-image";

// Editorial choices resolve against the live catalogue. Never substitute an
// unrelated product, expose a draft, or advertise an unavailable sample.
const giftIdeas = [
  {
    category: "Keychains", occasion: "For an everyday reminder",
    title: "Pahadi keychains", href: "/pahadi-keychains", link: "All keychains",
    description: "Choose a familiar Pahadi character for their keys, bag or next journey away from home.",
    paths: ["/pahadi-keychains/pahadi-girl-keychain", "/pahadi-keychains/pahadi-ladka-keychain", "/pahadi-keychains/i-uttarakhand-couple-keychain"],
  },
  {
    category: "Frames", occasion: "For a favourite corner",
    title: "Aipan & heritage frames", href: "/aipan-frames", link: "All frames",
    description: "For a family home or a new beginning. Choose the artwork to suit their space and beliefs.",
    paths: ["/aipan-frames/golu-devta-aipan-frame", "/aipan-frames/om-aipan-wall-decor", "/aipan-frames/handmade-aipan-wall-decor-with-pichora-background"],
  },
  {
    category: "Fridge Magnets", occasion: "For a memory of the hills",
    title: "Souvenir magnets", href: "/uttarakhand-souvenirs", link: "All magnets",
    description: "A little Uttarakhand in their everyday. A small keepsake for a fridge or another magnetic surface.",
    paths: ["/uttarakhand-souvenirs/pahadi-happy-couple-fridge-magnet", "/uttarakhand-souvenirs/i-uttarakhand-fridge-magnet", "/uttarakhand-souvenirs/gloss-fridge-magnet"],
  },
  {
    category: "Personalized Gifts", occasion: "For something that is theirs",
    title: "Personalised gifts", href: "/kumaoni-gifts", link: "Gifts & keepsakes",
    description: "Mark a new home with a nameplate. Confirm the wording and available custom options before ordering.",
    paths: ["/kumaoni-gifts/customised-aipan-nameplate"],
  },
  {
    category: "Curated Hampers", occasion: "For a gift with a few parts",
    title: "Curated hampers", href: "/curated-hampers", link: "All hampers",
    description: "A few thoughtful things, together. Compare each hamper’s contents as well as its presentation.",
    paths: ["/curated-hampers/pichwai-jar-gift-combo", "/curated-hampers/curated-hamper", "/curated-hampers/the-happiness-box"],
  },
] satisfies Array<{
  category: ProductCategory; occasion: string; title: string; href: string;
  link: string; description: string; paths: string[];
}>;

export function getGiftGuideIdeas(products: Product[]) {
  const eligible = new Map<string, Product>();
  for (const product of products) {
    const path = getProductPath(product);
    if (product.published !== false && product.inStock !== false &&
      product.name.trim() && Number.isFinite(product.price) && product.price > 0 &&
      getProductImage(product).src && !eligible.has(path)) {
      eligible.set(path, product);
    }
  }
  return giftIdeas.map(idea => ({
    ...idea,
    product: idea.paths.map(path => eligible.get(path))
      .find(product => product?.category === idea.category),
  }));
}

export function getGiftGuideCover(products: Product[]) {
  const ideas = getGiftGuideIdeas(products);
  return ideas.find(idea => idea.category === "Frames" && idea.product)?.product ??
    ideas.find(idea => idea.product)?.product;
}
