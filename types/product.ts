export type ProductCategory =
  | "Audio"
  | "Elektronik"
  | "Perlengkapan Meja"
  | "Pakaian & Tas"
  | "Gaya Hidup";

export interface Product {
  id: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  imageUrl: string;
  category: ProductCategory;
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  stockCount: number;
  badge?: "Terlaris" | "Baru" | "Diskon" | "Terbatas";
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
