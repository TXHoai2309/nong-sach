"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/cart-store";

export default function CartBadge() {
  const [mounted, setMounted] = useState(false);
  const items = useCartStore((state) => state.items);

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalItems = mounted
    ? items.reduce((sum, item) => sum + item.quantity, 0)
    : 0;

  return (
    <Link
      href="/cart"
      id="cart-button"
      aria-label={`Giỏ hàng (${totalItems} sản phẩm)`}
      className="relative flex items-center justify-center w-10 h-10 rounded-xl text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 transition-all duration-200"
    >
      <ShoppingCart className="w-5 h-5" />
      {mounted && totalItems > 0 && (
        <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 bg-emerald-600 text-white text-xs font-bold rounded-full">
          {totalItems > 99 ? "99+" : totalItems}
        </span>
      )}
    </Link>
  );
}
