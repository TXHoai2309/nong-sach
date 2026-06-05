"use client";

import { useNotificationStore } from "@/store/notification-store";
import { useAuthStore } from "@/store/auth-store";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function NotificationBadge() {
  const { currentUser } = useAuthStore();
  const getUnreadCount = useNotificationStore((state) => state.getUnreadCount);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setMounted(true), 0);
    return () => window.clearTimeout(timer);
  }, []);

  if (!mounted || !currentUser) return null;

  const count = getUnreadCount(currentUser.id);

  return (
    <Link
      href="/profile?tab=notifications"
      className="relative flex h-10 w-10 items-center justify-center rounded-full text-[#3c4a42] transition-colors hover:bg-[#10b981]/10"
      title="Thông báo"
    >
      <span className="material-symbols-outlined text-[24px]">notifications</span>
      {count > 0 && (
        <span className="absolute right-1 top-1 flex h-4.5 min-w-[18px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}
