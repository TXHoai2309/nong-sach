"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, ArrowRight, ShoppingCart } from "lucide-react";
import { Product } from "@/types/product";
import { CATEGORY_LABELS } from "@/types/product";
import { formatCurrency } from "@/lib/format";
import { useCartStore } from "@/store/cartStore";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    addItem(product, 1);
  };

  const isOutOfStock = product.stock === 0;

  return (
    <div
      id={`product-card-${product.id}`}
      className="group flex flex-col bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
    >
      {/* Image Container */}
      <Link href={`/products/${product.id}`} className="relative h-52 bg-slate-50 overflow-hidden block">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=400&fit=crop";
          }}
        />
        {/* Out of stock overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center">
            <span className="bg-red-500 text-white font-bold text-xs uppercase px-3 py-1.5 rounded-full tracking-wider shadow-sm">
              Hết hàng
            </span>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        {/* Category & Origin */}
        <div className="flex items-center justify-between gap-2">
          <span className="inline-block px-2.5 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-md">
            {CATEGORY_LABELS[product.category]}
          </span>
          <span className="flex items-center gap-1 text-xs text-slate-400">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate max-w-[120px]">{product.origin}</span>
          </span>
        </div>

        {/* Name */}
        <Link href={`/products/${product.id}`}>
          <h3 className="font-semibold text-slate-800 text-base leading-snug hover:text-emerald-600 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {/* Stock Status & Description */}
        <div className="flex items-center justify-between text-xs my-0.5">
          <span className="text-slate-400">Tình trạng:</span>
          {isOutOfStock ? (
            <span className="text-red-500 font-medium">Hết hàng</span>
          ) : (
            <span className="text-emerald-600 font-medium">Còn hàng ({product.stock})</span>
          )}
        </div>

        <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 min-h-[36px]">
          {product.description}
        </p>

        {/* Price & Actions */}
        <div className="flex flex-col gap-3 mt-auto pt-3 border-t border-slate-100">
          <div className="flex items-baseline justify-between">
            <span className="text-xs text-slate-400">Giá bán:</span>
            <span className="text-lg font-bold text-emerald-600">
              {formatCurrency(product.price)}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Link
              href={`/products/${product.id}`}
              className="flex items-center justify-center gap-1 py-2 px-3 border border-slate-200 hover:border-emerald-600 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 text-xs font-bold rounded-xl transition-all duration-200 text-center"
            >
              <span>Chi tiết</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
            
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="flex items-center justify-center gap-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl transition-all duration-200 shadow-sm hover:shadow active:scale-95"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Thêm giỏ</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
