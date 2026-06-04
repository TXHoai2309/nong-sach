# 🌿 NôngSạch — Đặc tả Sản phẩm (SPEC)

**Product Specification Document (PRODUCT_SPEC.md)**

| Thông tin         | Chi tiết                                    |
| ----------------- | ------------------------------------------- |
| Tên dự án         | NôngSạch — Nền tảng giao dịch nông sản sạch |
| Phiên bản         | MVP v0.3.6                                  |
| Ngày tạo          | 03/06/2026                                  |
| Cập nhật lần cuối | 04/06/2026                                  |
| Nhóm              | NôngSạch Team                               |
| Môn học           | Vibe Coding Thực Chiến — Buổi 3             |
| Trạng thái        | ✅ Hoàn thành Sprint 1, Sprint 2 & Sprint 3  |

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
| F-03 | Chi tiết sản phẩm  | Dữ liệu động, gallery, tabs, related products, thêm giỏ hàng | P0      | ✅ Done     |
| F-04 | Giỏ hàng           | Thêm/xóa/sửa số lượng, tổng tiền, persist localStorage      | P0      | ✅ Done     |
| F-05 | Checkout           | Form nhập thông tin, validate, tạo mã đơn NS+timestamp      | P1      | ✅ Done     |
| F-06 | Đăng ký            | Form email+pass, validate, lưu local Zustand persist        | P1      | ✅ Done     |
| F-07 | Đăng nhập          | Xác thực local, lưu phiên localStorage                      | P1      | ✅ Done     |
| F-08 | Trang Giới thiệu   | Brand story, sứ mệnh, tầm nhìn, 4 giá trị cốt lõi           | P2      | ✅ Done     |
| F-09 | Trang Liên hệ      | Form liên hệ, thông tin hỗ trợ, bản đồ, newsletter          | P2      | ✅ Done     |

> **Ghi chú cho team:** F-09 hiện đã có giao diện hoàn chỉnh theo Stitch HTML tại route `/contact`. Form liên hệ đang ở mức UI/UX MVP; nếu cần gửi dữ liệu thật, cần bổ sung API/Firebase handler ở Phase 2.

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
* Hiển thị dữ liệu thật theo từng sản phẩm: ảnh, tên, giá VND, nguồn gốc, số tồn kho, mô tả
* Ảnh chính lấy từ `product.image`; không hard-code ảnh cà chua cho mọi sản phẩm
* Gallery có 4 ảnh: ảnh sản phẩm thật + ảnh phụ theo `product.category`
* Breadcrumb nhiều cấp: `Trang chủ > Cửa hàng > Danh mục > Tên sản phẩm`
* Badge "Hữu cơ" nếu `isOrganic = true`
* Bộ chọn qty không vượt stock
* Nút "Thêm vào giỏ" thêm đúng số lượng đã chọn và cập nhật cart badge
* Nút "Mua ngay" thêm sản phẩm vào giỏ và chuyển sang `/checkout`
* Có tabs: Mô tả, Thông tin, Đánh giá
* Có section "Sản phẩm tương tự" lấy từ data sản phẩm thật

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

#### Checkout Address API

* Trang `/checkout` lấy danh sách `Tỉnh / Thành phố` và `Quận / Huyện` từ API `https://provinces.open-api.vn/api/v1/?depth=2`
* API `depth=2` chỉ cung cấp 2 cấp hành chính: tỉnh/thành phố và quận/huyện; chưa dùng phường/xã trong MVP
* Khi API lỗi mạng, checkout dùng fallback tối thiểu gồm TP.HCM, Hà Nội và Đà Nẵng để người dùng vẫn có thể đặt hàng
* Validate bắt buộc người dùng chọn đủ tỉnh/thành phố và quận/huyện trước khi submit
* Layout checkout dùng width explicit và spacing nhỏ để tránh lỗi Tailwind v4 custom spacing làm body bị phình to

> **Comment cho đồng nghiệp:** Nếu cần thêm phường/xã, đổi API sang `depth=3` và bổ sung state `wardCode`. Không hard-code tỉnh/quận trong UI nữa vì hiện đã có nguồn dữ liệu động từ `provinces.open-api.vn`.

### US-06 & US-07: Đăng ký / Đăng nhập

**Là** người dùng, **tôi muốn** tạo và đăng nhập tài khoản, **để** lưu lịch sử và cá nhân hóa trải nghiệm.

#### Acceptance Criteria

* Đăng ký: Họ tên, Email, Mật khẩu, Xác nhận mật khẩu
* Đăng nhập: Email + Mật khẩu
* Header hiển thị tên user + nút Đăng xuất
* Phiên đăng nhập persist sau F5

### US-07B: Quản lý tài khoản (Trang cá nhân)

**Là** người dùng đã đăng nhập, **tôi muốn** có một trang cá nhân quản lý thông tin tài khoản, **để** cập nhật dữ liệu cá nhân, theo dõi lịch sử đơn hàng, quản lý địa chỉ giao hàng và đổi mật khẩu.

#### Acceptance Criteria

* URL `/profile` (Redirect về `/login` nếu chưa đăng nhập)
* Bố cục 2 cột (Desktop) và xếp chồng responsive (Mobile):
  * **Sidebar**: Hiển thị Avatar tính từ chữ cái đầu của tên, họ tên, email, nhãn thành viên (Thành viên từ [tháng/năm]), menu điều hướng các tab và nút Đăng xuất.
  * **Tab 1: Thông tin cá nhân**: Cho phép sửa Họ tên, Số điện thoại, Ngày sinh, Giới tính. Email ở trạng thái chỉ đọc. Nút lưu thay đổi hoạt động tốt.
  * **Tab 2: Đơn hàng của tôi**:
    - Hiển thị danh sách đơn hàng đã mua từ tài khoản của người dùng.
    - Bộ lọc trạng thái đơn hàng: Tất cả, Đang xử lý, Hoàn thành.
    - Mỗi đơn hàng hiển thị mã, ngày đặt, trạng thái, ảnh sản phẩm, số lượng, tổng tiền.
    - Nút "Xem chi tiết" mở rộng xem thông tin người nhận, địa chỉ cụ thể, danh sách chi tiết các mặt hàng.
    - Nút **"Mua lại"** tự động thêm tất cả sản phẩm của đơn hàng đó vào giỏ hàng và chuyển hướng tới `/cart`.
  * **Tab 3: Địa chỉ giao hàng**:
    - Hiển thị danh sách sổ địa chỉ nhận hàng, có nhãn "MẶC ĐỊNH" cho địa chỉ chính.
    - Biểu mẫu Thêm/Sửa địa chỉ: họ tên, SĐT, địa chỉ cụ thể, chọn Tỉnh/Thành phố và Quận/Huyện động từ API (fallback giống trang Checkout).
    - Cho phép đặt địa chỉ làm mặc định hoặc xóa địa chỉ (nếu có nhiều hơn 1 địa chỉ).
  * **Tab 4: Đổi mật khẩu**:
    - Ô nhập: Mật khẩu hiện tại, Mật khẩu mới, Xác nhận mật khẩu mới.
    - Tích hợp thanh đánh giá độ mạnh của mật khẩu (Yếu, Trung bình, Mạnh) bằng màu sắc.
    - Kiểm tra mật khẩu hiện tại khớp với tài khoản trong kho lưu trữ trước khi đổi.
  * **Tab 5: Thông báo**: Hiển thị danh sách thông báo hệ thống và đơn hàng.
* Đồng bộ hóa: Khi đặt hàng thành công tại `/checkout`, đơn hàng mới sẽ tự động được thêm vào lịch sử đơn hàng trên trang cá nhân.

## 3.2.1. Navigation & Breadcrumb

### US-NAV: Điều hướng thống nhất toàn site

**Là** người dùng, **tôi muốn** biết mình đang ở đâu trong website, **để** quay lại các trang cha nhanh hơn.

#### Acceptance Criteria

* Header chỉ có một entry tới khu sản phẩm: `Cửa hàng`
* Không hiển thị đồng thời `Sản phẩm` và `Cửa hàng` nếu cùng trỏ tới `/products`
* `Cửa hàng` active khi ở `/products` hoặc `/products/[id]`
* Các page chính có breadcrumb:
  * `/`
  * `/products`
  * `/products/[id]`
  * `/about`
  * `/contact`
  * `/cart`
  * `/checkout`
  * `/login`
  * `/register`
* Breadcrumb item cuối là text hiện tại, không phải link
* Breadcrumb sử dụng style chung `.breadcrumb-bar` và nằm trong `.site-container` để không bị lệch ngang giữa các trang.
* Các page chính dùng chuẩn content width `1120px`; không tự đặt nhiều `max-w` khác nhau trừ khi là card/form nhỏ bên trong.
* UI có hiệu ứng nhẹ: page enter, reveal up và card hover; phải tôn trọng `prefers-reduced-motion`.

## 3.3. Thông tin thương hiệu & hỗ trợ khách hàng

### US-08: Xem trang giới thiệu

**Là** người mua, **tôi muốn** tìm hiểu câu chuyện và giá trị của NôngSạch, **để** tăng niềm tin trước khi mua hàng.

#### Acceptance Criteria

* URL `/about`
* Hiển thị hero full-width theo mẫu Stitch
* Có section câu chuyện thương hiệu, thống kê, giá trị cốt lõi, đội ngũ sáng lập và CTA
* Hình ảnh không dùng screenshot toàn trang; dùng ảnh riêng cho hero/story/team
* Responsive trên desktop, tablet và mobile

### US-09: Gửi liên hệ / yêu cầu hỗ trợ

**Là** khách hàng, **tôi muốn** gửi thông tin liên hệ cho NôngSạch, **để** được hỗ trợ về đặt hàng, khiếu nại hoặc hợp tác.

#### Acceptance Criteria

* URL `/contact`
* Header link `Liên hệ` trỏ đúng route `/contact` và có active state
* Hiển thị breadcrumb: `Trang chủ > Liên hệ`
* Form gồm: Họ tên, Email, Số điện thoại, Chủ đề, Nội dung
* Chủ đề có các lựa chọn: Đặt hàng, Khiếu nại, Hợp tác, Khác
* Có nút CTA `Gửi tin nhắn`
* Có card thông tin liên hệ gồm địa chỉ, hotline, email, giờ làm việc
* Có map placeholder và newsletter section theo mẫu Stitch
* Footer có link `Liên hệ` trỏ về `/contact`
* Responsive: desktop 2 cột form/info, mobile xếp dọc
* Layout contact dùng width explicit thay vì `max-w-md` để tránh conflict Tailwind v4 custom spacing token
* Body/form/newsletter được thu gọn để không bị phình trên desktop

> **Comment cho đồng nghiệp:** Trang `/contact` hiện chưa persist/submission dữ liệu. Khi làm tiếp, ưu tiên thêm `POST /api/contact` hoặc Firebase collection `contactMessages`, validate input và hiển thị trạng thái gửi thành công/thất bại.

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

## 4.4. ContactMessage Interface (Phase 2)

```ts
type ContactSubject = "order" | "complaint" | "cooperate" | "other";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: ContactSubject;
  content: string;
  status: "new" | "read" | "resolved";
  createdAt: Date;
}
```

> **Ghi chú triển khai:** Interface này là đề xuất cho backend/Firebase sau MVP. UI `/contact` đã sẵn form fields tương ứng nhưng chưa ghi dữ liệu.

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

## Sprint 3 — UI Stitch Conversion & Support Page (✅ Hoàn thành)

| ID   | Task                                           | SP | Status |
| ---- | ---------------------------------------------- | -- | ------ |
| T-16 | Redesign Home theo Stitch/Material Design 3    | 4  | ✅      |
| T-17 | Convert About page theo Stitch HTML            | 3  | ✅      |
| T-18 | Thêm Contact page `/contact` theo Stitch HTML  | 3  | ✅      |
| T-19 | Header/Footer cập nhật route và active state   | 2  | ✅      |
| T-20 | Cấu hình remote images + Webpack build fallback| 1  | ✅      |
| T-21 | Product detail dynamic data + compact layout   | 3  | ✅      |
| T-22 | Breadcrumb component + coverage toàn site      | 2  | ✅      |
| T-23 | Header cleanup + contact layout compact fix    | 1  | ✅      |
| T-24 | Checkout compact layout + Province API          | 2  | ✅      |
| T-25 | Account Profile Dashboard page                 | 3  | ✅      |

## Backlog Phase 2 (Tương lai)

| ID    | Tính năng          | Mô tả                                   | Priority |
| ----- | ------------------ | --------------------------------------- | -------- |
| P2-01 | Firebase Firestore | Migrate mock data sang Cloud Firestore  | High     |
| P2-02 | Firebase Auth thật | Google OAuth + email thực tế            | High     |
| P2-03 | Thanh toán VNPay   | Tích hợp cổng thanh toán VNPay sandbox  | Medium   |
| P2-04 | Đánh giá sản phẩm  | Rating 5 sao + review text              | Medium   |
| P2-05 | Dashboard Admin    | Quản lý sản phẩm, đơn hàng, users       | Medium   |
| P2-06 | Order Tracking     | Theo dõi trạng thái giao hàng real-time | Low      |
| P2-07 | Contact Backend    | Lưu/gửi form liên hệ qua API/Firebase   | Medium   |
