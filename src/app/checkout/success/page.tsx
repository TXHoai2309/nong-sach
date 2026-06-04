"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { formatCurrency } from "@/lib/format";
import Breadcrumb from "@/components/layout/Breadcrumb";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") || "NS-UNKNOWN";
  const name = searchParams.get("name") || "";
  const phone = searchParams.get("phone") || "";
  const address = searchParams.get("address") || "";
  const total = parseFloat(searchParams.get("total") || "0");
  const paymentMethod = searchParams.get("paymentMethod") || "cod";

  const getPaymentLabel = (method: string) => {
    switch (method) {
      case "cod":
        return "Thanh toán khi nhận hàng (COD)";
      case "bank":
        return "Chuyển khoản ngân hàng";
      case "credit":
        return "Thẻ tín dụng (Visa/Mastercard)";
      case "wallet":
        return "Ví điện tử (MoMo/ZaloPay)";
      default:
        return "Thanh toán khi nhận hàng (COD)";
    }
  };

  return (
    <div className="max-w-[480px] mx-auto bg-surface-container-lowest rounded-2xl shadow-[0_10px_15px_-3px_rgba(30,41,59,0.05)] border border-outline-variant/20 p-8 md:p-10 text-center mt-10">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-50 rounded-full text-primary mb-6">
        <span className="material-symbols-outlined text-[48px] text-primary">check_circle</span>
      </div>

      <h1 className="text-headline-lg font-bold text-on-surface mb-3">Đặt hàng thành công!</h1>
      <p className="text-on-surface-variant text-label-md mb-6 leading-relaxed">
        Cảm ơn quý khách đã mua sắm tại <strong>NôngSạch</strong>. Đơn hàng của bạn đã được ghi nhận thành công trên hệ thống.
      </p>

      {/* Order Info Card */}
      <div className="bg-surface-container-low rounded-xl p-5 mb-8 text-left border border-outline-variant/20 space-y-3">
        <div className="flex justify-between border-b border-outline-variant/30 pb-3 mb-2">
          <span className="text-label-md font-semibold text-on-surface-variant">Mã đơn hàng:</span>
          <span className="text-label-md font-bold text-primary bg-[#f0fdf4] px-2 py-0.5 rounded-lg border border-primary/20">
            {orderId}
          </span>
        </div>
        <div className="space-y-2 text-label-md text-on-surface-variant">
          <p>
            <strong className="text-on-surface font-semibold">Người nhận:</strong> {name}
          </p>
          <p>
            <strong className="text-on-surface font-semibold">Số điện thoại:</strong> {phone}
          </p>
          <p>
            <strong className="text-on-surface font-semibold">Địa chỉ:</strong> {address}
          </p>
          <p>
            <strong className="text-on-surface font-semibold">Thanh toán:</strong> {getPaymentLabel(paymentMethod)}
          </p>
          <div className="pt-3 border-t border-outline-variant/30 font-bold text-on-surface flex justify-between items-center">
            <span>Tổng thanh toán:</span>
            <span className="text-primary text-headline-md font-bold">{formatCurrency(total)}</span>
          </div>
        </div>
      </div>

      <Link
        href="/products"
        className="inline-flex items-center justify-center w-full py-3.5 bg-primary text-white font-bold rounded-xl hover:opacity-90 active:scale-95 transition-all duration-300 shadow-md cursor-pointer text-label-md"
      >
        Tiếp tục mua hàng
      </Link>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <main className="max-w-container-max mx-auto px-margin-mobile md:px-gutter py-lg">
      <Breadcrumb
        className="mb-8"
        items={[
          { label: "Trang chủ", href: "/" },
          { label: "Giỏ hàng", href: "/cart" },
          { label: "Thanh toán", href: "/checkout" },
          { label: "Hoàn tất" },
        ]}
      />
      <Suspense
        fallback={
          <div className="min-h-[400px] flex items-center justify-center">
            <div className="text-on-surface-variant font-medium">Đang tải thông tin đơn hàng...</div>
          </div>
        }
      >
        <SuccessContent />
      </Suspense>
    </main>
  );
}
