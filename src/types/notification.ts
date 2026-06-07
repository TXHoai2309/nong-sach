export type NotificationType = "order_update" | "new_order" | "account_update" | "system";
export type NotificationActionType = "review_detail";

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  actionType?: NotificationActionType;
  orderId?: string;
  reviewId?: string;
  productId?: string;
  isRead: boolean;
  createdAt: string;
}
