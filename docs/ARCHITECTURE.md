# NôngSạch — Architecture Document

## Tech Stack

| Layer | Công nghệ | Lý do chọn |
|-------|-----------|------------|
| Framework | Next.js 15 (App Router) | SSR/SSG, routing, image optimization |
| Language | TypeScript (strict) | Type safety, DX tốt |
| Styling | Tailwind CSS v4 | Utility-first, nhanh |
| Auth | Firebase Auth | Dễ tích hợp, Google/Email login |
| Database | Firestore | NoSQL, real-time, scalable |
| State | Zustand + persist | Lightweight, giỏ hàng local |
| Font | Be Vietnam Pro | Tiếng Việt đẹp, hiện đại |
| Deploy | Vercel | Zero-config cho Next.js |

---

## Directory Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout (Header, Footer, Font)
│   ├── globals.css         # Global styles
│   ├── page.tsx            # Home page
│   ├── products/
│   │   ├── page.tsx        # Products listing
│   │   └── [slug]/
│   │       └── page.tsx    # Product detail (Phase 2)
│   ├── cart/
│   │   └── page.tsx        # Cart page
│   ├── checkout/
│   │   └── page.tsx        # Order form (Phase 2)
│   └── login/
│       └── page.tsx        # Auth page (Phase 2)
├── components/
│   ├── layout/
│   │   ├── Header.tsx      # Sticky nav + cart badge
│   │   ├── Footer.tsx      # Footer với links
│   │   └── Container.tsx   # Max-width wrapper
│   ├── product/
│   │   ├── ProductCard.tsx  # Card với ảnh, giá, rating
│   │   └── ProductGrid.tsx  # Responsive grid + empty state
│   └── ui/
│       └── Badge.tsx        # Category & status badges
├── data/
│   └── mockProducts.ts      # 12 sản phẩm mock
├── lib/
│   └── firebase.ts          # Firebase singleton init
├── store/
│   └── cartStore.ts         # Zustand cart + persist
└── types/
    └── index.ts             # Shared TypeScript types
```

---

## Data Flow

```
Mock Data (Phase 1)          Firestore (Phase 2)
      │                             │
      ▼                             ▼
  mockProducts.ts    ──────►   lib/firebase.ts
      │                             │
      ▼                             ▼
  app/page.tsx                Server Components
  app/products/page.tsx             │
      │                             ▼
      ▼                      Client Components
  ProductGrid                       │
      │                             ▼
      ▼                        cartStore.ts (Zustand)
  ProductCard  ──addItem──►   localStorage (persist)
```

---

## State Management

Chỉ Zustand, không Redux. Giỏ hàng được persist vào localStorage.

```typescript
// cartStore.ts — chỉ chứa cart state
{
  items: CartItem[];
  addItem, removeItem, updateQuantity, clearCart,
  totalItems(), totalAmount()
}
```

Auth state (Phase 2) sẽ dùng Firebase `onAuthStateChanged` + React Context.

---

## Firebase Architecture (Phase 2)

### Collections

```
/products/{productId}        # Catalog sản phẩm
/users/{uid}                 # User profiles
/orders/{orderId}            # Đơn hàng
```

### Security Rules (template)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /products/{id} {
      allow read: if true;
      allow write: if false; // chỉ admin
    }
    match /orders/{id} {
      allow create: if request.auth != null;
      allow read: if request.auth.uid == resource.data.userId;
    }
  }
}
```

---

## Naming Conventions

| Loại | Quy tắc | Ví dụ |
|------|---------|-------|
| Component | PascalCase | `ProductCard.tsx` |
| Hook | camelCase + use | `useCartStore` |
| Type/Interface | PascalCase | `CartItem` |
| Constant | SCREAMING_SNAKE | `CATEGORY_LABELS` |
| File | kebab-case (pages) | `products/page.tsx` |
| CSS class | Tailwind utilities | Không custom class |

---

## Deployment

```
GitHub repo ──► Vercel (auto-deploy on push to main)
                  │
                  ├── Preview deployments (PR branches)
                  └── Production (main branch)
```

Environment variables cấu hình trên Vercel Dashboard từ `.env.example`.
