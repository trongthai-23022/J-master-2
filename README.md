J-Master: Your Personal Japanese Vocabulary Trainer

J-Master là một ứng dụng web học từ vựng tiếng Nhật mạnh mẽ, hoạt động hoàn toàn trên trình duyệt của bạn. Được thiết kế cho những người tự học, J-Master cung cấp một bộ công cụ toàn diện để quản lý, học và ôn tập từ vựng một cách hiệu quả và thú vị.

Với triết lý "dữ liệu của bạn, do bạn kiểm soát", J-Master không cần backend, không cần đăng ký tài khoản. Mọi thứ được lưu trữ an toàn ngay trên trình duyệt của bạn bằng localStorage.

✨ Tính năng nổi bật
J-Master không chỉ là một ứng dụng flashcard đơn thuần. Nó là một hệ sinh thái học tập cá nhân với đầy đủ các tính năng:

**Quản lý từ vựng chuyên sâu:**
- Tạo và quản lý nhiều bộ từ vựng khác nhau.
- Thêm, sửa, xóa từ vựng một cách dễ dàng.
- Nhập (Import): Nhập hàng loạt bộ từ từ file JSON, với cơ chế xử lý xung đột thông minh (Hợp nhất, Ghi đè, Bỏ qua).
- Xuất (Export): Sao lưu toàn bộ dữ liệu của bạn ra file JSON bất cứ lúc nào.

**Học tập tương tác qua Mini-games:**
- Luyện tập với bộ từ vựng bạn đã chọn qua 4 mini-game được thiết kế chuyên nghiệp.
- Mỗi game đều có giao diện và trải nghiệm người dùng được tối ưu hóa.

**AI-Powered Learning:**
- Tạo Truyện Chêm (Cloze Story): Sử dụng sức mạnh của Google Gemini API, ứng dụng có thể tự động tạo ra những câu chuyện ngắn chứa các từ vựng bạn đang học, giúp bạn hiểu sâu hơn về cách dùng từ trong ngữ cảnh thực tế.

**Tùy chỉnh toàn diện:**
- Giao diện Sáng/Tối (Light/Dark Mode): Tự động chuyển đổi giao diện để phù hợp với môi trường học tập của bạn.
- Đa ngôn ngữ: Hỗ trợ giao diện Tiếng Việt, Tiếng Anh và Tiếng Nhật.
- Cài đặt nâng cao: Lưu trữ an toàn khóa API Gemini và các tùy chọn khác.

**Trải nghiệm người dùng hiện đại:**
- Không cần tải lại trang: Giao diện đơn trang (Single Page Application) mượt mà.
- Thông báo Toast: Hệ thống thông báo hiện đại, không làm gián đoạn.
- Modal tùy chỉnh: Loại bỏ hoàn toàn các hộp thoại mặc định (alert, prompt) của trình duyệt.
- Hỗ trợ Offline: Mọi chức năng (trừ Tạo truyện AI) đều hoạt động hoàn hảo khi không có kết nối mạng.

🕹️ Các Mini-games
- **Flashcard:** Giao diện lật thẻ 3D mượt mà như Quizlet, có chế độ tự động chạy và tự động phát âm.
- **Match Game (Ghép thẻ):** Thử thách trí nhớ với game ghép cặp. Bạn có thể tùy chỉnh loại thẻ (Kanji, Nghĩa, Âm thanh...) và số lượng thẻ trước khi chơi.
- **Quiz (Trắc nghiệm):** Chọn đúng nghĩa cho một từ vựng cho trước từ 4 đáp án.
- **Writing (Luyện viết):** Kiểm tra khả năng nhớ cách đọc Hiragana của từ vựng.

🚀 Công nghệ sử dụng
J-Master được xây dựng với phương châm tối giản và hiệu quả, sử dụng các công nghệ web nền tảng:

- **HTML5 & CSS3:** Cấu trúc và giao diện.
- **Tailwind CSS:** Framework CSS để xây dựng giao diện nhanh chóng và nhất quán.
- **JavaScript (ES6+):** Toàn bộ logic của ứng dụng được viết bằng Vanilla JS, không phụ thuộc vào các framework lớn, giúp ứng dụng nhẹ và nhanh.

**Web APIs:**
- Local Storage: Lưu trữ toàn bộ dữ liệu người dùng.
- Web Speech API: Tích hợp chức năng phát âm từ vựng.
- Fetch API: Giao tiếp với Google Gemini API.
- Google Gemini API: Cung cấp sức mạnh cho tính năng tạo truyện chêm AI.

🛠️ Cài đặt & Triển khai
Sự đơn giản là cốt lõi của J-Master. Bạn không cần bất kỳ công cụ build phức tạp nào.

**Chạy trên máy cá nhân:**
1. Clone (tải) repository này về máy.
2. Mở file index.html bằng trình duyệt là bạn có thể bắt đầu sử dụng.
3. Để các module JavaScript hoạt động chính xác (do sử dụng import), bạn nên dùng một server live đơn giản. Tiện ích Live Server trên Visual Studio Code là một lựa chọn tuyệt vời.

**Triển khai lên Web:**
Vì đây là một dự án frontend thuần túy, bạn có thể deploy nó lên bất kỳ dịch vụ hosting trang web tĩnh nào.

**GitHub Pages là lựa chọn lý tưởng:**
1. Đẩy toàn bộ mã nguồn lên một repository trên GitHub.
2. Vào Settings > Pages.
3. Trong phần Build and deployment, chọn Source là Deploy from a branch.
4. Chọn branch chứa mã nguồn (thường là main hoặc master) và nhấn Save.
5. Chờ vài phút và trang web của bạn sẽ hoạt động!

📂 Cấu trúc thư mục
/
├── index.html              # File chính của ứng dụng
├── src/
│   ├── css/
│   │   └── tailwind.css    # Style tùy chỉnh và các lớp tiện ích
│   ├── js/
│   │   ├── games/          # Chứa code cho các mini-games
│   │   │   ├── flashcard.js
│   │   │   ├── quiz.js
│   │   │   └── writing.js
│   │   ├── app.js          # File JS chính, tích hợp các module
│   │   ├── cloze-story.js  # Logic và UI cho truyện chêm
│   │   ├── gemini.js       # Giao tiếp với Gemini API
│   │   ├── manager.js      # Quản lý dữ liệu từ vựng (CRUD)
│   │   ├── match-game.js   # Logic cho game ghép thẻ
│   │   ├── notifications.js# Hệ thống thông báo toast
│   │   └── ... (các file module khác)
│   └── game.html           # Trang riêng để chạy các mini-games
└── README.md               # File bạn đang đọc