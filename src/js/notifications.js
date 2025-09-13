// Tạo file mới: src/js/notifications.js

/**
 * Hiển thị một thông báo "toast" trên màn hình.
 * @param {string} message - Nội dung thông báo.
 * @param {string} [type='info'] - Loại thông báo ('success', 'error', 'info').
 * @param {number} [duration=3000] - Thời gian hiển thị (ms).
 */
function showToast(message, type = 'info', duration = 3000) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    // Thêm icon tương ứng (tùy chọn)
    const icon = {
        success: '✓',
        error: '!',
        info: 'ℹ'
    }[type];
    
    toast.innerHTML = `<span class="font-bold mr-2">${icon}</span> <span>${message}</span>`;
    
    container.appendChild(toast);

    // Hiệu ứng trượt vào
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);

    // Tự động xóa sau một khoảng thời gian
    setTimeout(() => {
        toast.classList.remove('show');
        // Xóa element khỏi DOM sau khi hiệu ứng trượt ra kết thúc
        toast.addEventListener('transitionend', () => {
            toast.remove();
        });
    }, duration);
}

// Gán vào window để các file khác có thể sử dụng
window.showToast = showToast;
