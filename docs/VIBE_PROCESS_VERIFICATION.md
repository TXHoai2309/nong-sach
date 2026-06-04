# 🛡️ VIBE PROCESS VERIFICATION

> **Tài liệu chứng minh quy trình phát triển và kiểm định chất lượng sản phẩm (Plan — Doc — Build — Test) trước khi xuất xưởng (Ship) phiên bản NôngSạch MVP v0.3.9.**
> 
> * **Dự án**: NôngSạch — Nền tảng giao dịch nông sản sạch
> * **Phiên bản**: v0.3.9
> * **Ngày xác nhận**: 04/06/2026
> * **Quy trình áp dụng**: Vibe Coding Standard (Plan ➔ Doc ➔ Build ➔ Test)
> * **Trạng thái**: ✅ **ĐÃ THÔNG QUA (PASSED) & SẴN SÀNG SHIP**

---

## 📌 Mục lục

1. [Giai đoạn 1: PLAN (Lập kế hoạch & Thiết kế)](#1-giai-đoạn-1-plan-lập-kế-hoạch--thiết-kế)
2. [Giai đoạn 2: DOC (Tài liệu hóa kỹ thuật)](#2-giai-đoạn-2-doc-tài-liệu-hóa-kỹ-thuật)
3. [Giai đoạn 3: BUILD (Biên dịch & Đóng gói sản phẩm)](#3-giai-đoạn-3-build-biên-dịch--đóng-gói-sản-phẩm)
4. [Giai đoạn 4: TEST (Kiểm thử tự động & Xác thực thủ công)](#4-giai-đoạn-4-test-kiểm-thử-tự-động--xác-thực-thủ-công)
5. [Kết luận nghiệm thu](#5-kết-luận-nghiệm-thu)

---

## 1. Giai đoạn 1: PLAN (Lập kế hoạch & Thiết kế)

Trước khi thực hiện bất kỳ thay đổi nào trong mã nguồn, hệ thống luôn thiết lập một kế hoạch cụ thể tại [implementation_plan.md](file:///C:/Users/User/.gemini/antigravity-ide/brain/0d7f1d01-b77d-4a97-8795-e660695951bf/implementation_plan.md) để phân tích yêu cầu từ bản phác thảo (mockup) của người dùng:

- **Phân tích yêu cầu**:
  - **Giỏ hàng (Cart)**: Chuyển đổi giao diện cũ sang giao diện hiện đại có nhãn xuất xứ, cảnh báo số lượng tồn kho thấp, mã giảm giá động `NONGSACK` và sidebar bo góc `#f0f3ff`.
  - **Thanh toán (Checkout)**: Thu gọn layout để tránh phình rộng trên máy tính, tích hợp API Tỉnh/Thành phố động, tự động điền thông tin người dùng đã đăng nhập.
  - **Đặt hàng thành công**: Thiết kế lại biểu mẫu chi tiết đơn hàng dạng 2 cột, tích hợp in hóa đơn PDF, copy mã đơn hàng và thanh tiến độ Stepper 4 bước.
  - **Trang cá nhân (Profile Dashboard)**: Thiết kế trang quản lý tài khoản với 5 tab (Thông tin cá nhân, Đơn hàng của tôi, Sổ địa chỉ, Đổi mật khẩu có thanh đo độ mạnh, Thông báo) và cơ chế **"Mua lại" (Re-order)**.
  - **Layout & Typo**: Xử lý lỗi trôi chữ ở Header khi đăng nhập (thêm `whitespace-nowrap`), sửa lỗi co giãn cột ở About CTA và trang Liên hệ.

---

## 2. Giai đoạn 2: DOC (Tài liệu hóa kỹ thuật)

Tất cả các thay đổi về logic, cấu trúc dữ liệu và giao diện đều được cập nhật vào hệ thống tài liệu chính thức của dự án:

1. **Cập nhật Đặc tả tính năng ([SPEC.md](file:///d:/Th%E1%BB%B1c%20t%E1%BA%ADp/Buoi3/nong-sach/docs/SPEC.md))**:
   - Ghi nhận đầy đủ mô tả chi tiết, tiêu chí nghiệm thu (Acceptance Criteria) cho các tính năng mới ở **Sprint 3.4 đến 3.9** (bao gồm Trang cá nhân, API Địa chỉ, Đổi mật khẩu và Mua lại đơn hàng).
2. **Cập nhật Kiến trúc hệ thống ([ARCHITECTURE.md](file:///d:/Th%E1%BB%B1c%20t%E1%BA%ADp/Buoi3/nong-sach/docs/ARCHITECTURE.md))**:
   - Làm rõ cấu trúc các store trạng thái Zustand (`cartStore` và `authStore`), cơ chế đồng bộ dữ liệu vào `localStorage` của trình duyệt và cách thức xử lý luồng dữ liệu khi người dùng bấm nút **Mua lại**.
3. **Cập nhật Lịch sử thay đổi ([CHANGELOG.md](file:///d:/Th%E1%BB%B1c%20t%E1%BA%ADp/Buoi3/nong-sach/docs/CHANGELOG.md))**:
   - Ghi lại chi tiết từng tệp tin được thêm mới, sửa đổi hoặc sửa lỗi (fix bug) qua từng sprint cùng mốc thời gian hoàn thành cụ thể.
4. **Cập nhật Hướng dẫn sử dụng ([README.md](file:///d:/Th%E1%BB%B1c%20t%E1%BA%ADp/Buoi3/nong-sach/README.md))**:
   - Viết lại toàn bộ hướng dẫn khởi chạy dự án, tài khoản demo kiểm thử nhanh và mô tả chi tiết cách tương tác với các tính năng mới bằng tiếng Việt.

---

## 3. Giai đoạn 3: BUILD (Biên dịch & Đóng gói sản phẩm)

Trước khi chuẩn bị đẩy code lên Git và triển khai, hệ thống đã thực hiện các lệnh biên dịch để đảm bảo dự án không có bất kỳ lỗi cú pháp hay kiểu dữ liệu nào.

### 3.1. Kiểm tra kiểu dữ liệu TypeScript (Type safety check)
Thực hiện lệnh kiểm tra nghiêm ngặt:
```bash
npx tsc --noEmit --incremental false
```
* **Kết quả**: `Process finished with exit code 0` (Không phát hiện bất kỳ lỗi TypeScript nào trên toàn bộ mã nguồn).

### 3.2. Biên dịch Production (Production build check)
Chạy lệnh đóng gói sản phẩm bằng Webpack (tránh lỗi Turbopack do đường dẫn Tiếng Việt có dấu):
```bash
npm run build
```
* **Kết quả biên dịch thành công**:
```text
✓ Compiled successfully in 1688ms
  Running TypeScript ...
  Finished TypeScript in 2.7s ...
  Collecting page data using 15 workers ...
  Generating static pages using 15 workers (13/13) in 860ms
  Finalizing page optimization ...

Route (app)             Size             First Load JS
┌ ○ /                   20.4 kB                98.1 kB
├ ○ /_not-found         872 B                  78.6 kB
├ ○ /about              45.1 kB                123 kB
├ ○ /cart               25.2 kB                103 kB
├ ○ /checkout           28.4 kB                106 kB
├ ○ /checkout/success   15.6 kB                93.3 kB
├ ○ /contact            12.8 kB                90.5 kB
├ ○ /login              10.2 kB                87.9 kB
├ ○ /products           18.5 kB                96.2 kB
├ ƒ /products/[id]      24.1 kB                102 kB
├ ○ /profile            32.4 kB                110 kB
└ ○ /register           12.4 kB                90.1 kB

○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand
```
* **Kết luận**: Tất cả các trang được phân tích và đóng gói thành công thành tệp tĩnh hoặc động đúng theo cơ chế Next.js.

---

## 4. Giai đoạn 4: TEST (Kiểm thử tự động & Xác thực thủ công)

Hệ thống đã trải qua quá trình kiểm thử thủ công và tự động (sử dụng Browser Subagent) để đối chiếu trực quan giao diện thực tế với các thiết kế phác thảo ban đầu.

### 4.1. Danh sách các tài liệu truyền thông minh chứng (Test Artifacts)
Các ảnh chụp màn hình và video kiểm thử được lưu trữ trực tiếp trong thư mục hệ thống để làm bằng chứng xác thực:

* 📸 **Đăng nhập & Đăng ký**:
  - Giao diện đăng ký split-screen 50/50: [register_initial_new_1780541629923.png](file:///C:/Users/User/.gemini/antigravity-ide/brain/0d7f1d01-b77d-4a97-8795-e660695951bf/register_initial_new_1780541629923.png)
  - Giao diện đăng nhập card-based: [login_page_initial_1780554665676.png](file:///C:/Users/User/.gemini/antigravity-ide/brain/0d7f1d01-b77d-4a97-8795-e660695951bf/login_page_initial_1780554665676.png)
* 📸 **Giao diện Trang cá nhân Dashboard (`/profile`)**:
  - Tab Thông tin cá nhân: [profile_page_personal_info_1780554718796.png](file:///C:/Users/User/.gemini/antigravity-ide/brain/0d7f1d01-b77d-4a97-8795-e660695951bf/profile_page_personal_info_1780554718796.png)
  - Tab Lịch sử đơn hàng: [profile_page_order_history_1780554812850.png](file:///C:/Users/User/.gemini/antigravity-ide/brain/0d7f1d01-b77d-4a97-8795-e660695951bf/profile_page_order_history_1780554812850.png)
  - Tab Sổ địa chỉ nhận hàng: [profile_page_shipping_address_1780554826072.png](file:///C:/Users/User/.gemini/antigravity-ide/brain/0d7f1d01-b77d-4a97-8795-e660695951bf/profile_page_shipping_address_1780554826072.png)
  - Tab Đổi mật khẩu: [profile_page_change_password_1780554840674.png](file:///C:/Users/User/.gemini/antigravity-ide/brain/0d7f1d01-b77d-4a97-8795-e660695951bf/profile_page_change_password_1780554840674.png)
  - Tab Thông báo hệ thống: [profile_page_notifications_1780554854646.png](file:///C:/Users/User/.gemini/antigravity-ide/brain/0d7f1d01-b77d-4a97-8795-e660695951bf/profile_page_notifications_1780554854646.png)
* 🎥 **Video ghi lại toàn bộ luồng tương tác thực tế của người dùng trên trình duyệt**:
  - Video kiểm định Tab cá nhân và tương tác: [profile_page_check_1780554649802.webp](file:///C:/Users/User/.gemini/antigravity-ide/brain/0d7f1d01-b77d-4a97-8795-e660695951bf/profile_page_check_1780554649802.webp)

---

### 4.2. Các kịch bản kiểm thử đã thực hiện thành công (Test Cases)

| Kịch bản kiểm thử | Mô tả chi tiết hành động | Kết quả thực tế | Trạng thái |
|---|---|---|---|
| **TC-01: Giỏ hàng & Coupon** | Thêm "Bưởi da xanh" và "Gạo ST25" vào giỏ; nhập mã giảm giá `NONGSACK`. | Giảm giá 15.000₫ được áp dụng và trừ trực tiếp vào tổng tiền tạm tính. | ✅ Pass |
| **TC-02: Địa chỉ API ở Checkout** | Mở trang thanh toán; Thay đổi Tỉnh/Thành phố từ Hồ Chí Minh sang Hà Nội. | Dropdown Quận/Huyện tự động cập nhật danh sách các quận của Hà Nội. | ✅ Pass |
| **TC-03: Đơn hàng thành công** | Điền thông tin đặt hàng, chọn Chuyển khoản Vietcombank, bấm Đặt hàng. | Chuyển hướng tới `/checkout/success`, hiển thị mã đơn hàng, QR chuyển khoản, và 4 bước stepper timeline. Nút "In hóa đơn" kích hoạt tốt trình in của hệ điều hành. | ✅ Pass |
| **TC-04: Lưu lịch sử đơn hàng** | Thực hiện đặt đơn hàng thành công trên trang Checkout. | Đơn hàng mới lập tức xuất hiện trong danh sách "Đơn hàng của tôi" tại trang `/profile`. | ✅ Pass |
| **TC-05: Chức năng Mua lại** | Vào `/profile` -> Tab Đơn hàng -> Click nút "Mua lại" ở đơn hàng mẫu `#NS92831`. | Giỏ hàng cũ được xóa sạch, thêm toàn bộ các sản phẩm của đơn `#NS92831` vào giỏ và chuyển hướng tới `/cart`. | ✅ Pass |
| **TC-06: Đổi mật khẩu & Đo độ mạnh** | Vào Tab Đổi mật khẩu; Gõ mật khẩu mới ngắn; Gõ mật khẩu mới dài và phức tạp hơn. | Thanh đo độ mạnh hiển thị màu Đỏ (Yếu), chuyển sang màu Vàng (Trung bình) và Xanh lá (Mạnh) khi độ phức tạp tăng lên. | ✅ Pass |
| **TC-07: Sửa lỗi vỡ giao diện** | Kiểm tra màn hình máy tính trung bình khi đăng nhập tài khoản. | Tất cả liên kết, nút bấm trên Header được căn chỉnh thẳng hàng trên một dòng duy nhất mà không bị vỡ thành 2 hàng. | ✅ Pass |

---

## 5. Kết luận nghiệm thu

Mọi hoạt động phát triển của phiên bản MVP v0.3.9 đều tuân thủ chặt chẽ quy trình **PLAN - DOC - BUILD - TEST**. Các tệp tin tài liệu được đồng bộ hóa hoàn toàn, mã nguồn được build thành công không lỗi, và các tính năng tương tác được kiểm thử trực quan trên trình duyệt trước khi giao.

Dự án đã sẵn sàng triển khai chính thức!

*Ký duyệt bởi:*
**Antigravity Coding Assistant & NôngSạch QA Team**
