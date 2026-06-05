"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, ArrowRight, ShoppingCart, MoreHorizontal, Share2, Flag } from "lucide-react";
import { Product } from "@/types/product";
import { CATEGORY_LABELS } from "@/types/product";
import { formatCurrency } from "@/lib/format";
import { useCartStore } from "@/store/cart-store";
import { useAuthStore } from "@/store/auth-store";
import { useRouter } from "next/navigation";
import { useState, useEffect, type FormEvent } from "react";
import { useReportStore } from "@/store/report-store";
import { REPORT_REASONS } from "@/types/report";
import { AlertCircle, X, Check } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const { currentUser } = useAuthStore();
  const addToCart = useCartStore((state) => state.addToCart);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Report states
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState(REPORT_REASONS[0]);
  const [reportDetails, setReportDetails] = useState("");
  const [reportSubmitting, setReportSubmitting] = useState(false);
  const addReport = useReportStore((state) => state.addReport);

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

  useEffect(() => {
    if (!isMenuOpen) return;
    const handleClick = () => setIsMenuOpen(false);
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [isMenuOpen]);

  const handleCopyLink = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/products/${product.id}`;
    navigator.clipboard.writeText(url);
    alert("Đã sao chép liên kết sản phẩm vào bộ nhớ tạm!");
    setIsMenuOpen(false);
  };

  const handleReport = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsReportModalOpen(true);
    setIsMenuOpen(false);
  };

  const handleSubmitReport = (e: FormEvent) => {
    e.preventDefault();
    if (!reportReason) return;
    
    setReportSubmitting(true);
    addReport({
      type: 'product',
      productId: product.id,
      productName: product.name,
      reporterId: currentUser?.id,
      reporterName: currentUser?.name,
      reason: reportReason,
      details: reportDetails.trim() || undefined,
    });

    setTimeout(() => {
      setReportSubmitting(false);
      setIsReportModalOpen(false);
      setReportReason(REPORT_REASONS[0]);
      setReportDetails("");
      alert("Cảm ơn bạn đã báo cáo. Chúng tôi sẽ xem xét sản phẩm này trong vòng 24h.");
    }, 600);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/products/${product.id}`;
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: url,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(url);
      alert("Đã sao chép liên kết sản phẩm vào bộ nhớ tạm!");
    }
    setIsMenuOpen(false);
  };

  return (
    <div
      id={`product-card-${product.id}`}
      className="page-card lift-hover group flex flex-col overflow-hidden rounded-3xl"
    >
      {/* Image Container */}
      <div className="relative h-52 overflow-hidden bg-surface-container-low">
        <Link href={`/products/${product.id}`} className="block h-full w-full">
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
        </Link>
        
        {/* Out of stock overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900/60 pointer-events-none">
            <span className="rounded-full bg-red-500 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm">
              Hết hàng
            </span>
          </div>
        )}

        {/* Utility Menu Button — top-right */}
        <div className="absolute top-3 right-3 z-20">
          <div className="relative">
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsMenuOpen(!isMenuOpen); }}
              className="flex items-center justify-center bg-white/80 hover:bg-white border border-slate-100 backdrop-blur-sm w-8 h-8 rounded-full text-on-surface transition-all shadow-sm cursor-pointer"
              title="Tùy chọn"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>

            {/* Dropdown Menu */}
            {isMenuOpen && (
              <div className="absolute top-9 right-0 w-44 bg-white border border-slate-100 rounded-xl shadow-xl py-1.5 z-30 overflow-hidden animate-in fade-in zoom-in duration-200 origin-top-right">
                <button
                  onClick={handleShare}
                  className="w-full px-3 py-2 text-left text-xs font-bold text-on-surface hover:bg-slate-50 flex items-center gap-2 transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  Chia sẻ
                </button>
                <button
                  onClick={handleCopyLink}
                  className="w-full px-3 py-2 text-left text-xs font-bold text-on-surface hover:bg-slate-50 flex items-center gap-2 transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">content_copy</span>
                  Sao chép link
                </button>
                <button
                  onClick={handleReport}
                  className="w-full px-3 py-2 text-left text-xs font-bold text-red-500 hover:bg-red-50 flex items-center gap-2 transition-colors"
                >
                  <Flag className="w-3.5 h-3.5" />
                  Báo cáo
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

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

      {/* ── Report Product Modal ───────────────────────────────────────────── */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsReportModalOpen(false); }} />
          <div className="relative w-full max-w-[440px] overflow-hidden rounded-3xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h2 className="text-base font-bold text-on-surface flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-500" />
                Báo cáo sản phẩm
              </h2>
              <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsReportModalOpen(false); }} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-all">
                <X className="w-3.5 h-3.5 text-slate-600" />
              </button>
            </div>

            <form onSubmit={handleSubmitReport} className="p-5 space-y-4">
              <div className="space-y-2.5">
                <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Lý do báo cáo</label>
                <div className="grid grid-cols-1 gap-1.5">
                  {REPORT_REASONS.map((reason) => (
                    <label key={reason} className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-100 hover:bg-slate-50 cursor-pointer transition-all">
                      <input
                        type="radio"
                        name="reportReason"
                        value={reason}
                        checked={reportReason === reason}
                        onChange={(e) => setReportReason(e.target.value)}
                        className="w-3.5 h-3.5 accent-primary"
                      />
                      <span className="text-xs font-medium text-on-surface">{reason}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Chi tiết thêm</label>
                <textarea
                  value={reportDetails}
                  onChange={(e) => setReportDetails(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-primary transition-all resize-none bg-slate-50"
                  placeholder="Mô tả cụ thể..."
                />
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsReportModalOpen(false); }}
                  className="flex-1 px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-on-surface hover:bg-slate-50 transition-all"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={reportSubmitting}
                  className="flex-1 px-4 py-2 rounded-xl bg-red-500 text-white text-xs font-bold hover:bg-red-600 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {reportSubmitting ? (
                    <span className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Check className="w-3.5 h-3.5" />
                  )}
                  {reportSubmitting ? "Đang gửi..." : "Gửi báo cáo"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
