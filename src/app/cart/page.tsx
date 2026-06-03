"use client";

import Link from "next/link";
import Image from "next/image";
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from "lucide-react";
import Container from "@/components/layout/Container";
import { useCartStore } from "@/store/cartStore";

function formatPrice(price: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
}

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, totalAmount } =
    useCartStore();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center py-20">
          <ShoppingBag className="w-16 h-16 text-slate-200 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-slate-700 mb-2">
            Giỏ hàng trống
          </h1>
          <p className="text-slate-400 text-sm mb-6">
            Hãy thêm sản phẩm vào giỏ hàng của bạn!
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <Container>
        <div className="flex items-center gap-3 mb-8">
          <Link
            href="/products"
            aria-label="Quay lại trang sản phẩm"
            className="flex items-center justify-center w-9 h-9 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-slate-600" />
          </Link>
          <h1 className="text-2xl font-bold text-slate-800">
            Giỏ hàng của bạn
          </h1>
          <span className="text-sm text-slate-400">({items.length} sản phẩm)</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items list */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {items.map(({ product, quantity }) => (
              <div
                key={product.id}
                className="flex gap-4 bg-white rounded-2xl border border-slate-100 shadow-sm p-4"
              >
                <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-slate-50">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="80px"
                    className="object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=200&h=200&fit=crop";
                    }}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-800 text-sm truncate">
                    {product.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {product.origin}
                  </p>
                  <p className="text-emerald-700 font-bold text-sm mt-1">
                    {formatPrice(product.price)}
                  </p>
                </div>

                <div className="flex flex-col items-end justify-between gap-2 shrink-0">
                  {/* Quantity control */}
                  <div className="flex items-center gap-2">
                    <button
                      id={`qty-decrease-${product.id}`}
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      aria-label="Giảm số lượng"
                      className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5 text-slate-600" />
                    </button>
                    <span className="w-6 text-center text-sm font-semibold text-slate-800">
                      {quantity}
                    </span>
                    <button
                      id={`qty-increase-${product.id}`}
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      aria-label="Tăng số lượng"
                      className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5 text-slate-600" />
                    </button>
                  </div>

                  <p className="text-sm font-bold text-slate-800">
                    {formatPrice(product.price * quantity)}
                  </p>

                  <button
                    id={`remove-${product.id}`}
                    onClick={() => removeItem(product.id)}
                    aria-label={`Xóa ${product.name} khỏi giỏ hàng`}
                    className="text-red-400 hover:text-red-600 transition-colors"
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

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sticky top-20">
              <h2 className="font-bold text-slate-800 text-base mb-5">
                Tóm tắt đơn hàng
              </h2>

              <div className="flex flex-col gap-3 pb-4 border-b border-slate-100">
                {items.map(({ product, quantity }) => (
                  <div key={product.id} className="flex justify-between text-sm">
                    <span className="text-slate-500 truncate max-w-[180px]">
                      {product.name} × {quantity}
                    </span>
                    <span className="text-slate-700 font-medium shrink-0">
                      {formatPrice(product.price * quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center py-4 border-b border-slate-100">
                <span className="text-sm text-slate-500">Phí vận chuyển</span>
                <span className="text-sm font-medium text-emerald-600">
                  Miễn phí
                </span>
              </div>

              <div className="flex justify-between items-center pt-4 pb-6">
                <span className="font-bold text-slate-800">Tổng cộng</span>
                <span className="text-xl font-extrabold text-emerald-700">
                  {formatPrice(totalAmount())}
                </span>
              </div>

              <Link
                href="/checkout"
                id="proceed-to-checkout"
                className="block w-full text-center py-3.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors shadow-sm hover:shadow-md"
              >
                Đặt hàng ngay
              </Link>

              <Link
                href="/products"
                className="block w-full text-center py-3 mt-3 border border-slate-200 text-slate-600 text-sm font-medium rounded-xl hover:bg-slate-50 transition-colors"
              >
                Tiếp tục mua sắm
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
