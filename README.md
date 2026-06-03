# 🌿 NôngSạch — Nền tảng giao dịch nông sản sạch

> Kết nối trực tiếp nông dân Việt Nam với người tiêu dùng. Tươi ngon — An toàn — Tin cậy.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4
- **Auth**: Firebase Authentication
- **Database**: Cloud Firestore
- **State**: Zustand (cart với localStorage persist)
- **Font**: Be Vietnam Pro (Google Fonts)
- **Deploy**: Vercel

---

## Yêu cầu hệ thống

- Node.js ≥ 18.18.0
- npm ≥ 9.x

---

## Cài đặt & Chạy project

### 1. Clone / mở thư mục project

```bash
cd nong-sach
```

### 2. Cài dependencies

```bash
npm install
```

### 3. Cấu hình Firebase

Copy file `.env.example` thành `.env.local` và điền thông tin Firebase:

```bash
cp .env.example .env.local
```

Mở `.env.local` và điền giá trị từ [Firebase Console](https://console.firebase.google.com):

```env
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

> **Lưu ý**: Giai đoạn MVP dùng mock data, Firebase chỉ cần thiết cho Auth (đăng nhập).

### 4. Chạy development server

```bash
npm run dev
```

Mở trình duyệt tại [http://localhost:3000](http://localhost:3000)

### 5. Build production

```bash
npm run build
npm start
```

---

## Cấu trúc thư mục

```
nong-sach/
├── docs/
│   ├── SPEC.md           # Product specification
│   ├── ARCHITECTURE.md   # Kiến trúc hệ thống
│   └── CHANGELOG.md      # Lịch sử thay đổi
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── layout.tsx    # Root layout
│   │   ├── page.tsx      # Home page
│   │   ├── products/     # Danh sách sản phẩm
│   │   └── cart/         # Giỏ hàng
│   ├── components/
│   │   ├── layout/       # Header, Footer, Container
│   │   ├── product/      # ProductCard, ProductGrid
│   │   └── ui/           # Badge, etc.
│   ├── data/
│   │   └── mockProducts.ts
│   ├── lib/
│   │   └── firebase.ts
│   ├── store/
│   │   └── cartStore.ts  # Zustand
│   └── types/
│       └── index.ts
├── .env.example
└── README.md
```

---

## Tính năng MVP hiện tại

- [x] Trang chủ với Hero, Featured Products, Categories
- [x] Danh sách sản phẩm với tìm kiếm, lọc danh mục, sắp xếp
- [x] Giỏ hàng (thêm/xóa/sửa số lượng, persist localStorage)
- [ ] Trang chi tiết sản phẩm _(Task 2)_
- [ ] Đăng nhập / Đăng ký Firebase _(Task 2)_
- [ ] Form đặt hàng _(Task 2)_

---

## Scripts

| Script | Mô tả |
|--------|-------|
| `npm run dev` | Khởi động dev server |
| `npm run build` | Build production |
| `npm start` | Chạy production server |
| `npm run lint` | Kiểm tra ESLint |

---

## Deploy lên Vercel

1. Push code lên GitHub
2. Vào [vercel.com](https://vercel.com) → Import repository
3. Thêm Environment Variables từ `.env.example`
4. Deploy!

---

## Tài liệu

- [SPEC.md](./docs/SPEC.md) — Đặc tả tính năng
- [ARCHITECTURE.md](./docs/ARCHITECTURE.md) — Kiến trúc hệ thống
- [CHANGELOG.md](./docs/CHANGELOG.md) — Lịch sử thay đổi

---

## License

MIT © 2026 NôngSạch Team
