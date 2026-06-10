"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/store/cart-store";
import { useAuthStore } from "@/store/auth-store";
import { useRouter } from "next/navigation";
import { formatCurrency } from "@/lib/format";
import Breadcrumb from "@/components/layout/Breadcrumb";
import Container from "@/components/layout/Container";

export default function CartPage() {
  const router = useRouter();
  const { currentUser } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [promoError, setPromoError] = useState("");
  const [promoSuccess, setPromoSuccess] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setMounted(true);
      const code = sessionStorage.getItem("appliedVoucherCode");
      const discountStr = sessionStorage.getItem("appliedVoucherDiscount");
      if (code && discountStr) {
        setPromoCode(code);
        setDiscount(Number(discountStr));
        setPromoSuccess(`Đang áp dụng mã: ${code}`);
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (mounted && !currentUser) {
      router.push("/login?redirect=/cart");
    }
  }, [mounted, currentUser, router]);

  const {
    items,
    selectedProductIds,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    toggleSelectedItem,
    selectAllItems,
    clearSelectedItems,
    getSelectedTotalPrice,
    getSelectedTotalItems,
    getTotalItems,
  } = useCartStore();

  const handleApplyPromo = async () => {
    setPromoError("");
    setPromoSuccess("");
    const trimmedCode = promoCode.trim().toUpperCase();
    if (!trimmedCode) {
      setPromoError("Vui lòng nhập mã giảm giá");
      setDiscount(0);
      sessionStorage.removeItem("appliedVoucherCode");
      sessionStorage.removeItem("appliedVoucherDiscount");
      sessionStorage.removeItem("appliedVoucherSellerId");
      return;
    }

    try {
      const selectedItems = items.filter(item => selectedProductIds.includes(item.productId));
      const response = await fetch("/api/vouchers/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: trimmedCode,
          items: selectedItems,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setPromoError(data.error || "Mã giảm giá không hợp lệ");
        setDiscount(0);
        sessionStorage.removeItem("appliedVoucherCode");
        sessionStorage.removeItem("appliedVoucherDiscount");
        sessionStorage.removeItem("appliedVoucherSellerId");
      } else {
        setDiscount(data.discount);
        setPromoSuccess(data.message || "Áp dụng mã giảm giá thành công!");
        sessionStorage.setItem("appliedVoucherCode", trimmedCode);
        sessionStorage.setItem("appliedVoucherDiscount", data.discount.toString());
        sessionStorage.setItem("appliedVoucherSellerId", data.sellerId);
      }
    } catch (error) {
      console.error("Lỗi khi áp dụng voucher:", error);
      setPromoError("Đã xảy ra lỗi khi kết nối với máy chủ");
      setDiscount(0);
    }
  };

  useEffect(() => {
    if (!mounted) return;
    const code = sessionStorage.getItem("appliedVoucherCode");
    if (code) {
      const timer = window.setTimeout(() => {
        void handleApplyPromo();
      }, 100);
      return () => window.clearTimeout(timer);
    }
  }, [selectedProductIds, mounted]);

  if (!mounted) {
    return (
      <div className="page-surface flex min-h-screen items-center justify-center py-10">
        <div className="text-on-surface-variant">Đang tải...</div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="page-surface flex min-h-screen items-center justify-center py-10">
        <Container>
          <Breadcrumb
            className="mb-8"
            items={[
              { label: "Trang chủ", href: "/" },
              { label: "Giỏ hàng" },
            ]}
          />
          <div className="page-card lift-hover mx-auto mt-10 max-w-[448px] rounded-3xl p-8 text-center">
            <span className="material-symbols-outlined text-[64px] text-primary mb-4">
              shopping_cart
            </span>
            <h1 className="text-headline-md font-bold text-on-surface mb-2">
              Giỏ hàng của bạn đang trống
            </h1>
            <p className="text-on-surface-variant text-label-md mb-6 leading-relaxed">
              Hãy quay lại trang sản phẩm và chọn những nông sản tươi ngon nhất!
            </p>
            <Link
              href="/products"
              className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white font-bold rounded-xl hover:opacity-90 active:scale-95 transition-all duration-300 shadow-md"
            >
              Quay lại trang sản phẩm
            </Link>
          </div>
        </Container>
      </div>
    );
  }

  // Dynamic calculations
  const subtotal = getSelectedTotalPrice();
  const finalDiscount = Math.min(discount, subtotal);
  const total = Math.max(0, subtotal - finalDiscount);
  const selectedTotalItems = getSelectedTotalItems();
  const selectedItemSet = new Set(selectedProductIds);
  const isAllSelected = items.length > 0 && selectedProductIds.length === items.length;

  // Group items by shopName
  const groupedItems = items.reduce((groups, item) => {
    const shop = item.shopName || "NôngSạch";
    if (!groups[shop]) {
      groups[shop] = [];
    }
    groups[shop].push(item);
    return groups;
  }, {} as Record<string, typeof items>);

  return (
    <div className="page-surface min-h-screen py-8">
      <Container>
        <Breadcrumb
          className="mb-6"
          items={[
            { label: "Trang chủ", href: "/" },
            { label: "Giỏ hàng" },
          ]}
        />

        {/* Heading Left with total items count badge */}
        <div className="mb-6 flex items-center gap-3">
          <h1 className="text-headline-lg font-bold text-primary">
            Giỏ hàng của bạn
          </h1>
          <span className="bg-[#10b981] text-white text-xs px-3 py-1 rounded-full font-bold">
            {getTotalItems()} sản phẩm
          </span>
        </div>

        <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-outline-variant/20 bg-white/80 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <label className="flex items-center gap-3 text-sm font-bold text-on-surface">
            <input
              type="checkbox"
              checked={isAllSelected}
              onChange={() => {
                if (isAllSelected) clearSelectedItems();
                else selectAllItems();
              }}
              className="h-5 w-5 accent-[#006c49]"
            />
            Chọn tất cả sản phẩm
          </label>
          <span className="text-xs font-semibold text-on-surface-variant">
            Đã chọn {selectedTotalItems} / {getTotalItems()} sản phẩm để mua
          </span>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left Column: Grouped Cart Items List by Shop */}
          <div className="space-y-6 lg:col-span-8">
            {Object.entries(groupedItems).map(([shopName, shopItems]) => (
              <div
                key={shopName}
                className="page-card rounded-3xl overflow-hidden border border-outline-variant/20 bg-white/90 shadow-lg"
              >
                {/* Shop Header banner */}
                <div className="bg-slate-50/80 px-5 py-3.5 border-b border-slate-100/80 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[22px]">store</span>
                  <h2 className="text-sm font-bold text-on-surface">
                    Gian hàng của <span className="text-primary font-extrabold">{shopName}</span>
                  </h2>
                </div>

                {/* Items list under this shop */}
                <div className="divide-y divide-slate-100/80 p-5 space-y-4 [&>*:not(:first-child)]:pt-4">
                  {shopItems.map((item) => {
                    const isLowStock = item.stock <= 5;

                    return (
                      <div
                        key={item.productId}
                        className="relative flex flex-col sm:flex-row items-start sm:items-center gap-4"
                      >
                        <label className="flex items-center gap-2 text-xs font-bold text-primary sm:self-center">
                          <input
                            type="checkbox"
                            checked={selectedItemSet.has(item.productId)}
                            onChange={() => toggleSelectedItem(item.productId)}
                            className="h-5 w-5 accent-[#006c49]"
                            aria-label={`Chọn mua ${item.name}`}
                          />
                          <span className="sm:hidden">Chọn mua</span>
                        </label>

                        {/* Remove Button (X) at Top Right on mobile, or next to price on desktop */}
                        <button
                          onClick={() => removeFromCart(item.productId)}
                          className="absolute -top-1 -right-1 sm:relative sm:top-auto sm:right-auto sm:order-last text-slate-400 hover:text-error transition-colors p-1 cursor-pointer"
                          aria-label={`Xóa ${item.name} khỏi giỏ hàng`}
                        >
                          <span className="material-symbols-outlined text-[20px]">close</span>
                        </button>

                        {/* Product image */}
                        <div className="relative w-20 h-20 rounded-2xl overflow-hidden shrink-0 bg-background border border-outline-variant/10">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            sizes="80px"
                            className="object-cover"
                          />
                        </div>

                        {/* Middle Area: Name, Stock warning, and Pill Qty Select */}
                        <div className="flex-1 min-w-0 pr-6 space-y-1">
                          <h3 className="font-bold text-on-surface text-base sm:text-lg truncate">
                            {item.name}
                          </h3>
                          {isLowStock && (
                            <p className="text-xs text-error font-semibold flex items-center gap-1 mt-1">
                              <span>!</span> Chỉ còn {item.stock} sản phẩm
                            </p>
                          )}

                          {/* Pill selector quantity */}
                          <div className="flex items-center gap-2 mt-3 bg-surface-container-low border border-outline-variant/40 rounded-full w-fit px-1.5 py-0.5">
                            <button
                              onClick={() => decreaseQuantity(item.productId)}
                              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container-lowest text-on-surface-variant transition-colors cursor-pointer"
                              aria-label="Giảm số lượng"
                            >
                              <span className="text-[18px] font-semibold">-</span>
                            </button>
                            <span className="w-6 text-center text-sm font-bold text-on-surface">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => increaseQuantity(item.productId)}
                              disabled={item.quantity >= item.stock}
                              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container-lowest text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                              aria-label="Tăng số lượng"
                            >
                              <span className="text-[18px] font-semibold">+</span>
                            </button>
                          </div>
                        </div>

                        {/* Total price for the item */}
                        <div className="text-left sm:text-right shrink-0 mt-3 sm:mt-0 min-w-[100px]">
                          <p className="text-lg font-bold text-primary">
                            {formatCurrency(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Bottom bar: Continue shopping link & Promo Code Apply box */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-6 pt-4 border-t border-outline-variant/10">
              <Link
                href="/products"
                className="text-on-surface hover:text-primary transition-colors flex items-center gap-1 font-bold text-sm"
              >
                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                Tiếp tục mua sắm
              </Link>

              {/* Promo Code Apply */}
              <div className="flex flex-col gap-1 w-full sm:w-auto">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Nhập mã giảm giá..."
                    value={promoCode}
                    onChange={(e) => {
                      setPromoCode(e.target.value);
                      if (promoError) setPromoError("");
                      if (promoSuccess) setPromoSuccess("");
                    }}
                    className="w-full sm:w-64 rounded-xl border border-outline-variant focus:border-primary p-sm bg-surface text-sm focus:outline-none"
                  />
                  <button
                    onClick={handleApplyPromo}
                    className="px-md bg-primary text-white rounded-xl font-bold hover:opacity-95 transition-colors cursor-pointer text-sm"
                  >
                    Áp dụng
                  </button>
                </div>
                {promoError && (
                  <p className="text-xs text-error font-semibold mt-1 pl-1">{promoError}</p>
                )}
                {promoSuccess && (
                  <p className="text-xs text-primary font-semibold mt-1 pl-1">{promoSuccess}</p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary (Sidebar) */}
          <div className="lg:col-span-4">
            <div className="page-card sticky top-24 space-y-6 rounded-3xl bg-[#f0f3ff]/80 p-6">
              <h2 className="font-bold text-on-surface text-lg">
                Tóm tắt đơn hàng
              </h2>

              <div className="flex flex-col gap-3.5 text-sm text-on-surface-variant font-medium">
                <div className="flex justify-between items-center">
                  <span>Tạm tính</span>
                  <span className="text-on-surface font-bold">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Phí giao hàng</span>
                  <span className="text-primary font-bold flex items-center gap-0.5">
                    Miễn phí
                    <span className="material-symbols-outlined text-[16px]">check_circle</span>
                  </span>
                </div>
                {finalDiscount > 0 && (
                  <div className="flex justify-between items-center">
                    <span>Giảm giá</span>
                    <span className="text-error font-bold">-{formatCurrency(finalDiscount)}</span>
                  </div>
                )}
              </div>

              <div className="border-t border-outline-variant/20 pt-4 flex justify-between items-end">
                <span className="font-bold text-on-surface text-base">Tổng cộng</span>
                <span className="text-2xl font-bold text-primary">
                  {formatCurrency(total)}
                </span>
              </div>

              {/* Checkout CTA */}
              {selectedTotalItems > 0 ? (
                <Link
                  href="/checkout"
                  className="flex w-full cursor-pointer items-center justify-center gap-xs rounded-2xl bg-primary py-4 text-center text-base font-bold text-white shadow-md transition-all hover:opacity-90 active:scale-[0.99]"
                >
                  Tiến hành đặt hàng
                  <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                </Link>
              ) : (
                <button
                  type="button"
                  disabled
                  className="flex w-full cursor-not-allowed items-center justify-center gap-xs rounded-2xl bg-slate-300 py-4 text-center text-base font-bold text-white"
                >
                  Chọn sản phẩm cần mua
                </button>
              )}

              {/* Trust Badges */}
              <div className="space-y-3 pt-2 text-sm text-on-surface-variant font-medium">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#006c49]/80 text-[18px]">lock</span>
                  <span>Thanh toán an toàn</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#006c49]/80 text-[18px]">assignment_return</span>
                  <span>Đổi trả 7 ngày</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#006c49]/80 text-[18px]">local_shipping</span>
                  <span>Giao trong ngày</span>
                </div>
              </div>

              {/* Alert Help Box */}
              <div className="p-4 bg-[#e7eeff] border border-outline-variant/10 rounded-2xl flex flex-col gap-1.5 text-sm text-[#006c49] font-medium shadow-sm">
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[18px]">info</span>
                  <span className="font-bold">Cần hỗ trợ?</span>
                </div>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Liên hệ với đội ngũ hỗ trợ NôngSạch qua Zalo hoặc Hotline 1900 xxxx.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
