# Changelog

Tất cả thay đổi đáng kể của dự án được ghi lại tại đây.

Format: [Semantic Versioning](https://semver.org/lang/vi/)
Chuẩn: [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)

---

## [0.2.0] — 2026-06-03

### Thêm mới
- **Trang Chi tiết sản phẩm**: Tạo trang động `/products/[id]` kết hợp component `ProductDetail` hiển thị hình ảnh, giá tiền VND, nguồn gốc, lượng tồn kho, mô tả và nút thêm giỏ hàng có bộ chọn số lượng.
- **Giỏ hàng Local Zustand**: 
  - Tạo store `cart-store.ts` với đầy đủ các action thêm, bớt, tăng, giảm, dọn sạch giỏ và tính tổng số lượng, tổng tiền.
  - Định nghĩa type `CartItem` mới tại `src/types/cart.ts` gồm `productId`, `name`, `price`, `image`, `quantity`, `stock`.
- **Trang Đặt hàng (Checkout)**:
  - Tạo trang `/checkout` với giao diện chia 2 cột trên máy tính và hiển thị tóm tắt đơn hàng.
  - Tích hợp form nhập thông tin (Họ tên, SĐT, Địa chỉ, Ghi chú) có validate dữ liệu đầu vào.
  - Đặt hàng thành công tạo mã đơn hàng dạng `NS` + timestamp, đồng thời tự động dọn sạch giỏ hàng.
- **Xác thực người dùng (Auth)**:
  - Tạo trang Đăng nhập (`/login`) và Đăng ký (`/register`) mô phỏng xác thực cục bộ.
  - Tạo store `auth-store.ts` có chức năng đăng nhập, đăng ký tài khoản mới và lưu trữ phiên hoạt động cục bộ bằng `localStorage`.
- **Trang Giới thiệu**: Tạo trang `/about` trình bày Câu chuyện thương hiệu, Sứ mệnh & Tầm nhìn, và 4 Giá trị cốt lõi của NôngSạch.

### Cập nhật
- **Header**: Đồng bộ hóa trạng thái tài khoản. Hiển thị lời chào và nút "Đăng xuất" khi đã đăng nhập, thay đổi linh hoạt giữa các trạng thái.
- **Cart Page**: Cập nhật liên kết nút "Đặt hàng" trực tiếp sang trang `/checkout` thay vì hiển thị thông báo alert.

---

## [0.1.0] — 2026-06-03

### Khởi tạo dự án (Task 1 — MVP Setup)

#### Thêm mới
- Khởi tạo Next.js App Router với TypeScript + Tailwind CSS v4
- Cài đặt Firebase SDK và Zustand
- `src/types/index.ts` — TypeScript interfaces: `Product`, `CartItem`, `OrderForm`, `UserProfile`
- `src/data/mockProducts.ts` — 12 sản phẩm nông sản mock với đầy đủ dữ liệu
- `src/lib/firebase.ts` — Firebase singleton initialization (Auth + Firestore)
- `src/components/layout/Header.tsx` — Sticky header, mobile menu, cart badge
- `src/components/layout/Footer.tsx` — Footer với links, social media, contact
- `src/components/layout/Container.tsx` — Responsive max-width wrapper
- `src/components/product/ProductCard.tsx` — Card sản phẩm với ảnh, badge, rating, add-to-cart
- `src/components/product/ProductGrid.tsx` — Grid responsive với empty state
- `src/components/ui/Badge.tsx` — Badge và CategoryBadge components
- `src/app/layout.tsx` — Root layout với Be Vietnam Pro font, SEO metadata
- `src/app/page.tsx` — Home page: Hero, Features, Categories, Featured Products, CTA
- `src/app/products/page.tsx` — Products page với search, filter, sort
- `src/app/globals.css` — Custom scrollbar, smooth scroll, focus ring
- `docs/SPEC.md` — Product specification
- `docs/ARCHITECTURE.md` — Architecture document
- `docs/CHANGELOG.md` — File này
- `.env.example` — Template biến môi trường Firebase
- `README.md` — Hướng dẫn cài đặt và chạy project
