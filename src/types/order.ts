import { CartItem } from "./cart";

export interface Order {
  id: string;
  fullName: string;
  phone: string;
  address: string;
  note?: string;
  items: CartItem[];
  totalAmount: number;
  createdAt: string;
}
