# Changelog

Tất cả thay đổi đáng kể của dự án được ghi lại tại đây.

Format: [Semantic Versioning](https://semver.org/lang/vi/)
Chuẩn: [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)

---

## [0.1.0] — 2026-06-03

### Khởi tạo dự án (Task 1 — MVP Setup)

#### Thêm mới
- Khởi tạo Next.js 15 App Router với TypeScript + Tailwind CSS v4
- Cài đặt Firebase SDK và Zustand
- `src/types/index.ts` — TypeScript interfaces: `Product`, `CartItem`, `OrderForm`, `UserProfile`
- `src/data/mockProducts.ts` — 12 sản phẩm nông sản mock với đầy đủ dữ liệu
- `src/lib/firebase.ts` — Firebase singleton initialization (Auth + Firestore)
- `src/store/cartStore.ts` — Zustand cart store với persist middleware
- `src/components/layout/Header.tsx` — Sticky header, mobile menu, cart badge
- `src/components/layout/Footer.tsx` — Footer với links, social media, contact
- `src/components/layout/Container.tsx` — Responsive max-width wrapper
- `src/components/product/ProductCard.tsx` — Card sản phẩm với ảnh, badge, rating, add-to-cart
- `src/components/product/ProductGrid.tsx` — Grid responsive với empty state
- `src/components/ui/Badge.tsx` — Badge và CategoryBadge components
- `src/app/layout.tsx` — Root layout với Be Vietnam Pro font, SEO metadata
- `src/app/page.tsx` — Home page: Hero, Features, Categories, Featured Products, CTA
- `src/app/products/page.tsx` — Products page với search, filter, sort
- `src/app/cart/page.tsx` — Cart page với quantity controls và order summary
- `src/app/globals.css` — Custom scrollbar, smooth scroll, focus ring
- `docs/SPEC.md` — Product specification
- `docs/ARCHITECTURE.md` — Architecture document
- `docs/CHANGELOG.md` — File này
- `.env.example` — Template biến môi trường Firebase
- `README.md` — Hướng dẫn cài đặt và chạy project

---

## [Chưa phát hành]

### Kế hoạch Task 2
- Trang chi tiết sản phẩm `/products/[slug]`
- Firebase Auth (Email + Google Sign-in)
- Form đặt hàng `/checkout`
- Lưu đơn hàng vào Firestore
