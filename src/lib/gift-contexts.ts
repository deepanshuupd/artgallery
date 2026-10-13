import type { Product } from "@/types/product";
import { getProductPath } from "@/lib/catalog";

// Editorial groupings describe shopping occasions, not interchangeable products.
// Resolve against the published catalogue so links disappear with removed pieces.
export const giftContexts = [
  {
    id: "devotional-gifts", title: "For a devotional corner",
    description: "Om temple bells for a home mandir, a Ram Lalla idol for a desk or dashboard, or a finger counter for mantra chanting. Choose the piece that fits their practice and check the listed size and order quantity.",
    paths: ["/kumaoni-gifts/set-of-2-om-mandir-bells", "/kumaoni-gifts/ram-lalla-dashboard-idol", "/kumaoni-gifts/mantra-chant-counter"],
  },
  {
    id: "rakhi-gifts", title: "For Rakhi, with a personal note",
    description: "Compare a handmade MDF rakhi, roli-chawal for the ceremony and an alcohol-free ittar bottle in your preferred fragrance. A ready-made Rakhi hamper is another option; check its contents and confirm the available Rakhi design with Sneha.",
    paths: ["/kumaoni-gifts/handmade-rakhii", "/kumaoni-gifts/roli-chawal", "/kumaoni-gifts/premium-ittar", "/curated-hampers/rakhii-hamper"],
  },
  {
    id: "wedding-gifts", title: "For weddings & little thank-yous",
    description: "Barati and Ladkiwale brooches help your wedding group find each other. For gifts to take home, compare a Pichwai jar combo or a customisable accessories hamper, then confirm contents, quantities and the event date.",
    paths: ["/kumaoni-gifts/weeding-brooch-collection", "/curated-hampers/pichwai-jar-gift-combo", "/curated-hampers/curated-hamper"],
  },
  {
    id: "everyday-keepsakes", title: "A keepsake for their keys",
    description: "Choose a familiar Pahadi character, or a metal-alloy Guardian Bell keychain with an evil eye charm. Compare the photographs and available finishes before picking a small gift for their everyday journeys.",
    paths: ["/pahadi-keychains/guardian-bell-keychain", "/pahadi-keychains/pahadi-ladka-keychain", "/pahadi-keychains/pahadi-girl-keychain"],
  },
  {
    id: "pahadi-keepsakes", title: "For a connection to the hills",
    description: "A cotton Pahadi topi for cultural occasions, a Pahadi keychain to carry or an Uttarakhand fridge magnet to display. Think about how they will use it, then choose the regional detail that feels familiar.",
    paths: ["/kumaoni-gifts/traditional-pahadi-topii", "/pahadi-keychains/pahadi-ladka-keychain", "/uttarakhand-souvenirs/i-uttarakhand-fridge-magnet"],
  },
] as const;

export function getGiftContexts(products: Product[]) {
  const published = new Map<string, Product>();
  for (const product of products) {
    const path = getProductPath(product);
    if (product.published !== false && !published.has(path)) published.set(path, product);
  }
  return giftContexts.map(context => ({
    ...context,
    products: context.paths.flatMap(path => {
      const product = published.get(path);
      return product ? [product] : [];
    }),
  })).filter(context => context.products.length > 0);
}

export function getProductGiftContext(product: Product, products: Product[]) {
  const path = getProductPath(product);
  const context = getGiftContexts(products).find(item => item.products.some(piece => getProductPath(piece) === path));
  if (!context) return undefined;
  const alternatives = context.products.filter(piece => getProductPath(piece) !== path);
  return alternatives.length ? { ...context, products: alternatives } : undefined;
}
