/**
 * Định dạng số tiền thành chuỗi tiền tệ VND (đ).
 * Ví dụ: 15000 -> "15.000 đ" hoặc "15.000 ₫" tùy định dạng chuẩn.
 * Theo yêu cầu: "Định dạng VND". Hãy trả về định dạng giống Intl hoặc chuẩn vi-VN.
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
}
