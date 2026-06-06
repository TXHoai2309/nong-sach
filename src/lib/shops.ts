// =============================================
// Shop Models and Database — NôngSạch (Firestore Integrated)
// =============================================

import { Product } from "@/types/product";
import { db } from "@/lib/firebase";
import { doc, getDoc, getDocs, collection, setDoc, updateDoc, query, limit } from "firebase/firestore";

export interface Shop {
  id: string;
  name: string;
  logo: string;
  coverImage?: string;
  verified: boolean;
  rating: number;
  reviewCount: number;
  productCount: number;
  followerCount: string | number;
  joinDate: string;
  location: string;
  slogan: string;
  altitude: string;
  standard: string;
  description: string;
  farmImages: string[];
  mainCategories: string[];
}

/**
 * Lấy thông tin shop theo ID từ Firestore.
 * Nếu không tìm thấy, fallback về document đầu tiên trong collection.
 */
export async function getShopById(shopId: string): Promise<Shop | null> {
  try {
    const docRef = doc(db, "shops", shopId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as Shop;
    }
    return null;
  } catch (error) {
    console.error("Error in getShopById:", error);
    return null;
  }
}

/**
 * Lấy thông tin shop tương ứng với sản phẩm
 */
export async function getShopForProduct(product: Product): Promise<Shop | null> {
  try {
    if (product.sellerId) {
      return await getShopById(product.sellerId);
    }

    // Nếu là sản phẩm tĩnh, map dựa vào id/origin/category
    switch (product.id) {
      case "1":
      case "2":
      case "7":
      case "8":
        return await getShopById("vuon-sach-da-lat");
      case "4":
      case "5":
      case "6":
        return await getShopById("nong-trai-xanh");
      case "3":
      case "9":
        return await getShopById("rau-sach-organic");
      case "10":
        return await getShopById("moc-farm-da-lat");
      default:
        // Fallback theo xuất xứ
        if (product.origin.includes("Đà Lạt") || product.origin.includes("Lâm Đồng")) {
          return await getShopById("vuon-sach-da-lat");
        }
        if (product.origin.includes("Bến Tre") || product.origin.includes("Sóc Trăng")) {
          return await getShopById("nong-trai-xanh");
        }
        return await getShopById("vuon-sach-da-lat");
    }
  } catch (error) {
    console.error("Error in getShopForProduct:", error);
    return null;
  }
}

/**
 * Lấy tất cả các shop từ Firestore
 */
export async function getAllShops(): Promise<Shop[]> {
  try {
    const querySnapshot = await getDocs(collection(db, "shops"));
    const shops: Shop[] = [];
    querySnapshot.forEach((doc) => {
      shops.push(doc.data() as Shop);
    });
    return shops;
  } catch (error) {
    console.error("Error in getAllShops:", error);
    return [];
  }
}

/**
 * Thêm shop mới (dùng khi seller đăng ký shop mới được approve)
 */
export async function addShop(shop: Shop): Promise<void> {
  try {
    await setDoc(doc(db, "shops", shop.id), shop);
  } catch (error) {
    console.error("Error in addShop:", error);
  }
}

/**
 * Cập nhật thông tin shop
 */
export async function updateShop(shopId: string, data: Partial<Shop>): Promise<void> {
  try {
    await updateDoc(doc(db, "shops", shopId), data);
  } catch (error) {
    console.error("Error in updateShop:", error);
  }
}
