export type NotificationType = "order_update" | "new_order" | "system";

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  orderId?: string;
  isRead: boolean;
  createdAt: string;
}
