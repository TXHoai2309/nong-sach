import { CartItem } from "./cart";

export type OrderStatus = "pending" | "confirmed" | "shipping" | "delivered" | "cancelled";

export interface Order {
  id: string;
  userId: string;
  sellerId?: string;
  shopName?: string;
  fullName: string;
  phone: string;
  email?: string;
  address: string;
  note?: string;
  items: CartItem[];
  totalAmount: number;
  status: OrderStatus;
  paymentMethod: string;
  createdAt: string;
  payment_status?: string;
  vnp_TransactionNo?: string;
  vnp_ResponseCode?: string;
  trackingCode?: string;
  trackingUrl?: string;
}
