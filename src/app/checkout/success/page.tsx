"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { formatCurrency } from "@/lib/format";
import { getOrderStatusMeta } from "@/lib/order-status";
import Breadcrumb from "@/components/layout/Breadcrumb";
import { getAllProducts } from "@/lib/products";
import { db } from "@/lib/firebase";
import { doc, onSnapshot, collection, query, where } from "firebase/firestore";
import { Order, OrderStatus } from "@/types/order";
import { Product } from "@/types/product";
import { OrderTrackingTimeline } from "@/components/order/OrderTrackingTimeline";

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
  const [order, setOrder] = useState<Order | null>(null);
  const [subOrders, setSubOrders] = useState<Order[]>([]);
  const [activeSubOrderId, setActiveSubOrderId] = useState<string>("");
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  
  const vnpTransactionNo = searchParams.get("vnp_TransactionNo") || order?.vnp_TransactionNo || "";

  useEffect(() => {
    let active = true;
    let unsubscribeOrder: (() => void) | undefined;

    async function loadSuccessData() {
      try {
        const products = await getAllProducts();
        if (!active) return;

        const q = query(
          collection(db, "orders"),
          where("id", ">=", orderId),
          where("id", "<=", orderId + "\uf8ff")
        );

        unsubscribeOrder = onSnapshot(
          q,
          (querySnap) => {
            const loadedOrders: Order[] = [];
            querySnap.forEach((docSnap) => {
              loadedOrders.push({ id: docSnap.id, ...docSnap.data() } as Order);
            });

            if (loadedOrders.length > 0) {
              // Sort loadedOrders by ID (usually -1, -2, etc.)
              loadedOrders.sort((a, b) => a.id.localeCompare(b.id));
              setSubOrders(loadedOrders);

              // Merge all sub-orders
              const firstOrder = loadedOrders[0];
              const combinedItems = loadedOrders.flatMap((o) => o.items);
              const combinedTotal = loadedOrders.reduce((sum, o) => sum + o.totalAmount, 0);

              const combinedOrder: Order = {
                ...firstOrder,
                id: orderId, // use the base orderId
                items: combinedItems,
                totalAmount: combinedTotal,
              };

              setOrder(combinedOrder);

              // Set default active sub-order ID if not already set to a valid one
              setActiveSubOrderId((prevActiveId) => {
                if (loadedOrders.some((o) => o.id === prevActiveId)) {
                  return prevActiveId;
                }
                return loadedOrders[0].id;
              });

              const purchasedIds = new Set(combinedItems.map((item) => item.productId));
              setRecommendedProducts(products.filter((p) => !purchasedIds.has(p.id)).slice(0, 4));
            } else {
              setOrder(null);
              setSubOrders([]);
              setRecommendedProducts(products.slice(0, 4));
            }
          },
          (error) => {
            console.error("Error listening to order details from Firestore", error);
          }
        );
      } catch (e) {
        console.error("Error reading order details from Firestore", e);
      }
    }
    loadSuccessData();
    return () => {
      active = false;
      unsubscribeOrder?.();
    };
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
      case "vnpay":
        return "Thanh toán online qua VNPay";
      case "credit":
        return "Thẻ Visa / Mastercard";
      case "wallet":
        return "Ví điện tử";
      default:
        return "Tiền mặt khi nhận hàng (COD)";
    }
  };

  const getBaseProductId = (productId: string) => productId.replace(/-500g$|-1kg$|-2kg$/, "");

  // Get items list to display
  const displayItems = order?.items || [];
  const displayTotal = order?.totalAmount ?? totalParam;

  const getSummarizedStatus = (ordersList: Order[]): OrderStatus => {
    if (ordersList.length === 0) return "pending";
    if (ordersList.every((o) => o.status === "delivered")) return "delivered";
    if (ordersList.every((o) => o.status === "cancelled")) return "cancelled";
    if (ordersList.some((o) => o.status === "shipping")) return "shipping";
    if (ordersList.some((o) => o.status === "confirmed")) return "confirmed";
    if (ordersList.some((o) => o.status === "refunding")) return "refunding";
    if (ordersList.some((o) => o.status === "refunded")) return "refunded";
    return "pending";
  };

  const overallStatus = subOrders.length > 0 ? getSummarizedStatus(subOrders) : (order?.status ?? "pending");
  const statusMeta = getOrderStatusMeta(overallStatus);
  const selectedTrackingOrder = subOrders.find((so) => so.id === activeSubOrderId) || order;

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
                  {statusMeta.icon}
                </span>
                <div className="space-y-0.5">
                  <p className="text-xs text-on-surface-variant font-medium">Trạng thái</p>
                  <p className={`text-sm font-bold ${statusMeta.successTone}`}>{statusMeta.label}</p>
                  <p className="text-xs font-medium text-on-surface-variant">{statusMeta.detail}</p>
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
                  {vnpTransactionNo && (
                    <p className="text-xs text-on-surface-variant font-semibold mt-1">
                      Mã GD VNPay: <span className="text-primary font-bold">{vnpTransactionNo}</span>
                    </p>
                  )}
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

            {/* Real-time Order Tracking Timeline */}
            <div className="mt-8 pt-6 border-t border-outline-variant/20">
              {subOrders.length > 1 && (
                <div className="mb-6 space-y-2">
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                    Theo dõi hành trình theo cửa hàng:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {subOrders.map((so) => {
                      const isSelected = so.id === activeSubOrderId;
                      return (
                        <button
                          key={so.id}
                          onClick={() => setActiveSubOrderId(so.id)}
                          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border flex items-center gap-1.5 cursor-pointer ${
                            isSelected
                              ? "bg-[#006c49] border-[#006c49] text-white shadow-sm"
                              : "bg-white border-[#bbcabf]/30 text-[#3c4a42] hover:bg-[#f9f9ff]"
                          }`}
                        >
                          <span>{so.shopName}</span>
                          <span className={`h-1.5 w-1.5 rounded-full ${
                            so.status === "delivered" ? "bg-emerald-500" :
                            so.status === "cancelled" ? "bg-red-500" : "bg-amber-500"
                          }`}></span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <OrderTrackingTimeline order={selectedTrackingOrder || ({ id: orderId, status: "pending" } as Order)} />
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
                      <Link
                        href={`/products/${getBaseProductId(item.productId)}`}
                        className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-background border border-outline-variant/10 transition hover:ring-2 hover:ring-primary/30"
                        title="Xem chi tiết sản phẩm"
                      >
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </Link>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-on-surface truncate">
                          {item.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] font-semibold text-on-surface-variant bg-slate-100 px-1.5 py-0.5 rounded-md">
                            {item.shopName || "NôngSạch"}
                          </span>
                          {subOrders.length > 1 && (() => {
                            const status = subOrders.find((so) => so.sellerId === item.sellerId)?.status || "pending";
                            const meta = getOrderStatusMeta(status);
                            return (
                              <span className={`text-[9px] font-extrabold uppercase tracking-wide px-1.5 py-0.5 rounded-full ${meta.tone}`}>
                                {meta.label}
                              </span>
                            );
                          })()}
                        </div>
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
          onClick={() => {
            if (order?.trackingCode) {
              window.open(order.trackingUrl || `https://ghn.vn/blogs/trang-thai-don-hang?v=${order.trackingCode}`, "_blank");
            } else {
              alert("Mã vận đơn đang được người bán cập nhật. Vui lòng quay lại sau!");
            }
          }}
          className="px-6 py-3.5 bg-primary text-white font-bold rounded-2xl hover:opacity-90 active:scale-[0.99] transition-all shadow-md flex items-center justify-center gap-xs cursor-pointer w-full sm:w-auto"
        >
          Theo dõi đơn hàng
          <span className="material-symbols-outlined text-[18px]">local_shipping</span>
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
    <main className="page-surface py-8">
      <div className="site-container page-enter">
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
      </div>
    </main>
  );
}
