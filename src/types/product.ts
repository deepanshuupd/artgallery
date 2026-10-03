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
  /** Persisted immutable slug. Demo data falls back to a URL-safe name. */
  slug?: string;
  /** The category used by the first published URL; independent of merchandising. */
  urlCategory?: ProductCategory;
  inStock?: boolean;
  published?: boolean;
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
