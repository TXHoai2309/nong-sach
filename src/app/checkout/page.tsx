"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ShoppingBag, CheckCircle, MapPin, Phone, User, FileText } from "lucide-react";
import Container from "@/components/layout/Container";
import { useCartStore } from "@/store/cart-store";
import { formatCurrency } from "@/lib/format";

interface FormErrors {
  fullName?: string;
  phone?: string;
  address?: string;
}

export default function CheckoutPage() {
  const [mounted, setMounted] = useState(false);
  
  // Form states
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  // Success Order state
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [generatedOrderId, setGeneratedOrderId] = useState("");
  const [finalOrderDetails, setFinalOrderDetails] = useState<{
    fullName: string;
    phone: string;
    address: string;
    note: string;
    items: any[];
    totalAmount: number;
  } | null>(null);

  const { items, clearCart, getTotalPrice, getTotalItems } = useCartStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-50 py-10 flex items-center justify-center">
        <div className="text-slate-500 font-medium">Đang tải...</div>
      </div>
    );
  }

  // Handle Order Success
  if (orderSuccess && finalOrderDetails) {
    return (
      <div className="min-h-screen bg-slate-50 py-16 flex items-center justify-center">
        <Container>
          <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-slate-100 shadow-xl p-8 sm:p-12 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-50 rounded-full text-emerald-600 mb-6">
              <CheckCircle className="w-12 h-12" />
            </div>

            <h1 className="text-3xl font-extrabold text-slate-800 mb-3">
              Đặt hàng thành công!
            </h1>
            <p className="text-slate-500 mb-6 text-sm sm:text-base leading-relaxed">
              Cảm ơn quý khách đã mua sắm tại <strong>NôngSạch</strong>. Đơn hàng của bạn đã được ghi nhận thành công trên hệ thống local.
            </p>

            {/* Order Code Card */}
            <div className="bg-slate-50 rounded-2xl p-6 mb-8 text-left border border-slate-100">
              <div className="flex justify-between border-b border-slate-200/60 pb-3 mb-4">
                <span className="text-sm font-semibold text-slate-500">Mã đơn hàng:</span>
                <span className="text-sm font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg">
                  {generatedOrderId}
                </span>
              </div>
              <div className="space-y-2 text-sm text-slate-600">
                <p><strong>Người nhận:</strong> {finalOrderDetails.fullName}</p>
                <p><strong>Số điện thoại:</strong> {finalOrderDetails.phone}</p>
                <p><strong>Địa chỉ nhận hàng:</strong> {finalOrderDetails.address}</p>
                {finalOrderDetails.note && (
                  <p><strong>Ghi chú:</strong> {finalOrderDetails.note}</p>
                )}
                <p className="pt-2 border-t border-slate-200/60 font-semibold text-slate-800 flex justify-between">
                  <span>Tổng thanh toán:</span>
                  <span className="text-emerald-600 font-extrabold text-base">
                    {formatCurrency(finalOrderDetails.totalAmount)}
                  </span>
                </p>
              </div>
            </div>

            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all duration-300 shadow-md hover:shadow-lg active:scale-95"
            >
              Tiếp tục mua hàng
            </Link>
          </div>
        </Container>
      </div>
    );
  }

  // Handle Empty Cart
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center py-20 px-4">
          <ShoppingBag className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-slate-700 mb-2">
            Bạn chưa có sản phẩm nào trong giỏ hàng.
          </h1>
          <p className="text-slate-400 text-sm mb-6">
            Hãy thêm sản phẩm vào giỏ hàng trước khi tiến hành thanh toán.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors shadow-sm hover:shadow-md active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại trang sản phẩm
          </Link>
        </div>
      </div>
    );
  }

  const validate = () => {
    const tempErrors: FormErrors = {};
    if (!fullName.trim()) {
      tempErrors.fullName = "Họ và tên không được để trống";
    }
    if (!phone.trim()) {
      tempErrors.phone = "Số điện thoại không được để trống";
    } else if (!/^\d+$/.test(phone.trim())) {
      tempErrors.phone = "Số điện thoại chỉ được chứa ký tự số";
    } else if (phone.trim().length < 10) {
      tempErrors.phone = "Số điện thoại tối thiểu phải có 10 số";
    }
    if (!address.trim()) {
      tempErrors.address = "Địa chỉ không được để trống";
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const orderId = "NS" + Date.now();
    
    // Save details to display on success screen
    setFinalOrderDetails({
      fullName,
      phone,
      address,
      note,
      items: [...items],
      totalAmount: getTotalPrice(),
    });
    setGeneratedOrderId(orderId);
    
    // Clear Zustand store
    clearCart();
    setOrderSuccess(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <Container>
        {/* Navigation back */}
        <div className="flex items-center gap-3 mb-8">
          <Link
            href="/cart"
            aria-label="Quay lại giỏ hàng"
            className="flex items-center justify-center w-9 h-9 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-slate-600" />
          </Link>
          <h1 className="text-2xl font-bold text-slate-800">Đặt hàng</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Form đặt hàng bên trái */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8">
            <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-emerald-600" /> Thông tin nhận hàng
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Họ tên */}
              <div className="space-y-1.5">
                <label htmlFor="fullName" className="text-xs sm:text-sm font-semibold text-slate-600 block">
                  Họ và tên <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <User className="h-4.5 w-4.5 text-slate-400" />
                  </span>
                  <input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Nguyễn Văn A"
                    className={`w-full pl-10 pr-4 py-3 bg-slate-50/50 border rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all ${
                      errors.fullName ? "border-red-400 focus:ring-red-500/10 focus:border-red-500" : "border-slate-200"
                    }`}
                  />
                </div>
                {errors.fullName && (
                  <p className="text-xs text-red-500 mt-1 font-medium">{errors.fullName}</p>
                )}
              </div>

              {/* Số điện thoại */}
              <div className="space-y-1.5">
                <label htmlFor="phone" className="text-xs sm:text-sm font-semibold text-slate-600 block">
                  Số điện thoại <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Phone className="h-4.5 w-4.5 text-slate-400" />
                  </span>
                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0901234567"
                    className={`w-full pl-10 pr-4 py-3 bg-slate-50/50 border rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all ${
                      errors.phone ? "border-red-400 focus:ring-red-500/10 focus:border-red-500" : "border-slate-200"
                    }`}
                  />
                </div>
                {errors.phone && (
                  <p className="text-xs text-red-500 mt-1 font-medium">{errors.phone}</p>
                )}
              </div>

              {/* Địa chỉ */}
              <div className="space-y-1.5">
                <label htmlFor="address" className="text-xs sm:text-sm font-semibold text-slate-600 block">
                  Địa chỉ nhận hàng <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <MapPin className="h-4.5 w-4.5 text-slate-400" />
                  </span>
                  <input
                    id="address"
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Số 123 Đường ABC, Quận XYZ, TP. HCM"
                    className={`w-full pl-10 pr-4 py-3 bg-slate-50/50 border rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all ${
                      errors.address ? "border-red-400 focus:ring-red-500/10 focus:border-red-500" : "border-slate-200"
                    }`}
                  />
                </div>
                {errors.address && (
                  <p className="text-xs text-red-500 mt-1 font-medium">{errors.address}</p>
                )}
              </div>

              {/* Ghi chú */}
              <div className="space-y-1.5">
                <label htmlFor="note" className="text-xs sm:text-sm font-semibold text-slate-600 block">
                  Ghi chú đơn hàng (Không bắt buộc)
                </label>
                <div className="relative">
                  <span className="absolute top-3 left-3 flex items-center pointer-events-none">
                    <FileText className="h-4.5 w-4.5 text-slate-400" />
                  </span>
                  <textarea
                    id="note"
                    rows={4}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Giao giờ hành chính, gọi trước khi giao..."
                    className="w-full pl-10 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                id="submit-order"
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all duration-300 shadow-md hover:shadow-lg active:scale-95 cursor-pointer text-sm"
              >
                Xác nhận đặt hàng
              </button>
            </form>
          </div>

          {/* Tóm tắt đơn hàng bên phải */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sticky top-20">
              <h2 className="font-bold text-slate-800 text-base mb-5">
                Đơn hàng của bạn ({getTotalItems()} sản phẩm)
              </h2>

              {/* Items List */}
              <div className="max-h-[300px] overflow-y-auto pr-1 flex flex-col gap-4 pb-4 border-b border-slate-100">
                {items.map((item) => (
                  <div key={item.productId} className="flex gap-3 items-center">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-slate-50 border border-slate-100">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs sm:text-sm font-semibold text-slate-800 truncate">
                        {item.name}
                      </h4>
                      <p className="text-slate-400 text-xs mt-0.5">
                        Số lượng: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs sm:text-sm font-bold text-slate-700">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Details */}
              <div className="flex justify-between items-center py-4 border-b border-slate-100">
                <span className="text-sm text-slate-500">Phí vận chuyển</span>
                <span className="text-sm font-semibold text-emerald-600">
                  Miễn phí
                </span>
              </div>

              <div className="flex justify-between items-center pt-4">
                <span className="font-bold text-slate-800">Tổng cộng</span>
                <span className="text-xl font-extrabold text-emerald-700">
                  {formatCurrency(getTotalPrice())}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
