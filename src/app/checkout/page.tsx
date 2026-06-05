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

export default function CheckoutPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { currentUser } = useAuthStore();
  const { items, clearCart, getTotalItems, getTotalPrice } = useCartStore();
  const addOrder = useOrderStore((state) => state.addOrder);
  const addNotification = useNotificationStore((state) => state.addNotification);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [shippingMethod, setShippingMethod] = useState<"standard" | "fast" | "pickup">("standard");
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "bank" | "credit" | "wallet">("cod");
  const [errors, setErrors] = useState<FormErrors>({});

  const [provinces, setProvinces] = useState<ProvinceApiItem[]>([]);
  const [provinceCode, setProvinceCode] = useState<number | "">("");
  const [districtCode, setDistrictCode] = useState<number | "">("");
  const [isLoadingProvinces, setIsLoadingProvinces] = useState(true);
  const [provinceMessage, setProvinceMessage] = useState("");

  const selectedProvince = provinces.find((province) => province.code === Number(provinceCode));
  const districtOptions = selectedProvince?.districts ?? [];
  const selectedDistrict = districtOptions.find((district) => district.code === Number(districtCode));

  useEffect(() => {
    const timer = window.setTimeout(() => setMounted(true), 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (mounted && !currentUser) {
      router.push("/login?redirect=/checkout");
    }
  }, [mounted, currentUser, router]);

  useEffect(() => {
    if (!currentUser) return;
    const timer = window.setTimeout(() => {
      setFullName((prev) => prev || currentUser.name || "");
      setEmail((prev) => prev || currentUser.email || "");
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
        const defaultProvince =
          usableData.find((province) => province.codename === "thanh_pho_ho_chi_minh") ??
          usableData[0];

        setProvinces(usableData);
        setProvinceCode(defaultProvince?.code ?? "");
        setDistrictCode(defaultProvince?.districts?.[0]?.code ?? "");
        setProvinceMessage("");
      } catch {
        if (!isActive) return;

        const defaultProvince = fallbackProvinces[0];
        setProvinces(fallbackProvinces);
        setProvinceCode(defaultProvince.code);
        setDistrictCode(defaultProvince.districts[0]?.code ?? "");
        setProvinceMessage("Không tải được API tỉnh/thành, đang dùng dữ liệu dự phòng.");
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
  const subtotal = getTotalPrice();
  const total = subtotal + shippingFee;
  const totalItems = getTotalItems();

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
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return;

    const timestamp = Date.now();
    const orderIdBase = `NS-${timestamp}`;
    const fullAddress = `${address.trim()}, ${selectedDistrict?.name ?? ""}, ${selectedProvince?.name ?? ""}`;

    // Group items by sellerId
    const itemsBySeller = items.reduce((acc, item) => {
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
        totalAmount: sellerTotal,
        status: "pending",
        paymentMethod,
        createdAt: new Date().toISOString(),
      };

      await addOrder(newOrder);

      // Notify Seller
      if (sellerId !== "admin") {
        addNotification({
          userId: sellerId,
          title: "Đơn hàng mới!",
          message: `Bạn nhận được đơn hàng mới #${subOrderId} từ ${fullName.trim()}.`,
          type: "new_order",
          orderId: subOrderId,
        });
      }
    }

    // Notify Buyer
    if (currentUser) {
      addNotification({
        userId: currentUser.id,
        title: "Đặt hàng thành công",
        message: `Đơn hàng ${orderIdBase} của bạn đã được tiếp nhận và đang chờ xác nhận.`,
        type: "order_update",
        orderId: orderIdBase,
      });
    }

    clearCart();

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
              <h1 className="mb-5 flex items-center gap-2 text-xl font-bold text-on-surface">
                <span className="material-symbols-outlined text-primary">local_shipping</span>
                Thông tin giao hàng
              </h1>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Họ và tên" error={errors.fullName}>
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

                <Field label="Số điện thoại" error={errors.phone}>
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

                <Field label="Email" error={errors.email} className="sm:col-span-2">
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

                <Field label="Tỉnh / Thành phố" error={errors.province}>
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

                <Field label="Quận / Huyện" error={errors.district}>
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

                <Field label="Địa chỉ cụ thể" error={errors.address} className="sm:col-span-2">
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
                    rows={3}
                    value={note}
                    onChange={(event) => setNote(event.target.value)}
                    placeholder="Lưu ý cho người giao hàng..."
                    className={inputClass()}
                  />
                </Field>
              </div>

              {provinceMessage && (
                <p className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700">
                  {provinceMessage}
                </p>
              )}
            </section>

            <section className="page-card rounded-3xl p-5 sm:p-6">
              <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-on-surface">
                <span className="material-symbols-outlined text-primary">package_2</span>
                Phương thức giao hàng
              </h2>
              <div className="space-y-3">
                <ChoiceCard
                  name="shipping"
                  value="standard"
                  checked={shippingMethod === "standard"}
                  onChange={() => setShippingMethod("standard")}
                  title="Tiêu chuẩn (2-4h)"
                  description="Dành cho các đơn hàng không gấp"
                  price="Miễn phí"
                  highlight
                />
                <ChoiceCard
                  name="shipping"
                  value="fast"
                  checked={shippingMethod === "fast"}
                  onChange={() => setShippingMethod("fast")}
                  title="Giao hỏa tốc (1-2h)"
                  description="Giao nhanh từ nông trại đến bếp của bạn"
                  price={formatCurrency(15000)}
                />
                <ChoiceCard
                  name="shipping"
                  value="pickup"
                  checked={shippingMethod === "pickup"}
                  onChange={() => setShippingMethod("pickup")}
                  title="Nhận tại cửa hàng"
                  description="Nhận tại cửa hàng gần nhất của NôngSạch"
                  price="Miễn phí"
                  highlight
                />
              </div>
            </section>

            <section className="page-card rounded-3xl p-5 sm:p-6">
              <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-on-surface">
                <span className="material-symbols-outlined text-primary">payments</span>
                Phương thức thanh toán
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                <PaymentCard
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                  label="Thanh toán khi nhận hàng"
                />
                <PaymentCard
                  value="bank"
                  checked={paymentMethod === "bank"}
                  onChange={() => setPaymentMethod("bank")}
                  label="Chuyển khoản ngân hàng"
                />
                <PaymentCard
                  value="credit"
                  checked={paymentMethod === "credit"}
                  onChange={() => setPaymentMethod("credit")}
                  label="Thẻ Visa / Mastercard"
                />
                <PaymentCard
                  value="wallet"
                  checked={paymentMethod === "wallet"}
                  onChange={() => setPaymentMethod("wallet")}
                  label="Ví điện tử"
                />
              </div>

              {paymentMethod === "bank" && (
                <div className="mt-4 rounded-2xl border border-primary/15 bg-emerald-50/70 p-4 text-sm">
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
                {items.map((item) => (
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
                  className="min-w-0 flex-1 rounded-xl border border-outline-variant bg-surface px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
                />
                <button
                  type="button"
                  className="rounded-xl bg-secondary px-4 py-2.5 text-sm font-bold text-white transition hover:opacity-90"
                >
                  Áp dụng
                </button>
              </div>
            </section>

            <div className="flex items-center justify-center gap-2 rounded-2xl bg-surface-container-low px-4 py-3 text-sm text-on-surface-variant">
              <span className="material-symbols-outlined text-base">lock</span>
              Thông tin của bạn được bảo mật tuyệt đối
            </div>
          </aside>
        </form>
      </div>
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
    <label
      className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-4 transition hover:bg-surface-container-low ${
        checked ? "border-primary bg-emerald-50/70" : "border-outline-variant/70 bg-white"
      }`}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="h-5 w-5 text-primary"
      />
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-bold text-on-surface">{title}</span>
        <span className="block text-sm text-on-surface-variant">{description}</span>
      </span>
      <span className={`text-sm font-bold ${highlight ? "text-primary" : "text-on-surface"}`}>{price}</span>
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
    <label
      className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-4 text-sm font-semibold transition hover:bg-surface-container-low ${
        checked ? "border-primary bg-emerald-50/70 text-on-surface" : "border-outline-variant/70 text-on-surface"
      }`}
    >
      <input
        type="radio"
        name="payment"
        value={value}
        checked={checked}
        onChange={onChange}
        className="h-5 w-5 text-primary"
      />
      {label}
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
