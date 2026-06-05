export interface ShopReport {
  id: string;
  shopId: string;
  shopName: string;
  reporterId?: string;
  reporterName?: string;
  reason: string;
  details?: string;
  status: 'pending' | 'resolved' | 'dismissed';
  createdAt: string;
}

export const REPORT_REASONS = [
  "Sản phẩm không đúng mô tả",
  "Giá cả bất hợp lý",
  "Có dấu hiệu lừa đảo",
  "Thái độ phục vụ kém",
  "Kinh doanh hàng cấm/hàng giả",
  "Lý do khác"
];
