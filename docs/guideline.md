# Hướng Dẫn Sử Dụng Ứng Dụng NôngSạch

Tài liệu này hướng dẫn người dùng thao tác các chức năng chính của website NôngSạch.

## 1. Truy cập ứng dụng

1. Mở trình duyệt.
2. Truy cập địa chỉ ứng dụng, ví dụ:

```text
http://localhost:3000
```

3. Trang chủ hiển thị các khu vực chính: banner giới thiệu, danh mục sản phẩm, sản phẩm nổi bật và các nút điều hướng.

## 2. Xem và tìm kiếm sản phẩm

1. Chọn menu `Cửa hàng`.
2. Dùng ô tìm kiếm để nhập tên sản phẩm, nguồn gốc hoặc mô tả cần tìm.
3. Chọn danh mục để lọc sản phẩm theo nhóm.
4. Dùng bộ sắp xếp để xem sản phẩm theo giá tăng dần hoặc giảm dần.
5. Bấm `Chi tiết` để xem thông tin đầy đủ của sản phẩm.

## 3. Xem chi tiết sản phẩm

Tại trang chi tiết sản phẩm, người dùng có thể:

1. Xem ảnh sản phẩm, giá, nguồn gốc, tình trạng tồn kho và mô tả.
2. Chọn số lượng muốn mua.
3. Bấm `Thêm vào giỏ hàng` để thêm sản phẩm vào giỏ.
4. Bấm `Mua ngay` để thêm sản phẩm và chuyển thẳng sang trang thanh toán.
5. Xem các tab `Mô tả`, `Thông tin`, `Đánh giá`.
6. Xem danh sách sản phẩm tương tự ở cuối trang.
7. Xem Banner thông tin nhà vườn/shop bán sản phẩm (với logo, đánh giá, vị trí). Bấm `Xem shop →` hoặc nhấp vào tên shop để truy cập trang chi tiết Cửa hàng.
8. **Menu Tiện ích (`...`)**: Nằm ở góc trên bên phải ảnh sản phẩm, cung cấp các lối tắt:
   - **Chia sẻ sản phẩm**: Gửi link sản phẩm qua mạng xã hội hoặc sao chép.
   - **Sao chép liên kết**: Lưu URL vào bộ nhớ tạm.
   - **Báo cáo sản phẩm**: Mở hộp thoại báo cáo vi phạm với lý do cụ thể.
   - **Bạn cần giúp đỡ?**: Hiển thị hotline hỗ trợ nhanh.

## 4. Xem chi tiết Cửa hàng (Shop Profile)

Tại trang chi tiết cửa hàng (`/shop/[id]`), người dùng có thể:

1. Xem ảnh bìa, logo đại diện, tên cửa hàng, slogan, địa điểm và các tiêu chuẩn chất lượng (như VietGAP, USDA Organic).
2. **Theo dõi cửa hàng**: Bấm nút `+ Theo dõi` để theo dõi cửa hàng (số lượng "Người theo dõi" sẽ tự động tăng lên và nút chuyển sang `Đang theo dõi`).
3. Bấm `Nhắn tin` để kích hoạt mô phỏng hộp thoại trò chuyện với chủ vườn.
4. Xem tab `Sản phẩm`: Lọc sản phẩm theo danh mục của shop, tìm kiếm sản phẩm trong shop, và sắp xếp theo giá cả hoặc tên gọi.
5. Xem tab `Đánh giá`: Xem các đánh giá chi tiết từ khách hàng cũ về nhà vườn.
6. Xem tab `Giới thiệu`: Xem quy trình trồng trọt, ảnh album thực địa, thông tin liên lạc và thông tin thanh toán tài khoản ngân hàng của chủ vườn (tự động cập nhật cho cả người bán tự đăng ký).
7. Xem danh sách `Cửa hàng tương tự` ở chân trang để khám phá các nhà vườn liên kết khác.
8. **Báo cáo cửa hàng**: Nằm trong menu `...` ở góc trên bên phải ảnh bìa, cho phép gửi khiếu nại về nhà vườn.

## 5. Quản lý giỏ hàng

1. Chọn menu `Giỏ hàng`.
2. Kiểm tra danh sách sản phẩm đã thêm.
3. Tăng hoặc giảm số lượng từng sản phẩm.
4. Xóa sản phẩm khỏi giỏ nếu không muốn mua.
5. Nhập mã giảm giá nếu có.
6. Bấm `Tiến hành đặt hàng` để chuyển sang trang thanh toán.

## 6. Thanh toán

1. Điền thông tin giao hàng:
   - Họ và tên
   - Số điện thoại
   - Email
   - Tỉnh / Thành phố
   - Quận / Huyện
   - Địa chỉ cụ thể
   - Ghi chú đơn hàng nếu cần
2. Chọn phương thức giao hàng.
3. Chọn phương thức thanh toán. Hệ thống hỗ trợ 4 phương thức:
   - **Chuyển khoản Vietcombank**: Thanh toán thủ công qua QR Vietcombank sau khi đặt hàng.
   - **Thanh toán qua VNPay** (`vnpay`): Chuyển hướng sang cổng VNPay để quét mã QR hoặc thanh toán thẻ ATM nội địa.
   - **Thẻ Visa / Mastercard** (`credit`): Chuyển hướng trực tiếp đến cổng VNPay với tùy chọn thẻ quốc tế.
   - **Ví điện tử** (`wallet`): Chuyển hướng đến cổng VNPay với tùy chọn quét mã QR ví điện tử.
4. Kiểm tra lại tóm tắt đơn hàng ở cột bên phải.
5. Bấm `Đặt hàng ngay`.

**Luồng thanh toán online (VNPay / Visa / Ví điện tử):**

   a. Hệ thống lưu thông tin đơn hàng tạm vào Firestore (`pending_orders`) với trạng thái `"pending"` và chuyển hướng trình duyệt tới cổng thanh toán VNPay Sandbox.

   b. Trên cổng VNPay, người dùng nhập thông tin thẻ hoặc quét mã QR để thanh toán.

   c. Sau khi thanh toán, VNPay chuyển hướng về `/checkout/vnpay-return`:
      - **Thành công** (Response code `00`): Hệ thống xác thực chữ ký bảo mật, xóa các sản phẩm đã mua khỏi giỏ hàng, tạo đơn hàng chính thức trong Firestore và chuyển sang trang thành công `/checkout/success` hiển thị mã giao dịch VNPay.
      - **Hủy giao dịch** (Response code `24`): Hiển thị thông báo giao dịch bị hủy, giỏ hàng được giữ nguyên.
      - **Thất bại** (các mã lỗi khác): Hiển thị thông báo lỗi, đơn hàng không được tạo, giỏ hàng được giữ nguyên.

   d. Song song, VNPay gửi thông báo IPN (Instant Payment Notification) server-to-server về `/api/vnpay/ipn` để đảm bảo đồng bộ trạng thái đơn hàng kể cả khi người dùng đóng trình duyệt đột ngột.

**Luồng thanh toán thủ công (Chuyển khoản Vietcombank):**

   Đặt hàng thành công ngay lập tức — hệ thống tạo đơn hàng và chuyển sang trang `/checkout/success` hiển thị mã QR Vietcombank để người dùng chuyển khoản.

Lưu ý: Danh sách tỉnh/thành phố và quận/huyện được lấy từ API `provinces.open-api.vn`. Nếu API lỗi mạng, ứng dụng dùng dữ liệu dự phòng để người dùng vẫn có thể đặt hàng.

## 7. Đăng ký tài khoản

1. Chọn menu `Tài khoản`.
2. Chọn liên kết đăng ký nếu chưa có tài khoản.
3. Nhập thông tin:
   - Họ và tên
   - Email
   - Số điện thoại
   - Mật khẩu
   - Xác nhận mật khẩu
4. Bấm `Tạo tài khoản`.
5. Sau khi đăng ký thành công, hệ thống chuyển sang trang đăng nhập.

## 8. Đăng nhập

1. Chọn menu `Tài khoản`.
2. Nhập email và mật khẩu.
3. Bấm `Đăng nhập`.
4. Sau khi đăng nhập thành công, tên người dùng hiển thị ở phần tài khoản trên header.

Tài khoản demo:

1. Tài khoản Người mua (Buyer) Demo:
```text
Email: nguyenvana@gmail.com
Mật khẩu: 12345678
```

2. Tài khoản Quản trị (Admin) Demo:
```text
Email: admin@nongsach.vn
Mật khẩu: 12345678
```

## 9. Trang giới thiệu

1. Chọn menu `Về chúng tôi`.
2. Xem câu chuyện thương hiệu, giá trị cốt lõi, đội ngũ sáng lập và lời kêu gọi hành động.

## 10. Trang liên hệ

1. Chọn menu `Liên hệ`.
2. Điền form liên hệ gồm họ tên, email, số điện thoại, chủ đề và nội dung.
3. Xem thông tin liên hệ, hotline, email và giờ làm việc. Lưu ý: Form liên hệ hiện là giao diện MVP. Chức năng gửi dữ liệu thật sẽ được bổ sung ở giai đoạn backend/Firebase.
4. Có thể nhập email ở khu vực đăng ký nhận bản tin.

## 11. Đăng ký bán hàng & Quản lý Kênh bán hàng

Khi người dùng đã đăng nhập tài khoản, họ có thể đăng ký nâng cấp tài khoản thành Người bán:

1. Vào trang `Tài khoản` (Profile).
2. Chọn tab `Kênh bán hàng` ở sidebar bên trái.
3. Nếu chưa đăng ký, hệ thống hiển thị biểu mẫu đăng ký 4 bước:
   - **Bước 1: Thông tin cửa hàng**: Tên shop (*), slogan, SĐT shop (*), Zalo (*), mô tả và tải lên logo/ảnh đại diện shop.
   - **Bước 2: Địa chỉ nông trại & Tiêu chuẩn**: Chọn Tỉnh/Thành phố động (*), nhập địa chỉ chi tiết nông trại (*), chọn các tiêu chuẩn canh tác (như VietGAP, Hữu cơ) và viết chi tiết quy trình canh tác.
   - **Bước 3: Xác minh danh tính**: Nhập Số CMND/CCCD (*) và tải ảnh chụp mặt trước/sau (*) của thẻ.
   - **Bước 4: Tài khoản ngân hàng**: Nhập tên ngân hàng (*), số tài khoản (*) và tên chủ tài khoản (*).
4. Bấm `Đăng ký bán hàng` ở bước cuối cùng. Trạng thái hồ sơ của bạn sẽ chuyển thành `Hồ sơ đang được xét duyệt` (pending).
5. Bạn cần chờ Admin phê duyệt hồ sơ:
   - **Nếu được duyệt**: Trạng thái hồ sơ chuyển thành `approved`, tài khoản được cấp quyền người bán (`seller`), và hệ thống hiển thị **Kênh bán hàng (Dashboard)** với các tính năng quản lý sản phẩm, đơn hàng.
   - **Nếu bị từ chối**:
     - Bạn sẽ nhận được thông báo chuông (loại `Cập nhật tài khoản`) ghi rõ lý do bị từ chối từ admin.
     - Khi vào trang cá nhân, sidebar sẽ hiển thị menu **"Hồ sơ bị từ chối"** kèm biểu tượng cảnh báo màu đỏ.
     - Giao diện tab Đăng ký sẽ hiển thị cảnh báo hồ sơ bị từ chối kèm lý do cụ thể và nút **"Chỉnh sửa & gửi lại hồ sơ"**.
     - Bấm nút này sẽ mở lại biểu mẫu đăng ký 4 bước, tự động điền sẵn các thông tin cũ để bạn sửa đổi những phần chưa đạt yêu cầu (ví dụ: chụp lại ảnh CCCD rõ nét hơn) và gửi lại để chờ xét duyệt tiếp.
6. Sau khi hồ sơ được phê duyệt thành công, giao diện đăng ký biến mất hoàn toàn. Thay vào đó, hệ thống hiển thị **Kênh bán hàng (Dashboard)** với các thống kê doanh số, sản phẩm, và quản lý riêng biệt:
   - **Tab Sản phẩm của tôi**: Quản lý danh sách, thêm, sửa, xóa sản phẩm.
   - **Tab Đơn hàng của shop**: Xem danh sách các đơn hàng khách đã đặt mua từ shop mình.

## 12. Quản lý Đơn hàng cho Người bán

Tại tab `Đơn hàng của shop`, người bán có thể:

1. **Theo dõi đơn mới**: Hệ thống tự động tách đơn (nếu khách mua từ nhiều shop) và gửi riêng về dashboard của shop liên quan.
2. **Cập nhật trạng thái**: Bấm các nút thao tác nhanh để thay đổi trạng thái đơn hàng:
   - `Xác nhận đơn`: Sau khi kiểm tra hàng.
   - `Bắt đầu giao`: Khi đơn hàng đã giao cho vận chuyển.
   - `Hoàn tất giao`: Khi khách đã nhận hàng thành công.
   - `Hủy`: Nếu hết hàng hoặc sự cố khác.
3. **Xem chi tiết**: Bấm `Xem` để xem lại đầy đủ thông tin khách hàng và danh sách món hàng trong đơn.

## 13. Hệ thống Thông báo (Notifications)

Ứng dụng cung cấp thông báo thời gian thực giúp kết nối người mua và người bán:

1. **Vị trí**: Biểu tượng chuông trên Header hiển thị số thông báo chưa đọc.
2. **Loại thông báo**:
   - **Đối với người bán**: Thông báo khi có đơn hàng mới từ khách hàng.
   - **Đối với người mua**: Thông báo khi đơn hàng được người bán cập nhật trạng thái (xác nhận, đang giao,...).
3. **Quản lý**: Vào trang `Tài khoản` -> Tab `Thông báo` để xem toàn bộ lịch sử và đánh giá tất cả là đã đọc.

## 14. Quản lý sản phẩm tự đăng (CRUD)

Tại giao diện Kênh bán hàng (Dashboard), người bán có thể quản lý danh sách sản phẩm của mình:

1. **Thêm sản phẩm mới**:
   - Bấm nút `Thêm sản phẩm`.
   - Điền đầy đủ thông tin: Tên sản phẩm (*), Danh mục (*), Đơn giá (VND) (*), Số lượng tồn kho (*), Đơn vị tính (kg, túi, bó,...), Nguồn gốc (*) và Mô tả sản phẩm.
   - Tải lên tối đa 6 ảnh sản phẩm từ máy tính.
   - Click chọn ảnh bìa (Cover Image) trực quan bằng cách tích vào dấu chọn góc ảnh.
   - Bấm `Lưu sản phẩm`. Hệ thống tự động đọc kích thước thật của ảnh trước khi xử lý. Nếu ảnh hoặc file quá lớn, hệ thống nén về WebP chất lượng cao, giới hạn cạnh dài khoảng 2000px để vừa giữ độ nét vừa tiết kiệm Local Storage. Nếu ảnh nhỏ, hệ thống giữ gần với dữ liệu gốc để hạn chế mất nét.
   - Khuyến nghị upload ảnh sản phẩm tối thiểu khoảng `900x900px`, tốt hơn là `1200x1200px` trở lên. Nếu ảnh quá nhỏ, hệ thống sẽ cảnh báo và trang chi tiết sẽ hiển thị ảnh theo cách phóng có kiểm soát để tránh bị mờ.
2. **Cập nhật sản phẩm (Sửa)**:
   - Tìm sản phẩm trong bảng và bấm nút `Sửa` (icon bút chì).
   - Modal hiển thị đầy đủ thông tin cũ. Thay đổi các thông tin cần thiết và bấm `Cập nhật`.
3. **Xóa sản phẩm**:
   - Bấm nút `Xóa` (icon thùng rác) bên cạnh sản phẩm.
   - Xác nhận xóa trong hộp thoại cảnh báo. Sản phẩm sẽ được xóa khỏi bộ nhớ đệm và giao diện cập nhật ngay lập tức.

## 15. Kiểm tra lỗi đỏ trong quá trình chạy dev

Khi Next.js hiển thị overlay đỏ trên trình duyệt, thực hiện các bước kiểm tra nhanh sau:

1. Mở terminal tại thư mục project và chạy:

```text
npm run lint
npx tsc --noEmit
```

2. Nếu lỗi xuất hiện ở Profile:
   - Kiểm tra các state dùng trong JSX đã được khai báo chưa, đặc biệt các state điều khiển mở/thu chi tiết như `expandedOrderId`.
   - Kiểm tra dữ liệu đơn hàng đang render có đúng field theo type hiện tại không: `id`, `createdAt`, `totalAmount`, `fullName`, `status`.
   - Với các state khởi tạo từ `currentUser`, `localStorage` hoặc API trong `useEffect`, nên cập nhật qua timeout có cleanup để tránh rule React compiler `set-state-in-effect` báo lỗi trên Next.js 16.

3. Nếu lỗi xuất hiện khi bấm `Báo cáo shop`:
   - Kiểm tra modal không dùng các class width bị ảnh hưởng bởi token spacing tùy chỉnh như `max-w-md` hoặc `max-w-2xl`.
   - Ưu tiên dùng width cụ thể như `max-w-[480px]` cho modal báo cáo và `max-w-[672px]` cho modal chỉnh sửa shop.
   - Đảm bảo menu `...` đóng sau khi mở modal để không tạo overlay chồng trạng thái.

4. Nếu đã sửa code nhưng trình duyệt vẫn còn overlay đỏ:
   - Dừng dev server.
   - Chạy lại `npm run dev`.
   - Hard refresh trình duyệt bằng `Ctrl + Shift + R`.

Trạng thái sau Sprint 4.3: `npm run lint` và `npx tsc --noEmit` đều chạy thành công, không còn error. Một số warning nhẹ vẫn có thể xuất hiện nhưng không chặn build/dev server.

## 16. Ghi chú sử dụng

- Website có thể chạy tốt trên desktop, tablet và mobile.
- Giỏ hàng được lưu bằng localStorage nên vẫn giữ dữ liệu sau khi tải lại trang.
- Tài khoản đăng ký/đăng nhập trong MVP được lưu cục bộ bằng Zustand persist.
- Khi thêm sản phẩm mới hoặc đăng ký người bán, ảnh được lưu trữ dưới dạng base64. Để tránh lỗi đầy bộ nhớ Local Storage (`QuotaExceededError`), hệ thống đã triển khai cơ chế lọc `partialize` loại bỏ ảnh nặng trong Auth store và sử dụng giải thuật nén ảnh canvas/WebP Hybrid trước khi lưu. Ảnh sản phẩm cũ đã lưu mờ trong localStorage cần được upload lại từ ảnh gốc để cải thiện chất lượng.
- Khi build production trong project này, script đang dùng `next build --webpack` để tránh lỗi Turbopack với đường dẫn tiếng Việt.

## 17. Quy trình nghiệp vụ tổng thể trong tương lai (Phase 2)

Phần này mô tả quy trình nghiệp vụ định hướng cho các phiên bản tiếp theo của NôngSạch khi kết nối với Server/Database thực tế.

Quy trình tổng thể dự kiến:

1. Người dùng đăng ký tài khoản.
2. Người dùng đăng nhập hệ thống.
3. Người dùng sử dụng hệ thống với vai trò người mua.
4. Người dùng đăng ký trở thành người bán nếu có nhu cầu.
5. Hệ thống kiểm duyệt hồ sơ người bán (Backend/Admin kiểm tra tính hợp lệ của CMND/CCCD, giấy chứng nhận nông trại trước khi phê duyệt).
6. Tài khoản được nâng cấp để vừa có thể mua vừa có thể bán.
7. Người bán đăng sản phẩm lên hệ thống.
8. Người mua đặt hàng.
9. Hệ thống tự động tách đơn hàng (order splitting) và điều phối cho các người bán liên quan chuẩn bị giao hàng.
10. Đơn hàng được giao, hoàn tất và người mua đánh giá sản phẩm/dịch vụ (review & rating).

Ghi chú triển khai sau MVP:

- Cần migrate dữ liệu tài khoản và sản phẩm sang Cloud Firestore và Firebase Auth.
- Cổng thanh toán VNPay Sandbox đã hoàn thành tích hợp. Cần bổ sung thêm MoMo, ZaloPay ở Phase 2.
- Cần có hệ thống trạng thái đơn hàng đầy đủ: chờ xác nhận, đang xử lý, đang giao, đã giao, hoàn tất, đã hủy.
- Cần có chức năng đánh giá và nhận xét sản phẩm sau khi đơn hàng hoàn tất.

## 18. Trang quản trị hệ thống (Admin Panel)

Trang quản trị hệ thống cung cấp giao diện riêng tư, bảo mật dành riêng cho tài khoản Admin để giám sát và vận hành sàn thương mại điện tử.

### 1. Truy cập
- **Điều kiện**: Phải đăng nhập bằng tài khoản có vai trò `admin` (ví dụ: `admin@nongsach.vn`).
- **Cách vào**:
  - Click vào nút **"Trang quản trị"** hiển thị trên thanh Header ở storefront (cạnh tên tài khoản).
  - Hoặc nhập trực tiếp URL: `http://localhost:3000/admin`.
  - Nếu cố tình truy cập bằng tài khoản buyer hoặc chưa đăng nhập, Next.js Edge Middleware sẽ tự động chặn và chuyển hướng về trang chủ `/` hoặc trang đăng nhập.

### 2. Các chức năng chính
- **Bảng chỉ số tổng quan (KPI)**: Hiển thị 4 thẻ thông tin được truy vấn thời gian thực từ Firestore:
  1. **Tổng người dùng**: Tổng số lượng tài khoản đăng ký trên hệ thống.
  2. **Seller chờ**: Số hồ sơ nông dân xin đăng ký người bán đang ở trạng thái chờ duyệt.
  3. **Đơn hôm nay**: Số lượng đơn hàng phát sinh trong ngày hôm nay.
  4. **Doanh thu**: Tổng số tiền thu được từ tất cả đơn hàng đã giao hoặc đang xử lý (không tính các đơn hàng bị hủy `"cancelled"`).
- **Biểu đồ hiệu suất nền tảng**:
  - **Lọc thời gian**: Admin có thể chọn xem báo cáo theo chu kỳ **7 ngày** hoặc **30 ngày** qua các nút bấm tương ứng.
  - **Chuyển đổi chỉ số**: Cho phép lựa chọn xem theo **Doanh thu** (thể hiện bằng đường màu xanh lá cây, thang đo VND viết tắt dạng M/K) hoặc **Số đơn hàng** (thể hiện bằng đường màu xanh dương, thang đo số nguyên đơn hàng).
  - **Tooltip tương tác**: Khi di chuột qua các mốc điểm của biểu đồ, hệ thống sẽ hiện đường nét đứt định vị dọc và một tooltip nổi màu tối hiển thị chính xác ngày tháng cùng số liệu doanh thu & số đơn hàng của ngày đó.
- **Hàng đợi kiểm duyệt (Approvals Queue)**:
  - Tích hợp hệ thống tab chuyển đổi linh hoạt: **Người Bán**, **Sản Phẩm** và **Báo Cáo**.
  - **Người Bán**:
    * Hiển thị danh sách hồ sơ nông dân xin đăng ký người bán đang ở trạng thái `pending`.
    * Click **"Xem chi tiết"**: Mở hộp thoại chi tiết (`SellerDetailsModal`) để xem đầy đủ thông tin về thông tin cửa hàng, thông tin liên hệ, nông trại & tiêu chuẩn, ảnh CCCD phóng to và tài khoản ngân hàng.
    * Click **"Phê duyệt"** (Approve): Nâng cấp quyền tài khoản sang `seller`, phê duyệt trạng thái `approved`, đồng thời tạo gian hàng trên Firestore, xóa lý do từ chối cũ và gửi thông báo chúc mừng về tài khoản đó.
    * Click **"Từ chối"** (Reject): Yêu cầu nhập lý do từ chối cụ thể, chuyển trạng thái hồ sơ sang `"rejected"`, lưu lý do và gửi thông báo `account_update` chứa lý do đó về tài khoản người bán.
  - **Sản Phẩm**:
    * Hiển thị danh sách các sản phẩm mới do seller tự đăng đang ở trạng thái `pending`.
    * Click **"Xem chi tiết"**: Mở hộp thoại chi tiết (`ProductDetailsModal`) để xem đầy đủ thông tin sản phẩm (tên, giá, đơn vị, tồn kho, nguồn gốc, nhãn hữu cơ, mô tả chi tiết và bộ sưu tập ảnh đầy đủ).
    * Click **"Phê duyệt"**: Chuyển trạng thái sản phẩm sang `"active"`, xóa lý do từ chối cũ và gửi thông báo chúc mừng đến người bán (sản phẩm hiện đã hiển thị công khai).
    * Click **"Từ chối"**: Yêu cầu nhập lý do từ chối cụ thể, chuyển trạng thái sản phẩm sang `"rejected"`, lưu lý do và gửi thông báo hệ thống kèm lý do đó về tài khoản người bán.
  - **Báo Cáo (Báo cáo vi phạm)**:
    * Hiển thị danh sách các báo cáo vi phạm shop/sản phẩm của người dùng đang ở trạng thái `pending`.
    * Click **"Xem & Xử lý"**: Mở hộp thoại xem chi tiết thông tin báo cáo (loại đối tượng, lý do vi phạm, người báo cáo, thời gian và nội dung mô tả chi tiết của báo cáo vi phạm).
    * Cung cấp **4 hành động xử lý**:
      1. **Bỏ qua**: Đổi trạng thái báo cáo thành `"dismissed"`. Ghi nhận log.
      2. **Cảnh báo**: Yêu cầu nhập nội dung và gửi thông báo cảnh báo trực tiếp về tài khoản người bán vi phạm.
      3. **Khóa tạm**: Khóa tạm sản phẩm (đổi sang `"blocked"`) hoặc khóa shop (đổi `sellerStatus` sang `"blocked"` và khóa toàn bộ sản phẩm của shop).
      4. **Xóa vi phạm**: Xóa sản phẩm khỏi Firestore; hoặc thu hồi quyền bán hàng của shop (về `role = "buyer"`, `sellerStatus = "rejected"`) và xóa toàn bộ sản phẩm của shop khỏi Firestore.
- **Danh sách người dùng & Phân quyền**:
  - Liệt kê toàn bộ người dùng đã đăng ký tài khoản trên hệ thống.
  - Cho phép Admin trực tiếp đổi vai trò của bất kỳ tài khoản nào: click **"Lên Admin"** để phong quyền quản trị, click **"Lên Shop (Seller)"** để cấp quyền bán hàng nhanh, hoặc click **"Bỏ Shop (Buyer)"** để thu hồi quyền bán hàng về tài khoản mua thông thường.
  - **Mở khóa Shop**: Nếu shop đang bị khóa tạm thời (`sellerStatus === "blocked"`), hiển thị badge cảnh báo màu đỏ và nút hành động chuyển thành **"Mở khóa Shop"**. Khi nhấn, tài khoản sẽ được chuyển lại trạng thái hoạt động bình thường, mở khóa toàn bộ sản phẩm và gửi thông báo vui cho seller.
- **Lịch sử hoạt động Admin (Admin Activity Logs)**:
  - Bảng danh sách đặt ở cuối trang Admin Panel, hiển thị toàn bộ lịch sử các thao tác kiểm duyệt của Admin (Xóa, Khóa, Cảnh báo, Bỏ qua, Mở khóa) được đồng bộ từ Firestore theo thời gian thực.
- **Đăng xuất**: Cung cấp nút đăng xuất riêng biệt ở cuối Sidebar để kết thúc phiên làm việc an toàn của Admin.

## 19. Cấu hình & Kiểm thử VNPay Sandbox

Phần này hướng dẫn cấu hình môi trường và kiểm thử tích hợp thanh toán VNPay Sandbox trên máy local.

### 19.1. Đăng ký tài khoản Sandbox

1. Truy cập `https://sandbox.vnpayment.vn/devreg` và đăng ký một tài khoản Merchant mới.
2. Sau khi đăng ký, VNPay cung cấp cho bạn:
   - **Terminal ID (TmnCode)**: Mã merchant định danh.
   - **Secret Key (HashSecret)**: Khóa bí mật để ký bảo mật HMAC-SHA512.

> **Lưu ý**: Merchant ID mặc định `2QXGZSTR` trong tài liệu demo thường bị VNPay vô hiệu hóa theo thời gian. Bắt buộc phải đăng ký tài khoản Sandbox riêng để có khóa hoạt động ổn định.

### 19.2. Cấu hình `.env.local`

Tạo hoặc chỉnh sửa file `.env.local` ở thư mục gốc dự án với các giá trị sau:

```env
# VNPay Sandbox
VNP_TMNCODE=<Terminal_ID_của_bạn>
VNP_HASHSECRET=<Secret_Key_của_bạn>
VNP_RETURNURL=http://localhost:3000/checkout/vnpay-return
```

Khởi động lại dev server sau khi lưu file:

```text
npm run dev
```

### 19.3. Kiểm thử 3 kịch bản giao dịch

#### Kịch bản 1 — Thanh toán thành công

1. Thêm sản phẩm vào giỏ hàng và vào trang Thanh toán.
2. Chọn phương thức **"Thanh toán qua VNPay"**, điền thông tin giao hàng và bấm `Đặt hàng ngay`.
3. Trên cổng VNPay Sandbox, chọn ngân hàng **NCB** và nhập thông tin thẻ test:

```text
Số thẻ   : 9704198526191432198
Tên chủ thẻ: NGUYEN VAN A
Ngày hết hạn: 07/15
OTP      : 123456
```

4. Bấm **Thanh toán**. Kết quả mong đợi:
   - Trình duyệt chuyển về `/checkout/vnpay-return` → xử lý xác thực → chuyển sang `/checkout/success`.
   - Trang thành công hiển thị **Mã giao dịch VNPay** (`vnp_TransactionNo`).
   - Giỏ hàng được xóa sạch.
   - Đơn hàng xuất hiện trong tab **Đơn hàng của tôi** tại `/profile`.

#### Kịch bản 2 — Hủy giao dịch

1. Thực hiện tương tự bước 1–2 ở trên.
2. Trên cổng VNPay Sandbox, **bấm nút Hủy** thay vì nhập thẻ.
3. Kết quả mong đợi:
   - Trình duyệt chuyển về `/checkout/vnpay-return` hiển thị thông báo **"Giao dịch đã bị hủy"**.
   - Giỏ hàng **được giữ nguyên**, không mất sản phẩm.
   - Không có đơn hàng nào được tạo trong Firestore.

#### Kịch bản 3 — Thanh toán thất bại

1. Thực hiện tương tự bước 1–2 ở trên.
2. Trên cổng VNPay Sandbox, nhập thông tin thẻ **sai** (sai số thẻ hoặc OTP).
3. Kết quả mong đợi:
   - VNPay trả về mã lỗi khác `00`.
   - Trang `/checkout/vnpay-return` hiển thị thông báo **lỗi thanh toán**.
   - Giỏ hàng **được giữ nguyên**.
   - Không có đơn hàng nào được tạo.

### 19.4. Kiểm tra thẻ Visa/Mastercard và Ví điện tử

- **Visa/Mastercard**: Chọn phương thức **"Thẻ Visa / Mastercard"** ở trang Checkout. VNPay Sandbox sẽ chuyển thẳng đến trang nhập thông tin thẻ quốc tế (dùng thẻ test của VNPay Sandbox cho thẻ quốc tế).
- **Ví điện tử**: Chọn phương thức **"Ví điện tử"** ở trang Checkout. VNPay Sandbox hiển thị giao diện quét mã QR.

### 19.5. Xem kết quả trên Firestore

Sau khi thanh toán thành công, kiểm tra Firestore:

- Collection `orders`: Đơn hàng mới được tạo với `payment_status: "paid"`, `vnp_TransactionNo` và `vnp_ResponseCode: "00"`.
- Collection `pending_orders`: Document tạm thời đã bị xóa sau khi xử lý thành công.
- Collection `notifications`: Thông báo chuông được gửi đến cả người mua và người bán liên quan.

## 20. Hướng dẫn Nhập mã vận đơn & Theo dõi đơn hàng

Tính năng này cho phép người bán cung cấp thông tin vận chuyển và người mua có thể theo dõi hành trình đơn hàng trực tiếp qua GHN.

### 20.1. Đối với Người bán (Seller)

1. Truy cập **Kênh người bán** > **Đơn hàng của shop**.
2. Tìm đơn hàng ở trạng thái **Đã xác nhận** hoặc **Đang giao**.
3. Tại card đơn hàng, nhập mã vận đơn vào ô **"Nhập mã vận đơn..."** (Ví dụ: `GHN123456`).
4. Bấm nút **"Lưu mã"** (hoặc **"Cập nhật"** nếu muốn đổi mã khác).
5. Hệ thống sẽ lưu mã vào Firestore và tự động gửi thông báo đến người mua.

### 20.2. Đối với Người mua (Buyer)

1. Nhận thông báo qua biểu tượng chuông: *"Đơn hàng #... đã có mã vận đơn: GHN123456. Bạn có thể theo dõi tại GHN."*
2. Vào **Trang cá nhân** > **Đơn hàng của tôi**.
3. Tại thẻ đơn hàng tương ứng, bạn sẽ thấy mục **"Mã vận đơn GHN"**.
4. Bấm nút **"Theo dõi tại GHN"** để mở trang tra cứu vận đơn chính thức của Giao Hàng Nhanh với mã đã được điền sẵn.
5. Bạn cũng có thể xem thông tin này tại trang **Hoàn tất đơn hàng** ngay sau khi người bán cập nhật mã.
