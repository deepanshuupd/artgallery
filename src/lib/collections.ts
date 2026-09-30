import type { ProductCategory } from "@/types/product";

export const collections = [
  {
    category: "Keychains", slug: "pahadi-keychains", label: "Pahadi keychains",
    title: "Pahadi Keychains & Kumaoni Keepsakes",
    heading: "A little home, wherever you go.",
    description: "Shop Pahadi keychains inspired by Kumaon, from familiar hill-side characters to personal keepsakes. Discover gifts from Pithoragarh, Uttarakhand.",
    intro: "Familiar faces, little details and memories of the hills. Find a Pahadi keychain for your everyday bag, your keys, or someone who misses home.",
    note: "Choosing your keychain",
    detail: "Explore the photos and details of each piece before ordering. If you have a name, colour or gifting idea in mind, ask Sneha on WhatsApp which custom touches are possible.",
  },
  {
    category: "Frames", slug: "aipan-frames", label: "Aipan & frames",
    title: "Aipan Art Frames & Kumaoni Wall Decor",
    heading: "The colours of Kumaon, at home.",
    description: "Explore Aipan-inspired frames, Pichora-inspired wall decor and personal photo gifts from Pithoragarh. Bring a little Kumaon into your favourite corner.",
    intro: "Aipan-inspired detail, warm Pichora colours and stories worth putting on your wall. Explore art frames and personal pieces for a corner that feels like you.",
    note: "Find the right piece for your wall",
    detail: "Some frames celebrate Aipan-inspired motifs; others are personal photo gifts. Check each product’s description and dimensions, and ask about the details that matter to your space.",
  },
  {
    category: "Fridge Magnets", slug: "uttarakhand-souvenirs", label: "Fridge magnets",
    title: "Uttarakhand Fridge Magnets & Pahadi Souvenirs",
    heading: "Small reminders. Familiar feelings.",
    description: "Discover Uttarakhand fridge magnets and Pahadi souvenirs from KumaonRang. Little keepsakes from Pithoragarh for your home or thoughtful gifting.",
    intro: "A fridge door, a favourite corner, a small everyday reminder. These Pahadi souvenir magnets bring memories of Kumaon into the places you live with.",
    note: "A keepsake to live with",
    detail: "Browse each magnet’s artwork and product details. For a gathering or a set of gifts, contact us with your quantity and occasion so we can discuss what is available.",
  },
  {
    category: "Personalized Gifts", slug: "kumaoni-gifts", label: "Personalised gifts",
    title: "Personalised Kumaoni Gifts & Pahadi Keepsakes",
    heading: "Their name. Your memories.",
    description: "Find personalised Kumaoni gifts and thoughtful keepsakes from KumaonRang. Discuss names, photos and special occasions with Sneha in Pithoragarh.",
    intro: "For an inside joke, a favourite photograph, or a person who feels like home. Discover personal gifts, then tell us the story you want yours to hold.",
    note: "Make it personal, together",
    detail: "Customisation varies by product. Share your names, photographs or occasion on WhatsApp; we will confirm the possible details, price and timing before you decide.",
  },
] satisfies Array<{
  category: ProductCategory; slug: string; label: string; title: string;
  heading: string; description: string; intro: string; note: string; detail: string;
}>;

export function findCollection(slug: string) {
  return collections.find(collection => collection.slug === slug);
}
