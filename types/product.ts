export type ProductCategory =
  | "Audio & Gear"
  | "Electronics"
  | "Workspace"
  | "Apparel"
  | "Lifestyle";

export interface Product {
  id: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: ProductCategory;
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  stockCount: number;
  badge?: "Bestseller" | "New" | "Sale" | "Limited";
  visualTheme: {
    gradient: string;
    icon:
      | "headphones"
      | "laptop"
      | "keyboard"
      | "watch"
      | "bag"
      | "camera"
      | "lamp"
      | "speaker"
      | "mouse"
      | "cup"
      | "jacket"
      | "desk";
    accentColor: string;
  };
  features: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}
