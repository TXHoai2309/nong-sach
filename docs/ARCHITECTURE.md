# 🌿 NôngSạch Architecture

> Architecture Document
> Version: v1.1.2
> Project: NôngSạch — Nền tảng giao dịch nông sản sạch

---

# 1. System Overview

## Mục tiêu hệ thống

NôngSạch là nền tảng thương mại điện tử B2C kết nối trực tiếp nông dân Việt Nam với người tiêu dùng, tập trung vào các sản phẩm nông sản sạch và hữu cơ.

Mục tiêu của kiến trúc MVP:

* Đơn giản và dễ bảo trì
* Triển khai nhanh
* Tối ưu SEO
* Không phụ thuộc Backend ở giai đoạn đầu
* Dễ mở rộng lên Firebase ở Phase 2

---

# 2. High Level Architecture

```text
┌─────────────────────┐
│     User Browser    │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Next.js App Router  │
│ Server Components   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Static Mock Data    │
│ products.ts         │
└─────────────────────┘

           ▲
           │
┌─────────────────────┐
│ Client Components   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Zustand Stores      │
│ Cart + Auth         │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ localStorage        │
└─────────────────────┘
```

## Future Architecture (Phase 2)

```text
Next.js
   │
   ├── Firebase Auth
   │
   ├── Cloud Firestore
   │
   ├── Firebase Storage
   │
   └── VNPay Integration
```

---

# 3. Tech Stack

| Layer             | Technology            | Purpose                |
| ----------------- | --------------------- | ---------------------- |
| Framework         | Next.js 16 App Router | Routing, SSR, SEO      |
| Language          | TypeScript            | Type Safety            |
| Styling           | Tailwind CSS v4       | UI Development         |
| State             | Zustand + Persist     | Local State Management |
| Icons             | Lucide React          | UI Icons               |
| Font              | Be Vietnam Pro        | Vietnamese Typography  |
| Deploy            | Vercel                | Hosting & CI/CD        |
| Database (MVP)    | Static Mock Data      | Development            |
| Database (Future) | Firestore             | Production Data        |
| Auth (Future)     | Firebase Auth         | Authentication         |

---

# 4. Project Structure

```text
nong-sach/

├── docs/
│   ├── SPEC.md
│   ├── ARCHITECTURE.md
│   └── CHANGELOG.md
│
├── src/
│
│   ├── app/
│   │   ├── page.tsx
│   │   ├── products/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── cart/
│   │   ├── checkout/
│   │   ├── contact/
│   │   ├── login/
│   │   ├── register/
│   │   └── about/
│
│   ├── components/
│   │   ├── layout/
│   │   ├── product/
│   │   └── ui/
│
│   ├── data/
│   │   └── products.ts
│
│   ├── store/
│   │   ├── cart-store.ts
│   │   └── auth-store.ts
│
│   ├── types/
│   └── lib/
│
├── public/
├── .env.example
└── README.md
```

---

# 5. Routing Architecture

| Route          | Purpose         |
| -------------- | --------------- |
| /              | Homepage        |
| /products      | Product Listing |
| /products/[id] | Product Detail  |
| /cart          | Shopping Cart   |
| /checkout      | Checkout        |
| /login         | Login           |
| /register      | Register        |
| /about         | About           |
| /contact       | Contact         |
| /profile       | Trang cá nhân   |

## Navigation Rules

* Header nav hiện chỉ giữ một entry tới khu sản phẩm: `Cửa hàng` → `/products`
* `Cửa hàng` active cho cả `/products` và `/products/[id]`
* Breadcrumb dùng chung qua `src/components/layout/Breadcrumb.tsx`
* Các page chính đều có breadcrumb để thống nhất điều hướng:
  * `/`
  * `/products`
  * `/products/[id]`
  * `/about`
  * `/contact`
  * `/cart`
  * `/checkout`
  * `/login`
  * `/register`
  * `/profile`

---

# 6. Data Architecture

## Product

```ts
interface Product {
  id: string
  name: string
  category: ProductCategory
  price: number
  image: string
  description: string
  origin: string
  stock: number
  isOrganic?: boolean
  isFeatured?: boolean
  unit?: string
}
```

## Cart Item

```ts
interface CartItem {
  productId: string
  name: string
  price: number
  image: string
  quantity: number
  stock: number
}
```

## Order

```ts
interface Order {
  orderId: string
  customerName: string
  phone: string
  address: string
  note?: string
  items: CartItem[]
  total: number
  createdAt: Date
}
```

---

# 7. State Management

## Cart Store

File:

```text
src/store/cart-store.ts
```

### State

```ts
items: CartItem[]
```

### Actions

```ts
addItem()
removeItem()
updateQuantity()
clearCart()
getTotalItems()
getTotalPrice()
```

### Business Rules

* Persist vào localStorage
* Không vượt stock
* Quantity < 1 → tự động remove
* Checkout thành công → clear cart

---

## Auth Store

File:

```text
src/store/auth-store.ts
```

### State

```ts
users: RegisteredUser[]
currentUser: User | null
```

### Actions

```ts
register()
login()
logout()
updateProfile()
changePassword()
addAddress()
updateAddress()
deleteAddress()
setDefaultAddress()
```

### Business Rules

* Persist localStorage
* Email phải duy nhất
* Đăng ký thành công → Auto Login
* Logout → Clear Session

---

# 8. Data Flow

## Product Flow

```text
products.ts
    │
    ▼
app/products/[id]/page.tsx
    │
    ├── getProductById(id)
    ├── getAllProducts() → relatedProducts
    │
    ▼
ProductDetail Client Component
    │
    ▼
Gallery + Tabs + Quantity + Add To Cart
```

## Product Detail Gallery Flow

```text
product.image
    │
    ├── Main image
    └── First thumbnail

product.category
    │
    ▼
categoryGalleryImages[category]
    │
    ▼
Remaining gallery thumbnails
```

## Cart Flow

```text
Product Detail
      │
      ▼
Add To Cart
      │
      ▼
Cart Store
      │
      ▼
localStorage
      │
      ▼
Cart Page
```

## Checkout Flow

```text
Cart Page
     │
     ▼
Checkout Form
     │
     ▼
Validate
     │
     ▼
Create Order
     │
     ▼
Clear Cart
```

## Checkout Address Flow

```text
/checkout Client Component
     |
     v
fetch("https://provinces.open-api.vn/api/v1/?depth=2")
     |
     |-- success --> Province select + District select
     |
     `-- failure --> fallbackProvinces
     |
     v
Validate fullName + phone + email + address + province + district
     |
     v
Build success query address: street, district, province
```

Notes:

* `depth=2` currently provides province/city and district/county data only.
* Ward/commune support should use `depth=3` in a later phase.
* Checkout layout avoids Tailwind named max-width utilities such as `max-w-md/xl` because project spacing tokens can conflict with Tailwind v4 defaults.

## Contact Flow (MVP UI)

```text
/contact
   │
   ├── Contact form UI
   ├── Contact information card
   ├── Map placeholder
   └── Newsletter UI
```

> Contact form hiện chưa ghi dữ liệu. Phase 2 sẽ thêm API route hoặc Firebase collection `contactMessages`.

## Authentication Flow

```text
Register
   │
   ▼
Auth Store
   │
   ▼
Auto Login

Login
   │
   ▼
Current User

Logout
   │
   ▼
Clear Session
```

---

# 9. Server vs Client Components

| Component                  | Type   | Reason            |
| -------------------------- | ------ | ----------------- |
| app/page.tsx               | Server | SEO + Static Data |
| app/products/page.tsx      | Client | Search, Filter, Sort |
| app/products/[id]/page.tsx | Server | Dynamic Product   |
| app/contact/page.tsx       | Server | Static Contact UI |
| Header.tsx                 | Client | Zustand State     |
| Breadcrumb.tsx             | Server | Static Navigation |
| ProductDetail.tsx          | Client | Gallery, Tabs, Qty |
| AddToCartButton.tsx        | Client | User Interaction  |
| cart/page.tsx              | Client | Cart State        |
| checkout/page.tsx          | Client | Form Handling     |
| login/page.tsx             | Client | Auth State        |
| register/page.tsx          | Client | Auth State        |
| profile/page.tsx           | Client | Tab navigation, Profile & Address updates |

---

# 10. Deployment Architecture

## Local Development

```bash
npm install
npm run dev
```

Application chạy tại:

```text
http://localhost:3000
```

## Production

```text
GitHub
   │
   ▼
Vercel
   │
   ▼
Production URL
```

Build command:

```bash
npm run build
```

Current build script:

```bash
next build --webpack
```

Reason:

* Turbopack can panic when the project path contains Vietnamese characters such as `D:\Thực tập\...`
* Webpack build is stable for the current workspace path

Deployment Strategy:

* Automatic Deploy
* Preview Deployment
* Edge CDN
* Zero Downtime

---

# 11. Security Considerations

## MVP

* Client-side validation
* Type-safe data model
* Quantity stock protection
* Local auth persistence

## Phase 2

* Firebase Authentication
* Firestore Security Rules
* Protected Routes
* Server Actions
* Environment Secret Management

---

# 12. Architecture Decision Records (ADR)

## ADR-001 — Zustand thay vì Redux Toolkit

**Status:** Accepted

### Context

MVP chỉ cần quản lý Cart và Authentication.

### Decision

Sử dụng Zustand + Persist Middleware.

### Benefits

* Setup nhanh
* Ít Boilerplate
* Bundle nhỏ
* Dễ học

### Trade-offs

* Ít DevTools hơn Redux

---

## ADR-002 — Mock Data trước Firestore

**Status:** Accepted

### Context

MVP cần hoàn thành nhanh.

### Decision

Sử dụng Static Data.

### Benefits

* Không phụ thuộc Backend
* Build nhanh
* Test dễ

### Trade-offs

* Không Real-time

---

## ADR-003 — Next.js App Router

**Status:** Accepted

### Context

App Router là tiêu chuẩn hiện tại của Next.js.

### Decision

Sử dụng App Router + Server Components.

### Benefits

* SEO tốt
* Streaming
* Layout Nesting
* Vercel tối ưu

### Trade-offs

* Learning Curve cao hơn

---

# 13. Future Architecture (Phase 2)

## Firebase Authentication

* Email/Password
* Google OAuth
* Session Persistence

## Firestore

Collections:

```text
products
orders
users
reviews
contactMessages
```

## Payment Gateway

* VNPay
* MoMo
* ZaloPay

## Admin Dashboard

* Product Management
* Order Management
* User Management

## Order Tracking

* Pending
* Processing
* Shipping
* Delivered

---

# 14. Environment Variables

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

Lưu ý:

MVP hiện tại chưa sử dụng Firebase. Các biến môi trường chỉ cần khi triển khai Phase 2.
      
