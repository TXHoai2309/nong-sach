# Changelog

All notable changes to the **NôngSạch** project will be documented in this file.

The format is based on **Keep a Changelog** and this project adheres to **Semantic Versioning**.

---

## [0.4.2] - 2026-06-05

### Sprint 4.2 — Banner thông tin Shop & Trang chi tiết cửa hàng tương tác

### Added

#### Banner thông tin Shop (`src/components/product/ProductDetail.tsx`)
* Triển khai Banner thông tin Shop nằm giữa phần hình ảnh/thông số sản phẩm chính và các tab chi tiết sản phẩm.
* Hiển thị đầy đủ logo đại diện, tên cửa hàng (kèm badge Đã xác minh), xếp hạng sao vàng (`⭐`), số lượng đánh giá, tổng số lượng sản phẩm của cửa hàng và vị trí địa lý nông trại (`📍`).
* Nút "Xem shop →" liên kết động tới trang chi tiết của shop tương ứng.

#### Trang chi tiết Cửa hàng (`src/app/shop/[id]/page.tsx` & `src/lib/shops.ts`)
* Thiết kế và triển khai trang chi tiết shop tại route `/shop/[id]`:
  * **Ảnh bìa đại diện**: Hình ảnh phong cảnh nông trại hữu cơ trải dài.
  * **Thẻ hồ sơ cửa hàng**: Avatar bo tròn có viền trắng, badge Đã xác minh màu xanh lá, tên shop, tiêu chuẩn chất lượng (VietGAP, USDA Organic), slogan và vị trí.
  * **Thống kê chi tiết**: Bảng điểm rating, số sản phẩm, số người theo dõi và mốc tham gia hệ thống.

  * **Tương tác**: Nút "+ Theo dõi" đổi trạng thái sang "Đang theo dõi" kèm thay đổi màu sắc trực quan; nút "Nhắn tin" mô phỏng; nút chia sẻ.
  * **Giới thiệu tóm tắt**: Khung giới thiệu ngắn về nông trại đi kèm icon Material.
  * **Tab Sản phẩm**: 
    - Lọc sản phẩm theo danh mục động có trong shop.
    - Tìm kiếm sản phẩm trực tiếp trong cửa hàng theo tên/mô tả.
    - Sắp xếp sản phẩm theo giá tăng/giảm dần, tên A-Z hoặc độ phổ biến.
    - Grid sản phẩm hiển thị đầy đủ hình ảnh, badge hữu cơ, icon yêu thích, xuất xứ, đánh giá và nút thêm vào giỏ hàng nhanh.
  * **Tab Đánh giá**: Danh sách phản hồi và đánh giá từ khách hàng cũ (sao vàng, bình luận, thời gian).
  * **Tab Giới thiệu**: Chi tiết quy trình canh tác nông trại, danh mục, địa chỉ, ảnh bộ sưu tập nông trại và **thông tin thanh toán ngân hàng** (tự động load động từ `localStorage` nếu là shop tự đăng của custom seller).
  * **Hệ thống Báo cáo Shop**: Triển khai modal báo cáo cửa hàng chuyên nghiệp, cho phép người dùng chọn lý do (Sản phẩm không đúng mô tả, lừa đảo, thái độ...) và gửi kèm chi tiết về hệ thống admin (Lưu trữ động tại `localStorage`).
  * **Menu Tiện ích Sản phẩm (`...`)**: 
    - Bổ sung menu dấu ba chấm trên cả `ProductCard` và `ProductDetail` cho phép truy cập nhanh: Chia sẻ, Sao chép liên kết, Báo cáo sản phẩm và Trợ giúp.
    - Hỗ trợ nút "Chỉnh sửa sản phẩm" nhanh dành riêng cho chủ sở hữu shop.
  * **Hệ thống Quản lý Đơn hàng cho Người bán**: 
    - Phân tách đơn hàng theo từng nhà vườn khi thanh toán (Multi-seller support).
    - Dashboard người bán hỗ trợ quản lý danh sách đơn hàng riêng biệt.
    - Cho phép người bán cập nhật trạng thái đơn hàng: Xác nhận, Đang giao, Đã giao hoặc Hủy.
  * **Hệ thống Thông báo Thời gian thực (Notifications)**:
    - Gửi thông báo đến người bán khi có đơn hàng mới.
    - Gửi thông báo đến người mua khi trạng thái đơn hàng thay đổi.
    - Badge hiển thị số lượng thông báo chưa đọc trên Header.
    - Tab quản lý thông báo chi tiết trong trang Profile.
  * **Tương tác Shop**: Nâng cấp tính năng Follow shop với số lượng "Người theo dõi" tự động tăng/giảm và định dạng thông minh (ví dụ: 2.4K) ngay khi người dùng nhấn nút.

### Changed

#### `src/store/report-store.ts` & `src/types/report.ts`
* Tái cấu trúc (Refactor) hệ thống lưu trữ báo cáo sang dạng generic: Hỗ trợ đồng thời báo cáo Cửa hàng (`shop`) và báo cáo Sản phẩm (`product`).
* Bổ sung các phương thức truy xuất báo cáo theo `shopId` hoặc `productId` linh hoạt.

#### `src/types/product.ts`
* Bổ sung các trường tùy chọn `sellerId?: string`, `shopName?: string`, `isOrganic?: boolean`, `unit?: string` vào interface `Product` để đồng bộ dữ liệu.

#### `src/lib/products.ts`
* Đọc và map chính xác các trường `sellerId` và `shopName` đối với các sản phẩm tự tạo từ `localStorage`.

### Fixed

#### Giao diện Trang chi tiết Shop (`src/app/shop/[id]/page.tsx`)
* Tối ưu hóa ảnh bìa cửa hàng (Cover Image): Thu ngắn chiều cao từ `380px` xuống `300px` (desktop) và từ `280px` xuống `200px` (mobile) giúp giao diện gọn gàng, tập trung hơn vào nội dung chính.
* Cải thiện UX với thiết kế bo góc: Áp dụng bo góc dưới (`rounded-b-3xl`) cho cả ảnh bìa và thẻ thông tin shop, đồng thời bỏ bo góc trên để tạo sự liền mạch, chuyên nghiệp.
* Giới hạn chiều rộng: Bọc toàn bộ phần banner vào `.site-container` thay vì tràn viền, giúp bố cục trang đồng nhất và dễ nhìn hơn trên màn hình lớn.
* Tinh chỉnh vị trí các thành phần: Căn chỉnh lại Breadcrumb và nút chỉnh sửa (More) để hiển thị cân đối trong khung banner mới.
* **Tính năng cắt ảnh trực tiếp**: Tích hợp nút "Cắt / Chỉnh sửa ảnh" ngay trên phần xem trước ảnh bìa trong modal chỉnh sửa, cho phép kích hoạt công cụ crop nhanh chóng cho ảnh hiện tại.

#### Kênh người bán (`src/app/profile/page.tsx`)
* Đồng bộ tính năng "Cắt / Chỉnh sửa ảnh" vào modal chỉnh sửa thông tin shop trong Kênh người bán, đảm bảo trải nghiệm người dùng nhất quán.

#### Bố cục Stats Box & Nút tùy chọn (`src/app/shop/[id]/page.tsx`)
* Khắc phục lỗi co rút giao diện (khiến font chữ/nhãn thông tin bị đè và chồng chéo lên nhau) tại ô thống kê cửa hàng khi ngày tham gia của nhà vườn dài (ví dụ: `tháng 06, 2026`). Áp dụng giới hạn độ rộng tối thiểu an toàn `minWidth: min(100%, 420px)` và tinh chỉnh font size hợp lý.
* Di chuyển nút tùy chọn ba chấm (`...`) từ bảng thông tin phía dưới lên góc trên cùng bên phải của ảnh bìa (Cover Image), thiết kế lại theo phong cách kính mờ (glassmorphism) hiện đại, tinh gọn và dễ tương tác.

---

## [0.4.1] - 2026-06-05

### Sprint 4.1 — Cải thiện chất lượng ảnh upload & UX khung ảnh sản phẩm

### Fixed

#### Upload ảnh sản phẩm mới (`src/app/profile/page.tsx`)
* Sửa hiện tượng ảnh sản phẩm mới bị mờ sau khi tải lên do ảnh bị nén/resize chưa phù hợp rồi hiển thị trong khung lớn.
* Bổ sung luồng đọc kích thước ảnh thật trước khi xử lý, giúp hệ thống nhận biết ảnh có độ phân giải thấp.
* Chỉ nén ảnh sản phẩm khi file quá nặng hoặc kích thước vượt ngưỡng lớn; ảnh nhỏ được giữ gần với dữ liệu gốc để hạn chế mất nét.
* Chuyển nén ảnh sản phẩm lớn sang WebP chất lượng cao, giới hạn cạnh dài tối đa khoảng 2000px để cân bằng giữa độ nét và dung lượng localStorage.
* Bổ sung cảnh báo khi ảnh tải lên nhỏ hơn khuyến nghị, giúp người bán hiểu vì sao ảnh có thể không sắc nét khi xem ở trang chi tiết.

#### Khung ảnh chi tiết sản phẩm (`src/components/product/ProductDetail.tsx`)
* Sửa cách hiển thị ảnh upload base64 trong trang chi tiết sản phẩm để tránh bị Next Image tối ưu lại không cần thiết.
* Lấy kích thước tự nhiên của ảnh đang chọn trước khi render ảnh chính, giúp ảnh hiển thị đúng tỉ lệ và hạn chế méo/mờ.
* Thay thế cách phóng ảnh kín khung bằng cơ chế phóng có kiểm soát: ảnh nhỏ được tăng kích thước vừa phải nhưng không bị kéo căng quá mức.
* Cải thiện UX khung ảnh bằng nền radial, lớp ảnh mờ phía sau cho ảnh nhỏ, và lớp nền trong suốt ở giữa để bố cục không còn bị trống/rời rạc.
* Giữ thanh thumbnail linh hoạt theo số lượng ảnh thực tế và hỗ trợ dữ liệu ảnh upload từ localStorage.

### Notes

* Các ảnh sản phẩm đã upload trước khi sửa vẫn đang lưu trong `localStorage`; nếu ảnh cũ đã bị lưu ở chất lượng thấp, cần chỉnh sửa sản phẩm và upload lại ảnh gốc để thấy cải thiện rõ nhất.
* Khuyến nghị ảnh sản phẩm nên có kích thước tối thiểu khoảng 900x900px, tốt hơn là 1200x1200px trở lên, để hiển thị đẹp trong khung chi tiết.

---

## [0.4.0] - 2026-06-05

### Sprint 4.0 — Đăng Ký Người Bán (Seller Registration), Kênh Bán Hàng (Seller Dashboard), Quản Lý Sản Phẩm (Product CRUD) & Tối Ưu Bộ Sưu Tập Ảnh

### Added

#### Đăng ký Người bán & Kênh bán hàng (`src/app/profile/page.tsx`)
* Triển khai biểu mẫu đăng ký người bán 4 bước chi tiết:
  * **Bước 1: Thông tin cửa hàng**: Tên cửa hàng, Slogan, Số điện thoại shop, Số Zalo shop, Mô tả cửa hàng, Ảnh đại diện/Logo shop.
  * **Bước 2: Địa chỉ & Tiêu chuẩn**: Tỉnh/Thành phố (dùng API động), Địa chỉ cụ thể nông trại, Tiêu chuẩn canh tác (VietGAP, GlobalGAP, Hữu cơ, Khác) kèm chi tiết tiêu chuẩn.
  * **Bước 3: Xác minh danh tính**: Số CMND/CCCD, Ảnh chụp CMND/CCCD mặt trước & mặt sau.
  * **Bước 4: Thông tin tài khoản ngân hàng**: Tên ngân hàng, Số tài khoản, Tên chủ tài khoản.
* Triển khai cơ chế mô phỏng phê duyệt hồ sơ người bán trực tuyến: Sau khi bấm "Đăng ký bán hàng", hồ sơ được đổi sang trạng thái duyệt tự động nhanh, nâng cấp phân quyền tài khoản từ người mua (`buyer`) sang người bán (`seller`).
* Ẩn các bước đăng ký (State 1-2-3) sau khi người bán đã đăng ký thành công và được phê duyệt.
* Tích hợp **Kênh bán hàng (Seller Dashboard)** toàn diện:
  * Thống kê tổng quan: Tổng doanh thu, Số đơn hàng, Đánh giá cửa hàng, Tổng sản phẩm.
  * Danh sách đơn hàng cần xử lý dành riêng cho người bán.
  * Danh sách quản lý sản phẩm do người bán tự đăng.
  * Tích hợp chức năng CRUD hoàn chỉnh cho sản phẩm.

#### Quản lý Sản phẩm CRUD (Thêm, Đọc, Sửa, Xóa)
* **Thêm mới sản phẩm**: Form nhập Tên, Danh mục, Giá, Số lượng tồn kho, Đơn vị tính, Nguồn gốc, Mô tả, và tải lên tối đa 6 ảnh từ thiết bị. Cho phép tích chọn để thay đổi ảnh bìa (Cover Image).
* **Đọc/Xem chi tiết sản phẩm**: Khi nhấp vào tên sản phẩm ở Cửa hàng hoặc Kênh bán hàng, chuyển hướng động đến route `/products/[id]`, hiển thị đầy đủ thông tin của sản phẩm tự đăng và album ảnh thực tế.
* **Cập nhật sản phẩm (Sửa)**: Hộp thoại modal tải sẵn (prefilled) toàn bộ thông tin sản phẩm cũ để người dùng chỉnh sửa và cập nhật lại vào bộ nhớ.
* **Xóa sản phẩm**: Xóa sản phẩm tự đăng khỏi hệ thống và đồng bộ tức thời với giao diện.
* **Tải lên & Xử lý Ảnh Hybrid thông minh**:
  * Tối ưu hóa dung lượng lưu trữ: Nếu file ảnh tải lên có dung lượng nhỏ hơn 300KB, hệ thống giữ nguyên định dạng base64 chất lượng gốc để giữ độ nét tuyệt đối cho các ảnh tài liệu/ảnh chụp cận cảnh.
  * Nếu file ảnh lớn hơn 300KB, tiến hành nén canvas thông minh về kích thước tối đa 1200px ở chất lượng JPEG 92% để giảm thiểu dung lượng lưu trữ cục bộ nhưng vẫn đảm bảo hiển thị sắc nét vượt trội.
  * Lọc ảnh thông tin nhạy cảm ở store Zustand: Sử dụng cơ chế `partialize` của Zustand middleware để loại bỏ các ảnh base64 dung lượng cao (ảnh CMND/CCCD mặt trước/sau, ảnh nông trại, logo cửa hàng) ra khỏi khóa `nong-sach-auth` trước khi lưu vào `localStorage`, ngăn chặn triệt để lỗi tràn bộ nhớ trình duyệt (`QuotaExceededError`).

#### Bộ sưu tập ảnh & Trải nghiệm người dùng (Dynamic Image Gallery)
* **Bộ sưu tập co giãn động**: Thanh hiển thị ảnh phụ chỉ hiển thị số lượng ảnh thực tế được tải lên thay vì luôn cố định 4 ảnh (1 ảnh hiện 1, 5 ảnh hiện 5).
* **Căn chỉnh khung ảnh**: Thay thế layout grid co kéo bằng flex-wrap với các ô thumbnail cố định `w-16 h-16` giúp giao diện cân đối khi số lượng ảnh ít.
* **Cải thiện độ sắc nét (Sharpness)**: Chuyển đổi khung chứa ảnh đại diện lớn từ `object-cover` sang `object-contain p-2 bg-slate-50 border rounded-xl` đảm bảo ảnh hiển thị đầy đủ các chi tiết, không bị mờ nhòe hay méo hình do bị kéo giãn.

### Changed

#### `src/types/product.ts`
* Thêm trường tùy chọn `images?: string[]` để lưu giữ danh sách album ảnh phụ cho sản phẩm (hỗ trợ hiển thị nhiều ảnh).

#### `src/lib/products.ts`
* Cập nhật hàm `getAllProducts()`, `getProductById()`, `getProductsByCategory()`, `searchProducts()`, `getAvailableCategories()` để tự động đọc cả dữ liệu sản phẩm tĩnh lẫn dữ liệu sản phẩm tự đăng của người bán từ khóa `nong-sach-custom-products` trong `localStorage`.

#### `src/app/products/page.tsx`
* Chuyển đổi sang Client Component hoàn toàn và tích hợp logic dùng `mounted` state và `useMemo` để tải dữ liệu sản phẩm tự đăng từ `localStorage` đồng bộ sau khi trang tải xong phía client, loại bỏ hoàn toàn lỗi bất đối xứng Hydration Next.js.

#### `src/app/products/[id]/page.tsx`
* Tái cấu trúc trang chi tiết sản phẩm thành Client Component để đảm bảo có thể đọc thông tin sản phẩm tự tạo từ `localStorage` ở phía client một cách mượt mà và an toàn.

#### `src/store/auth-store.ts`
* Mở rộng cấu trúc dữ liệu người dùng chứa thông tin người bán (`role?: "buyer" | "seller"`, `sellerStatus?: "pending" | "approved"`, `sellerInfo?: SellerInfo`).
* Thêm các hàm `registerSeller` và `approveSeller` để xử lý đăng ký và cấp quyền người bán.
* Tích hợp hàm lọc `partialize` loại bỏ dữ liệu ảnh base64 cồng kềnh trong `sellerInfo` trước khi lưu vào Local Storage.

---

## [0.3.9] - 2026-06-04

### Sprint 3.9 — Thiết kế Trang Quản Lý Tài Khoản (Profile Page) & Ràng Buộc Đăng Nhập (Authorization)

### Added

#### Ràng buộc đăng nhập (Authorization Constraints)
* Thiết lập bắt buộc đăng nhập đối với các tính năng:
  * **Thêm sản phẩm**: Ngăn chặn người dùng chưa đăng nhập thêm sản phẩm vào giỏ hàng từ `ProductCard`, `ProductDetail` và `AddToCartButton`. Hiển thị hộp thoại cảnh báo và tự động chuyển hướng về trang `/login` kèm đường dẫn hiện tại làm tham số `redirect`.
  * **Trang Giỏ hàng (`/cart`)**: Bảo vệ route bằng cách tự động chuyển hướng người dùng chưa đăng nhập về trang `/login?redirect=/cart`.
  * **Trang Thanh toán (`/checkout`)**: Bảo vệ route bằng cách tự động chuyển hướng người dùng chưa đăng nhập về trang `/login?redirect=/checkout`.
* Nâng cấp trang **Đăng nhập (`/login`)**:
  * Đọc tham số `redirect` từ URL để sau khi người dùng đăng nhập thành công, hệ thống tự động đưa họ quay trở lại tính năng/trang mà họ đang thao tác dở dang thay vì luôn chuyển về trang chủ `/`.

#### `src/app/profile/page.tsx`
* Tạo mới trang quản lý tài khoản cá nhân của người dùng, tích hợp thiết kế giao diện Material Design chi tiết:
  * **Thông tin cá nhân**: Cập nhật Họ tên, SĐT, Ngày sinh, Giới tính. Giữ trường Email ở chế độ chỉ đọc.
  * **Đơn hàng của tôi**: Hiển thị danh sách đơn hàng đã mua, bộ lọc trạng thái (Tất cả, Đang xử lý, Hoàn thành), hiển thị hình ảnh và chi tiết sản phẩm, cùng chức năng **"Mua lại"** tự động thêm toàn bộ sản phẩm vào giỏ hàng. Cung cấp dữ liệu đơn hàng mẫu #NS92831.
  * **Địa chỉ giao hàng**: Danh sách địa chỉ nhận hàng, có nhãn địa chỉ mặc định, chức năng thêm mới / chỉnh sửa / xóa địa chỉ sử dụng API Tỉnh/Thành phố & Quận/Huyện động.
  * **Đổi mật khẩu**: Biểu mẫu cập nhật mật khẩu với thanh đo độ mạnh yếu (Mật khẩu yếu, Trung bình, Mạnh) bằng màu sắc trực quan.
  * **Thông báo**: Xem các thông báo đẩy tự động từ hệ thống.

#### `src/types/user.ts` & `src/store/auth-store.ts`
* Mở rộng cấu trúc dữ liệu người dùng (`User`, `RegisteredUser`) và triển khai các hàm cập nhật thông tin cá nhân, cập nhật mật khẩu, quản lý sổ địa chỉ (thêm, sửa, xóa, thiết lập địa chỉ mặc định) đồng bộ trong store Zustand.
* Định hình thông tin tài khoản mặc định là **"Nguyễn Văn A"** (`nguyenvana@gmail.com` / mật khẩu `12345678`) để khớp hoàn hảo với mockup.

#### `src/app/checkout/page.tsx`
* Kết nối luồng thanh toán với trang cá nhân: Khi người dùng đặt hàng thành công, tự động lưu thông tin đơn hàng vào lịch sử đơn hàng của tài khoản cá nhân trên Local Storage.

#### `src/components/layout/Header.tsx`
* Loại bỏ nút "Đăng xuất" trên Header điều hướng của phiên bản desktop, giữ thanh menu tinh giản. Người dùng hiện có thể đăng xuất trực tiếp từ trang quản lý cá nhân `/profile`.

#### `src/app/contact/page.tsx`
* Sửa lỗi trang liên hệ bị kéo giãn và phình to (bloated layout):
  * Thu nhỏ chiều rộng tối đa của các container từ `1120px` về `960px` để giao diện cân đối, gọn gàng hơn.
  * Giảm padding của các ô nhập liệu, hộp chọn, và nút bấm từ `py-4` xuống `py-3` để tối ưu chiều cao.
  * Thu nhỏ các kích thước chữ tiêu đề và giảm chiều cao bản đồ vị trí cửa hàng từ `260px` xuống `200px`.
  * Đồng bộ hóa màu sắc chủ đạo sử dụng tông màu thương hiệu NôngSạch xanh lục (`#006c49` và `#10b981`).

#### `src/app/about/page.tsx`
* Nâng cấp phần kêu gọi hành động (Call To Action - CTA) cuối trang giới thiệu:
  * Thay thế hình nền màu xanh trơn bằng ảnh chụp thực tế nông trại hữu cơ xanh mát chất lượng cao từ Unsplash, phủ lớp màu chuyển sắc thương hiệu (gradient `#006c49` và `#10b981`).
  * Thu nhỏ chiều rộng container về mức `1040px` (đồng bộ với Cart, Checkout, Profile).
  * Thu nhỏ kích thước nút "Mua ngay" từ quá khổ (`px-16 py-6 text-2xl`) về kích thước tiêu chuẩn (`px-8 py-3 text-sm font-bold rounded-full`), đồng bộ trải nghiệm các nút bấm trên toàn bộ hệ thống.
  * Sửa lỗi rớt dòng từng chữ (font layout wrapping) do xung đột lớp `max-w-xl` trong Tailwind v4 (bị đè thành 64px do token `--spacing-xl`). Thay bằng chiều rộng tường minh `max-w-[576px]` và thêm `whitespace-nowrap` cho chữ trên nút.

---

## [0.3.8] - 2026-06-04

### Sprint 3.8 — Fix Header Layout Wrapping Issues

### Fixed

#### `src/components/layout/Header.tsx` & `src/components/layout/CartBadge.tsx`

* Sửa lỗi vỡ giao diện trên thanh Header khi đăng nhập hoặc trên màn hình trung bình:
  * Thêm lớp `whitespace-nowrap` và `shrink-0` vào tất cả các liên kết điều hướng (Navigation links), Logo, biểu tượng giỏ hàng, thông tin tài khoản, và nút "Đăng xuất" để ngăn việc xuống dòng ngoài ý muốn.
  * Tối ưu hóa các khoảng trống (gaps) giữa các phần tử bằng các thuộc tính responsive của Tailwind CSS (`gap-6 lg:gap-12`, `gap-4 lg:gap-7`, `gap-3 lg:gap-5`).
  * Làm cho ô tìm kiếm có chiều rộng co giãn linh hoạt (`w-40 md:w-52 lg:w-72`) để đảm bảo thanh menu luôn hiển thị đẹp mắt trên một dòng trên mọi kích thước màn hình desktop.

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

## [0.3.6] - 2026-06-04

### Sprint 3.6 — UI Consistency, Breadcrumb Alignment & Motion Polish

### Added

#### `src/components/layout/PageShell.tsx`

* Thêm layout shell dùng chung cho các page cần breadcrumb, title, subtitle và content wrapper thống nhất.

#### `src/app/globals.css`

* Thêm các utility dùng chung:
  * `.site-container` — chuẩn width toàn site `1120px`
  * `.page-surface` — background surface thống nhất
  * `.breadcrumb-bar` — style breadcrumb dạng pill/glass đồng bộ
  * `.page-card` — card glass nhẹ dùng chung
  * `.lift-hover`, `.page-enter`, `.reveal-up` — hiệu ứng hover/reveal nhẹ
* Thêm `prefers-reduced-motion` để tắt animation cho người dùng không muốn motion.

### Changed

* Đồng bộ vị trí breadcrumb và content width trên các trang chính: Home, About, Contact, Products, Product Detail, Cart, Checkout, Checkout Success, Login, Register.
* Giảm kích thước/phần phình trên About hero, story image, value cards, team section và các section Home.
* Đồng bộ ProductCard và ProductDetail related cards theo hệ card/radius/shadow mới.
* Chuyển `Container` dùng chung sang `.site-container` để tránh mỗi page tự đặt `max-w` khác nhau.

### Verified

* `npm.cmd run build` — pass
* `npx.cmd tsc --noEmit --incremental false` — pass

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
