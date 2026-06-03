// =============================================
// Product helper functions — NôngSạch
// Toàn bộ dữ liệu lấy từ local, không gọi API.
// =============================================

import { products } from "@/data/products";
import { Product, ProductCategory } from "@/types/product";

/**
 * Trả về toàn bộ danh sách sản phẩm.
 */
export function getAllProducts(): Product[] {
  return products;
}

/**
 * Tìm sản phẩm theo id. Trả về undefined nếu không tìm thấy.
 */
export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

/**
 * Lọc sản phẩm theo danh mục.
 */
export function getProductsByCategory(category: ProductCategory): Product[] {
  return products.filter((p) => p.category === category);
}

/**
 * Tìm kiếm sản phẩm theo từ khóa (tên, mô tả, nguồn gốc).
 * Không phân biệt hoa thường.
 */
export function searchProducts(query: string): Product[] {
  const q = query.toLowerCase().trim();
  if (!q) return products;
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.origin.toLowerCase().includes(q)
  );
}

/**
 * Lấy danh sách các danh mục duy nhất có trong dữ liệu.
 */
export function getAvailableCategories(): ProductCategory[] {
  const set = new Set(products.map((p) => p.category));
  return Array.from(set);
}
