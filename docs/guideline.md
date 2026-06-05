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

## 4. Quản lý giỏ hàng

1. Chọn menu `Giỏ hàng`.
2. Kiểm tra danh sách sản phẩm đã thêm.
3. Tăng hoặc giảm số lượng từng sản phẩm.
4. Xóa sản phẩm khỏi giỏ nếu không muốn mua.
5. Nhập mã giảm giá nếu có.
6. Bấm `Tiến hành đặt hàng` để chuyển sang trang thanh toán.

## 5. Thanh toán

1. Điền thông tin giao hàng:
   - Họ và tên
   - Số điện thoại
   - Email
   - Tỉnh / Thành phố
   - Quận / Huyện
   - Địa chỉ cụ thể
   - Ghi chú đơn hàng nếu cần
2. Chọn phương thức giao hàng.
3. Chọn phương thức thanh toán.
4. Kiểm tra lại tóm tắt đơn hàng ở cột bên phải.
5. Bấm `Đặt hàng ngay`.
6. Sau khi đặt hàng thành công, hệ thống chuyển sang trang hoàn tất đơn hàng.

Lưu ý: Danh sách tỉnh/thành phố và quận/huyện được lấy từ API `provinces.open-api.vn`. Nếu API lỗi mạng, ứng dụng dùng dữ liệu dự phòng để người dùng vẫn có thể đặt hàng.

## 6. Đăng ký tài khoản

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

## 7. Đăng nhập

1. Chọn menu `Tài khoản`.
2. Nhập email và mật khẩu.
3. Bấm `Đăng nhập`.
4. Sau khi đăng nhập thành công, tên người dùng hiển thị ở phần tài khoản trên header.

Tài khoản demo:

```text
Email: admin@nongsach.vn
Mật khẩu: 12345678
```

## 8. Trang giới thiệu

1. Chọn menu `Về chúng tôi`.
2. Xem câu chuyện thương hiệu, giá trị cốt lõi, đội ngũ sáng lập và lời kêu gọi hành động.

## 9. Trang liên hệ

1. Chọn menu `Liên hệ`.
2. Điền form liên hệ gồm họ tên, email, số điện thoại, chủ đề và nội dung.
3. Xem thông tin liên hệ, hotline, email và giờ làm việc. Lưu ý: Form liên hệ hiện là giao diện MVP. Chức năng gửi dữ liệu thật sẽ được bổ sung ở giai đoạn backend/Firebase.
4. Có thể nhập email ở khu vực đăng ký nhận bản tin.

## 10. Đăng ký bán hàng & Quản lý Kênh bán hàng

Khi người dùng đã đăng nhập tài khoản, họ có thể đăng ký nâng cấp tài khoản thành Người bán:

1. Vào trang `Tài khoản` (Profile).
2. Chọn tab `Kênh bán hàng` ở sidebar bên trái.
3. Nếu chưa đăng ký, hệ thống hiển thị biểu mẫu đăng ký 4 bước:
   - **Bước 1: Thông tin cửa hàng**: Tên shop (*), slogan, SĐT shop (*), Zalo (*), mô tả và tải lên logo/ảnh đại diện shop.
   - **Bước 2: Địa chỉ nông trại & Tiêu chuẩn**: Chọn Tỉnh/Thành phố động (*), nhập địa chỉ chi tiết nông trại (*), chọn các tiêu chuẩn canh tác (như VietGAP, Hữu cơ) và viết chi tiết quy trình canh tác.
   - **Bước 3: Xác minh danh tính**: Nhập Số CMND/CCCD (*) và tải ảnh chụp mặt trước/sau (*) của thẻ.
   - **Bước 4: Tài khoản ngân hàng**: Nhập tên ngân hàng (*), số tài khoản (*) và tên chủ tài khoản (*).
4. Bấm `Đăng ký bán hàng` ở bước cuối cùng. Hệ thống sẽ tự động phê duyệt nhanh và nâng cấp tài khoản sang vai trò `seller`.
5. Sau khi nâng cấp thành công, giao diện đăng ký 4 bước biến mất hoàn toàn. Thay vào đó, hệ thống hiển thị **Kênh bán hàng (Dashboard)** với các thống kê doanh số, sản phẩm, và danh sách đơn hàng/sản phẩm của riêng shop.

## 11. Quản lý sản phẩm tự đăng (CRUD)

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

## 12. Ghi chú sử dụng

- Website có thể chạy tốt trên desktop, tablet và mobile.
- Giỏ hàng được lưu bằng localStorage nên vẫn giữ dữ liệu sau khi tải lại trang.
- Tài khoản đăng ký/đăng nhập trong MVP được lưu cục bộ bằng Zustand persist.
- Khi thêm sản phẩm mới hoặc đăng ký người bán, ảnh được lưu trữ dưới dạng base64. Để tránh lỗi đầy bộ nhớ Local Storage (`QuotaExceededError`), hệ thống đã triển khai cơ chế lọc `partialize` loại bỏ ảnh nặng trong Auth store và sử dụng giải thuật nén ảnh canvas/WebP Hybrid trước khi lưu. Ảnh sản phẩm cũ đã lưu mờ trong localStorage cần được upload lại từ ảnh gốc để cải thiện chất lượng.
- Khi build production trong project này, script đang dùng `next build --webpack` để tránh lỗi Turbopack với đường dẫn tiếng Việt.

## 13. Quy trình nghiệp vụ tổng thể trong tương lai (Phase 2)

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
- Cần có trang quản trị dành riêng cho Admin để phê duyệt/từ chối hồ sơ người bán (`pending`, `approved`, `rejected`).
- Cần tích hợp cổng thanh toán trực tuyến (VNPay, MoMo, ZaloPay).
- Cần có hệ thống trạng thái đơn hàng đầy đủ: chờ xác nhận, đang xử lý, đang giao, đã giao, hoàn tất, đã hủy.
- Cần có chức năng đánh giá và nhận xét sản phẩm sau khi đơn hàng hoàn tất.
