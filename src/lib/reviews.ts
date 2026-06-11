import { db, storage } from "@/lib/firebase";
import { Review, ReviewMessage } from "@/types/review";
import { collection, doc, getDocs, setDoc, query, where, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";

/**
 * Lấy ID sản phẩm gốc bằng cách loại bỏ hậu tố khối lượng (-500g, -1kg, -2kg).
 */
export function getBaseProductId(productId: string): string {
  return productId.replace(/-500g$|-1kg$|-2kg$/, "");
}

async function uploadReviewImages(review: Review, baseProductId: string): Promise<string[]> {
  const images = review.images ?? [];
  if (images.length === 0) return [];

  const uploaded = await Promise.all(
    images.map(async (image, index) => {
      if (!image.startsWith("data:")) return image;

      try {
        const imageRef = ref(
          storage,
          `reviews/${review.userId}/${review.orderId}_${baseProductId}/image_${index}_${Date.now()}.webp`
        );
        await uploadString(imageRef, image, "data_url");
        return getDownloadURL(imageRef);
      } catch (error) {
        console.warn("Upload anh danh gia len Firebase Storage khong thanh cong, luu fallback data URL:", error);
        return image;
      }
    })
  );

  return uploaded.filter((image): image is string => Boolean(image));
}

/**
 * Thêm một đánh giá mới vào Firestore.
 * ID của tài liệu sẽ có định dạng: `${orderId}_${productId_gốc}` để đảm bảo tính duy nhất.
 */
export async function addReview(review: Review): Promise<Review> {
  try {
    const baseProductId = getBaseProductId(review.productId);
    const baseId = `${review.orderId}_${baseProductId}`;
    const uploadedImages = await uploadReviewImages(review, baseProductId);
    const cleanedReview: Review = {
      ...review,
      id: baseId,
      productId: baseProductId,
      images: uploadedImages,
    };
    const docRef = doc(db, "reviews", baseId);
    await setDoc(docRef, cleanedReview);
    return cleanedReview;
  } catch (error) {
    console.error("Lỗi khi thêm đánh giá vào Firestore:", error);
    throw error;
  }
}

/**
 * Lấy các đánh giá trong một đơn hàng để hiển thị lại ngay tại chi tiết đơn đã mua.
 */
export async function getReviewsByOrderId(orderId: string): Promise<Record<string, Review>> {
  try {
    const q = query(
      collection(db, "reviews"),
      where("orderId", "==", orderId)
    );
    const querySnapshot = await getDocs(q);
    const reviewMap: Record<string, Review> = {};
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data() as Review;
      const baseProductId = getBaseProductId(data.productId);
      reviewMap[`${orderId}_${baseProductId}`] = {
        ...data,
        id: data.id || `${orderId}_${baseProductId}`,
        productId: baseProductId,
      };
    });
    return reviewMap;
  } catch (error) {
    console.error(`Lỗi khi lấy đánh giá cho đơn hàng ${orderId}:`, error);
    return {};
  }
}

/**
 * Lấy danh sách đánh giá của một sản phẩm từ Firestore.
 */
export async function getReviewsByProductId(productId: string): Promise<Review[]> {
  try {
    const q = query(
      collection(db, "reviews"),
      where("productId", "==", productId)
    );
    const querySnapshot = await getDocs(q);
    const list: Review[] = [];
    querySnapshot.forEach((docSnap) => {
      list.push(docSnap.data() as Review);
    });
    // Sắp xếp theo ngày tạo mới nhất (createdAt giảm dần)
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return list;
  } catch (error) {
    console.error(`Lỗi khi lấy đánh giá cho sản phẩm ${productId}:`, error);
    return [];
  }
}

/**
 * Kiểm tra xem các sản phẩm trong một đơn hàng đã được đánh giá chưa.
 * Trả về một đối tượng Record<productId, boolean> để giao diện kiểm tra nhanh.
 */
export async function checkReviewedItems(orderId: string): Promise<Record<string, boolean>> {
  try {
    const q = query(
      collection(db, "reviews"),
      where("orderId", "==", orderId)
    );
    const querySnapshot = await getDocs(q);
    const reviewedMap: Record<string, boolean> = {};
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data() as Review;
      reviewedMap[data.productId] = true;
    });
    return reviewedMap;
  } catch (error) {
    console.error(`Lỗi khi kiểm tra đánh giá cho đơn hàng ${orderId}:`, error);
    return {};
  }
}

/**
 * Lấy danh sách đánh giá cho một shop (bán hàng).
 */
export async function getReviewsByShopId(shopId: string, shopProductIds: string[]): Promise<Review[]> {
  try {
    const q = query(collection(db, "reviews"));
    const querySnapshot = await getDocs(q);
    const list: Review[] = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data() as Review;
      if (
        data.sellerId === shopId ||
        (data.productId && shopProductIds.includes(data.productId))
      ) {
        list.push({
          ...data,
          id: docSnap.id || data.id,
        });
      }
    });
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return list;
  } catch (error) {
    console.error(`Lỗi khi lấy đánh giá cho shop ${shopId}:`, error);
    return [];
  }
}

/**
 * Cập nhật phản hồi của người bán cho một đánh giá.
 */
export async function updateReviewReply(reviewId: string, replyComment: string): Promise<void> {
  try {
    const docRef = doc(db, "reviews", reviewId);
    await updateDoc(docRef, {
      replyComment,
      replyCreatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error(`Lỗi khi cập nhật phản hồi cho đánh giá ${reviewId}:`, error);
    throw error;
  }
}

/**
 * Thêm một tin nhắn vào luồng trao đổi của đánh giá.
 */
export async function addReviewMessage(reviewId: string, message: Omit<ReviewMessage, "id" | "createdAt">): Promise<ReviewMessage> {
  try {
    const docRef = doc(db, "reviews", reviewId);
    const newMessage: ReviewMessage = {
      ...message,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString()
    };

    await updateDoc(docRef, {
      messages: arrayUnion(newMessage)
    });

    return newMessage;
  } catch (error) {
    console.error(`Lỗi khi thêm tin nhắn vào đánh giá ${reviewId}:`, error);
    throw error;
  }
}
