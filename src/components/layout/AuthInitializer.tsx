"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth-store";
import { useNotificationStore } from "@/store/notification-store";

export default function AuthInitializer() {
  const initAuth = useAuthStore((state) => state.initAuth);
  const currentUser = useAuthStore((state) => state.currentUser);
  const subscribeToUserNotifications = useNotificationStore((state) => state.subscribeToUserNotifications);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  useEffect(() => {
    if (!currentUser?.id) return;
    return subscribeToUserNotifications(currentUser.id);
  }, [currentUser?.id, subscribeToUserNotifications]);

  return null;
}
