// Re-export tất cả từ product.ts để các file cũ không bị broken
export type { Product, OrderForm, ProductCategory } from "@/types/product";
export type { CartItem } from "@/types/cart";
export { CATEGORY_LABELS } from "@/types/product";
