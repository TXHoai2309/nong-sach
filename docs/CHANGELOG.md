# Changelog

All notable changes to the **NôngSạch** project will be documented in this file.

The format is based on **Keep a Changelog** and this project adheres to **Semantic Versioning**.

## [0.8.5] - 2026-06-11

### Tương tác đánh giá đa chiều (Threaded Review Interactions)

### Added
* **Luồng trao đổi tin nhắn (Review Threads)**: Nâng cấp hệ thống đánh giá một chiều thành cuộc hội thoại đa chiều. Mỗi đánh giá giờ đây có thể chứa một chuỗi các tin nhắn trao đổi (`ReviewMessage`) giữa người mua và người bán.
* **Tab Quản lý đánh giá cho Người bán**: Bổ sung subtab **"Đánh giá của khách"** trong Kênh người bán tại trang Hồ sơ. Cho phép người bán xem toàn bộ đánh giá, xem ảnh chi tiết, phản hồi mới hoặc tiếp tục trao đổi với khách hàng.
* **Tương tác từ phía Người mua**: Người mua có thể xem các phản hồi của shop và gửi tin nhắn phản hồi lại ngay trong chi tiết đơn hàng đã mua hoặc từ thông báo đánh giá.
* **Hiển thị luồng trao đổi công khai**: Toàn bộ nội dung trao đổi giữa người mua và người bán được hiển thị công khai trên **Trang chi tiết sản phẩm** và **Trang cửa hàng** để tăng tính minh bạch và độ tin cậy.

### Changed
* **Cấu trúc dữ liệu Firestore**: Mở rộng tài liệu `reviews` để lưu trữ mảng `messages` và triển khai cơ chế cập nhật nguyên tử bằng `arrayUnion`.
* **Giao diện thông báo đánh giá**: Cập nhật bảng xem chi tiết đánh giá từ thông báo để hỗ trợ gửi và nhận tin nhắn trực tiếp cho cả hai vai trò.

## [0.8.4] - 2026-06-11

### Đồng nhất trạng thái đơn hàng tách & Lọc đơn hàng Dashboard người bán (Unified Split Orders Status & Seller Dashboard Order Filtering)

### Added
* **Theo dõi hành trình theo cửa hàng (Tabbed Order Tracking)**: Bổ sung bộ chọn tab cho từng cửa hàng tại trang hoàn tất đặt hàng (`checkout/success`). Cho phép người mua xem và theo dõi hành trình (timeline) cùng mã vận đơn thực tế của riêng từng cửa hàng trong đơn hàng bị tách.
* **Nhãn trạng thái chi tiết từng sản phẩm**: Cạnh mỗi mặt hàng ở danh sách sản phẩm bên phải trang success hiển thị rõ tên shop quản lý và nhãn trạng thái thực tế tương ứng (ví dụ: `Đã giao`, `Chờ xác nhận`).
* **Đồng nhất trạng thái tổng quan**: Trạng thái và biểu tượng chung của trang success được tính toán động dựa trên trạng thái của tất cả các đơn hàng con thay vì chỉ lấy đơn hàng con đầu tiên.

### Changed
* **Cập nhật bộ lọc đơn hàng Dashboard người bán**: Bộ lọc `sellerOrders` ở tab Kênh người bán tại trang cá nhân (`src/app/profile/page.tsx`) được cập nhật để hiển thị đầy đủ các đơn hàng con thuộc về các shop demo tĩnh (`"admin"`, `"vuon-sach-da-lat"`, `"nong-trai-xanh"`, etc.) nhằm đồng bộ với dữ liệu đăng ký lắng nghe thời gian thực.

## [0.8.3] - 2026-06-11

### Báo cáo Doanh thu Người Bán (Seller Revenue Report)

### Added
* **Biểu đồ doanh thu SVG tương tác (Line/Bar Charts)**: Thiết kế biểu đồ SVG tùy biến hỗ trợ vẽ đường xu hướng (Line Chart) hoặc dạng cột (Bar Chart) với các bộ lọc 7 ngày, 30 ngày, và 90 ngày. Tích hợp thanh định vị hover và Tooltip HTML động hiển thị ngày, doanh thu VND và số lượng đơn hàng tương ứng.
* **Thống kê chỉ số KPI bán hàng**: Triển khai 4 thẻ chỉ số chính cập nhật realtime từ Firestore bao gồm Doanh thu tạm tính (trừ hủy), Doanh thu hoàn thành (đơn thành công), Số lượng đơn hàng, và Giá trị trung bình đơn.
* **Top 5 Sản phẩm bán chạy nhất**: Tự động tính toán xếp hạng các mặt hàng nông sản bán chạy nhất trong kỳ, hiển thị tên, rank badge, ảnh thumbnail, khối lượng đã bán (kg), doanh thu đóng góp và thanh đo phần trăm trực quan.
* **Xuất báo cáo Excel CSV (UTF-8 BOM)**: Tích hợp nút xuất báo cáo chi tiết đơn hàng trong khoảng thời gian đã lọc, mã hóa định dạng UTF-8 BOM (`\uFEFF`) để đảm bảo hiển thị chuẩn tiếng Việt không bị lỗi font khi mở trực tiếp trong Microsoft Excel.

### Changed
* Cấu trúc menu phụ kênh người bán trong `src/app/profile/page.tsx` được cập nhật thêm subtab **Báo cáo doanh thu** và xử lý query parameter điều hướng `sellerTab=reports`.

## [0.8.2] - 2026-06-10

### Tích hợp Voucher tại Checkout & Lưu Lịch sử sử dụng (Voucher Checkout & History Logging)

### Added
* **Tích hợp Voucher tại Checkout**: Cho phép người mua nhập và áp dụng mã voucher trực tiếp tại trang checkout, tính toán chiết khấu và khấu trừ trực tiếp vào tổng tiền thanh toán của đơn hàng.
* **Xác thực 4 trường hợp lỗi (Server-side Validation)**: Trả về và hiển thị đúng 4 thông báo lỗi màu đỏ khi mã không hợp lệ: mã không tồn tại, mã hết hạn, mã hết lượt dùng, và mã đã dừng hoạt động.
* **Lưu Lịch sử Sử dụng vào Firestore**: Tự động ghi lại bản ghi lịch sử sử dụng voucher (bao gồm `voucherCode`, `userId`, `orderId`, `discountAmount`, `sellerId`, `usedAt`) vào collection `voucherHistories` khi đơn hàng được đặt thành công (cả đối với COD, chuyển khoản ngân hàng và thanh toán VNPay trực tuyến).
* **Tự động cập nhật usedCount**: Trường `usedCount` của voucher được tăng thêm 1 khi áp dụng thành công.

### Changed
* Đồng bộ hóa logic xử lý VNPay IPN webhook (`src/app/api/vnpay/ipn/route.ts`) để thực hiện đầy đủ việc trừ chiết khấu voucher, ghi nhận voucherCode/discountAmount vào đơn hàng chính thức, tăng lượt usedCount và lưu lịch sử dùng.

### Fixed
* Loại bỏ tất cả các kiểu `any` không an toàn trong `src/app/api/vnpay/ipn/route.ts` để đáp ứng các tiêu chuẩn TypeScript nghiêm ngặt và giải quyết triệt để cảnh báo/lỗi linter.

## [0.8.0] - 2026-06-10

### Mã Giảm Giá của Người Bán (Seller Vouchers Feature)

### Added
* **Tạo & Quản lý Voucher cho Người bán**: Cho phép người bán tạo mã giảm giá (tự động chuyển thành chữ in hoa, không khoảng trắng), tùy chọn loại giảm giá (phần trăm % hoặc số tiền cố định), giới hạn số lượt dùng và ngày hết hạn. Người bán có thể dừng voucher sớm trực tiếp từ bảng quản lý.
* **Áp dụng và Tính toán Giảm giá tự động**: Người mua có thể áp dụng mã giảm giá trực tiếp tại trang Giỏ hàng hoặc Thanh toán. Hệ thống tự động tính chiết khấu dựa trên tổng giá trị các sản phẩm thuộc về shop phát hành mã.
* **Tích hợp Thanh toán Online (VNPay)**: Đồng bộ mã giảm giá và số tiền giảm giá thông qua đơn hàng tạm thời (`pending_orders`). Khi thanh toán online thành công, hệ thống tự động khấu trừ chiết khấu cho đơn hàng tương ứng của shop và cập nhật lượt sử dụng voucher.
* **Tự động tách đơn hàng**: Lưu trữ thông tin `voucherCode` và `discountAmount` trực tiếp trong tài liệu đơn hàng của từng shop cụ thể sau khi tách đơn.
* **API Xác thực bảo mật (Server-side Validation)**: Xây dựng route `/api/vouchers/apply` để xác thực trạng thái hoạt động, thời hạn, giới hạn lượt dùng của voucher và tính toán mức chiết khấu an toàn trước khi đặt hàng.

### Changed
* Cấu trúc dữ liệu đơn hàng (`Order`) được mở rộng với hai thuộc tính tùy chọn `voucherCode` và `discountAmount`.

## [0.7.8] - 2026-06-10

### Danh sách sản phẩm yêu thích (Wishlist Feature)

### Added
* **Nút trái tim Yêu thích trên ProductCard**: Tích hợp nút hình trái tim ở góc trên bên trái của ảnh sản phẩm để thêm/xoá sản phẩm yêu thích nhanh chóng.
* **Nút trái tim Yêu thích trên ProductDetail**: Tích hợp nút hình trái tim cạnh menu tiện ích ở góc trên bên phải ảnh sản phẩm trong trang chi tiết.
* **Tab Yêu thích tại Trang cá nhân (Profile)**: Thêm tab mới cho phép người dùng xem tất cả sản phẩm đã lưu vào danh sách yêu thích, hỗ trợ hủy yêu thích realtime hoặc truy cập nhanh đến chi tiết sản phẩm.
* **Đồng bộ cơ sở dữ liệu Firestore**: Toàn bộ dữ liệu được lưu vết trong collection `wishlists` trên Firestore, hỗ trợ đồng bộ hóa trạng thái theo thời gian thực giữa các thiết bị đăng nhập cùng tài khoản (cross-device sync).

## [0.7.7] - 2026-06-10

### Theo dõi Cửa hàng & Quản lý Shop đã theo dõi (Shop Follow & Following Dashboard)

### Added
* **Tab Shop đã theo dõi tại Profile**: Thêm tab mới cho phép người dùng xem danh sách các shop đang theo dõi với đầy đủ thông tin (Logo, tên, đánh giá, tiêu chuẩn, location, slogan).
* **Nút Bỏ theo dõi và Xem shop**: Người dùng có thể bỏ theo dõi trực tiếp từ trang cá nhân (danh sách tự động cập nhật thời gian thực qua listener `onSnapshot` trên Firestore) hoặc chuyển hướng nhanh đến gian hàng.
* **Tích hợp Firestore**: Đồng bộ hóa toàn bộ trạng thái theo dõi qua `follows` collection trong Firestore, tự động tăng/giảm số lượng follower của shop tương ứng.

## [0.7.6] - 2026-06-10

### Phân xử Hoàn trả Đơn hàng (Admin Refund Mediation)

### Added
* **Tab Hoàn trả tại Admin Dashboard**: Admin có thể xem danh sách các yêu cầu hoàn trả đang chờ xử lý (`pending`) trực tiếp trong hàng đợi kiểm duyệt (Approvals Queue).
* **Modal Phân xử Hoàn trả**: Giao diện chi tiết cho Admin xem xét lý do, mô tả và bằng chứng hình ảnh do người mua cung cấp, đồng thời có thông tin người bán liên quan.
* **Quyết định phân xử (Mediation)**: 
  - Admin có quyền can thiệp vào tranh chấp bằng cách **"Chấp nhận hoàn trả"** hoặc **"Từ chối"** yêu cầu hoàn trả.
  - Yêu cầu nhập ghi chú quyết định từ Admin.
* **Thông báo Phân xử**: Hệ thống tự động gửi Notification thông báo kết quả (kèm ghi chú của Admin) cho **cả Người mua và Người bán** để đảm bảo tính minh bạch.
* **Log kiểm toán**: Hành động phân xử hoàn trả của Admin được tự động lưu vào bộ sưu tập `adminLogs` trên Firestore.

### Changed
* Cập nhật `order-store.ts` với hàm `adminMediateRefund` để xử lý logic backend, thay đổi trạng thái hoàn trả và ghi log.

---

## [0.7.5] - 2026-06-10

### Hoàn thiện luồng Hoàn trả Đơn hàng (End-to-End Refund Processing Flow)

### Added
* **Giao diện Xử lý hoàn trả cho Người bán**: Cho phép Người bán xem chi tiết yêu cầu hoàn trả (lý do, mô tả, ảnh minh chứng) và thực hiện "Chấp nhận" hoặc "Từ chối".
* **Logic xử lý Dữ liệu Hoàn trả**:
  - `getRefundRequest`: Tải thông tin chi tiết yêu cầu hoàn trả từ Firestore.
  - `processRefund`: Cập nhật trạng thái yêu cầu hoàn trả và tự động điều chỉnh trạng thái đơn hàng tương ứng (`refunded` nếu chấp nhận, `delivered` nếu từ chối).
* **Thông báo kết quả cho Người mua**: Tự động gửi thông báo thời gian thực kèm ghi chú của người bán khi yêu cầu được xử lý.

### Changed
* **Tối ưu hóa Kênh người bán**: Bổ sung nút thao tác nhanh "Xử lý hoàn trả" trên card đơn hàng có trạng thái `refunding`.

### Fixed
* **Lỗi logic Yêu cầu hoàn trả**: Khắc phục lỗi thiếu hàm xử lý ảnh và submit form khiến người dùng không thể gửi yêu cầu ở phiên bản trước.

---

## [0.7.4] - 2026-06-10

### Hệ thống Yêu cầu Hoàn trả Đơn hàng (Order Refund Request System - Buyer Side)

### Added
* **Tính năng Yêu cầu hoàn trả cho người mua**: Cho phép người mua gửi yêu cầu hoàn trả cho các đơn hàng đã được giao (`delivered`) kèm tối đa 3 ảnh minh chứng.
* **Thông báo cho Người bán**: Tự động gửi thông báo thời gian thực đến Người bán ngay khi có yêu cầu hoàn trả mới.

---

## [0.7.3] - 2026-06-10

### Theo dõi Đơn hàng Thời gian thực & Timeline hợp nhất (Real-time Order Tracking & Unified Timeline)

### Added
* **Cơ chế cập nhật Thời gian thực (Real-time Updates)**: Tích hợp Firestore `onSnapshot` vào `OrderStore` và trang Cá nhân, giúp đồng bộ trạng thái đơn hàng và mã vận đơn ngay lập tức khi người bán thay đổi dữ liệu.
* **Component Timeline hợp nhất (`OrderTrackingTimeline`)**: Xây dựng thành phần giao diện theo dõi tiến trình 4 bước (Đặt hàng, Xác nhận, Đang giao, Đã nhận) chuyên nghiệp và trực quan.
* **Giao diện Trạng thái Hủy**: Hiển thị thông báo và Timeline đặc biệt dành riêng cho các đơn hàng bị hủy.

### Changed
* **Hợp nhất trải nghiệm Theo dõi**: 
  - Thay thế hệ thống Stepper cũ tại trang Hoàn tất đơn hàng (`/checkout/success`) bằng `OrderTrackingTimeline` thời gian thực.
  - Tích hợp thông tin mã vận đơn GHN và link tra cứu trực tiếp vào bên dưới thanh Timeline để tạo luồng thông tin liền mạch.
* **Tối ưu hóa Profile**: Cập nhật tab Đơn hàng để sử dụng subscription thời gian thực, đảm bảo người mua nhận được thông tin vận chuyển mới nhất mà không cần tải lại trang.

---

## [0.7.2] - 2026-06-10

### Bảo mật quyền Quản trị & Tối ưu hóa Dashboard Admin (Admin Security Lockdown & Dashboard Optimization)

### Added
* **Cơ chế khóa quyền Quản trị (Admin Role Lockdown)**: Thiết lập quy tắc bảo mật chỉ cho phép duy nhất tài khoản `admin@nongsach.vn` giữ vai trò Admin hệ thống.
* **Bảo vệ tài khoản Master Admin**: Tài khoản admin chính được đánh dấu "Không được chỉnh sửa" trong danh sách quản lý người dùng để tránh các thay đổi vô ý.

### Changed
* **Vô hiệu hóa thăng cấp Admin**: Loại bỏ hoàn toàn tính năng cấp quyền Admin cho người dùng khác từ giao diện quản trị và logic xử lý backend (`auth-store.ts`).
* **Tối ưu hóa Dashboard tập trung vào Quản lý User**:
  - Loại bỏ các chỉ số bán hàng (Doanh thu, Đơn hàng hôm nay) khỏi Dashboard Admin để tập trung hoàn toàn vào nhiệm vụ quản lý người dùng và phê duyệt chất lượng.
  - Thu gọn bảng chỉ số KPI chỉ còn: *Tổng người dùng* và *Số lượng Seller chờ duyệt*.
* **Cải thiện luồng truy cập Admin**: Thêm lại lối tắt "Trang quản trị" trên Header storefront cho người dùng Admin để chuyển đổi nhanh giữa giao diện người dùng và quản trị.

### Removed
* **Gỡ bỏ Biểu đồ Hiệu suất Nền tảng (SVG Chart)**: Xóa bỏ biểu đồ doanh thu và đơn hàng cùng các logic tính toán dữ liệu liên quan tại trang quản trị để tối ưu hóa hiệu năng tải trang.

---

## [0.7.1] - 2026-06-10

### Nhập mã vận đơn & Theo dõi đơn hàng GHN (Tracking Code Integration & GHN Tracking)

### Added
* **Tính năng nhập mã vận đơn cho người bán**: Cho phép người bán nhập và cập nhật mã vận đơn GHN trực tiếp trên thẻ đơn hàng tại Kênh người bán.
* **Tự động tạo link tra cứu GHN**: Hệ thống tự động chuyển đổi mã vận đơn thành đường dẫn tra cứu trực tuyến tại GHN (`https://ghn.vn/blogs/trang-thai-don-hang?v=...`).
* **Thông báo cập nhật mã vận đơn**: Tự động gửi thông báo thời gian thực đến người mua khi người bán cập nhật mã vận đơn, kèm theo mã và hướng dẫn tra cứu.

### Changed
* **Hiển thị thông tin vận chuyển cho người mua**: 
  - Cập nhật thẻ đơn hàng trong trang Cá nhân (`/profile`) để hiển thị mã vận đơn và nút "Theo dõi tại GHN".
  - Nâng cấp trang Hoàn tất đơn hàng (`/checkout/success`) để hiển thị thông tin vận đơn và tích hợp nút tra cứu trực tiếp vào hành động "Theo dõi đơn hàng".
* **Mở rộng Order Store**: Thêm action `updateTrackingCode` hỗ trợ cập nhật dữ liệu đồng bộ trên Firestore và local state.

---

## [0.7.0] - 2026-06-10

### Tích hợp cổng thanh toán VNPay Sandbox & Tối ưu hóa luồng Đơn hàng (VNPay Sandbox Payment Gateway Integration & Order Workflow Optimization)

### Added
* **Tích hợp cổng thanh toán VNPay Sandbox**: Hỗ trợ 3 phương thức thanh toán trực tuyến qua cổng VNPay Sandbox:
  - *Thanh toán online qua VNPay (vnpay)*: Cho phép người dùng quét mã QR, thanh toán bằng thẻ ATM nội địa hoặc thẻ quốc tế trực tiếp trên cổng VNPay.
  - *Thẻ Visa / Mastercard (credit)*: Chuyển hướng trực tiếp đến VNPay Sandbox với tuỳ chọn thẻ quốc tế (`vnp_BankCode: "INTCARD"`).
  - *Ví điện tử (wallet)*: Chuyển hướng trực tiếp đến VNPay Sandbox với tuỳ chọn thanh toán quét mã QR (`vnp_BankCode: "VNPAYQR"`).
* **Cơ chế thanh toán 2 bước an toàn (Two-Step Order Placement)**:
  - Khi chọn phương thức thanh toán online (VNPay, Credit, Wallet), thông tin đơn hàng tạm thời được lưu trong collection `"pending_orders"` trên Firestore với trạng thái `"pending"`.
  - Đơn hàng chính thức trong collection `"orders"` chỉ được tạo sau khi thanh toán thành công (nhận kết quả response code `"00"`), đảm bảo **không tạo đơn hàng khi thanh toán thất bại hoặc bị hủy**.
* **Đường dẫn Callback & xử lý kết quả (`src/app/checkout/vnpay-return/page.tsx`)**:
  - Giao diện Landing page hiển thị trạng thái đang xử lý xác thực, tự động gọi API xác thực chữ ký bảo mật từ server.
  - Nếu thành công: tự động xóa sản phẩm đã mua khỏi giỏ hàng (`removePurchasedItems`), tạo đơn hàng và chuyển hướng sang trang thành công `/checkout/success`.
  - Nếu bị hủy (Response code `"24"`): hiển thị màn hình thông báo hủy, giữ nguyên giỏ hàng để người dùng thao tác lại.
  - Nếu lỗi khác: hiển thị màn hình lỗi thanh toán thất bại, giữ nguyên giỏ hàng.
* **Server-side API Routes cho VNPay**:
  - `/api/vnpay/create-payment`: Tạo URL thanh toán VNPay bằng thuật toán ký bảo mật HMAC-SHA512 của danh sách tham số đã được sắp xếp theo bảng chữ cái.
  - `/api/vnpay/verify-payment`: Xác thực mã Hash chữ ký trả về từ VNPay, xử lý lưu đơn hàng chính thức lên Firestore và tạo thông báo (Notifications) cho người mua và người bán.
  - `/api/vnpay/ipn`: Webhook xác nhận giao dịch tự động server-to-server (Instant Payment Notification) để đảm bảo đồng bộ trạng thái đơn hàng khi người dùng đóng trình duyệt đột ngột.

### Changed
* **Cập nhật trang thanh toán (`src/app/checkout/page.tsx`)**: Tích hợp các tùy chọn thanh toán trực tuyến vào menu và chuyển hướng sang API khởi tạo thanh toán VNPay.
* **Trang xác nhận thành công (`src/app/checkout/success/page.tsx`)**: Hiển thị nhãn thanh toán trực tuyến phù hợp và kết xuất trực tiếp Mã giao dịch VNPay (`vnp_TransactionNo`) nếu có.
* **Trang thông tin cá nhân (`src/app/profile/page.tsx`)**: Cập nhật lịch sử đơn hàng để hiển thị nhãn phương thức thanh toán tương ứng và mã giao dịch VNPay.
* **Cấu trúc dữ liệu đơn hàng (`src/types/order.ts`)**: Mở rộng thuộc tính `payment_status`, `vnp_TransactionNo`, và `vnp_ResponseCode` trong interface `Order`.

### Verification
* **Type Safety & Build**: Chạy lệnh `npm run build` thành công, các kiểm tra kiểu TypeScript của route API và frontend đều vượt qua không lỗi.

---

## [0.6.8] - 2026-06-09

### Admin xử lý báo cáo vi phạm, Lịch sử Hoạt động & Mở khóa Shop (Admin Violation Reports Handling, Audit Logs & Shop Unblocking)

### Added
* **Hộp thoại xử lý báo cáo vi phạm (`ReportDetailsModal` in `src/app/admin/page.tsx`)**: Admin có thể xem chi tiết đối tượng bị báo cáo (cửa hàng/sản phẩm), lý do, người báo cáo và nội dung chi tiết.
* **4 hành động xử lý vi phạm trong Modal**:
  - *Bỏ qua (Dismiss)*: Đổi trạng thái báo cáo thành `"dismissed"`.
  - *Cảnh báo (Warn)*: Gửi thông báo cảnh báo trực tiếp về tài khoản người bán.
  - *Khóa tạm (Block)*: Chuyển trạng thái sản phẩm sang `"blocked"`, hoặc chuyển trạng thái shop sang `"blocked"` (đồng thời tự động khóa toàn bộ sản phẩm của shop đó).
  - *Xóa vi phạm (Delete)*: Xóa sản phẩm khỏi Firestore; hoặc hạ quyền shop về buyer (trạng thái `"rejected"`) và xóa toàn bộ sản phẩm của shop đó.
* **Bảng Lịch sử hoạt động Admin (Admin Activity Logs)**: Hiển thị danh sách nhật ký hành động của Admin được lưu trong collection `"adminLogs"` trên Firestore.
* **Nút "Mở khóa Shop" trong danh sách người dùng**: Cho phép Admin khôi phục hoạt động cho shop bị khóa tạm thời (`sellerStatus` chuyển lại thành `"approved"`), mở khóa tất cả sản phẩm của shop đó và gửi thông báo hệ thống thông báo cho người bán.

### Changed
* **Lọc và bảo vệ storefront cho shop/sản phẩm bị khóa**:
  - Ẩn toàn bộ sản phẩm của các shop bị khóa hoặc sản phẩm có trạng thái `"blocked"` khỏi trang danh sách sản phẩm.
  - Chặn người mua truy cập trực tiếp vào trang chi tiết của sản phẩm bị khóa hoặc sản phẩm thuộc shop bị khóa (hiển thị thông báo không tìm thấy sản phẩm).
* **Cảnh báo và hạn chế Kênh người bán**: Hiển thị banner cảnh báo tài khoản bị khóa trong trang `/profile` của người bán và chặn các hành động quản lý sản phẩm.
* **Tối ưu hóa ghi đè Firestore (`src/store/report-store.ts`)**: Sửa lỗi Firestore write failure bằng cách loại bỏ các thuộc tính có giá trị `undefined` thông qua `Object.fromEntries(Object.entries(data).filter(([_, v]) => v !== undefined))` trước khi đẩy lên Firebase.

### Verification
* **Type Safety & Build**: Chạy lệnh `npx tsc --noEmit` và `npm run build` thành công, đảm bảo code hoàn toàn sạch lỗi.

---

## [0.6.7] - 2026-06-09

### Quy trình phê duyệt sản phẩm tự đăng của Người bán (Admin Product Approvals Workflow)

### Added
* **Hộp thoại duyệt sản phẩm của Admin (`ProductDetailsModal` in `src/app/admin/page.tsx`)**: Modal chi tiết hiển thị toàn bộ thông tin sản phẩm (mô tả, giá, tồn kho, nguồn gốc, nhãn hữu cơ) và thư viện ảnh sản phẩm đầy đủ để admin xem xét trước khi phê duyệt.
* **Hộp thoại nhập lý do từ chối sản phẩm**: Admin có thể chọn từ chối sản phẩm và nhập lý do không phê duyệt sản phẩm.
* **Phân tách danh sách duyệt tại Dashboard Admin**: Tích hợp thanh tab chuyển đổi mượt mà giữa "Duyệt Người Bán" và "Duyệt Sản Phẩm" ngay trong cột hàng đợi kiểm duyệt để tối ưu hóa không gian hiển thị.
* **Cột trạng thái sản phẩm trong Kênh người bán (`src/app/profile/page.tsx`)**: Bổ sung cột "Trạng thái" hiển thị trạng thái sản phẩm hiện tại:
  - *Chờ duyệt (Pending)*: Badge màu Amber chuyển động.
  - *Bị từ chối (Rejected)*: Badge màu Rose kèm lý do từ chối cụ thể ngay dưới trạng thái.
  - *Đang bán (Active)*: Badge màu Emerald.
* **Cơ chế tự động gửi thông báo duyệt**: Gửi thông báo hệ thống về tài khoản người bán khi sản phẩm được duyệt hoặc bị từ chối kèm lý do cụ thể.

### Changed
* **Lọc sản phẩm trên cửa hàng công khai (`src/lib/products.ts`)**: Cập nhật hàm `getAllProducts()` mặc định ẩn các sản phẩm chưa duyệt (`pending` hoặc `rejected`). Tích hợp tham số `includeInactive = true` cho phép Admin và Seller xem toàn bộ sản phẩm của mình.
* **Bảo vệ trang chi tiết sản phẩm (`src/app/products/[id]/page.tsx`)**: Chặn truy cập trực tiếp của khách mua hàng thông thường đến trang chi tiết của sản phẩm đang chờ duyệt hoặc bị từ chối (hiển thị thông báo Không tìm thấy), ngoại trừ chủ sản phẩm và Admin.
* **Tự động chuyển đổi trạng thái khi sửa sản phẩm**: Khi người bán cập nhật sản phẩm đang ở trạng thái `rejected`, trạng thái sản phẩm sẽ tự động chuyển về `pending` và làm sạch lý do từ chối cũ để đợi kiểm duyệt lại.

### Verification
* **Type Safety & Build**: Chạy lệnh `npx tsc --noEmit` thành công (exit code 0).

---

## [0.6.6] - 2026-06-09

### Quy trình kiểm duyệt, Giao diện 3 trạng thái của Người bán & Quy trình gửi lại hồ sơ (Seller Registration Audit, UI States & Resubmission Flow)

### Added
* **Giao diện 3 trạng thái trực quan cho người bán (`src/app/profile/page.tsx`)**: Thiết kế lại giao diện phân tách rõ ràng theo 3 trạng thái với phong cách UI cao cấp:
  * *Chờ duyệt (Pending)*: Sử dụng tông màu Hổ phách (Amber), biểu tượng đồng hồ cát chuyển động chậm kèm lưới thông tin chi tiết hồ sơ.
  * *Bị từ chối (Rejected)*: Sử dụng tông màu Hồng/Đỏ (Rose/Red), hiển thị banner cảnh báo, lý do từ chối cụ thể và nút bấm để xử lý lại hồ sơ.
  * *Đã duyệt (Approved)*: Mở khóa toàn bộ Kênh người bán (Seller Dashboard) với đầy đủ thống kê, quản lý sản phẩm và đơn hàng.
* **Cơ chế tải lại dữ liệu (Resubmit Flow)**: Bổ sung nút "Chỉnh sửa & gửi lại hồ sơ" trong giao diện Bị từ chối, hỗ trợ người bán đưa dữ liệu đã điền trước đó ngược trở lại biểu mẫu để chỉnh sửa nhanh.
* **Hộp thoại xem chi tiết hồ sơ chờ duyệt (`SellerDetailsModal` in `src/app/admin/page.tsx`)**: Thiết kế modal chi tiết cho phép Admin kiểm tra thông tin cửa hàng, thông tin nông trại (kèm danh sách ảnh thực tế), xem tài khoản ngân hàng và xem ảnh thẻ CCCD mặt trước/sau (hỗ trợ zoom/preview ảnh đầy đủ qua overlay).
* **Hộp thoại nhập lý do từ chối**: Admin có thể chọn "Từ chối" để mở modal phụ nhập lý do từ chối.
* **Thông báo về tài khoản người bán**: Tự động gửi thông báo thuộc loại `account_update` kèm lý do từ chối cho người bán khi hồ sơ bị từ chối.

### Changed
* **Đồng bộ hóa logic kiểm tra quyền người bán**: Điều chỉnh điều kiện kiểm tra để hiển thị menu Kênh người bán, các bước chỉ báo (step indicators) và nội dung Dashboard dựa trên cả hai điều kiện: `currentUser.role === "seller"` HOẶC `currentUser.sellerStatus === "approved"`.
* **Dọn dẹp mã nguồn client-side**: Loại bỏ hook `approveSeller` khỏi phần destructuring ở đầu file `page.tsx` do quy trình duyệt đã được chuyển giao hoàn toàn cho phía Admin.
* **Mở rộng mô hình dữ liệu User (`src/types/user.ts`)**: Bổ sung giá trị `"rejected"` vào trạng thái người bán (`sellerStatus`) và thêm trường `sellerRejectionReason?: string` để lưu lý do từ chối.
* **Cập nhật State Store (`src/store/auth-store.ts`)**: Cập nhật hàm `approveSeller` và `registerSeller` để làm sạch lý do từ chối (`sellerRejectionReason: ""`), tránh giữ lại dữ liệu cũ khi phê duyệt hoặc gửi lại hồ sơ.
* **Sửa lỗi co hẹp modal trang Admin (`src/app/admin/page.tsx`)**: Đưa các modal (`SellerDetailsModal` và modal nhập lý do từ chối) ra ngoài thẻ container hoạt ảnh `.page-enter` để khắc phục lỗi modal bị bóp nghẹt kích thước theo chiều dọc.

### Removed
* **Gỡ bỏ tính năng giả lập tự động phê duyệt**: Xóa bỏ hoàn toàn khối chức năng "Khu vực thử nghiệm / Demo Helper" (Simulation helper card) và nút bấm phê duyệt nhanh ở client-side trong giao diện Chờ duyệt. Quy trình phê duyệt/từ chối hiện tại bắt buộc phải xử lý thủ công bởi Admin tại `/admin`.

### Verification
* **Type Safety & Build**: Chạy lệnh `npx tsc --noEmit` và `npm run build` thành công, hệ thống đảm bảo an toàn kiểu dữ liệu và đóng gói thành công (exit code 0).
* **Linter**: `npm run lint` hoàn thành không lỗi.

---

## [0.6.5] - 2026-06-09

### Nâng cấp Admin Dashboard: KPI thực tế từ Firestore & Biểu đồ Line tương tác lọc 7/30 ngày

### Added
* **Lọc khoảng thời gian cho biểu đồ**: Bổ sung bộ lọc thời gian cho phép chuyển đổi linh hoạt giữa 7 ngày qua và 30 ngày qua trên biểu đồ hiệu suất nền tảng.
* **Chuyển đổi chỉ số hiển thị (Metric Toggle)**: Cho phép chuyển đổi xem biểu đồ theo **Doanh thu** (VND, màu xanh lá) hoặc **Số đơn hàng** (màu xanh dương).
* **Tooltip nổi tương tác động**: Khi hover chuột lên từng điểm dữ liệu trên biểu đồ SVG, hiển thị tooltip dạng HTML bay chứa thông tin chi tiết về Ngày cụ thể (dạng `DD/MM/YYYY`), Doanh thu (VND định dạng chuẩn) và Số đơn hàng tương ứng.
* **Đường chỉ hướng dọc & Vòng tròn chỉ điểm**: Vẽ đường nét đứt chạy dọc theo toạ độ X của điểm đang hover và phóng to vòng tròn dữ liệu khi hover để mang lại trải nghiệm chuyên nghiệp.

### Changed
* **Thẻ thống kê KPI dựa trên Firestore thật**: Thay thế các thẻ cũ bằng 4 thẻ KPI đáp ứng đúng Acceptance Criteria:
  - **Tổng người dùng**: Tổng số tài khoản đăng ký trên Firestore.
  - **Seller chờ**: Số lượng người bán đang chờ duyệt (`sellerStatus === "pending"`).
  - **Đơn hôm nay**: Đếm số đơn hàng được tạo trong ngày hôm nay ở múi giờ local của trình duyệt.
  - **Doanh thu**: Tính tổng tiền từ tất cả đơn hàng trên Firestore (ngoại trừ các đơn hàng bị hủy `"cancelled"`).
* **Vẽ biểu đồ SVG Line tuỳ biến**: Vẽ biểu đồ dạng SVG không cần thư viện ngoài, tối ưu hiệu năng và tránh lỗi hydration. Hỗ trợ hiển thị responsive theo tỷ lệ khung hình `800/350` và tô màu gradient mượt mà dưới đường vẽ.
* **Tự động giãn cách nhãn ngày trục X**: Khi xem chế độ 30 ngày, chỉ hiển thị nhãn trục X sau mỗi 5 ngày và ngày cuối cùng để giữ giao diện sạch đẹp, không bị chồng chéo văn bản.
* **Tối ưu hoá truy vấn Firestore**: Loại bỏ hoàn toàn việc truy vấn số lượng sản phẩm (`productsCount`) và số lượng shop (`shopsCount`) không sử dụng trên trang quản trị, giúp giảm số lượng Firestore reads và tăng tốc độ phản hồi của trang.

### Verification
* Lệnh kiểm tra kiểu dữ liệu `npx tsc --noEmit` hoàn thành không lỗi.
* Lệnh linter `npm run lint` chạy thành công, 0 lỗi và 0 cảnh báo trong file `src/app/admin/page.tsx`.

---

## [0.6.4] - 2026-06-09

### Xác thực Admin và Trang Quản trị (/admin)

### Added
* **Kiểu dữ liệu Admin (`src/types/user.ts`)**:
  - Bổ sung vai trò `"admin"` vào danh sách các role hợp lệ trong interface `User`.
* **Đồng bộ Cookie tự động (`src/store/auth-store.ts`)**:
  - Triển khai helper functions `setCookie` và `deleteCookie` ở phía Client.
  - Cập nhật hàm `initAuth`, `login`, và `logout` để tự động ghi nhận cookie `user-role` và `user-id`. Điều này giúp Next.js Middleware ở Edge runtime có thể đọc trạng thái phiên đăng nhập.
* **Tài khoản Demo Admin (`src/store/auth-store.ts`)**:
  - Thêm cơ chế tự động kiểm tra và đăng ký tài khoản Demo Admin `admin@nongsach.vn` / `12345678`. Tài khoản này sẽ tự động được gán role `"admin"` trên Firestore khi đăng nhập lần đầu.
* **Next.js Edge Middleware bảo vệ Route (`src/middleware.ts`)**:
  - Tạo mới Middleware chạy ở cấp độ Edge để chặn truy cập trái phép vào tất cả các route bắt đầu bằng `/admin`.
  - Chuyển hướng người dùng chưa đăng nhập về trang `/login?redirect=/admin`.
  - Chuyển hướng người dùng đã đăng nhập nhưng không phải admin về trang chủ `/`.
* **Trang Quản trị Admin Panel (`src/app/admin/layout.tsx`, `src/app/admin/page.tsx`)**:
  - Xây dựng Layout riêng cho trang Admin với Sidebar điều hướng, Header hiển thị thông tin tài khoản Admin và nút đăng xuất.
  - Trang Dashboard thống kê số lượng người dùng, cửa hàng, sản phẩm và duyệt các hồ sơ người bán đang chờ xử lý (`pending` thành `approved` hoặc `rejected`).
* **Lối tắt truy cập nhanh trên Header (`src/components/layout/Header.tsx`)**:
  - Hiển thị nút "Trang quản trị" trên Header (cả phiên bản Desktop và Mobile menu) cho tài khoản có vai trò `"admin"`.

### Changed
* **Ẩn Header và Footer cửa hàng trên route Admin (`src/components/layout/Header.tsx`, `src/components/layout/Footer.tsx`)**:
  - Cập nhật Header và Footer để tự động ẩn (`return null`) khi người dùng truy cập các đường dẫn thuộc `/admin`.
* **Khắc phục lỗi Linter trong Admin Dashboard (`src/app/admin/layout.tsx`, `src/app/admin/page.tsx`)**:
  - Thay đổi việc gọi `setState` đồng bộ trong `useEffect` (gây lỗi `set-state-in-effect`) bằng cách bao bọc qua `window.setTimeout`.
  - Loại bỏ các biến không sử dụng (`activeSellers`, `activeBuyers`) trong Dashboard Page.

### Verification
* `npx tsc --noEmit` hoàn thành không lỗi.
* `npm run lint` chạy thành công với 0 lỗi (0 errors).

---

## [0.6.3] - 2026-06-07

### Tối ưu thông báo người bán và hiển thị chi tiết đánh giá/đơn hàng

### Added
* **Bảng con xem chi tiết đánh giá trong thông báo shop (`src/app/profile/page.tsx`, `src/types/notification.ts`)**:
  - Thêm metadata cho thông báo đánh giá gồm `actionType: "review_detail"`, `reviewId` và `productId`.
  - Với thông báo **Đánh giá sản phẩm mới**, thay nút `Xem đơn hàng` bằng nút `Xem đánh giá`.
  - Khi bấm `Xem đánh giá`, mở bảng con ngay trong tab Thông báo để hiển thị ảnh sản phẩm, tên sản phẩm, mã đơn hàng, số sao, nội dung đánh giá và ảnh đánh giá nếu có.
  - Với thông báo đánh giá cũ chưa có metadata, tự fallback lấy review theo `orderId`.
* **Hiển thị đánh giá ngay trong chi tiết đơn đã mua (`src/app/profile/page.tsx`, `src/lib/reviews.ts`)**:
  - Thêm `getReviewsByOrderId` để tải lại review theo mã đơn hàng.
  - Sau khi người mua đánh giá thành công, phần chi tiết đơn hàng hiển thị ngay số sao, bình luận và ảnh đánh giá dưới sản phẩm đã đánh giá.
* **Điều hướng thông báo đơn mới tới đúng đơn của shop (`src/app/profile/page.tsx`)**:
  - Với thông báo `Đơn mới`, nút thao tác chuyển sang `Kênh người bán > Đơn hàng của shop` thay vì trang `checkout/success`.
  - Truyền mã đơn qua URL dạng `/profile?tab=seller&sellerTab=orders&orderId={orderId}`.
  - Tự scroll tới đúng card đơn hàng theo `orderId`, highlight card bằng viền xanh và badge `Đơn từ thông báo`.
  - Trong card đơn hàng của shop, hiển thị danh sách sản phẩm khách đã mua gồm ảnh, tên, ID sản phẩm, số lượng và tổng tiền từng dòng.

### Changed
* **Fallback ảnh đánh giá khi Firebase Storage timeout (`src/lib/reviews.ts`, `src/app/profile/page.tsx`, `src/components/product/ProductDetail.tsx`)**:
  - Nếu upload ảnh đánh giá lên Firebase Storage bị timeout/retry limit, vẫn lưu ảnh đã nén dạng data URL vào review để trang chi tiết sản phẩm vẫn hiển thị ảnh.
  - Giảm kích thước ảnh đánh giá trước khi lưu xuống tối đa `640x640`, quality `0.72`.
  - Dùng `unoptimized` khi render ảnh đánh giá để tránh lỗi optimize với URL Firebase Storage hoặc data URL.

### Verification
* `npm.cmd run lint` hoàn thành thành công, còn các warning cũ không chặn build.
* `npx.cmd tsc --noEmit --incremental false` hoàn thành thành công.

---

## [0.6.2] - 2026-06-07

### Tích hợp Thông báo người bán khi có đánh giá sản phẩm mới

### Added
* **Thông báo đánh giá sản phẩm cho người bán (`src/app/profile/page.tsx`)**:
  - Tự động tạo và gửi thông báo hệ thống (`type: "system"`) đến tài khoản người bán (`sellerId`) khi sản phẩm thuộc gian hàng của họ nhận được đánh giá từ khách hàng.
  - Thông báo hiển thị chi tiết tên khách hàng, số sao, tên sản phẩm và mã đơn hàng liên quan.

---

## [0.6.1] - 2026-06-07

### Nâng cấp UX đánh giá sản phẩm và điều hướng từ đơn hàng

### Added
* **Tải ảnh đánh giá sản phẩm (`src/app/profile/page.tsx`, `src/lib/reviews.ts`, `src/types/review.ts`)**:
  - Cho phép người mua tải tối đa 5 ảnh khi gửi đánh giá sản phẩm trong modal đánh giá ở trang cá nhân.
  - Nén ảnh đánh giá trước khi lưu để giảm dung lượng upload.
  - Upload ảnh đánh giá lên Firebase Storage tại đường dẫn `reviews/{userId}/{orderId}_{productId}/...` trước khi ghi dữ liệu đánh giá vào Firestore.
  - Mở rộng kiểu dữ liệu `Review` với `productImage` và `images` để lưu ảnh sản phẩm gốc và danh sách ảnh đánh giá.
* **Bộ lọc đánh giá theo số sao (`src/components/product/ProductDetail.tsx`)**:
  - Thêm bộ lọc nhanh theo kiểu sàn thương mại điện tử: `Tất cả`, `5 sao`, `4 sao`, `3 sao`, `2 sao`, `1 sao`.
  - Hiển thị số lượng đánh giá tương ứng trên từng nút lọc.
  - Hiển thị trạng thái trống riêng khi mức sao được chọn chưa có đánh giá.

### Changed
* **Giao diện sao đánh giá (`src/app/profile/page.tsx`, `src/components/product/ProductDetail.tsx`)**:
  - Đổi sao chọn đánh giá trong modal sang ký tự sao đặc màu vàng đậm, giảm phụ thuộc vào icon font/emoji để tránh lỗi font.
  - Loại bỏ chuỗi emoji sao trong mô tả cảm xúc của modal đánh giá để hạn chế lỗi encoding.
* **Tính điểm trung bình sản phẩm (`src/components/product/ProductDetail.tsx`)**:
  - Giữ tính điểm trung bình dựa trên dữ liệu review thật trong Firestore.
  - Khi sản phẩm chưa có đánh giá, điểm trung bình hiển thị `0.0` thay vì fallback `5.0` để tránh gây hiểu nhầm.
* **Hiển thị ảnh đánh giá (`src/components/product/ProductDetail.tsx`)**:
  - Hiển thị các ảnh người mua đã tải lên trong từng thẻ đánh giá.
  - Cho phép bấm ảnh đánh giá để đổi ảnh đang xem ở gallery sản phẩm.
* **Điều hướng từ ảnh sản phẩm trong đơn hàng (`src/app/profile/page.tsx`, `src/app/checkout/success/page.tsx`)**:
  - Bọc ảnh sản phẩm trong trang `Đơn hàng của tôi` bằng link tới trang chi tiết sản phẩm tương ứng.
  - Bọc cả ảnh sản phẩm trong phần chi tiết đơn hàng mở rộng bằng link tới chi tiết sản phẩm.
  - Bọc ảnh sản phẩm ở trang đặt hàng thành công bằng link tới chi tiết sản phẩm.
  - Chuẩn hóa ID sản phẩm trước khi điều hướng bằng cách loại bỏ hậu tố khối lượng như `-500g`, `-1kg`, `-2kg`.
* **Firebase Storage (`src/lib/firebase.ts`)**:
  - Tăng thời gian retry upload/operation của Firebase Storage lên 10 giây để ổn định hơn khi tải ảnh đánh giá.

### Verification
* `npm.cmd run lint` hoàn thành thành công, còn các warning cũ không chặn build.
* `npx.cmd tsc --noEmit --incremental false` hoàn thành thành công.

---

## [0.6.0] - 2026-06-07

### Tích hợp Chức năng Đánh giá sản phẩm & Sử dụng dữ liệu thật từ Firestore

### Added
* **Kiểu dữ liệu đánh giá (`src/types/review.ts`)**:
  - Định nghĩa interface `Review` để quản lý các trường của một đánh giá: `id` (`${orderId}_${productId}`), `productId`, `productName`, `userId`, `userName`, `rating`, `comment`, `orderId`, `createdAt`.
* **Thư viện Firestore cho đánh giá (`src/lib/reviews.ts`)**:
  - `addReview`: Lưu đánh giá mới vào Firestore collection `"reviews"`.
  - `getReviewsByProductId`: Lấy danh sách đánh giá của sản phẩm và sắp xếp theo thứ tự mới nhất.
  - `checkReviewedItems`: Kiểm tra xem các sản phẩm trong một đơn hàng đã được đánh giá chưa.
* **Giao diện đánh giá sản phẩm ở Trang cá nhân (`src/app/profile/page.tsx`)**:
  - Thêm nút **Đánh giá** bên cạnh mỗi sản phẩm trong chi tiết đơn hàng đã giao thành công (`status === "delivered"`).
  - Tích hợp Modal đánh giá (`ReviewModal`) hỗ trợ chọn số sao (1-5 sao trực quan) và nhập nội dung bình luận. Sau khi gửi, nút chuyển thành **Đã đánh giá** để ngăn chặn đánh giá lặp lại.

### Changed
* **Hiển thị đánh giá thực tế trên Trang chi tiết sản phẩm (`src/components/product/ProductDetail.tsx`)**:
  - Thay thế toàn bộ đánh giá và điểm số giả lập bằng dữ liệu thật từ collection `"reviews"` trong Firestore.
  - Tự động tính điểm trung bình (`averageRating`) và tổng số đánh giá (`reviewCount`) dựa trên dữ liệu thật thu thập được, đồng thời cập nhật giao diện hiển thị số sao động.
  - Hiển thị thông báo khi chưa có đánh giá nào cho sản phẩm.

### Verification
* Chạy thành công `npm run build` không có bất kỳ lỗi TypeScript hay lỗi biên dịch nào.

---

## [0.5.8] - 2026-06-07

### Cải thiện form đăng ký bán hàng và upload ảnh trang trại

### Changed
* **Form đăng ký bán hàng (`src/app/profile/page.tsx`)**:
  - Ghi rõ ảnh đại diện và ảnh bìa cửa hàng là tùy chọn, người bán có thể bổ sung sau khi hồ sơ được duyệt.
  - Tự động điền số điện thoại shop từ số điện thoại tài khoản nếu người dùng đã nhập khi đăng ký tài khoản.
  - Chuẩn hóa số điện thoại shop và số Zalo về định dạng `0xxxxxxxxx` trước khi validate và lưu hồ sơ, bao gồm trường hợp người dùng nhập dạng `+84` hoặc có khoảng trắng.
  - Bổ sung ghi chú rằng ảnh thực tế trang trại sẽ được upload lên Firebase Storage khi gửi hồ sơ hoặc cập nhật shop.
* **Upload ảnh người bán (`src/store/auth-store.ts`)**:
  - Tăng thời gian chờ upload ảnh lên Firebase Storage từ 3 giây lên 10 giây để ảnh trang trại có nhiều thời gian upload thành công hơn trước khi fallback.
  - Tiếp tục upload ảnh thực tế trang trại vào đường dẫn `sellers/{userId}/farmImages/...` trên Firebase Storage.

### Verification
* `npm.cmd run lint` hoàn thành thành công, còn các warning cũ không chặn build.
* `npx.cmd tsc --noEmit --incremental false` hoàn thành thành công.
* `npm.cmd run build` chưa hoàn tất do file `.next\trace` đang bị khóa bởi tiến trình/dev server hiện có.

---

## [0.5.7] - 2026-06-06

### Sửa lỗi gán sai mã định danh cửa hàng (Shop ID Fallback Bug)

### Fixed
* **Khắc phục lỗi tự động gán cửa hàng mặc định (`src/lib/shops.ts`)**:
  - Loại bỏ logic fallback tìm tài liệu đầu tiên trong Firestore khi không tìm thấy thông tin cửa hàng có ID tương ứng. Giờ đây `getShopById` sẽ trả về `null` ngay lập tức nếu không tìm thấy cửa hàng.
* **Đồng bộ hóa bất đồng bộ trong Store Giỏ hàng (`src/store/cart-store.ts`)**:
  - Nâng cấp `openOptionsModal` và `addToCart` sang bất đồng bộ (`async`) nhằm thực hiện phân giải và tự động điền `sellerId` và `shopName` từ cơ sở dữ liệu nếu thông tin bị thiếu từ sản phẩm, mặc định về `"admin"` và `"NôngSạch"` để tránh lỗi `undefined` trên Firestore khi tạo đơn hàng.
* **Đồng bộ liên kết dữ liệu cửa hàng thực tế (`src/components/product/ProductDetail.tsx`, `src/app/shop/[id]/page.tsx`)**:
  - Gắn và truyền trực tiếp thông tin `sellerId` và `shopName` từ đối tượng cửa hàng đang hiển thị vào sản phẩm trước khi mở modal tùy chọn mua hàng, giúp bỏ qua các truy vấn bổ sung và giữ độ chính xác tối đa về nguồn gốc gian hàng.

### Verification
* `npx tsc --noEmit` vượt qua hoàn toàn không lỗi.

---

## [0.5.6] - 2026-06-06

### Tích hợp Modal Chọn Lựa Chọn và Toast Thông Báo Khi Thêm Vào Giỏ Hàng

### Added
* **Modal chọn tùy chọn trước khi thêm vào giỏ hàng (`src/components/cart/CartOptionsModal.tsx`)**:
  - Khi nhấn "Thêm giỏ" hoặc "Thêm vào giỏ hàng" ở bất kỳ trang nào, hệ thống sẽ hiển thị một modal lớp phủ.
  - Cho phép người dùng chọn khối lượng: `500g` (giá x0.5), `1kg` (giá x1.0), `2kg` (giá x2.0).
  - Tích hợp bộ chọn số lượng có giới hạn theo tồn kho (`product.stock`) kèm tính năng tự động hiển thị số lượng còn lại.
  - Tính toán số tiền tạm tính theo khối lượng và số lượng được chọn trong thời gian thực.
  - Thao tác: "Thêm vào giỏ" và "Mua ngay" (tự động thêm sản phẩm và chuyển hướng sang trang checkout).
* **Toast thông báo thêm thành công ở góc dưới bên phải (`src/components/cart/CartAddedToast.tsx`)**:
  - Hiển thị thông báo Toast trượt mượt mà từ góc phải (`animate-slide-in`).
  - Hiển thị tóm tắt sản phẩm bao gồm ảnh thu nhỏ, tên kèm hậu tố khối lượng (ví dụ `Cà chua hữu cơ (500g)`), và số lượng đã thêm.
  - Cung cấp hai nút thao tác nhanh: "Xem giỏ hàng" (chuyển hướng sang `/cart`) và "Tiếp tục mua" (đóng thông báo Toast).
  - Tự động đóng sau 5 giây hoặc khi bấm nút đóng (x).

### Changed
* **Mở rộng Store Giỏ hàng Zustand (`src/store/cart-store.ts`)**:
  - Thêm state và actions quản lý Modal (`isOptionsModalOpen`, `activeProductForModal`, `defaultQuantityForModal`, `openOptionsModal`, `closeOptionsModal`).
  - Thêm state và actions quản lý Toast (`isAddedToastOpen`, `addedItemForToast`, `openAddedToast`, `closeAddedToast`).
  - Thêm `addToCartWithOptions` thực hiện phân tách các sản phẩm cùng ID nhưng có khối lượng khác nhau thành các dòng sản phẩm riêng biệt trong giỏ hàng (bằng cách cập nhật `productId` thành `${id}-${weight}` và bổ sung hậu tố vào tên).
  - Cập nhật `addToCart` cũ tự động ánh xạ lại thành mặc định `1kg`, số lượng 1 để tương thích ngược với luồng mua lại đơn hàng trước.
* **Tích hợp components toàn cục (`src/app/layout.tsx`)**:
  - Gắn `<CartOptionsModal />` và `<CartAddedToast />` trực tiếp trong Layout gốc để các sự kiện thêm giỏ hàng hoạt động thông suốt từ tất cả các trang.
* **Thay thế cơ chế thêm trực tiếp thành mở modal (`ProductCard.tsx`, `ProductDetail.tsx`, `src/app/shop/[id]/page.tsx`)**:
  - Cập nhật toàn bộ các nút "Thêm giỏ" trên danh sách sản phẩm, trang chi tiết sản phẩm và danh mục sản phẩm của từng shop sang kích hoạt modal cấu hình thay vì thêm trực tiếp ngay lập tức.
  - Đồng bộ số lượng được điều chỉnh trước ở trang chi tiết sản phẩm trực tiếp vào trường số lượng mặc định trong modal.
* **Nhóm giỏ hàng theo gian hàng bán (`src/app/cart/page.tsx`)**:
  - Gom các sản phẩm trong giỏ hàng có chung tên cửa hàng (`item.shopName`) hiển thị trong một khung chung có tiêu đề "Gian hàng của [Tên Shop]" kèm biểu tượng cửa hàng thay vì hiển thị các nhãn badge rời rạc, cải thiện cấu trúc thị giác và UX.

---

## [0.5.5] - 2026-06-06

### Tái Cấu Trúc Bố Cục Checkout & Sửa Lỗi Hiển Thị Sizing Tailwind v4

### Changed
* **Gộp các khối thông tin tại Checkout (`src/app/checkout/page.tsx`)**:
  * Gộp 3 phần riêng biệt ("Thông tin giao hàng", "Phương thức giao hàng", "Phương thức thanh toán") thành duy nhất một thẻ tổng hợp "Thông tin giao hàng" để giao diện gọn gàng hơn.
* **Chuyển lựa chọn sang dạng Dropdown (`src/app/checkout/page.tsx`)**:
  * Thay thế các nút radio to và cồng kềnh cho phương thức giao hàng và thanh toán thành 2 thẻ `<select>` dropdown nằm song song nhau (bố cục 2 cột).
  * Đồng bộ hóa giao diện của các thẻ dropdown này với thiết kế chung của toàn bộ form (`inputClass()`).
* **Đồng bộ hóa Real-time Thanh tiến trình (Stepper Timeline) (`src/app/checkout/success/page.tsx`)**:
  * Cập nhật các bước tiến trình đơn hàng ("Đặt hàng", "Đóng gói", "Đang giao", "Đã nhận") và các đường nối giữa chúng tự động thay đổi màu sắc xanh (active)/xám (inactive) theo thời gian thực dựa vào trạng thái Firestore đơn hàng `order?.status`.

### Fixed
* **Khắc phục lỗi co hẹp chiều rộng (Squeezed Container Bug) (`src/app/checkout/page.tsx`, `src/app/seed/page.tsx`)**:
  * Do hệ thống định nghĩa tỷ lệ khoảng cách tùy chỉnh trong Tailwind v4 (ví dụ `--spacing-lg: 40px`, `--spacing-sm: 16px`), các lớp `max-w-lg`, `max-w-sm` và `max-w-md` bị hiểu sai thành giới hạn cực kỳ hẹp (tương ứng 40px, 16px, 24px).
  * Đã chuyển đổi các lớp này thành kích thước pixel tuyệt đối: `max-w-[512px]` cho hộp thoại chọn địa chỉ, `max-w-[384px]` cho thông báo Toast, và `max-w-[448px]` cho khung thẻ seed dữ liệu.

### Verification
* Dự án chạy thành công `npm run build` hoàn toàn không có lỗi.

---

## [0.5.4] - 2026-06-06

### Tối ưu hóa Luồng Cập Nhật Profile & Đăng Ký Tài Khoản & Cải Thiện UX Checkout

### Added
* **Lưu số điện thoại khi đăng ký (`src/app/register/page.tsx`, `src/store/auth-store.ts`)**:
  * Lưu trữ thông tin số điện thoại của người dùng trực tiếp vào Firestore ngay khi đăng ký tài khoản thành công.
* **Chế độ xem trước & Nút Sửa thông tin cá nhân (`src/app/profile/page.tsx`)**:
  * Thêm trạng thái `isEditing` để khóa/mở các trường thông tin cá nhân.
  * Chỉ cho phép chỉnh sửa thông tin sau khi nhấn nút "Sửa thông tin".
  * Thêm nút "Hủy" để khôi phục dữ liệu ban đầu nếu không muốn thay đổi.
  * Ngăn ngừa lỗi xung đột React DOM reconciliation khiến form tự động gửi đi khi nhấn nút chỉnh sửa bằng cách thêm `key` định danh riêng cho các nút thao tác.
* **Tự động điền số điện thoại & địa chỉ mặc định tại Checkout (`src/app/checkout/page.tsx`)**:
  * Tự động lấy số điện thoại của người dùng đang đăng nhập điền vào form thanh toán.
  * Tự động điền địa chỉ giao hàng mặc định (bao gồm Tỉnh/Thành phố, Quận/Huyện, Địa chỉ cụ thể) của người dùng nếu họ đã lưu địa chỉ trong trang cá nhân.
* **Nút & Modal "Chọn địa chỉ khác" tại Checkout (`src/app/checkout/page.tsx`)**:
  * Nếu người dùng có trên 1 địa chỉ đã lưu, hiển thị nút "Chọn địa chỉ khác" mở ra một modal danh sách địa chỉ nhận hàng để chuyển đổi nhanh chóng và tiện lợi.
* **Hiệu ứng trượt Toast Notification (`src/app/globals.css`)**:
  * Bổ sung `@keyframes slide-in` và class `.animate-slide-in` trong CSS toàn cục để mang lại hoạt ảnh mượt mà cho thông báo lỗi.

### Changed
* **Tối ưu hóa UI của ô chọn Giới tính (`src/app/profile/page.tsx`)**:
  * Tăng độ rõ nét (100% opacity, scale 1.05, bold label) cho tùy chọn giới tính được chọn ở chế độ xem (khi disable).
  * Làm mờ các tùy chọn chưa được chọn (30% opacity) để dễ dàng phân biệt.
* **Tối ưu hóa độ phình trang bằng thẻ địa chỉ rút gọn (`src/app/checkout/page.tsx`)**:
  * Thay vì luôn hiển thị toàn bộ biểu mẫu nhập thông tin địa chỉ dài dòng, trang sẽ mặc định hiển thị thẻ địa chỉ tóm tắt rút gọn khi phát hiện địa chỉ có sẵn, giúp tối ưu hóa chiều cao trang và tập trung UX.
* **Chuyển đổi thông báo lỗi nhập thiếu tại Checkout (`src/app/checkout/page.tsx`)**:
  * Thay thế các nhãn văn bản báo lỗi màu đỏ nằm dưới các trường nhập liệu bằng thông báo Toast góc trên bên phải màn hình để tối ưu hóa trải nghiệm người dùng (UX).
* **Dọn dẹp code & Cảnh báo linter (`src/app/checkout/page.tsx`)**:
  * Loại bỏ state `provinceMessage` không dùng đến để tránh cảnh báo của ESLint, đồng thời chuyển lỗi tải API tỉnh/thành phố sang thông báo qua Toast.

### Fixed
* **Sửa lỗi cập nhật profile (`src/store/auth-store.ts`)**:
  * Sử dụng helper `removeUndefinedFields` trước khi cập nhật document lên Firestore để loại bỏ hoàn toàn lỗi "Unsupported field value: undefined" liên quan đến trường `gender`.

### Verification
* `npx tsc --noEmit` hoàn thành thành công không lỗi.
* `npm run lint` hoàn thành thành công chỉ với 10 cảnh báo tĩnh cũ (không có lỗi hay cảnh báo mới trên trang checkout).

---

## [0.5.4] - 2026-06-06

### Đồng bộ giỏ hàng lên CSDL và checkout theo sản phẩm được chọn

### Added
* **Lưu giỏ hàng lên Firestore (`src/store/cart-store.ts`, `src/components/layout/AuthInitializer.tsx`)**:
  * Bổ sung cơ chế lưu giỏ hàng theo tài khoản tại collection `carts`.
  * Tự động subscribe giỏ hàng theo `currentUser.id` sau khi đăng nhập để đồng bộ giỏ hàng giữa các phiên/trình duyệt.
  * Lưu cả danh sách sản phẩm trong giỏ và danh sách sản phẩm đang được chọn mua.
* **Chọn sản phẩm cần mua trong giỏ hàng (`src/app/cart/page.tsx`)**:
  * Thêm checkbox cho từng sản phẩm trong giỏ hàng.
  * Thêm checkbox “Chọn tất cả sản phẩm”.
  * Hiển thị số lượng sản phẩm đã chọn trên tổng số sản phẩm trong giỏ.

### Changed
* **Tóm tắt đơn hàng trong giỏ hàng (`src/app/cart/page.tsx`)**:
  * Tạm tính, giảm giá và tổng cộng chỉ tính các sản phẩm đang được chọn mua.
  * Nút checkout bị vô hiệu hóa khi chưa chọn sản phẩm nào.
* **Luồng thanh toán (`src/app/checkout/page.tsx`)**:
  * Checkout chỉ tạo đơn hàng từ các sản phẩm đã chọn trong giỏ.
  * Trang thanh toán chỉ hiển thị các sản phẩm đã chọn.
  * Sau khi đặt hàng thành công, chỉ xóa các sản phẩm đã được mua khỏi giỏ hàng.
  * Các sản phẩm không được chọn mua vẫn được giữ lại trong giỏ hàng và tiếp tục được lưu trên Firestore.
* **Modal thêm giỏ hàng (`src/components/cart/CartOptionsModal.tsx`)**:
  * Điều chỉnh reset state khi mở modal để phù hợp với rule React compiler hiện tại.

### Verification
* `npm run lint` hoàn thành thành công, còn các warning cũ không chặn build.
* `npm run build` hoàn thành thành công, còn warning hiện có từ Next.js/Firebase/protobuf và workspace root.

---

## [0.5.3] - 2026-06-06

### Đồng bộ Notification đơn hàng realtime và hiển thị đầy đủ trạng thái giao hàng

### Added
* **Realtime Notification theo tài khoản (`src/store/notification-store.ts`, `src/components/layout/AuthInitializer.tsx`)**:
  * Chuyển Notification sang ghi và lắng nghe từ Firestore collection `notifications`.
  * Tự động subscribe Notification theo `currentUser.id` sau khi người dùng đăng nhập để người mua và người bán nhận thông báo đúng tài khoản, kể cả khi ở phiên/trình duyệt khác nhau.
* **Helper trạng thái đơn hàng (`src/lib/order-status.ts`)**:
  * Bổ sung metadata dùng chung cho các trạng thái `pending`, `confirmed`, `shipping`, `delivered`, `cancelled`.
  * Chuẩn hóa label, mô tả, icon và màu hiển thị cho từng trạng thái.

### Changed
* **Luồng đặt hàng (`src/app/checkout/page.tsx`)**:
  * Khi người mua đặt hàng, hệ thống chờ ghi Notification cho người bán trước khi điều hướng sang trang thành công.
  * Người bán nhận Notification `Đơn hàng mới` khi có đơn hàng cần xác nhận.
  * Người mua vẫn nhận Notification xác nhận đơn hàng đã được tiếp nhận.
* **Luồng cập nhật trạng thái của người bán (`src/app/profile/page.tsx`)**:
  * Khi người bán chuyển trạng thái đơn hàng sang `Đã xác nhận`, `Đang giao`, `Đã giao` hoặc `Đã hủy`, người mua nhận Notification tương ứng.
  * Nội dung Notification mô tả rõ tình trạng hiện tại của đơn hàng.
* **Hiển thị trạng thái đơn hàng phía người mua (`src/app/profile/page.tsx`)**:
  * Không còn gom các trạng thái chưa giao thành “Đang xử lý”.
  * Badge trạng thái trong danh sách đơn hàng hiển thị đúng từng bước: `Chờ xác nhận`, `Đã xác nhận`, `Đang giao`, `Đã giao`, `Đã hủy`.
* **Trang đặt hàng thành công / chi tiết đơn (`src/app/checkout/success/page.tsx`)**:
  * Lắng nghe realtime document đơn hàng từ Firestore bằng `onSnapshot`.
  * Phần “Trạng thái” cập nhật ngay theo trạng thái mới nhất của đơn hàng, kèm mô tả chi tiết.

### Verification
* `npm run lint` hoàn thành thành công, còn các warning cũ không chặn build.
* `npm run build` hoàn thành thành công, còn warning hiện có từ Next.js/Firebase/protobuf và workspace root.

---

## [0.5.2] - 2026-06-06

### Cải thiện Notification cho trạng thái tài khoản và đơn hàng

### Added
* **Loại thông báo tài khoản (`src/types/notification.ts`)**:
  * Bổ sung `account_update` vào `NotificationType` để phân biệt thông báo liên quan đến tài khoản với thông báo đơn hàng và hệ thống.
* **Thông báo trạng thái tài khoản bán hàng (`src/store/auth-store.ts`)**:
  * Tạo thông báo khi người dùng gửi hồ sơ đăng ký bán hàng thành công.
  * Tạo thông báo khi hồ sơ bán hàng được phê duyệt, giúp người dùng biết tài khoản đã được xác nhận và có thể bắt đầu quản lý cửa hàng.

### Changed
* **Tối ưu badge thông báo (`src/components/layout/NotificationBadge.tsx`)**:
  * Badge số lượng chưa đọc subscribe trực tiếp vào danh sách notification để cập nhật ngay khi có thông báo mới hoặc khi đánh dấu đã đọc.
* **Nâng cấp UX tab Thông báo (`src/app/profile/page.tsx`)**:
  * Sắp xếp thông báo mới nhất lên đầu và tính số thông báo chưa đọc từ dữ liệu đã memo hóa.
  * Bổ sung icon, nhãn loại thông báo và màu sắc riêng cho đơn hàng, đơn mới, tài khoản và hệ thống.
  * Hiển thị thời gian tương đối như “Vừa xong”, “5 phút trước”, “2 giờ trước”.
  * Thêm CTA “Xem đơn hàng” cho thông báo có `orderId`, đồng thời đánh dấu thông báo là đã đọc khi người dùng mở chi tiết đơn.
  * Chỉ hiển thị nút “Đánh dấu tất cả đã đọc” khi còn thông báo chưa đọc.

### Verification
* `npm run lint` hoàn thành thành công, còn các warning cũ không chặn build.
* `npm run build` hoàn thành thành công, còn warning hiện có từ Next.js/Firebase/protobuf và workspace root.

---

## [0.5.1] - 2026-06-06

###  Tính năng Theo dõi Cửa hàng Real-time (Real-time Follow Shop)

### Added
* **Thư viện Theo dõi (`src/lib/follows.ts`)**: 
  * Triển khai hàm `toggleFollow` để xử lý việc theo dõi/bỏ theo dõi một shop một cách nguyên tử (atomic).
  * Hàm `subscribeToFollowStatus` giúp lắng nghe trạng thái theo dõi của một người dùng đối với một shop cụ thể theo thời gian thực.
  * Hàm `subscribeToShopFollowers` giúp lắng nghe và cập nhật số lượng người theo dõi của shop ngay khi có thay đổi trên Firebase.
* **Quy trình Real-time trên Firebase**: Thiết lập cơ chế tự động chuyển đổi định dạng `followerCount` từ chuỗi (string) sang số (number) trong Firestore để hỗ trợ tính toán chính xác bằng `increment()`.

### Changed
* **Nâng cấp Trang Chi tiết Cửa hàng (`src/app/shop/[id]/page.tsx`)**:
  * Tích hợp các listener thời gian thực để cập nhật nút "Theo dõi" và số lượng người theo dõi ngay lập tức mà không cần tải lại trang.
  * Bổ sung ràng buộc xác thực: Yêu cầu người dùng đăng nhập mới có thể thực hiện hành động theo dõi.
  * Chặn hành động tự theo dõi chính shop của mình dành cho chủ sở hữu.
* **Đồng bộ hóa Auth Store (`src/store/auth-store.ts`)**: Khởi tạo trường `followerCount` là kiểu số (0) khi phê duyệt người bán mới để đảm bảo tính nhất quán của kiểu dữ liệu trên toàn hệ thống.

### Verification
* Chạy `npx tsc --noEmit` hoàn thành thành công.
* Kiểm tra thực tế: Nút Theo dõi cập nhật trạng thái và số lượng đồng bộ trên nhiều cửa sổ trình duyệt khác nhau thông qua Firebase Real-time listeners.

---

## [0.5.0] - 2026-06-06

### Nâng cấp hồ sơ Cửa hàng: Ảnh bìa, Avatar & Đồng bộ hóa Firebase toàn diện

### Added
* **Mở rộng Model Shop (`src/lib/shops.ts`)**: Bổ sung trường `coverImage` (ảnh bìa) vào giao diện dữ liệu Cửa hàng để hỗ trợ đầy đủ các thành phần nhận diện thương hiệu.
* **Tích hợp Ảnh bìa vào Đăng ký người bán (`src/app/profile/page.tsx`)**: Bổ sung mục tải lên và công cụ cắt ảnh (Crop) cho Banner cửa hàng ngay trong quy trình đăng ký 4 bước.

### Changed
* **Tối ưu hóa luồng đồng bộ Firebase (`src/store/auth-store.ts`)**:
  * Nâng cấp hàm `uploadSellerImages` để xử lý tải lên tự động cả **Avatar (Logo)** và **Ảnh bìa (Banner)** lên Firebase Storage.
  * Tự động đồng bộ hóa URL ảnh từ Storage vào cả hồ sơ người dùng (`users`) và tài liệu cửa hàng (`shops`) trên Firestore sau khi tải lên thành công.
  * Đảm bảo tính nhất quán dữ liệu: Khi phê duyệt người bán (`approveSeller`) hoặc cập nhật thông tin (`updateSellerInfo`), toàn bộ thông tin hình ảnh thực tế sẽ được cập nhật đồng thời trên hệ thống.
* **Nâng cấp tính năng Chỉnh sửa Shop (`src/app/shop/[id]/page.tsx`)**:
  * Mở rộng Modal chỉnh sửa thông tin cửa hàng cho phép chủ shop cập nhật lại cả **Logo (Avatar)** và **Ảnh bìa (Banner)** sau khi đã được phê duyệt.
  * Tích hợp công cụ cắt ảnh cho ảnh bìa trong modal chỉnh sửa để đảm bảo tỉ lệ hiển thị chuẩn 16:5.
* **Cập nhật dữ liệu mẫu (`src/data/shops.ts`)**: Bổ sung ảnh bìa thực tế cho các cửa hàng tĩnh (`STATIC_SHOPS`) để đồng bộ giao diện Material Design 3 trên toàn site.

### Verification
* `npx tsc --noEmit` hoàn thành thành công.
* Toàn bộ luồng đăng ký, phê duyệt và chỉnh sửa shop với ảnh thực tế hoạt động trơn tru trên Firebase.

---

## [0.4.9] - 2026-06-05

### Tối ưu hóa hiệu năng tải ảnh lên Firebase Storage & Khắc phục giao diện lỗi xác thực Firebase Auth

### Changed

#### Cải thiện cơ chế ghi log lỗi xác thực (`src/store/auth-store.ts`)
* Chuyển đổi gọi `console.error` sang `console.warn` đối với các trường hợp lỗi thông thường khi đăng nhập (sai thông tin xác thực, sai mật khẩu, sai email), đăng ký (trùng email, mật khẩu yếu), và đổi mật khẩu.
* Khắc phục triệt để tình trạng giao diện phát triển của Next.js (Dev Overlay) tự động bật lên màn hình đỏ báo lỗi hệ thống, giúp người dùng nhìn thấy thông báo lỗi chuẩn trên form đăng nhập/đăng ký.

#### Tối ưu luồng upload ảnh đăng ký bán hàng (`src/store/auth-store.ts`, `src/lib/firebase.ts`)
* Thiết lập giới hạn thời gian chờ tải ảnh `maxUploadRetryTime` và `maxOperationRetryTime` của dịch vụ `Firebase Storage` xuống còn **3 giây** (3000ms) để tránh bị treo quá lâu khi kết nối mạng Firebase bị chậm hoặc chặn.
* Bổ sung cơ chế giới hạn thời gian `Promise.race` tối đa **3 giây** trong hàm tải ảnh lên Storage `uploadImageToStorage(...)`. Nếu quá thời hạn này, hệ thống sẽ tự động dừng tải lên và chuyển sang sử dụng chuỗi ảnh Base64 làm giá trị dự phòng (fallback) ghi vào Firestore, đảm bảo giao diện luôn phản hồi lập tức.
* Nâng cấp hàm nạp ảnh của người bán `uploadSellerImages(...)` tải lên song song các tệp ảnh chính (Logo, ảnh bìa, CCCD mặt trước/sau) bằng `Promise.all` thay vì đợi tải tuần tự từng ảnh, giúp cải thiện đáng kể tốc độ gửi hồ sơ đăng ký.

### Verification

* `npx tsc --noEmit` hoàn thành thành công.
* `npm run dev` hoạt động bình thường, không gặp lỗi biên dịch.

---

## [0.4.8] - 2026-06-05

### Kiểm tra hoàn thiện Firebase runtime & loại bỏ dữ liệu local khi test

### Changed

#### Các file đã thay đổi trong phiên kiểm tra Firebase
* `src/app/cart/page.tsx`
  - Loại bỏ phụ thuộc runtime vào `@/data/products` trong trang giỏ hàng.
  - Không còn lấy thông tin phụ của sản phẩm từ dữ liệu local khi render cart item.

* `src/app/checkout/page.tsx`
  - Loại bỏ đoạn ghi `nong-sach-last-order` vào `localStorage`.
  - Luồng đặt hàng tiếp tục ghi đơn qua `addOrder(...)` lên Firestore collection `orders`.

* `src/app/checkout/success/page.tsx`
  - Chuyển trang hoàn tất đơn hàng sang đọc chi tiết đơn từ Firestore `orders/{orderId}`.
  - Chuyển danh sách sản phẩm gợi ý sang lấy từ Firestore thông qua `getAllProducts()`.
  - Loại bỏ các interface và logic đọc đơn hàng từ localStorage.

* `src/app/products/page.tsx`
  - Điều chỉnh luồng tải danh sách sản phẩm bất đồng bộ từ Firestore.
  - Tránh setState trực tiếp trong effect gây lint error.

* `src/app/products/[id]/page.tsx`
  - Điều chỉnh luồng tải chi tiết sản phẩm và sản phẩm liên quan từ Firestore.
  - Thêm cleanup/cờ active để tránh cập nhật state sau khi component unmount.

* `src/app/profile/page.tsx`
  - Điều chỉnh cập nhật tab từ query param theo hướng an toàn hơn với React compiler.
  - Tiếp tục dùng Firestore để tải sản phẩm của seller và đơn hàng người mua/người bán.

* `src/app/seed/page.tsx`
  - Sửa xử lý lỗi seed từ `any` sang `unknown` để TypeScript an toàn hơn.

* `src/app/shop/[id]/page.tsx`
  - Điều chỉnh luồng nạp shop, sản phẩm của shop và shop tương tự từ Firestore.
  - Tránh setState trực tiếp trong effect khi build shop từ thông tin seller hiện tại.

* `src/components/product/ProductDetail.tsx`
  - Đồng bộ phần banner thông tin shop với helper Firestore bất đồng bộ.

* `src/lib/seed.ts`
  - Giữ dữ liệu tĩnh `src/data/products` và `src/data/shops` làm nguồn seed ban đầu lên Firestore.
  - Sửa xử lý lỗi từ `any` sang `unknown`.

* `src/lib/shops.ts`
  - Duy trì các helper Firestore cho shop: lấy shop theo id, lấy shop theo sản phẩm, lấy toàn bộ shop, thêm shop và cập nhật shop.

* `src/store/auth-store.ts`
  - Bổ sung xử lý lỗi Firebase type-safe.
  - Đồng bộ seller được approve sang collection `shops`.
  - Đồng bộ thay đổi thông tin seller sang document shop tương ứng.

* `src/store/order-store.ts`
  - Loại bỏ tham số store không dùng.
  - Tiếp tục dùng Firestore cho add/update/fetch orders.

* `src/data/shops.ts`
  - File dữ liệu cửa hàng tĩnh phục vụ seed dữ liệu ban đầu lên Firestore.

### Verification

* `npx tsc --noEmit` hoàn thành thành công sau khi build tạo lại `.next/types`.
* `npm run lint` hoàn thành thành công, còn một số warning không chặn build.
* `npm run build` hoàn thành thành công với cảnh báo không chặn từ Firebase/protobuf và workspace root.

### Notes

* Runtime chính hiện không còn dùng `localStorage` cho sản phẩm, shop hoặc đơn hàng.
* `notification-store.ts` và `report-store.ts` vẫn còn Zustand `persist`; hai phần này chưa được chuyển sang Firebase trong phiên này.
* `src/lib/seed.ts` vẫn dùng dữ liệu tĩnh local, đây là nguồn seed ban đầu chứ không phải runtime fallback.

---

## [0.4.7] - 2026-06-05

### Di chuyển Cơ sở dữ liệu Cửa hàng lên Firestore

### Added

#### Quản lý Dữ liệu tĩnh Cửa hàng (`src/data/shops.ts`)
* Tách mảng dữ liệu cửa hàng mẫu `STATIC_SHOPS` sang file độc lập để hỗ trợ tính năng seed dữ liệu mà không gây phụ thuộc chéo vào thư viện chính.

### Changed

#### Tích hợp Firestore cho Quản lý Cửa hàng (`src/lib/shops.ts`)
* Chuyển các hàm thao tác cửa hàng thành bất đồng bộ (`async`) kết nối trực tiếp với Firestore:
  - `getShopById(shopId)`: Đọc tài liệu từ `shops/{shopId}` bằng `getDoc`. Bổ sung cơ chế fallback tự động truy vấn và lấy document đầu tiên trong collection nếu không tìm thấy ID cụ thể.
  - `getShopForProduct(product)`: Gọi `await getShopById(...)` bất đồng bộ để phân giải thông tin cửa hàng dựa trên `sellerId` hoặc ID của sản phẩm tĩnh.
  - `getAllShops()`: Lấy toàn bộ danh sách cửa hàng từ Firestore bằng `getDocs`.
  - `addShop(shop)`: Ghi tài liệu cửa hàng mới thông qua `setDoc` khi tài khoản người bán được phê duyệt.
  - `updateShop(shopId, data)`: Cập nhật thông tin cửa hàng bằng `updateDoc` khi chủ shop thay đổi thông tin.
* Loại bỏ mảng `STATIC_SHOPS` cũ và toàn bộ logic đọc `nong-sach-auth` từ local storage để tìm thông tin cửa hàng.
* Thêm bao bọc `try/catch` cho mọi hàm để đảm bảo ứng dụng không bị crash khi lỗi mạng hoặc Firestore thất bại, log lỗi cụ thể bằng `console.error`.

#### Đồng bộ các Call Sites và luồng hoạt động
* **Khởi tạo dữ liệu (`src/lib/seed.ts`)**: Cập nhật import `STATIC_SHOPS` từ file dữ liệu tĩnh mới `@/data/shops`.
* **Trang chi tiết sản phẩm (`src/components/product/ProductDetail.tsx`)**:
  - Chuyển `shop` thành React state được fetch bất đồng bộ trong hook `useEffect` bằng `getShopForProduct(product)`.
  - Thiết kế và tích hợp khung xương tải dữ liệu (pulse loading skeleton) cho phần Banner thông tin cửa hàng, hiển thị mượt mà trong lúc chờ dữ liệu.
* **Trang chi tiết cửa hàng (`src/app/shop/[id]/page.tsx`)**:
  - Chuyển đổi cách nạp thông tin cửa hàng chính (`shop`) và danh sách cửa hàng tương tự (`similarShops`) từ đồng bộ sang bất đồng bộ thông qua các hook `useEffect` gọi `getShopById(id)` và `getAllShops()`.
  - Loại bỏ hoàn toàn kiểm tra `isStatic` hoặc `customSeller` thừa do tất cả các cửa hàng (cả mặc định và đăng ký mới) hiện đều đồng bộ trên Firestore.
* **Kênh người bán & xác thực (`src/store/auth-store.ts`)**:
  - Tích hợp gọi `await addShop(...)` khi phê duyệt thành công người bán (`approveSeller`) nhằm tự động đồng bộ hồ sơ đăng ký sang collection `shops` trên Firestore.
  - Tích hợp gọi `await updateShop(...)` trong `updateSellerInfo` để cập nhật thông tin cửa hàng trực tiếp lên Firestore mỗi khi người bán thay đổi cấu hình trên Dashboard.

### Verification

* `npx tsc --noEmit` hoàn thành thành công, đạt 0 lỗi biên dịch.
* `npm run build` tạo build production Next.js thành công.

## [0.4.6] - 2026-06-05

### Di chuyển Cơ sở dữ liệu Đơn hàng lên Firestore

### Added

#### Tích hợp Firestore cho Quản lý Đơn hàng (`src/store/order-store.ts`)
* Loại bỏ hoàn toàn cơ chế lưu trữ cục bộ Zustand `persist` đối với đơn hàng.
* Tích hợp lưu trữ và đồng bộ hóa đơn hàng động lên collection `orders` trên Cloud Firestore.
* Viết lại toàn bộ các phương thức thao tác sang bất đồng bộ (`async`):
  - `addOrder(order)`: Ghi tài liệu đơn hàng lên `orders/{id}` bằng `setDoc` và cập nhật store cục bộ.
  - `updateOrderStatus(orderId, status)`: Cập nhật trạng thái đơn hàng trên Firestore bằng `updateDoc`.
  - `getOrdersByUserId(userId)` và `getOrdersBySellerId(sellerId)`: Hỗ trợ truy vấn và lọc đơn hàng theo ID người mua/người bán.
* Thêm hai hàm hỗ trợ tải dữ liệu động từ Firestore:
  - `fetchOrdersByUserId(userId)`: Nạp đơn hàng của người mua từ Firestore, sắp xếp theo thời gian mới nhất (`createdAt` giảm dần) và lưu vào store.
  - `fetchOrdersBySellerId(sellerId)`: Tương tự cho người bán.
* Thêm thuộc tính trạng thái `isLoading` vào store để quản lý trạng thái tải dữ liệu đơn hàng.

### Changed

#### Đồng bộ các call sites Đơn hàng
* **Trang thanh toán (`src/app/checkout/page.tsx`)**:
  - Chuyển đổi hàm xử lý `handleSubmit` thành `async`.
  - Thay thế vòng lặp `.forEach` bằng `for...of` để có thể `await addOrder(newOrder)` một cách an toàn cho từng đơn hàng (trong trường hợp giỏ hàng chứa sản phẩm của nhiều nhà vườn khác nhau) trước khi dọn giỏ hàng và chuyển hướng sang trang thành công.
* **Trang cá nhân (`src/app/profile/page.tsx`)**:
  - Tải động danh sách đơn hàng mua hoặc bán trực tiếp từ Firestore khi người dùng nhấp vào tab "Đơn hàng của tôi" hoặc tab "Đơn hàng" trong Kênh người bán thông qua các hook `useEffect` mới.
  - Cập nhật hàm `handleUpdateOrderStatus` thành `async` và thêm `await` khi gọi `updateOrderStatus` để đảm bảo lưu dữ liệu trạng thái thành công trên database trước khi gửi thông báo.

### Verification

* Chạy `npx tsc --noEmit` hoàn thành thành công, đạt 0 lỗi biên dịch.
* Chạy `npm run build` tạo build production Next.js thành công.

## [0.4.5] - 2026-06-05

### Di chuyển Cơ sở dữ liệu Sản phẩm lên Firestore & Trang Khởi tạo Dữ liệu (Seed)

### Added

#### Khởi tạo dữ liệu mẫu lên Cloud Firestore (`src/lib/seed.ts` & `src/app/seed/page.tsx`)
* Thiết lập file khởi tạo [seed.ts](file:///d:/Thực tập/Buoi3/nong-sach/src/lib/seed.ts) để ghi toàn bộ dữ liệu tĩnh của sản phẩm (từ `src/data/products.ts`) và cửa hàng (từ `src/lib/shops.ts`) lên collections `products` và `shops` trên Firestore.
* Bổ sung cơ chế an toàn `runSeed()` tự động kiểm tra xem sản phẩm có id `1` đã tồn tại chưa để tránh ghi đè dữ liệu nếu hệ thống đã được seed trước đó.
* Tạo mới route trang `/seed` với thiết kế giao diện Material Design 3, cung cấp nút nhấn "Chạy Seed Dữ Liệu", hiệu ứng spinner khi đang tải và hiển thị thông báo kết quả.

#### Tích hợp Firestore CRUD cho Sản phẩm (`src/lib/products.ts`)
* Viết lại toàn bộ thư viện helper products sang bất đồng bộ (`async`) đọc ghi trực tiếp Firestore: `getAllProducts()`, `getProductById()`, `getProductsByCategory()`, `searchProducts()`, `getAvailableCategories()`.
* Bổ sung hàm `addProduct(product)` (`setDoc`) và `deleteProduct(id)` (`deleteDoc`) phục vụ CRUD.
* Loại bỏ hoàn toàn logic đọc ghi từ `localStorage` với khóa `nong-sach-custom-products` và việc import dữ liệu tĩnh từ `src/data/products.ts`.

### Changed

#### Đồng bộ hóa call sites
* **Trang chủ (`src/app/page.tsx`)**: Chuyển đổi sang async Server Component và `await` hàm `getAllProducts()`.
* **Trang cửa hàng (`src/app/products/page.tsx`)**: Load sản phẩm bất đồng bộ từ Firestore bên trong client `useEffect` và quản lý thông qua state.
* **Trang chi tiết sản phẩm (`src/app/products/[id]/page.tsx`)**: Fetch thông tin sản phẩm và danh sách sản phẩm tương tự song song bằng `await` trong Client Effect.
* **Trang chi tiết shop (`src/app/shop/[id]/page.tsx`)**: Load sản phẩm bất đồng bộ để đồng bộ hóa số lượng sản phẩm của shop.
* **Kênh người bán (`src/app/profile/page.tsx`)**: Di chuyển toàn bộ tính năng quản lý sản phẩm (thêm mới, chỉnh sửa, xóa) trong Seller Dashboard từ `localStorage` sang gọi Firestore `addProduct()` và `deleteProduct()`. Sửa lỗi compile TypeScript liên quan đến type checking của `ShopProduct` và kiểm tra an toàn `currentUser`.

### Verification

* Chạy `npx tsc --noEmit` hoàn thành thành công, đạt 0 lỗi biên dịch.
* Chạy `npm run build` biên dịch và tối ưu hóa dự án Next.js thành công.

## [0.4.4] - 2026-06-05

### Tích hợp Firebase Auth & Cloud Firestore cho Hệ thống Xác thực và Dữ liệu Cửa hàng

### Added

#### Tích hợp Firebase Auth & Cloud Firestore (`src/store/auth-store.ts`)
* Chuyển đổi toàn bộ cơ chế quản lý trạng thái xác thực từ Local Storage sang **Firebase Auth & Cloud Firestore**.
* Thực hiện đăng ký (`createUserWithEmailAndPassword`), đăng nhập (`signInWithEmailAndPassword`), đăng xuất (`signOut`) và đổi mật khẩu thông qua Firebase SDK.
* Lưu trữ và đồng bộ hóa hồ sơ người dùng (`User`) động tại bộ sưu tập Firestore `users/{uid}`.
* Thiết lập luồng tự động kiểm tra, đăng ký và khởi tạo tài khoản Demo mặc định (`nguyenvana@gmail.com` với mật khẩu `12345678`) trên Firebase Auth/Firestore khi đăng nhập lần đầu để đảm bảo tính năng kiểm thử của hệ thống hoạt động bình thường.
* Lọc bỏ (Sanitize) các trường hình ảnh và dữ liệu nhạy cảm dạng base64 kích thước lớn (`idCardFront`, `idCardBack`, `farmImages`, `shopLogo`) trước khi đẩy payload lên Firestore để giữ cấu trúc tài liệu tối ưu và tuân thủ giới hạn payload của Cloud Firestore.

#### Quản lý trạng thái Client-side (`src/components/layout/AuthInitializer.tsx`)
* Triển khai bộ khởi tạo Client Component `<AuthInitializer />` dùng lắng nghe sự kiện thay đổi trạng thái xác thực của Firebase (`onAuthStateChanged`) và tự động nạp hồ sơ người dùng từ Firestore.
* Tích hợp `<AuthInitializer />` vào layout dùng chung [layout.tsx](file:///d:/Thực tập/Buoi3/nong-sach/src/app/layout.tsx) mà không thay đổi bản chất Server Component của Layout, bảo vệ hiệu quả SEO và các cấu hình metadata Next.js.

#### Dynamic Shop Fetching (`src/app/shop/[id]/page.tsx`)
* Viết mới cơ chế tải thông tin shop tùy chỉnh từ Firestore: Tải động thông tin hồ sơ của nhà vườn (custom seller) từ Firestore khi người mua truy cập trang shop `/shop/[id]`.
* Tối ưu hóa bộ phân giải `shop` (resolver) hoạt động phản ứng (reactive), tự động cập nhật số lượng sản phẩm đang có của shop từ bộ đệm sản phẩm local.

### Changed

#### Luồng Đăng nhập & Đăng ký
* Chuyển các bộ xử lý sự kiện trong trang Đăng nhập [login/page.tsx](file:///d:/Thực tập/Buoi3/nong-sach/src/app/login/page.tsx), Đăng ký [register/page.tsx](file:///d:/Thực tập/Buoi3/nong-sach/src/app/register/page.tsx), và đổi mật khẩu trong trang cá nhân [profile/page.tsx](file:///d:/Thực tập/Buoi3/nong-sach/src/app/profile/page.tsx) sang dạng bất đồng bộ (`async/await`) nhằm bắt đúng kết quả trả về từ Firebase.
* Đồng bộ hóa cơ chế phân giải cửa hàng `getShopById` trong [shops.ts](file:///d:/Thực tập/Buoi3/nong-sach/src/lib/shops.ts) trực tiếp với dữ liệu store Zustand.

### Verification

* `npx tsc --noEmit` hoàn thành thành công, không gặp bất cứ lỗi cú pháp hay kiểu dữ liệu nào.
* Chạy `npm run build` tạo thành công build production Next.js tối ưu và trơn tru.

## [0.4.3] - 2026-06-05

### Sửa lỗi Profile runtime, ổn định Báo cáo shop và dọn lỗi lint/type

### Added


### Fixed

#### Profile / Thông báo (`src/app/profile/page.tsx`)
* Sửa lỗi runtime `expandedOrderId is not defined` khi truy cập `/profile?tab=notifications` hoặc các tab Profile có render danh sách đơn hàng.
* Bổ sung state `expandedOrderId` để điều khiển mở/thu chi tiết đơn hàng một cách rõ ràng.
* Đồng bộ lại các trường đơn hàng theo type hiện tại (`id`, `createdAt`, `totalAmount`, `fullName`, trạng thái `delivered`) để tránh lỗi khi render lịch sử đơn hàng.
* Bổ sung type nội bộ cho tab Profile, giới tính, tỉnh/huyện và sản phẩm của shop; loại bỏ các `any` không cần thiết.
* Thay các ảnh preview trong Profile từ `<img>` sang `next/image` với `unoptimized` cho ảnh base64/local upload, giúp lint sạch hơn và preview nhất quán hơn.
* Chuyển các cập nhật state khởi tạo trong `useEffect` sang timeout có cleanup để tránh rule React compiler `set-state-in-effect` báo đỏ trên Next.js 16.
* **Mới**: Tích hợp điều hướng động dựa trên URL query param `tab` (sử dụng `useSearchParams` và bọc trang trong `<Suspense>`). Khi click vào quả chuông thông báo trên Header, trang cá nhân sẽ tự động chuyển sang tab **Thông báo** (`notifications`).
* **Mới**: Đồng bộ hóa URL khi người dùng thay đổi tab thủ công ở Sidebar menu bằng cách cập nhật query parameter qua `router.push('/profile?tab=...', { scroll: false })` giúp giữ trạng thái tab khi tải lại trang.

#### Layout / Spacing (`src/components/layout/Header.tsx`)
* **Mới**: Khắc phục khoảng cách quá hẹp và dính sát nhau giữa mục liên kết "Liên hệ" và ô nhập tìm kiếm bằng cách bổ sung thuộc tính `gap-6 md:gap-10` trên thẻ container `<nav>` chính, đảm bảo giao diện thoáng đãng và không bị dính sát nhau trên các màn hình có chiều rộng giới hạn.

#### Báo cáo shop (`src/app/shop/[id]/page.tsx`)
* Sửa lỗi modal Báo cáo shop bị co lại thành một vạch trắng do class `max-w-md`/`max-w-2xl` không tương thích với token spacing hiện tại.
* Đổi kích thước modal sang giá trị cụ thể `max-w-[480px]` và `max-w-[672px]` để giữ form báo cáo/chỉnh sửa shop hiển thị đúng.
* Bỏ các `useMemo` không phù hợp với dữ liệu đọc từ Zustand/localStorage để tránh React compiler báo lỗi preserve manual memoization.
* Chuyển state `mounted` và `displayFollowers` sang cập nhật an toàn có cleanup.

#### Lint và TypeScript toàn project
* Sửa nhóm lỗi `setMounted(true)` trực tiếp trong `useEffect` ở các trang/components: cart, checkout, login, products, header, cart badge và notification badge.
* Cập nhật trang chi tiết sản phẩm (`src/app/products/[id]/page.tsx`) chuyển `setMounted(true)` sang timeout có cleanup để ổn định cơ chế render và tránh cảnh báo lint.
* Sửa lỗi type `any` khi đọc dữ liệu từ `localStorage` trong `src/lib/products.ts`, `src/lib/shops.ts` và `src/store/auth-store.ts`.
* Cập nhật `auth-store` để dùng `Partial<AuthState>` và type `User | RegisteredUser | null` khi sanitize dữ liệu persist.
* Loại bỏ import không dùng trong `notification-store`.

### Verification

* `npx tsc --noEmit` chạy thành công.
* `npm run lint` chạy thành công, không còn lint error. Còn một số warning nhẹ không chặn build như font Google trong layout, import `Container` chưa dùng và cảnh báo `<img>` trong cropper.

### Notes

* Nếu trình duyệt vẫn hiện overlay đỏ sau khi sửa, cần dừng dev server và chạy lại `npm run dev`, hoặc hard refresh bằng `Ctrl + Shift + R` để xóa trạng thái HMR cũ.

---

## [0.4.2] - 2026-06-05

### Banner thông tin Shop & Trang chi tiết cửa hàng tương tác

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

### Cải thiện chất lượng ảnh upload & UX khung ảnh sản phẩm

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

### Đăng Ký Người Bán (Seller Registration), Kênh Bán Hàng (Seller Dashboard), Quản Lý Sản Phẩm (Product CRUD) & Tối Ưu Bộ Sưu Tập Ảnh

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
