export interface ReviewMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: "buyer" | "seller";
  text: string;
  createdAt: string;
}

export interface Review {
  id: string; // Định dạng: `${orderId}_${productId}`
  productId: string;
  productName: string;
  productImage?: string;
  userId: string;
  userName: string;
  rating: number; // 1 -> 5
  comment: string;
  images?: string[];
  orderId: string;
  createdAt: string;
  sellerId?: string;
  replyComment?: string;
  replyCreatedAt?: string;
  messages?: ReviewMessage[];
}
