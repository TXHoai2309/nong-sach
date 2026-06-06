import { db } from "./firebase";
import { 
  doc, 
  setDoc, 
  deleteDoc, 
  getDoc, 
  onSnapshot, 
  updateDoc, 
  increment,
  collection,
  query,
  where,
  getDocs
} from "firebase/firestore";

/**
 * Theo dõi hoặc bỏ theo dõi một shop
 */
export async function toggleFollow(userId: string, shopId: string): Promise<boolean> {
  const followRef = doc(db, "follows", `${userId}_${shopId}`);
  const shopRef = doc(db, "shops", shopId);

  try {
    const followSnap = await getDoc(followRef);
    const shopSnap = await getDoc(shopRef);
    
    if (!shopSnap.exists()) {
      throw new Error("Shop không tồn tại");
    }

    const shopData = shopSnap.data();
    let currentFollowerCount = shopData.followerCount;

    // Nếu followerCount đang là string (ví dụ "2.4K"), convert về number
    if (typeof currentFollowerCount === 'string') {
      const match = currentFollowerCount.match(/^(\d+(?:\.\d+)?)(K|M)?$/);
      if (match) {
        let num = parseFloat(match[1]);
        const unit = match[2];
        if (unit === "K") num *= 1000;
        if (unit === "M") num *= 1000000;
        currentFollowerCount = num;
      } else {
        currentFollowerCount = 0;
      }
      // Cập nhật lại field thành number để sau này dùng increment() được
      await updateDoc(shopRef, { followerCount: currentFollowerCount });
    }

    if (followSnap.exists()) {
      // Unfollow
      await deleteDoc(followRef);
      await updateDoc(shopRef, {
        followerCount: increment(-1)
      });
      return false;
    } else {
      // Follow
      await setDoc(followRef, {
        userId,
        shopId,
        createdAt: new Date().toISOString()
      });
      await updateDoc(shopRef, {
        followerCount: increment(1)
      });
      return true;
    }
  } catch (error) {
    console.error("Error toggling follow:", error);
    throw error;
  }
}

/**
 * Kiểm tra xem người dùng có đang theo dõi shop không (Realtime)
 */
export function subscribeToFollowStatus(userId: string, shopId: string, callback: (isFollowing: boolean) => void) {
  const followRef = doc(db, "follows", `${userId}_${shopId}`);
  return onSnapshot(followRef, (doc) => {
    callback(doc.exists());
  });
}

/**
 * Lắng nghe số lượng người theo dõi của shop (Realtime)
 */
export function subscribeToShopFollowers(shopId: string, callback: (count: number) => void) {
  const shopRef = doc(db, "shops", shopId);
  return onSnapshot(shopRef, (doc) => {
    if (doc.exists()) {
      const data = doc.data();
      // Đảm bảo trả về number
      let count = data.followerCount;
      if (typeof count === 'string') {
        const match = count.match(/^(\d+(?:\.\d+)?)(K|M)?$/);
        if (match) {
          let num = parseFloat(match[1]);
          const unit = match[2];
          if (unit === "K") num *= 1000;
          if (unit === "M") num *= 1000000;
          count = num;
        } else {
          count = 0;
        }
      }
      callback(count || 0);
    }
  });
}
