// =============================================
// Product helper functions — NôngSạch
// Toàn bộ dữ liệu lấy từ local, không gọi API.
// =============================================

import { products as staticProducts } from "@/data/products";
import { Product, ProductCategory } from "@/types/product";

/**
 * Trả về toàn bộ danh sách sản phẩm (bao gồm cả sản phẩm tự đăng của người bán từ localStorage).
 */
export function getAllProducts(): Product[] {
  if (typeof window === "undefined") {
    return staticProducts;
  }
  const stored = localStorage.getItem("nong-sach-custom-products");
  if (stored) {
    try {
      const customProducts = JSON.parse(stored);
      const mappedCustom = customProducts.map((p: any) => ({
        id: p.id,
        name: p.name,
        category: p.category as ProductCategory,
        price: p.price,
        image: p.image,
        images: p.images,
        description: p.description,
        origin: p.origin,
        stock: p.stock,
        unit: p.unit || "kg",
        isOrganic: p.isOrganic || false,
      }));
      return [...staticProducts, ...mappedCustom];
    } catch {
      return staticProducts;
    }
  }
  return staticProducts;
}

/**
 * Tìm sản phẩm theo id. Trả về undefined nếu không tìm thấy.
 */
export function getProductById(id: string): Product | undefined {
  return getAllProducts().find((p) => p.id === id);
}

/**
 * Lọc sản phẩm theo danh mục.
 */
export function getProductsByCategory(category: ProductCategory): Product[] {
  return getAllProducts().filter((p) => p.category === category);
}

/**
 * Tìm kiếm sản phẩm theo từ khóa (tên, mô tả, nguồn gốc).
 * Không phân biệt hoa thường.
 */
export function searchProducts(query: string): Product[] {
  const q = query.toLowerCase().trim();
  const allProds = getAllProducts();
  if (!q) return allProds;
  return allProds.filter(
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
  const set = new Set(getAllProducts().map((p) => p.category));
  return Array.from(set);
}
