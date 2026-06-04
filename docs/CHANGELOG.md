# Changelog

All notable changes to the **NôngSạch** project will be documented in this file.

The format is based on **Keep a Changelog** and this project adheres to **Semantic Versioning**.

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

🎯 MVP completed successfully.

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
