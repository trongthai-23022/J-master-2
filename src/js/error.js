// Error Handling & UI Notifications
function showError(message) {
    // Hiển thị thông báo lỗi trên UI (có thể thay bằng modal tuỳ ý)
    window.showToast(message, 'error', 5000);
    // Ghi log lỗi nếu logging có mặt
    if (typeof window.logEvent === 'function') {
        window.logEvent('error', { message });
    }
}

window.showError = showError;

// Ví dụ sử dụng:
// showError('Không thể lưu dữ liệu!');

