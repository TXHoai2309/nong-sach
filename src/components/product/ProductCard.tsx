"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, MapPin } from "lucide-react";
import { Product } from "@/types/product";
import { CATEGORY_LABELS } from "@/types/product";
import { Badge } from "@/components/ui/Badge";
import { useCartStore } from "@/store/cartStore";

interface ProductCardProps {
  product: Product;
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    addItem(product, 1);
  };

  return (
    <Link
      href={`/products/${product.id}`}
      id={`product-card-${product.id}`}
      className="group relative flex flex-col bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
    >
      {/* Image */}
      <div className="relative h-52 bg-slate-50 overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=400&fit=crop";
          }}
        />
        {/* Out of stock overlay */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center">
            <span className="text-white font-semibold text-sm">Hết hàng</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        {/* Category & Origin */}
        <div className="flex items-center justify-between">
          <Badge
            label={CATEGORY_LABELS[product.category]}
            variant="green"
            size="sm"
          />
          <span className="flex items-center gap-1 text-xs text-slate-400">
            <MapPin className="w-3 h-3" />
            {product.origin}
          </span>
        </div>

        {/* Name */}
        <h3 className="font-semibold text-slate-800 text-sm leading-snug group-hover:text-emerald-700 transition-colors line-clamp-2">
          {product.name}
        </h3>

        {/* Description preview */}
        <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
          {product.description}
        </p>

        {/* Price & CTA */}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-50">
          <span className="text-lg font-bold text-emerald-700">
            {formatPrice(product.price)}
          </span>
          <button
            id={`add-to-cart-${product.id}`}
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            aria-label={`Thêm ${product.name} vào giỏ hàng`}
            className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-xl hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-md active:scale-95"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            Thêm
          </button>
        </div>
      </div>
    </Link>
  );
}
