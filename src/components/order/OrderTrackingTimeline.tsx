"use client";

import { Order } from "@/types/order";

export const OrderTrackingTimeline = ({ order }: { order: Order }) => {
  const steps = [
    { status: "pending", label: "Đã đặt hàng", icon: "assignment" },
    { status: "confirmed", label: "Đã xác nhận", icon: "verified" },
    { status: "shipping", label: "Đang giao", icon: "local_shipping" },
    { status: "delivered", label: "Đã giao", icon: "check_circle" },
  ];

  if (order.status === "cancelled") {
    return (
      <div className="bg-red-50 rounded-2xl p-4 border border-red-100 mb-4 flex items-center gap-3">
        <span className="material-symbols-outlined text-red-500">cancel</span>
        <div>
          <p className="text-xs font-bold text-red-700">Đơn hàng đã bị hủy</p>
          <p className="text-[10px] text-red-600 font-medium">Rất tiếc, đơn hàng của bạn đã bị hủy và không thể tiếp tục xử lý.</p>
        </div>
      </div>
    );
  }

  const currentStepIndex = steps.findIndex(s => s.status === order.status);
  
  return (
    <div className="mb-6 space-y-4">
      <div className="relative flex justify-between">
        {/* Progress Line */}
        <div className="absolute top-4 left-[10%] right-[10%] h-0.5 bg-gray-100 -z-0">
          <div 
            className="h-full bg-[#006c49] transition-all duration-500" 
            style={{ width: `${Math.max(0, currentStepIndex) / (steps.length - 1) * 100}%` }}
          />
        </div>

        {steps.map((step, idx) => {
          const isCompleted = currentStepIndex >= idx;
          const isCurrent = currentStepIndex === idx;
          return (
            <div key={step.status} className="relative z-10 flex flex-col items-center gap-2 w-1/4">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                isCompleted 
                  ? "bg-[#006c49] border-[#006c49] text-white shadow-md scale-110" 
                  : "bg-white border-gray-200 text-gray-300"
              }`}>
                <span className={`material-symbols-outlined text-[16px] ${isCurrent ? "animate-pulse" : ""}`}>
                  {step.icon}
                </span>
              </div>
              <p className={`text-[10px] font-bold text-center leading-tight ${
                isCompleted ? "text-[#006c49]" : "text-gray-400"
              }`}>
                {step.label}
              </p>
            </div>
          );
        })}
      </div>

      {/* Tracking Info integrated with timeline */}
      {order.trackingCode && (
        <div className="bg-[#e6f4ea]/40 rounded-xl p-3 border border-[#006c49]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-white flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-[#006c49] text-xl">local_post_office</span>
            </div>
            <div>
              <p className="text-[10px] font-bold text-[#3c4a42]/50 uppercase tracking-wider">Mã vận đơn GHN</p>
              <p className="text-xs font-bold text-[#006c49]">{order.trackingCode}</p>
            </div>
          </div>
          <a
            href={order.trackingUrl || `https://ghn.vn/blogs/trang-thai-don-hang?v=${order.trackingCode}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#006c49] px-4 py-2 text-[10px] font-bold text-white transition hover:opacity-90 shadow-sm w-fit"
          >
            <span className="material-symbols-outlined text-sm">open_in_new</span>
            Tra cứu hành trình thực tế
          </a>
        </div>
      )}
    </div>
  );
};
