import { db } from "./firebase";
import { 
  doc, 
  setDoc, 
  deleteDoc, 
  getDoc, 
  onSnapshot,
  collection,
  query,
  where
} from "firebase/firestore";

/**
 * Thêm hoặc xoá sản phẩm khỏi Wishlist
 */
export async function toggleWishlist(userId: string, productId: string): Promise<boolean> {
  const wishlistRef = doc(db, "wishlists", `${userId}_${productId}`);

  try {
    const wishlistSnap = await getDoc(wishlistRef);
    
    if (wishlistSnap.exists()) {
      // Unwishlist
      await deleteDoc(wishlistRef);
      return false;
    } else {
      // Wishlist
      await setDoc(wishlistRef, {
        userId,
        productId,
        createdAt: new Date().toISOString()
      });
      return true;
    }
  } catch (error) {
    console.error("Error toggling wishlist:", error);
    throw error;
  }
}

/**
 * Kiểm tra xem người dùng có đang yêu thích sản phẩm không (Realtime)
 */
export function subscribeToWishlistStatus(userId: string, productId: string, callback: (isWishlisted: boolean) => void) {
  const wishlistRef = doc(db, "wishlists", `${userId}_${productId}`);
  return onSnapshot(wishlistRef, (doc) => {
    callback(doc.exists());
  });
}

/**
 * Lắng nghe danh sách tất cả ID sản phẩm yêu thích của người dùng (Realtime)
 */
export function subscribeToUserWishlist(userId: string, callback: (productIds: string[]) => void) {
  const q = query(collection(db, "wishlists"), where("userId", "==", userId));
  return onSnapshot(q, (snapshot) => {
    const productIds = snapshot.docs.map(doc => doc.data().productId as string);
    callback(productIds);
  });
}
