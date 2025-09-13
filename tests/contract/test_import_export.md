# Contract Test: Data Import/Export

## Mục tiêu
- Đảm bảo chức năng nhập/xuất bộ từ vựng hoạt động đúng "hợp đồng" dữ liệu.

## Test Cases
- [ ] **Export:**
	- [ ] File JSON được xuất ra có cấu trúc đúng: `{ "Tên bộ từ": [{ "id": ..., "kanji": ..., "reading": ..., "meaning": ... }] }`.
- [ ] **Import (Dữ liệu hợp lệ):**
	- [ ] Nhập lại file vừa xuất, dữ liệu được phục hồi chính xác.
	- [ ] Nhập file JSON có cấu trúc hợp lệ, ứng dụng xử lý và không báo lỗi.
- [ ] **Import (Dữ liệu không hợp lệ):**
	- [ ] Nhập file không phải là JSON (vd: file .txt), hiển thị thông báo lỗi.
	- [ ] Nhập file JSON nhưng sai cấu trúc (vd: là một mảng thay vì object), hiển thị thông báo lỗi.
	- [ ] Nhập file JSON có value không phải là mảng từ vựng, các bộ từ đó bị bỏ qua.
- [ ] **Import (Xử lý xung đột):**
	- [ ] Khi nhập trùng tên bộ từ, đảm bảo các lựa chọn **Hợp nhất**, **Ghi đè**, **Bỏ qua** thực hiện đúng logic đã định.
# Contract Test: Data Import/Export

## Mục tiêu
- Đảm bảo chức năng nhập/xuất bộ từ vựng hoạt động đúng, dữ liệu hợp lệ.

## Test Cases
- [ ] Nhập dữ liệu JSON hợp lệ, hiển thị đúng bộ từ vựng
- [ ] Nhập dữ liệu JSON không hợp lệ, hiển thị thông báo lỗi
- [ ] Xuất bộ từ vựng ra file JSON, kiểm tra nội dung file
- [ ] Nhập lại file vừa xuất, dữ liệu khớp hoàn toàn
