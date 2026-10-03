export type ProductCategory =
  | "Keychains"
  | "Frames"
  | "Fridge Magnets"
  | "Personalized Gifts"
  | "Curated Hampers";

/** Descriptions belong to the source URL, not a mutable gallery position. */
export type ProductImageMetadata = {
  alt?: string;
  caption?: string;
  width?: number;
  height?: number;
  cardWidth?: number;
  cardHeight?: number;
};

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
  imageMetadata?: Record<string, ProductImageMetadata>;
  featured: boolean;
  details: string[];
  whatsappMessage: string;
}
