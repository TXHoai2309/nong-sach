"use client";

import { useEffect, useState, useMemo, type FormEvent, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Breadcrumb from "@/components/layout/Breadcrumb";
import { formatCurrency } from "@/lib/format";
import { getOrderStatusMeta } from "@/lib/order-status";
import { Order } from "@/types/order";
import { useAuthStore } from "@/store/auth-store";
import { useCartStore } from "@/store/cart-store";
import { useOrderStore } from "@/store/order-store";
import { useNotificationStore } from "@/store/notification-store";
import { Notification } from "@/types/notification";
import { OrderStatus } from "@/types/order";
import { Product, ProductCategory } from "@/types/product";
import { UserAddress, User } from "@/types/user";
import CoverImageCropper from "@/components/ui/CoverImageCropper";
import { getAllProducts, addProduct, deleteProduct } from "@/lib/products";

const PROVINCES_API = "https://provinces.open-api.vn/api/v1/?depth=2";

const fallbackProvinces = [
  {
    code: 79,
    name: "Thành phố Hồ Chí Minh",
    districts: [
      { code: 760, name: "Quận 1" },
      { code: 765, name: "Quận Bình Thạnh" },
      { code: 769, name: "Thành phố Thủ Đức" },
    ],
  },
  {
    code: 1,
    name: "Thành phố Hà Nội",
    districts: [
      { code: 1, name: "Quận Ba Đình" },
      { code: 2, name: "Quận Hoàn Kiếm" },
      { code: 3, name: "Quận Tây Hồ" },
    ],
  },
  {
    code: 48,
    name: "Thành phố Đà Nẵng",
    districts: [
      { code: 490, name: "Quận Liên Chiểu" },
      { code: 491, name: "Quận Thanh Khê" },
      { code: 492, name: "Quận Hải Châu" },
    ],
  },
];

type ProfileTab = "info" | "orders" | "addresses" | "password" | "notifications" | "seller";
type ProfileGender = NonNullable<User["gender"]>;

const normalizeVietnamPhone = (phone?: string) => {
  const digits = (phone || "").replace(/\D/g, "");
  if (digits.startsWith("84") && digits.length === 11) return `0${digits.slice(2)}`;
  return digits;
};

const notificationMeta: Record<Notification["type"], { icon: string; label: string; tone: string }> = {
  order_update: {
    icon: "receipt_long",
    label: "Đơn hàng",
    tone: "bg-blue-50 text-blue-700 ring-blue-100",
  },
  new_order: {
    icon: "shopping_bag",
    label: "Đơn mới",
    tone: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  },
  account_update: {
    icon: "verified_user",
    label: "Tài khoản",
    tone: "bg-amber-50 text-amber-700 ring-amber-100",
  },
  system: {
    icon: "campaign",
    label: "Hệ thống",
    tone: "bg-slate-50 text-slate-700 ring-slate-100",
  },
};

const formatNotificationTime = (createdAt: string) => {
  const createdTime = new Date(createdAt).getTime();
  if (Number.isNaN(createdTime)) return "";

  const diffMinutes = Math.floor((Date.now() - createdTime) / 60000);
  if (diffMinutes < 1) return "Vừa xong";
  if (diffMinutes < 60) return `${diffMinutes} phút trước`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} giờ trước`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays} ngày trước`;

  return new Date(createdAt).toLocaleString("vi-VN");
};

interface DistrictOption {
  code: number;
  name: string;
}

interface ProvinceOption {
  code: number;
  name: string;
  districts: DistrictOption[];
}

type ShopProduct = Product & {
  sellerId: string;
  shopName?: string;
};

function ProfileContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const [mounted, setMounted] = useState(false);
  const {
    currentUser,
    logout,
    updateProfile,
    changePassword,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    registerSeller,
    approveSeller,
    updateSellerInfo,
  } = useAuthStore();
  const { addToCart } = useCartStore();
  const orders = useOrderStore((state) => state.orders);
  const updateOrderStatus = useOrderStore((state) => state.updateOrderStatus);
  const fetchOrdersByUserId = useOrderStore((state) => state.fetchOrdersByUserId);
  const fetchOrdersBySellerId = useOrderStore((state) => state.fetchOrdersBySellerId);
  const isOrdersLoading = useOrderStore((state) => state.isLoading);
  const notifications = useNotificationStore((state) => state.notifications);
  const markAsRead = useNotificationStore((state) => state.markAsRead);
  const markAllAsRead = useNotificationStore((state) => state.markAllAsRead);
  const addNotification = useNotificationStore((state) => state.addNotification);

  // Navigation tab
  const [activeTab, setActiveTab] = useState<ProfileTab>("info");

  // Listen to tab URL query param
  useEffect(() => {
    if (tabParam) {
      const validTabs: ProfileTab[] = ["info", "orders", "addresses", "password", "notifications", "seller"];
      if (validTabs.includes(tabParam as ProfileTab)) {
        const timer = window.setTimeout(() => setActiveTab(tabParam as ProfileTab), 0);
        return () => window.clearTimeout(timer);
      }
    }
  }, [tabParam]);

  const [sellerSubTab, setSellerSubTab] = useState<"products" | "orders">("products");

  // Notifications/Toasts
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Seller registration form state
  const [isSubmittingSeller, setIsSubmittingSeller] = useState(false);
  const [shopName, setShopName] = useState("");
  const [shopSlogan, setShopSlogan] = useState("");
  const [shopPhone, setShopPhone] = useState("");
  const [shopZalo, setShopZalo] = useState("");
  const [isZaloSame, setIsZaloSame] = useState(false);
  const [shopDescription, setShopDescription] = useState("");
  const [shopLogo, setShopLogo] = useState<string | null>(null);
  const [shopCoverImage, setShopCoverImage] = useState<string>("");
  const [shopCoverUrl, setShopCoverUrl] = useState("");
  const [shopCropSrc, setShopCropSrc] = useState<string | null>(null);
  const [farmImages, setFarmImages] = useState<string[]>([]);
  const [selectedMainCategories, setSelectedMainCategories] = useState<string[]>([]);
  const [farmProvinceCode, setFarmProvinceCode] = useState<number | "">("");
  const [farmAddress, setFarmAddress] = useState("");
  const [selectedStandards, setSelectedStandards] = useState<string[]>([]);
  const [standardsDetail, setStandardsDetail] = useState("");
  const [idCardNumber, setIdCardNumber] = useState("");
  const [idCardFront, setIdCardFront] = useState<string | null>(null);
  const [idCardBack, setIdCardBack] = useState<string | null>(null);
  const [bankName, setBankName] = useState("Vietcombank");
  const [bankAccountNumber, setBankAccountNumber] = useState("");
  const [bankAccountName, setBankAccountName] = useState("");

  // Seller Dashboard products list
  const [shopProducts, setShopProducts] = useState<ShopProduct[]>([]);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isEditShopOpen, setIsEditShopOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ShopProduct | null>(null);
  const [newProdName, setNewProdName] = useState("");
  const [newProdCategory, setNewProdCategory] = useState<ProductCategory>("vegetables");
  const [newProdPrice, setNewProdPrice] = useState("");
  const [newProdUnit, setNewProdUnit] = useState("kg");
  const [newProdStock, setNewProdStock] = useState("");
  const [newProdOrigin, setNewProdOrigin] = useState("");
  const [newProdDescription, setNewProdDescription] = useState("");
  const [newProdImage, setNewProdImage] = useState("");
  const [newProdImages, setNewProdImages] = useState<string[]>([]);

  // Profile Form State
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState<ProfileGender>("");
  const [isEditing, setIsEditing] = useState(false);

  // Change Password State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);

  // Address Dialog/Form State
  const [isAddressFormOpen, setIsAddressFormOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addrFullName, setAddrFullName] = useState("");
  const [addrPhone, setAddrPhone] = useState("");
  const [addrStreet, setAddrStreet] = useState("");
  const [addrProvinceCode, setAddrProvinceCode] = useState<number | "">("");
  const [addrDistrictCode, setAddrDistrictCode] = useState<number | "">("");
  const [addrIsDefault, setAddrIsDefault] = useState(false);

  // Provinces data
  const [provinces, setProvinces] = useState<ProvinceOption[]>([]);

  // Order filter
  const [orderFilter, setOrderFilter] = useState<"all" | "processing" | "completed">("all");
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  // Show toast helper
  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  useEffect(() => {
    const timer = window.setTimeout(() => setMounted(true), 0);
    return () => window.clearTimeout(timer);
  }, []);

  // Redirect to login if not logged in
  useEffect(() => {
    if (mounted && !currentUser) {
      router.push("/login?redirect=/profile");
    }
  }, [mounted, currentUser, router]);

  // Load provinces API
  useEffect(() => {
    if (!mounted) return;
    async function loadProvinces() {
      try {
        const res = await fetch(PROVINCES_API);
        if (!res.ok) throw new Error();
        const data = await res.json() as ProvinceOption[];
        setProvinces(data.length > 0 ? data : fallbackProvinces);
      } catch {
        setProvinces(fallbackProvinces);
      }
    }
    loadProvinces();
  }, [mounted]);

  // Initialize profile form values when user loads
  useEffect(() => {
    if (currentUser) {
      const timer = window.setTimeout(() => {
        setFullName(currentUser.name || "");
        setPhone(currentUser.phone || "");
        setDob(currentUser.dob || "");
        setGender(currentUser.gender || "");
      }, 0);
      return () => window.clearTimeout(timer);
    }
  }, [currentUser]);

  // Load / Setup Orders
  const userOrders = useMemo(() => {
    if (!currentUser) return [];
    return orders.filter((o) => o.userId === currentUser.id);
  }, [orders, currentUser]);

  const sellerOrders = useMemo(() => {
    if (!currentUser || currentUser.role !== "seller") return [];
    return orders.filter((o) => o.sellerId === currentUser.id);
  }, [orders, currentUser]);

  const userNotifications = useMemo(() => {
    if (!currentUser) return [];
    return notifications
      .filter((n) => n.userId === currentUser.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [notifications, currentUser]);

  const unreadNotificationCount = useMemo(
    () => userNotifications.filter((noti) => !noti.isRead).length,
    [userNotifications]
  );

  // Copy phone number to Zalo if checkbox is selected
  useEffect(() => {
    if (isZaloSame) {
      const timer = window.setTimeout(() => setShopZalo(shopPhone), 0);
      return () => window.clearTimeout(timer);
    }
  }, [isZaloSame, shopPhone]);

  useEffect(() => {
    if (!currentUser?.phone || shopPhone.trim() || currentUser.sellerInfo?.shopPhone) return;
    const normalizedPhone = normalizeVietnamPhone(currentUser.phone);
    if (!normalizedPhone) return;

    const timer = window.setTimeout(() => {
      setShopPhone(normalizedPhone);
      if (isZaloSame || !shopZalo.trim()) setShopZalo(normalizedPhone);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [currentUser?.phone, currentUser?.sellerInfo?.shopPhone, isZaloSame, shopPhone, shopZalo]);

  // Load custom products for this seller from Firestore
  useEffect(() => {
    if (!mounted || !currentUser) return;
    async function loadCustomProducts() {
      if (!currentUser) return;
      try {
        const list = await getAllProducts();
        const filteredList = list.filter((p) => p.sellerId === currentUser.id) as ShopProduct[];
        setShopProducts(filteredList);
      } catch (e) {
        console.error(e);
      }
    }
    loadCustomProducts();
  }, [mounted, currentUser, activeTab]);

  // Load orders dynamically from Firestore when active tab changes
  useEffect(() => {
    if (!mounted || !currentUser) return;
    if (activeTab === "orders") {
      fetchOrdersByUserId(currentUser.id);
    }
  }, [mounted, activeTab, currentUser?.id, fetchOrdersByUserId]);

  useEffect(() => {
    if (!mounted || !currentUser) return;
    if (activeTab === "seller" && sellerSubTab === "orders") {
      fetchOrdersBySellerId(currentUser.id);
    }
  }, [mounted, activeTab, sellerSubTab, currentUser?.id, fetchOrdersBySellerId]);

  // Image compression helper
  const compressImage = (
    base64Str: string,
    maxWidth = 300,
    maxHeight = 300,
    quality = 0.7,
    outputType = "image/jpeg"
  ): Promise<string> => {
    return new Promise((resolve) => {
      const img = new window.Image();
      img.src = base64Str;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL(outputType, quality));
        } else {
          resolve(base64Str);
        }
      };
      img.onerror = () => {
        resolve(base64Str);
      };
    });
  };

  const readFileAsDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error("Khong the doc anh tai len"));
      reader.readAsDataURL(file);
    });
  };

  const getImageDimensions = (src: string): Promise<{ width: number; height: number }> => {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      img.onload = () => {
        resolve({
          width: img.naturalWidth || img.width,
          height: img.naturalHeight || img.height,
        });
      };
      img.onerror = () => reject(new Error("Khong the lay kich thuoc anh"));
      img.src = src;
    });
  };

  const processProductImage = async (file: File): Promise<string> => {
    const originalBase64 = await readFileAsDataUrl(file);
    const { width, height } = await getImageDimensions(originalBase64);

    if (width < 900 || height < 900) {
      showToast(
        `Anh ${width}x${height} kha nho. Trang chi tiet se giu dung kich thuoc goc de tranh bi mo.`,
        "error"
      );
    }

    const shouldCompress = file.size > 350 * 1024 || width > 2000 || height > 2000;
    if (!shouldCompress) {
      return originalBase64;
    }

    return compressImage(originalBase64, 2000, 2000, 0.96, "image/webp");
  };

  // Upload Handlers
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const compressed = await compressImage(reader.result as string, 200, 200);
        setShopLogo(compressed);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFarmImagesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = async () => {
          const compressed = await compressImage(reader.result as string, 400, 400);
          setFarmImages((prev) => [...prev, compressed]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleIdFrontUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const compressed = await compressImage(reader.result as string, 400, 400);
        setIdCardFront(compressed);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleIdBackUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const compressed = await compressImage(reader.result as string, 400, 400);
        setIdCardBack(compressed);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProductMultipleImagesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const remainingCount = 6 - newProdImages.length;
      if (remainingCount <= 0) {
        showToast("Tối đa chỉ được tải lên 6 ảnh sản phẩm", "error");
        return;
      }
      
      const filesArray = Array.from(files).slice(0, remainingCount);
      void (async () => {
        for (const file of filesArray) {
          try {
            const finalImage = await processProductImage(file);
            setNewProdImages((prev) => {
              if (prev.length >= 6) return prev;
              if (prev.length === 0) {
                setNewProdImage(finalImage);
              }
              return [...prev, finalImage];
            });
          } catch {
            showToast("Co 1 anh khong xu ly duoc va da bi bo qua", "error");
          }
        }
      })();
    }
    e.target.value = "";
  };

  const handleRegisterSellerSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const normalizedShopPhone = normalizeVietnamPhone(shopPhone);
    const normalizedShopZalo = normalizeVietnamPhone(shopZalo);

    if (!shopName.trim()) {
      showToast("Vui lòng nhập tên shop", "error");
      return;
    }
    if (!normalizedShopPhone || !/^0\d{9}$/.test(normalizedShopPhone)) {
      showToast("Số điện thoại shop không hợp lệ", "error");
      return;
    }
    if (!normalizedShopZalo || !/^0\d{9}$/.test(normalizedShopZalo)) {
      showToast("Số Zalo không hợp lệ", "error");
      return;
    }
    if (!shopDescription.trim()) {
      showToast("Vui lòng nhập giới thiệu shop", "error");
      return;
    }
    if (selectedMainCategories.length === 0) {
      showToast("Vui lòng chọn ít nhất một loại nông sản chủ đạo", "error");
      return;
    }
    if (!farmProvinceCode) {
      showToast("Vui lòng chọn Tỉnh/Thành phố trang trại", "error");
      return;
    }
    if (!farmAddress.trim()) {
      showToast("Vui lòng nhập địa chỉ cụ thể của trang trại", "error");
      return;
    }
    if (!idCardNumber.trim() || !/^\d{9,12}$/.test(idCardNumber.trim())) {
      showToast("Số CCCD/CMND không hợp lệ (phải gồm 9 hoặc 12 chữ số)", "error");
      return;
    }
    if (!bankAccountNumber.trim()) {
      showToast("Vui lòng nhập số tài khoản ngân hàng", "error");
      return;
    }
    if (!bankAccountName.trim()) {
      showToast("Vui lòng nhập tên chủ tài khoản", "error");
      return;
    }

    const selectedProv = provinces.find((p) => p.code === Number(farmProvinceCode));

    setIsSubmittingSeller(true);
    try {
      await registerSeller({
        shopName: shopName.trim(),
        slogan: shopSlogan.trim(),
        shopPhone: normalizedShopPhone,
        shopZalo: normalizedShopZalo,
        description: shopDescription.trim(),
        shopLogo: shopLogo || undefined,
        coverImage: shopCoverImage || undefined,
        farmImages: farmImages.length > 0 ? farmImages : undefined,
        mainCategories: selectedMainCategories,
        province: selectedProv?.name || "Lâm Đồng",
        farmAddress: farmAddress.trim(),
        farmingStandards: selectedStandards,
        farmingStandardsDetail: standardsDetail.trim(),
        idCardNumber: idCardNumber.trim(),
        idCardFront: idCardFront || undefined,
        idCardBack: idCardBack || undefined,
        bankName,
        bankAccountNumber: bankAccountNumber.trim(),
        bankAccountName: bankAccountName.trim().toUpperCase(),
      });
      showToast("Gửi hồ sơ đăng ký thành công!");
    } catch (error) {
      console.error(error);
      showToast("Đã có lỗi xảy ra khi đăng ký", "error");
    } finally {
      setIsSubmittingSeller(false);
    }
  };

  const openEditShopModal = () => {
    if (currentUser && currentUser.sellerInfo) {
      const info = currentUser.sellerInfo;
      setShopName(info.shopName || "");
      setShopSlogan(info.slogan || "");
      setShopPhone(info.shopPhone || "");
      setShopZalo(info.shopZalo || "");
      setIsZaloSame(info.shopZalo === info.shopPhone);
      setShopDescription(info.description || "");
      setShopLogo(info.shopLogo || null);
      setShopCoverImage(info.coverImage || "");
      setShopCoverUrl(info.coverImage || "");
      setFarmImages(info.farmImages || []);
      setSelectedMainCategories(info.mainCategories || []);
      
      const prov = provinces.find((p) => p.name === info.province);
      setFarmProvinceCode(prov ? prov.code : "");
      
      setFarmAddress(info.farmAddress || "");
      setSelectedStandards(info.farmingStandards || []);
      setStandardsDetail(info.farmingStandardsDetail || "");
      setBankName(info.bankName || "Vietcombank");
      setBankAccountNumber(info.bankAccountNumber || "");
      setBankAccountName(info.bankAccountName || "");
    }
    setIsEditShopOpen(true);
  };

  const handleEditShopSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const normalizedShopPhone = normalizeVietnamPhone(shopPhone);
    const normalizedShopZalo = normalizeVietnamPhone(shopZalo);

    if (!shopName.trim()) {
      showToast("Vui lòng nhập tên shop", "error");
      return;
    }
    if (!normalizedShopPhone || !/^0\d{9}$/.test(normalizedShopPhone)) {
      showToast("Số điện thoại shop không hợp lệ", "error");
      return;
    }
    if (!normalizedShopZalo || !/^0\d{9}$/.test(normalizedShopZalo)) {
      showToast("Số Zalo không hợp lệ", "error");
      return;
    }
    if (!shopDescription.trim()) {
      showToast("Vui lòng nhập giới thiệu shop", "error");
      return;
    }
    if (selectedMainCategories.length === 0) {
      showToast("Vui lòng chọn ít nhất một loại nông sản chủ đạo", "error");
      return;
    }
    if (!farmProvinceCode) {
      showToast("Vui lòng chọn Tỉnh/Thành phố trang trại", "error");
      return;
    }
    if (!farmAddress.trim()) {
      showToast("Vui lòng nhập địa chỉ cụ thể của trang trại", "error");
      return;
    }
    if (!bankAccountNumber.trim()) {
      showToast("Vui lòng nhập số tài khoản ngân hàng", "error");
      return;
    }
    if (!bankAccountName.trim()) {
      showToast("Vui lòng nhập tên chủ tài khoản", "error");
      return;
    }

    const selectedProv = provinces.find((p) => p.code === Number(farmProvinceCode));

    setIsSubmittingSeller(true);
    try {
      await updateSellerInfo({
        shopName: shopName.trim(),
        slogan: shopSlogan.trim(),
        shopPhone: normalizedShopPhone,
        shopZalo: normalizedShopZalo,
        description: shopDescription.trim(),
        shopLogo: shopLogo || undefined,
        coverImage: shopCoverImage || undefined,
        farmImages: farmImages.length > 0 ? farmImages : undefined,
        mainCategories: selectedMainCategories,
        province: selectedProv?.name || "Lâm Đồng",
        farmAddress: farmAddress.trim(),
        farmingStandards: selectedStandards,
        farmingStandardsDetail: standardsDetail.trim(),
        idCardNumber: currentUser?.sellerInfo?.idCardNumber || "",
        idCardFront: currentUser?.sellerInfo?.idCardFront,
        idCardBack: currentUser?.sellerInfo?.idCardBack,
        bankName,
        bankAccountNumber: bankAccountNumber.trim(),
        bankAccountName: bankAccountName.trim().toUpperCase(),
      });
      showToast("Cập nhật thông tin cửa hàng thành công!");
      setIsEditShopOpen(false);
    } catch (error) {
      console.error(error);
      showToast("Đã có lỗi xảy ra khi cập nhật", "error");
    } finally {
      setIsSubmittingSeller(false);
    }
  };

  const closeProductModal = () => {
    setIsAddProductOpen(false);
    setEditingProduct(null);
    setNewProdName("");
    setNewProdCategory("vegetables");
    setNewProdPrice("");
    setNewProdUnit("kg");
    setNewProdStock("");
    setNewProdOrigin("");
    setNewProdDescription("");
    setNewProdImage("");
    setNewProdImages([]);
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: OrderStatus, userId: string) => {
    await updateOrderStatus(orderId, newStatus);
    const statusMeta = getOrderStatusMeta(newStatus);

    await addNotification({
      userId,
      title: `Đơn hàng ${statusMeta.label.toLowerCase()}`,
      message: `Đơn hàng #${orderId}: ${statusMeta.detail}`,
      type: "order_update",
      orderId,
    });
    
    showToast(`Đã cập nhật đơn hàng: ${statusMeta.label}`);
  };

  const handleEditProduct = (p: ShopProduct) => {
    setEditingProduct(p);
    setNewProdName(p.name);
    setNewProdCategory(p.category);
    setNewProdPrice(p.price.toString());
    setNewProdUnit(p.unit || "kg");
    setNewProdStock(p.stock.toString());
    setNewProdOrigin(p.origin);
    setNewProdDescription(p.description || "");
    setNewProdImage(p.image || "");
    setNewProdImages(p.images || (p.image ? [p.image] : []));
    setIsAddProductOpen(true);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa sản phẩm này không? Hành động này không thể hoàn tác.")) {
      try {
        await deleteProduct(productId);
        setShopProducts((prev) => prev.filter((p) => p.id !== productId));
        showToast("Đã xóa sản phẩm thành công!");
      } catch (error) {
        console.error(error);
        showToast("Đã có lỗi xảy ra khi xóa sản phẩm", "error");
      }
    }
  };

  const handleAddProductSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    if (!newProdName.trim()) {
      showToast("Vui lòng nhập tên sản phẩm", "error");
      return;
    }
    if (!newProdPrice || Number(newProdPrice) <= 0) {
      showToast("Giá sản phẩm phải lớn hơn 0", "error");
      return;
    }
    if (!newProdStock || Number(newProdStock) < 0) {
      showToast("Số lượng tồn kho không hợp lệ", "error");
      return;
    }
    if (!newProdOrigin.trim()) {
      showToast("Vui lòng nhập nguồn gốc sản phẩm", "error");
      return;
    }

    const updatedImages = newProdImages.length > 0 ? newProdImages : (newProdImage ? [newProdImage] : []);
    const mainImage = newProdImage || (updatedImages.length > 0 ? updatedImages[0] : "https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?w=600&h=600&fit=crop");

    const productData: ShopProduct = {
      id: editingProduct ? editingProduct.id : "prod-custom-" + Date.now(),
      name: newProdName.trim(),
      category: newProdCategory,
      price: Number(newProdPrice),
      image: mainImage,
      images: updatedImages,
      description: newProdDescription.trim() || "Sản phẩm sạch từ trang trại đối tác NôngSạch.",
      origin: newProdOrigin.trim(),
      stock: Number(newProdStock),
      unit: newProdUnit.trim() || "kg",
      sellerId: currentUser.id,
      shopName: currentUser.sellerInfo?.shopName || "Trang trại của tôi",
      isOrganic: selectedStandards.includes("Hữu cơ (Organic)"),
    };

    try {
      await addProduct(productData);

      if (editingProduct) {
        setShopProducts((prev) => prev.map((p) => p.id === editingProduct.id ? productData : p));
        showToast("Cập nhật sản phẩm thành công!");
      } else {
        setShopProducts((prev) => [...prev, productData]);
        showToast("Đăng sản phẩm mới thành công!");
      }

      closeProductModal();
    } catch (error) {
      console.error(error);
      showToast("Đã có lỗi xảy ra khi lưu sản phẩm", "error");
    }
  };

  if (!mounted || !currentUser) {
    return (
      <main className="flex min-h-[450px] items-center justify-center bg-[#f9f9ff] px-6">
        <p className="font-medium text-[#3c4a42]">Đang tải thông tin tài khoản...</p>
      </main>
    );
  }

  // Get Initials for Avatar
  const getInitials = (name: string) => {
    const parts = name.trim().split(/\s+/);
    if (parts.length === 0) return "NS";
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  // 1. Update Profile Info
  const handleUpdateProfile = (e: FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      showToast("Vui lòng nhập họ và tên", "error");
      return;
    }
    if (phone && !/^0\d{9}$/.test(phone.trim().replace(/\s+/g, ""))) {
      showToast("Số điện thoại cần có 10 số và bắt đầu bằng 0", "error");
      return;
    }

    updateProfile({
      name: fullName.trim(),
      phone: phone.trim(),
      dob,
      gender: gender || "",
    });
    showToast("Cập nhật thông tin cá nhân thành công!");
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    if (currentUser) {
      setFullName(currentUser.name || "");
      setPhone(currentUser.phone || "");
      setDob(currentUser.dob || "");
      setGender(currentUser.gender || "");
    }
    setIsEditing(false);
  };

  // 2. Change Password
  const handleChangePassword = async (e: FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      showToast("Vui lòng nhập mật khẩu hiện tại", "error");
      return;
    }
    if (newPassword.length < 6) {
      showToast("Mật khẩu mới phải có ít nhất 6 ký tự", "error");
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast("Xác nhận mật khẩu mới không trùng khớp", "error");
      return;
    }

    const result = await changePassword(currentPassword, newPassword);
    if (result.success) {
      showToast(result.message);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      showToast(result.message, "error");
    }
  };

  // Password strength checker
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { label: "", color: "bg-gray-200", percent: 0, textClass: "text-gray-400" };
    if (pass.length < 6) return { label: "Mật khẩu yếu", color: "bg-red-500", percent: 33, textClass: "text-red-500" };
    
    // Medium criteria: 6+ chars, has letters and numbers
    const hasLetter = /[a-zA-Z]/.test(pass);
    const hasDigit = /\d/.test(pass);
    const hasSpecial = /[^a-zA-Z0-9]/.test(pass);

    if (pass.length >= 8 && hasLetter && hasDigit && hasSpecial) {
      return { label: "Mật khẩu mạnh", color: "bg-[#006c49]", percent: 100, textClass: "text-[#006c49]" };
    }
    return { label: "Mật khẩu trung bình", color: "bg-amber-500", percent: 66, textClass: "text-amber-500" };
  };

  const passStrength = getPasswordStrength(newPassword);

  // 3. Address Handlers
  const handleOpenAddAddress = () => {
    setEditingAddressId(null);
    setAddrFullName(currentUser.name || "");
    setAddrPhone(currentUser.phone || "");
    setAddrStreet("");
    
    const defaultProvince = provinces[0] || fallbackProvinces[0];
    setAddrProvinceCode(defaultProvince?.code ?? "");
    setAddrDistrictCode(defaultProvince?.districts?.[0]?.code ?? "");
    setAddrIsDefault(currentUser.addresses?.length === 0);
    setIsAddressFormOpen(true);
  };

  const handleOpenEditAddress = (addr: UserAddress) => {
    setEditingAddressId(addr.id);
    setAddrFullName(addr.fullName);
    setAddrPhone(addr.phone);
    setAddrStreet(addr.streetAddress);
    setAddrProvinceCode(addr.provinceCode);
    setAddrDistrictCode(addr.districtCode);
    setAddrIsDefault(addr.isDefault);
    setIsAddressFormOpen(true);
  };

  const handleSaveAddress = (e: FormEvent) => {
    e.preventDefault();
    if (!addrFullName.trim()) {
      showToast("Vui lòng nhập họ và tên người nhận", "error");
      return;
    }
    if (!addrPhone.trim() || !/^0\d{9}$/.test(addrPhone.trim().replace(/\s+/g, ""))) {
      showToast("Số điện thoại không hợp lệ", "error");
      return;
    }
    if (!addrStreet.trim()) {
      showToast("Vui lòng nhập địa chỉ cụ thể", "error");
      return;
    }
    if (!addrProvinceCode) {
      showToast("Vui lòng chọn Tỉnh/Thành phố", "error");
      return;
    }
    if (!addrDistrictCode) {
      showToast("Vui lòng chọn Quận/Huyện", "error");
      return;
    }

    const selectedProv = provinces.find((p) => p.code === Number(addrProvinceCode));
    const selectedDist = selectedProv?.districts?.find((d) => d.code === Number(addrDistrictCode));

    const addressData = {
      fullName: addrFullName.trim(),
      phone: addrPhone.trim(),
      streetAddress: addrStreet.trim(),
      provinceCode: Number(addrProvinceCode),
      provinceName: selectedProv?.name || "",
      districtCode: Number(addrDistrictCode),
      districtName: selectedDist?.name || "",
      isDefault: addrIsDefault,
    };

    if (editingAddressId) {
      updateAddress(editingAddressId, addressData);
      showToast("Cập nhật địa chỉ thành công!");
    } else {
      addAddress(addressData);
      showToast("Thêm địa chỉ giao hàng thành công!");
    }

    setIsAddressFormOpen(false);
  };

  // Re-order click
  const handleReorder = (order: Order) => {
    order.items.forEach((item) => {
      addToCart({
        id: item.productId,
        name: item.name,
        price: item.price,
        image: item.image,
        category: "vegetables",
        description: "Sản phẩm mua lại từ đơn hàng trước",
        origin: "Đà Lạt",
        stock: 99,
      });
    });
    showToast("Đã thêm các sản phẩm vào giỏ hàng!");
    router.push("/cart");
  };

  // Filtered Orders
  const filteredOrders = userOrders.filter((o) => {
    if (orderFilter === "processing") return o.status === "pending" || o.status === "confirmed" || o.status === "shipping";
    if (orderFilter === "completed") return o.status === "delivered";
    return true;
  });

  // Dynamic District Options for Address Form
  const currentSelectedProvObj = provinces.find((p) => p.code === Number(addrProvinceCode));
  const formDistrictOptions = currentSelectedProvObj?.districts ?? [];

  return (
    <>
      <main className="bg-[#f9f9ff] px-4 py-8 sm:px-6 md:py-10">
      <div className="mx-auto max-w-[1040px]">
        {/* Toast Toast notification */}
        {toast && (
          <div className={`fixed right-6 top-24 z-50 flex items-center gap-2 rounded-2xl px-5 py-3.5 shadow-lg border text-sm font-semibold transition-all ${
            toast.type === "success" 
              ? "bg-[#e6f4ea] border-[#006c49]/20 text-[#006c49]" 
              : "bg-red-50 border-red-200 text-red-700"
          }`}>
            <span className="material-symbols-outlined text-lg">
              {toast.type === "success" ? "check_circle" : "error"}
            </span>
            {toast.message}
          </div>
        )}

        <Breadcrumb
          className="mb-6"
          items={[
            { label: "Trang chủ", href: "/" },
            { label: "Tài khoản" },
          ]}
        />

        {/* Outer Layout Grid */}
        <div className="flex flex-col gap-6 md:flex-row md:items-start">
          {/* Left Sidebar */}
          <aside className="w-full shrink-0 md:w-[260px] lg:w-[280px] md:sticky md:top-24">
            {/* User Profile Header Box */}
            <section className="mb-4 rounded-3xl border border-[#bbcabf]/30 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#006c49] text-[18px] font-bold text-white">
                  {getInitials(currentUser.name)}
                </div>
                <div className="overflow-hidden">
                  <h2 className="truncate text-base font-bold text-[#3c4a42]">
                    {currentUser.name}
                  </h2>
                  <p className="truncate text-xs text-[#3c4a42]/70">
                    {currentUser.email}
                  </p>
                  <p className="mt-1 text-[11px] text-[#3c4a42]/50 font-medium">
                    Thành viên từ {currentUser.memberSince || "06/2024"}
                  </p>
                </div>
              </div>
            </section>
            {/* Sidebar Navigation */}
            <nav className="rounded-3xl border border-[#bbcabf]/30 bg-white p-2 shadow-sm" aria-label="Menu tài khoản">
              <ul className="space-y-1">
                {(() => {
                  const menuItems: Array<{ id: ProfileTab; label: string; icon: string }> = [
                    { id: "info", label: "Thông tin cá nhân", icon: "person" },
                    { id: "orders", label: "Đơn hàng của tôi", icon: "shopping_bag" },
                    { id: "addresses", label: "Địa chỉ giao hàng", icon: "location_on" },
                    { id: "password", label: "Đổi mật khẩu", icon: "lock" },
                    { id: "notifications", label: "Thông báo", icon: "notifications" },
                  ];

                  let sellerLabel = "Đăng ký bán hàng";
                  let sellerIcon = "storefront";
                  if (currentUser.role === "seller") {
                    sellerLabel = "Kênh người bán";
                    sellerIcon = "store";
                  } else if (currentUser.sellerStatus === "pending") {
                    sellerLabel = "Đăng ký bán hàng";
                  }

                  menuItems.push({ id: "seller", label: sellerLabel, icon: sellerIcon });

                  return menuItems.map((item) => {
                    const isActive = activeTab === item.id;
                    
                    let btnClass = "text-[#3c4a42] hover:bg-[#10b981]/5 font-medium";
                    let iconClass = "text-[#3c4a42]/70";
                    let chevronClass = "text-[#3c4a42]/40";
                    
                    if (isActive) {
                      if (item.id === "seller") {
                        btnClass = "bg-[#006c49] font-bold text-white shadow-sm";
                        iconClass = "text-white";
                        chevronClass = "text-white/70";
                      } else {
                        btnClass = "bg-[#e6f4ea] font-bold text-[#006c49]";
                        iconClass = "text-[#006c49]";
                        chevronClass = "text-[#006c49]/60";
                      }
                    }

                    return (
                      <li key={item.id}>
                        <button
                          onClick={() => {
                            setActiveTab(item.id);
                            setIsAddressFormOpen(false);
                            setIsEditing(false);
                            router.push(`/profile?tab=${item.id}`, { scroll: false });
                          }}
                          className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm transition-all ${btnClass}`}
                        >
                          <span className="flex items-center gap-3">
                            <span className={`material-symbols-outlined text-[20px] ${iconClass}`}>
                              {item.icon}
                            </span>
                            {item.label}
                          </span>
                          <span className={`material-symbols-outlined text-sm ${chevronClass}`}>
                            chevron_right
                          </span>
                        </button>
                      </li>
                    );
                  });
                })()}
                <li>
                  <button
                    onClick={() => {
                      logout();
                      router.push("/");
                    }}
                    className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold text-red-600 hover:bg-red-50 transition-all"
                  >
                    <span className="material-symbols-outlined text-[20px] text-red-500">
                      logout
                    </span>
                    Đăng xuất
                  </button>
                </li>
              </ul>
            </nav>

            {/* Promo Card: Trở thành đối tác */}
            <div className="mt-4 rounded-3xl bg-[#00422b] p-6 text-white text-center shadow-sm relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/leaves.png')] opacity-5 pointer-events-none" />
              <h4 className="text-sm font-bold mb-2">Trở thành đối tác</h4>
              <p className="text-[11px] opacity-80 leading-relaxed mb-4">
                Cùng NôngSạch mang sản phẩm hữu cơ tốt nhất đến tay người tiêu dùng.
              </p>
              <button 
                type="button"
                onClick={() => {
                  router.push("/contact?subject=cooperate");
                }}
                className="w-full rounded-2xl border border-white/50 py-2.5 text-xs font-semibold text-white hover:bg-white/10 transition-all text-center"
              >
                Hỗ trợ đối tác
              </button>
            </div>
          </aside>

          {/* Right Main viewport content */}
          <section className="flex-1">
            {/* 1. PERSONAL INFORMATION TAB */}
            {activeTab === "info" && (
              <div className="rounded-3xl border border-[#bbcabf]/30 bg-white p-6 shadow-sm sm:p-8">
                <h3 className="mb-6 text-lg font-bold text-[#006c49]">Thông tin cá nhân</h3>
                <form onSubmit={handleUpdateProfile} className="space-y-5">
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    {/* Name */}
                    <div>
                      <label htmlFor="full-name" className="block text-xs font-bold text-[#3c4a42]/70 mb-2">
                        Họ và tên
                      </label>
                      <input
                        id="full-name"
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Nguyễn Văn A"
                        disabled={!isEditing}
                        className={`w-full rounded-2xl border-none px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-[#006c49] ${
                          !isEditing
                            ? "bg-[#eef2f6] text-[#3c4a42]/60 cursor-not-allowed"
                            : "bg-[#f4f6fa] text-[#3c4a42] cursor-text"
                        }`}
                        required
                      />
                    </div>
                    {/* Email (Readonly) */}
                    <div>
                      <label htmlFor="email" className="block text-xs font-bold text-[#3c4a42]/70 mb-2">
                        Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        value={currentUser.email}
                        readOnly
                        disabled
                        className="w-full cursor-not-allowed rounded-2xl border-none bg-[#eef2f6] px-4 py-3 text-sm text-[#3c4a42]/60 outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    {/* Phone */}
                    <div>
                      <label htmlFor="phone" className="block text-xs font-bold text-[#3c4a42]/70 mb-2">
                        Số điện thoại
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="0123 456 789"
                        disabled={!isEditing}
                        className={`w-full rounded-2xl border-none px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-[#006c49] ${
                          !isEditing
                            ? "bg-[#eef2f6] text-[#3c4a42]/60 cursor-not-allowed"
                            : "bg-[#f4f6fa] text-[#3c4a42] cursor-text"
                        }`}
                      />
                    </div>
                    {/* DOB */}
                    <div>
                      <label htmlFor="dob" className="block text-xs font-bold text-[#3c4a42]/70 mb-2">
                        Ngày sinh
                      </label>
                      <input
                        id="dob"
                        type="date"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        disabled={!isEditing}
                        className={`w-full rounded-2xl border-none px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-[#006c49] ${
                          !isEditing
                            ? "bg-[#eef2f6] text-[#3c4a42]/60 cursor-not-allowed"
                            : "bg-[#f4f6fa] text-[#3c4a42] cursor-text"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Gender */}
                  <div>
                    <span className="block text-xs font-bold text-[#3c4a42]/70 mb-3">Giới tính</span>
                    <div className="flex items-center gap-6">
                      {[
                        { value: "Nam", label: "Nam" },
                        { value: "Nữ", label: "Nữ" },
                        { value: "Khác", label: "Khác" },
                      ].map((item) => {
                        const isChecked = gender === item.value;
                        return (
                          <label 
                            key={item.value} 
                            className={`flex items-center gap-2 text-sm font-medium transition-all ${
                              !isEditing 
                                ? `cursor-not-allowed ${isChecked ? "text-[#3c4a42] font-bold" : "text-[#3c4a42]/50"}` 
                                : "text-[#3c4a42] cursor-pointer"
                            }`}
                          >
                            <input
                              type="radio"
                              name="gender"
                              value={item.value}
                              checked={isChecked}
                              disabled={!isEditing}
                              onChange={() => setGender(item.value as ProfileGender)}
                              className={`h-4.5 w-4.5 border-gray-300 text-[#006c49] focus:ring-[#006c49] transition-all ${
                                !isEditing 
                                  ? isChecked ? "opacity-100 scale-105" : "opacity-30" 
                                  : "opacity-100"
                              }`}
                            />
                            {item.label}
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="pt-2 flex gap-3">
                    {!isEditing ? (
                      <button
                        key="btn-edit"
                        type="button"
                        onClick={() => setIsEditing(true)}
                        className="rounded-full bg-[#006c49] px-8 py-3.5 text-sm font-bold text-white transition hover:opacity-90 shadow-sm"
                      >
                        Sửa thông tin
                      </button>
                    ) : (
                      <>
                        <button
                          key="btn-save"
                          type="submit"
                          className="rounded-full bg-[#006c49] px-8 py-3.5 text-sm font-bold text-white transition hover:opacity-90 shadow-sm"
                        >
                          Lưu thay đổi
                        </button>
                        <button
                          key="btn-cancel"
                          type="button"
                          onClick={handleCancelEdit}
                          className="rounded-full border border-[#bbcabf] px-8 py-3.5 text-sm font-bold text-[#3c4a42] transition hover:bg-gray-50 shadow-sm"
                        >
                          Hủy
                        </button>
                      </>
                    )}
                  </div>
                </form>
              </div>
            )}

            {/* 2. MY ORDERS TAB */}
            {activeTab === "orders" && (
              <div className="rounded-3xl border border-[#bbcabf]/30 bg-white p-6 shadow-sm">
                <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                  <h3 className="text-lg font-bold text-[#006c49]">Đơn hàng của tôi</h3>
                  {/* Order sub filters */}
                  <div className="flex items-center gap-1.5 rounded-full bg-[#f4f6fa] p-1 text-xs font-bold">
                    <button
                      onClick={() => setOrderFilter("all")}
                      className={`rounded-full px-3 py-1.5 transition-all ${
                        orderFilter === "all" ? "bg-white text-[#006c49] shadow-sm" : "text-[#3c4a42]/70"
                      }`}
                    >
                      Tất cả
                    </button>
                    <button
                      onClick={() => setOrderFilter("processing")}
                      className={`rounded-full px-3 py-1.5 transition-all ${
                        orderFilter === "processing" ? "bg-white text-[#006c49] shadow-sm" : "text-[#3c4a42]/70"
                      }`}
                    >
                      Đang xử lý
                    </button>
                    <button
                      onClick={() => setOrderFilter("completed")}
                      className={`rounded-full px-3 py-1.5 transition-all ${
                        orderFilter === "completed" ? "bg-white text-[#006c49] shadow-sm" : "text-[#3c4a42]/70"
                      }`}
                    >
                      Hoàn thành
                    </button>
                  </div>
                </div>

                {filteredOrders.length === 0 ? (
                  <div className="py-12 text-center text-[#3c4a42]/60">
                    <span className="material-symbols-outlined mb-2 text-[48px] text-[#3c4a42]/30">
                      shopping_bag
                    </span>
                    <p className="text-sm font-medium">Không tìm thấy đơn hàng nào.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredOrders.map((order) => {
                      const isExpanded = expandedOrderId === order.id;
                      const statusMeta = getOrderStatusMeta(order.status);
                      return (
                        <div key={order.id} className="rounded-2xl border border-[#bbcabf]/25 p-4 sm:p-5">
                          <div className="flex flex-col justify-between gap-3 border-b border-[#bbcabf]/20 pb-4 sm:flex-row sm:items-center">
                            <div>
                              <p className="text-sm font-bold text-[#3c4a42]">
                                Đơn hàng #{order.id}
                              </p>
                              <p className="mt-1 text-xs text-[#3c4a42]/60 font-medium">
                                Ngày đặt: {new Date(order.createdAt).toLocaleString("vi-VN")}
                              </p>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${statusMeta.tone}`}>
                                <span className="h-1.5 w-1.5 rounded-full bg-current"></span>
                                {statusMeta.label}
                              </span>
                            </div>
                          </div>

                          {/* Product images and summary */}
                          <div className="py-4">
                            <div className="flex items-center justify-between gap-4">
                              <div className="flex items-center gap-2 overflow-x-auto py-1">
                                {order.items.slice(0, 3).map((item, idx) => (
                                  <div key={idx} className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-gray-100">
                                    <Image
                                      src={item.image}
                                      alt={item.name}
                                      fill
                                      className="object-cover"
                                      sizes="56px"
                                    />
                                    <span className="absolute bottom-0.5 right-0.5 flex h-4.5 min-w-[18px] items-center justify-center rounded-md bg-[#3c4a42]/80 px-1 text-[9px] font-bold text-white">
                                      x{item.quantity}
                                    </span>
                                  </div>
                                ))}
                                {order.items.length > 3 && (
                                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gray-50 border border-gray-100 text-xs font-bold text-[#3c4a42]/60">
                                    +{order.items.length - 3}
                                  </div>
                                )}
                              </div>
                              <div className="text-right shrink-0">
                                <p className="text-xs text-[#3c4a42]/60 font-medium">
                                  {order.items.reduce((sum, i) => sum + i.quantity, 0)} sản phẩm
                                </p>
                                <p className="text-base font-extrabold text-[#006c49] mt-0.5">
                                  {formatCurrency(order.totalAmount)}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Expanded Details section */}
                          {isExpanded && (
                            <div className="bg-[#f9f9ff] rounded-xl p-4 border border-[#bbcabf]/15 mb-4 text-xs space-y-2 text-[#3c4a42]/80">
                              <p><strong className="text-[#3c4a42]">Người nhận:</strong> {order.fullName}</p>
                              <p><strong className="text-[#3c4a42]">Số điện thoại:</strong> {order.phone}</p>
                              <p><strong className="text-[#3c4a42]">Địa chỉ giao hàng:</strong> {order.address}</p>
                              <p><strong className="text-[#3c4a42]">Phương thức thanh toán:</strong> {
                                order.paymentMethod === "cod" ? "Thanh toán khi nhận hàng (COD)" : "Chuyển khoản ngân hàng"
                              }</p>
                              
                              {/* Order items detail list */}
                              <div className="border-t border-[#bbcabf]/15 pt-3 mt-3">
                                <p className="font-bold mb-2 text-[#3c4a42]">Chi tiết sản phẩm:</p>
                                <ul className="space-y-1.5">
                                  {order.items.map((item, idx) => (
                                    <li key={idx} className="flex justify-between">
                                      <span>{item.name} <span className="text-[#3c4a42]/50 font-medium">x{item.quantity}</span></span>
                                      <span className="font-semibold">{formatCurrency(item.price * item.quantity)}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          )}

                          {/* Action Buttons */}
                          <div className="flex justify-end gap-2 border-t border-[#bbcabf]/10 pt-4">
                            <button
                              onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                              className="rounded-full border border-[#bbcabf] px-5 py-2 text-xs font-bold text-[#3c4a42] transition hover:bg-[#f4f6fa]"
                            >
                              {isExpanded ? "Thu gọn chi tiết" : "Xem chi tiết"}
                            </button>
                            <button
                              onClick={() => handleReorder(order)}
                              className="rounded-full bg-[#006c49] px-6 py-2 text-xs font-bold text-white transition hover:opacity-90 shadow-sm"
                            >
                              Mua lại
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* 3. SHIPPING ADDRESSES TAB */}
            {activeTab === "addresses" && (
              <div className="rounded-3xl border border-[#bbcabf]/30 bg-white p-6 shadow-sm">
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-[#006c49]">Địa chỉ giao hàng</h3>
                </div>

                {isAddressFormOpen ? (
                  /* Address Input Form */
                  <form onSubmit={handleSaveAddress} className="rounded-2xl border border-[#bbcabf]/30 p-5 space-y-4">
                    <h4 className="text-sm font-bold text-[#3c4a42]">
                      {editingAddressId ? "Chỉnh sửa địa chỉ" : "Thêm địa chỉ giao hàng mới"}
                    </h4>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-[11px] font-bold text-[#3c4a42]/70 mb-1">
                          Họ và tên người nhận
                        </label>
                        <input
                          type="text"
                          value={addrFullName}
                          onChange={(e) => setAddrFullName(e.target.value)}
                          placeholder="Nguyễn Văn A"
                          className="w-full rounded-xl border-none bg-[#f4f6fa] px-3.5 py-2.5 text-xs text-[#3c4a42] outline-none focus:ring-2 focus:ring-[#006c49]"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-[#3c4a42]/70 mb-1">
                          Số điện thoại
                        </label>
                        <input
                          type="tel"
                          value={addrPhone}
                          onChange={(e) => setAddrPhone(e.target.value)}
                          placeholder="0123 456 789"
                          className="w-full rounded-xl border-none bg-[#f4f6fa] px-3.5 py-2.5 text-xs text-[#3c4a42] outline-none focus:ring-2 focus:ring-[#006c49]"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-[11px] font-bold text-[#3c4a42]/70 mb-1">
                          Tỉnh / Thành phố
                        </label>
                        <select
                          value={addrProvinceCode}
                          onChange={(e) => {
                            const nextProvCode = Number(e.target.value);
                            setAddrProvinceCode(nextProvCode);
                            // Auto select first district of new province
                            const nextProv = provinces.find((p) => p.code === nextProvCode);
                            setAddrDistrictCode(nextProv?.districts?.[0]?.code ?? "");
                          }}
                          className="w-full rounded-xl border-none bg-[#f4f6fa] px-3.5 py-2.5 text-xs text-[#3c4a42] outline-none focus:ring-2 focus:ring-[#006c49]"
                          required
                        >
                          <option value="">Chọn Tỉnh/Thành phố</option>
                          {provinces.map((prov) => (
                            <option key={prov.code} value={prov.code}>
                              {prov.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-[#3c4a42]/70 mb-1">
                          Quận / Huyện
                        </label>
                        <select
                          value={addrDistrictCode}
                          onChange={(e) => setAddrDistrictCode(Number(e.target.value))}
                          className="w-full rounded-xl border-none bg-[#f4f6fa] px-3.5 py-2.5 text-xs text-[#3c4a42] outline-none focus:ring-2 focus:ring-[#006c49]"
                          required
                          disabled={!addrProvinceCode}
                        >
                          <option value="">Chọn Quận/Huyện</option>
                          {formDistrictOptions.map((dist) => (
                            <option key={dist.code} value={dist.code}>
                              {dist.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#3c4a42]/70 mb-1">
                        Địa chỉ cụ thể (Số nhà, tên đường, phường/xã)
                      </label>
                      <input
                        type="text"
                        value={addrStreet}
                        onChange={(e) => setAddrStreet(e.target.value)}
                        placeholder="123 Đường Nguyễn Huệ, Phường Bến Nghé"
                        className="w-full rounded-xl border-none bg-[#f4f6fa] px-3.5 py-2.5 text-xs text-[#3c4a42] outline-none focus:ring-2 focus:ring-[#006c49]"
                        required
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        id="addr-default"
                        type="checkbox"
                        checked={addrIsDefault}
                        onChange={(e) => setAddrIsDefault(e.target.checked)}
                        disabled={editingAddressId !== null && addrIsDefault} // Can't uncheck default if editing the current default
                        className="h-4 w-4 rounded text-[#006c49] focus:ring-[#006c49]"
                      />
                      <label htmlFor="addr-default" className="text-xs font-semibold text-[#3c4a42] cursor-pointer">
                        Đặt làm địa chỉ giao hàng mặc định
                      </label>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsAddressFormOpen(false)}
                        className="rounded-full border border-[#bbcabf] px-5 py-2 text-xs font-bold text-[#3c4a42] transition hover:bg-gray-50"
                      >
                        Hủy bỏ
                      </button>
                      <button
                        type="submit"
                        className="rounded-full bg-[#006c49] px-6 py-2 text-xs font-bold text-white transition hover:opacity-90 shadow-sm"
                      >
                        {editingAddressId ? "Cập nhật" : "Lưu địa chỉ"}
                      </button>
                    </div>
                  </form>
                ) : (
                  /* Addresses list view */
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {currentUser.addresses?.map((addr) => (
                      <div
                        key={addr.id}
                        className={`relative rounded-2xl border p-5 shadow-sm transition-all ${
                          addr.isDefault
                            ? "border-[#006c49] bg-[#006c49]/[0.02]"
                            : "border-[#bbcabf]/30 hover:border-[#bbcabf]/60"
                        }`}
                      >
                        {addr.isDefault && (
                          <span className="inline-flex rounded-full bg-[#006c49] px-2 py-0.5 text-[9px] font-extrabold text-white tracking-wide">
                            MẶC ĐỊNH
                          </span>
                        )}

                        <div className="absolute right-4 top-4 flex gap-1">
                          <button
                            onClick={() => handleOpenEditAddress(addr)}
                            aria-label="Chỉnh sửa địa chỉ"
                            className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-gray-100 text-[#3c4a42]/70"
                          >
                            <span className="material-symbols-outlined text-[18px]">edit</span>
                          </button>
                          {currentUser.addresses!.length > 1 && (
                            <button
                              onClick={() => {
                                if (confirm("Bạn có chắc chắn muốn xóa địa chỉ này?")) {
                                  deleteAddress(addr.id);
                                  showToast("Đã xóa địa chỉ giao hàng.");
                                }
                              }}
                              aria-label="Xóa địa chỉ"
                              className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-red-50 text-red-500"
                            >
                              <span className="material-symbols-outlined text-[18px]">delete</span>
                            </button>
                          )}
                        </div>

                        <h4 className="mt-2.5 text-sm font-bold text-[#3c4a42]">
                          {addr.fullName}
                        </h4>
                        <p className="mt-1 text-xs font-semibold text-[#3c4a42]/80">
                          {addr.phone}
                        </p>
                        <p className="mt-2 text-xs leading-5 text-[#3c4a42]/60 font-medium">
                          {addr.streetAddress}, {addr.districtName}, {addr.provinceName}
                        </p>

                        {!addr.isDefault && (
                          <button
                            onClick={() => {
                              setDefaultAddress(addr.id);
                              showToast("Đã thay đổi địa chỉ mặc định.");
                            }}
                            className="mt-4 text-xs font-bold text-[#006c49] hover:underline"
                          >
                            Đặt làm mặc định
                          </button>
                        )}
                      </div>
                    ))}

                    {/* Dotted border Add new address box */}
                    <button
                      onClick={handleOpenAddAddress}
                      className="flex min-h-[170px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#bbcabf]/50 bg-gray-50/50 hover:bg-gray-50 p-6 text-[#3c4a42]/60 transition-all"
                    >
                      <span className="material-symbols-outlined mb-2 text-[28px] text-[#3c4a42]/40">
                        add_circle
                      </span>
                      <span className="text-xs font-bold text-[#3c4a42]/70">Thêm địa chỉ mới</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* 4. CHANGE PASSWORD TAB */}
            {activeTab === "password" && (
              <div className="rounded-3xl border border-[#bbcabf]/30 bg-white p-6 shadow-sm sm:p-8">
                <h3 className="mb-6 text-lg font-bold text-[#006c49]">Đổi mật khẩu</h3>
                <form onSubmit={handleChangePassword} className="max-w-[420px] space-y-4">
                  {/* Current password */}
                  <div>
                    <label htmlFor="current-pass" className="block text-xs font-bold text-[#3c4a42]/70 mb-2">
                      Mật khẩu hiện tại
                    </label>
                    <div className="relative">
                      <input
                        id="current-pass"
                        type={showCurrentPass ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full rounded-2xl border-none bg-[#f4f6fa] pl-4 pr-12 py-3.5 text-sm text-[#3c4a42] outline-none transition focus:ring-2 focus:ring-[#006c49]"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPass(!showCurrentPass)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#006c49] flex items-center"
                      >
                        <span className="material-symbols-outlined text-lg">
                          {showCurrentPass ? "visibility_off" : "visibility"}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* New password */}
                  <div>
                    <label htmlFor="new-pass" className="block text-xs font-bold text-[#3c4a42]/70 mb-2">
                      Mật khẩu mới
                    </label>
                    <div className="relative">
                      <input
                        id="new-pass"
                        type={showNewPass ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Nhập mật khẩu mới"
                        className="w-full rounded-2xl border-none bg-[#f4f6fa] pl-4 pr-12 py-3.5 text-sm text-[#3c4a42] outline-none transition focus:ring-2 focus:ring-[#006c49]"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPass(!showNewPass)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#006c49] flex items-center"
                      >
                        <span className="material-symbols-outlined text-lg">
                          {showNewPass ? "visibility_off" : "visibility"}
                        </span>
                      </button>
                    </div>
                    {/* Password Strength indicator bar */}
                    {newPassword && (
                      <div className="mt-2.5 space-y-1.5">
                        <div className="flex h-1.5 w-full gap-1 rounded-full bg-gray-100 overflow-hidden">
                          <div
                            className={`h-full transition-all duration-300 ${passStrength.color}`}
                            style={{ width: `${passStrength.percent}%` }}
                          ></div>
                        </div>
                        <span className={`text-[10px] font-bold ${passStrength.textClass}`}>
                          {passStrength.label}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Confirm new password */}
                  <div>
                    <label htmlFor="confirm-pass" className="block text-xs font-bold text-[#3c4a42]/70 mb-2">
                      Xác nhận mật khẩu mới
                    </label>
                    <input
                      id="confirm-pass"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Xác nhận mật khẩu mới"
                      className="w-full rounded-2xl border-none bg-[#f4f6fa] px-4 py-3.5 text-sm text-[#3c4a42] outline-none transition focus:ring-2 focus:ring-[#006c49]"
                      required
                    />
                  </div>

                  {/* Save button */}
                  <div className="pt-3">
                    <button
                      type="submit"
                      className="w-full rounded-full bg-[#006c49] py-3.5 text-sm font-bold text-white transition hover:opacity-90 shadow-sm"
                    >
                      Cập nhật mật khẩu
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* 5. NOTIFICATIONS TAB */}
            {activeTab === "notifications" && (
              <div className="rounded-3xl border border-[#bbcabf]/30 bg-white p-6 shadow-sm">
                <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <h3 className="text-lg font-bold text-[#006c49]">Thông báo</h3>
                  <p className="text-xs font-medium text-[#3c4a42]/60">
                    {unreadNotificationCount > 0
                      ? `${unreadNotificationCount} thông báo chưa đọc`
                      : "Tất cả thông báo đã được đọc"}
                  </p>
                  {currentUser && unreadNotificationCount > 0 && (
                    <button
                      onClick={() => markAllAsRead(currentUser.id)}
                      className="inline-flex w-fit items-center gap-1.5 rounded-full border border-[#006c49]/15 bg-[#e6f4ea] px-3 py-2 text-xs font-bold text-[#006c49] transition hover:bg-[#d8efe0]"
                    >
                      Đánh dấu tất cả đã đọc
                    </button>
                  )}
                </div>
                <div className="space-y-4">
                  {!currentUser || userNotifications.length === 0 ? (
                    <div className="py-10 text-center text-[#3c4a42]/50">
                      <span className="material-symbols-outlined text-4xl mb-2">notifications_off</span>
                      <p className="text-sm font-bold">Bạn chưa có thông báo nào.</p>
                    </div>
                  ) : (
                    userNotifications.map((noti) => {
                      const meta = notificationMeta[noti.type] ?? notificationMeta.system;
                      return (
                      <div
                        key={noti.id}
                        onClick={() => markAsRead(noti.id)}
                        className={`rounded-2xl border p-4.5 transition-all cursor-pointer ${
                          !noti.isRead
                            ? "border-[#006c49] bg-[#006c49]/[0.01]"
                            : "border-[#bbcabf]/20 bg-white"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ring-1 ${meta.tone}`}>
                            <span className="material-symbols-outlined text-[22px]">{meta.icon}</span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="mb-2 flex flex-wrap items-center gap-2">
                              <span className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold ring-1 ${meta.tone}`}>
                                {meta.label}
                              </span>
                              <span className="text-[10px] font-bold text-[#3c4a42]/40">
                                {formatNotificationTime(noti.createdAt)}
                              </span>
                            </div>
                            <h4 className="text-sm font-bold text-[#3c4a42] flex items-center gap-1.5">
                              {noti.title}
                              {!noti.isRead && (
                                <span className="h-2 w-2 rounded-full bg-[#006c49]" title="Mới"></span>
                              )}
                            </h4>
                            <p className="mt-1.5 text-xs leading-5 text-[#3c4a42]/70 font-medium">
                              {noti.message}
                            </p>
                            {noti.orderId && (
                              <Link
                                href={`/checkout/success?orderId=${noti.orderId}&readonly=true`}
                                onClick={(event) => {
                                  event.stopPropagation();
                                  markAsRead(noti.id);
                                }}
                                className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[11px] font-bold text-[#006c49] ring-1 ring-[#006c49]/15 transition hover:bg-[#e6f4ea]"
                              >
                                <span className="material-symbols-outlined text-sm">open_in_new</span>
                                Xem đơn hàng
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
            {/* 6. SELLER REGISTRATION & CHANNEL TAB */}
            {activeTab === "seller" && (
              <div className="space-y-6">
                {/* Steps indicator */}
                {currentUser.role !== "seller" && (
                  <div className="mb-6 flex justify-center gap-2 sm:gap-4 rounded-2xl bg-gray-100 p-1.5 text-xs font-bold w-fit mx-auto">
                    <span className={`rounded-xl px-4 py-2 transition-all ${
                      !currentUser.sellerStatus 
                        ? "bg-[#006c49] text-white shadow-sm" 
                        : "text-gray-500 bg-transparent"
                    }`}>
                      State 1: Form
                    </span>
                    <span className={`rounded-xl px-4 py-2 transition-all ${
                      currentUser.sellerStatus === "pending"
                        ? "bg-amber-500 text-white shadow-sm animate-pulse"
                        : "text-gray-500 bg-transparent"
                    }`}>
                      State 2: Pending
                    </span>
                    <span className="rounded-xl px-4 py-2 transition-all text-gray-500 bg-transparent">
                      State 3: Verified
                    </span>
                  </div>
                )}

                {/* State 1: Form UI */}
                {!currentUser.sellerStatus && (
                  <div>
                    {/* Header Banner */}
                    <div className="mb-6 text-center sm:text-left">
                      <h3 className="text-xl font-extrabold text-[#006c49]">Đăng ký bán hàng</h3>
                      <p className="text-xs text-[#3c4a42]/70 mt-1">Bổ sung thông tin để trở thành đối tác của NôngSạch</p>
                    </div>

                    {/* Three Feature Cards */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-6">
                      <div className="flex flex-col items-center justify-center rounded-2xl bg-[#f0f3ff] p-5 text-center border border-[#bbcabf]/20 shadow-sm">
                        <span className="text-3xl mb-2">💰</span>
                        <span className="text-xs font-bold text-[#006c49]">Không phí đăng ký</span>
                      </div>
                      <div className="flex flex-col items-center justify-center rounded-2xl bg-[#f0f3ff] p-5 text-center border border-[#bbcabf]/20 shadow-sm">
                        <span className="text-3xl mb-2">🚚</span>
                        <span className="text-xs font-bold text-[#006c49]">NôngSạch lo vận chuyển</span>
                      </div>
                      <div className="flex flex-col items-center justify-center rounded-2xl bg-[#f0f3ff] p-5 text-center border border-[#bbcabf]/20 shadow-sm">
                        <span className="text-3xl mb-2">⭐</span>
                        <span className="text-xs font-bold text-[#006c49]">Thu nhập minh bạch</span>
                      </div>
                    </div>

                    <form onSubmit={handleRegisterSellerSubmit} className="space-y-6">
                      {/* Section 1: Thông tin cửa hàng */}
                      <section className="rounded-3xl border border-[#bbcabf]/30 bg-white p-6 shadow-sm">
                        <h4 className="mb-5 text-sm font-bold text-[#006c49] flex items-center gap-2">
                          <span className="material-symbols-outlined text-base">storefront</span>
                          Thông tin cửa hàng
                        </h4>

                        {/* Cover Image upload */}
                        <div className="space-y-2 mb-6">
                          <p className="text-[10px] font-medium text-[#3c4a42]/50">
                            Ảnh bìa là tùy chọn, bạn có thể bổ sung sau khi hồ sơ được duyệt.
                          </p>
                          <label className="block text-[11px] font-bold text-[#3c4a42]/70">
                            Ảnh bìa cửa hàng (Banner)
                          </label>
                          <div className="relative w-full h-32 rounded-2xl overflow-hidden bg-slate-100 border-2 border-dashed border-[#bbcabf]/40 group">
                            {shopCoverImage ? (
                              <>
                                <Image
                                  src={shopCoverImage}
                                  alt="Ảnh bìa"
                                  fill
                                  unoptimized
                                  className="object-cover"
                                  sizes="(min-width: 640px) 420px, 100vw"
                                />
                                <button
                                  type="button"
                                  onClick={() => setShopCropSrc(shopCoverImage)}
                                  className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer w-full h-full border-none p-0"
                                >
                                  <span className="text-white text-[10px] font-bold bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-sm">
                                    Cắt / Chỉnh sửa ảnh
                                  </span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => { setShopCoverImage(""); setShopCoverUrl(""); }}
                                  className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-all z-10 text-xs"
                                  title="Xóa ảnh bìa"
                                >✕</button>
                              </>
                            ) : (
                              <div className="flex flex-col items-center justify-center h-full gap-1.5 text-[#3c4a42]/30">
                                <span className="material-symbols-outlined text-3xl">add_photo_alternate</span>
                                <span className="text-[10px] font-semibold">Chưa có ảnh bìa</span>
                              </div>
                            )}
                          </div>

                          <div className="flex gap-2 items-center flex-wrap">
                            <label className="cursor-pointer inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#006c49]/10 text-[#006c49] hover:bg-[#006c49]/20 text-[10px] font-bold border border-[#006c49]/20 transition-all">
                              <span className="material-symbols-outlined text-sm">upload</span>
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
                                    setShopCropSrc(ev.target?.result as string);
                                  };
                                  reader.readAsDataURL(file);
                                  e.target.value = "";
                                }}
                              />
                            </label>
                            <span className="text-[#3c4a42]/40 text-[10px] font-semibold">hoặc URL:</span>
                            <input
                              type="url"
                              value={shopCoverUrl.startsWith("data:") ? "" : shopCoverUrl}
                              onChange={(e) => setShopCoverUrl(e.target.value)}
                              onBlur={(e) => {
                                const url = e.target.value.trim();
                                if (url.startsWith("http")) setShopCropSrc(url);
                              }}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  const url = shopCoverUrl.trim();
                                  if (url.startsWith("http")) setShopCropSrc(url);
                                }
                              }}
                              placeholder="https://..."
                              className="flex-1 min-w-0 rounded-xl bg-[#f4f6fa] px-3 py-1.5 text-[10px] text-[#3c4a42] outline-none focus:ring-2 focus:ring-[#006c49]"
                            />
                          </div>
                        </div>

                        {/* Logo upload */}
                        <div className="flex flex-col items-center justify-center mb-6">
                          <p className="mb-2 text-[10px] font-medium text-[#3c4a42]/50">
                            Ảnh đại diện là tùy chọn, có thể thêm sau.
                          </p>
                          <label className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#bbcabf]/50 bg-gray-50/50 hover:bg-gray-50 transition-all overflow-hidden relative">
                            {shopLogo ? (
                              <Image src={shopLogo} alt="Logo preview" fill unoptimized className="object-cover" sizes="96px" />
                            ) : (
                              <>
                                <span className="material-symbols-outlined text-[28px] text-[#3c4a42]/40">image</span>
                                <span className="text-[10px] font-bold text-[#3c4a42]/60 mt-1">Tải ảnh đại diện</span>
                              </>
                            )}
                            <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                          </label>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          {/* Shop Name */}
                          <div>
                            <label className="block text-[11px] font-bold text-[#3c4a42]/70 mb-1.5">
                              Tên shop *
                            </label>
                            <input
                              type="text"
                              value={shopName}
                              onChange={(e) => setShopName(e.target.value)}
                              placeholder="Ví dụ: Farm Tươi Mỗi Ngày"
                              className="w-full rounded-xl border-none bg-[#f4f6fa] px-3.5 py-3 text-xs text-[#3c4a42] outline-none focus:ring-2 focus:ring-[#006c49]"
                              required
                            />
                          </div>
                          {/* Slogan */}
                          <div>
                            <label className="block text-[11px] font-bold text-[#3c4a42]/70 mb-1.5">
                              Slogan
                            </label>
                            <input
                              type="text"
                              value={shopSlogan}
                              onChange={(e) => setShopSlogan(e.target.value)}
                              placeholder="Slogan của cửa hàng..."
                              className="w-full rounded-xl border-none bg-[#f4f6fa] px-3.5 py-3 text-xs text-[#3c4a42] outline-none focus:ring-2 focus:ring-[#006c49]"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-4">
                          {/* Shop Phone */}
                          <div>
                            <label className="block text-[11px] font-bold text-[#3c4a42]/70 mb-1.5">
                              Số điện thoại *
                            </label>
                            <input
                              type="tel"
                              value={shopPhone}
                              onChange={(e) => setShopPhone(e.target.value)}
                              placeholder="09xx xxx xxx"
                              className="w-full rounded-xl border-none bg-[#f4f6fa] px-3.5 py-3 text-xs text-[#3c4a42] outline-none focus:ring-2 focus:ring-[#006c49]"
                              required
                            />
                          </div>
                          {/* Shop Zalo */}
                          <div>
                            <div className="flex justify-between items-center mb-1.5">
                              <label className="block text-[11px] font-bold text-[#3c4a42]/70">
                                Số Zalo *
                              </label>
                              <label className="flex items-center gap-1.5 cursor-pointer text-[10px] text-[#3c4a42]/60 font-semibold">
                                <input
                                  type="checkbox"
                                  checked={isZaloSame}
                                  onChange={(e) => setIsZaloSame(e.target.checked)}
                                  className="h-3 w-3 rounded text-[#006c49] focus:ring-[#006c49]"
                                />
                                Giống số điện thoại
                              </label>
                            </div>
                            <input
                              type="tel"
                              value={shopZalo}
                              onChange={(e) => setShopZalo(e.target.value)}
                              placeholder="09xx xxx xxx"
                              disabled={isZaloSame}
                              className={`w-full rounded-xl border-none px-3.5 py-3 text-xs text-[#3c4a42] outline-none focus:ring-2 focus:ring-[#006c49] ${
                                isZaloSame ? "bg-[#eef2f6] text-[#3c4a42]/60 cursor-not-allowed" : "bg-[#f4f6fa]"
                              }`}
                              required
                            />
                          </div>
                        </div>

                        {/* Shop Description */}
                        <div className="mt-4">
                          <label className="block text-[11px] font-bold text-[#3c4a42]/70 mb-1.5">
                            Giới thiệu shop *
                          </label>
                          <textarea
                            value={shopDescription}
                            onChange={(e) => setShopDescription(e.target.value)}
                            placeholder="Chia sẻ câu chuyện và cam kết chất lượng của bạn..."
                            rows={4}
                            className="w-full rounded-xl border-none bg-[#f4f6fa] px-3.5 py-3 text-xs text-[#3c4a42] outline-none focus:ring-2 focus:ring-[#006c49]"
                            required
                          />
                        </div>

                        {/* Farm photos */}
                        <div className="mt-4">
                          <p className="mb-2 text-[10px] font-medium text-[#006c49]">
                            Ảnh trang trại sẽ được upload lên Firebase Storage khi gửi hồ sơ.
                          </p>
                          <label className="block text-[11px] font-bold text-[#3c4a42]/70 mb-1.5">
                            Ảnh thực tế trong trang trại *
                          </label>
                          <div className="flex flex-wrap gap-3 items-center">
                            <label className="flex h-16 w-16 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#bbcabf]/50 bg-gray-50/50 hover:bg-gray-50 transition-all text-gray-400">
                              <span className="material-symbols-outlined text-lg">add_a_photo</span>
                              <span className="text-[8px] font-bold mt-0.5">+ Thêm ảnh</span>
                              <input type="file" multiple accept="image/*" onChange={handleFarmImagesUpload} className="hidden" />
                            </label>

                            {farmImages.map((img, idx) => (
                              <div key={idx} className="relative h-16 w-16 rounded-xl overflow-hidden border border-[#bbcabf]/20">
                                <Image src={img} alt="Farm preview" fill unoptimized className="object-cover" sizes="64px" />
                                <button
                                  type="button"
                                  onClick={() => setFarmImages((prev) => prev.filter((_, i) => i !== idx))}
                                  className="absolute top-0.5 right-0.5 h-4.5 w-4.5 rounded-full bg-red-500 text-white flex items-center justify-center text-[10px] hover:bg-red-600 transition"
                                >
                                  ✕
                                </button>
                              </div>
                            ))}
                          </div>
                          <p className="text-[10px] text-[#006c49] font-medium mt-2">
                            Để đảm bảo độ tin cậy cao, vui lòng đăng ảnh thực tế của trang trại, không đăng ảnh trên mạng.
                          </p>
                        </div>
                      </section>

                      {/* Section 2: Thông tin trang trại */}
                      <section className="rounded-3xl border border-[#bbcabf]/30 bg-white p-6 shadow-sm">
                        <h4 className="mb-5 text-sm font-bold text-[#006c49] flex items-center gap-2">
                          <span className="material-symbols-outlined text-base">eco</span>
                          Thông tin trang trại
                        </h4>

                        {/* Main category selection */}
                        <div className="mb-4">
                          <span className="block text-[11px] font-bold text-[#3c4a42]/70 mb-2">Loại nông sản chủ đạo</span>
                          <div className="flex flex-wrap gap-2">
                            {[
                              { id: "vegetables", label: "Rau củ" },
                              { id: "fruits", label: "Trái cây" },
                              { id: "grains", label: "Ngũ cốc" },
                              { id: "herbs", label: "Thảo mộc" },
                              { id: "other", label: "Khác" }
                            ].map((cat) => {
                              const isSelected = selectedMainCategories.includes(cat.label);
                              return (
                                <button
                                  key={cat.id}
                                  type="button"
                                  onClick={() => {
                                    if (isSelected) {
                                      setSelectedMainCategories((prev) => prev.filter((c) => c !== cat.label));
                                    } else {
                                      setSelectedMainCategories((prev) => [...prev, cat.label]);
                                    }
                                  }}
                                  className={`rounded-full px-4 py-1.5 text-xs font-bold border transition-all duration-200 ${
                                    isSelected
                                      ? "bg-[#e6f4ea] border-[#006c49] text-[#006c49] shadow-sm"
                                      : "bg-white border-[#bbcabf]/50 text-[#3c4a42] hover:bg-gray-50"
                                  }`}
                                >
                                  {cat.label}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-4">
                          {/* Province select */}
                          <div>
                            <label className="block text-[11px] font-bold text-[#3c4a42]/70 mb-1.5">
                              Tỉnh / Thành phố
                            </label>
                            <select
                              value={farmProvinceCode}
                              onChange={(e) => setFarmProvinceCode(Number(e.target.value))}
                              className="w-full rounded-xl border-none bg-[#f4f6fa] px-3.5 py-3 text-xs text-[#3c4a42] outline-none focus:ring-2 focus:ring-[#006c49]"
                              required
                            >
                              <option value="">Chọn Tỉnh/Thành phố</option>
                              {provinces.map((prov) => (
                                <option key={prov.code} value={prov.code}>
                                  {prov.name}
                                </option>
                              ))}
                            </select>
                          </div>
                          {/* Specific farm address */}
                          <div>
                            <label className="block text-[11px] font-bold text-[#3c4a42]/70 mb-1.5">
                              Địa chỉ cụ thể trang trại
                            </label>
                            <input
                              type="text"
                              value={farmAddress}
                              onChange={(e) => setFarmAddress(e.target.value)}
                              placeholder="Số nhà, đường, xã/phường..."
                              className="w-full rounded-xl border-none bg-[#f4f6fa] px-3.5 py-3 text-xs text-[#3c4a42] outline-none focus:ring-2 focus:ring-[#006c49]"
                              required
                            />
                          </div>
                        </div>

                        {/* Farming standards checkboxes */}
                        <div className="mt-4">
                          <span className="block text-[11px] font-bold text-[#3c4a42]/70 mb-2">Tiêu chuẩn canh tác</span>
                          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                            {["VietGAP", "GlobalGAP", "Hữu cơ (Organic)", "Chưa có", "Khác"].map((std) => {
                              const isChecked = selectedStandards.includes(std);
                              return (
                                <label key={std} className="flex items-center gap-2 cursor-pointer text-xs text-[#3c4a42] font-semibold">
                                  <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setSelectedStandards((prev) => [...prev, std]);
                                      } else {
                                        setSelectedStandards((prev) => prev.filter((s) => s !== std));
                                      }
                                    }}
                                    className="h-4.5 w-4.5 rounded text-[#006c49] focus:ring-[#006c49]"
                                  />
                                  {std}
                                </label>
                              );
                            })}
                          </div>

                          <div className="mt-3">
                            <input
                              type="text"
                              value={standardsDetail}
                              onChange={(e) => setStandardsDetail(e.target.value)}
                              placeholder="Vui lòng ghi rõ thông tin chi tiết tiêu chuẩn khác..."
                              className="w-full rounded-xl border-none bg-[#f4f6fa] px-3.5 py-3 text-xs text-[#3c4a42] outline-none focus:ring-2 focus:ring-[#006c49]"
                            />
                          </div>
                        </div>
                      </section>

                      {/* Section 3: Xác minh danh tính */}
                      <section className="rounded-3xl border border-[#bbcabf]/30 bg-white p-6 shadow-sm">
                        <h4 className="mb-1 text-sm font-bold text-[#006c49] flex items-center gap-2">
                          <span className="material-symbols-outlined text-base">verified_user</span>
                          Xác minh danh tính
                        </h4>
                        <p className="text-[10px] text-[#3c4a42]/60 mb-5 font-semibold">Thông tin chỉ dùng để xác minh, không hiển thị công khai</p>

                        <div>
                          <label className="block text-[11px] font-bold text-[#3c4a42]/70 mb-1.5">
                            Số CCCD / CMND *
                          </label>
                          <input
                            type="text"
                            value={idCardNumber}
                            onChange={(e) => setIdCardNumber(e.target.value)}
                            placeholder="Nhập số định danh..."
                            className="w-full rounded-xl border-none bg-[#f4f6fa] px-3.5 py-3 text-xs text-[#3c4a42] outline-none focus:ring-2 focus:ring-[#006c49]"
                            required
                          />
                        </div>

                        {/* ID Photos */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-4">
                          <div>
                            <span className="block text-[11px] font-bold text-[#3c4a42]/70 mb-1.5">Mặt trước CCCD *</span>
                            <label className="flex h-28 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#bbcabf]/50 bg-gray-50/50 hover:bg-gray-50 transition-all overflow-hidden relative">
                              {idCardFront ? (
                                <Image src={idCardFront} alt="CCCD Front preview" fill unoptimized className="object-cover" sizes="(min-width: 640px) 50vw, 100vw" />
                              ) : (
                                <>
                                  <span className="material-symbols-outlined text-[24px] text-gray-400">photo_camera</span>
                                  <span className="text-[10px] font-bold text-gray-500 mt-1">Tải lên mặt trước</span>
                                </>
                              )}
                              <input type="file" accept="image/*" onChange={handleIdFrontUpload} className="hidden" />
                            </label>
                          </div>
                          <div>
                            <span className="block text-[11px] font-bold text-[#3c4a42]/70 mb-1.5">Mặt sau CCCD *</span>
                            <label className="flex h-28 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#bbcabf]/50 bg-gray-50/50 hover:bg-gray-50 transition-all overflow-hidden relative">
                              {idCardBack ? (
                                <Image src={idCardBack} alt="CCCD Back preview" fill unoptimized className="object-cover" sizes="(min-width: 640px) 50vw, 100vw" />
                              ) : (
                                <>
                                  <span className="material-symbols-outlined text-[24px] text-gray-400">photo_camera</span>
                                  <span className="text-[10px] font-bold text-gray-500 mt-1">Tải lên mặt sau</span>
                                </>
                              )}
                              <input type="file" accept="image/*" onChange={handleIdBackUpload} className="hidden" />
                            </label>
                          </div>
                        </div>

                        <p className="text-[9px] text-[#3c4a42]/50 font-medium mt-2">Ảnh rõ nét, không che góc, dung lượng tối đa 5MB</p>

                        {/* Callout */}
                        <div className="mt-4 flex gap-2.5 rounded-2xl bg-amber-50 border border-amber-200/50 p-4.5 text-xs text-amber-800 font-medium">
                          <span className="material-symbols-outlined text-[18px] text-amber-600 shrink-0">security</span>
                          <p className="leading-5">Thông tin CCCD được mã hóa và bảo mật tuyệt đối phục vụ xác minh danh tính.</p>
                        </div>
                      </section>

                      {/* Section 4: Thông tin thanh toán */}
                      <section className="rounded-3xl border border-[#bbcabf]/30 bg-white p-6 shadow-sm">
                        <h4 className="mb-5 text-sm font-bold text-[#006c49] flex items-center gap-2">
                          <span className="material-symbols-outlined text-base">payments</span>
                          Thông tin thanh toán
                        </h4>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                          {/* Bank Name */}
                          <div>
                            <label className="block text-[11px] font-bold text-[#3c4a42]/70 mb-1.5">
                              Ngân hàng
                            </label>
                            <select
                              value={bankName}
                              onChange={(e) => setBankName(e.target.value)}
                              className="w-full rounded-xl border-none bg-[#f4f6fa] px-3.5 py-3 text-xs text-[#3c4a42] outline-none focus:ring-2 focus:ring-[#006c49]"
                              required
                            >
                              {["Vietcombank", "Agribank", "BIDV", "Techcombank", "VietinBank", "MB Bank"].map((bank) => (
                                <option key={bank} value={bank}>{bank}</option>
                              ))}
                            </select>
                          </div>
                          {/* Account Number */}
                          <div>
                            <label className="block text-[11px] font-bold text-[#3c4a42]/70 mb-1.5">
                              Số tài khoản *
                            </label>
                            <input
                              type="text"
                              value={bankAccountNumber}
                              onChange={(e) => setBankAccountNumber(e.target.value)}
                              placeholder="Nhập số tài khoản..."
                              className="w-full rounded-xl border-none bg-[#f4f6fa] px-3.5 py-3 text-xs text-[#3c4a42] outline-none focus:ring-2 focus:ring-[#006c49]"
                              required
                            />
                          </div>
                          {/* Account Name */}
                          <div>
                            <label className="block text-[11px] font-bold text-[#3c4a42]/70 mb-1.5">
                              Tên chủ tài khoản *
                            </label>
                            <input
                              type="text"
                              value={bankAccountName}
                              onChange={(e) => setBankAccountName(e.target.value.toUpperCase())}
                              placeholder="TÊN CHỦ TÀI KHOẢN VIẾT HOA..."
                              className="w-full rounded-xl border-none bg-[#f4f6fa] px-3.5 py-3 text-xs text-[#3c4a42] outline-none focus:ring-2 focus:ring-[#006c49]"
                              required
                            />
                          </div>
                        </div>
                      </section>

                      {/* Submit */}
                      <div className="text-center pt-2">
                        <button
                          type="submit"
                          disabled={isSubmittingSeller}
                          className={`w-full rounded-2xl bg-[#006c49] py-4 text-sm font-bold text-white transition hover:opacity-90 shadow-md flex items-center justify-center gap-2 ${
                            isSubmittingSeller ? "opacity-75 cursor-not-allowed" : ""
                          }`}
                        >
                          {isSubmittingSeller ? (
                            <span className="flex items-center gap-2">
                              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                              </svg>
                              Đang xử lý ảnh & gửi đăng ký...
                            </span>
                          ) : (
                            "Gửi đăng ký 🍃"
                          )}
                        </button>
                        <p className="text-[10px] text-gray-500 font-semibold mt-3 flex items-center justify-center gap-1">
                          <span className="material-symbols-outlined text-xs">lock</span>
                          Thông tin bảo mật — NôngSạch xét duyệt trong 1–3 ngày làm việc
                        </p>
                      </div>
                    </form>
                  </div>
                )}

                {/* State 2: Pending Approval UI */}
                {currentUser.sellerStatus === "pending" && (
                  <div className="rounded-3xl border border-[#bbcabf]/30 bg-white p-6 shadow-sm text-center max-w-[580px] mx-auto py-10">
                    <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mb-6 mx-auto border border-amber-200">
                      <span className="material-symbols-outlined text-[36px] animate-pulse">hourglass_empty</span>
                    </div>

                    <h3 className="text-lg font-bold text-amber-700">Hồ sơ đang được xét duyệt</h3>
                    <p className="text-xs text-[#3c4a42]/70 mt-2 leading-relaxed max-w-[400px] mx-auto">
                      Cảm ơn bạn đã đăng ký đối tác! Hồ sơ của bạn đang được ban quản trị NôngSạch kiểm duyệt. Kết quả sẽ được cập nhật trong 1–3 ngày làm việc.
                    </p>

                    {/* Summary Card */}
                    <div className="my-6 border-t border-b border-[#bbcabf]/20 py-4.5 text-left text-xs space-y-2 text-[#3c4a42]/80">
                      <p className="font-bold text-[#006c49] mb-3 text-sm flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-base">storefront</span>
                        Hồ sơ đã gửi:
                      </p>
                      <p><strong>Tên cửa hàng:</strong> {currentUser.sellerInfo?.shopName}</p>
                      {currentUser.sellerInfo?.slogan && <p><strong>Slogan:</strong> {currentUser.sellerInfo?.slogan}</p>}
                      <p><strong>Số điện thoại:</strong> {currentUser.sellerInfo?.shopPhone}</p>
                      <p><strong>Địa chỉ trang trại:</strong> {currentUser.sellerInfo?.farmAddress}, {currentUser.sellerInfo?.province}</p>
                      <p><strong>Nông sản chính:</strong> {currentUser.sellerInfo?.mainCategories.join(", ")}</p>
                      <p><strong>CCCD số:</strong> {currentUser.sellerInfo?.idCardNumber.substring(0, 3)}*********</p>
                      <p><strong>Ngân hàng thụ hưởng:</strong> {currentUser.sellerInfo?.bankName} - {currentUser.sellerInfo?.bankAccountNumber}</p>
                    </div>

                    {/* Simulation helper */}
                    <div className="mt-8 rounded-2xl bg-[#e6f4ea] border border-[#006c49]/20 p-5">
                      <p className="text-xs text-[#006c49] font-bold mb-3 flex items-center justify-center gap-1.5">
                        <span className="material-symbols-outlined text-base">build</span>
                        Khu vực thử nghiệm (Demo Helper)
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          approveSeller(currentUser.id);
                          showToast("Chúc mừng! Cửa hàng đã được phê duyệt thành công.");
                        }}
                        className="rounded-full bg-[#006c49] px-6 py-2.5 text-xs font-bold text-white shadow hover:opacity-90 transition-all flex items-center gap-1.5 mx-auto"
                      >
                        <span className="material-symbols-outlined text-sm">done</span>
                        Phê duyệt hồ sơ ngay (Demo/Test)
                      </button>
                    </div>
                  </div>
                )}

                {/* State 3: Approved Seller Channel / Dashboard */}
                {currentUser.role === "seller" && (
                  <div className="space-y-6">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-[#bbcabf]/30 rounded-3xl p-5 shadow-sm">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e6f4ea] text-[#006c49]">
                          <span className="material-symbols-outlined text-[28px]">store</span>
                        </div>
                        <div>
                          <h3 className="text-base font-extrabold text-[#3c4a42]">{currentUser.sellerInfo?.shopName || "Cửa hàng của tôi"}</h3>
                          <p className="text-[11px] text-[#3c4a42]/70 font-semibold flex items-center gap-1.5 mt-0.5">
                            <span>SĐT: {currentUser.sellerInfo?.shopPhone}</span>
                            <span>•</span>
                            <span>{currentUser.sellerInfo?.farmAddress}, {currentUser.sellerInfo?.province}</span>
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={openEditShopModal}
                          className="rounded-full border border-[#bbcabf]/50 bg-white hover:bg-gray-50 px-4 py-2 text-xs font-bold text-[#3c4a42] shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-sm text-[#006c49]">edit_note</span>
                          Chỉnh sửa Shop
                        </button>
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#e6f4ea] px-3 py-1 text-[10px] font-extrabold text-[#006c49] tracking-wide border border-[#006c49]/10">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#006c49]"></span>
                          ĐỐI TÁC CHÍNH THỨC
                        </span>
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      {[
                        { 
                          title: "Doanh thu tạm tính", 
                          value: formatCurrency(sellerOrders.filter(o => o.status !== "cancelled").reduce((acc, o) => acc + o.totalAmount, 0)), 
                          icon: "payments", 
                          color: "text-blue-600 bg-blue-50 border-blue-100" 
                        },
                        { 
                          title: "Đơn hàng mới", 
                          value: String(sellerOrders.filter(o => o.status === "pending").length), 
                          icon: "inventory_2", 
                          color: "text-amber-600 bg-amber-50 border-amber-100" 
                        },
                        { 
                          title: "Sản phẩm đang bán", 
                          value: String(shopProducts.length), 
                          icon: "shopping_basket", 
                          color: "text-[#006c49] bg-[#e6f4ea]/40 border-[#006c49]/10" 
                        },
                        { 
                          title: "Đánh giá shop", 
                          value: "5.0 ⭐", 
                          icon: "star", 
                          color: "text-red-600 bg-red-50 border-red-100" 
                        }
                      ].map((stat, idx) => (
                        <div key={idx} className={`p-4.5 rounded-2xl border shadow-sm flex items-center justify-between bg-white`}>
                          <div>
                            <p className="text-[10px] font-bold text-[#3c4a42]/60 uppercase tracking-wide">{stat.title}</p>
                            <p className="text-lg font-extrabold text-[#3c4a42] mt-1">{stat.value}</p>
                          </div>
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
                            <span className="material-symbols-outlined text-xl">{stat.icon}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Sub-tabs for Seller */}
                    <div className="flex gap-4 border-b border-[#bbcabf]/20">
                      <button
                        onClick={() => setSellerSubTab("products")}
                        className={`pb-3 text-sm font-bold transition-all ${
                          sellerSubTab === "products"
                            ? "border-b-2 border-[#006c49] text-[#006c49]"
                            : "text-[#3c4a42]/50 hover:text-[#3c4a42]"
                        }`}
                      >
                        Sản phẩm của tôi
                      </button>
                      <button
                        onClick={() => setSellerSubTab("orders")}
                        className={`pb-3 text-sm font-bold transition-all flex items-center gap-1.5 ${
                          sellerSubTab === "orders"
                            ? "border-b-2 border-[#006c49] text-[#006c49]"
                            : "text-[#3c4a42]/50 hover:text-[#3c4a42]"
                        }`}
                      >
                        Đơn hàng của shop
                        {sellerOrders.filter(o => o.status === "pending").length > 0 && (
                          <span className="bg-amber-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                            {sellerOrders.filter(o => o.status === "pending").length}
                          </span>
                        )}
                      </button>
                    </div>

                    {sellerSubTab === "products" ? (
                      <div className="rounded-3xl border border-[#bbcabf]/30 bg-white p-6 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                          <h4 className="text-sm font-bold text-[#006c49] flex items-center gap-2">
                            <span className="material-symbols-outlined text-base">list_alt</span>
                            Danh sách sản phẩm
                          </h4>
                          <button
                            type="button"
                            onClick={() => setIsAddProductOpen(true)}
                            className="rounded-full bg-[#006c49] px-4 py-2 text-xs font-bold text-white shadow-sm hover:opacity-90 transition-all flex items-center gap-1"
                          >
                            <span className="material-symbols-outlined text-sm">add</span>
                            Đăng sản phẩm mới
                          </button>
                        </div>

                        {shopProducts.length === 0 ? (
                          <div className="py-14 text-center text-[#3c4a42]/60">
                            <span className="material-symbols-outlined mb-2 text-[48px] text-[#3c4a42]/30">
                              inventory
                            </span>
                            <p className="text-xs font-bold">Cửa hàng chưa có sản phẩm nào đăng bán.</p>
                            <p className="text-[10px] text-[#3c4a42]/50 mt-1">Bấm nút &quot;Đăng sản phẩm mới&quot; ở trên để đưa nông sản của bạn lên cửa hàng nhé.</p>
                          </div>
                        ) : (
                          <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs border-collapse">
                              <thead>
                                <tr className="border-b border-[#bbcabf]/25 text-[#3c4a42]/50 font-bold">
                                  <th className="pb-3 pr-2">Ảnh</th>
                                  <th className="pb-3 pr-2">Tên sản phẩm</th>
                                  <th className="pb-3 pr-2">Danh mục</th>
                                  <th className="pb-3 pr-2">Giá bán</th>
                                  <th className="pb-3 pr-2">Tồn kho</th>
                                  <th className="pb-3 pr-2">Nguồn gốc</th>
                                  <th className="pb-3 pr-2 text-right">Thao tác</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-[#bbcabf]/15">
                                {shopProducts.map((p) => (
                                  <tr key={p.id} className="text-[#3c4a42]">
                                    <td className="py-3 pr-2">
                                      <div className="relative h-10 w-10 overflow-hidden rounded-lg border border-gray-100">
                                        <Image
                                          src={p.image}
                                          alt={p.name}
                                          fill
                                          className="object-cover"
                                          sizes="40px"
                                        />
                                      </div>
                                    </td>
                                    <td className="py-3 pr-2 font-bold">{p.name}</td>
                                    <td className="py-3 pr-2 font-semibold">
                                      {p.category === "vegetables" && "Rau củ"}
                                      {p.category === "fruits" && "Trái cây"}
                                      {p.category === "grains" && "Ngũ cốc"}
                                      {p.category === "roots" && "Củ quả"}
                                      {p.category === "herbs" && "Thảo mộc"}
                                      {p.category === "other" && "Khác"}
                                    </td>
                                    <td className="py-3 pr-2 font-extrabold text-[#006c49]">
                                      {formatCurrency(p.price)}/{p.unit}
                                    </td>
                                    <td className="py-3 pr-2 font-semibold">{p.stock} {p.unit}</td>
                                    <td className="py-3 pr-2 font-semibold">{p.origin}</td>
                                    <td className="py-3 pr-2 text-right space-x-1.5 whitespace-nowrap">
                                      <Link
                                        href={`/products/${p.id}`}
                                        target="_blank"
                                        className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-gray-50 text-gray-500 hover:bg-gray-100 transition-colors"
                                        title="Xem chi tiết"
                                      >
                                        <span className="material-symbols-outlined text-[16px]">visibility</span>
                                      </Link>
                                      <button
                                        type="button"
                                        onClick={() => handleEditProduct(p)}
                                        className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
                                        title="Chỉnh sửa"
                                      >
                                        <span className="material-symbols-outlined text-[16px]">edit</span>
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleDeleteProduct(p.id)}
                                        className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                                        title="Xóa"
                                      >
                                        <span className="material-symbols-outlined text-[16px]">delete</span>
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="rounded-3xl border border-[#bbcabf]/30 bg-white p-6 shadow-sm">
                        <h4 className="text-sm font-bold text-[#006c49] flex items-center gap-2 mb-6">
                          <span className="material-symbols-outlined text-base">shopping_bag</span>
                          Quản lý đơn hàng
                        </h4>

                        {sellerOrders.length === 0 ? (
                          <div className="py-14 text-center text-[#3c4a42]/60">
                            <span className="material-symbols-outlined mb-2 text-[48px] text-[#3c4a42]/30">
                              receipt_long
                            </span>
                            <p className="text-xs font-bold">Chưa có đơn hàng nào.</p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {sellerOrders.map((order) => (
                              <div key={order.id} className="border border-[#bbcabf]/20 rounded-2xl p-4 space-y-3 hover:border-[#006c49]/30 transition-all bg-white shadow-sm">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <p className="text-[10px] font-bold text-[#3c4a42]/50 uppercase">Mã đơn hàng</p>
                                    <p className="text-xs font-extrabold text-[#006c49]">#{order.id}</p>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-[10px] font-bold text-[#3c4a42]/50 uppercase">Trạng thái</p>
                                    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                      order.status === "pending" ? "bg-amber-50 text-amber-600 border border-amber-100" :
                                      order.status === "confirmed" ? "bg-blue-50 text-blue-600 border border-blue-100" :
                                      order.status === "shipping" ? "bg-purple-50 text-purple-600 border border-purple-100" :
                                      order.status === "delivered" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" :
                                      "bg-red-50 text-red-600 border border-red-100"
                                    }`}>
                                      {order.status === "pending" ? "Chờ xác nhận" :
                                       order.status === "confirmed" ? "Đã xác nhận" :
                                       order.status === "shipping" ? "Đang giao" :
                                       order.status === "delivered" ? "Đã giao" : "Đã hủy"}
                                    </span>
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2.5 border-y border-[#bbcabf]/10">
                                  <div>
                                    <p className="text-[10px] font-bold text-[#3c4a42]/50 uppercase mb-1">Khách hàng</p>
                                    <p className="text-xs font-bold text-[#3c4a42]">{order.fullName}</p>
                                    <p className="text-[10px] text-[#3c4a42]/70 mt-0.5">{order.phone}</p>
                                    <p className="text-[10px] text-[#3c4a42]/70 mt-0.5 truncate max-w-[200px]">{order.address}</p>
                                  </div>
                                  <div>
                                    <p className="text-[10px] font-bold text-[#3c4a42]/50 uppercase mb-1">Chi tiết đơn</p>
                                    <p className="text-xs font-extrabold text-[#006c49]">{formatCurrency(order.totalAmount)}</p>
                                    <p className="text-[10px] text-[#3c4a42]/70 mt-0.5">{order.items.length} món sản phẩm</p>
                                    <p className="text-[10px] text-[#3c4a42]/40 mt-0.5">{new Date(order.createdAt).toLocaleString("vi-VN")}</p>
                                  </div>
                                </div>

                                <div className="flex flex-wrap gap-2 pt-1">
                                  {order.status === "pending" && (
                                    <button
                                      onClick={() => handleUpdateOrderStatus(order.id, "confirmed", order.userId)}
                                      className="flex-1 bg-[#006c49] text-white text-[10px] font-bold py-2 rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-1.5"
                                    >
                                      <span className="material-symbols-outlined text-sm">check_circle</span>
                                      Xác nhận đơn
                                    </button>
                                  )}
                                  {order.status === "confirmed" && (
                                    <button
                                      onClick={() => handleUpdateOrderStatus(order.id, "shipping", order.userId)}
                                      className="flex-1 bg-blue-600 text-white text-[10px] font-bold py-2 rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-1.5"
                                    >
                                      <span className="material-symbols-outlined text-sm">local_shipping</span>
                                      Bắt đầu giao
                                    </button>
                                  )}
                                  {order.status === "shipping" && (
                                    <button
                                      onClick={() => handleUpdateOrderStatus(order.id, "delivered", order.userId)}
                                      className="flex-1 bg-emerald-600 text-white text-[10px] font-bold py-2 rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-1.5"
                                    >
                                      <span className="material-symbols-outlined text-sm">task_alt</span>
                                      Hoàn tất giao
                                    </button>
                                  )}
                                  {order.status !== "delivered" && order.status !== "cancelled" && (
                                    <button
                                      onClick={() => handleUpdateOrderStatus(order.id, "cancelled", order.userId)}
                                      className="px-4 bg-red-50 text-red-600 text-[10px] font-bold py-2 rounded-xl hover:bg-red-100 transition-all flex items-center gap-1.5"
                                    >
                                      <span className="material-symbols-outlined text-sm">cancel</span>
                                      Hủy
                                    </button>
                                  )}
                                  <Link
                                    href={`/checkout/success?orderId=${order.id}&readonly=true`}
                                    className="px-4 bg-gray-50 text-gray-600 text-[10px] font-bold py-2 rounded-xl hover:bg-gray-100 transition-all flex items-center gap-1.5 border border-gray-200"
                                  >
                                    <span className="material-symbols-outlined text-sm">visibility</span>
                                    Xem
                                  </Link>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Add Product Modal Dialog */}
                    {isAddProductOpen && (
                      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                        <div className="w-full max-w-[500px] rounded-3xl bg-white p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
                          <div className="flex justify-between items-center border-b border-[#bbcabf]/20 pb-3">
                            <h4 className="text-sm font-bold text-[#006c49] flex items-center gap-1.5">
                              <span className="material-symbols-outlined text-base">
                                {editingProduct ? "edit" : "add_circle"}
                              </span>
                              {editingProduct ? "Chỉnh sửa sản phẩm nông sản" : "Đăng bán sản phẩm nông sản"}
                            </h4>
                            <button
                              type="button"
                              onClick={closeProductModal}
                              className="text-gray-400 hover:text-gray-600 flex h-7 w-7 items-center justify-center rounded-full hover:bg-gray-100"
                            >
                              ✕
                            </button>
                          </div>

                          <form onSubmit={handleAddProductSubmit} className="space-y-4 text-left">
                            {/* Product Name */}
                            <div>
                              <label className="block text-[11px] font-bold text-[#3c4a42]/70 mb-1">
                                Tên sản phẩm *
                              </label>
                              <input
                                type="text"
                                value={newProdName}
                                onChange={(e) => setNewProdName(e.target.value)}
                                placeholder="Ví dụ: Cà chua chuỗi ngọc, Rau cải bó xôi..."
                                className="w-full rounded-xl border-none bg-[#f4f6fa] px-3.5 py-2.5 text-xs text-[#3c4a42] outline-none focus:ring-2 focus:ring-[#006c49]"
                                required
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              {/* Category selection */}
                              <div>
                                <label className="block text-[11px] font-bold text-[#3c4a42]/70 mb-1">
                                  Danh mục *
                                </label>
                                <select
                                  value={newProdCategory}
                                  onChange={(e) => setNewProdCategory(e.target.value as ProductCategory)}
                                  className="w-full rounded-xl border-none bg-[#f4f6fa] px-3.5 py-2.5 text-xs text-[#3c4a42] outline-none focus:ring-2 focus:ring-[#006c49]"
                                  required
                                >
                                  <option value="vegetables">Rau củ</option>
                                  <option value="fruits">Trái cây</option>
                                  <option value="grains">Ngũ cốc</option>
                                  <option value="roots">Củ quả</option>
                                  <option value="herbs">Thảo mộc</option>
                                  <option value="other">Khác</option>
                                </select>
                              </div>
                              {/* Unit */}
                              <div>
                                <label className="block text-[11px] font-bold text-[#3c4a42]/70 mb-1">
                                  Đơn vị tính *
                                </label>
                                <select
                                  value={["kg", "bó", "hộp", "túi", "trái", "khay"].includes(newProdUnit) ? newProdUnit : "khác"}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    if (val === "khác") {
                                      setNewProdUnit("");
                                    } else {
                                      setNewProdUnit(val);
                                    }
                                  }}
                                  className="w-full rounded-xl border-none bg-[#f4f6fa] px-3.5 py-2.5 text-xs text-[#3c4a42] outline-none focus:ring-2 focus:ring-[#006c49]"
                                  required
                                >
                                  <option value="kg">kg</option>
                                  <option value="bó">bó</option>
                                  <option value="hộp">hộp</option>
                                  <option value="túi">túi</option>
                                  <option value="trái">trái (quả)</option>
                                  <option value="khay">khay</option>
                                  <option value="khác">Khác...</option>
                                </select>
                                {!["kg", "bó", "hộp", "túi", "trái", "khay"].includes(newProdUnit) && (
                                  <input
                                    type="text"
                                    value={newProdUnit}
                                    onChange={(e) => setNewProdUnit(e.target.value)}
                                    placeholder="Nhập đơn vị tính..."
                                    className="mt-2 w-full rounded-xl border-none bg-[#f4f6fa] px-3.5 py-2 text-xs text-[#3c4a42] outline-none focus:ring-2 focus:ring-[#006c49]"
                                    required
                                  />
                                )}
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              {/* Price */}
                              <div>
                                <label className="block text-[11px] font-bold text-[#3c4a42]/70 mb-1">
                                  Giá bán (đ/đơn vị) *
                                </label>
                                <input
                                  type="number"
                                  value={newProdPrice}
                                  onChange={(e) => setNewProdPrice(e.target.value)}
                                  placeholder="Ví dụ: 35000"
                                  className="w-full rounded-xl border-none bg-[#f4f6fa] px-3.5 py-2.5 text-xs text-[#3c4a42] outline-none focus:ring-2 focus:ring-[#006c49]"
                                  required
                                />
                              </div>
                              {/* Stock */}
                              <div>
                                <label className="block text-[11px] font-bold text-[#3c4a42]/70 mb-1">
                                  Số lượng tồn kho *
                                </label>
                                <input
                                  type="number"
                                  value={newProdStock}
                                  onChange={(e) => setNewProdStock(e.target.value)}
                                  placeholder="Ví dụ: 100"
                                  className="w-full rounded-xl border-none bg-[#f4f6fa] px-3.5 py-2.5 text-xs text-[#3c4a42] outline-none focus:ring-2 focus:ring-[#006c49]"
                                  required
                                />
                              </div>
                            </div>

                            {/* Origin */}
                            <div>
                              <label className="block text-[11px] font-bold text-[#3c4a42]/70 mb-1">
                                Nguồn gốc xuất xứ *
                              </label>
                              <input
                                type="text"
                                value={newProdOrigin}
                                onChange={(e) => setNewProdOrigin(e.target.value)}
                                placeholder="Ví dụ: Đà Lạt, Hưng Yên..."
                                className="w-full rounded-xl border-none bg-[#f4f6fa] px-3.5 py-2.5 text-xs text-[#3c4a42] outline-none focus:ring-2 focus:ring-[#006c49]"
                                required
                              />
                            </div>

                            {/* Product Images Upload */}
                            <div>
                              <label className="block text-[11px] font-bold text-[#3c4a42]/70 mb-1.5">
                                Hình ảnh sản phẩm (Tối đa 6 ảnh) *
                              </label>
                              <div className="flex flex-wrap gap-2 items-center">
                                {newProdImages.length < 6 && (
                                  <label className="flex h-16 w-16 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#bbcabf]/50 bg-gray-50/50 hover:bg-gray-50 transition-all shrink-0">
                                    <span className="material-symbols-outlined text-lg text-gray-400">add_a_photo</span>
                                    <span className="text-[8px] font-bold text-gray-500 mt-0.5">Thêm ảnh</span>
                                    <input
                                      type="file"
                                      multiple
                                      accept="image/*"
                                      onChange={handleProductMultipleImagesUpload}
                                      className="hidden"
                                    />
                                  </label>
                                )}
                                
                                {newProdImages.map((img, idx) => {
                                  const isMain = idx === 0;
                                  return (
                                    <div key={idx} className={`relative h-16 w-16 rounded-xl overflow-hidden border-2 ${isMain ? 'border-[#006c49] shadow-sm' : 'border-gray-200'} shrink-0 group`}>
                                      <Image src={img} alt={`Product preview ${idx}`} fill unoptimized className="object-cover" sizes="64px" />
                                      {isMain && (
                                        <div className="absolute top-0 left-0 bg-[#006c49] text-white text-[8px] font-bold px-1.5 py-0.5 rounded-br-lg">
                                          Bìa
                                        </div>
                                      )}
                                      
                                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-1">
                                        {/* Delete Button */}
                                        <button
                                          type="button"
                                          onClick={() => {
                                            const updated = newProdImages.filter((_, i) => i !== idx);
                                            setNewProdImages(updated);
                                            if (isMain) {
                                              setNewProdImage(updated[0] || "");
                                            }
                                          }}
                                          className="text-white hover:text-red-400 text-right text-[10px] font-bold self-end"
                                        >
                                          ✕
                                        </button>
                                        
                                        {/* Set Main Button */}
                                        {!isMain && (
                                          <button
                                            type="button"
                                            onClick={() => {
                                              const selected = newProdImages[idx];
                                              const remaining = newProdImages.filter((_, i) => i !== idx);
                                              const updated = [selected, ...remaining];
                                              setNewProdImages(updated);
                                              setNewProdImage(selected);
                                            }}
                                            className="bg-[#006c49] text-white text-[8px] font-bold py-0.5 rounded text-center hover:opacity-90"
                                          >
                                            Đặt làm bìa
                                          </button>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                              <p className="text-[9px] text-[#3c4a42]/50 font-medium mt-1.5">
                                Ảnh đầu tiên sẽ là ảnh đại diện (Ảnh bìa). Nhấp &quot;Đặt làm bìa&quot; để thay đổi.
                              </p>
                            </div>

                            {/* Product Description */}
                            <div>
                              <label className="block text-[11px] font-bold text-[#3c4a42]/70 mb-1">
                                Mô tả chi tiết sản phẩm
                              </label>
                              <textarea
                                value={newProdDescription}
                                onChange={(e) => setNewProdDescription(e.target.value)}
                                placeholder="Ghi thêm thông tin mô tả chi tiết nông sản (cách chăm sóc, chất lượng, cách ăn)..."
                                rows={3}
                                className="w-full rounded-xl border-none bg-[#f4f6fa] px-3.5 py-2.5 text-xs text-[#3c4a42] outline-none focus:ring-2 focus:ring-[#006c49]"
                              />
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-end gap-2 pt-2 border-t border-[#bbcabf]/15">
                              <button
                                type="button"
                                onClick={closeProductModal}
                                className="rounded-full border border-[#bbcabf] px-5 py-2 text-xs font-bold text-[#3c4a42] transition hover:bg-[#f4f6fa]"
                              >
                                Hủy bỏ
                              </button>
                              <button
                                type="submit"
                                className="rounded-full bg-[#006c49] px-6 py-2 text-xs font-bold text-white transition hover:opacity-90 shadow-sm"
                              >
                                {editingProduct ? "Cập nhật sản phẩm" : "Đăng sản phẩm"}
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    )}

                    {/* Edit Shop Modal Dialog */}
                    {isEditShopOpen && (
                      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                        <div className="w-full max-w-[650px] rounded-3xl bg-white p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
                          <div className="flex justify-between items-center border-b border-[#bbcabf]/20 pb-3">
                            <h4 className="text-sm font-bold text-[#006c49] flex items-center gap-1.5">
                              <span className="material-symbols-outlined text-base">edit_note</span>
                              Chỉnh sửa thông tin Shop
                            </h4>
                            <button
                              type="button"
                              onClick={() => setIsEditShopOpen(false)}
                              className="text-gray-400 hover:text-gray-600 flex h-7 w-7 items-center justify-center rounded-full hover:bg-gray-100"
                            >
                              ✕
                            </button>
                          </div>

                          <form onSubmit={handleEditShopSubmit} className="space-y-5 text-left">

                            {/* ── Ảnh bìa cửa hàng ─────────────────────────── */}
                            <div className="space-y-2">
                              <h5 className="text-xs font-bold text-[#006c49] flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm">image</span>
                                Ảnh bìa cửa hàng
                              </h5>

                              <p className="text-[10px] font-medium text-[#3c4a42]/50">
                                Ảnh bìa là tùy chọn, có thể bổ sung hoặc đổi sau.
                              </p>

                              {/* Preview */}
                              <div className="relative w-full h-32 rounded-2xl overflow-hidden bg-slate-100 border-2 border-dashed border-[#bbcabf]/40 group">
                                {shopCoverImage ? (
                                  <>
                                    <Image
                                      src={shopCoverImage}
                                      alt="Ảnh bìa"
                                      fill
                                      unoptimized
                                      className="object-cover"
                                      sizes="(min-width: 640px) 420px, 100vw"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => setShopCropSrc(shopCoverImage)}
                                      className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer w-full h-full border-none p-0"
                                    >
                                      <span className="text-white text-[10px] font-bold bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-sm">
                                        Cắt / Chỉnh sửa ảnh
                                      </span>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => { setShopCoverImage(""); setShopCoverUrl(""); }}
                                      className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-all z-10 text-xs"
                                      title="Xóa ảnh bìa"
                                    >✕</button>
                                  </>
                                ) : (
                                  <div className="flex flex-col items-center justify-center h-full gap-1.5 text-[#3c4a42]/30">
                                    <span className="material-symbols-outlined text-3xl">add_photo_alternate</span>
                                    <span className="text-[10px] font-semibold">Chưa có ảnh bìa</span>
                                  </div>
                                )}
                              </div>

                              {/* Upload + URL */}
                              <div className="flex gap-2 items-center flex-wrap">
                                <label className="cursor-pointer inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#006c49]/10 text-[#006c49] hover:bg-[#006c49]/20 text-[10px] font-bold border border-[#006c49]/20 transition-all">
                                  <span className="material-symbols-outlined text-sm">upload</span>
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
                                        setShopCropSrc(ev.target?.result as string);
                                      };
                                      reader.readAsDataURL(file);
                                      e.target.value = "";
                                    }}
                                  />
                                </label>
                                <span className="text-[#3c4a42]/40 text-[10px] font-semibold">hoặc URL:</span>
                                <input
                                  type="url"
                                  value={shopCoverUrl.startsWith("data:") ? "" : shopCoverUrl}
                                  onChange={(e) => setShopCoverUrl(e.target.value)}
                                  onBlur={(e) => {
                                    const url = e.target.value.trim();
                                    if (url.startsWith("http")) setShopCropSrc(url);
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      const url = shopCoverUrl.trim();
                                      if (url.startsWith("http")) setShopCropSrc(url);
                                    }
                                  }}
                                  placeholder="https://... nhấn Enter"
                                  className="flex-1 min-w-0 rounded-xl bg-[#f4f6fa] px-3 py-1.5 text-[10px] text-[#3c4a42] outline-none focus:ring-2 focus:ring-[#006c49]"
                                />
                              </div>
                              <p className="text-[9px] text-[#3c4a42]/40 font-medium">Ảnh sẽ được cắt tỉ lệ 16:5 để khớp banner</p>
                            </div>

                            <div className="border-t border-[#bbcabf]/20" />

                            {/* Section 1: Basic Info */}
                            <div className="space-y-4">
                              <h5 className="text-xs font-bold text-[#006c49] flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm">storefront</span>
                                Thông tin cửa hàng
                              </h5>
                              
                              <div className="flex flex-col items-center justify-center mb-2">
                                <p className="mb-2 text-[10px] font-medium text-[#3c4a42]/50">
                                  Ảnh đại diện là tùy chọn.
                                </p>
                                <label className="flex h-20 w-20 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#bbcabf]/50 bg-gray-50/50 hover:bg-gray-50 transition-all overflow-hidden relative">
                                  {shopLogo ? (
                                    <Image src={shopLogo} alt="Logo preview" fill unoptimized className="object-cover" sizes="80px" />
                                  ) : (
                                    <>
                                      <span className="material-symbols-outlined text-[20px] text-[#3c4a42]/40">image</span>
                                      <span className="text-[8px] font-bold text-[#3c4a42]/60 mt-1">Logo Shop</span>
                                    </>
                                  )}
                                  <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                                </label>
                              </div>

                              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <div>
                                  <label className="block text-[10px] font-bold text-[#3c4a42]/70 mb-1">
                                    Tên shop *
                                  </label>
                                  <input
                                    type="text"
                                    value={shopName}
                                    onChange={(e) => setShopName(e.target.value)}
                                    className="w-full rounded-xl border-none bg-[#f4f6fa] px-3.5 py-2.5 text-xs text-[#3c4a42] outline-none focus:ring-2 focus:ring-[#006c49]"
                                    required
                                  />
                                </div>
                                <div>
                                  <label className="block text-[10px] font-bold text-[#3c4a42]/70 mb-1">
                                    Slogan
                                  </label>
                                  <input
                                    type="text"
                                    value={shopSlogan}
                                    onChange={(e) => setShopSlogan(e.target.value)}
                                    className="w-full rounded-xl border-none bg-[#f4f6fa] px-3.5 py-2.5 text-xs text-[#3c4a42] outline-none focus:ring-2 focus:ring-[#006c49]"
                                  />
                                </div>
                              </div>

                              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <div>
                                  <label className="block text-[10px] font-bold text-[#3c4a42]/70 mb-1">
                                    Số điện thoại *
                                  </label>
                                  <input
                                    type="tel"
                                    value={shopPhone}
                                    onChange={(e) => setShopPhone(e.target.value)}
                                    className="w-full rounded-xl border-none bg-[#f4f6fa] px-3.5 py-2.5 text-xs text-[#3c4a42] outline-none focus:ring-2 focus:ring-[#006c49]"
                                    required
                                  />
                                </div>
                                <div>
                                  <div className="flex justify-between items-center mb-1">
                                    <label className="block text-[10px] font-bold text-[#3c4a42]/70">
                                      Số Zalo *
                                    </label>
                                    <label className="flex items-center gap-1 cursor-pointer text-[9px] text-[#3c4a42]/60 font-semibold">
                                      <input
                                        type="checkbox"
                                        checked={isZaloSame}
                                        onChange={(e) => {
                                          setIsZaloSame(e.target.checked);
                                          if (e.target.checked) setShopZalo(shopPhone);
                                        }}
                                        className="h-3 w-3 rounded text-[#006c49] focus:ring-[#006c49]"
                                      />
                                      Giống số điện thoại
                                    </label>
                                  </div>
                                  <input
                                    type="tel"
                                    value={shopZalo}
                                    onChange={(e) => setShopZalo(e.target.value)}
                                    disabled={isZaloSame}
                                    className={`w-full rounded-xl border-none px-3.5 py-2.5 text-xs text-[#3c4a42] outline-none focus:ring-2 focus:ring-[#006c49] ${
                                      isZaloSame ? "bg-[#eef2f6] text-[#3c4a42]/60 cursor-not-allowed" : "bg-[#f4f6fa]"
                                    }`}
                                    required
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="block text-[10px] font-bold text-[#3c4a42]/70 mb-1">
                                  Giới thiệu shop *
                                </label>
                                <textarea
                                  value={shopDescription}
                                  onChange={(e) => setShopDescription(e.target.value)}
                                  rows={3}
                                  className="w-full rounded-xl border-none bg-[#f4f6fa] px-3.5 py-2.5 text-xs text-[#3c4a42] outline-none focus:ring-2 focus:ring-[#006c49]"
                                  required
                                />
                              </div>

                              <div>
                                <label className="block text-[10px] font-bold text-[#3c4a42]/70 mb-1">
                                  Ảnh thực tế trong trang trại *
                                </label>
                                <p className="mb-2 text-[10px] font-medium text-[#006c49]">
                                  Ảnh trang trại sẽ được upload lên Firebase Storage khi cập nhật shop.
                                </p>
                                <div className="flex flex-wrap gap-2 items-center">
                                  <label className="flex h-14 w-14 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#bbcabf]/50 bg-gray-50/50 hover:bg-gray-50 transition-all text-gray-400">
                                    <span className="material-symbols-outlined text-base">add_a_photo</span>
                                    <input type="file" multiple accept="image/*" onChange={handleFarmImagesUpload} className="hidden" />
                                  </label>

                                  {farmImages.map((img, idx) => (
                                    <div key={idx} className="relative h-14 w-14 rounded-xl overflow-hidden border border-[#bbcabf]/20">
                                      <Image src={img} alt="Farm preview" fill unoptimized className="object-cover" sizes="56px" />
                                      <button
                                        type="button"
                                        onClick={() => setFarmImages((prev) => prev.filter((_, i) => i !== idx))}
                                        className="absolute top-0.5 right-0.5 h-4 w-4 rounded-full bg-red-500 text-white flex items-center justify-center text-[9px] hover:bg-red-600 transition"
                                      >
                                        ✕
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>

                            {/* Section 2: Farm Info */}
                            <div className="space-y-4 pt-2 border-t border-[#bbcabf]/15">
                              <h5 className="text-xs font-bold text-[#006c49] flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm">eco</span>
                                Thông tin trang trại
                              </h5>

                              <div>
                                <span className="block text-[10px] font-bold text-[#3c4a42]/70 mb-1.5">Loại nông sản chủ đạo</span>
                                <div className="flex flex-wrap gap-1.5">
                                  {[
                                    { id: "vegetables", label: "Rau củ" },
                                    { id: "fruits", label: "Trái cây" },
                                    { id: "grains", label: "Ngũ cốc" },
                                    { id: "herbs", label: "Thảo mộc" },
                                    { id: "other", label: "Khác" }
                                  ].map((cat) => {
                                    const isSelected = selectedMainCategories.includes(cat.label);
                                    return (
                                      <button
                                        key={cat.id}
                                        type="button"
                                        onClick={() => {
                                          if (isSelected) {
                                            setSelectedMainCategories((prev) => prev.filter((c) => c !== cat.label));
                                          } else {
                                            setSelectedMainCategories((prev) => [...prev, cat.label]);
                                          }
                                        }}
                                        className={`rounded-full px-3.5 py-1 text-[11px] font-bold border transition-all duration-200 ${
                                          isSelected
                                            ? "bg-[#e6f4ea] border-[#006c49] text-[#006c49]"
                                            : "bg-white border-[#bbcabf]/50 text-[#3c4a42] hover:bg-gray-50"
                                        }`}
                                      >
                                        {cat.label}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>

                              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <div>
                                  <label className="block text-[10px] font-bold text-[#3c4a42]/70 mb-1">
                                    Tỉnh / Thành phố
                                  </label>
                                  <select
                                    value={farmProvinceCode}
                                    onChange={(e) => setFarmProvinceCode(Number(e.target.value))}
                                    className="w-full rounded-xl border-none bg-[#f4f6fa] px-3.5 py-2.5 text-xs text-[#3c4a42] outline-none focus:ring-2 focus:ring-[#006c49]"
                                    required
                                  >
                                    <option value="">Chọn Tỉnh/Thành phố</option>
                                    {provinces.map((prov) => (
                                      <option key={prov.code} value={prov.code}>
                                        {prov.name}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-[10px] font-bold text-[#3c4a42]/70 mb-1">
                                    Địa chỉ cụ thể trang trại
                                  </label>
                                  <input
                                    type="text"
                                    value={farmAddress}
                                    onChange={(e) => setFarmAddress(e.target.value)}
                                    className="w-full rounded-xl border-none bg-[#f4f6fa] px-3.5 py-2.5 text-xs text-[#3c4a42] outline-none focus:ring-2 focus:ring-[#006c49]"
                                    required
                                  />
                                </div>
                              </div>

                              <div>
                                <span className="block text-[10px] font-bold text-[#3c4a42]/70 mb-1.5">Tiêu chuẩn canh tác</span>
                                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                                  {["VietGAP", "GlobalGAP", "Hữu cơ (Organic)", "Chưa có", "Khác"].map((std) => {
                                    const isChecked = selectedStandards.includes(std);
                                    return (
                                      <label key={std} className="flex items-center gap-1.5 cursor-pointer text-xs text-[#3c4a42] font-semibold">
                                        <input
                                          type="checkbox"
                                          checked={isChecked}
                                          onChange={(e) => {
                                            if (e.target.checked) {
                                              setSelectedStandards((prev) => [...prev, std]);
                                            } else {
                                              setSelectedStandards((prev) => prev.filter((s) => s !== std));
                                            }
                                          }}
                                          className="h-4 w-4 rounded text-[#006c49] focus:ring-[#006c49]"
                                        />
                                        {std}
                                      </label>
                                    );
                                  })}
                                </div>
                                <div className="mt-2">
                                  <input
                                    type="text"
                                    value={standardsDetail}
                                    onChange={(e) => setStandardsDetail(e.target.value)}
                                    placeholder="Thông tin chi tiết tiêu chuẩn khác..."
                                    className="w-full rounded-xl border-none bg-[#f4f6fa] px-3.5 py-2 text-xs text-[#3c4a42] outline-none focus:ring-2 focus:ring-[#006c49]"
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Section 3: Bank Details */}
                            <div className="space-y-4 pt-2 border-t border-[#bbcabf]/15">
                              <h5 className="text-xs font-bold text-[#006c49] flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm">payments</span>
                                Thông tin thanh toán ngân hàng
                              </h5>
                              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                                <div>
                                  <label className="block text-[10px] font-bold text-[#3c4a42]/70 mb-1">
                                    Ngân hàng
                                  </label>
                                  <select
                                    value={bankName}
                                    onChange={(e) => setBankName(e.target.value)}
                                    className="w-full rounded-xl border-none bg-[#f4f6fa] px-3.5 py-2.5 text-xs text-[#3c4a42] outline-none focus:ring-2 focus:ring-[#006c49]"
                                    required
                                  >
                                    {["Vietcombank", "Agribank", "BIDV", "Techcombank", "VietinBank", "MB Bank"].map((bank) => (
                                      <option key={bank} value={bank}>{bank}</option>
                                    ))}
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-[10px] font-bold text-[#3c4a42]/70 mb-1">
                                    Số tài khoản *
                                  </label>
                                  <input
                                    type="text"
                                    value={bankAccountNumber}
                                    onChange={(e) => setBankAccountNumber(e.target.value)}
                                    className="w-full rounded-xl border-none bg-[#f4f6fa] px-3.5 py-2.5 text-xs text-[#3c4a42] outline-none focus:ring-2 focus:ring-[#006c49]"
                                    required
                                  />
                                </div>
                                <div>
                                  <label className="block text-[10px] font-bold text-[#3c4a42]/70 mb-1">
                                    Tên chủ tài khoản *
                                  </label>
                                  <input
                                    type="text"
                                    value={bankAccountName}
                                    onChange={(e) => setBankAccountName(e.target.value.toUpperCase())}
                                    className="w-full rounded-xl border-none bg-[#f4f6fa] px-3.5 py-2.5 text-xs text-[#3c4a42] outline-none focus:ring-2 focus:ring-[#006c49]"
                                    required
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Submit and Cancel Buttons */}
                            <div className="flex justify-end gap-2 pt-3 border-t border-[#bbcabf]/15">
                              <button
                                type="button"
                                onClick={() => setIsEditShopOpen(false)}
                                className="rounded-full border border-[#bbcabf] px-5 py-2 text-xs font-bold text-[#3c4a42] transition hover:bg-[#f4f6fa] cursor-pointer"
                              >
                                Hủy bỏ
                              </button>
                              <button
                                type="submit"
                                disabled={isSubmittingSeller}
                                className={`rounded-full bg-[#006c49] px-6 py-2 text-xs font-bold text-white transition hover:opacity-90 shadow-sm cursor-pointer flex items-center gap-1.5 ${
                                  isSubmittingSeller ? "opacity-75 cursor-not-allowed" : ""
                                }`}
                              >
                                {isSubmittingSeller ? (
                                  <>
                                    <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Đang lưu...
                                  </>
                                ) : (
                                  "Lưu thay đổi"
                                )}
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>

    {/* ── Cover Image Cropper (profile edit shop modal) ───────────────── */}
    {shopCropSrc && (
      <CoverImageCropper
        src={shopCropSrc}
        onConfirm={(cropped) => {
          setShopCoverImage(cropped);
          setShopCoverUrl(cropped);
          setShopCropSrc(null);
        }}
        onCancel={() => setShopCropSrc(null)}
      />
    )}
    </>
  );
}

export default function ProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#f9f9ff]">
          <div className="text-[#3c4a42] font-semibold">Đang tải trang cá nhân...</div>
        </div>
      }
    >
      <ProfileContent />
    </Suspense>
  );
}
