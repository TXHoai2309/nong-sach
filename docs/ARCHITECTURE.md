# NôngSạch — Architecture Document

## Tech Stack

| Layer | Công nghệ | Lý do chọn |
|-------|-----------|------------|
| Framework | Next.js 16 (App Router) | SSR/SSG, routing, image optimization |
| Language | TypeScript (strict mode) | Type safety, strict compile checks, DX tốt |
| Styling | Tailwind CSS v4 | Utility-first, hiệu năng biên dịch cực nhanh |
| State | Zustand | Quản lý state gọn nhẹ (Giỏ hàng, Đăng nhập cục bộ) |
| Persistent State | Zustand Persist | Tự động đồng bộ giỏ hàng / tài khoản vào `localStorage` |
| Icons | Lucide React | Thư viện icon đa dạng, tối ưu bundle size |
| Deploy | Vercel | Tối ưu hóa tuyệt đối cho Next.js |

---

## Directory Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout (Header, Footer, Font, Providers)
│   ├── globals.css         # Global styles & Tailwind directives
│   ├── page.tsx            # Home page (Hero, Features, Categories, CTA)
│   ├── products/
│   │   ├── page.tsx        # Products list (Search, Filter, Sort)
│   │   └── [id]/
│   │       └── page.tsx    # Product detail page (Dynamic ID routing)
│   ├── cart/
│   │   └── page.tsx        # Local cart display, quantity management
│   ├── checkout/
│   │   └── page.tsx        # Checkout page (Order form validation, local success state)
│   ├── login/
│   │   └── page.tsx        # Login page (Local authentication mock)
│   ├── register/
│   │   └── page.tsx        # Register page (Local user storage mock)
│   └── about/
│       └── page.tsx        # About Us page (Static information, brand story)
├── components/
│   ├── layout/
│   │   ├── Header.tsx      # Sticky navigation, auth state toggle, cart badge
│   │   ├── Footer.tsx      # Contact, brand links
│   │   └── Container.tsx   # Responsive container wrapper
│   ├── product/
│   │   ├── ProductCard.tsx  # Product card preview with actions
│   │   ├── ProductDetail.tsx# Product detail component
│   │   ├── ProductGrid.tsx  # Grid wrapper for lists
│   │   └── AddToCartButton.tsx # Client component managing quantity limits
│   └── ui/
│       └── Badge.tsx        # Shared Badges
├── data/
│   └── products.ts         # Static product inventory data source
├── lib/
│   ├── format.ts           # Currency formatter utility
│   └── products.ts         # Utility functions to query products
├── store/
│   ├── cart-store.ts       # Zustand store for items, quantities, and stock bounds
│   └── auth-store.ts       # Zustand store for mock users and session persistence
└── types/
    ├── cart.ts             # CartItem type specifications
    ├── user.ts             # User and RegisteredUser models
    ├── order.ts            # Order schema
    ├── product.ts          # ProductCategory & Product model interfaces
    └── index.ts            # Entry point exporting shared types
```

---

## Data Flow

```
   Products Catalog (data/products.ts)
                 │
                 ▼
     [Server Component Wrapper]
                 │
                 ▼
       [ProductDetail Component]
                 │
           (addToCart)
                 ▼
        useCartStore (Zustand)  ◄───►  [Cart / Checkout Page]
                 │
      (checkout confirmation)
                 ▼
      [Clear Cart & Show Order ID]
```

---

## State Management

Chúng tôi sử dụng Zustand để quản lý local state sạch và hiệu quả:

### 1. Cart Store (`src/store/cart-store.ts`)
- Quản lý danh sách sản phẩm trong giỏ hàng.
- Ràng buộc nghiêm ngặt số lượng sản phẩm không vượt quá `stock` tồn kho.
- Tự động xóa sản phẩm nếu số lượng giảm về `0`.

### 2. Auth Store (`src/store/auth-store.ts`)
- Lưu trữ tài khoản người dùng đã đăng ký và phiên đăng nhập hiện tại (`currentUser`).
- Sử dụng middleware `persist` của Zustand để lưu trạng thái đăng nhập vào `localStorage`, giúp thông tin tài khoản không bị mất khi F5/tải lại trang.

---

## Naming Conventions

| Loại | Quy tắc | Ví dụ |
|------|---------|-------|
| Component | PascalCase | `ProductCard.tsx` |
| Hook / Store | camelCase + use | `useCartStore` |
| Type/Interface | PascalCase | `CartItem` |
| Constant | SCREAMING_SNAKE | `CATEGORY_LABELS` |
| File Page | kebab-case / Folder Routing | `checkout/page.tsx` |
| Utility File | camelCase / kebab-case | `format.ts` |
