"use client";

import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Breadcrumb from "@/components/layout/Breadcrumb";
import { formatCurrency } from "@/lib/format";
import { useAuthStore } from "@/store/auth-store";
import { useCartStore } from "@/store/cart-store";
import { useOrderStore } from "@/store/order-store";
import { useNotificationStore } from "@/store/notification-store";
import { Order } from "@/types/order";
import { incrementVoucherUsage } from "@/lib/vouchers";

const PROVINCES_API = "https://provinces.open-api.vn/api/v1/?depth=2";

interface DistrictApiItem {
  code: number;
  name: string;
}

interface ProvinceApiItem {
  code: number;
  codename?: string;
  name: string;
  districts: DistrictApiItem[];
}

interface FormErrors {
  fullName?: string;
  phone?: string;
  email?: string;
  address?: string;
  province?: string;
  district?: string;
}

const fallbackProvinces: ProvinceApiItem[] = [
  {
    code: 79,
    codename: "thanh_pho_ho_chi_minh",
    name: "Thành phố Hồ Chí Minh",
    districts: [
      { code: 760, name: "Quận 1" },
      { code: 765, name: "Quận Bình Thạnh" },
      { code: 769, name: "Thành phố Thủ Đức" },
    ],
  },
  {
    code: 1,
    codename: "thanh_pho_ha_noi",
    name: "Thành phố Hà Nội",
    districts: [
      { code: 1, name: "Quận Ba Đình" },
      { code: 2, name: "Quận Hoàn Kiếm" },
      { code: 3, name: "Quận Tây Hồ" },
    ],
  },
  {
    code: 48,
    codename: "thanh_pho_da_nang",
    name: "Thành phố Đà Nẵng",
    districts: [
      { code: 490, name: "Quận Liên Chiểu" },
      { code: 491, name: "Quận Thanh Khê" },
      { code: 492, name: "Quận Hải Châu" },
    ],
  },
];

const getUnit = (name: string) => {
  if (name.includes("Rau") || name.includes("Xà lách") || name.includes("Húng")) return "bó";
  if (
    name.includes("Gạo") ||
    name.includes("Khoai") ||
    name.includes("Cà chua") ||
    name.includes("Cam") ||
    name.includes("Bưởi") ||
    name.includes("Dưa") ||
    name.includes("Cà rốt")
  ) {
    return "kg";
  }
  if (name.includes("Chuối")) return "nải";
  return "hộp";
};

const createOrderIdBase = () => `NS-${Date.now()}`;

export default function CheckoutPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { currentUser } = useAuthStore();
  const { items, getSelectedItems, getSelectedTotalItems, getSelectedTotalPrice, removePurchasedItems } = useCartStore();
  const selectedItems = getSelectedItems();
  const addOrder = useOrderStore((state) => state.addOrder);
  const addNotification = useNotificationStore((state) => state.addNotification);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [shippingMethod, setShippingMethod] = useState<"standard" | "fast" | "pickup">("standard");
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "bank" | "credit" | "wallet" | "vnpay">("cod");
  const [errors, setErrors] = useState<FormErrors>({});

  // Voucher states
  const [appliedVoucher, setAppliedVoucher] = useState<{ code: string; discount: number; sellerId: string } | null>(null);
  const [promoCodeInput, setPromoCodeInput] = useState("");
  const [promoError, setPromoError] = useState("");
  const [promoSuccess, setPromoSuccess] = useState("");

  const [showAddressForm, setShowAddressForm] = useState(true);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "error") => {
    setToast({ message, type });
  };

  useEffect(() => {
    if (toast) {
      const timer = window.setTimeout(() => setToast(null), 3000);
      return () => window.clearTimeout(timer);
    }
  }, [toast]);

  const [provinces, setProvinces] = useState<ProvinceApiItem[]>([]);
  const [provinceCode, setProvinceCode] = useState<number | "">("");
  const [districtCode, setDistrictCode] = useState<number | "">("");
  const [isLoadingProvinces, setIsLoadingProvinces] = useState(true);

  const selectedProvince = provinces.find((province) => province.code === Number(provinceCode));
  const districtOptions = selectedProvince?.districts ?? [];
  const selectedDistrict = districtOptions.find((district) => district.code === Number(districtCode));

  const activeSavedAddress = currentUser?.addresses?.find(
    (addr) =>
      addr.streetAddress === address &&
      addr.provinceCode === provinceCode &&
      addr.districtCode === districtCode
  );

  useEffect(() => {
    const timer = window.setTimeout(() => setMounted(true), 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (mounted && !currentUser) {
      router.push("/login?redirect=/checkout");
    }
  }, [mounted, currentUser, router]);

  // Read applied voucher from sessionStorage
  useEffect(() => {
    if (!mounted) return;
    const code = sessionStorage.getItem("appliedVoucherCode");
    const discountStr = sessionStorage.getItem("appliedVoucherDiscount");
    const sellerId = sessionStorage.getItem("appliedVoucherSellerId");
    if (code && discountStr && sellerId) {
      const hasSellerItems = selectedItems.some((item) => (item.sellerId || "admin") === sellerId);
      if (hasSellerItems) {
        const timer = window.setTimeout(() => {
          setAppliedVoucher({
            code,
            discount: Number(discountStr),
            sellerId,
          });
          setPromoCodeInput(code);
          setPromoSuccess(`Đang áp dụng mã: ${code}`);
        }, 0);
        return () => window.clearTimeout(timer);
      } else {
        sessionStorage.removeItem("appliedVoucherCode");
        sessionStorage.removeItem("appliedVoucherDiscount");
        sessionStorage.removeItem("appliedVoucherSellerId");
      }
    }
  }, [mounted, selectedItems]);

  const handleApplyPromoCheckout = async () => {
    setPromoError("");
    setPromoSuccess("");
    const trimmedCode = promoCodeInput.trim().toUpperCase();
    if (!trimmedCode) {
      const wasApplied = sessionStorage.getItem("appliedVoucherCode");
      setAppliedVoucher(null);
      sessionStorage.removeItem("appliedVoucherCode");
      sessionStorage.removeItem("appliedVoucherDiscount");
      sessionStorage.removeItem("appliedVoucherSellerId");
      if (wasApplied) {
        setPromoSuccess("Đã hủy áp dụng mã giảm giá");
      } else {
        setPromoError("Vui lòng nhập mã giảm giá");
      }
      return;
    }

    try {
      const response = await fetch("/api/vouchers/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: trimmedCode,
          items: selectedItems,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setPromoError(data.error || "Mã giảm giá không hợp lệ");
        setAppliedVoucher(null);
        sessionStorage.removeItem("appliedVoucherCode");
        sessionStorage.removeItem("appliedVoucherDiscount");
        sessionStorage.removeItem("appliedVoucherSellerId");
      } else {
        setAppliedVoucher({
          code: trimmedCode,
          discount: data.discount,
          sellerId: data.sellerId,
        });
        setPromoSuccess(data.message || "Áp dụng mã giảm giá thành công!");
        sessionStorage.setItem("appliedVoucherCode", trimmedCode);
        sessionStorage.setItem("appliedVoucherDiscount", data.discount.toString());
        sessionStorage.setItem("appliedVoucherSellerId", data.sellerId);
      }
    } catch (error) {
      console.error("Lỗi khi áp dụng voucher tại checkout:", error);
      setPromoError("Đã xảy ra lỗi khi kết nối với máy chủ");
      setAppliedVoucher(null);
    }
  };

  const handleClearPromoCheckout = () => {
    setPromoCodeInput("");
    setAppliedVoucher(null);
    setPromoError("");
    setPromoSuccess("Đã hủy áp dụng mã giảm giá");
    sessionStorage.removeItem("appliedVoucherCode");
    sessionStorage.removeItem("appliedVoucherDiscount");
    sessionStorage.removeItem("appliedVoucherSellerId");
  };

  useEffect(() => {
    if (!currentUser) return;
    const timer = window.setTimeout(() => {
      setFullName((prev) => prev || currentUser.name || "");
      setEmail((prev) => prev || currentUser.email || "");
      setPhone((prev) => prev || currentUser.phone || "");

      if (currentUser.addresses && currentUser.addresses.length > 0) {
        const defaultAddr = currentUser.addresses.find((a) => a.isDefault) ?? currentUser.addresses[0];
        setFullName(defaultAddr.fullName || currentUser.name || "");
        setPhone(defaultAddr.phone || currentUser.phone || "");
        setAddress(defaultAddr.streetAddress || "");
        setProvinceCode(defaultAddr.provinceCode);
        setDistrictCode(defaultAddr.districtCode);
        setShowAddressForm(false);
      } else {
        setShowAddressForm(true);
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, [currentUser]);

  useEffect(() => {
    let isActive = true;

    async function loadProvinces() {
      try {
        setIsLoadingProvinces(true);
        const response = await fetch(PROVINCES_API);
        if (!response.ok) throw new Error("Cannot load provinces");

        const data = (await response.json()) as ProvinceApiItem[];
        if (!isActive) return;

        const usableData = data.length > 0 ? data : fallbackProvinces;
        setProvinces(usableData);

        setProvinceCode((prev) => {
          if (prev !== "") return prev;
          const defaultProvince =
            usableData.find((province) => province.codename === "thanh_pho_ho_chi_minh") ??
            usableData[0];
          return defaultProvince?.code ?? "";
        });

        setDistrictCode((prev) => {
          if (prev !== "") return prev;
          const defaultProvince =
            usableData.find((province) => province.codename === "thanh_pho_ho_chi_minh") ??
            usableData[0];
          return defaultProvince?.districts?.[0]?.code ?? "";
        });
      } catch {
        if (!isActive) return;

        setProvinces(fallbackProvinces);
        setProvinceCode((prev) => (prev !== "" ? prev : fallbackProvinces[0].code));
        setDistrictCode((prev) => (prev !== "" ? prev : fallbackProvinces[0].districts[0]?.code ?? ""));
        showToast("Không tải được API tỉnh/thành, đang dùng dữ liệu dự phòng.", "error");
      } finally {
        if (isActive) setIsLoadingProvinces(false);
      }
    }

    loadProvinces();

    return () => {
      isActive = false;
    };
  }, []);

  const shippingFee = shippingMethod === "fast" ? 15000 : 0;
  const subtotal = getSelectedTotalPrice();
  const discountAmount = appliedVoucher && selectedItems.some(item => (item.sellerId || "admin") === appliedVoucher.sellerId) ? appliedVoucher.discount : 0;
  const total = Math.max(0, subtotal + shippingFee - discountAmount);
  const totalItems = getSelectedTotalItems();

  const updateError = (field: keyof FormErrors) => {
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleProvinceChange = (value: string) => {
    const nextCode = Number(value);
    const nextProvince = provinces.find((province) => province.code === nextCode);

    setProvinceCode(nextCode);
    setDistrictCode(nextProvince?.districts?.[0]?.code ?? "");
    updateError("province");
    updateError("district");
  };

  const validate = () => {
    const nextErrors: FormErrors = {};
    const normalizedPhone = phone.trim().replace(/\s+/g, "");

    if (!fullName.trim()) {
      nextErrors.fullName = "Vui lòng nhập họ và tên";
    } else if (fullName.trim().length < 2) {
      nextErrors.fullName = "Họ và tên cần có ít nhất 2 ký tự";
    }

    if (!normalizedPhone) {
      nextErrors.phone = "Vui lòng nhập số điện thoại";
    } else if (!/^0\d{9}$/.test(normalizedPhone)) {
      nextErrors.phone = "Số điện thoại cần gồm 10 chữ số và bắt đầu bằng 0";
    }

    if (!email.trim()) {
      nextErrors.email = "Vui lòng nhập email";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      nextErrors.email = "Email không hợp lệ";
    }

    if (!address.trim()) {
      nextErrors.address = "Vui lòng nhập địa chỉ cụ thể";
    } else if (address.trim().length < 5) {
      nextErrors.address = "Địa chỉ cụ thể cần có ít nhất 5 ký tự";
    }

    if (!selectedProvince) nextErrors.province = "Vui lòng chọn tỉnh/thành phố";
    if (!selectedDistrict) nextErrors.district = "Vui lòng chọn quận/huyện";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      const firstErrorKey = Object.keys(nextErrors)[0] as keyof FormErrors;
      const firstErrorMessage = nextErrors[firstErrorKey];
      if (firstErrorMessage) {
        showToast(firstErrorMessage, "error");
      }
      return false;
    }
    return true;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return;

    const orderIdBase = createOrderIdBase();
    const districtName = selectedDistrict?.name ?? activeSavedAddress?.districtName ?? "";
    const provinceName = selectedProvince?.name ?? activeSavedAddress?.provinceName ?? "";
    const fullAddress = `${address.trim()}${districtName ? `, ${districtName}` : ""}${provinceName ? `, ${provinceName}` : ""}`;

    if (selectedItems.length === 0) {
      showToast("Vui lòng chọn sản phẩm cần mua trong giỏ hàng.", "error");
      router.push("/cart");
      return;
    }

    if (["vnpay", "credit", "wallet"].includes(paymentMethod)) {
      try {
        const response = await fetch("/api/vnpay/create-payment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: currentUser?.id || "guest",
            fullName: fullName.trim(),
            phone: phone.trim(),
            email: email.trim(),
            address: fullAddress,
            note: note.trim(),
            items: selectedItems,
            totalAmount: total,
            appliedVoucher: appliedVoucher ? {
              code: appliedVoucher.code,
              discount: discountAmount,
              sellerId: appliedVoucher.sellerId,
            } : undefined,
          }),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Không thể khởi tạo thanh toán VNPay");
        }

        if (data.paymentUrl) {
          // Clear sessionStorage upon successful redirection to payment gateway
          sessionStorage.removeItem("appliedVoucherCode");
          sessionStorage.removeItem("appliedVoucherDiscount");
          sessionStorage.removeItem("appliedVoucherSellerId");
          window.location.href = data.paymentUrl;
          return;
        } else {
          throw new Error("Không nhận được liên kết thanh toán từ máy chủ");
        }
      } catch (err: unknown) {
        console.error("Lỗi VNPay checkout:", err);
        const errMsg = err instanceof Error ? err.message : "Đã xảy ra lỗi khi kết nối với cổng thanh toán VNPay.";
        showToast(errMsg, "error");
        return;
      }
    }

    // Group selected items by sellerId
    const itemsBySeller = selectedItems.reduce((acc, item) => {
      const sellerId = item.sellerId || "admin";
      if (!acc[sellerId]) acc[sellerId] = [];
      acc[sellerId].push(item);
      return acc;
    }, {} as Record<string, typeof items>);

    // Create an order for each seller
    const sellerIds = Object.keys(itemsBySeller);
    for (const [index, sellerId] of sellerIds.entries()) {
      const sellerItems = itemsBySeller[sellerId];
      const sellerTotal = sellerItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const subOrderId = sellerIds.length > 1 ? `${orderIdBase}-${index + 1}` : orderIdBase;

      // Check if this seller gets the voucher discount
      const isSellerVoucher = appliedVoucher && (sellerId === appliedVoucher.sellerId);
      const finalSellerTotal = isSellerVoucher ? Math.max(0, sellerTotal - discountAmount) : sellerTotal;

      const newOrder: Order = {
        id: subOrderId,
        userId: currentUser?.id || "guest",
        sellerId,
        shopName: sellerItems[0]?.shopName || "NôngSạch Store",
        fullName: fullName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        address: fullAddress,
        note: note.trim(),
        items: sellerItems,
        totalAmount: finalSellerTotal,
        status: "pending",
        paymentMethod,
        createdAt: new Date().toISOString(),
        ...(isSellerVoucher ? {
          voucherCode: appliedVoucher.code,
          discountAmount: discountAmount,
        } : {}),
      };

      await addOrder(newOrder);

      // Decrement the voucher limit in Firestore if it was used
      if (isSellerVoucher) {
        try {
          await incrementVoucherUsage(appliedVoucher.code);
        } catch (error) {
          console.error("Lỗi khi cập nhật lượt sử dụng voucher:", error);
        }
      }

      // Notify Seller
      await addNotification({
        userId: sellerId,
        title: "Đơn hàng mới!",
        message: `Bạn nhận được đơn hàng mới #${subOrderId} từ ${fullName.trim()}.`,
        type: "new_order",
        orderId: subOrderId,
      });
    }

    // Clear sessionStorage since the order has been successfully placed
    sessionStorage.removeItem("appliedVoucherCode");
    sessionStorage.removeItem("appliedVoucherDiscount");
    sessionStorage.removeItem("appliedVoucherSellerId");

    // Notify Buyer
    if (currentUser) {
      await addNotification({
        userId: currentUser.id,
        title: "Đặt hàng thành công",
        message: `Đơn hàng ${orderIdBase} của bạn đã được tiếp nhận và đang chờ xác nhận.`,
        type: "order_update",
        orderId: orderIdBase,
      });
    }

    removePurchasedItems(selectedItems.map((item) => item.productId));

    const queryParams = new URLSearchParams({
      orderId: orderIdBase,
      name: fullName.trim(),
      phone: phone.trim(),
      address: fullAddress,
      total: total.toString(),
      paymentMethod,
    });

    router.push(`/checkout/success?${queryParams.toString()}`);
  };

  if (!mounted) {
    return (
      <main className="page-surface flex min-h-[420px] items-center justify-center px-6">
        <p className="font-medium text-on-surface-variant">Đang tải...</p>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="page-surface py-8">
        <div className="site-container">
          <Breadcrumb
            className="mb-6"
            items={[
              { label: "Trang chủ", href: "/" },
              { label: "Giỏ hàng", href: "/cart" },
              { label: "Thanh toán" },
            ]}
          />
          <section className="page-card lift-hover mx-auto mt-8 max-w-[420px] rounded-3xl p-8 text-center">
            <span className="material-symbols-outlined mb-4 text-[60px] text-primary">shopping_cart</span>
            <h1 className="mb-2 text-2xl font-bold text-on-surface">Giỏ hàng đang trống</h1>
            <p className="mb-6 text-sm leading-6 text-on-surface-variant">
              Vui lòng thêm sản phẩm vào giỏ hàng trước khi tiến hành thanh toán.
            </p>
            <Link
              href="/products"
              className="inline-flex rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:opacity-90"
            >
              Quay lại cửa hàng
            </Link>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="page-surface py-6">
      <div className="site-container page-enter">
        <Breadcrumb
          className="mb-5"
          items={[
            { label: "Trang chủ", href: "/" },
            { label: "Giỏ hàng", href: "/cart" },
            { label: "Thanh toán" },
          ]}
        />

        <div className="mb-6 flex justify-center">
          <div className="grid w-full max-w-[520px] grid-cols-[1fr_48px_1fr_48px_1fr] items-start gap-2">
            <StepItem active index={1} label="Thông tin" />
            <span className="mt-[18px] h-px bg-outline-variant/60" />
            <StepItem index={2} label="Thanh toán" />
            <span className="mt-[18px] h-px bg-outline-variant/60" />
            <StepItem index={3} label="Xác nhận" />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-5">
            <section className="page-card rounded-3xl p-5 sm:p-6">
              <div className="mb-5 flex items-center justify-between flex-wrap gap-2">
                <h1 className="flex items-center gap-2 text-xl font-bold text-on-surface">
                  <span className="material-symbols-outlined text-primary">local_shipping</span>
                  Thông tin giao hàng
                </h1>
                
                {/* Address actions */}
                <div className="flex gap-2 text-xs">
                  {currentUser?.addresses && currentUser.addresses.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setIsAddressModalOpen(true)}
                      className="text-primary font-bold hover:underline"
                    >
                      Chọn địa chỉ khác
                    </button>
                  )}
                  {currentUser?.addresses && currentUser.addresses.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setFullName("");
                        setPhone("");
                        setAddress("");
                        setShowAddressForm(true);
                      }}
                      className={`text-[#3c4a42]/70 font-semibold hover:underline ${
                        currentUser.addresses.length > 1 ? "border-l border-outline-variant/60 pl-2" : ""
                      }`}
                    >
                      Nhập địa chỉ mới
                    </button>
                  )}
                </div>
              </div>

              {!showAddressForm ? (
                /* Compact saved address card */
                <div className="space-y-4">
                  <div className="rounded-2xl border border-primary/20 bg-emerald-50/10 p-4 space-y-2.5 shadow-sm">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-bold text-on-surface flex items-center gap-2">
                          {fullName}
                          <span className="text-xs font-normal text-on-surface-variant">|</span>
                          <span className="text-xs font-semibold text-on-surface-variant">{phone}</span>
                        </p>
                        <p className="text-xs text-on-surface-variant mt-0.5">{email}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowAddressForm(true)}
                        className="text-xs text-primary font-bold flex items-center gap-1 hover:underline"
                      >
                        <span className="material-symbols-outlined text-sm">edit</span>
                        Sửa
                      </button>
                    </div>
                    <div className="border-t border-outline-variant/30 pt-2.5 text-xs text-on-surface-variant leading-5">
                      <p><strong>Địa chỉ nhận hàng:</strong> {address}, {selectedDistrict?.name}, {selectedProvince?.name}</p>
                    </div>
                  </div>

                  <Field label="Ghi chú đơn hàng">
                    <textarea
                      id="note"
                      rows={2}
                      value={note}
                      onChange={(event) => setNote(event.target.value)}
                      placeholder="Lưu ý cho người giao hàng..."
                      className={inputClass()}
                    />
                  </Field>
                </div>
              ) : (
                /* Full form inputs */
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Họ và tên">
                    <input
                      id="fullName"
                      type="text"
                      value={fullName}
                      onChange={(event) => {
                        setFullName(event.target.value);
                        updateError("fullName");
                      }}
                      placeholder="Nguyễn Văn A"
                      className={inputClass(errors.fullName)}
                    />
                  </Field>

                  <Field label="Số điện thoại">
                    <input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(event) => {
                        setPhone(event.target.value);
                        updateError("phone");
                      }}
                      placeholder="0901 234 567"
                      className={inputClass(errors.phone)}
                    />
                  </Field>

                  <Field label="Email" className="sm:col-span-2">
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(event) => {
                        setEmail(event.target.value);
                        updateError("email");
                      }}
                      placeholder="email@example.com"
                      className={inputClass(errors.email)}
                    />
                  </Field>

                  <Field label="Tỉnh / Thành phố">
                    <div className="relative">
                      <select
                        id="province"
                        value={provinceCode}
                        onChange={(event) => handleProvinceChange(event.target.value)}
                        disabled={isLoadingProvinces}
                        className={`${inputClass(errors.province)} appearance-none pr-10 disabled:cursor-not-allowed disabled:opacity-70`}
                      >
                        {provinces.map((province) => (
                          <option key={province.code} value={province.code}>
                            {province.name}
                          </option>
                        ))}
                      </select>
                      <span className="material-symbols-outlined pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
                        expand_more
                      </span>
                    </div>
                  </Field>

                  <Field label="Quận / Huyện">
                    <div className="relative">
                      <select
                        id="district"
                        value={districtCode}
                        onChange={(event) => {
                          setDistrictCode(Number(event.target.value));
                          updateError("district");
                        }}
                        disabled={isLoadingProvinces || districtOptions.length === 0}
                        className={`${inputClass(errors.district)} appearance-none pr-10 disabled:cursor-not-allowed disabled:opacity-70`}
                      >
                        {districtOptions.map((district) => (
                          <option key={district.code} value={district.code}>
                            {district.name}
                          </option>
                        ))}
                      </select>
                      <span className="material-symbols-outlined pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
                        expand_more
                      </span>
                    </div>
                  </Field>

                  <Field label="Địa chỉ cụ thể" className="sm:col-span-2">
                    <input
                      id="address"
                      type="text"
                      value={address}
                      onChange={(event) => {
                        setAddress(event.target.value);
                        updateError("address");
                      }}
                      placeholder="Số nhà, tên đường..."
                      className={inputClass(errors.address)}
                    />
                  </Field>

                  <Field label="Ghi chú đơn hàng" className="sm:col-span-2">
                    <textarea
                      id="note"
                      rows={2}
                      value={note}
                      onChange={(event) => setNote(event.target.value)}
                      placeholder="Lưu ý cho người giao hàng..."
                      className={inputClass()}
                    />
                  </Field>

                  {currentUser?.addresses && currentUser.addresses.length > 0 && (
                    <div className="sm:col-span-2 flex justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          const defaultAddr = currentUser.addresses?.find((a) => a.isDefault) ?? currentUser.addresses?.[0];
                          if (defaultAddr) {
                            setFullName(currentUser.name || "");
                            setPhone(currentUser.phone || "");
                            setAddress(defaultAddr.streetAddress);
                            setProvinceCode(defaultAddr.provinceCode);
                            setDistrictCode(defaultAddr.districtCode);
                          }
                          setShowAddressForm(false);
                        }}
                        className="text-xs text-primary font-bold hover:underline"
                      >
                        Quay lại địa chỉ đã lưu
                      </button>
                    </div>
                  )}
                </div>
              )}
              {/* Shipping & Payment Options */}
              <div className="mt-5 pt-5 border-t border-outline-variant/30 grid gap-4 sm:grid-cols-2">
                <Field label="Phương thức giao hàng">
                  <div className="relative">
                    <select
                      value={shippingMethod}
                      onChange={(e) => setShippingMethod(e.target.value as "standard" | "fast" | "pickup")}
                      className={`${inputClass()} appearance-none pr-10`}
                    >
                      <option value="standard">Tiêu chuẩn (2-4h) — Miễn phí</option>
                      <option value="fast">Giao hỏa tốc (1-2h) — 15.000 đ</option>
                      <option value="pickup">Nhận tại cửa hàng — Miễn phí</option>
                    </select>
                    <span className="material-symbols-outlined pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
                      expand_more
                    </span>
                  </div>
                </Field>

                <Field label="Phương thức thanh toán">
                  <div className="relative">
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value as "cod" | "bank" | "credit" | "wallet" | "vnpay")}
                      className={`${inputClass()} appearance-none pr-10`}
                    >
                      <option value="cod">Thanh toán khi nhận hàng (COD)</option>
                      <option value="bank">Chuyển khoản ngân hàng</option>
                      <option value="vnpay">Thanh toán online qua VNPay (Sandbox)</option>
                      <option value="credit">Thẻ Visa / Mastercard</option>
                      <option value="wallet">Ví điện tử</option>
                    </select>
                    <span className="material-symbols-outlined pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
                      expand_more
                    </span>
                  </div>
                </Field>
              </div>

              {paymentMethod === "bank" && (
                <div className="mt-4 rounded-2xl border border-primary/15 bg-emerald-50/70 p-4 text-sm max-w-[600px] animate-in fade-in slide-in-from-top-1 duration-200">
                  <p className="mb-3 text-on-surface-variant">
                    Vui lòng chuyển khoản với nội dung: <strong>[Họ tên] [Số điện thoại]</strong>
                  </p>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <BankInfo label="Ngân hàng" value="Vietcombank" />
                    <BankInfo label="Số tài khoản" value="1234567890" strong />
                    <BankInfo label="Chủ tài khoản" value="NONGSACH JSC" />
                  </div>
                </div>
              )}
            </section>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-4 text-base font-bold text-white shadow-md transition hover:opacity-90 active:scale-[0.99]"
            >
              Đặt hàng ngay
              <span className="material-symbols-outlined">shopping_cart</span>
            </button>
          </div>

          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <section className="page-card rounded-3xl p-5">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-on-surface">Tóm tắt đơn hàng</h2>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-primary">
                  {totalItems} món
                </span>
              </div>

              <div className="mb-5 space-y-4">
                {selectedItems.map((item) => (
                  <div key={item.productId} className="flex items-center gap-3">
                    <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl bg-surface">
                      <Image src={item.image} alt={item.name} fill className="object-cover" sizes="56px" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-sm font-bold text-on-surface">{item.name}</h3>
                      <p className="text-xs text-on-surface-variant">
                        {item.quantity} {getUnit(item.name)}
                      </p>
                    </div>
                    <p className="text-sm font-bold text-on-surface">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-3 border-t border-outline-variant/30 pt-4 text-sm">
                <SummaryRow label="Tạm tính" value={formatCurrency(subtotal)} />
                {discountAmount > 0 && (
                  <SummaryRow
                    label={`Giảm giá (${appliedVoucher?.code})`}
                    value={`-${formatCurrency(discountAmount)}`}
                    highlight={false}
                  />
                )}
                <SummaryRow
                  label="Phí vận chuyển"
                  value={shippingFee > 0 ? formatCurrency(shippingFee) : "Miễn phí"}
                  highlight={shippingFee === 0}
                />
                <div className="flex items-end justify-between border-t border-outline-variant/30 pt-4">
                  <span className="text-base font-bold text-on-surface">Tổng cộng</span>
                  <span className="text-2xl font-bold text-primary">{formatCurrency(total)}</span>
                </div>
              </div>
            </section>

            <section className="page-card rounded-3xl p-4">
              <label htmlFor="promo" className="mb-2 block text-sm font-semibold text-on-surface-variant">
                Mã giảm giá / Quà tặng
              </label>
              <div className="flex gap-2">
                <input
                  id="promo"
                  type="text"
                  placeholder="Nhập mã..."
                  value={promoCodeInput}
                  onChange={(e) => {
                    setPromoCodeInput(e.target.value);
                    if (promoError) setPromoError("");
                    if (promoSuccess) setPromoSuccess("");
                  }}
                  className="min-w-0 flex-1 rounded-xl border border-outline-variant bg-surface px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
                />
                {appliedVoucher ? (
                  <button
                    type="button"
                    onClick={handleClearPromoCheckout}
                    className="rounded-xl bg-error px-4 py-2.5 text-sm font-bold text-white transition hover:opacity-90 cursor-pointer"
                  >
                    Hủy
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleApplyPromoCheckout}
                    className="rounded-xl bg-secondary px-4 py-2.5 text-sm font-bold text-white transition hover:opacity-90 cursor-pointer"
                  >
                    Áp dụng
                  </button>
                )}
              </div>
              {promoError && (
                <p className="text-xs text-error font-semibold mt-1.5 pl-1">{promoError}</p>
              )}
              {promoSuccess && (
                <p className="text-xs text-primary font-semibold mt-1.5 pl-1">{promoSuccess}</p>
              )}
            </section>

            <div className="flex items-center justify-center gap-2 rounded-2xl bg-surface-container-low px-4 py-3 text-sm text-on-surface-variant">
              <span className="material-symbols-outlined text-base">lock</span>
              Thông tin của bạn được bảo mật tuyệt đối
            </div>
          </aside>
        </form>
      </div>

      {/* Address Selector Modal */}
      {isAddressModalOpen && currentUser?.addresses && (
        <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/45 backdrop-blur-sm transition-opacity"
            onClick={() => setIsAddressModalOpen(false)}
          />
          {/* Modal Content */}
          <div className="relative w-full max-w-[512px] transform rounded-3xl bg-white p-6 shadow-2xl transition-all border border-outline-variant/30 max-h-[85vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-outline-variant/30 pb-4 mb-4">
              <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">local_shipping</span>
                Chọn địa chỉ nhận hàng
              </h2>
              <button
                type="button"
                onClick={() => setIsAddressModalOpen(false)}
                className="rounded-full p-1.5 text-on-surface-variant hover:bg-surface-container-high transition flex items-center justify-center"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* List of addresses */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 py-1">
              {currentUser.addresses.map((addr) => {
                const isSelected =
                  address === addr.streetAddress &&
                  provinceCode === addr.provinceCode &&
                  districtCode === addr.districtCode;
                return (
                  <div
                    key={addr.id}
                    onClick={() => {
                      setFullName(addr.fullName || currentUser.name || "");
                      setPhone(addr.phone || currentUser.phone || "");
                      setAddress(addr.streetAddress);
                      setProvinceCode(addr.provinceCode);
                      setDistrictCode(addr.districtCode);
                      setShowAddressForm(false);
                      setIsAddressModalOpen(false);
                    }}
                    className={`group relative cursor-pointer rounded-2xl border p-4 transition text-left ${
                      isSelected
                        ? "border-primary bg-emerald-50/20 shadow-sm"
                        : "border-outline-variant/60 bg-white hover:border-primary/50 hover:bg-surface-container-lowest"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-bold text-on-surface">{addr.fullName}</p>
                          <span className="text-xs text-on-surface-variant">|</span>
                          <p className="text-xs font-semibold text-on-surface-variant">{addr.phone}</p>
                          {addr.isDefault && (
                            <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold text-primary">
                              Mặc định
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-on-surface-variant leading-relaxed">
                          {addr.streetAddress}, {addr.districtName}, {addr.provinceName}
                        </p>
                      </div>
                      <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border border-outline-variant/80 group-hover:border-primary transition group-hover:scale-105">
                        {isSelected && (
                          <div className="h-3 w-3 rounded-full bg-primary" />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer / Actions */}
            <div className="border-t border-outline-variant/30 pt-4 mt-4 flex justify-between items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setFullName("");
                  setPhone("");
                  setAddress("");
                  setShowAddressForm(true);
                  setIsAddressModalOpen(false);
                }}
                className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">add</span>
                Thêm địa chỉ mới
              </button>
              <button
                type="button"
                onClick={() => setIsAddressModalOpen(false)}
                className="rounded-xl bg-surface-container-high px-4 py-2 text-xs font-bold text-on-surface hover:bg-surface-container-highest transition"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-[9999] flex max-w-[384px] animate-slide-in items-center gap-3 rounded-2xl border p-4 shadow-xl backdrop-blur-md transition-all duration-300 bg-white/95 ${
            toast.type === "success"
              ? "border-primary/20 text-on-surface"
              : "border-error/20 text-on-surface"
          }`}
        >
          <div
            className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${
              toast.type === "success" ? "bg-primary/15 text-primary" : "bg-error/15 text-error"
            }`}
          >
            <span className="material-symbols-outlined text-xl">
              {toast.type === "success" ? "check_circle" : "error"}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold leading-5 text-on-surface">{toast.message}</p>
          </div>
          <button
            type="button"
            onClick={() => setToast(null)}
            className="rounded-lg p-1 text-on-surface-variant hover:bg-surface-container transition flex-shrink-0"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      )}
    </main>
  );
}

function inputClass(error?: string) {
  return `w-full rounded-2xl border bg-surface px-4 py-3 text-sm outline-none transition focus:ring-4 ${
    error
      ? "border-error focus:border-error focus:ring-error/10"
      : "border-outline-variant focus:border-primary focus:ring-primary/10"
  }`;
}

function Field({
  children,
  className = "",
  error,
  label,
}: {
  children: ReactNode;
  className?: string;
  error?: string;
  label: string;
}) {
  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-semibold text-on-surface-variant">{label}</label>
      {children}
      {error && <p className="text-xs font-medium text-error">{error}</p>}
    </div>
  );
}

function StepItem({ active, index, label }: { active?: boolean; index: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <span
        className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${
          active ? "bg-primary text-white" : "bg-surface-container-highest text-on-surface-variant"
        }`}
      >
        {index}
      </span>
      <span className={`text-xs font-semibold ${active ? "text-primary" : "text-on-surface-variant"}`}>
        {label}
      </span>
    </div>
  );
}

function ChoiceCard({
  checked,
  description,
  highlight,
  name,
  onChange,
  price,
  title,
  value,
}: {
  checked: boolean;
  description: string;
  highlight?: boolean;
  name: string;
  onChange: () => void;
  price: string;
  title: string;
  value: string;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3 py-2 text-sm text-on-surface hover:text-primary transition-colors">
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="h-4.5 w-4.5 text-primary shrink-0"
      />
      <div className="flex-1 flex justify-between items-center gap-2">
        <div className="min-w-0">
          <span className="font-bold text-on-surface block sm:inline">{title}</span>
          <span className="text-xs text-on-surface-variant block sm:inline sm:ml-2">{description}</span>
        </div>
        <span className={`font-bold shrink-0 ${highlight ? "text-primary" : "text-on-surface"}`}>{price}</span>
      </div>
    </label>
  );
}

function PaymentCard({
  checked,
  label,
  onChange,
  value,
}: {
  checked: boolean;
  label: string;
  onChange: () => void;
  value: string;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3 py-2 text-sm text-on-surface hover:text-primary transition-colors">
      <input
        type="radio"
        name="payment"
        value={value}
        checked={checked}
        onChange={onChange}
        className="h-4.5 w-4.5 text-primary shrink-0"
      />
      <span className="font-bold">{label}</span>
    </label>
  );
}

function BankInfo({ label, strong, value }: { label: string; strong?: boolean; value: string }) {
  return (
    <div>
      <p className="text-on-surface-variant">{label}</p>
      <p className={`font-bold ${strong ? "text-primary" : "text-on-surface"}`}>{value}</p>
    </div>
  );
}

function SummaryRow({
  highlight,
  label,
  value,
}: {
  highlight?: boolean;
  label: string;
  value: string;
}) {
  return (
    <div className="flex justify-between text-on-surface-variant">
      <span>{label}</span>
      <span className={highlight ? "font-bold text-primary" : undefined}>{value}</span>
    </div>
  );
}
