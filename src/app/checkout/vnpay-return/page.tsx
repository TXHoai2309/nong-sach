"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useCartStore } from "@/store/cart-store";
import Breadcrumb from "@/components/layout/Breadcrumb";

function VnPayReturnContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const removePurchasedItems = useCartStore((s) => s.removePurchasedItems);
  
  const [status, setStatus] = useState<"loading" | "success" | "error" | "cancelled">("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [txnRef, setTxnRef] = useState("");
  const [transactionNo, setTransactionNo] = useState("");

  useEffect(() => {
    let active = true;

    async function verifyPayment() {
      try {
        // Build the params object from searchParams
        const params: Record<string, string> = {};
        searchParams.forEach((value, key) => {
          params[key] = value;
        });

        if (!params.vnp_TxnRef || !params.vnp_SecureHash) {
          if (active) {
            setStatus("error");
            setErrorMessage("Không tìm thấy thông tin giao dịch thanh toán.");
          }
          return;
        }

        setTxnRef(params.vnp_TxnRef);

        // Call our API route to verify signature and finalize order
        const res = await fetch("/api/vnpay/verify-payment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ searchParams: params }),
        });

        const data = await res.json();

        if (!active) return;

        if (res.ok && data.success) {
          setStatus("success");
          setTransactionNo(data.transactionNo || "");
          
          // Clear cart items that were part of this order
          if (data.productIds && data.productIds.length > 0) {
            removePurchasedItems(data.productIds);
          }

          // Redirect to the success page with query details
          const queryParams = new URLSearchParams({
            orderId: data.orderId,
            paymentMethod: "vnpay",
            vnp_TransactionNo: data.transactionNo || "",
          });
          
          // Small delay for UX transition
          setTimeout(() => {
            router.push(`/checkout/success?${queryParams.toString()}`);
          }, 1500);
        } else {
          // Check for specific VNPay cancel code (24)
          if (params.vnp_ResponseCode === "24") {
            setStatus("cancelled");
          } else {
            setStatus("error");
            setErrorMessage(data.error || "Giao dịch thanh toán không thành công.");
          }
        }
      } catch (err) {
        console.error("Lỗi verify payment client:", err);
        if (active) {
          setStatus("error");
          setErrorMessage("Có lỗi xảy ra trong quá trình xác thực giao dịch.");
        }
      }
    }

    verifyPayment();

    return () => {
      active = false;
    };
  }, [searchParams, router, removePurchasedItems]);

  if (status === "loading") {
    return (
      <div className="mx-auto max-w-[480px] rounded-3xl bg-white p-8 text-center shadow-lg border border-outline-variant/10">
        <div className="relative mx-auto mb-6 h-16 w-16">
          <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
          <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        </div>
        <h1 className="mb-3 text-xl font-bold text-on-surface">Đang xác thực thanh toán</h1>
        <p className="text-sm text-on-surface-variant leading-relaxed">
          Chúng tôi đang xác thực kết quả thanh toán từ VNPay. Vui lòng giữ kết nối mạng và không đóng tab/trình duyệt này.
        </p>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="mx-auto max-w-[480px] rounded-3xl bg-white p-8 text-center shadow-lg border border-outline-variant/10">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-6 animate-pulse">
          <span className="material-symbols-outlined text-[36px]">check_circle</span>
        </div>
        <h1 className="mb-3 text-xl font-bold text-on-surface text-emerald-700">Thanh toán thành công!</h1>
        <p className="mb-2 text-xs font-bold text-on-surface-variant">Mã giao dịch: #{transactionNo}</p>
        <p className="text-sm text-on-surface-variant leading-relaxed mb-4">
          Giao dịch đã được xác nhận. Đang chuyển hướng bạn đến trang xác nhận đơn hàng...
        </p>
      </div>
    );
  }

  if (status === "cancelled") {
    return (
      <div className="mx-auto max-w-[480px] rounded-3xl bg-white p-8 text-center shadow-lg border border-outline-variant/10">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-amber-600 mb-6">
          <span className="material-symbols-outlined text-[36px]">cancel</span>
        </div>
        <h1 className="mb-3 text-xl font-bold text-on-surface text-amber-700">Thanh toán đã bị hủy</h1>
        <p className="text-sm text-on-surface-variant leading-relaxed mb-6">
          Bạn đã hủy yêu cầu thanh toán trên cổng VNPay. Đơn hàng của bạn chưa được tạo và giỏ hàng vẫn được giữ nguyên.
        </p>
        <div className="flex flex-col gap-2">
          <Link
            href="/checkout"
            className="w-full rounded-2xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-md hover:opacity-90 transition"
          >
            Quay lại trang Thanh toán
          </Link>
          <Link
            href="/cart"
            className="w-full rounded-2xl border border-outline-variant px-6 py-3 text-sm font-bold text-on-surface hover:bg-slate-50 transition"
          >
            Về giỏ hàng
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[480px] rounded-3xl bg-white p-8 text-center shadow-lg border border-outline-variant/10">
      <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600 mb-6">
        <span className="material-symbols-outlined text-[36px]">error</span>
      </div>
      <h1 className="mb-3 text-xl font-bold text-on-surface text-red-700">Thanh toán thất bại</h1>
      <p className="text-sm text-on-surface-variant leading-relaxed mb-6">
        {errorMessage || "Đã xảy ra lỗi trong quá trình thực hiện thanh toán qua VNPay."}
      </p>
      <div className="flex flex-col gap-2">
        <Link
          href="/checkout"
          className="w-full rounded-2xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-md hover:opacity-90 transition"
        >
          Thử lại thanh toán
        </Link>
        <Link
          href="/cart"
          className="w-full rounded-2xl border border-outline-variant px-6 py-3 text-sm font-bold text-on-surface hover:bg-slate-50 transition"
        >
          Quay lại Giỏ hàng
        </Link>
      </div>
    </div>
  );
}

export default function VnPayReturnPage() {
  return (
    <main className="page-surface py-12">
      <div className="site-container page-enter">
        <Breadcrumb
          className="mb-8"
          items={[
            { label: "Trang chủ", href: "/" },
            { label: "Giỏ hàng", href: "/cart" },
            { label: "Thanh toán", href: "/checkout" },
            { label: "Kết quả VNPay" },
          ]}
        />
        <Suspense
          fallback={
            <div className="min-h-[300px] flex items-center justify-center">
              <div className="text-on-surface-variant font-medium animate-pulse">Đang tải kết quả...</div>
            </div>
          }
        >
          <VnPayReturnContent />
        </Suspense>
      </div>
    </main>
  );
}
