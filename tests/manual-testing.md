# Checklist Kiểm Thử Thủ Công (Manual Testing)

## 1. Giao diện chính & Cài đặt
- [ ] **Giao diện:** Kiểm tra hiển thị chính xác trên cả chế độ Sáng (Light) và Tối (Dark).
- [ ] **Nút Cài đặt:** Mở được modal Cài đặt.
- [ ] **Lưu Cài đặt:**
	- [ ] Thay đổi và lưu API Key thành công.
	- [ ] Chuyển đổi và lưu giao diện Sáng/Tối.
	- [ ] Chuyển đổi và lưu ngôn ngữ.
	- [ ] Bật/tắt cảnh báo bộ nhớ.
- [ ] **Responsive:** Giao diện hiển thị tốt trên cả Desktop và Mobile.

## 2. Quản lý Từ vựng
- [ ] **Tạo bộ từ mới:**
	- [ ] Mở được modal "Tạo bộ từ mới".
	- [ ] Báo lỗi nếu để trống tên hoặc nhập tên trùng lặp.
	- [ ] Tạo thành công và hiển thị trong danh sách.
- [ ] **Thêm/Sửa/Xóa từ:**
	- [ ] Thêm từ mới vào một bộ thành công.
	- [ ] Sửa một từ đã có thành công.
	- [ ] Xóa một từ thành công sau khi xác nhận.
- [ ] **Xóa bộ từ:**
	- [ ] Xóa toàn bộ một bộ từ thành công sau khi xác nhận.

## 3. Chức năng Import/Export
- [ ] **Export:** Nhấn nút Export tải về file `j-master-backup.json` thành công.
- [ ] **Import (Mở Modal):**
	- [ ] Mở được modal "Nhập dữ liệu từ JSON".
	- [ ] JSON mẫu hiển thị chính xác.
	- [ ] Nút "Sao chép mẫu" hoạt động.
- [ ] **Import (Xử lý):**
	- [ ] Báo lỗi khi không nhập dữ liệu.
	- [ ] Nhập thành công một bộ từ mới hoàn toàn.
	- [ ] **Xử lý xung đột:** Khi nhập bộ từ đã tồn tại, hộp thoại lựa chọn (Hợp nhất, Ghi đè, Bỏ qua) hiện ra và hoạt động đúng với từng lựa chọn.

## 4. Mini-games & AI
- [ ] **Chọn bộ từ:** Dropdown chọn bộ từ để chơi game hiển thị và hoạt động đúng.
- [ ] **Flashcard Game:**
	- [ ] Game khởi động với đúng bộ từ.
	- [ ] Lật thẻ, chuyển thẻ (trước/sau), phát âm hoạt động.
	- [ ] Chế độ Tự động chạy và Tự động phát âm hoạt động.
- [ ] **Match Game:**
	- [ ] Màn hình Cài đặt game (chọn loại thẻ, số lượng) hoạt động.
	- [ ] Game khởi động với đúng cài đặt.
	- [ ] Logic ghép thẻ, hiệu ứng (đúng/sai), bộ đếm giờ hoạt động.
	- [ ] Màn hình kết quả hiển thị và các nút hoạt động.
- [ ] **Quiz & Writing Game:** Game khởi động và chơi được bình thường.
- [ ] **Tạo Truyện Chêm (AI):**
	- [ ] Báo lỗi nếu chưa có API Key.
	- [ ] Báo lỗi nếu bộ từ có ít hơn 3 từ.
	- [ ] Mở modal, hiển thị trạng thái tải.
	- [ ] Tạo và hiển thị truyện thành công.
	- [ ] Kéo-thả từ, kiểm tra đáp án hoạt động.

## 5. Trải nghiệm chung
- [ ] **Thông báo Toast:** Mọi thông báo (thành công, lỗi, thông tin) đều hiển thị dưới dạng toast, không dùng `alert`.
- [ ] **Modal:** Mọi hộp thoại (thêm, sửa, xóa, import, cloze story) đều là modal tùy chỉnh, không dùng `prompt`.
- [ ] **Chế độ Offline:** Ngắt mạng và kiểm tra lại các chức năng chính (trừ AI) vẫn hoạt động.
# Manual Test Checklist for UI/UX

## Dashboard
- [ ] Hiển thị tiêu đề, mô tả, nút chuyển chức năng rõ ràng
- [ ] Chuyển màn hình học/manager hoạt động đúng

## Học & Luyện tập
- [ ] Chọn bộ từ vựng, hiển thị danh sách
- [ ] Game ghép thẻ hoạt động, kiểm tra logic ghép
- [ ] Tạo truyện chêm AI hoạt động, hiển thị kết quả

## Quản lý Từ vựng
- [ ] Thêm, sửa, xóa từ vựng hoạt động
- [ ] Nhập/xuất bộ từ vựng bằng JSON

## Cài đặt
- [ ] Lưu khóa API Gemini, hiển thị thông báo
- [ ] Chuyển đổi giao diện tối/sáng
- [ ] Đổi ngôn ngữ giao diện

## Trải nghiệm
- [ ] Responsive trên desktop/mobile
- [ ] Thông báo lỗi, trạng thái rõ ràng
- [ ] Tốc độ tải trang nhanh

## Regression Checklist
- [ ] Kiểm tra lại toàn bộ chức năng sau mỗi lần cập nhật
- [ ] Đảm bảo không có lỗi UI/UX, logic, dữ liệu
- [ ] Kiểm tra lại các test case contract, integration, unit, performance
