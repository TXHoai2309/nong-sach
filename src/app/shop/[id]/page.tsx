"use client";

import { use, useEffect, useState, useMemo, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AlertCircle, Search, MessageSquare, Plus, Check, MoreHorizontal,
  Info, ShoppingCart, Star, MapPin, X, Pencil, Upload,
} from "lucide-react";
import Breadcrumb from "@/components/layout/Breadcrumb";
import Container from "@/components/layout/Container";
import { getShopById, STATIC_SHOPS, Shop } from "@/lib/shops";
import { getAllProducts } from "@/lib/products";
import { useCartStore } from "@/store/cart-store";
import { useAuthStore } from "@/store/auth-store";
import { formatCurrency } from "@/lib/format";
import { CATEGORY_LABELS, Product } from "@/types/product";
import CoverImageCropper from "@/components/ui/CoverImageCropper";
import { REPORT_REASONS } from "@/types/report";
import { useReportStore } from "@/store/report-store";

interface PageProps {
  params: Promise<{ id: string }>;
}

type TabKey = "products" | "reviews" | "about";

// ── Provinces fallback (for the edit modal) ────────────────────────────────
const PROVINCES_API = "https://provinces.open-api.vn/api/v1/?depth=1";
const FALLBACK_PROVINCES = [
  { code: 79, name: "Thành phố Hồ Chí Minh" },
  { code: 1, name: "Thành phố Hà Nội" },
  { code: 48, name: "Thành phố Đà Nẵng" },
  { code: 68, name: "Lâm Đồng" },
  { code: 31, name: "Hải Phòng" },
  { code: 92, name: "Cần Thơ" },
  { code: 74, name: "Bình Dương" },
];

// ── Derive a reactive Shop object from Zustand currentUser ─────────────────
function buildShopFromCurrentUser(
  currentUser: ReturnType<typeof useAuthStore.getState>["currentUser"],
  productCount: number,
): Shop | null {
  if (!currentUser || !currentUser.sellerInfo) return null;
  const info = currentUser.sellerInfo;
  return {
    id: currentUser.id,
    name: info.shopName,
    logo: info.shopLogo || "https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?w=120&h=120&fit=crop",
    verified: true,
    rating: 5.0,
    reviewCount: 0,
    productCount,
    followerCount: "0",
    joinDate: currentUser.memberSince || "06/2026",
    location: info.province || "Lâm Đồng",
    slogan: info.slogan || "Cung cấp nông sản sạch tươi ngon hữu cơ",
    altitude: info.farmAddress || "Đà Lạt",
    standard: info.farmingStandards?.join(", ") || "VietGAP",
    description: info.description || "Nông sản sạch từ nông trại của tôi.",
    farmImages: info.farmImages && info.farmImages.length > 0
      ? info.farmImages
      : ["https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600&h=400&fit=crop"],
    mainCategories: info.mainCategories || ["Rau củ"],
  };
}

// ═══════════════════════════════════════════════════════════════════════════
export default function ShopDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>("products");
  const [isFollowed, setIsFollowed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("popular");

  // ── Edit shop modal state ───────────────────────────────────────────────
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editSlogan, setEditSlogan] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editZalo, setEditZalo] = useState("");
  const [editFarmAddress, setEditFarmAddress] = useState("");
  const [editProvinceCode, setEditProvinceCode] = useState<number | "">("");
  const [editProvinceName, setEditProvinceName] = useState("");
  const [editLogo, setEditLogo] = useState<string>("");
  const [editCoverImage, setEditCoverImage] = useState<string>("");
  const [editCoverUrl, setEditCoverUrl] = useState("");
  const [cropSrc, setCropSrc] = useState<string | null>(null); // raw src waiting to be cropped
  const [editFarmImages, setEditFarmImages] = useState<string[]>([]);
  const [editStandards, setEditStandards] = useState<string[]>([]);
  const [editCategories, setEditCategories] = useState<string[]>([]);
  const [editBankName, setEditBankName] = useState("Vietcombank");
  const [editBankAccount, setEditBankAccount] = useState("");
  const [editBankHolder, setEditBankHolder] = useState("");
  const [provinces, setProvinces] = useState<{ code: number; name: string }[]>([]);
  const [editSaving, setEditSaving] = useState(false);
  const [editToast, setEditToast] = useState<string | null>(null);

  // ── Report modal state ───────────────────────────────────────────────
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState(REPORT_REASONS[0]);
  const [reportDetails, setReportDetails] = useState("");
  const [reportSubmitting, setReportSubmitting] = useState(false);
  const addReport = useReportStore((state) => state.addReport);

  const [isTopMenuOpen, setIsTopMenuOpen] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Đã sao chép liên kết cửa hàng vào bộ nhớ tạm!");
    setIsTopMenuOpen(false);
  };

  const handleReport = () => {
    setIsReportModalOpen(true);
    setIsTopMenuOpen(false);
  };

  const handleSubmitReport = (e: FormEvent) => {
    e.preventDefault();
    if (!reportReason) return;
    
    setReportSubmitting(true);
    addReport({
      type: 'shop',
      shopId: id,
      shopName: shop?.name || "Cửa hàng không xác định",
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
      alert("Cảm ơn bạn đã báo cáo. Chúng tôi sẽ xem xét cửa hàng này trong vòng 24h.");
    }, 600);
  };

  const handleHelp = () => {
    alert("Hệ thống hỗ trợ Zalo: 0392 982 XXX (Hotline: 1900 1234).");
    setIsTopMenuOpen(false);
  };

  // Close top menu when clicking outside
  useEffect(() => {
    if (!isTopMenuOpen) return;
    const handleClick = () => setIsTopMenuOpen(false);
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [isTopMenuOpen]);

  const { currentUser, updateSellerInfo } = useAuthStore();
  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => { setMounted(true); }, []);

  // Load provinces for edit modal
  useEffect(() => {
    if (!mounted) return;
    async function load() {
      try {
        const res = await fetch(PROVINCES_API);
        if (!res.ok) throw new Error();
        const data = await res.json();
        setProvinces(data.length > 0 ? data : FALLBACK_PROVINCES);
      } catch {
        setProvinces(FALLBACK_PROVINCES);
      }
    }
    load();
  }, [mounted]);

  // ── Resolve all products (reactive: re-reads from localStorage each render) ─
  const allProducts = useMemo(() => {
    if (!mounted) return [];
    return getAllProducts();
  }, [mounted]);

  // ── Resolve Shop – REACTIVE: derive from Zustand for the owner ────────────
  const shop = useMemo((): Shop | null => {
    if (!mounted) return null;

    // If the currently-logged-in user IS this shop, build reactively
    if (currentUser && currentUser.id === id && currentUser.sellerInfo) {
      const count = allProducts.filter((p) => p.sellerId === id).length;
      return buildShopFromCurrentUser(currentUser, count);
    }

    // Otherwise use localStorage / static data as before
    return getShopById(id);
  }, [id, mounted, currentUser, allProducts]);

  const isOwner = mounted && currentUser?.id === id && !!currentUser?.sellerInfo;

  // ── Shop products ─────────────────────────────────────────────────────────
  const shopProducts = useMemo(() => {
    if (!mounted || !shop) return [];
    return allProducts.filter((p) => {
      if (p.sellerId) return p.sellerId === shop.id;
      if (shop.id === "vuon-sach-da-lat") return ["1", "2", "7", "8"].includes(p.id);
      if (shop.id === "nong-trai-xanh") return ["4", "5", "6"].includes(p.id);
      if (shop.id === "rau-sach-organic") return ["3", "9"].includes(p.id);
      if (shop.id === "moc-farm-da-lat") return ["10"].includes(p.id);
      return false;
    });
  }, [shop, mounted, allProducts]);

  const shopCategories = useMemo(() => {
    return Array.from(new Set(shopProducts.map((p) => p.category)));
  }, [shopProducts]);

  const filteredProducts = useMemo(() => {
    let result = [...shopProducts];
    if (selectedCategory !== "all") result = result.filter((p) => p.category === selectedCategory);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    if (sortBy === "price-asc") result.sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") result.sort((a, b) => b.price - a.price);
    if (sortBy === "name-asc") result.sort((a, b) => a.name.localeCompare(b.name));
    return result;
  }, [shopProducts, selectedCategory, searchQuery, sortBy]);

  const similarShops = useMemo(() => STATIC_SHOPS.filter((s) => s.id !== id).slice(0, 3), [id]);

  // ── Follower Count Logic ──────────────────────────────────────────────────
  const [displayFollowers, setDisplayFollowers] = useState<string | number>(0);

  // Helper to parse "2.4K" to 2400
  const parseFollowers = (val: string | number): number => {
    if (typeof val === "number") return val;
    const match = val.match(/^(\d+(?:\.\d+)?)(K|M)?$/);
    if (!match) return 0;
    let num = parseFloat(match[1]);
    const unit = match[2];
    if (unit === "K") return num * 1000;
    if (unit === "M") return num * 1000000;
    return num;
  };

  // Helper to format 2400 to "2.4K"
  const formatFollowers = (num: number): string | number => {
    if (num < 1000) return num;
    if (num < 1000000) return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
    return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  };

  useEffect(() => {
    if (shop) {
      setDisplayFollowers(shop.followerCount);
    }
  }, [shop]);

  const handleToggleFollow = () => {
    const nextFollowed = !isFollowed;
    setIsFollowed(nextFollowed);
    
    const currentNum = parseFollowers(displayFollowers);
    const nextNum = nextFollowed ? currentNum + 1 : Math.max(0, currentNum - 1);
    setDisplayFollowers(formatFollowers(nextNum));
  };

  const handleMessageClick = () => alert(`Chức năng nhắn tin với "${shop?.name}" đang phát triển ở Phase 2!`);
  const handleAddToCart = (product: Product) => {
    if (!currentUser) { alert("Vui lòng đăng nhập để thêm vào giỏ hàng!"); return; }
    addToCart(product);
    alert(`Đã thêm "${product.name}" vào giỏ hàng!`);
  };

  // ── Open edit modal pre-filled ────────────────────────────────────────────
  const openEditModal = () => {
    if (!currentUser?.sellerInfo) return;
    const info = currentUser.sellerInfo;
    setEditName(info.shopName || "");
    setEditSlogan(info.slogan || "");
    setEditDescription(info.description || "");
    setEditPhone(info.shopPhone || "");
    setEditZalo(info.shopZalo || "");
    setEditFarmAddress(info.farmAddress || "");
    setEditProvinceName(info.province || "");
    const matchedProv = provinces.find((p) => p.name === info.province);
    setEditProvinceCode(matchedProv ? matchedProv.code : "");
    setEditLogo(info.shopLogo || "");
    setEditCoverImage(info.coverImage || "");
    setEditCoverUrl(info.coverImage || "");
    setEditFarmImages(info.farmImages || []);
    setEditStandards(info.farmingStandards || []);
    setEditCategories(info.mainCategories || []);
    setEditBankName(info.bankName || "Vietcombank");
    setEditBankAccount(info.bankAccountNumber || "");
    setEditBankHolder(info.bankAccountName || "");
    setIsEditOpen(true);
  };

  const handleEditSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) { setEditToast("Vui lòng nhập tên shop"); return; }
    if (!editDescription.trim()) { setEditToast("Vui lòng nhập mô tả shop"); return; }

    const selectedProv = provinces.find((p) => p.code === Number(editProvinceCode));

    setEditSaving(true);
    updateSellerInfo({
      shopName: editName.trim(),
      slogan: editSlogan.trim(),
      shopPhone: editPhone.trim(),
      shopZalo: editZalo.trim() || editPhone.trim(),
      description: editDescription.trim(),
      shopLogo: editLogo || undefined,
      coverImage: editCoverImage || undefined,
      farmImages: editFarmImages.length > 0 ? editFarmImages : undefined,
      mainCategories: editCategories.length > 0 ? editCategories : ["Rau củ"],
      province: selectedProv?.name || editProvinceName || "Lâm Đồng",
      farmAddress: editFarmAddress.trim(),
      farmingStandards: editStandards.length > 0 ? editStandards : ["VietGAP"],
      farmingStandardsDetail: currentUser?.sellerInfo?.farmingStandardsDetail || undefined,
      idCardNumber: currentUser?.sellerInfo?.idCardNumber || "",
      idCardFront: currentUser?.sellerInfo?.idCardFront,
      idCardBack: currentUser?.sellerInfo?.idCardBack,
      bankName: editBankName,
      bankAccountNumber: editBankAccount.trim(),
      bankAccountName: editBankHolder.trim().toUpperCase(),
    });

    setTimeout(() => {
      setEditSaving(false);
      setIsEditOpen(false);
      setEditToast(null);
    }, 400);
  };

  // Loading
  if (!mounted || !shop) {
    return (
      <div className="page-surface min-h-screen py-12 flex items-center justify-center">
        <p className="text-xs font-bold text-[#3c4a42]/60 animate-pulse">Đang tải thông tin cửa hàng...</p>
      </div>
    );
  }

  // Cover image — custom sellers can set their own; static shops use curated photos
  const coverImage = currentUser?.sellerInfo?.coverImage && shop.id === currentUser.id
    ? currentUser.sellerInfo.coverImage
    : shop.id === "vuon-sach-da-lat"
      ? "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=2000&q=90&fit=crop"
      : shop.id === "nong-trai-xanh"
        ? "https://images.unsplash.com/photo-1464226184884-fa280b87c3ab?w=2000&q=90&fit=crop"
        : shop.id === "rau-sach-organic"
          ? "https://images.unsplash.com/photo-1516253593875-bd7ba052fbc5?w=2000&q=90&fit=crop"
          : "https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?w=2000&q=90&fit=crop";

  const FARMING_STANDARDS = ["VietGAP", "GlobalGAP", "USDA Organic", "Hữu cơ", "Sạch tự nhiên", "An toàn thực phẩm"];
  const MAIN_CATEGORIES_LIST = ["Rau củ", "Trái cây", "Thảo mộc", "Ngũ cốc", "Củ quả", "Nấm", "Đặc sản"];
  const BANKS = ["Vietcombank", "Agribank", "BIDV", "VietinBank", "Techcombank", "MB Bank", "VPBank", "ACB", "Sacombank"];

  return (
    <div className="page-surface min-h-screen pb-12">

      {/* ── 1. Header Banner ───────────────────────────────────────────────── */}
      <div className="site-container mt-4 md:mt-6">
        <div className="relative h-[200px] md:h-[300px] w-full overflow-hidden rounded-b-3xl bg-emerald-900/10 shadow-md">
          <Image
            src={coverImage}
            alt={shop.name}
            fill
            priority
            sizes="(min-width: 1120px) 1120px, 100vw"
            className="object-cover opacity-90"
            unoptimized={coverImage.startsWith("data:")}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />

          {/* Utility Menu Button — top-right of cover */}
          <div className="absolute top-4 right-4 z-30">
            <div className="relative">
              <button
                onClick={(e) => { e.stopPropagation(); setIsTopMenuOpen(!isTopMenuOpen); }}
                className="flex items-center justify-center bg-black/25 hover:bg-black/40 border border-white/20 backdrop-blur-md w-10 h-10 rounded-full text-white transition-all shadow-md cursor-pointer"
                title="Tùy chọn"
              >
                <MoreHorizontal className="w-5 h-5" />
              </button>

              {/* Dropdown Menu */}
              {isTopMenuOpen && (
                <div className="absolute top-12 right-0 w-48 bg-white/95 backdrop-blur-xl border border-slate-100 rounded-2xl shadow-2xl py-2 z-50 overflow-hidden animate-in fade-in zoom-in duration-200 origin-top-right">
                  {isOwner && (
                    <button
                      onClick={openEditModal}
                      className="w-full px-4 py-2.5 text-left text-sm font-bold text-primary hover:bg-primary/5 flex items-center gap-2.5 transition-colors border-b border-slate-50"
                    >
                      <Pencil className="w-4 h-4" />
                      Chỉnh sửa shop
                    </button>
                  )}
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
                    <span className="material-symbols-outlined text-[18px]">report</span>
                    Báo cáo shop
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleHelp(); }}
                    className="w-full px-4 py-2.5 text-left text-sm font-bold text-on-surface hover:bg-slate-50 flex items-center gap-2.5 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">help</span>
                    Bạn cần giúp đỡ?
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="absolute bottom-4 left-6 right-6 z-20">
            <Breadcrumb
              items={[
                { label: "Trang chủ", href: "/" },
                { label: "Cửa hàng", href: "/products" },
                { label: shop.name },
              ]}
              className="text-white/80 [&_a]:text-white/90 [&_span]:text-white/60 mb-2"
            />
          </div>
        </div>
      </div>

      {/* ── 2. Shop Info Card ──────────────────────────────────────────────── */}
      <div className="site-container relative -mt-16 z-30 mb-8">
        <div className="rounded-b-3xl border border-outline-variant/30 bg-white p-6 shadow-xl flex flex-col lg:flex-row justify-between gap-6">

          {/* Branding */}
          <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
            <div className="relative w-24 h-24 rounded-full border-4 border-white shadow-md overflow-hidden bg-white shrink-0">
              <Image src={shop.logo} alt={shop.name} fill className="object-cover" />
              <div className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-1 border-2 border-white flex items-center justify-center w-6 h-6">
                <Check className="w-3.5 h-3.5 stroke-[4px]" />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center flex-wrap gap-2.5">
                <h1 className="text-2xl font-bold text-on-surface leading-tight">{shop.name}</h1>
                <span className="inline-flex rounded-full bg-slate-100 text-slate-700 px-3 py-0.5 text-xs font-bold border border-slate-200">
                  {shop.standard}
                </span>
                {isOwner && (
                  <button
                    onClick={openEditModal}
                    className="inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white px-3 py-0.5 text-xs font-bold border border-primary/20 transition-all"
                    title="Chỉnh sửa shop"
                  >
                    <Pencil className="w-3 h-3" />
                    Chỉnh sửa
                  </button>
                )}
              </div>
              <p className="text-sm font-medium text-on-surface-variant italic leading-relaxed">{shop.slogan}</p>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 border border-emerald-200">
                  <span className="material-symbols-outlined text-[12px] font-bold text-emerald-600 [font-variation-settings:'FILL'_1]">check_circle</span>
                  Đã xác minh
                </span>
                {shop.altitude && (
                  <span className="inline-flex items-center gap-0.5 rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-700 border border-slate-200">
                    {shop.altitude}
                  </span>
                )}
                <span className="inline-flex items-center gap-0.5 rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-700 border border-slate-200">
                  <MapPin className="w-3 h-3 text-red-500" />
                  {shop.location}
                </span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div
            className="flex flex-row items-center justify-around gap-2 sm:gap-4 px-4 py-4 rounded-2xl bg-slate-50 border border-outline-variant/20 self-center w-full lg:w-auto shrink-0"
            style={{ minWidth: "min(100%, 420px)" }}
          >
            <div className="text-center flex-1 px-1 sm:px-2">
              <div className="text-lg font-bold text-on-surface flex items-center justify-center gap-0.5 whitespace-nowrap">
                <Star className="w-4 h-4 fill-[#FFB800] stroke-[#FFB800] shrink-0" />
                {shop.rating}
              </div>
              <div className="text-[10px] font-bold text-on-surface-variant uppercase mt-0.5 whitespace-nowrap">Đánh giá</div>
            </div>
            <div className="text-center flex-1 px-1 sm:px-2 border-l border-outline-variant/30">
              <div className="text-lg font-bold text-on-surface whitespace-nowrap">{shopProducts.length}</div>
              <div className="text-[10px] font-bold text-on-surface-variant uppercase mt-0.5 whitespace-nowrap">Sản phẩm</div>
            </div>
            <div className="text-center flex-1 px-1 sm:px-2 border-l border-outline-variant/30">
              <div className="text-lg font-bold text-on-surface whitespace-nowrap">{displayFollowers}</div>
              <div className="text-[10px] font-bold text-on-surface-variant uppercase mt-0.5 whitespace-nowrap">Người theo dõi</div>
            </div>
            <div className="text-center flex-1 px-1 sm:px-2 border-l border-outline-variant/30">
              <div className="text-xs sm:text-sm font-bold text-on-surface whitespace-nowrap">{shop.joinDate}</div>
              <div className="text-[10px] font-bold text-on-surface-variant uppercase mt-0.5 whitespace-nowrap">Tham gia</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex sm:flex-row lg:flex-col justify-end gap-3 self-center shrink-0 w-full lg:w-auto">
            <button
              onClick={handleToggleFollow}
              className={[
                "flex-1 lg:flex-none inline-flex items-center justify-center gap-1.5 px-6 py-2.5 rounded-full font-bold text-sm transition-all shadow-sm",
                isFollowed
                  ? "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300"
                  : "bg-primary hover:bg-primary-container text-white",
              ].join(" ")}
            >
              {isFollowed ? (<><Check className="w-4 h-4" />Đang theo dõi</>) : (<><Plus className="w-4 h-4" />Theo dõi</>)}
            </button>
            <button
              onClick={handleMessageClick}
              className="flex-1 lg:flex-none inline-flex items-center justify-center gap-1.5 border border-slate-300 px-5 py-2.5 rounded-full font-bold text-sm text-on-surface hover:bg-slate-50 transition-all shadow-sm bg-white"
            >
              <MessageSquare className="w-4 h-4 text-primary" />
              Nhắn tin
            </button>
          </div>
        </div>
      </div>

      {/* ── 3. Main Body ───────────────────────────────────────────────────── */}
      <main className="site-container">

        {/* About Banner */}
        <div className="mb-8 p-5 rounded-2xl border border-primary/10 bg-primary/[0.02] flex gap-3 text-sm leading-6 text-on-surface-variant">
          <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-on-surface text-sm mb-1">Giới thiệu về vườn</h3>
            <p>{shop.description}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-7 flex gap-8 overflow-x-auto border-b border-outline-variant/30">
          {[
            ["products", `Sản phẩm (${shopProducts.length})`],
            ["reviews", `Đánh giá (${shop.reviewCount})`],
            ["about", "Giới thiệu"],
          ].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as TabKey)}
              className={[
                "whitespace-nowrap pb-4 text-lg font-bold transition-all relative",
                activeTab === key
                  ? "text-primary after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[3px] after:bg-primary after:rounded-full"
                  : "text-on-surface-variant hover:text-primary",
              ].join(" ")}
              type="button"
            >
              {label}
            </button>
          ))}
        </div>

        {/* Tab: Products */}
        {activeTab === "products" && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={["px-4 py-1.5 rounded-full text-xs font-bold border transition-all", selectedCategory === "all" ? "bg-primary text-white border-primary" : "bg-white text-on-surface-variant border-slate-200 hover:border-primary"].join(" ")}
                >Tất cả</button>
                {shopCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={["px-4 py-1.5 rounded-full text-xs font-bold border transition-all", selectedCategory === cat ? "bg-primary text-white border-primary" : "bg-white text-on-surface-variant border-slate-200 hover:border-primary"].join(" ")}
                  >{CATEGORY_LABELS[cat]}</button>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                <div className="relative flex-1 sm:w-64">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/50" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm trong shop..."
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:border-primary transition-all bg-white text-on-surface"
                  />
                </div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:border-primary transition-all bg-white text-on-surface"
                >
                  <option value="popular">Phổ biến nhất</option>
                  <option value="price-asc">Giá tăng dần</option>
                  <option value="price-desc">Giá giảm dần</option>
                  <option value="name-asc">Tên A-Z</option>
                </select>
              </div>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="py-16 text-center border border-dashed border-outline-variant/30 rounded-2xl bg-slate-50/50">
                <AlertCircle className="w-10 h-10 text-on-surface-variant/30 mx-auto mb-2" />
                <h3 className="text-base font-bold text-on-surface">Không tìm thấy sản phẩm phù hợp.</h3>
                <p className="text-xs text-on-surface-variant mt-1">Vui lòng thử từ khóa hoặc bộ lọc khác.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {filteredProducts.map((p) => (
                  <div
                    key={p.id}
                    className="group page-card flex flex-col justify-between overflow-hidden rounded-2xl border border-outline-variant/20 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                  >
                    <div className="relative aspect-square w-full overflow-hidden bg-slate-50">
                      <Image src={p.image} alt={p.name} fill sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                      {p.isOrganic && (
                        <div className="absolute left-3 top-3 bg-primary text-white px-2 py-0.5 rounded-full text-[10px] font-bold shadow-sm">Hữu cơ</div>
                      )}
                      <button className="absolute right-3 top-3 w-8 h-8 rounded-full bg-white/85 backdrop-blur-sm border border-slate-100 flex items-center justify-center text-on-surface-variant hover:text-red-500 hover:bg-white shadow-sm transition-all active:scale-90">
                        <span className="material-symbols-outlined text-[18px] [font-variation-settings:'FILL'_0]">favorite</span>
                      </button>
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                      <span className="text-[10px] font-bold text-primary uppercase tracking-wide">{CATEGORY_LABELS[p.category]}</span>
                      <Link href={`/products/${p.id}`} className="font-bold text-on-surface text-sm sm:text-base line-clamp-1 hover:text-primary transition-colors mt-0.5">
                        {p.name}
                      </Link>
                      <div className="flex items-center gap-1.5 mt-1 text-[11px] text-on-surface-variant/80 font-medium">
                        <span>{p.origin}</span>
                        <span>•</span>
                        <div className="flex items-center gap-0.5 text-[#FFB800]">
                          <span className="material-symbols-outlined text-[12px] [font-variation-settings:'FILL'_1]">star</span>
                          <span className="text-on-surface font-bold text-[11px]">4.8</span>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center justify-between gap-2">
                        <div className="text-sm sm:text-base font-bold text-primary">
                          {formatCurrency(p.price)}
                          <span className="text-[10px] font-normal text-on-surface-variant"> / {p.unit || "kg"}</span>
                        </div>
                        <button
                          onClick={() => handleAddToCart(p)}
                          className="w-8.5 h-8.5 rounded-full bg-primary/10 hover:bg-primary text-primary hover:text-white flex items-center justify-center transition-all active:scale-90"
                          title="Thêm vào giỏ"
                        >
                          <ShoppingCart className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab: Reviews */}
        {activeTab === "reviews" && (
          <div className="max-w-[720px] space-y-6">
            {[
              { name: "Phạm Minh Hoàng", rating: 5, date: "28/05/2026", comment: "Rau cải và cà chua từ vườn này siêu tươi luôn, đóng gói cẩn thận. Nhà mình mua ở đây nhiều lần rồi, cực kỳ an tâm về chất lượng VietGAP." },
              { name: "Nguyễn Thị Mai", rating: 5, date: "15/05/2026", comment: "Bưởi da xanh mọng nước, ngọt thanh rất ngon. Giao hàng nhanh ngay trong ngày, cám ơn vườn đã hỗ trợ nhiệt tình." },
              { name: "Lê Văn Đức", rating: 4, date: "02/05/2026", comment: "Sản phẩm chất lượng tốt, đúng mô tả. Ủng hộ nhà vườn tiếp tục canh tác hữu cơ chất lượng cao nhé." },
            ].map((review, i) => (
              <div key={i} className="p-5 border border-outline-variant/20 rounded-2xl bg-white shadow-sm space-y-2">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">{review.name.charAt(0)}</div>
                    <div>
                      <h4 className="font-bold text-on-surface text-sm">{review.name}</h4>
                      <div className="flex items-center text-[#FFB800] mt-0.5">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <span key={idx} className={`material-symbols-outlined text-[14px] ${idx < review.rating ? "[font-variation-settings:'FILL'_1]" : ""}`}>star</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-on-surface-variant">{review.date}</span>
                </div>
                <p className="text-xs leading-5.5 text-on-surface-variant/90 pl-10">{review.comment}</p>
              </div>
            ))}
          </div>
        )}

        {/* Tab: About */}
        {activeTab === "about" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              <div className="p-6 border border-outline-variant/20 rounded-2xl bg-white shadow-sm space-y-4">
                <h3 className="text-base font-bold text-on-surface border-b border-outline-variant/20 pb-3 flex items-center gap-2">
                  <Info className="w-4 h-4 text-primary" />
                  Quy trình canh tác & Tiêu chuẩn
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-xs text-on-surface-variant font-semibold uppercase block tracking-wider">Tiêu chuẩn chất lượng</span>
                    <span className="font-bold text-primary mt-1 block">{shop.standard}</span>
                  </div>
                  <div>
                    <span className="text-xs text-on-surface-variant font-semibold uppercase block tracking-wider">Địa chỉ / Độ cao canh tác</span>
                    <span className="font-bold text-on-surface mt-1 block">{shop.altitude || "Tự nhiên"}</span>
                  </div>
                  <div>
                    <span className="text-xs text-on-surface-variant font-semibold uppercase block tracking-wider">Danh mục chính</span>
                    <span className="font-bold text-on-surface mt-1 block">{shop.mainCategories.join(", ")}</span>
                  </div>
                  <div>
                    <span className="text-xs text-on-surface-variant font-semibold uppercase block tracking-wider">Khu vực địa lý</span>
                    <span className="font-bold text-on-surface mt-1 block">{shop.location}</span>
                  </div>
                </div>
              </div>

              <div className="p-6 border border-outline-variant/20 rounded-2xl bg-white shadow-sm space-y-4">
                <h3 className="text-base font-bold text-on-surface pb-1">Album ảnh nông trại</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {shop.farmImages.map((img, idx) => (
                    <div key={idx} className="relative aspect-[3/2] overflow-hidden rounded-xl bg-slate-50 border border-slate-100">
                      <Image src={img} alt="Ảnh nông trại" fill className="object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="p-6 border border-outline-variant/20 rounded-2xl bg-white shadow-sm space-y-4">
                <h3 className="text-base font-bold text-on-surface border-b border-outline-variant/20 pb-3">Thông tin liên hệ</h3>
                <ul className="text-sm space-y-3 font-semibold text-on-surface-variant">
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-primary">call</span>
                    <span>SĐT: {currentUser?.sellerInfo?.shopPhone || "0392 982 XXX"}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-primary">chat_bubble</span>
                    <span>Zalo shop: {shop.name}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-red-500" />
                    <span>Địa chỉ: {shop.location}</span>
                  </li>
                </ul>
              </div>

              {/* Bank info for custom sellers */}
              {!["vuon-sach-da-lat", "nong-trai-xanh", "rau-sach-organic", "moc-farm-da-lat"].includes(shop.id) && currentUser?.sellerInfo && (
                <div className="p-6 border border-emerald-200/50 rounded-2xl bg-emerald-50/40 shadow-sm space-y-4">
                  <h3 className="text-base font-bold text-emerald-800 border-b border-emerald-200/50 pb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-emerald-700">payments</span>
                    Tài khoản thanh toán
                  </h3>
                  <ul className="text-xs space-y-2.5 font-bold text-emerald-900/90">
                    <li>
                      <span className="text-[10px] font-semibold text-emerald-700/80 block uppercase tracking-wider">Ngân hàng</span>
                      <span className="text-sm font-bold text-emerald-950">{currentUser.sellerInfo.bankName}</span>
                    </li>
                    <li>
                      <span className="text-[10px] font-semibold text-emerald-700/80 block uppercase tracking-wider">Số tài khoản</span>
                      <span className="text-sm font-bold text-emerald-950 font-mono tracking-wider">{currentUser.sellerInfo.bankAccountNumber}</span>
                    </li>
                    <li>
                      <span className="text-[10px] font-semibold text-emerald-700/80 block uppercase tracking-wider">Chủ tài khoản</span>
                      <span className="text-sm font-bold text-emerald-950 uppercase">{currentUser.sellerInfo.bankAccountName}</span>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Similar Shops */}
        <section className="mt-16 border-t border-outline-variant/20 pt-12">
          <h2 className="text-2xl font-bold text-on-surface mb-8 text-center sm:text-left">Cửa hàng tương tự</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {similarShops.map((item) => (
              <div key={item.id} className="p-5 border border-outline-variant/20 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                <div className="flex items-center gap-3.5 mb-4">
                  <div className="relative w-12 h-12 overflow-hidden rounded-full border border-slate-100 shrink-0 bg-slate-50">
                    <Image src={item.logo} alt={item.name} fill className="object-cover" />
                  </div>
                  <div>
                    <h3 className="font-bold text-on-surface text-sm sm:text-base line-clamp-1">{item.name}</h3>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-on-surface-variant font-semibold">
                      <div className="flex items-center gap-0.5 text-[#FFB800]">
                        <span className="material-symbols-outlined text-[12px] [font-variation-settings:'FILL'_1]">star</span>
                        <span>{item.rating}</span>
                      </div>
                      <span>•</span>
                      <span>{item.reviewCount} đánh giá</span>
                    </div>
                  </div>
                </div>
                <div className="text-xs text-on-surface-variant/90 line-clamp-2 mb-4 leading-relaxed italic">&ldquo;{item.slogan}&rdquo;</div>
                <div className="flex items-center justify-between gap-3 text-xs border-t border-slate-50 pt-4">
                  <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-on-surface-variant/80">
                    <MapPin className="w-3.5 h-3.5 text-red-400" />
                    {item.location}
                  </span>
                  <Link href={`/shop/${item.id}`} className="inline-flex rounded-xl bg-slate-50 border border-slate-200 hover:border-primary hover:bg-primary/5 text-xs font-bold text-on-surface hover:text-primary transition-all px-4.5 py-2">
                    Xem cửa hàng
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* ── Edit Shop Modal ─────────────────────────────────────────────────── */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsEditOpen(false)} />

          {/* Modal panel */}
          <div className="relative w-full max-w-[672px] max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-white rounded-t-3xl flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
                <Pencil className="w-5 h-5 text-primary" />
                Chỉnh sửa thông tin cửa hàng
              </h2>
              <button onClick={() => setIsEditOpen(false)} className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-all">
                <X className="w-4 h-4 text-slate-600" />
              </button>
            </div>

            {/* Error toast */}
            {editToast && (
              <div className="mx-6 mt-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-semibold">
                {editToast}
              </div>
            )}

            <form onSubmit={handleEditSubmit} className="p-6 space-y-5">

              {/* ── Cover Image ─────────────────────────────────────────────── */}
              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-2 uppercase tracking-wider">
                  Ảnh bìa cửa hàng
                </label>

                {/* Preview */}
                <div className="relative w-full h-36 rounded-2xl overflow-hidden bg-slate-100 border-2 border-dashed border-slate-200 mb-3 group">
                  {editCoverImage ? (
                    <>
                      <Image
                        src={editCoverImage}
                        alt="Ảnh bìa"
                        fill
                        className="object-cover"
                        unoptimized={editCoverImage.startsWith("data:")}
                      />
                      <button
                        type="button"
                        onClick={() => setCropSrc(editCoverImage)}
                        className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer w-full h-full border-none p-0"
                      >
                        <span className="text-white text-xs font-bold bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-sm">
                          Cắt / Chỉnh sửa ảnh
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => { setEditCoverImage(""); setEditCoverUrl(""); }}
                        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-all z-10"
                        title="Xóa ảnh bìa"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full gap-2 text-on-surface-variant/50">
                      <Upload className="w-8 h-8" />
                      <span className="text-xs font-semibold">Chưa có ảnh bìa</span>
                    </div>
                  )}
                </div>

                {/* Upload button */}
                <div className="flex gap-2 items-center">
                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 text-xs font-bold border border-primary/20 transition-all">
                    <Upload className="w-3.5 h-3.5" />
                    Tải ảnh lên
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onload = (ev) => {
                          // Open cropper instead of setting directly
                          setCropSrc(ev.target?.result as string);
                        };
                        reader.readAsDataURL(file);
                        // Reset so same file can be re-selected
                        e.target.value = "";
                      }}
                    />
                  </label>
                  <span className="text-on-surface-variant/40 text-xs font-semibold">hoặc dán URL ảnh:</span>
                  <input
                    type="url"
                    value={editCoverUrl.startsWith("data:") ? "" : editCoverUrl}
                    onChange={(e) => setEditCoverUrl(e.target.value)}
                    onBlur={(e) => {
                      const url = e.target.value.trim();
                      if (url.startsWith("http")) setCropSrc(url);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        const url = editCoverUrl.trim();
                        if (url.startsWith("http")) setCropSrc(url);
                      }
                    }}
                    placeholder="https://... rồi nhấn Enter"
                    className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-primary transition-all"
                  />
                </div>
                <p className="text-[10px] text-on-surface-variant/50 font-medium mt-1.5">
                  Ảnh sẽ được cắt theo tỉ lệ 16:5 để khớp với banner cửa hàng.
                </p>
              </div>

              {/* ── Divider ──────────────────────────────────────────────────── */}
              <div className="border-t border-slate-100" />

              {/* Shop Name */}
              <div>

                <label className="block text-xs font-bold text-on-surface-variant mb-1.5 uppercase tracking-wider">Tên cửa hàng <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-primary transition-all"
                  placeholder="Tên cửa hàng của bạn"
                />
              </div>

              {/* Slogan */}
              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1.5 uppercase tracking-wider">Slogan / Khẩu hiệu</label>
                <input
                  type="text"
                  value={editSlogan}
                  onChange={(e) => setEditSlogan(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-primary transition-all"
                  placeholder="VD: Tươi từ vườn mỗi ngày..."
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1.5 uppercase tracking-wider">Mô tả cửa hàng <span className="text-red-500">*</span></label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-primary transition-all resize-none"
                  placeholder="Giới thiệu về cửa hàng, quy trình canh tác..."
                />
              </div>

              {/* Phone */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant mb-1.5 uppercase tracking-wider">SĐT cửa hàng</label>
                  <input
                    type="tel"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-primary transition-all"
                    placeholder="0xxxxxxxxx"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant mb-1.5 uppercase tracking-wider">Tỉnh / Thành phố</label>
                  <select
                    value={editProvinceCode}
                    onChange={(e) => {
                      setEditProvinceCode(Number(e.target.value) || "");
                      const prov = provinces.find((p) => p.code === Number(e.target.value));
                      setEditProvinceName(prov?.name || "");
                    }}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-primary transition-all bg-white"
                  >
                    <option value="">-- Chọn tỉnh --</option>
                    {provinces.map((p) => (
                      <option key={p.code} value={p.code}>{p.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Farm Address */}
              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1.5 uppercase tracking-wider">Địa chỉ cụ thể nông trại</label>
                <input
                  type="text"
                  value={editFarmAddress}
                  onChange={(e) => setEditFarmAddress(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-primary transition-all"
                  placeholder="Số nhà, đường, xã/phường..."
                />
              </div>

              {/* Categories */}
              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-2 uppercase tracking-wider">Danh mục nông sản chủ đạo</label>
                <div className="flex flex-wrap gap-2">
                  {MAIN_CATEGORIES_LIST.map((cat) => {
                    const active = editCategories.includes(cat);
                    return (
                      <button
                        type="button"
                        key={cat}
                        onClick={() => setEditCategories(active ? editCategories.filter((c) => c !== cat) : [...editCategories, cat])}
                        className={["px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all", active ? "bg-primary text-white border-primary" : "bg-white text-on-surface-variant border-slate-200 hover:border-primary"].join(" ")}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Standards */}
              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-2 uppercase tracking-wider">Tiêu chuẩn canh tác</label>
                <div className="flex flex-wrap gap-2">
                  {FARMING_STANDARDS.map((std) => {
                    const active = editStandards.includes(std);
                    return (
                      <button
                        type="button"
                        key={std}
                        onClick={() => setEditStandards(active ? editStandards.filter((s) => s !== std) : [...editStandards, std])}
                        className={["px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all", active ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-on-surface-variant border-slate-200 hover:border-emerald-500"].join(" ")}
                      >
                        {std}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Bank Info */}
              <div className="p-4 rounded-2xl border border-emerald-200/60 bg-emerald-50/40 space-y-3">
                <h4 className="text-sm font-bold text-emerald-800 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">payments</span>
                  Tài khoản ngân hàng
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-emerald-700/80 mb-1 uppercase tracking-wider">Ngân hàng</label>
                    <select
                      value={editBankName}
                      onChange={(e) => setEditBankName(e.target.value)}
                      className="w-full px-3 py-2 border border-emerald-200 rounded-xl text-xs outline-none focus:border-emerald-500 transition-all bg-white"
                    >
                      {BANKS.map((b) => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-emerald-700/80 mb-1 uppercase tracking-wider">Số tài khoản</label>
                    <input
                      type="text"
                      value={editBankAccount}
                      onChange={(e) => setEditBankAccount(e.target.value)}
                      className="w-full px-3 py-2 border border-emerald-200 rounded-xl text-xs outline-none focus:border-emerald-500 transition-all font-mono"
                      placeholder="Số tài khoản"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-emerald-700/80 mb-1 uppercase tracking-wider">Tên chủ tài khoản</label>
                  <input
                    type="text"
                    value={editBankHolder}
                    onChange={(e) => setEditBankHolder(e.target.value)}
                    className="w-full px-3 py-2 border border-emerald-200 rounded-xl text-xs outline-none focus:border-emerald-500 transition-all uppercase"
                    placeholder="NGUYEN VAN A"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="flex-1 px-6 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-on-surface hover:bg-slate-50 transition-all"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={editSaving}
                  className="flex-1 px-6 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {editSaving ? (
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  {editSaving ? "Đang lưu..." : "Lưu thay đổi"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Report Shop Modal ──────────────────────────────────────────────── */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsReportModalOpen(false)} />
          <div className="relative w-full max-w-[480px] overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                Báo cáo cửa hàng
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

      {/* ── Cover Image Cropper ─────────────────────────────────────────── */}
      {cropSrc && (
        <CoverImageCropper
          src={cropSrc}
          onConfirm={(cropped) => {
            setEditCoverImage(cropped);
            setEditCoverUrl(cropped);
            setCropSrc(null);
          }}
          onCancel={() => setCropSrc(null)}
        />
      )}
    </div>
  );
}
