import { db } from "@/lib/firebase";
import { Product, ProductCategory } from "@/types/product";
import { collection, doc, getDoc, getDocs, setDoc, deleteDoc } from "firebase/firestore";

/**
 * Trả về toàn bộ danh sách sản phẩm từ Firestore.
 */
export async function getAllProducts(includeInactive = false): Promise<Product[]> {
  try {
    const querySnapshot = await getDocs(collection(db, "products"));
    const list: Product[] = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const status = data.status || "active";
      if (!includeInactive && (status === "pending" || status === "rejected")) {
        return;
      }
      list.push({
        id: docSnap.id,
        name: data.name,
        category: data.category as ProductCategory,
        price: data.price,
        image: data.image,
        images: data.images || [],
        description: data.description,
        origin: data.origin,
        stock: data.stock,
        unit: data.unit || "kg",
        isOrganic: data.isOrganic || false,
        sellerId: data.sellerId,
        shopName: data.shopName,
        status: status,
        rejectionReason: data.rejectionReason || "",
      });
    });
    return list;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách sản phẩm từ Firestore:", error);
    return [];
  }
}

/**
 * Tìm sản phẩm theo id. Trả về undefined nếu không tìm thấy.
 */
export async function getProductById(id: string): Promise<Product | undefined> {
  try {
    const docRef = doc(db, "products", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        name: data.name,
        category: data.category as ProductCategory,
        price: data.price,
        image: data.image,
        images: data.images || [],
        description: data.description,
        origin: data.origin,
        stock: data.stock,
        unit: data.unit || "kg",
        isOrganic: data.isOrganic || false,
        sellerId: data.sellerId,
        shopName: data.shopName,
        status: data.status || "active",
        rejectionReason: data.rejectionReason || "",
      } as Product;
    }
    return undefined;
  } catch (error) {
    console.error(`Lỗi khi lấy sản phẩm id=${id} từ Firestore:`, error);
    return undefined;
  }
}

/**
 * Lọc sản phẩm theo danh mục.
 */
export async function getProductsByCategory(category: ProductCategory): Promise<Product[]> {
  try {
    const all = await getAllProducts();
    return all.filter((p) => p.category === category);
  } catch (error) {
    console.error("Lỗi khi lọc sản phẩm theo danh mục:", error);
    return [];
  }
}

/**
 * Tìm kiếm sản phẩm theo từ khóa (tên, mô tả, nguồn gốc) phía client.
 */
export async function searchProducts(query: string): Promise<Product[]> {
  const q = query.toLowerCase().trim();
  const allProds = await getAllProducts();
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
export async function getAvailableCategories(): Promise<ProductCategory[]> {
  try {
    const all = await getAllProducts();
    const set = new Set(all.map((p) => p.category));
    return Array.from(set);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách danh mục:", error);
    return [];
  }
}

/**
 * Thêm hoặc cập nhật sản phẩm trên Firestore.
 */
export async function addProduct(product: Product): Promise<void> {
  try {
    const docRef = doc(db, "products", product.id);
    await setDoc(docRef, product);
  } catch (error) {
    console.error("Lỗi khi thêm sản phẩm vào Firestore:", error);
    throw error;
  }
}

/**
 * Xóa sản phẩm trên Firestore.
 */
export async function deleteProduct(id: string): Promise<void> {
  try {
    const docRef = doc(db, "products", id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Lỗi khi xóa sản phẩm trên Firestore:", error);
    throw error;
  }
}
