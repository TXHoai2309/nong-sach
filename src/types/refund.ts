export type RefundStatus = "pending" | "approved" | "rejected";

export interface RefundRequest {
  id: string;
  orderId: string;
  userId: string;
  sellerId: string;
  reason: string;
  description: string;
  images: string[];
  status: RefundStatus;
  adminNote?: string;
  sellerNote?: string;
  createdAt: string;
  updatedAt?: string;
}
