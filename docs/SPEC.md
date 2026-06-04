# 🌿 NôngSạch — Đặc tả Sản phẩm (SPEC)

**Product Specification Document (PRODUCT_SPEC.md)**

| Thông tin         | Chi tiết                                    |
| ----------------- | ------------------------------------------- |
| Tên dự án         | NôngSạch — Nền tảng giao dịch nông sản sạch |
| Phiên bản         | MVP v0.2.0                                  |
| Ngày tạo          | 03/06/2026                                  |
| Cập nhật lần cuối | 03/06/2026                                  |
| Nhóm              | NôngSạch Team                               |
| Môn học           | Vibe Coding Thực Chiến — Buổi 3             |
| Trạng thái        | ✅ Hoàn thành Sprint 1 & Sprint 2            |

---

# 1. Tổng quan sản phẩm

NôngSạch là nền tảng thương mại điện tử B2C kết nối trực tiếp nông dân Việt Nam với người tiêu dùng, tập trung vào nông sản sạch và hữu cơ. Sứ mệnh của nền tảng là loại bỏ các khâu trung gian không cần thiết, giúp người tiêu dùng tiếp cận thực phẩm an toàn với giá hợp lý, đồng thời tăng thu nhập cho nông dân Việt Nam.

## 1.1. Tuyên bố vấn đề

Người tiêu dùng ngày càng lo ngại về an toàn thực phẩm, đặc biệt là rau củ quả. Trong khi đó, nhiều nông dân sản xuất theo tiêu chuẩn VietGAP và hữu cơ nhưng gặp khó khăn tiếp cận người mua trực tiếp. Thị trường phụ thuộc vào chuỗi phân phối nhiều tầng lớp, làm tăng giá thành và giảm độ tươi ngon.

| Vấn đề                                         | Tác động                                          |
| ---------------------------------------------- | ------------------------------------------------- |
| Người tiêu dùng không biết nguồn gốc thực phẩm | Mất niềm tin, lo ngại an toàn thực phẩm           |
| Nhiều tầng trung gian trong chuỗi cung ứng     | Giá cao, chất lượng giảm, nông dân lợi nhuận thấp |
| Thiếu nền tảng chuyên biệt nông sản sạch       | Khó tìm kiếm và so sánh sản phẩm chất lượng       |
| Nông dân khó tiếp cận thị trường online        | Hạn chế tăng trưởng thu nhập, lãng phí sản phẩm   |

## 1.2. Đối tượng người dùng (User Personas)

### Persona 1 — Người mua (Buyer)

* Độ tuổi: 25–45, nữ giới chiếm 65%
* Nghề nghiệp: Nhân viên văn phòng, nội trợ, phụ huynh có con nhỏ
* Vị trí: TP lớn (Hà Nội, TP.HCM, Đà Nẵng)
* Nhu cầu: Mua rau củ quả sạch, biết rõ nguồn gốc, giao hàng tận nhà
* Pain point: Mất thời gian đi chợ, lo ngại thuốc trừ sâu, khó xác định hàng thật

### Persona 2 — Nông dân / Người bán (Phase 2)

* Độ tuổi: 30–55, chủ hộ nông nghiệp
* Vị trí: Đà Lạt, Lâm Đồng, Nghệ An, Bến Tre, Sóc Trăng
* Nhu cầu: Tìm đầu ra ổn định, bán trực tiếp không qua trung gian
* Pain point: Phụ thuộc thương lái, giá bán bấp bênh, không có kênh online

---

# 2. Phạm vi MVP (MVP Scope)

## 2.1. Tính năng trong phạm vi MVP

| ID   | Tính năng          | Mô tả chi tiết                                              | Ưu tiên | Trạng thái |
| ---- | ------------------ | ----------------------------------------------------------- | ------- | ---------- |
| F-01 | Trang chủ          | Hero banner, featured products, danh mục, CTA               | P0      | ✅ Done     |
| F-02 | Danh sách sản phẩm | Grid, tìm kiếm, lọc danh mục, sắp xếp theo giá/tên          | P0      | ✅ Done     |
| F-03 | Chi tiết sản phẩm  | Ảnh, tên, giá VND, nguồn gốc, tồn kho, mô tả, thêm giỏ hàng | P0      | ✅ Done     |
| F-04 | Giỏ hàng           | Thêm/xóa/sửa số lượng, tổng tiền, persist localStorage      | P0      | ✅ Done     |
| F-05 | Checkout           | Form nhập thông tin, validate, tạo mã đơn NS+timestamp      | P1      | ✅ Done     |
| F-06 | Đăng ký            | Form email+pass, validate, lưu local Zustand persist        | P1      | ✅ Done     |
| F-07 | Đăng nhập          | Xác thực local, lưu phiên localStorage                      | P1      | ✅ Done     |
| F-08 | Trang Giới thiệu   | Brand story, sứ mệnh, tầm nhìn, 4 giá trị cốt lõi           | P2      | ✅ Done     |

## 2.2. Ngoài phạm vi MVP

* Thanh toán online (VNPay, MoMo, ZaloPay, Stripe)
* Dashboard quản trị Admin
* Hệ thống đánh giá và nhận xét sản phẩm
* Chat trực tiếp với nông dân
* Multi-vendor marketplace
* Theo dõi trạng thái giao hàng real-time
* AI gợi ý sản phẩm cá nhân hóa
* Ví điện tử và tích điểm thưởng

---

# 3. User Stories & Acceptance Criteria

## 3.1. Khám phá sản phẩm

### US-01: Xem trang chủ

**Là** người mua, **tôi muốn** xem trang chủ hấp dẫn, **để** có ấn tượng tốt và biết nền tảng cung cấp gì.

#### Acceptance Criteria

* Trang hiển thị Hero section với tiêu đề, mô tả và 2 nút CTA
* Hiển thị tối thiểu 4 sản phẩm nổi bật (Featured Products)
* Hiển thị 6 danh mục sản phẩm với emoji và gradient màu sắc
* Trang load LCP < 2.5 giây, responsive trên mobile 320px+

### US-02: Xem danh sách & tìm kiếm sản phẩm

**Là** người mua, **tôi muốn** tìm kiếm và lọc nông sản, **để** nhanh chóng tìm được sản phẩm phù hợp.

#### Acceptance Criteria

* Grid 3 cột desktop / 2 tablet / 1 mobile
* Search input lọc real-time theo tên sản phẩm
* Dropdown lọc: Tất cả / Rau củ / Trái cây / Ngũ cốc / Củ quả / Thảo mộc
* Sort: Tên A-Z, Giá tăng dần, Giá giảm dần
* Hiển thị "X / Y sản phẩm" sau khi filter

### US-03: Xem chi tiết sản phẩm

**Là** người mua, **tôi muốn** xem đầy đủ thông tin sản phẩm, **để** quyết định có mua hay không.

#### Acceptance Criteria

* URL động: `/products/[id]`
* Hiển thị ảnh lớn, tên, giá VND, nguồn gốc, số tồn kho, mô tả
* Badge "Hữu cơ" nếu `isOrganic = true`
* Bộ chọn qty không vượt stock
* Nút "Thêm vào giỏ" cập nhật cart badge ngay lập tức

## 3.2. Giỏ hàng & Thanh toán

### US-04: Quản lý giỏ hàng

**Là** người mua, **tôi muốn** quản lý giỏ hàng, **để** kiểm soát đơn hàng trước khi mua.

#### Acceptance Criteria

* Danh sách item: ảnh thumbnail, tên, giá đơn vị, qty, thành tiền
* Tăng/giảm qty, xóa từng item, xóa toàn bộ
* Tổng tiền tự động cập nhật khi thay đổi qty
* Persist sau F5 (Zustand persist → localStorage)
* Cart badge trên Header hiển thị tổng số lượng

### US-05: Đặt hàng (Checkout)

**Là** người mua, **tôi muốn** điền form đặt hàng, **để** nhận hàng tại địa chỉ mong muốn.

#### Acceptance Criteria

* Form: Họ và tên (*), SĐT (*), Địa chỉ giao hàng (*), Ghi chú
* Validate tên >= 2 ký tự
* SĐT 10 số bắt đầu 0
* Địa chỉ >= 5 ký tự
* Sidebar tóm tắt đơn hàng
* Sau đặt hàng: success screen với mã NS+timestamp, xóa giỏ hàng

### US-06 & US-07: Đăng ký / Đăng nhập

**Là** người dùng, **tôi muốn** tạo và đăng nhập tài khoản, **để** lưu lịch sử và cá nhân hóa trải nghiệm.

#### Acceptance Criteria

* Đăng ký: Họ tên, Email, Mật khẩu, Xác nhận mật khẩu
* Đăng nhập: Email + Mật khẩu
* Header hiển thị tên user + nút Đăng xuất
* Phiên đăng nhập persist sau F5

---

# 4. Data Schema

## 4.1. Product Interface

```ts
interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  image: string;
  description: string;
  origin: string;
  stock: number;
  isOrganic?: boolean;
  isFeatured?: boolean;
  unit?: string;
}
```

## 4.2. CartItem Interface

```ts
interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  stock: number;
}
```

## 4.3. Order Interface

```ts
interface Order {
  orderId: string;
  customerName: string;
  phone: string;
  address: string;
  note?: string;
  items: CartItem[];
  total: number;
  createdAt: Date;
}
```

---

# 5. Danh mục sản phẩm Mock

| ID | Tên sản phẩm      | Danh mục | Giá VND/kg | Nguồn gốc | Stock |
| -- | ----------------- | -------- | ---------- | --------- | ----- |
| 1  | Rau cải sạch      | Rau củ   | 15.000     | Đà Lạt    | 80    |
| 2  | Cà chua hữu cơ    | Rau củ   | 32.000     | Lâm Đồng  | 50    |
| 3  | Xà lách thủy canh | Rau củ   | 20.000     | TP.HCM    | 60    |
| 4  | Cam Vinh          | Trái cây | 48.000     | Nghệ An   | 100   |
| 5  | Bưởi da xanh      | Trái cây | 65.000     | Bến Tre   | 40    |
| 6  | Gạo ST25          | Ngũ cốc  | 42.000     | Sóc Trăng | 200   |
| 7  | Khoai lang tím    | Củ quả   | 28.000     | Vĩnh Long | 70    |
| 8  | Rau húng quế      | Thảo mộc | 12.000     | Đà Lạt    | 30    |

---

# 6. Yêu cầu phi chức năng

| Chỉ số     | Mục tiêu            | Phương pháp đo      |
| ---------- | ------------------- | ------------------- |
| LCP        | < 2.5 giây          | Lighthouse          |
| FID        | < 100ms             | Chrome DevTools     |
| CLS        | < 0.1               | Lighthouse audit    |
| Bundle JS  | < 200KB gzipped     | next build analyzer |
| Responsive | 320px – 1440px      | Responsive mode     |
| TypeScript | Zero compile errors | tsc --noEmit        |
| WCAG       | 2.1 AA              | axe DevTools        |

---

# 7. Product Backlog

## Sprint 1 — MVP Foundation (✅ Hoàn thành)

| ID   | Task                                        | SP | Status |
| ---- | ------------------------------------------- | -- | ------ |
| T-01 | Khởi tạo Next.js + TypeScript + Tailwind v4 | 2  | ✅      |
| T-02 | TypeScript interfaces đầy đủ                | 1  | ✅      |
| T-03 | Mock data 8 sản phẩm đa danh mục            | 1  | ✅      |
| T-04 | Header: sticky, mobile menu, cart badge     | 3  | ✅      |
| T-05 | Footer: links, contact, social              | 2  | ✅      |
| T-06 | Trang chủ: Hero, Features, Categories, CTA  | 4  | ✅      |
| T-07 | Trang Products: grid, search, filter, sort  | 4  | ✅      |
| T-08 | Cart store Zustand với persist              | 2  | ✅      |

## Sprint 2 — Core Features (✅ Hoàn thành)

| ID   | Task                                           | SP | Status |
| ---- | ---------------------------------------------- | -- | ------ |
| T-09 | Product Detail page (/products/[id])           | 3  | ✅      |
| T-10 | AddToCartButton với qty selector + stock guard | 2  | ✅      |
| T-11 | Cart page quản lý đầy đủ                       | 3  | ✅      |
| T-12 | Checkout: form, validate, order confirmation   | 4  | ✅      |
| T-13 | Auth store + Đăng nhập / Đăng ký local         | 4  | ✅      |
| T-14 | Header đồng bộ auth state                      | 2  | ✅      |
| T-15 | About page                                     | 2  | ✅      |

## Backlog Phase 2 (Tương lai)

| ID    | Tính năng          | Mô tả                                   | Priority |
| ----- | ------------------ | --------------------------------------- | -------- |
| P2-01 | Firebase Firestore | Migrate mock data sang Cloud Firestore  | High     |
| P2-02 | Firebase Auth thật | Google OAuth + email thực tế            | High     |
| P2-03 | Thanh toán VNPay   | Tích hợp cổng thanh toán VNPay sandbox  | Medium   |
| P2-04 | Đánh giá sản phẩm  | Rating 5 sao + review text              | Medium   |
| P2-05 | Dashboard Admin    | Quản lý sản phẩm, đơn hàng, users       | Medium   |
| P2-06 | Order Tracking     | Theo dõi trạng thái giao hàng real-time | Low      |
