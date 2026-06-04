"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { formatCurrency } from "@/lib/format";
import Breadcrumb from "@/components/layout/Breadcrumb";
import Container from "@/components/layout/Container";
import { products } from "@/data/products";

interface StoredOrderItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface StoredOrderDetails {
  orderId: string;
  name: string;
  phone: string;
  address: string;
  total: number;
  paymentMethod: string;
  items: StoredOrderItem[];
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") || "NS-UNKNOWN";
  const name = searchParams.get("name") || "";
  const phone = searchParams.get("phone") || "";
  const address = searchParams.get("address") || "";
  const totalParam = parseFloat(searchParams.get("total") || "0");
  const paymentMethod = searchParams.get("paymentMethod") || "cod";

  const [copied, setCopied] = useState(false);
  const [notificationStatus, setNotificationStatus] = useState<"idle" | "enabled" | "dismissed">("idle");
  const [localOrder, setLocalOrder] = useState<StoredOrderDetails | null>(null);

  // Load items from localStorage if orderId matches
  useEffect(() => {
    try {
      const stored = localStorage.getItem("nong-sach-last-order");
      if (stored) {
        const parsed = JSON.parse(stored) as StoredOrderDetails;
        if (parsed && parsed.orderId === orderId) {
          setLocalOrder(parsed);
        }
      }
    } catch (e) {
      console.error("Error reading last order details", e);
    }
  }, [orderId]);

  // Copy Order ID
  const handleCopyOrderId = () => {
    navigator.clipboard.writeText(orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Trigger print for PDF download
  const handlePrint = (e: React.MouseEvent) => {
    e.preventDefault();
    window.print();
  };

  const getPaymentLabel = (method: string) => {
    switch (method) {
      case "cod":
        return "Tiền mặt khi nhận hàng (COD)";
      case "bank":
        return "Chuyển khoản ngân hàng";
      case "credit":
        return "Thẻ Visa / Mastercard";
      case "wallet":
        return "Ví điện tử";
      default:
        return "Tiền mặt khi nhận hàng (COD)";
    }
  };

  // Get items list to display
  const displayItems = localOrder?.items || [];
  const displayTotal = localOrder?.total ?? totalParam;

  // Filter recommendations (exclude items purchased)
  const purchasedIds = new Set(displayItems.map((item) => item.productId));
  const recommendedProducts = products
    .filter((p) => !purchasedIds.has(p.id))
    .slice(0, 4);

  return (
    <div className="max-w-[860px] mx-auto space-y-8 pb-12">
      {/* Top Header Section */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-[#e8f5e9] text-[#006c49] rounded-full shadow-sm">
          <span className="material-symbols-outlined text-[48px]">check</span>
        </div>

        <h1 className="text-headline-lg font-bold text-primary flex items-center justify-center gap-xs">
          Đặt hàng thành công! 🎉
        </h1>
        <p className="text-on-surface-variant text-label-md max-w-[480px] mx-auto leading-relaxed">
          Cảm ơn bạn đã tin tưởng NôngSạch. Đơn hàng của bạn đang được chuẩn bị và sẽ sớm được giao tới địa chỉ của bạn.
        </p>

        {/* Gray Capsule Badge for Order ID */}
        <div className="flex justify-center">
          <button
            onClick={handleCopyOrderId}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#f0f3ff] hover:bg-surface-variant/50 transition-colors border border-outline-variant/30 rounded-full text-xs font-bold text-on-surface-variant cursor-pointer"
            title="Nhấn để sao chép"
          >
            <span>#{orderId}</span>
            <span className="material-symbols-outlined text-[15px]">
              {copied ? "check" : "content_copy"}
            </span>
            {copied && <span className="text-[10px] text-primary font-bold">Đã sao chép!</span>}
          </button>
        </div>
      </div>

      {/* Main Order Details Card */}
      <section className="bg-white rounded-[2rem] shadow-[0_10px_25px_-5px_rgba(0,108,73,0.04)] border border-outline-variant/20 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-12">
          {/* Left Column: Delivery details */}
          <div className="md:col-span-7 p-6 sm:p-8 space-y-6">
            <h2 className="text-lg font-bold text-on-surface">Chi tiết đơn hàng</h2>
            
            <div className="space-y-5">
              {/* Row 1: Status */}
              <div className="flex gap-sm">
                <span className="material-symbols-outlined text-primary text-[20px] shrink-0 mt-0.5">
                  inventory_2
                </span>
                <div className="space-y-0.5">
                  <p className="text-xs text-on-surface-variant font-medium">Trạng thái</p>
                  <p className="text-sm font-bold text-[#2e7d32]">Đang chuẩn bị</p>
                </div>
              </div>

              {/* Row 2: Delivery time estimate */}
              <div className="flex gap-sm">
                <span className="material-symbols-outlined text-primary text-[20px] shrink-0 mt-0.5">
                  local_shipping
                </span>
                <div className="space-y-0.5">
                  <p className="text-xs text-on-surface-variant font-medium">Giao hàng dự kiến</p>
                  <p className="text-sm font-bold text-on-surface">14:00 – 16:00 hôm nay</p>
                </div>
              </div>

              {/* Row 3: Payment method */}
              <div className="flex gap-sm">
                <span className="material-symbols-outlined text-primary text-[20px] shrink-0 mt-0.5">
                  payments
                </span>
                <div className="space-y-0.5">
                  <p className="text-xs text-on-surface-variant font-medium">Thanh toán</p>
                  <p className="text-sm font-bold text-on-surface">{getPaymentLabel(paymentMethod)}</p>
                </div>
              </div>

              {/* Row 4: Address */}
              <div className="flex gap-sm">
                <span className="material-symbols-outlined text-primary text-[20px] shrink-0 mt-0.5">
                  location_on
                </span>
                <div className="space-y-0.5">
                  <p className="text-xs text-on-surface-variant font-medium">Địa chỉ nhận hàng</p>
                  <p className="text-sm font-bold text-on-surface leading-relaxed">
                    {address || `${name} – ${phone}`}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Ordered Items list */}
          <div className="md:col-span-5 p-6 sm:p-8 bg-surface-container-low/40 border-t md:border-t-0 md:border-l border-outline-variant/20 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-5">
                <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                  SẢN PHẨM ({displayItems.length || 1})
                </span>
              </div>

              {displayItems.length > 0 ? (
                <div className="space-y-4 max-h-[220px] overflow-y-auto pr-1">
                  {displayItems.map((item) => (
                    <div key={item.productId} className="flex gap-sm items-center">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-background border border-outline-variant/10">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-on-surface truncate">
                          {item.name}
                        </h4>
                        <p className="text-xs text-on-surface-variant font-medium">
                          x{item.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-bold text-on-surface">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-6 text-center text-xs text-on-surface-variant italic">
                  Đơn hàng bao gồm nông sản sạch
                </div>
              )}
            </div>

            <div className="border-t border-outline-variant/30 pt-4 mt-6 flex justify-between items-end">
              <span className="font-bold text-on-surface text-base">Tổng cộng</span>
              <span className="text-xl font-bold text-primary">
                {formatCurrency(displayTotal)}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Stepper Timeline */}
      <div className="flex justify-center items-center py-4 bg-white rounded-[2rem] border border-outline-variant/10 shadow-sm">
        <div className="grid grid-cols-[1fr_50px_1fr_50px_1fr_50px_1fr] items-start gap-1 w-full max-w-[520px] px-6">
          <div className="flex flex-col items-center">
            <div className="w-9 h-9 rounded-full bg-[#006c49] text-white flex items-center justify-center shadow-md">
              <span className="material-symbols-outlined text-[18px]">check</span>
            </div>
            <span className="text-[10px] font-bold text-[#006c49] mt-1 text-center">Đặt hàng</span>
          </div>
          <span className="mt-[18px] h-[2px] bg-outline-variant/30" />
          
          <div className="flex flex-col items-center">
            <div className="w-9 h-9 rounded-full bg-[#e7eeff] text-on-surface-variant flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px] text-[#5c5f61]">inventory_2</span>
            </div>
            <span className="text-[10px] font-medium text-on-surface-variant mt-1 text-center">Đóng gói</span>
          </div>
          <span className="mt-[18px] h-[2px] bg-outline-variant/30" />

          <div className="flex flex-col items-center">
            <div className="w-9 h-9 rounded-full bg-[#e7eeff] text-on-surface-variant flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px] text-[#5c5f61]">local_shipping</span>
            </div>
            <span className="text-[10px] font-medium text-on-surface-variant mt-1 text-center">Đang giao</span>
          </div>
          <span className="mt-[18px] h-[2px] bg-outline-variant/30" />

          <div className="flex flex-col items-center">
            <div className="w-9 h-9 rounded-full bg-[#e7eeff] text-on-surface-variant flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px] text-[#5c5f61]">check_circle</span>
            </div>
            <span className="text-[10px] font-medium text-on-surface-variant mt-1 text-center">Đã nhận</span>
          </div>
        </div>
      </div>

      {/* Notification banner card */}
      {notificationStatus !== "dismissed" && (
        <div className="p-4 bg-[#e8f5e9]/40 border border-outline-variant/15 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-sm">
            <span className="material-symbols-outlined text-primary text-[24px]">
              {notificationStatus === "enabled" ? "notifications_active" : "notifications"}
            </span>
            <p className="text-sm font-bold text-on-surface">
              {notificationStatus === "enabled" 
                ? "Đã bật thông báo thành công! Chúng tôi sẽ gửi cập nhật qua trình duyệt." 
                : "Nhận thông báo khi đơn hàng được giao tới bạn?"
              }
            </p>
          </div>
          <div className="flex items-center gap-sm">
            {notificationStatus === "idle" && (
              <>
                <button
                  onClick={() => setNotificationStatus("enabled")}
                  className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-full hover:opacity-90 cursor-pointer shadow-sm"
                >
                  Bật thông báo
                </button>
                <button
                  onClick={() => setNotificationStatus("dismissed")}
                  className="text-xs text-on-surface-variant font-bold hover:underline cursor-pointer"
                >
                  Để sau
                </button>
              </>
            )}
            {notificationStatus === "enabled" && (
              <button
                onClick={() => setNotificationStatus("dismissed")}
                className="text-xs text-on-surface-variant font-bold hover:underline cursor-pointer"
              >
                Đóng
              </button>
            )}
          </div>
        </div>
      )}

      {/* Direct CTA Buttons */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
        <button
          onClick={() => alert("Chức năng theo dõi đơn hàng đang được cập nhật ở Phase 2!")}
          className="px-6 py-3.5 bg-primary text-white font-bold rounded-2xl hover:opacity-90 active:scale-[0.99] transition-all shadow-md flex items-center justify-center gap-xs cursor-pointer w-full sm:w-auto"
        >
          Theo dõi đơn hàng
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>

        <Link
          href="/products"
          className="px-6 py-3.5 bg-white border border-outline-variant text-on-surface hover:bg-slate-50 transition-colors font-bold rounded-2xl flex items-center justify-center w-full sm:w-auto"
        >
          Tiếp tục mua sắm
        </Link>
      </div>

      {/* Print PDF Download receipt */}
      <div className="flex justify-center pt-2">
        <a
          href="#"
          onClick={handlePrint}
          className="inline-flex items-center gap-1.5 text-xs text-on-surface-variant hover:text-primary font-bold hover:underline transition-colors"
        >
          <span className="material-symbols-outlined text-[16px]">download</span>
          Tải hóa đơn PDF
        </a>
      </div>

      {/* Recommended Products Grid - "Bạn có thể thích" */}
      <div className="mt-12 pt-8 border-t border-outline-variant/20">
        <h3 className="text-xl font-bold text-on-surface mb-6">Bạn có thể thích</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {recommendedProducts.map((p) => (
            <Link
              href={`/products/${p.id}`}
              key={p.id}
              className="group bg-white border border-outline-variant/15 rounded-3xl p-3 shadow-sm hover:shadow-md transition-all block"
            >
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-background mb-3">
                <Image
                  src={p.image}
                  alt={p.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
              <div className="space-y-1 px-1">
                <h4 className="font-semibold text-on-surface text-sm line-clamp-1 group-hover:text-primary transition-colors">
                  {p.name}
                </h4>
                <p className="text-primary font-bold text-sm">
                  {formatCurrency(p.price)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
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
