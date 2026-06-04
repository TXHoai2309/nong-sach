"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from "lucide-react";
import Breadcrumb from "@/components/layout/Breadcrumb";
import Container from "@/components/layout/Container";
import { useCartStore } from "@/store/cart-store";
import { formatCurrency } from "@/lib/format";

export default function CartPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    items,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems,
  } = useCartStore();

  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-50 py-10 flex items-center justify-center">
        <div className="text-slate-500">Đang tải...</div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 px-6 py-10">
        <Container>
          <Breadcrumb
            items={[
              { label: "Trang chủ", href: "/" },
              { label: "Giỏ hàng" },
            ]}
          />
        </Container>
        <div className="text-center py-20 px-4">
          <ShoppingBag className="w-16 h-16 text-slate-300 mx-auto mb-4 animate-bounce" />
          <h1 className="text-xl font-bold text-slate-700 mb-2">
            Giỏ hàng của bạn đang trống.
          </h1>
          <p className="text-slate-400 text-sm mb-6">
            Hãy quay lại trang sản phẩm và chọn những nông sản tươi ngon nhất!
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors shadow-md hover:shadow-lg active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại trang sản phẩm
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <Container>
        <Breadcrumb
          className="mb-6"
          items={[
            { label: "Trang chủ", href: "/" },
            { label: "Giỏ hàng" },
          ]}
        />
        {/* Tiêu đề & Back button */}
        <div className="flex items-center gap-3 mb-8">
          <Link
            href="/products"
            aria-label="Quay lại trang sản phẩm"
            className="flex items-center justify-center w-9 h-9 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-slate-600" />
          </Link>
          <h1 className="text-2xl font-bold text-slate-800">
            Giỏ hàng
          </h1>
          <span className="text-sm text-slate-400">({getTotalItems()} sản phẩm)</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Danh sách sản phẩm trong giỏ */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {items.map((item) => (
              <div
                key={item.productId}
                className="flex gap-4 bg-white rounded-2xl border border-slate-100 shadow-sm p-4 items-center"
              >
                {/* Ảnh sản phẩm */}
                <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-slate-50 border border-slate-100">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="80px"
                    className="object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=200&h=200&fit=crop";
                    }}
                  />
                </div>

                {/* Tên & Giá */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-800 text-sm sm:text-base truncate">
                    {item.name}
                  </h3>
                  <p className="text-emerald-600 font-bold text-sm mt-1">
                    {formatCurrency(item.price)}
                  </p>
                </div>

                {/* Điều khiển số lượng & Nút xóa */}
                <div className="flex items-center gap-4 shrink-0">
                  <div className="flex items-center gap-2">
                    {/* Nút giảm số lượng */}
                    <button
                      id={`qty-decrease-${item.productId}`}
                      onClick={() => decreaseQuantity(item.productId)}
                      aria-label="Giảm số lượng"
                      className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5 text-slate-600" />
                    </button>
                    {/* Số lượng */}
                    <span className="w-6 text-center text-sm font-semibold text-slate-800">
                      {item.quantity}
                    </span>
                    {/* Nút tăng số lượng */}
                    <button
                      id={`qty-increase-${item.productId}`}
                      onClick={() => increaseQuantity(item.productId)}
                      disabled={item.quantity >= item.stock}
                      aria-label="Tăng số lượng"
                      className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5 text-slate-600" />
                    </button>
                  </div>

                  <p className="text-sm font-bold text-slate-800 hidden sm:block w-24 text-right">
                    {formatCurrency(item.price * item.quantity)}
                  </p>

                  {/* Nút xóa khỏi giỏ */}
                  <button
                    id={`remove-${item.productId}`}
                    onClick={() => removeFromCart(item.productId)}
                    aria-label={`Xóa ${item.name} khỏi giỏ hàng`}
                    className="text-slate-400 hover:text-red-500 transition-colors p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            <button
              id="clear-cart"
              onClick={clearCart}
              className="self-start text-xs text-slate-400 hover:text-red-500 transition-colors flex items-center gap-1 mt-2"
            >
              <Trash2 className="w-3.5 h-3.5" /> Xóa toàn bộ giỏ hàng
            </button>
          </div>

          {/* Tóm tắt đơn hàng */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sticky top-20">
              <h2 className="font-bold text-slate-800 text-base mb-5">
                Tóm tắt đơn hàng
              </h2>

              <div className="flex flex-col gap-3 pb-4 border-b border-slate-100">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Tổng số sản phẩm</span>
                  <span className="text-slate-800 font-medium">{getTotalItems()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Phí vận chuyển</span>
                  <span className="text-emerald-600 font-medium">Miễn phí</span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 pb-6">
                <span className="font-bold text-slate-800">Tổng tiền</span>
                <span className="text-xl font-extrabold text-emerald-700">
                  {formatCurrency(getTotalPrice())}
                </span>
              </div>

              {/* Nút "Đặt hàng" */}
              <Link
                href="/checkout"
                id="proceed-to-checkout"
                className="block w-full text-center py-3.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors shadow-sm hover:shadow-md active:scale-95"
              >
                Đặt hàng
              </Link>

              {/* Nút "Tiếp tục mua hàng" */}
              <Link
                href="/products"
                className="block w-full text-center py-3 mt-3 border border-slate-200 text-slate-600 text-sm font-medium rounded-xl hover:bg-slate-50 transition-colors"
              >
                Tiếp tục mua hàng
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
