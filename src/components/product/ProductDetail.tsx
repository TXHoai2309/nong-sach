"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, MapPin, ShieldCheck, Truck } from "lucide-react";
import { Product, CATEGORY_LABELS } from "@/types/product";
import { formatCurrency } from "@/lib/format";
import { AddToCartButton } from "@/components/product/AddToCartButton";

interface ProductDetailProps {
  product: Product;
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const isOutOfStock = product.stock === 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sm:p-8">
      {/* Back button */}
      <div className="mb-6">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-emerald-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại danh sách</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column: Big Image */}
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 shadow-inner group">
          <Image
            src={product.image}
            alt={product.name}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&h=800&fit=crop";
            }}
          />
          {isOutOfStock && (
            <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center">
              <span className="bg-red-500 text-white font-bold text-sm uppercase px-4 py-2 rounded-full tracking-wider shadow-md">
                Hết hàng
              </span>
            </div>
          )}
        </div>

        {/* Right Column: Detailed Info */}
        <div className="flex flex-col">
          {/* Category & Origin */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg uppercase tracking-wider">
              {CATEGORY_LABELS[product.category]}
            </span>
            <span className="flex items-center gap-1 text-sm text-slate-500">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>Nguồn gốc: <strong>{product.origin}</strong></span>
            </span>
          </div>

          {/* Name */}
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 mb-2 leading-tight">
            {product.name}
          </h1>

          {/* Price */}
          <div className="bg-emerald-50/50 rounded-xl p-4 mb-6">
            <span className="text-xs text-slate-500 block mb-1">Giá bán lẻ:</span>
            <span className="text-3xl font-extrabold text-emerald-600">
              {formatCurrency(product.price)}
            </span>
          </div>

          {/* Availability Status */}
          <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-6 text-sm">
            <span className="text-slate-500">Tình trạng kho:</span>
            {isOutOfStock ? (
              <span className="px-2.5 py-1 bg-red-50 text-red-600 font-semibold rounded-md text-xs">
                Hết hàng
              </span>
            ) : (
              <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 font-semibold rounded-md text-xs">
                Còn hàng ({product.stock} sản phẩm)
              </span>
            )}
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-sm font-bold text-slate-700 mb-2">Mô tả sản phẩm</h3>
            <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          </div>

          {/* Add To Cart Widget */}
          <div className="mt-auto pt-6 border-t border-slate-100">
            <AddToCartButton product={product} />
          </div>

          {/* Extra Badges/Guarantees */}
          <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-100 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>100% An toàn, VietGAP</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Giao hàng nhanh trong ngày</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
