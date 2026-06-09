"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { currentUser, isAuthLoading, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setMounted(true), 0);
    return () => window.clearTimeout(timer);
  }, []);

  // Handle client-side redirect just in case
  useEffect(() => {
    if (mounted && !isAuthLoading) {
      if (!currentUser || currentUser.role !== "admin") {
        router.replace("/");
      }
    }
  }, [mounted, isAuthLoading, currentUser, router]);

  if (!mounted || isAuthLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#f9f9ff]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#006c49] border-t-transparent" />
          <p className="text-sm font-semibold text-[#006c49]">Đang tải dữ liệu Admin...</p>
        </div>
      </div>
    );
  }

  if (!currentUser || currentUser.role !== "admin") {
    return null;
  }

  const navItems = [
    {
      href: "/admin",
      label: "Tổng quan",
      icon: "dashboard",
    },
  ];

  return (
    <div className="flex min-h-screen bg-[#f1f5f9] text-[#1e293b]">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-200 bg-white flex flex-col justify-between shrink-0">
        <div>
          {/* Logo */}
          <div className="h-16 flex items-center px-6 border-b border-slate-200 bg-[#006c49] text-white">
            <Link href="/" className="text-xl font-bold tracking-wider hover:opacity-90">
              NôngSạch Admin
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={[
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all",
                    isActive
                      ? "bg-[#006c49]/10 text-[#006c49]"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                  ].join(" ")}
                >
                  <span className="material-symbols-outlined text-lg">{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User profile & logout */}
        <div className="p-4 border-t border-slate-200 space-y-3">
          <div className="flex items-center gap-3 px-2 py-1">
            <span className="material-symbols-outlined text-3xl text-[#006c49]">account_circle</span>
            <div className="min-w-0">
              <p className="text-sm font-bold text-slate-800 truncate">{currentUser.name}</p>
              <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
            </div>
          </div>
          <button
            onClick={() => {
              logout();
              router.push("/");
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-xl text-sm font-bold transition-all border border-rose-100 cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">logout</span>
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-8 shrink-0">
          <h1 className="text-lg font-bold text-slate-800">Hệ thống Quản trị</h1>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 rounded-lg text-xs font-bold transition-all"
            >
              <span className="material-symbols-outlined text-sm">storefront</span>
              Xem cửa hàng
            </Link>
          </div>
        </header>

        {/* Content body */}
        <main className="flex-1 overflow-y-auto p-8">{children}</main>
      </div>
    </div>
  );
}
