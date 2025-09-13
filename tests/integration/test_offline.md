# Integration Test: Chế độ Offline

## Mục tiêu
- Đảm bảo các thành phần của ứng dụng phối hợp và hoạt động trơn tru khi không có kết nối mạng.

## Test Cases
- [ ] **Khởi động Offline:** Tải trang khi có mạng, sau đó ngắt mạng và tải lại trang. Dữ liệu từ `localStorage` phải được load lên chính xác.
- [ ] **Quản lý từ vựng Offline:**
	- [ ] Thêm, sửa, xóa từ và bộ từ khi không có mạng.
	- [ ] Sau khi có mạng trở lại và tải lại trang, các thay đổi phải được giữ nguyên.
- [ ] **Chơi game Offline:**
	- [ ] Tất cả mini-games (Flashcard, Match, Quiz, Writing) phải khởi động và chơi được bình thường.
- [ ] **Chức năng AI Offline:**
	- [ ] Nhấn nút "Tạo truyện" khi không có mạng, ứng dụng phải hiển thị thông báo lỗi thân thiện (vd: "Không thể kết nối..."), không gây crash.
- [ ] **Cài đặt Offline:** Thay đổi cài đặt (theme, ngôn ngữ...) khi không có mạng. Các thay đổi phải được áp dụng và lưu lại.

Lưu ý về các file Unit Test (.js)
Các file như test_manager.js, test_cloze_story.js là các file Unit Test, dùng để kiểm thử từng hàm nhỏ trong code. Hiện tại, chúng chỉ là các file giữ chỗ và không thể tự động chạy vì dự án chưa được thiết lập một môi trường kiểm thử chuyên dụng (như Jest, Vitest, hoặc Mocha).

Việc viết và chạy Unit Test hoàn chỉnh là một quá trình phức tạp, đòi hỏi phải cài đặt thêm các thư viện và cấu hình môi trường. Do đó, các checklist kiểm thử thủ công bên trên là phương pháp hiệu quả nhất để đảm bảo chất lượng cho dự án ở thời điểm hiện tại.
# Integration Test: Offline Mode

## Mục tiêu
- Đảm bảo website hoạt động khi không có mạng (trừ chức năng AI Gemini).

## Test Cases
- [ ] Ngắt kết nối mạng, kiểm tra các chức năng học, quản lý từ vựng, game ghép thẻ
- [ ] Thông báo khi AI Gemini không hoạt động offline
- [ ] Dữ liệu vẫn lưu và truy xuất được khi offline
