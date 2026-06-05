export interface Report {
  id: string;
  shopId?: string;
  shopName?: string;
  productId?: string;
  productName?: string;
  reporterId?: string;
  reporterName?: string;
  reason: string;
  details?: string;
  status: 'pending' | 'resolved' | 'dismissed';
  createdAt: string;
  type: 'shop' | 'product';
}

export type ShopReport = Report & { type: 'shop'; shopId: string; shopName: string };
export type ProductReport = Report & { type: 'product'; productId: string; productName: string };

export const REPORT_REASONS = [
  "Sản phẩm không đúng mô tả",
  "Giá cả bất hợp lý",
  "Có dấu hiệu lừa đảo",
  "Thái độ phục vụ kém",
  "Kinh doanh hàng cấm/hàng giả",
  "Lý do khác"
];
