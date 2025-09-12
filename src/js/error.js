// Error Handling & UI Notifications
function showError(message) {
    // Hiển thị thông báo lỗi trên UI
    alert(message); // Có thể thay bằng modal đẹp hơn
    window.showError = showError;
    // Ghi log lỗi
    logEvent('error', {message});
}

// Ví dụ sử dụng:
// showError('Không thể lưu dữ liệu!');
