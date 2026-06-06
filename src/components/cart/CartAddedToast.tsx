"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { X, Check } from "lucide-react";
import { useCartStore } from "@/store/cart-store";

export default function CartAddedToast() {
  const router = useRouter();
  const { addedItemForToast, isAddedToastOpen, closeAddedToast } = useCartStore();

  useEffect(() => {
    if (!isAddedToastOpen) return;

    const timer = setTimeout(() => {
      closeAddedToast();
    }, 5000); // Auto close after 5 seconds

    return () => clearTimeout(timer);
  }, [isAddedToastOpen, closeAddedToast, addedItemForToast]); // Reset timer if item changes

  if (!isAddedToastOpen || !addedItemForToast) return null;

  const item = addedItemForToast;

  const handleViewCart = () => {
    closeAddedToast();
    router.push("/cart");
  };

  return (
    <div className="fixed bottom-6 right-6 z-[160] w-full max-w-[360px] overflow-hidden rounded-3xl border border-slate-100 bg-white p-4 shadow-2xl animate-slide-in">
      {/* Top Section */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-50">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
            <Check className="h-3.5 w-3.5" />
          </div>
          <span className="text-sm font-bold text-slate-800">Đã thêm vào giỏ hàng</span>
        </div>
        <button
          onClick={closeAddedToast}
          className="text-slate-400 hover:text-slate-600 cursor-pointer"
          aria-label="Đóng thông báo"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Product Card Section */}
      <div className="my-3 flex items-center gap-3 rounded-2xl bg-slate-50 p-3 border border-slate-100/50">
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-white border border-slate-100">
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover"
            sizes="48px"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=100&h=100&fit=crop";
            }}
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold text-slate-800 truncate">{item.name}</p>
          <p className="text-[11px] font-semibold text-slate-500 mt-0.5">Số lượng: {item.quantity}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={handleViewCart}
          className="flex-1 rounded-xl bg-primary py-2 text-center text-xs font-bold text-white shadow-sm hover:opacity-95 active:scale-[0.98] transition-all cursor-pointer"
        >
          Xem giỏ hàng
        </button>
        <button
          onClick={closeAddedToast}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-center text-xs font-semibold text-slate-700 hover:bg-slate-50 active:scale-[0.98] transition-all cursor-pointer"
        >
          Tiếp tục mua
        </button>
      </div>
    </div>
  );
}
