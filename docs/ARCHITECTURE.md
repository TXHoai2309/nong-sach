# 🌿 NôngSạch Architecture

> Architecture Document
> Version: v1.3.0
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
┌──────────────────────┐
│    Zustand Stores    │
│ Auth, Cart, Order,   │
│ Notification, Report │
└──────────┬───────────┘
           │
           ▼
┌─────────────────────┐
│    localStorage     │
└─────────────────────┘
```

## Current Core Architecture

```text
Next.js 16 (App Router)
   │
   ├── Cloud Firestore (Database & Real-time)
   ├── Firebase Storage (Product & CCCD Images)
   ├── Zustand + Persist (Client Session & Cart)
   └── VNPay Sandbox (Payment Gateway)
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
│   ├── middleware.ts     # Next.js Edge Middleware bảo vệ các route /admin
│   ├── app/
│   │   ├── page.tsx
│   │   ├── admin/
│   │   │   ├── layout.tsx  # Layout riêng cho Admin Panel
│   │   │   └── page.tsx    # Dashboard quản trị Admin
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
│   │   ├── auth-store.ts
│   │   ├── order-store.ts
│   │   ├── notification-store.ts
│   │   └── report-store.ts
│
│   ├── types/
│   │   ├── order.ts
│   │   ├── notification.ts
│   │   ├── report.ts
│   │   └── ...
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
| /shop/[id]     | Trang chi tiết Shop/Cửa hàng |
| /admin         | Admin Panel (Dashboard quản trị hệ thống, duyệt người bán, quản lý role) |

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
* Shared layout utilities live in `src/app/globals.css`:
  * `.site-container` controls the standard 1120px page width.
  * `.breadcrumb-bar` controls consistent breadcrumb position and visual style.
  * `.page-surface`, `.page-card`, `.lift-hover`, `.page-enter`, `.reveal-up` keep page backgrounds, cards and motion consistent.
* `src/components/layout/Container.tsx` delegates width to `.site-container` to avoid mismatched `max-w` values across pages.

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
  images?: string[] // Danh sách album ảnh thực tế (tối đa 6 ảnh)
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
  id: string;
  userId: string;
  sellerId?: string;
  shopName?: string;
  fullName: string;
  phone: string;
  email?: string;
  address: string;
  note?: string;
  items: CartItem[];
  totalAmount: number;
  status: OrderStatus;
  paymentMethod: string;
  createdAt: string;
  payment_status?: string;
  vnp_TransactionNo?: string;
  vnp_ResponseCode?: string;
  trackingCode?: string;
  trackingUrl?: string;
  voucherCode?: string;
  discountAmount?: number;
}

```

## Shop

```ts
interface Shop {
  id: string
  name: string
  logo: string
  coverImage?: string
  verified: boolean
  rating: number
  reviewCount: number
  productCount: number
  followerCount: string | number
  joinDate: string
  location: string
  slogan: string
  altitude: string
  standard: string
  description: string
  farmImages: string[]
  mainCategories: string[]
}
```

## Voucher

```ts
interface Voucher {
  code: string;
  sellerId: string;
  shopName: string;
  type: "percent" | "fixed";
  value: number;
  limit: number;
  usedCount: number;
  expiryDate: string;
  status: "active" | "stopped";
  createdAt: string;
}
```

## Voucher History

```ts
interface VoucherHistory {
  id: string;
  voucherCode: string;
  userId: string;
  orderId: string;
  discountAmount: number;
  sellerId: string;
  usedAt: string;
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
registerSeller()
approveSeller()
```

### Business Rules

* Persist localStorage
* Email phải duy nhất
* Đăng ký thành công → Auto Login
* Logout → Clear Session
* **Kiểm duyệt & Từ chối hồ sơ (Quality Control)**: Trạng thái `sellerStatus` chuyển thành `"pending"` khi gửi hồ sơ đăng ký. Admin có thể duyệt (trạng thái `"approved"`, chuyển `role` thành `"seller"`, tạo gian hàng `Shop` tương ứng và xóa `sellerRejectionReason`) hoặc từ chối (trạng thái `"rejected"`, nhập lý do lưu vào `sellerRejectionReason` và gửi thông báo `account_update` cho người bán). Khi người bán chỉnh sửa và gửi lại, trạng thái quay lại `"pending"` và lý do từ chối được xóa bỏ.
* **Tránh lỗi QuotaExceededError (Zustand Partialize)**: Sử dụng middleware `partialize` của Zustand để lọc bỏ các trường ảnh base64 dung lượng cao (như logo shop, ảnh nông trại, ảnh CMND mặt trước và sau) ra khỏi đối tượng `sellerInfo` trước khi lưu xuống bộ nhớ đệm `localStorage`. Chỉ lưu giữ thông tin văn bản thuần túy của tài khoản.
* **Khóa tạm & Thu hồi quyền (Violation Control)**: Shop vi phạm có thể bị khóa tạm thời (`sellerStatus: "blocked"`, tự động chặn và ẩn toàn bộ sản phẩm của shop) hoặc thu hồi quyền bán hàng vĩnh viễn (đổi role về `"buyer"`, xóa mọi sản phẩm). Khi Shop bị khóa tạm, Admin có thể dùng hành động "Mở khóa Shop" để phục hồi trạng thái `"approved"`, mở khóa lại các sản phẩm của shop và gửi thông báo hệ thống.

---

## Report Store

File:

```text
src/store/report-store.ts
```

### State

```ts
reports: ViolationReport[]
loading: boolean
error: string | null
```

### Actions

```ts
addReport(data: Partial<ViolationReport>)
fetchReports()
resolveReport(reportId: string, status: 'resolved' | 'dismissed', action: string, note?: string)
```

### Business Rules

* Tích hợp lưu trữ trực tiếp trên Firestore trong collection `"reports"`.
* **Tránh lỗi undefined trên Firestore**: Trước khi ghi dữ liệu lên Firestore, tự động lọc sạch các trường có giá trị `undefined` bằng `Object.fromEntries(Object.entries(data).filter(([_, v]) => v !== undefined))` để đảm bảo an toàn truy vấn và ngăn chặn runtime exceptions của Firestore.
* Khi Admin xử lý báo cáo, ghi nhận kết quả hành động và tự động cập nhật trạng thái thực tế của đối tượng bị báo cáo (Cửa hàng/Sản phẩm).

---

## Order Store

File:

```text
src/store/order-store.ts
```

### State

```ts
orders: Order[]
isLoading: boolean
```

### Actions

```ts
addOrder(order: Order)
updateOrderStatus(orderId: string, status: OrderStatus)
updateTrackingCode(orderId: string, trackingCode: string)
fetchOrdersByUserId(userId: string)
fetchOrdersBySellerId(sellerId: string)
```

### Business Rules

* Quản lý trạng thái đơn hàng và lịch sử mua sắm/bán hàng trên Firestore.
* **Cập nhật mã vận đơn**: Cho phép người bán nhập mã vận đơn GHN cho các đơn hàng đang xử lý. Hệ thống tự động tạo link tra cứu GHN và gửi thông báo cho người mua.

---

## Vouchers Utility

File:

```text
src/lib/vouchers.ts
```

### Core Functions

```ts
createVoucher(voucher: Voucher)
stopVoucher(code: string)
subscribeToSellerVouchers(sellerId: string, callback: (vouchers: Voucher[]) => void)
incrementVoucherUsage(code: string)
saveVoucherHistory(history: { voucherCode: string, userId: string, orderId: string, discountAmount: number, sellerId: string })
```

### Business Rules

* **Xác thực và Áp dụng (Server-side Apply)**: Endpoint `/api/vouchers/apply` thực hiện xác thực và trả về discount. Check 4 case: không tồn tại, hết hạn, hết lượt, đã dừng hoạt động.
* **Cập nhật và Ghi log Lịch sử**: Khi đơn hàng được đặt thành công (qua COD/Bank hoặc cổng VNPay), tự động tăng `usedCount` của voucher đồng thời lưu một bản ghi lịch sử sử dụng vào collection `voucherHistories` trong Firestore.

---

## Admin Auditing (Lịch sử Hoạt động Admin)

Nhật ký kiểm toán của Admin được quản lý trực tiếp qua collection `"adminLogs"` trên Firestore.

### Model

```ts
interface AdminLog {
  id: string;
  adminId: string;
  adminEmail: string;
  action: 'approve_seller' | 'reject_seller' | 'approve_product' | 'reject_product' | 'dismiss_report' | 'warn_seller' | 'block_product' | 'block_seller' | 'delete_product' | 'delete_seller_products' | 'unblock_seller';
  targetType: 'seller' | 'product' | 'report';
  targetId: string;
  targetName: string; // Tên shop hoặc tên sản phẩm bị tác động
  details: string;
  createdAt: any; // Timestamp Firestore
}
```

### Luồng xử lý
Mỗi khi Admin thực hiện bất kỳ hành động phê duyệt, từ chối, khóa, xóa hay mở khóa, hệ thống tự động ghi lại một bản ghi `AdminLog` mới vào Firestore để lưu vết kiểm toán, hiển thị ở bảng Lịch sử hoạt động ở cuối giao diện Admin Panel.

---

# 8. Data Flow

## Product Flow

```text
Static mock data (products.ts) ──┐
                                  ├──> getAllProducts() (lib/products.ts)
Custom localStorage products ────┘
              │
              ▼
    app/products/page.tsx (Client Component) & app/products/[id]/page.tsx
              │
              ├── [id]/page.tsx: getProductById(id)
              ├── relatedProducts: getProductsByCategory()
              │
              ▼
    ProductDetail Client Component
              │
              ▼
    Gallery + Tabs + Quantity + Add To Cart
```

## Product Detail Gallery Flow

```text
Has custom images? (product.images) ───[Yes]──> Display all custom uploaded images
              │
             [No]
              │
              ▼
    product.image (Main)
              │
              ├── First thumbnail (product.image)
              └── Other thumbnails (categoryGalleryImages[category])
```

## Image Upload & Hybrid Compression Flow

```text
User selects image files
              │
              ▼
File size check:
   ├── Size < 300KB ───────> Save raw Base64 string directly (Maintain 100% sharpness)
   └── Size >= 300KB ──────> Draw on Canvas (Max 1200px dimension) -> Compress as JPEG 92%
              │
              ▼
Store in local array of images (up to 6 images)
              │
              ▼
Save to localStorage under 'nong-sach-custom-products'
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

## Seller Verification & Audit Flow

```text
Seller Form Submission
       │ (sellerStatus ➔ "pending")
       ▼
Admin Dashboard Queue
       │
       ├─► Click "Xem chi tiết" ➔ Opens Modal (Inspect CCCD Front/Back with Zoom, Farm pics)
       │
       ├─► [Approve] ➔ calls approveSeller()
       │                 ├── role ➔ "seller"
       │                 ├── sellerStatus ➔ "approved"
       │                 ├── sellerRejectionReason ➔ ""
       │                 └── Auto-creates shop & Sends system notification
       │
       └─► [Reject] ➔ prompts for reason input
                         ├── sellerStatus ➔ "rejected"
                         ├── sellerRejectionReason ➔ reason
                         └── Sends account_update notification
                               │
                               ▼
                   Seller Dashboard / Profile
                         ├── Displays "Hồ sơ bị từ chối" Warning banner
                         ├── Shows rejection reason text
                         └── "Chỉnh sửa & gửi lại hồ sơ" button
                               │
                               ▼ (Prefills form with past info)
                   Resubmits Form (sellerStatus ➔ "pending", resets reason)
```

## Product Verification & Audit Flow

```text
Seller Submits Product
       │ (product.status ➔ "pending")
       ▼
Admin Dashboard Queue (Duyệt Sản Phẩm Tab)
       │
       ├─► Click "Xem chi tiết" ➔ Opens Modal (Inspect name, category, price, stock, description, images)
       │
       ├─► [Approve] ➔ Sets status ➔ "active", clears rejectionReason
       │                 └── Sends notification to seller (product approved)
       │
       └─► [Reject] ➔ prompts for reason input
                         ├── Sets status ➔ "rejected"
                         ├── Saves rejectionReason ➔ reason
                         └── Sends notification to seller (product rejected with reason)
                               │
                               ▼
                   Seller Dashboard (Products Table)
                         ├── Displays "Bị từ chối" status badge
                         ├── Shows rejection reason text
                         └── Seller edits product -> Resets status ➔ "pending", resets reason
```

---

# 9. Server vs Client Components

| Component                  | Type   | Reason            |
| -------------------------- | ------ | ----------------- |
| app/page.tsx               | Server | SEO + Static Data |
| app/products/page.tsx      | Client | Search, Filter, Sort |
| app/products/[id]/page.tsx | Client | Dynamic Product & Custom Products from Local Storage (Avoid Hydration Mismatch) |
| app/contact/page.tsx       | Server | Static Contact UI |
| Header.tsx                 | Client | Zustand State     |
| Breadcrumb.tsx             | Server | Static Navigation |
| ProductDetail.tsx          | Client | Gallery, Tabs, Qty |
| AddToCartButton.tsx        | Client | User Interaction  |
| cart/page.tsx              | Client | Cart State        |
| checkout/page.tsx          | Client | Form Handling     |
| login/page.tsx             | Client | Auth State        |
| register/page.tsx          | Client | Auth State        |
| profile/page.tsx           | Client | Tab navigation, Profile & Address updates, Seller Registration Warning Banner & Resubmission form handling |
| app/shop/[id]/page.tsx     | Client | Shop Details, Follow and Products Filter & Sort |
| app/admin/layout.tsx       | Client | Admin Session & Sidebar Layout |
| app/admin/page.tsx         | Client | Dashboard stats, Approvals Queue with Detail Modal (CCCD Zoom), and Rejection modal |

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
* Edge Middleware Role Protection: Bảo vệ route `/admin` bằng Next.js Edge Middleware thông qua cookie `user-role` đồng bộ từ Client-side Zustand Auth Store.

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
reports
adminLogs
```

## Payment Gateway

* VNPay (Đã tích hợp bản Sandbox)
* MoMo (Định hướng tương lai)
* ZaloPay (Định hướng tương lai)

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
NEXT_PUBLIC_FIREBASE_DATABASE_URL=

# VNPay Sandbox credentials
VNP_TMNCODE=
VNP_HASHSECRET=
VNP_RETURNURL=
```

Lưu ý:

Dự án hiện đã tích hợp hoàn toàn cơ sở dữ liệu Firestore, Firebase Storage và cổng thanh toán VNPay Sandbox. Bạn cần cấu hình đầy đủ các biến môi trường trên để các chức năng này hoạt động ổn định.

      
