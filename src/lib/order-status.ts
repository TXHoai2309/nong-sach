import { OrderStatus } from "@/types/order";

export const ORDER_STATUS_META: Record<
  OrderStatus,
  { label: string; detail: string; icon: string; tone: string; successTone: string }
> = {
  pending: {
    label: "Chờ xác nhận",
    detail: "Người bán đang kiểm tra và xác nhận đơn hàng của bạn.",
    icon: "hourglass_empty",
    tone: "bg-amber-50 text-amber-700",
    successTone: "text-amber-700",
  },
  confirmed: {
    label: "Đã xác nhận",
    detail: "Đơn hàng đã được người bán xác nhận và đang được chuẩn bị.",
    icon: "inventory_2",
    tone: "bg-blue-50 text-blue-700",
    successTone: "text-blue-700",
  },
  shipping: {
    label: "Đang giao",
    detail: "Đơn hàng đang trên đường giao tới bạn.",
    icon: "local_shipping",
    tone: "bg-purple-50 text-purple-700",
    successTone: "text-purple-700",
  },
  delivered: {
    label: "Đã giao",
    detail: "Đơn hàng đã được giao thành công.",
    icon: "task_alt",
    tone: "bg-[#e6f4ea] text-[#006c49]",
    successTone: "text-[#2e7d32]",
  },
  cancelled: {
    label: "Đã hủy",
    detail: "Đơn hàng đã bị hủy.",
    icon: "cancel",
    tone: "bg-red-50 text-red-700",
    successTone: "text-red-700",
  },
};

export const getOrderStatusMeta = (status: OrderStatus) => ORDER_STATUS_META[status];
