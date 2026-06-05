import { db } from "@/lib/firebase";
import { products } from "@/data/products";
import { STATIC_SHOPS } from "@/lib/shops";
import { doc, getDoc, setDoc } from "firebase/firestore";

/**
 * Hàm seed dữ liệu tĩnh lên Firestore.
 * Kiểm tra trước xem sản phẩm có id "1" đã tồn tại chưa để tránh ghi đè dữ liệu.
 */
export async function runSeed(): Promise<{ success: boolean; message: string }> {
  try {
    // 1. Kiểm tra trước xem collection products đã có data chưa bằng cách getDoc thử doc "1"
    const testDocRef = doc(db, "products", "1");
    const testDocSnap = await getDoc(testDocRef);

    if (testDocSnap.exists()) {
      const msg = "Seed đã chạy rồi, bỏ qua";
      console.log(msg);
      return { success: true, message: msg };
    }

    // 2. Tiến hành seed dữ liệu
    console.log("Bắt đầu seed dữ liệu lên Firestore...");

    // Ghi dữ liệu cửa hàng (shops)
    for (const shop of STATIC_SHOPS) {
      const shopRef = doc(db, "shops", shop.id);
      await setDoc(shopRef, shop);
    }
    console.log(`Đã seed ${STATIC_SHOPS.length} shops.`);

    // Ghi dữ liệu sản phẩm (products)
    for (const product of products) {
      const productRef = doc(db, "products", product.id);
      await setDoc(productRef, product);
    }
    console.log(`Đã seed ${products.length} products.`);

    return { success: true, message: "Seed dữ liệu thành công!" };
  } catch (error: any) {
    console.error("Lỗi khi chạy seed:", error);
    return { success: false, message: `Lỗi khi chạy seed: ${error.message || error}` };
  }
}
