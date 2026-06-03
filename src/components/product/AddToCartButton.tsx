"use client";

import { useState } from "react";
import { ShoppingCart, Check } from "lucide-react";
import { Product } from "@/types/product";
import { useCartStore } from "@/store/cart-store";

interface AddToCartButtonProps {
  product: Product;
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const addToCart = useCartStore((state) => state.addToCart);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (product.stock === 0) {
    return (
      <button
        disabled
        className="w-full py-3.5 bg-slate-200 text-slate-400 font-semibold rounded-xl cursor-not-allowed text-sm"
      >
        Hết hàng
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Quantity selector */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-slate-500 font-medium">Số lượng:</span>
        <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden">
          <button
            id="qty-decrease"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            aria-label="Giảm số lượng"
            className="w-9 h-9 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors font-bold text-lg"
          >
            −
          </button>
          <span className="w-10 text-center text-sm font-bold text-slate-800">
            {quantity}
          </span>
          <button
            id="qty-increase"
            onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
            aria-label="Tăng số lượng"
            className="w-9 h-9 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors font-bold text-lg"
          >
            +
          </button>
        </div>
      </div>

      {/* Add to cart button */}
      <button
        id={`add-to-cart-detail-${product.id}`}
        onClick={handleAdd}
        aria-label={`Thêm ${quantity} ${product.name} vào giỏ hàng`}
        className={`w-full flex items-center justify-center gap-2 py-3.5 font-bold rounded-xl transition-all duration-300 text-sm ${
          added
            ? "bg-emerald-500 text-white scale-95"
            : "bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-lg active:scale-95"
        }`}
      >
        {added ? (
          <>
            <Check className="w-4 h-4" />
            Đã thêm vào giỏ!
          </>
        ) : (
          <>
            <ShoppingCart className="w-4 h-4" />
            Thêm vào giỏ hàng
          </>
        )}
      </button>
    </div>
  );
}
