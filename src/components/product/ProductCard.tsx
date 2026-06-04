"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, ArrowRight, ShoppingCart } from "lucide-react";
import { Product } from "@/types/product";
import { CATEGORY_LABELS } from "@/types/product";
import { formatCurrency } from "@/lib/format";
import { useCartStore } from "@/store/cart-store";
import { useAuthStore } from "@/store/auth-store";
import { useRouter } from "next/navigation";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const { currentUser } = useAuthStore();
  const addToCart = useCartStore((state) => state.addToCart);

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!currentUser) {
      alert("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!");
      const currentPath = typeof window !== "undefined" ? window.location.pathname + window.location.search : "/products";
      router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
      return;
    }
    addToCart(product);
  };

  const isOutOfStock = product.stock === 0;

  return (
    <div
      id={`product-card-${product.id}`}
      className="page-card lift-hover group flex flex-col overflow-hidden rounded-3xl"
    >
      {/* Image Container */}
      <Link href={`/products/${product.id}`} className="relative block h-52 overflow-hidden bg-surface-container-low">
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
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900/60">
            <span className="rounded-full bg-red-500 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm">
              Hết hàng
            </span>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        {/* Category & Origin */}
        <div className="flex items-center justify-between gap-2">
          <span className="inline-block rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
            {CATEGORY_LABELS[product.category]}
          </span>
          <span className="flex items-center gap-1 text-xs text-on-surface-variant">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-primary/70" />
            <span className="max-w-[120px] truncate">{product.origin}</span>
          </span>
        </div>

        {/* Name */}
        <Link href={`/products/${product.id}`}>
          <h3 className="line-clamp-2 text-base font-semibold leading-snug text-on-surface transition-colors hover:text-primary">
            {product.name}
          </h3>
        </Link>

        {/* Stock Status & Description */}
        <div className="my-0.5 flex items-center justify-between text-xs">
          <span className="text-on-surface-variant">Tình trạng:</span>
          {isOutOfStock ? (
            <span className="font-medium text-red-500">Hết hàng</span>
          ) : (
            <span className="font-medium text-primary">Còn hàng ({product.stock})</span>
          )}
        </div>

        <p className="line-clamp-2 min-h-[36px] text-xs leading-relaxed text-on-surface-variant">
          {product.description}
        </p>

        {/* Price & Actions */}
        <div className="mt-auto flex flex-col gap-3 border-t border-outline-variant/20 pt-3">
          <div className="flex items-baseline justify-between">
            <span className="text-xs text-on-surface-variant">Giá bán:</span>
            <span className="text-lg font-bold text-primary">
              {formatCurrency(product.price)}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Link
              href={`/products/${product.id}`}
              className="flex items-center justify-center gap-1 rounded-xl border border-outline-variant/40 px-3 py-2 text-center text-xs font-bold text-on-surface transition-all duration-200 hover:border-primary hover:bg-primary/5 hover:text-primary"
            >
              <span>Chi tiết</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
            
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="flex items-center justify-center gap-1 rounded-xl bg-primary px-3 py-2 text-xs font-bold text-white shadow-sm transition-all duration-200 hover:shadow disabled:cursor-not-allowed disabled:bg-surface-container-highest disabled:text-on-surface-variant active:scale-95"
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
