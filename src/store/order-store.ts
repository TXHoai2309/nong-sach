import { create } from "zustand";
import { Order, OrderStatus } from "@/types/order";
import { db } from "@/lib/firebase";
import { collection, doc, setDoc, updateDoc, query, where, getDocs } from "firebase/firestore";

interface OrderState {
  orders: Order[];
  isLoading: boolean;
  addOrder: (order: Order) => Promise<void>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  getOrdersByUserId: (userId: string) => Promise<Order[]>;
  getOrdersBySellerId: (sellerId: string) => Promise<Order[]>;
  fetchOrdersByUserId: (userId: string) => Promise<void>;
  fetchOrdersBySellerId: (sellerId: string) => Promise<void>;
}

export const useOrderStore = create<OrderState>()((set) => ({
  orders: [],
  isLoading: false,

  addOrder: async (order) => {
    try {
      const docRef = doc(db, "orders", order.id);
      await setDoc(docRef, order);
      set((state) => ({ orders: [order, ...state.orders] }));
    } catch (error) {
      console.error("Lỗi addOrder:", error);
    }
  },

  updateOrderStatus: async (orderId, status) => {
    try {
      const docRef = doc(db, "orders", orderId);
      await updateDoc(docRef, { status });
      set((state) => ({
        orders: state.orders.map((order) =>
          order.id === orderId ? { ...order, status } : order
        ),
      }));
    } catch (error) {
      console.error("Lỗi updateOrderStatus:", error);
    }
  },

  getOrdersByUserId: async (userId) => {
    try {
      const q = query(collection(db, "orders"), where("userId", "==", userId));
      const querySnapshot = await getDocs(q);
      const list: Order[] = [];
      querySnapshot.forEach((docSnap) => {
        list.push(docSnap.data() as Order);
      });
      return list;
    } catch (error) {
      console.error("Lỗi getOrdersByUserId:", error);
      return [];
    }
  },

  getOrdersBySellerId: async (sellerId) => {
    try {
      const q = query(collection(db, "orders"), where("sellerId", "==", sellerId));
      const querySnapshot = await getDocs(q);
      const list: Order[] = [];
      querySnapshot.forEach((docSnap) => {
        list.push(docSnap.data() as Order);
      });
      return list;
    } catch (error) {
      console.error("Lỗi getOrdersBySellerId:", error);
      return [];
    }
  },

  fetchOrdersByUserId: async (userId) => {
    set({ isLoading: true });
    try {
      const q = query(collection(db, "orders"), where("userId", "==", userId));
      const querySnapshot = await getDocs(q);
      const list: Order[] = [];
      querySnapshot.forEach((docSnap) => {
        list.push(docSnap.data() as Order);
      });
      // Sắp xếp đơn hàng mới nhất lên đầu (createdAt giảm dần)
      list.sort((a, b) => new Date(b.createdAt || "").getTime() - new Date(a.createdAt || "").getTime());
      set({ orders: list, isLoading: false });
    } catch (error) {
      console.error("Lỗi fetchOrdersByUserId:", error);
      set({ isLoading: false });
    }
  },

  fetchOrdersBySellerId: async (sellerId) => {
    set({ isLoading: true });
    try {
      const q = query(collection(db, "orders"), where("sellerId", "==", sellerId));
      const querySnapshot = await getDocs(q);
      const list: Order[] = [];
      querySnapshot.forEach((docSnap) => {
        list.push(docSnap.data() as Order);
      });
      // Sắp xếp đơn hàng mới nhất lên đầu (createdAt giảm dần)
      list.sort((a, b) => new Date(b.createdAt || "").getTime() - new Date(a.createdAt || "").getTime());
      set({ orders: list, isLoading: false });
    } catch (error) {
      console.error("Lỗi fetchOrdersBySellerId:", error);
      set({ isLoading: false });
    }
  },
}));
