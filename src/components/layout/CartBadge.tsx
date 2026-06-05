"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCartStore } from "@/store/cart-store";

export default function CartBadge() {
  const [mounted, setMounted] = useState(false);
  const items = useCartStore((state) => state.items);

  useEffect(() => {
    const timer = window.setTimeout(() => setMounted(true), 0);
    return () => window.clearTimeout(timer);
  }, []);

  const totalItems = mounted
    ? items.reduce((sum, item) => sum + item.quantity, 0)
    : 0;

  return (
    <Link
      href="/cart"
      id="cart-button"
      aria-label={`Giỏ hàng (${totalItems} sản phẩm)`}
      className="relative flex items-center gap-2 text-[#3c4a42] hover:bg-[#10b981]/10 px-2 py-2 rounded-full transition-all whitespace-nowrap shrink-0"
    >
      <span className="material-symbols-outlined text-[24px]">shopping_cart</span>
      <span className="hidden lg:inline text-[14px] leading-[20px] whitespace-nowrap">Giỏ hàng</span>
      {mounted && totalItems > 0 && (
        <span className="absolute top-0.5 left-6 flex items-center justify-center w-4 h-4 bg-[#006c49] text-white text-[10px] font-bold rounded-full leading-none">
          {totalItems > 99 ? "99+" : totalItems}
        </span>
      )}
    </Link>
  );
}
