"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth-store";
import { useCartStore } from "@/store/cart-store";
import { useNotificationStore } from "@/store/notification-store";

export default function AuthInitializer() {
  const initAuth = useAuthStore((state) => state.initAuth);
  const currentUser = useAuthStore((state) => state.currentUser);
  const subscribeToUserCart = useCartStore((state) => state.subscribeToUserCart);
  const subscribeToUserNotifications = useNotificationStore((state) => state.subscribeToUserNotifications);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  useEffect(() => {
    if (!currentUser?.id) return;
    return subscribeToUserNotifications(currentUser.id);
  }, [currentUser?.id, subscribeToUserNotifications]);

  useEffect(() => {
    if (!currentUser?.id) return;
    return subscribeToUserCart(currentUser.id);
  }, [currentUser?.id, subscribeToUserCart]);

  return null;
}
