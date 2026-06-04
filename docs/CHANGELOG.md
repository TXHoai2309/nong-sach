# Changelog

All notable changes to the **NôngSạch** project will be documented in this file.

The format is based on **Keep a Changelog** and this project adheres to **Semantic Versioning**.

---

## [0.3.7] - 2026-06-04

### Sprint 3.7 — Redesign Success Page từ Screenshot & Tích hợp Local Storage

### Added

#### `src/app/checkout/success/page.tsx`

* Thiết kế lại hoàn toàn trang thông báo đặt hàng thành công theo mẫu screenshot:
  * Hiển thị dấu tích tròn xanh lá lớn ở trên cùng.
  * Hiển thị tiêu đề xanh lá cây `Đặt hàng thành công! 🎉` cùng dòng cảm ơn/trạng thái.
  * Thiết kế capsule badge chứa mã đơn hàng có nút **Sao chép (Copy to clipboard)** tương tác động.
  * Thiết kế lại bảng thông tin đơn hàng chia thành 2 cột:
    * Cột trái: Trạng thái (Đang chuẩn bị), Giao hàng dự kiến (14:00 - 16:00 hôm nay), Thanh toán (Tên phương thức động), Địa chỉ nhận hàng. Các mục đi kèm biểu tượng Material Icons tương ứng.
    * Cột phải: Danh sách sản phẩm chi tiết đã mua (ảnh, tên, số lượng dạng xQ, tổng tiền của sản phẩm đó) cùng dòng Tổng cộng thanh toán.
  * Thêm thanh tiến trình đơn hàng (Timeline Stepper) gồm 4 bước: Đặt hàng (Active xanh lá), Đóng gói, Đang giao, Đã nhận.
  * Thêm banner thông báo Zalo/Hotline hỗ trợ có nút tương tác bật thông báo và ẩn/hiện.
  * Thêm nút hành động "Theo dõi đơn hàng" và "Tiếp tục mua sắm".
  * Hỗ trợ nút tải hóa đơn PDF thực tế bằng cách gọi lệnh `window.print()` của trình duyệt.
  * Thêm danh sách gợi ý mua sắm "Bạn có thể thích" chứa 4 sản phẩm ngẫu nhiên từ cơ sở dữ liệu (đã lọc các sản phẩm vừa mua), có khả năng nhấp chuột chuyển hướng tới trang chi tiết sản phẩm thật.

---

### Changed

#### `src/app/checkout/page.tsx`

* Tích hợp lưu trữ thông tin đơn hàng đầy đủ (bao gồm cả danh sách các sản phẩm và số lượng) vào `localStorage` với khóa `nong-sach-last-order` trước khi dọn giỏ hàng và chuyển hướng, giúp trang thành công hiển thị được chi tiết danh sách sản phẩm.

---

### Fixed

#### `src/app/checkout/success/page.tsx`

* Sửa lỗi vỡ giao diện phần mô tả và stepper thanh tiến trình (text bị co cụm thành hàng dọc 40px và stepper bị co cụm thành 64px) do conflict giữa custom spacing của Tailwind v4 và các class `max-w-lg` / `max-w-xl`. Đổi các class này thành explicit width `max-w-[480px]` và `max-w-[520px]`.

---

## [0.3.6] - 2026-06-04

### Sprint 3.6 — Redesign Cart Page từ Stitch HTML / Screenshot

### Added

* Hỗ trợ tìm mã giảm giá và áp dụng mã giảm giá động (ví dụ: nhập mã `NONGSACK` để được giảm ngay 15.000₫).

---

### Changed

#### `src/app/cart/page.tsx`

* Thiết kế lại hoàn toàn giao diện giỏ hàng để khớp với và đáp ứng tất cả các yêu cầu từ ảnh chụp màn hình:
  * Đổi tiêu đề thành màu xanh `text-primary` "Giỏ hàng của bạn" kèm badge số lượng sản phẩm bên cạnh.
  * Thiết kế lại các card sản phẩm:
    * Thêm badge xuất xứ (ví dụ: ĐÀ LẠT, TIỀN GIANG, LÂM ĐỒNG) đồng bộ màu sắc riêng bằng cách tra cứu dữ liệu gốc.
    * Thêm thông báo cảnh báo nếu số lượng tồn kho thấp (`⚠️ Chỉ còn X sản phẩm`).
    * Thay đổi bộ chọn số lượng thành pill-shaped select với các nút tăng/giảm và số lượng hiển thị ngang.
    * Đặt nút xóa (dấu X) ở góc trên bên phải mỗi card sản phẩm.
  * Tái cấu trúc phần chân trang:
    * Link "Tiếp tục mua sắm" nằm ở góc trái dưới danh sách sản phẩm.
    * Khung nhập mã giảm giá và nút "Áp dụng" nằm ở góc phải dưới danh sách sản phẩm.
  * Thiết kế lại sidebar tóm tắt đơn hàng:
    * Sử dụng nền màu xanh dương nhạt `#f0f3ff` và bo góc tròn `rounded-[2rem]`.
    * Hiển thị dòng Giảm giá và tổng tiền sau giảm.
    * Thêm các nhãn uy tín/trust badges dưới nút checkout (Thanh toán an toàn, Đổi trả 7 ngày, Giao trong ngày).
    * Thêm hộp thoại thông tin liên hệ hỗ trợ Zalo/Hotline ở góc dưới sidebar.

---

## [0.3.5] - 2026-06-04

### Sprint 3.5 — Checkout Compact Layout & Province API

### Changed

#### `src/app/checkout/page.tsx`

* Thu gọn layout trang `/checkout` để body không còn bị phình quá lớn trên desktop:
  * Dùng width explicit `max-w-[1040px]`
  * Chuyển form + summary sang grid `lg:grid-cols-[1fr_360px]`
  * Giảm padding, gap, kích thước card, input, stepper và ảnh sản phẩm trong order summary
* Thay danh sách tỉnh/thành phố hard-code bằng API `https://provinces.open-api.vn/api/v1/?depth=2`
* Select địa chỉ hiện hỗ trợ 2 cấp theo API: `Tỉnh / Thành phố` và `Quận / Huyện`
* Tự chọn mặc định `Thành phố Hồ Chí Minh` nếu API trả dữ liệu thành công
* Thêm fallback dữ liệu địa phương cơ bản để checkout vẫn dùng được khi API lỗi mạng
* Validate thêm `Tỉnh / Thành phố` và `Quận / Huyện` trước khi đặt hàng
* Chuẩn hóa lại text tiếng Việt trong checkout để tránh lỗi encoding ở UI

### Verified

* `npm.cmd run build` — pass
* `npx.cmd tsc --noEmit --incremental false` — pass

---

## [0.3.4] - 2026-06-04

### Sprint 3.4 — Redesign Checkout Page & Success Page từ Stitch HTML

### Added

#### `src/app/checkout/success/page.tsx`

* Thêm trang thông báo đặt hàng thành công mới `/checkout/success`
* Đọc thông tin đơn hàng (mã đơn, người nhận, số điện thoại, địa chỉ, tổng tiền, phương thức thanh toán) từ query parameters
* Bọc phần đọc Search Params trong `<Suspense>` để tránh lỗi Hydration / Static generation của Next.js
* Giao diện Material Design 3 đẹp mắt, nút tiếp tục mua sắm trỏ về `/products`

---

### Changed

#### `src/app/checkout/page.tsx`

* Chuyển đổi hoàn toàn trang `/checkout` sang **Next.js App Router Client Component** theo giao diện mẫu từ `stitch-checkout.html`
* Đồng bộ dữ liệu:
  * Đọc `currentUser` từ `useAuthStore` để tự động điền (pre-fill) thông tin Họ tên và Email
  * Đọc giỏ hàng thực tế từ `useCartStore` để hiển thị tóm tắt đơn hàng và tính tổng giá
  * Gọi `clearCart()` để dọn sạch giỏ hàng khi người dùng đặt hàng thành công
* Tích hợp tính năng và tương tác:
  * Tự động thay đổi danh sách Quận/Huyện dựa trên Tỉnh/Thành phố được chọn (Hồ Chí Minh, Hà Nội, Đà Nẵng)
  * Tính toán phí vận chuyển và tổng tiền động dựa trên phương thức giao hàng: Standard / Fast (+15.000₫) / Pickup
  * Hiển thị bảng chi tiết chuyển khoản Vietcombank khi chọn phương thức "Chuyển khoản ngân hàng"
  * Validate chi tiết: Họ tên (>= 2 ký tự), SĐT (10 số bắt đầu bằng 0), Email (đúng định dạng), Địa chỉ cụ thể (>= 5 ký tự)
  * Thêm màn hình trống (Empty state) lịch sự khi giỏ hàng chưa có sản phẩm

---

## [0.3.3] - 2026-06-04

### Sprint 3.3 — Product Detail Data Sync, Breadcrumbs & Layout Refinement

### Added

#### `src/components/layout/Breadcrumb.tsx`

* Thêm component breadcrumb dùng chung cho toàn bộ app
* Hỗ trợ item có `href` và item cuối không link
* Dùng Material Symbols `chevron_right` để đồng bộ ngôn ngữ UI hiện tại

---

### Changed

#### `src/components/product/ProductDetail.tsx`

* Convert lại product detail theo Stitch HTML nhưng vẫn bám dữ liệu thật từ `src/data/products.ts`
* Sửa lỗi mọi sản phẩm đều hiển thị ảnh/gallery cà chua:
  * Ảnh chính lấy từ `product.image`
  * Tên, giá, mô tả, danh mục, nguồn gốc, tồn kho lấy từ `product`
  * Related products lấy `item.image` thật của từng sản phẩm
* Thêm gallery 4 ảnh:
  * Ảnh đầu là ảnh thật của sản phẩm
  * 3 ảnh còn lại lấy theo `product.category` để đẹp hơn nhưng vẫn đúng nhóm sản phẩm
* Giữ tương tác client-side:
  * Đổi ảnh thumbnail
  * Tăng/giảm số lượng
  * Add-to-cart theo số lượng đã chọn
  * Mua ngay chuyển sang `/checkout`
  * Tabs: Mô tả / Thông tin / Đánh giá
* Thu gọn layout:
  * `max-w` giảm còn `1040px`
  * Ảnh chính đổi từ `aspect-square` sang `aspect-[4/3]`
  * Giảm gap, padding, margin, heading size và tab size để body không bị phình quá lớn

#### `src/app/products/[id]/page.tsx`

* Truyền `relatedProducts` thật vào `ProductDetail`
* Thêm breadcrumb nhiều cấp: `Trang chủ > Cửa hàng > Danh mục > Tên sản phẩm`
* Sửa màn hình không tìm thấy sản phẩm sang style Material Design 3

#### `src/components/layout/Header.tsx`

* Xóa nav item `Sản phẩm` bị thừa
* Giữ `Cửa hàng` là link duy nhất tới `/products`
* Thu gọn header:
  * `max-w-[1120px]`
  * padding nhỏ hơn
  * search input gọn hơn
* Active state của `Cửa hàng` áp dụng cho cả `/products` và `/products/[id]`

#### `src/app/contact/page.tsx`

* Sửa lỗi newsletter bị xuống từng chữ do dùng `max-w-md` trong Tailwind v4 bị conflict với custom spacing token
* Thay bằng width explicit `md:w-[420px]`
* Thu gọn layout liên hệ:
  * `max-w-[1120px]`
  * giảm padding form/card/input/button
  * giảm chiều cao map placeholder
  * newsletter section gọn hơn

#### Breadcrumb coverage

* Thêm breadcrumb cho các route chính:
  * `/`
  * `/products`
  * `/products/[id]`
  * `/about`
  * `/contact`
  * `/cart`
  * `/checkout`
  * `/login`
  * `/register`

---

### Fixed

* Product detail không còn bị hard-code ảnh/nội dung cà chua cho mọi sản phẩm
* Header không còn hiển thị đồng thời `Sản phẩm` và `Cửa hàng`
* Contact newsletter không còn bị vỡ layout thành từng chữ
* Product detail không còn bị phình quá lớn trên desktop

---

### Verified

* `npm.cmd run build` — pass
* `npx.cmd tsc --noEmit --incremental false` — pass

---

## [0.3.2] - 2026-06-04 10:28 → 10:45 (GMT+7)

### Sprint 3.2 — Convert About & Contact Pages từ Stitch HTML

### Added

#### `src/app/contact/page.tsx`

* Thêm route mới `/contact`
* Convert giao diện từ `D:\Thực tập\Buoi3\stitch\li_n_h_n_ngs_ch\code.html` sang **Next.js App Router Server Component**
* Dựng đầy đủ các section theo mẫu:
  * Breadcrumb + page title
  * Form liên hệ
  * Card thông tin liên hệ
  * Map placeholder
  * Newsletter section
* Dùng `next/image` cho ảnh map remote từ `lh3.googleusercontent.com`
* Giữ typography, spacing, màu Material Design 3 theo hệ thống hiện có

---

### Changed

#### `src/app/about/page.tsx`

* Convert lại trang `/about` theo đúng HTML mẫu từ `D:\Thực tập\Buoi3\stitch\v_ch_ng_t_i_n_ngs_ch\code.html`
* Bỏ dùng `public/about-preview.png` làm ảnh nền/nội dung vì đó là screenshot toàn trang, gây lỗi lồng header và text phóng to vào hero
* Thay bằng các ảnh thật trong HTML mẫu từ `lh3.googleusercontent.com`
* Dựng lại các section theo đúng ảnh mẫu:
  * Hero full-width ruộng bậc thang
  * Câu chuyện của chúng tôi
  * Stats
  * Giá trị cốt lõi
  * Đội ngũ sáng lập
  * CTA banner

#### `src/components/layout/Header.tsx`

* Cập nhật link nav `Liên hệ` từ `/` sang `/contact`
* Active state hiện đúng cho route `/contact`

#### `src/components/layout/Footer.tsx`

* Chỉnh footer dùng chung theo mẫu liên hệ:
  * Brand block + copyright
  * Social icons
  * 3 cột link: Mua sắm, Hỗ trợ, Pháp lý
* Sửa lỗi brand column bị co về min-content khiến mô tả xuống từng chữ một
* Active link trong footer dựa theo route hiện tại bằng `usePathname`

#### `next.config.ts`

* Thêm remote image host `lh3.googleusercontent.com` cho các ảnh Stitch HTML mẫu

#### `package.json`

* Đổi script build từ `next build` sang `next build --webpack`
* Lý do: Turbopack bị panic khi project nằm trong path có ký tự tiếng Việt `D:\Thực tập\...`; Webpack build pass ổn định

---

### Verified

* `npx.cmd tsc --noEmit --incremental false` — pass
* `npm.cmd run build` — pass
* Route `/contact` xuất hiện trong build output

---

## [0.3.1] - 2026-06-04 10:16 → 10:28 (GMT+7)

### Sprint 3.1 — Convert About Page từ Stitch HTML

### Added

#### `public/about-preview.png`

* Thêm asset local cho trang giới thiệu, copy từ `D:\Thực tập\Buoi3\stitch\v_ch_ng_t_i_n_ngs_ch\screen.png`
* Dùng làm ảnh nội bộ cho hero/story section thay vì phụ thuộc ảnh remote ngoài project

---

### Changed

#### `src/app/about/page.tsx` — 10:16 (GMT+7)

Chuyển đổi lại hoàn toàn từ `src/stitch-about.html` sang **Next.js App Router Server Component**:

* Bỏ toàn bộ script DOM, `IntersectionObserver`, smooth scroll và các phần interactivity không cần thiết
* Bỏ header/footer trùng lặp từ HTML nguồn vì đã được bọc sẵn trong `src/app/layout.tsx`
* Viết lại metadata cho route `/about`
* Dùng `next/image` với ảnh local `/about-preview.png` theo đúng hướng dẫn App Router/images
* Chuẩn hóa lại toàn bộ nội dung tiếng Việt bị lỗi encoding trong file HTML nguồn
* Tổ chức lại page thành các section:
  * Hero banner
  * Brand story
  * Stats
  * Core values
  * Founding team
  * CTA banner
* Thay phần ảnh thành viên remote bằng card tĩnh dùng initials + mô tả để giữ page thuần server, không cần config thêm remote image host
* Dùng `Link` nội bộ cho CTA về `/products` và `/`

### Verified

* Chạy `eslint src/app/about/page.tsx` và pass

---

## [0.3.0] - 2026-06-04 09:35 → 09:58 (GMT+7)

### Sprint 3 — UI Redesign theo Material Design 3

### Sprint Summary

| Metric            | Value      |
| ----------------- | ---------- |
| Sprint            | Sprint 3   |
| Files Changed     | 7          |
| Code Changed      | ~600 LOC   |
| TypeScript Errors | 0          |

---

### Added

#### `src/app/globals.css`

* Thêm toàn bộ **Material Design 3 color tokens** từ `stitch-home.html` vào `@theme inline`:
  * `--color-primary`, `--color-on-primary`, `--color-primary-container`, `--color-on-primary-container`, v.v. (~40 tokens)
  * `--color-surface-*`, `--color-outline`, `--color-outline-variant`
* Thêm **custom spacing tokens**: `--spacing-xs` (8px), `--spacing-sm` (16px), `--spacing-md` (24px), `--spacing-lg` (40px), `--spacing-xl` (64px), `--spacing-gutter` (24px), `--spacing-container-max` (1280px)
* Thêm **font size scale** đúng theo stitch-home: `--text-label-sm`, `--text-label-md`, `--text-body-md`, `--text-body-lg`, `--text-headline-md`, `--text-headline-lg`, `--text-headline-xl`, `--text-headline-2xl`
* Thêm CSS classes: `.hero-gradient`, `.bento-hover`, `.glass-nav`, `.material-symbols-outlined` font-variation-settings

---

### Changed

#### `src/app/page.tsx` — 09:35 (GMT+7)

Chuyển đổi hoàn toàn từ design cũ (emerald Tailwind utilities) sang **stitch-home.html**:

**Hero Section**
* Thay `bg-gradient-to-br from-emerald-700` → ảnh thực `lh3.googleusercontent.com` với overlay class `.hero-gradient`
* Thay badge pulse → giữ nguyên
* Nút "Mua ngay" & "Tìm hiểu thêm" dùng màu MD3 (`#006c49`, border-white/50)
* Stats row dùng typography scale đúng

**Features Strip**
* Overlap lên hero bằng `-mt-16 z-20` (đúng theo HTML gốc)
* Icon đổi từ Lucide → `material-symbols-outlined` (eco, verified_user, local_shipping, star)
* Card dùng class `.bento-hover`

**Category Grid**
* Background `bg-[#f0f3ff]` (surface-container-low)
* Border `border-[#bbcabf]/30` (outline-variant)
* Texture overlay `transparenttextures.com/patterns/leaves.png`

**Featured Products**
* Section có `bg-white rounded-[3rem]` (đúng theo HTML)
* Header "Xem tất cả" dùng `material-symbols-outlined arrow_forward`
* `featuredProducts = getAllProducts().slice(0, 8)` — giữ nguyên

**CTA Banner**
* `bg-[#10b981]` (primary-container)
* Text màu `#00422b` (on-primary-container)
* Thêm ảnh trang trí `rotate-3` bên phải (hidden lg:block)
* Texture overlay natural-paper.png opacity-20

#### `src/app/layout.tsx` — 09:35 (GMT+7)

* Thêm `<link>` Material Symbols Outlined font từ Google Fonts vào `<head>`
* Đổi `body` từ `bg-slate-50 text-slate-800` → `bg-[#f9f9ff] text-[#111c2d]` (MD3 background)
* Đổi `<main className="flex-1">` → `<div className="flex-1">` (tránh lồng 2 `<main>`)

#### `src/components/layout/Header.tsx` — 09:41 (GMT+7)

Chuyển đổi hoàn toàn từ design cũ sang **stitch-home.html**:

* **Logo**: Bỏ icon `<Leaf>` (Lucide), dùng chữ `NôngSạch` màu `#006c49`, font-bold 30px
* **Nav links**: Cập nhật từ `[Trang chủ, Sản phẩm, Về chúng tôi]` → `[Sản phẩm, Về chúng tôi, Cửa hàng, Liên hệ]`
* **Active state**: Thêm `border-b-2 border-[#006c49]` cho link active (dùng `usePathname`)
* **Search bar**: Thêm input tìm kiếm `bg-[#e7eeff] rounded-full` với icon `search` (Material Symbols), submit redirect `/products?q=`
* **Giỏ hàng**: Đổi từ CartBadge nhỏ → icon `shopping_cart` + chữ "Giỏ hàng" (desktop)
* **Tài khoản**: Đổi từ button "Đăng nhập" xanh nổi → icon `account_circle` + chữ "Tài khoản"
* **Header bg**: Đổi từ `bg-white/90 border-emerald-100` → `bg-[#f9f9ff]/80 backdrop-blur-md shadow-sm`
* **Mobile menu**: Thêm search bar trong mobile dropdown, icon `close`/`menu` (Material Symbols)

#### `src/components/layout/CartBadge.tsx` — 09:41 (GMT+7)

* Đổi từ `<ShoppingCart>` (Lucide) → `material-symbols-outlined shopping_cart`
* Thêm text "Giỏ hàng" hiển thị trên desktop (lg:inline)
* Badge số lượng dùng màu `#006c49`

---

### Fixed

#### `src/app/page.tsx` — 09:43 (GMT+7)

**Bug: Tailwind v4 named spacing token conflict**

Nguyên nhân: Khi định nghĩa `--spacing-xl: 64px` trong `@theme inline`, Tailwind v4 map `max-w-xl` → `max-width: var(--spacing-xl)` = **64px** thay vì 36rem mặc định, khiến text div CTA banner chỉ rộng 64px.

Các fix:
* `max-w-xl` → `max-w-[36rem]` (CTA text div)
* `px-16 py-6` trên buttons hero (4rem/1.5rem quá lớn) → `px-8 py-3.5`
* `mb-16` trên paragraph hero → `mb-6`
* `mb-16` trên flex container hero buttons → `mb-8`
* `mb-16` trên h2 danh mục → `mb-8`
* `mb-16` trên featured products header div → `mb-6`
* `text-[24px]` category label trong lưới 6 cột → `text-sm` (tránh overflow)
* `px-16 py-6` trên nút CTA → `px-8 py-3`

---

#### `src/app/register/page.tsx` (convert lần 1) — 09:50 (GMT+7)

Convert trang đăng ký sang design MD3 card-style:

* Layout: card tập trung giữa trang với header banner màu `#006c49`
* 4 fields: Họ và tên, Email, Mật khẩu, Xác nhận mật khẩu
* Icon `material-symbols-outlined` bên trái mỗi input (person, mail, lock, lock_reset)
* Toggle show/hide password (visibility / visibility_off)
* Inline validation error hiện dưới từng field, tự xóa khi user gõ lại
* Global error banner `bg-[#ffdad6]` từ kết quả `register()` store
* Success state riêng: icon `check_circle` + loading pulse bar
* Redirect `/login` tự động sau 1.8 giây khi đăng ký thành công

---

### Fixed (2)

#### `src/app/register/page.tsx` — 09:53 (GMT+7)

**Bug: Tailwind v4 named spacing conflict — `max-w-md` / `max-w-sm`**

Nguyên nhân: Cùng pattern với lỗi `max-w-xl` trước đó. `max-w-md` → `--spacing-md` = **24px**, `max-w-sm` → `--spacing-sm` = **16px**, khiến card render thành sọc dọc 24px — chỉ thấy dải xanh mỏng giữa trang.

Các fix:
* `max-w-md` (main card) → `max-w-[448px]`
* `max-w-sm` (success card) → `max-w-[384px]`

> **Quy tắc dự án:** Không dùng `max-w-xs/sm/md/lg/xl` — thay bằng giá trị explicit `max-w-[...]` để tránh conflict với custom `--spacing-*` tokens trong Tailwind v4.

---

### Changed (2)

#### `src/app/register/page.tsx` (redesign theo stitch mới) — 09:56 (GMT+7)

Redesign hoàn toàn theo HTML mới `stitch/ng_k_n_ngs_ch/code.html`:

**Layout:** Card giữa trang → **Split-screen 50/50 (left image | right form)**

**Left panel (ẩn trên mobile)**
* Ảnh nông trại hữu cơ xanh tươi (`lh3.googleusercontent.com`, fill + object-cover)
* Overlay gradient `from-[#006c49]/80 to-[#00422b]/60` + `backdrop-blur-[2px]`
* Headline trắng: `Ăn sạch – Sống khỏe` (48px bold)
* Checklist 3 items với icon `check_circle` (Material Symbols):
  * Nông sản VietGAP
  * Giao hàng tận nơi
  * Hoàn tiền 100% nếu không hài lòng

**Right panel**
* Nền `bg-[#f0f3ff]` (surface-container-low)
* Form card `bg-white rounded-2xl shadow`
* Heading: "Đăng ký tài khoản" + subtitle "Tham gia cộng đồng NôngSạch…"
* **Thêm field Số điện thoại** (type=tel, regex validation `^(0|\+84)[0-9]{8,10}$`)
* Input style: border `#bbcabf`, không có icon trái (clean flat style theo HTML gốc)
* Button: "Đăng ký" → **"Tạo tài khoản"**, màu `bg-[#10b981]` (emerald)
* Link "Đăng nhập ngay" màu `text-[#10b981]`

**Đã bỏ:** Header banner xanh, card overlay kiểu cũ, icon bên trái inputs

---

## [0.2.0] - 2026-06-03

### Sprint 2 — Core Features & Authentication

### Sprint Summary

| Metric            | Value      |
| ----------------- | ---------- |
| Sprint            | Sprint 2   |
| Story Points      | 20 / 20    |
| Files Changed     | 12         |
| Code Added        | ~1,200 LOC |
| TypeScript Errors | 0          |

---

### Added

#### F-03 Product Detail Page

* Dynamic route `/products/[id]`
* ProductDetail component
* Product image, price, origin, stock
* Organic badge
* Stock status indicator
* Breadcrumb navigation

#### F-04 Add To Cart

* Quantity selector
* Stock guard
* Success feedback
* Out-of-stock handling

#### F-04 Cart Page

* Cart item management
* Quantity controls
* Order summary
* Empty state

#### F-05 Checkout

* Checkout form
* Validation
* Order generation
* Success page
* Cart cleanup

#### F-06 Register

* Registration form
* Validation
* Auto-login

#### F-07 Login

* Login form
* Authentication
* Session persistence

#### Auth Store

* Zustand persist middleware
* User registration
* Login
* Logout

#### F-08 About Page

* Brand Story
* Mission & Vision
* Core Values
* CTA Section

---

### Changed

#### Header

* Sync authentication state
* User greeting
* Logout button

#### Cart Page

* Replace alert() with checkout route
* Disable checkout when cart empty

---

### Fixed

* Cart badge real-time updates
* Checkout form reset
* Quantity stock overflow protection

---

## [0.1.0] - 2026-06-03

### Sprint 1 — MVP Foundation & Setup

### Sprint Summary

| Metric            | Value      |
| ----------------- | ---------- |
| Sprint            | Sprint 1   |
| Story Points      | 18 / 18    |
| Files Created     | 20+        |
| Code Added        | ~1,800 LOC |
| TypeScript Errors | 0          |

---

### Added

#### Project Setup

* Next.js 15 App Router
* TypeScript strict mode
* Tailwind CSS v4
* Zustand v5
* Lucide React
* Firebase SDK
* ESLint configuration
* Be Vietnam Pro font

#### Types & Data Layer

* Product types
* Cart types
* User types
* Order types
* Mock product data
* Currency formatter
* Product utilities

#### Layout Components

* Header
* Footer
* Container
* Root Layout

#### Product Components

* ProductCard
* ProductGrid
* Badge

#### Pages

* Home Page
* Product Listing Page

#### Infrastructure

* README.md
* ARCHITECTURE.md
* PRODUCT_SPEC.md
* CHANGELOG.md
* .env.example

---

## Project Summary

| Metric            | Sprint 1 | Sprint 2 | Total  |
| ----------------- | -------- | -------- | ------ |
| Story Points      | 18       | 20       | 38     |
| Files             | 20+      | 12       | 32+    |
| LOC               | ~1,800   | ~1,200   | ~3,000 |
| Pages             | 2        | 6        | 8      |
| Components        | 5        | 4        | 9      |
| Stores            | 1        | 1        | 2      |
| TypeScript Errors | 0        | 0        | 0      |

---

## Result

MVP completed successfully.

Highlights:

* TypeScript Strict Mode
* Zero compile errors
* Responsive mobile-first design
* Clear architecture
* Deployable to Vercel
* Ready for Firebase Phase 2

---

## Upcoming (v0.3.0)

### Planned

* Firebase Firestore
* Firebase Authentication
* VNPay Integration
* Product Reviews
* Admin Dashboard
* Order Tracking
