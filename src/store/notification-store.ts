import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Notification } from "@/types/notification";
import { db } from "@/lib/firebase";
import { collection, doc, onSnapshot, query, setDoc, updateDoc, where } from "firebase/firestore";

interface NotificationState {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, "id" | "createdAt" | "isRead">) => Promise<void>;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: (userId: string) => void;
  getNotificationsByUserId: (userId: string) => Notification[];
  getUnreadCount: (userId: string) => number;
  subscribeToUserNotifications: (userId: string) => () => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: [],
      addNotification: async (data) => {
        const newNotification: Notification = {
          ...data,
          id: `NOTI-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          isRead: false,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ notifications: [newNotification, ...state.notifications] }));
        try {
          await setDoc(doc(db, "notifications", newNotification.id), newNotification);
        } catch (error) {
          console.error("Loi addNotification:", error);
        }
      },
      markAsRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, isRead: true } : n
          ),
        }));
        updateDoc(doc(db, "notifications", id), { isRead: true }).catch((error) => {
          console.error("Loi markAsRead:", error);
        });
      },
      markAllAsRead: (userId) => {
        const unreadNotifications = get().notifications.filter((n) => n.userId === userId && !n.isRead);
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.userId === userId ? { ...n, isRead: true } : n
          ),
        }));
        unreadNotifications.forEach((notification) => {
          updateDoc(doc(db, "notifications", notification.id), { isRead: true }).catch((error) => {
            console.error("Loi markAllAsRead:", error);
          });
        });
      },
      getNotificationsByUserId: (userId) => {
        return get().notifications.filter((n) => n.userId === userId);
      },
      getUnreadCount: (userId) => {
        return get().notifications.filter((n) => n.userId === userId && !n.isRead).length;
      },
      subscribeToUserNotifications: (userId) => {
        const q = query(collection(db, "notifications"), where("userId", "==", userId));
        return onSnapshot(
          q,
          (snapshot) => {
            const remoteNotifications = snapshot.docs
              .map((docSnap) => docSnap.data() as Notification)
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

            set((state) => ({
              notifications: [
                ...remoteNotifications,
                ...state.notifications.filter((n) => n.userId !== userId),
              ],
            }));
          },
          (error) => {
            console.error("Loi subscribeToUserNotifications:", error);
          }
        );
      },
    }),
    {
      name: "nong-sach-notifications",
    }
  )
);
