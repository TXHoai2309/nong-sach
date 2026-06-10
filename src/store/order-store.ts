import { create } from "zustand";
import { Order, OrderStatus } from "@/types/order";
import { RefundRequest } from "@/types/refund";
import { db } from "@/lib/firebase";
import { collection, doc, setDoc, updateDoc, query, where, getDocs, onSnapshot, Unsubscribe } from "firebase/firestore";

interface OrderState {
  orders: Order[];
  isLoading: boolean;
  addOrder: (order: Order) => Promise<void>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  updateTrackingCode: (orderId: string, trackingCode: string) => Promise<void>;
  requestRefund: (refundData: Omit<RefundRequest, "id" | "status" | "createdAt">) => Promise<void>;
  getOrdersByUserId: (userId: string) => Promise<Order[]>;
  getOrdersBySellerId: (sellerId: string) => Promise<Order[]>;
  fetchOrdersByUserId: (userId: string) => Promise<void>;
  fetchOrdersBySellerId: (userId: string) => Promise<void>;
  subscribeToUserOrders: (userId: string) => Unsubscribe;
  subscribeToSellerOrders: (sellerId: string) => Unsubscribe;
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

  updateTrackingCode: async (orderId, trackingCode) => {
    try {
      const trackingUrl = `https://ghn.vn/blogs/trang-thai-don-hang?v=${trackingCode}`;
      const docRef = doc(db, "orders", orderId);
      await updateDoc(docRef, { trackingCode, trackingUrl });
      set((state) => ({
        orders: state.orders.map((order) =>
          order.id === orderId ? { ...order, trackingCode, trackingUrl } : order
        ),
      }));
    } catch (error) {
      console.error("Lỗi updateTrackingCode:", error);
    }
  },

  requestRefund: async (refundData) => {
    try {
      const refundRequestId = "RF-" + Date.now();
      const refundRef = doc(db, "refundRequests", refundRequestId);
      const newRefundRequest: RefundRequest = {
        ...refundData,
        id: refundRequestId,
        status: "pending",
        createdAt: new Date().toISOString(),
      };

      // Save refund request
      await setDoc(refundRef, newRefundRequest);

      // Update order status
      const orderRef = doc(db, "orders", refundData.orderId);
      await updateDoc(orderRef, {
        status: "refunding",
        refundRequestId: refundRequestId,
      });

      // Update local state
      set((state) => ({
        orders: state.orders.map((order) =>
          order.id === refundData.orderId
            ? { ...order, status: "refunding", refundRequestId: refundRequestId }
            : order
        ),
      }));
    } catch (error) {
      console.error("Lỗi requestRefund:", error);
      throw error;
    }
  },

  getOrdersByUserId: async (userId) => {
    try {
      const q = query(collection(db, "orders"), where("userId", "==", userId));
      const querySnapshot = await getDocs(q);
      const list: Order[] = [];
      querySnapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() } as Order);
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
        list.push({ id: docSnap.id, ...docSnap.data() } as Order);
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
        list.push({ id: docSnap.id, ...docSnap.data() } as Order);
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
        list.push({ id: docSnap.id, ...docSnap.data() } as Order);
      });
      // Sắp xếp đơn hàng mới nhất lên đầu (createdAt giảm dần)
      list.sort((a, b) => new Date(b.createdAt || "").getTime() - new Date(a.createdAt || "").getTime());
      set({ orders: list, isLoading: false });
    } catch (error) {
      console.error("Lỗi fetchOrdersBySellerId:", error);
      set({ isLoading: false });
    }
  },

  subscribeToUserOrders: (userId) => {
    set({ isLoading: true });
    const q = query(collection(db, "orders"), where("userId", "==", userId));
    return onSnapshot(q, (snapshot) => {
      const list: Order[] = [];
      snapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() } as Order);
      });
      list.sort((a, b) => new Date(b.createdAt || "").getTime() - new Date(a.createdAt || "").getTime());
      set({ orders: list, isLoading: false });
    }, (error) => {
      console.error("Lỗi subscribeToUserOrders:", error);
      set({ isLoading: false });
    });
  },

  subscribeToSellerOrders: (sellerId) => {
    set({ isLoading: true });
    const q = query(collection(db, "orders"), where("sellerId", "==", sellerId));
    return onSnapshot(q, (snapshot) => {
      const list: Order[] = [];
      snapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() } as Order);
      });
      list.sort((a, b) => new Date(b.createdAt || "").getTime() - new Date(a.createdAt || "").getTime());
      set({ orders: list, isLoading: false });
    }, (error) => {
      console.error("Lỗi subscribeToSellerOrders:", error);
      set({ isLoading: false });
    });
  },
}));
