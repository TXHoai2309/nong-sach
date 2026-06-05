// =============================================
// Product type — NôngSạch
// =============================================

export type ProductCategory =
  | "vegetables"
  | "fruits"
  | "grains"
  | "roots"
  | "herbs"
  | "other";

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  vegetables: "Rau củ",
  fruits: "Trái cây",
  grains: "Ngũ cốc",
  roots: "Củ quả",
  herbs: "Rau thơm",
  other: "Khác",
};

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number; // VND
  image: string;
  images?: string[];
  description: string;
  origin: string;
  stock: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderForm {
  fullName: string;
  phone: string;
  address: string;
  note: string;
  items: CartItem[];
  totalAmount: number;
}
