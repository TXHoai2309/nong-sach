"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo, type FormEvent } from "react";
import { MoreHorizontal, Pencil, Share2, Flag, HelpCircle, AlertCircle, X, Check } from "lucide-react";
import Breadcrumb from "@/components/layout/Breadcrumb";
import { useCartStore } from "@/store/cart-store";
import { useAuthStore } from "@/store/auth-store";
import { formatCurrency } from "@/lib/format";
import { CATEGORY_LABELS, Product } from "@/types/product";
import { getShopForProduct, Shop } from "@/lib/shops";
import { useReportStore } from "@/store/report-store";
import { REPORT_REASONS } from "@/types/report";
import { getReviewsByProductId } from "@/lib/reviews";
import { Review } from "@/types/review";
import { toggleWishlist, subscribeToWishlistStatus } from "@/lib/wishlist";

interface ProductDetailProps {
  product: Product;
  relatedProducts: Product[];
}

type TabKey = "description" | "info" | "reviews";
type ReviewFilter = "all" | 1 | 2 | 3 | 4 | 5;

const categoryGalleryImages: Partial<Record<Product["category"], string[]>> = {
  vegetables: [
    "https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?w=900&h=700&fit=crop",
    "https://images.unsplash.com/photo-1542838132-92c53300491e?w=900&h=700&fit=crop",
    "https://images.unsplash.com/photo-1518843875459-f738682238a6?w=900&h=700&fit=crop",
  ],
  fruits: [
    "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=900&h=700&fit=crop",
    "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=900&h=700&fit=crop",
    "https://images.unsplash.com/photo-1577234286642-fc512a5f8f11?w=900&h=700&fit=crop",
  ],
  grains: [
    "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=900&h=700&fit=crop",
    "https://images.unsplash.com/photo-1583324113626-70df0f4deaab?w=900&h=700&fit=crop",
    "https://images.unsplash.com/photo-1604909052743-94e838986d24?w=900&h=700&fit=crop",
  ],
  roots: [
    "https://images.unsplash.com/photo-1445282768818-728615cc910a?w=900&h=700&fit=crop",
    "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=900&h=700&fit=crop",
    "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=900&h=700&fit=crop",
  ],
  herbs: [
    "https://images.unsplash.com/photo-1471193945509-9ad0617afabf?w=900&h=700&fit=crop",
    "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=900&h=700&fit=crop",
    "https://images.unsplash.com/photo-1524593166156-312f362cada0?w=900&h=700&fit=crop",
  ],
};

const fallbackGalleryImages = [
  "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=900&h=700&fit=crop",
  "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=900&h=700&fit=crop",
  "https://images.unsplash.com/photo-1506806732259-39c2d0268443?w=900&h=700&fit=crop",
];

const defaultSelectedImageSize = { width: 1200, height: 900 };

export default function ProductDetail({ product, relatedProducts }: ProductDetailProps) {
  const router = useRouter();
  const { currentUser } = useAuthStore();
  const [shop, setShop] = useState<Shop | null>(null);

  useEffect(() => {
    let active = true;
    async function loadShop() {
      try {
        const resolvedShop = await getShopForProduct(product);
        if (active) {
          setShop(resolvedShop);
        }
      } catch (err) {
        console.error("Error loading shop for product:", err);
      }
    }
    loadShop();
    return () => {
      active = false;
    };
  }, [product]);
  const openOptionsModal = useCartStore((state) => state.openOptionsModal);
  const galleryImages =
    product.images && product.images.length > 0
      ? product.images
      : [
          product.image,
          ...(categoryGalleryImages[product.category] ?? fallbackGalleryImages),
        ];
  const [selectedImage, setSelectedImage] = useState(
    product.images && product.images.length > 0 ? product.images[0] : product.image
  );
  const [selectedImageSize, setSelectedImageSize] = useState(defaultSelectedImageSize);
  const isInlineSelectedImage = selectedImage.startsWith("data:");
  const [quantity, setQuantity] = useState(Math.min(2, Math.max(1, product.stock)));
  const [activeTab, setActiveTab] = useState<TabKey>("description");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      const timer = window.setTimeout(() => setIsWishlisted(false), 0);
      return () => window.clearTimeout(timer);
    }
    const unsubscribe = subscribeToWishlistStatus(currentUser.id, product.id, (wishlisted) => {
      setIsWishlisted(wishlisted);
    });
    return () => unsubscribe();
  }, [currentUser, product.id]);

  // Report states
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState(REPORT_REASONS[0]);
  const [reportDetails, setReportDetails] = useState("");
  const [reportSubmitting, setReportSubmitting] = useState(false);
  const addReport = useReportStore((state) => state.addReport);

  // Reviews state
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewFilter, setReviewFilter] = useState<ReviewFilter>("all");

  useEffect(() => {
    let active = true;
    async function loadReviews() {
      try {
        setReviewsLoading(true);
        const data = await getReviewsByProductId(product.id);
        if (active) {
          setReviews(data);
        }
      } catch (err) {
        console.error("Lỗi khi load reviews:", err);
      } finally {
        if (active) {
          setReviewsLoading(false);
        }
      }
    }
    loadReviews();
    return () => {
      active = false;
    };
  }, [product.id]);

  const { averageRating, reviewCount } = useMemo(() => {
    if (reviews.length === 0) {
      return { averageRating: 0, reviewCount: 0 };
    }
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    const avg = Math.round((sum / reviews.length) * 10) / 10;
    return { averageRating: avg, reviewCount: reviews.length };
  }, [reviews]);

  const reviewStarCounts = useMemo(() => {
    return reviews.reduce<Record<1 | 2 | 3 | 4 | 5, number>>(
      (acc, review) => {
        const rating = Math.min(5, Math.max(1, Math.round(review.rating))) as 1 | 2 | 3 | 4 | 5;
        acc[rating] += 1;
        return acc;
      },
      { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    );
  }, [reviews]);

  const filteredReviews = useMemo(() => {
    if (reviewFilter === "all") return reviews;
    return reviews.filter((review) => Math.round(review.rating) === reviewFilter);
  }, [reviews, reviewFilter]);

  const isOutOfStock = product.stock === 0;
  const smallestSelectedSide = Math.min(selectedImageSize.width, selectedImageSize.height);
  const isSmallSelectedImage = smallestSelectedSide < 700;
  const selectedImageDisplayWidth = isSmallSelectedImage
    ? Math.min(520, Math.max(360, Math.round(selectedImageSize.width * 1.45)))
    : selectedImageSize.width;
  const originText = product.origin.includes("Việt Nam") ? product.origin : `${product.origin}, Việt Nam`;
  const isOwner = currentUser && shop && currentUser.id === shop.id;

  useEffect(() => {
    let isActive = true;
    const img = new window.Image();

    img.onload = () => {
      if (!isActive) return;
      setSelectedImageSize({
        width: img.naturalWidth || defaultSelectedImageSize.width,
        height: img.naturalHeight || defaultSelectedImageSize.height,
      });
    };

    img.onerror = () => {
      if (!isActive) return;
      setSelectedImageSize(defaultSelectedImageSize);
    };

    img.src = selectedImage;

    return () => {
      isActive = false;
    };
  }, [selectedImage]);

  useEffect(() => {
    if (!isMenuOpen) return;
    const handleClick = () => setIsMenuOpen(false);
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [isMenuOpen]);

  function addSelectedQuantity() {
    if (isOutOfStock) return;
    if (!currentUser) {
      alert("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!");
      router.push(`/login?redirect=${encodeURIComponent(`/products/${product.id}`)}`);
      return;
    }
    const productWithShop = {
      ...product,
      sellerId: shop?.id || product.sellerId,
      shopName: shop?.name || product.shopName,
    };
    openOptionsModal(productWithShop, quantity);
  }

  function buyNow() {
    if (isOutOfStock) return;
    if (!currentUser) {
      alert("Vui lòng đăng nhập để mua sản phẩm!");
      router.push(`/login?redirect=${encodeURIComponent(`/products/${product.id}`)}`);
      return;
    }
    const productWithShop = {
      ...product,
      sellerId: shop?.id || product.sellerId,
      shopName: shop?.name || product.shopName,
    };
    openOptionsModal(productWithShop, quantity);
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Đã sao chép liên kết sản phẩm vào bộ nhớ tạm!");
    setIsMenuOpen(false);
  };

  const handleReport = () => {
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
      shopId: shop?.id,
      shopName: shop?.name,
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

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      }).catch(console.error);
    } else {
      handleCopyLink();
    }
    setIsMenuOpen(false);
  };

  const handleHelp = () => {
    alert("Hệ thống hỗ trợ Zalo: 0392 982 XXX (Hotline: 1900 1234).");
    setIsMenuOpen(false);
  };

  return (
    <main className="site-container page-enter py-6">
      <Breadcrumb
        className="mb-6"
        items={[
          { label: "Trang chủ", href: "/" },
          { label: "Cửa hàng", href: "/products" },
          { label: CATEGORY_LABELS[product.category], href: `/products?category=${product.category}` },
          { label: product.name },
        ]}
      />

      <div className="mb-10 grid grid-cols-1 gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-4">
          <div className="page-card group relative aspect-[4/3] overflow-hidden rounded-3xl bg-surface-container-low">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(255,255,255,0.98),rgba(231,238,255,0.72)_58%,rgba(216,227,251,0.46))]" />
            {isSmallSelectedImage && (
              <Image
                src={selectedImage}
                alt=""
                fill
                sizes="(min-width: 1280px) 640px, (min-width: 1024px) 48vw, 100vw"
                unoptimized={isInlineSelectedImage}
                className="scale-110 object-cover opacity-20 blur-2xl"
                aria-hidden="true"
              />
            )}
            <div className="absolute inset-6 rounded-[1.4rem] border border-white/70 bg-white/45 shadow-inner shadow-white/40" />
            <div className="relative flex h-full w-full items-center justify-center p-8 sm:p-10">
              <Image
                src={selectedImage}
                alt={product.name}
                width={selectedImageSize.width}
                height={selectedImageSize.height}
                priority
                sizes="(min-width: 1280px) 640px, (min-width: 1024px) 48vw, 100vw"
                quality={95}
                unoptimized={isInlineSelectedImage}
                className="relative h-auto max-h-full max-w-full rounded-2xl object-contain shadow-[0_18px_45px_rgba(17,28,45,0.12)] transition-transform duration-500 group-hover:scale-[1.02]"
                style={{ width: selectedImageDisplayWidth }}
              />
            </div>
            <div className="absolute left-4 top-4 flex items-center gap-1 rounded-full bg-primary px-4 py-1 text-xs font-semibold leading-4 tracking-wide text-white shadow-md">
              <span className="material-symbols-outlined text-[14px] [font-variation-settings:'FILL'_1]">eco</span>
              Hữu cơ
            </div>

            {/* Wishlist Button — top-right, next to utility menu */}
            <div className="absolute top-4 right-[60px] z-30">
              <button
                onClick={async (e) => {
                  e.stopPropagation();
                  if (!currentUser) {
                    alert("Vui lòng đăng nhập để thêm sản phẩm vào danh sách yêu thích!");
                    router.push(`/login?redirect=${encodeURIComponent(`/products/${product.id}`)}`);
                    return;
                  }
                  try {
                    await toggleWishlist(currentUser.id, product.id);
                  } catch (err) {
                    console.error("Lỗi khi cập nhật danh sách yêu thích:", err);
                  }
                }}
                className={`flex items-center justify-center bg-black/25 hover:bg-black/40 border border-white/20 backdrop-blur-md w-9 h-9 rounded-full transition-all shadow-md cursor-pointer active:scale-90 ${isWishlisted ? "text-red-500" : "text-white"}`}
                title={isWishlisted ? "Xóa khỏi Yêu thích" : "Thêm vào Yêu thích"}
              >
                <span 
                  className="material-symbols-outlined text-[18px] select-none"
                  style={{ fontVariationSettings: `'FILL' ${isWishlisted ? 1 : 0}` }}
                >
                  favorite
                </span>
              </button>
            </div>

            {/* Utility Menu Button — top-right */}
            <div className="absolute top-4 right-4 z-30">
              <div className="relative">
                <button
                  onClick={(e) => { e.stopPropagation(); setIsMenuOpen(!isMenuOpen); }}
                  className="flex items-center justify-center bg-black/25 hover:bg-black/40 border border-white/20 backdrop-blur-md w-9 h-9 rounded-full text-white transition-all shadow-md cursor-pointer"
                  title="Tùy chọn"
                >
                  <MoreHorizontal className="w-5 h-5" />
                </button>

                {/* Dropdown Menu */}
                {isMenuOpen && (
                  <div className="absolute top-11 right-0 w-48 bg-white/95 backdrop-blur-xl border border-slate-100 rounded-2xl shadow-2xl py-2 z-50 overflow-hidden animate-in fade-in zoom-in duration-200 origin-top-right">
                    {isOwner && (
                      <Link
                        href={`/profile?tab=seller-products&edit=${product.id}`}
                        className="w-full px-4 py-2.5 text-left text-sm font-bold text-primary hover:bg-primary/5 flex items-center gap-2.5 transition-colors border-b border-slate-50"
                      >
                        <Pencil className="w-4 h-4" />
                        Chỉnh sửa sản phẩm
                      </Link>
                    )}
                    <button
                      onClick={(e) => { e.stopPropagation(); handleShare(); }}
                      className="w-full px-4 py-2.5 text-left text-sm font-bold text-on-surface hover:bg-slate-50 flex items-center gap-2.5 transition-colors"
                    >
                      <Share2 className="w-4 h-4" />
                      Chia sẻ sản phẩm
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleCopyLink(); }}
                      className="w-full px-4 py-2.5 text-left text-sm font-bold text-on-surface hover:bg-slate-50 flex items-center gap-2.5 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">content_copy</span>
                      Sao chép liên kết
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleReport(); }}
                      className="w-full px-4 py-2.5 text-left text-sm font-bold text-red-500 hover:bg-red-50 flex items-center gap-2.5 transition-colors"
                    >
                      <Flag className="w-4 h-4" />
                      Báo cáo sản phẩm
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleHelp(); }}
                      className="w-full px-4 py-2.5 text-left text-sm font-bold text-on-surface hover:bg-slate-50 flex items-center gap-2.5 transition-colors"
                    >
                      <HelpCircle className="w-4 h-4" />
                      Bạn cần giúp đỡ?
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {galleryImages.map((image, index) => (
              <button
                key={`${image}-${index}`}
                onClick={() => setSelectedImage(image)}
                className={[
                  "relative aspect-square w-16 h-16 overflow-hidden rounded-xl transition-all shadow-sm shrink-0",
                  selectedImage === image
                    ? "border-2 border-primary ring-2 ring-primary/20 scale-95"
                    : "border border-outline-variant/30 hover:border-primary",
                ].join(" ")}
                type="button"
              >
                <Image
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  fill
                  sizes="64px"
                  unoptimized={image.startsWith("data:")}
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="inline-flex w-fit items-center rounded-full bg-surface-container-high px-4 py-1 text-xs font-semibold leading-4 text-on-surface-variant">
            {originText}
          </div>
          <h1 className="text-3xl font-bold leading-[38px] tracking-[-0.02em] text-on-surface">{product.name}</h1>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center text-[#FFB800]">
              {(() => {
                const stars = [];
                const fullStars = Math.floor(averageRating);
                const hasHalf = averageRating - fullStars >= 0.3 && averageRating - fullStars <= 0.7;
                const roundedFull = fullStars + (averageRating - fullStars > 0.7 ? 1 : 0);
                for (let i = 1; i <= 5; i++) {
                  if (i <= roundedFull) {
                    stars.push(
                      <span key={i} className="material-symbols-outlined [font-variation-settings:'FILL'_1]">
                        star
                      </span>
                    );
                  } else if (i === roundedFull + 1 && hasHalf) {
                    stars.push(
                      <span key={i} className="material-symbols-outlined [font-variation-settings:'FILL'_1]">
                        star_half
                      </span>
                    );
                  } else {
                    stars.push(
                      <span key={i} className="material-symbols-outlined text-slate-300">
                        star
                      </span>
                    );
                  }
                }
                return stars;
              })()}
              <span className="ml-1.5 font-extrabold text-on-surface">{averageRating.toFixed(1)}</span>
            </div>
            <span className="text-sm font-medium text-on-surface-variant">
              ({reviewCount > 0 ? `${reviewCount} đánh giá` : "Chưa có đánh giá"})
            </span>
          </div>

          <div className="text-2xl font-semibold leading-8 text-primary">
            {formatCurrency(product.price)} <span className="text-base font-normal text-on-surface-variant">/kg</span>
          </div>

          <p className="border-l-4 border-primary/20 pl-5 text-sm leading-7 text-on-surface-variant">
            {product.description}
          </p>

          <div className="mt-2 flex flex-col gap-3">
            <label className="text-xs font-semibold uppercase leading-4 tracking-wider text-on-surface-variant">Số lượng</label>
            <div className="flex items-center gap-6">
              <div className="flex items-center rounded-full border border-outline-variant/30 bg-surface-container-low px-1 py-1">
                <button
                  onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                  className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-surface-container-high active:scale-90"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">remove</span>
                </button>
                <span className="w-10 text-center font-bold text-on-surface">{quantity}</span>
                <button
                  onClick={() => setQuantity((current) => Math.min(product.stock, current + 1))}
                  className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-surface-container-high active:scale-90"
                  type="button"
                  disabled={isOutOfStock}
                >
                  <span className="material-symbols-outlined text-[18px]">add</span>
                </button>
              </div>
              <span className="text-sm font-medium text-on-surface-variant">
                Còn <span className="font-bold text-on-surface">{product.stock}</span> sản phẩm
              </span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              onClick={addSelectedQuantity}
              disabled={isOutOfStock}
              className="flex items-center justify-center gap-3 rounded-xl bg-primary px-7 py-3.5 font-bold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary-container active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              type="button"
            >
              <span className="material-symbols-outlined">shopping_basket</span>
              Thêm vào giỏ hàng
            </button>
            <button
              onClick={buyNow}
              disabled={isOutOfStock}
              className="rounded-xl border-2 border-primary px-7 py-3.5 font-bold text-primary transition-all hover:bg-primary/5 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              type="button"
            >
              Mua ngay
            </button>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-4 border-t border-outline-variant/30 pt-6">
            {[
              ["verified", "Tiêu chuẩn VietGAP"],
              ["local_shipping", "Giao trong ngày"],
              ["assignment_return", "Đổi trả 7 ngày"],
            ].map(([icon, label]) => (
              <div key={label} className="flex flex-col items-center gap-2 text-center">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <span className="material-symbols-outlined text-[20px] [font-variation-settings:'FILL'_1]">{icon}</span>
                </div>
                <span className="text-xs font-semibold leading-4 text-on-surface-variant">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Shop Info Banner */}
      {shop ? (
        <div className="mb-10 rounded-[1.25rem] border border-outline-variant/30 bg-[#f8fafc] p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-outline-variant/20 shadow-sm bg-white">
              <Image
                src={shop.logo}
                alt={shop.name}
                fill
                className="object-cover"
                sizes="48px"
              />
            </div>
            <div>
              <div className="flex items-center flex-wrap gap-2">
                <Link href={`/shop/${shop.id}`} className="text-base font-bold text-on-surface hover:text-primary transition-colors">
                  {shop.name}
                </Link>
                {shop.verified && (
                  <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                    <span className="material-symbols-outlined text-[10px] font-bold text-emerald-600 [font-variation-settings:'FILL'_1]">check_circle</span>
                    Đã xác minh
                  </span>
                )}
              </div>
              
              <div className="mt-1 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs font-semibold text-on-surface-variant/80">
                <div className="flex items-center gap-0.5 text-[#FFB800]">
                  <span className="material-symbols-outlined text-[14px] [font-variation-settings:'FILL'_1]">star</span>
                  <span className="text-on-surface font-bold">{shop.rating}</span>
                </div>
                <span className="text-on-surface-variant/40">•</span>
                <span>{shop.reviewCount} đánh giá</span>
                <span className="text-on-surface-variant/40">•</span>
                <span>{shop.productCount} sản phẩm</span>
                <span className="text-on-surface-variant/40">•</span>
                <div className="flex items-center gap-0.5">
                  <span className="material-symbols-outlined text-[14px] text-red-500">location_on</span>
                  <span>{shop.location}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="shrink-0 flex items-center">
            <Link
              href={`/shop/${shop.id}`}
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl border border-primary px-5 py-2.5 text-xs font-bold text-primary transition-all hover:bg-primary/5 active:scale-[0.98]"
            >
              Xem shop →
            </Link>
          </div>
        </div>
      ) : (
        <div className="mb-10 rounded-[1.25rem] border border-outline-variant/30 bg-[#f8fafc] p-5 flex items-center justify-between gap-4 animate-pulse">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-slate-200" />
            <div className="space-y-2">
              <div className="h-4 w-32 bg-slate-200 rounded" />
              <div className="h-3 w-48 bg-slate-200 rounded" />
            </div>
          </div>
          <div className="h-8 w-20 bg-slate-200 rounded-xl" />
        </div>
      )}

      <section className="mt-10">
        <div className="mb-7 flex gap-8 overflow-x-auto border-b border-outline-variant/30">
          {[
            ["description", "Mô tả"],
            ["info", "Thông tin"],
            ["reviews", `Đánh giá (${reviewCount})`],
          ].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as TabKey)}
              className={[
                "whitespace-nowrap pb-4 text-xl font-semibold leading-7 transition-colors",
                activeTab === key ? "border-b-2 border-primary text-primary" : "text-on-surface-variant hover:text-primary",
              ].join(" ")}
              type="button"
            >
              {label}
            </button>
          ))}
        </div>

        {activeTab === "description" && (
          <div className="flex max-w-[720px] flex-col gap-5 text-sm leading-7 text-on-surface-variant">
            <p>
              Sản phẩm {product.name.toLowerCase()} tại NôngSạch được tuyển chọn từ những trang trại liên kết tại
              {` ${product.origin}`}. Với quy trình canh tác sạch, sản phẩm giữ được độ tươi ngon tự nhiên và phù hợp cho
              bữa ăn gia đình hằng ngày.
            </p>
            <p>
              Chúng tôi ưu tiên nguồn hàng rõ xuất xứ, giảm trung gian và kiểm soát chất lượng trước khi giao đến khách
              hàng. Mỗi sản phẩm được bảo quản cẩn thận để giữ trọn hương vị, dinh dưỡng và sự an tâm khi sử dụng.
            </p>
          </div>
        )}

        {activeTab === "info" && (
          <div className="max-w-[640px] overflow-hidden rounded-2xl border border-outline-variant/20 bg-surface-container">
            {[
              ["Xuất xứ", originText],
              ["Danh mục", CATEGORY_LABELS[product.category]],
              ["Tiêu chuẩn", "VietGAP & Organic"],
              ["Bảo quản", "Ngăn mát tủ lạnh (4-8°C)"],
              ["Đơn vị", "Đóng túi 500g / 1kg"],
            ].map(([label, value], index) => (
              <div key={label} className={["grid grid-cols-2", index < 4 ? "border-b border-outline-variant/20" : ""].join(" ")}>
                <div className="bg-surface-container-high/50 p-5 font-bold text-on-surface">{label}</div>
                <div className="p-5 text-on-surface-variant">{value}</div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="flex flex-col items-center justify-center rounded-2xl bg-surface-container-low p-8 text-center lg:col-span-4">
              <div className="text-4xl font-bold text-primary">{averageRating.toFixed(1)}</div>
              <div className="mb-2 flex text-[#FFB800]">
                {(() => {
                  const stars = [];
                  const fullStars = Math.floor(averageRating);
                  const hasHalf = averageRating - fullStars >= 0.3 && averageRating - fullStars <= 0.7;
                  const roundedFull = fullStars + (averageRating - fullStars > 0.7 ? 1 : 0);
                  for (let i = 1; i <= 5; i++) {
                    if (i <= roundedFull) {
                      stars.push(
                        <span key={i} className="material-symbols-outlined [font-variation-settings:'FILL'_1]">
                          star
                        </span>
                      );
                    } else if (i === roundedFull + 1 && hasHalf) {
                      stars.push(
                        <span key={i} className="material-symbols-outlined [font-variation-settings:'FILL'_1]">
                          star_half
                        </span>
                      );
                    } else {
                      stars.push(
                        <span key={i} className="material-symbols-outlined text-slate-300">
                          star
                        </span>
                      );
                    }
                  }
                  return stars;
                })()}
              </div>
              <div className="text-sm font-medium text-on-surface-variant">
                {reviewCount > 0 ? `Dựa trên ${reviewCount} đánh giá` : "Chưa có đánh giá"}
              </div>
            </div>
            <div className="space-y-5 lg:col-span-8">
              {!reviewsLoading && reviews.length > 0 && (
                <div className="flex flex-wrap gap-2 rounded-2xl border border-outline-variant/20 bg-[#fff7e6] p-3">
                  {(["all", 5, 4, 3, 2, 1] as ReviewFilter[]).map((filter) => {
                    const isActive = reviewFilter === filter;
                    const count = filter === "all" ? reviewCount : reviewStarCounts[filter];
                    return (
                      <button
                        key={filter}
                        type="button"
                        onClick={() => setReviewFilter(filter)}
                        className={[
                          "rounded-xl border px-4 py-2 text-xs font-extrabold transition",
                          isActive
                            ? "border-[#F5A400] bg-white text-[#9a5a00] shadow-sm"
                            : "border-transparent bg-white/60 text-on-surface-variant hover:bg-white",
                        ].join(" ")}
                      >
                        {filter === "all" ? "Tất cả" : `${filter} sao`} ({count})
                      </button>
                    );
                  })}
                </div>
              )}
              {reviewsLoading ? (
                <div className="py-8 text-center text-on-surface-variant/65">
                  <p className="text-sm font-semibold animate-pulse">Đang tải đánh giá...</p>
                </div>
              ) : reviews.length === 0 ? (
                <div className="py-12 text-center text-[#3c4a42]/60 bg-[#f8fafc] rounded-3xl border border-slate-100">
                  <span className="material-symbols-outlined mb-2 text-[40px] text-[#3c4a42]/20">
                    rate_review
                  </span>
                  <p className="text-sm font-semibold">Chưa có đánh giá nào cho sản phẩm này.</p>
                  <p className="text-xs text-[#3c4a42]/50 mt-1">Hãy mua sản phẩm và chia sẻ cảm nhận đầu tiên của bạn!</p>
                </div>
              ) : filteredReviews.length === 0 ? (
                <div className="py-10 text-center text-[#3c4a42]/60 bg-[#f8fafc] rounded-3xl border border-slate-100">
                  <span className="material-symbols-outlined mb-2 text-[36px] text-[#3c4a42]/20">
                    filter_alt_off
                  </span>
                  <p className="text-sm font-semibold">Chưa có đánh giá {reviewFilter} sao.</p>
                </div>
              ) : (
                filteredReviews.map((rev) => {
                  const getInitials = (name: string) => {
                    const parts = name.trim().split(/\s+/);
                    if (parts.length === 0) return "NS";
                    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
                    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
                  };
                  const formatReviewTime = (createdAt: string) => {
                    const date = new Date(createdAt);
                    if (isNaN(date.getTime())) return "Gần đây";
                    return date.toLocaleDateString("vi-VN", { day: "numeric", month: "numeric", year: "numeric" });
                  };
                  return (
                    <article key={rev.id} className="page-card rounded-3xl p-5 border border-slate-100 shadow-sm transition-transform hover:translate-y-[-2px] duration-300">
                      <div className="mb-4 flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#006c49]/10 font-bold text-[#006c49]">
                          {getInitials(rev.userName)}
                        </div>
                        <div>
                          <div className="font-bold text-on-surface">{rev.userName}</div>
                          <div className="flex text-[#FFB800] mt-0.5">
                            {Array.from({ length: 5 }).map((_, index) => {
                              const isActive = index < rev.rating;
                              return (
                                <span key={index} className={`material-symbols-outlined text-[16px] ${isActive ? "[font-variation-settings:'FILL'_1]" : "text-slate-200"}`}>
                                  star
                                </span>
                              );
                            })}
                          </div>
                        </div>
                        <span className="ml-auto text-xs font-semibold italic text-on-surface-variant">
                          {formatReviewTime(rev.createdAt)}
                        </span>
                      </div>
                      <p className="text-on-surface-variant text-sm pl-1">{rev.comment}</p>
                      {rev.images && rev.images.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2 pl-1">
                          {rev.images.map((image, index) => (
                            <button
                              key={`${rev.id}-image-${index}`}
                              type="button"
                              onClick={() => setSelectedImage(image)}
                              className="relative h-20 w-20 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 transition hover:border-[#F5A400]"
                              title="Xem ảnh đánh giá"
                            >
                              <Image
                                src={image}
                                alt={`Ảnh đánh giá ${index + 1}`}
                                fill
                                sizes="80px"
                                unoptimized
                                className="object-cover"
                              />
                            </button>
                          ))}
                        </div>
                      )}
                    </article>
                  );
                })
              )}
            </div>
          </div>
        )}
      </section>

      <section className="mt-10">
        <h2 className="mb-7 text-2xl font-semibold leading-8 text-on-surface">Sản phẩm tương tự</h2>
        <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
          {relatedProducts.map((item) => (
            <Link
              key={item.id}
              href={`/products/${item.id}`}
              className="page-card lift-hover group overflow-hidden rounded-3xl bg-white"
            >
              <div className="relative aspect-square overflow-hidden bg-surface-container">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="(min-width: 768px) 25vw, 50vw"
                  className="object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <h3 className="mb-1 font-bold text-on-surface transition-colors group-hover:text-primary">{item.name}</h3>
                <div className="font-bold text-primary">
                  {formatCurrency(item.price)} <span className="text-xs font-semibold text-on-surface-variant">/kg</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Report Product Modal ───────────────────────────────────────────── */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsReportModalOpen(false)} />
          <div className="relative w-full max-w-[480px] overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                Báo cáo sản phẩm
              </h2>
              <button onClick={() => setIsReportModalOpen(false)} className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-all">
                <X className="w-4 h-4 text-slate-600" />
              </button>
            </div>

            <form onSubmit={handleSubmitReport} className="p-6 space-y-5">
              <div className="space-y-3">
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider">Lý do báo cáo</label>
                <div className="grid grid-cols-1 gap-2">
                  {REPORT_REASONS.map((reason) => (
                    <label key={reason} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:bg-slate-50 cursor-pointer transition-all">
                      <input
                        type="radio"
                        name="reportReason"
                        value={reason}
                        checked={reportReason === reason}
                        onChange={(e) => setReportReason(e.target.value)}
                        className="w-4 h-4 accent-primary"
                      />
                      <span className="text-sm font-medium text-on-surface">{reason}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider">Chi tiết thêm (tùy chọn)</label>
                <textarea
                  value={reportDetails}
                  onChange={(e) => setReportDetails(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-primary transition-all resize-none bg-slate-50"
                  placeholder="Mô tả cụ thể vấn đề bạn gặp phải..."
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsReportModalOpen(false)}
                  className="flex-1 px-6 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-on-surface hover:bg-slate-50 transition-all"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={reportSubmitting}
                  className="flex-1 px-6 py-2.5 rounded-xl bg-red-500 text-white text-sm font-bold hover:bg-red-600 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {reportSubmitting ? (
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  {reportSubmitting ? "Đang gửi..." : "Gửi báo cáo"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
