# NôngSạch — Product Specification (SPEC)

## Tổng quan

**NôngSạch** là nền tảng thương mại điện tử B2C kết nối trực tiếp nông dân với người tiêu dùng, tập trung vào nông sản sạch, hữu cơ tại Việt Nam.

---

## MVP Scope

### ✅ Trong phạm vi MVP

| Tính năng | Mô tả | Ưu tiên |
|-----------|-------|---------|
| Xem danh sách sản phẩm | Lọc theo danh mục, hữu cơ, tìm kiếm | P0 |
| Xem chi tiết sản phẩm | Ảnh, mô tả, giá, thêm vào giỏ | P0 |
| Giỏ hàng | Thêm/xóa/sửa số lượng, persist local | P0 |
| Đặt hàng | Form đơn giản: tên, SĐT, địa chỉ | P1 |
| Đăng nhập / Đăng ký | Firebase Auth (Email + Google) | P1 |
| Trang chủ | Hero, featured products, categories | P0 |

### ❌ Ngoài phạm vi MVP

- Thanh toán online (VNPay, MoMo, Stripe)
- Dashboard Admin
- Hệ thống đánh giá sản phẩm
- Chat với nông dân
- Multi-vendor marketplace
- Logistics tracking

---

## User Stories

### Người mua (Buyer)

- **US-01**: Là người mua, tôi muốn xem danh sách nông sản để chọn sản phẩm phù hợp.
- **US-02**: Là người mua, tôi muốn lọc theo danh mục (rau, củ, quả...) để tìm nhanh hơn.
- **US-03**: Là người mua, tôi muốn xem chi tiết sản phẩm bao gồm ảnh, giá, nguồn gốc.
- **US-04**: Là người mua, tôi muốn thêm sản phẩm vào giỏ hàng và điều chỉnh số lượng.
- **US-05**: Là người mua, tôi muốn điền form đặt hàng với tên, SĐT và địa chỉ giao hàng.
- **US-06**: Là người mua, tôi muốn đăng ký/đăng nhập để lưu lịch sử đơn hàng.

---

## Dữ liệu Mock (Phase 1)

Giai đoạn 1 sử dụng mock data tĩnh trong `src/data/mockProducts.ts`. Phase 2 chuyển sang Firestore.

### Product Schema

```typescript
interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;       // VND
  unit: string;        // "kg", "bó", "hộp"
  category: ProductCategory;
  imageUrl: string;
  origin: string;
  isOrganic: boolean;
  isFeatured: boolean;
  stock: number;
  rating: number;
  reviewCount: number;
}
```

---

## Non-functional Requirements

- **Performance**: LCP < 2.5s, FID < 100ms
- **SEO**: Mỗi trang có title, meta description, semantic HTML
- **Accessibility**: WCAG 2.1 AA, ARIA labels trên interactive elements
- **Responsive**: Mobile-first, hỗ trợ 320px–1440px
- **Type Safety**: Không dùng `any`, strict TypeScript
