# Feature Specification: Dashboard, học, quản lý từ vựng, đồng bộ, chia sẻ, thống kê, giao diện, bảo mật, offline, âm thanh, mini-game

**Feature Branch**: `002-dashboard-hoc-quan-ly-tu-vung`
**Created**: September 12, 2025
**Status**: Draft
**Input**: User description: "Dashboard chính\n\nGiới thiệu, chuyển đến các chức năng học và quản lý từ vựng.\nHọc & Luyện tập\n\nChọn bộ từ vựng để học.\nGame ghép thẻ: luyện ghép Kanji, cách đọc, nghĩa, âm thanh.\nTạo truyện chêm AI (fill-in-the-blank story) sử dụng Gemini API.\nQuản lý Từ vựng\n\nThêm, sửa, xóa từ vựng.\nTạo/xóa bộ từ vựng.\nNhập hàng loạt từ vựng bằng JSON.\nCài đặt\n\nLưu khóa API Gemini vào local storage (chỉ lưu trên trình duyệt).\nLưu trữ dữ liệu\n\nTất cả dữ liệu từ vựng và cài đặt đều lưu bằng local storage, không có backend.\nTrò chơi\n\nGame ghép thẻ (matching pairs).\nTruyện chêm AI (kéo thả từ vào ô trống).\n\nĐồng bộ hóa dữ liệu\n\nđồng bộ từ vựng giữa các thiết bị xuất/nhập file, gắn 1 link drive share chung ở web\nChia sẻ bộ từ vựng\n\nCho phép người dùng xuất bộ từ vựng ra file hoặc chia sẻ qua link.\nThống kê & theo dõi tiến độ học\n\nLưu lịch sử học, số lần hoàn thành game, tiến bộ từng bộ từ.\nTùy chỉnh giao diện\n\nChế độ tối/sáng, thay đổi màu sắc, font chữ.\nHỗ trợ nhiều ngôn ngữ\n\nGiao diện tiếng Việt, tiếng Anh, tiếng Nhật.\nTích hợp thêm mini-game\n\nGame flashcard, quiz, luyện viết.\nCảnh báo/quản lý dung lượng local storage\n\nThông báo khi gần đầy bộ nhớ, hướng dẫn xuất dữ liệu.\nTăng cường bảo mật\n\nMã hóa dữ liệu nhạy cảm (API key, từ vựng cá nhân).\nHỗ trợ offline hoàn toàn\n\nĐảm bảo mọi chức năng hoạt động khi không có mạng.\nTích hợp âm thanh\n\nThêm phát âm tự động cho từ vựng (Web Speech API)."

## Execution Flow (main)
```
1. Parse user description from Input
2. Extract key concepts: dashboard, học, quản lý từ vựng, đồng bộ, chia sẻ, thống kê, giao diện, bảo mật, offline, âm thanh, mini-game
3. Mark unclear aspects: đồng bộ hóa không backend, chia sẻ qua link, bảo mật dữ liệu, cảnh báo local storage
4. Fill User Scenarios & Testing section
5. Generate Functional Requirements
6. Identify Key Entities
7. Run Review Checklist
8. Return: SUCCESS (spec ready for planning)
```

---

## User Scenarios & Testing

### Primary User Story
Người dùng truy cập website, quản lý và học từ vựng tiếng Nhật qua các game, truyện chêm AI, với dữ liệu lưu trên trình duyệt, có thể xuất/nhập bộ từ, tùy chỉnh giao diện, và sử dụng offline.

### Acceptance Scenarios
1. **Given** người dùng truy cập dashboard, **When** chọn chức năng học hoặc quản lý từ vựng, **Then** chuyển đến màn hình tương ứng.
2. **Given** người dùng thêm/sửa/xóa từ vựng, **When** thao tác thành công, **Then** dữ liệu được lưu vào local storage và hiển thị lại.
3. **Given** người dùng muốn đồng bộ hoặc chia sẻ bộ từ, **When** xuất/nhập file hoặc sử dụng link drive, **Then** dữ liệu được cập nhật trên thiết bị khác.
4. **Given** người dùng chơi game ghép thẻ hoặc truyện chêm AI, **When** hoàn thành, **Then** tiến độ học được lưu lại.
5. **Given** người dùng thay đổi giao diện, **When** chọn chế độ tối/sáng, **Then** giao diện thay đổi ngay lập tức.
6. **Given** người dùng sử dụng website offline, **When** không có mạng, **Then** các chức năng vẫn hoạt động (trừ AI Gemini).

### Edge Cases
### Edge Cases
 Khi local storage đầy: Ứng dụng cảnh báo và hướng dẫn xuất dữ liệu ra file JSON.
 Nếu trình duyệt không hỗ trợ local storage: Hiển thị thông báo lỗi, hướng dẫn sử dụng trình duyệt hiện đại.
 Chia sẻ bộ từ qua file: Dữ liệu chỉ lưu trên máy người dùng, không gửi lên server, bảo mật cá nhân.
 Nhập file không hợp lệ: Hiển thị thông báo lỗi toast, không ghi đè dữ liệu cũ.
 API Gemini hết hạn/không hợp lệ: Thông báo lỗi, hướng dẫn nhập lại API key.

**FR-005**: Website MUST cho phép đồng bộ bộ từ vựng giữa các thiết bị qua xuất/nhập file JSON (không backend, không lưu trữ server).
**FR-006**: Website MUST cho phép chia sẻ bộ từ vựng qua file JSON (không backend, không link động).
**FR-011**: Website MUST cảnh báo khi local storage gần đầy (dưới 10% dung lượng), hướng dẫn xuất dữ liệu.
**FR-012**: Website MUST mã hóa dữ liệu nhạy cảm (API key, từ vựng cá nhân) bằng thuật toán đơn giản phía client (ví dụ: base64 hoặc mã hóa đối xứng nhẹ).
- **FR-002**: Website MUST cho phép chọn, thêm, sửa, xóa, nhập/xuất bộ từ vựng bằng local storage.

### Requirement Completeness
 - [x] No [NEEDS CLARIFICATION] markers remain
 - [x] Requirements are testable and unambiguous
 - [x] Success criteria are measurable
 - [x] Scope is clearly bounded
 - [x] Dependencies and assumptions identified
- **FR-007**: Website MUST lưu tiến độ học, lịch sử chơi game.

### Key Entities
- **User**: Người sử dụng website, có dữ liệu cá nhân, bộ từ vựng, tiến độ học.
- **Vocabulary List**: Bộ từ vựng, gồm các từ, nghĩa, cách đọc, âm thanh.
- **Game Session**: Lịch sử chơi game, tiến độ học.
- **Settings**: Cài đặt giao diện, ngôn ngữ, API key.

---

## Review & Acceptance Checklist

### Content Quality
- [ ] No implementation details (languages, frameworks, APIs)
- [ ] Focused on user value and business needs
- [ ] Written for non-technical stakeholders
- [ ] All mandatory sections completed

### Requirement Completeness
- [ ] No [NEEDS CLARIFICATION] markers remain
- [ ] Requirements are testable and unambiguous
- [ ] Success criteria are measurable
- [ ] Scope is clearly bounded
- [ ] Dependencies and assumptions identified

---

## Execution Status

- [ ] User description parsed
- [ ] Key concepts extracted
- [ ] Ambiguities marked
- [ ] User scenarios defined
- [ ] Requirements generated
- [ ] Entities identified
- [ ] Review checklist passed

---
