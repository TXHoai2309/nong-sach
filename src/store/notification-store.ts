import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Notification, NotificationType } from "@/types/notification";

interface NotificationState {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, "id" | "createdAt" | "isRead">) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: (userId: string) => void;
  getNotificationsByUserId: (userId: string) => Notification[];
  getUnreadCount: (userId: string) => number;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: [],
      addNotification: (data) => {
        const newNotification: Notification = {
          ...data,
          id: `NOTI-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          isRead: false,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ notifications: [newNotification, ...state.notifications] }));
      },
      markAsRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, isRead: true } : n
          ),
        }));
      },
      markAllAsRead: (userId) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.userId === userId ? { ...n, isRead: true } : n
          ),
        }));
      },
      getNotificationsByUserId: (userId) => {
        return get().notifications.filter((n) => n.userId === userId);
      },
      getUnreadCount: (userId) => {
        return get().notifications.filter((n) => n.userId === userId && !n.isRead).length;
      },
    }),
    {
      name: "nong-sach-notifications",
    }
  )
);
