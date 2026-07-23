export type ProductCategory =
  | "Keychains"
  | "Frames"
  | "Fridge Magnets"
  | "Personalized Gifts"
  | "Curated Hampers";

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  description: string;
  story: string;
  price: number;
  image: string;
  images: string[];
  featured: boolean;
  details: string[];
  whatsappMessage: string;
}
