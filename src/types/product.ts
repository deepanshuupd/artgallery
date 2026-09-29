export type ProductCategory =
  | "Keychains"
  | "Frames"
  | "Fridge Magnets"
  | "Personalized Gifts"
  | "Curated Hampers";

export interface Product {
  id: string;
  /** Optional editorial slug. Falls back to a URL-safe version of the name. */
  slug?: string;
  name: string;
  category: ProductCategory;
  description: string;
  story: string;
  price: number;
  originalPrice?: number;
  image: string;
  images: string[];
  featured: boolean;
  details: string[];
  whatsappMessage: string;
}
