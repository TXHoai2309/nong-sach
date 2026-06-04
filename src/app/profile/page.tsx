"use client";

import { useEffect, useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Breadcrumb from "@/components/layout/Breadcrumb";
import { formatCurrency } from "@/lib/format";
import { useAuthStore } from "@/store/auth-store";
import { useCartStore } from "@/store/cart-store";
import { UserAddress } from "@/types/user";

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

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface Order {
  id: string;
  orderId: string;
  name: string;
  phone: string;
  address: string;
  total: number;
  paymentMethod: string;
  date: string;
  status: "processing" | "completed" | string;
  items: OrderItem[];
  userId?: string;
}

export default function ProfilePage() {
  const router = useRouter();
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
  } = useAuthStore();
  const { addToCart } = useCartStore();

  // Navigation tab
  const [activeTab, setActiveTab] = useState<"info" | "orders" | "addresses" | "password" | "notifications">("info");

  // Notifications/Toasts
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Profile Form State
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState<"Nam" | "Nữ" | "Khác" | "">("");

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
  const [provinces, setProvinces] = useState<any[]>([]);

  // Orders State
  const [orders, setOrders] = useState<Order[]>([]);
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
    setMounted(true);
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
        const data = await res.json();
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
      setFullName(currentUser.name || "");
      setPhone(currentUser.phone || "");
      setDob(currentUser.dob || "");
      setGender(currentUser.gender || "");
    }
  }, [currentUser]);

  // Load / Setup Orders
  useEffect(() => {
    if (!mounted || !currentUser) return;

    const storedOrdersStr = localStorage.getItem("nong-sach-orders");
    let storedOrders: Order[] = [];
    if (storedOrdersStr) {
      try {
        storedOrders = JSON.parse(storedOrdersStr);
      } catch (e) {
        console.error(e);
      }
    }

    // Filter orders belonging to this user
    const userOrders = storedOrders.filter((o) => o.userId === currentUser.id);

    // If no orders exist, initialize with a beautiful default mockup order matching the UI mockup
    if (userOrders.length === 0 && currentUser.email === "nguyenvana@gmail.com") {
      const mockOrder: Order = {
        id: "NS-92831",
        orderId: "NS92831",
        name: "Nguyễn Văn A",
        phone: "0123 456 789",
        address: "123 Đường Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh",
        total: 155000,
        paymentMethod: "cod",
        date: "24/06/2024",
        status: "completed",
        items: [
          {
            productId: "1",
            name: "Súp lơ xanh Đà Lạt",
            price: 35000,
            image: "https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c?w=150&h=150&fit=crop",
            quantity: 1,
          },
          {
            productId: "2",
            name: "Cà rốt hữu cơ",
            price: 60000,
            image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=150&h=150&fit=crop",
            quantity: 2,
          },
        ],
      };

      const defaultOrdersList = [mockOrder];
      // Save default list back to global orders
      try {
        const allOrders = storedOrdersStr ? JSON.parse(storedOrdersStr) : [];
        // prevent double adding
        if (!allOrders.some((o: any) => o.id === mockOrder.id)) {
          localStorage.setItem(
            "nong-sach-orders",
            JSON.stringify([...allOrders, { ...mockOrder, userId: currentUser.id }])
          );
        }
      } catch {}
      setOrders(defaultOrdersList);
    } else {
      setOrders(userOrders);
    }
  }, [mounted, currentUser]);

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
      gender: gender || undefined,
    });
    showToast("Cập nhật thông tin cá nhân thành công!");
  };

  // 2. Change Password
  const handleChangePassword = (e: FormEvent) => {
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

    const result = changePassword(currentPassword, newPassword);
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
    const selectedDist = selectedProv?.districts?.find((d: any) => d.code === Number(addrDistrictCode));

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
  const filteredOrders = orders.filter((o) => {
    if (orderFilter === "processing") return o.status === "processing" || o.status === "pending";
    if (orderFilter === "completed") return o.status === "completed";
    return true;
  });

  // Dynamic District Options for Address Form
  const currentSelectedProvObj = provinces.find((p) => p.code === Number(addrProvinceCode));
  const formDistrictOptions = currentSelectedProvObj?.districts ?? [];

  return (
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
          <aside className="w-full shrink-0 md:w-[260px] lg:w-[280px]">
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
                {[
                  { id: "info", label: "Thông tin cá nhân", icon: "person" },
                  { id: "orders", label: "Đơn hàng của tôi", icon: "shopping_bag" },
                  { id: "addresses", label: "Địa chỉ giao hàng", icon: "location_on" },
                  { id: "password", label: "Đổi mật khẩu", icon: "lock" },
                  { id: "notifications", label: "Thông báo", icon: "notifications" },
                ].map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <li key={item.id}>
                      <button
                        onClick={() => {
                          setActiveTab(item.id as any);
                          setIsAddressFormOpen(false);
                        }}
                        className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm transition-all ${
                          isActive
                            ? "bg-[#e6f4ea] font-bold text-[#006c49]"
                            : "text-[#3c4a42] hover:bg-[#10b981]/5 font-medium"
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          <span className={`material-symbols-outlined text-[20px] ${isActive ? "text-[#006c49]" : "text-[#3c4a42]/70"}`}>
                            {item.icon}
                          </span>
                          {item.label}
                        </span>
                        <span className="material-symbols-outlined text-sm text-[#3c4a42]/40">
                          chevron_right
                        </span>
                      </button>
                    </li>
                  );
                })}
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
                        className="w-full rounded-2xl border-none bg-[#f4f6fa] px-4 py-3 text-sm text-[#3c4a42] outline-none transition focus:ring-2 focus:ring-[#006c49]"
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
                        className="w-full rounded-2xl border-none bg-[#f4f6fa] px-4 py-3 text-sm text-[#3c4a42] outline-none transition focus:ring-2 focus:ring-[#006c49]"
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
                        className="w-full rounded-2xl border-none bg-[#f4f6fa] px-4 py-3 text-sm text-[#3c4a42] outline-none transition focus:ring-2 focus:ring-[#006c49]"
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
                      ].map((item) => (
                        <label key={item.value} className="flex cursor-pointer items-center gap-2 text-sm text-[#3c4a42] font-medium">
                          <input
                            type="radio"
                            name="gender"
                            value={item.value}
                            checked={gender === item.value}
                            onChange={() => setGender(item.value as any)}
                            className="h-4.5 w-4.5 border-gray-300 text-[#006c49] focus:ring-[#006c49]"
                          />
                          {item.label}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Save button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="rounded-full bg-[#006c49] px-8 py-3.5 text-sm font-bold text-white transition hover:opacity-90 shadow-sm"
                    >
                      Lưu thay đổi
                    </button>
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
                      return (
                        <div key={order.id} className="rounded-2xl border border-[#bbcabf]/25 p-4 sm:p-5">
                          <div className="flex flex-col justify-between gap-3 border-b border-[#bbcabf]/20 pb-4 sm:flex-row sm:items-center">
                            <div>
                              <p className="text-sm font-bold text-[#3c4a42]">
                                Đơn hàng #{order.orderId}
                              </p>
                              <p className="mt-1 text-xs text-[#3c4a42]/60 font-medium">
                                Ngày đặt: {order.date}
                              </p>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${
                                order.status === "completed"
                                  ? "bg-[#e6f4ea] text-[#006c49]"
                                  : "bg-[#e7eeff] text-[#004b87]"
                              }`}>
                                <span className="h-1.5 w-1.5 rounded-full bg-current"></span>
                                {order.status === "completed" ? "Hoàn thành" : "Đang xử lý"}
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
                                  {formatCurrency(order.total)}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Expanded Details section */}
                          {isExpanded && (
                            <div className="bg-[#f9f9ff] rounded-xl p-4 border border-[#bbcabf]/15 mb-4 text-xs space-y-2 text-[#3c4a42]/80">
                              <p><strong className="text-[#3c4a42]">Người nhận:</strong> {order.name}</p>
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
                          {formDistrictOptions.map((dist: any) => (
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
                <h3 className="mb-6 text-lg font-bold text-[#006c49]">Thông báo</h3>
                <div className="space-y-4">
                  {[
                    {
                      id: 1,
                      title: "Đặt hàng thành công!",
                      content: "Đơn hàng #NS92831 của bạn đã được tiếp nhận và đang được xử lý giao hàng.",
                      date: "24/06/2024",
                      isNew: false,
                    },
                    {
                      id: 2,
                      title: "Chào mừng thành viên mới!",
                      content: "Chúc mừng bạn đã gia nhập NôngSạch! Sử dụng mã KM 'NONGSACK' để nhận chiết khấu 15.000₫ cho các đơn hàng của mình nhé.",
                      date: "03/06/2026",
                      isNew: true,
                    },
                  ].map((noti) => (
                    <div
                      key={noti.id}
                      className={`rounded-2xl border p-4.5 transition-all ${
                        noti.isNew 
                          ? "border-[#006c49] bg-[#006c49]/[0.01]" 
                          : "border-[#bbcabf]/20 bg-white"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h4 className="text-sm font-bold text-[#3c4a42] flex items-center gap-1.5">
                            {noti.title}
                            {noti.isNew && (
                              <span className="h-2 w-2 rounded-full bg-[#006c49]" title="Mới"></span>
                            )}
                          </h4>
                          <p className="mt-1.5 text-xs leading-5 text-[#3c4a42]/70 font-medium">
                            {noti.content}
                          </p>
                          <p className="mt-2 text-[10px] text-[#3c4a42]/40 font-medium">
                            {noti.date}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
