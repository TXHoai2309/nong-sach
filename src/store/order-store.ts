import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Order, OrderStatus } from "@/types/order";

interface OrderState {
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  getOrdersByUserId: (userId: string) => Order[];
  getOrdersBySellerId: (sellerId: string) => Order[];
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: [],
      addOrder: (order) => {
        set((state) => ({ orders: [order, ...state.orders] }));
      },
      updateOrderStatus: (orderId, status) => {
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === orderId ? { ...order, status } : order
          ),
        }));
      },
      getOrdersByUserId: (userId) => {
        return get().orders.filter((order) => order.userId === userId);
      },
      getOrdersBySellerId: (sellerId) => {
        return get().orders.filter((order) => order.sellerId === sellerId);
      },
    }),
    {
      name: "nong-sach-orders-v2",
    }
  )
);
