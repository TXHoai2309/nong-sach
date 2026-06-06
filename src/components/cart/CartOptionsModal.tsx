"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { X, MapPin, Plus, Minus } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { formatCurrency } from "@/lib/format";

type WeightOption = "500g" | "1kg" | "2kg";

export default function CartOptionsModal() {
  const router = useRouter();
  
  const {
    activeProductForModal,
    defaultQuantityForModal,
    isOptionsModalOpen,
    closeOptionsModal,
    addToCartWithOptions,
  } = useCartStore();

  const [weight, setWeight] = useState<WeightOption>("1kg");
  const [quantity, setQuantity] = useState(1);

  // Reset local state when modal opens for a new product
  useEffect(() => {
    if (activeProductForModal) {
      const timer = window.setTimeout(() => {
        setWeight("1kg");
        setQuantity(defaultQuantityForModal);
      }, 0);
      return () => window.clearTimeout(timer);
    }
  }, [activeProductForModal, defaultQuantityForModal]);

  if (!isOptionsModalOpen || !activeProductForModal) return null;

  const product = activeProductForModal;

  // Calculate price factor based on weight
  let priceFactor = 1.0;
  if (weight === "500g") priceFactor = 0.5;
  else if (weight === "2kg") priceFactor = 2.0;

  const adjustedUnitPrice = Math.round(product.price * priceFactor);
  const subtotal = adjustedUnitPrice * quantity;
  const isOutOfStock = product.stock <= 0;

  const handleWeightChange = (selectedWeight: WeightOption) => {
    setWeight(selectedWeight);
  };

  const handleDecreaseQuantity = () => {
    setQuantity((q) => Math.max(1, q - 1));
  };

  const handleIncreaseQuantity = () => {
    setQuantity((q) => Math.min(product.stock, q + 1));
  };

  const handleAddToCartClick = () => {
    if (isOutOfStock) return;
    addToCartWithOptions(product, quantity, weight);
    closeOptionsModal();
  };

  const handleBuyNowClick = () => {
    if (isOutOfStock) return;
    addToCartWithOptions(product, quantity, weight);
    closeOptionsModal();
    router.push("/checkout");
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={closeOptionsModal}
      />

      {/* Modal Container */}
      <div
        className="relative w-full max-w-[440px] overflow-hidden rounded-[32px] bg-white p-6 shadow-2xl transition-all duration-300 animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h2 className="text-lg font-bold text-on-surface">Thêm vào giỏ hàng</h2>
          <button
            onClick={closeOptionsModal}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-all hover:bg-slate-200 cursor-pointer"
            aria-label="Đóng modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Product Brief */}
        <div className="flex gap-4 py-5">
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-slate-100 bg-slate-50">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              sizes="80px"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=200&h=200&fit=crop";
              }}
            />
          </div>
          <div className="flex flex-col justify-between py-1">
            <div>
              <h3 className="font-bold text-on-surface text-base line-clamp-1">{product.name}</h3>
              <div className="mt-1 flex items-center gap-1">
                <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                  <MapPin className="h-3 w-3 text-red-500 shrink-0" />
                  {product.origin}
                </span>
              </div>
            </div>
            <div className="text-lg font-bold text-primary">
              {formatCurrency(product.price)}
              <span className="text-xs font-normal text-on-surface-variant">/kg</span>
            </div>
          </div>
        </div>

        {/* Weight Selector */}
        <div className="space-y-2.5 pb-4">
          <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider">
            Chọn khối lượng
          </label>
          <div className="grid grid-cols-3 gap-3">
            {(["500g", "1kg", "2kg"] as WeightOption[]).map((opt) => (
              <button
                key={opt}
                onClick={() => handleWeightChange(opt)}
                className={`flex justify-center items-center py-2 px-4 rounded-full border text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                  weight === opt
                    ? "border-primary bg-primary/5 text-primary font-bold shadow-sm"
                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Quantity Selector */}
        <div className="flex items-center justify-between py-4 border-t border-b border-slate-100">
          <div className="space-y-0.5">
            <span className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider">
              Số lượng
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center rounded-full bg-slate-100 px-1 py-1 border border-slate-200/50">
              <button
                onClick={handleDecreaseQuantity}
                disabled={quantity <= 1 || isOutOfStock}
                className="flex h-8 w-8 items-center justify-center rounded-full text-slate-600 hover:bg-slate-200 active:scale-90 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                type="button"
                aria-label="Giảm số lượng"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="w-8 text-center text-sm font-bold text-on-surface">
                {quantity}
              </span>
              <button
                onClick={handleIncreaseQuantity}
                disabled={quantity >= product.stock || isOutOfStock}
                className="flex h-8 w-8 items-center justify-center rounded-full text-primary hover:bg-slate-200 active:scale-90 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                type="button"
                aria-label="Tăng số lượng"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
            <span className="text-xs font-medium text-on-surface-variant">
              Còn {product.stock} sản phẩm
            </span>
          </div>
        </div>

        {/* Subtotal */}
        <div className="flex items-center justify-between py-5">
          <span className="text-sm font-semibold text-on-surface-variant">Tạm tính</span>
          <span className="text-xl font-bold text-primary">
            {formatCurrency(subtotal)}
          </span>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={handleAddToCartClick}
            disabled={isOutOfStock}
            className="w-full py-3.5 rounded-2xl bg-primary text-white font-bold hover:opacity-95 active:scale-[0.98] transition-all shadow-md text-sm cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Thêm vào giỏ
          </button>
          <button
            onClick={handleBuyNowClick}
            disabled={isOutOfStock}
            className="w-full py-3.5 rounded-2xl border-2 border-primary bg-white text-primary font-bold hover:bg-primary/5 active:scale-[0.98] transition-all text-sm cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Mua ngay
          </button>
        </div>
      </div>
    </div>
  );
}
