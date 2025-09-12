// Local Storage Warning Logic
function checkStorageWarning() {
    const maxSize = 5 * 1024 * 1024; // 5MB
    let used = 0;
    for (let key in localStorage) {
        if (!localStorage.hasOwnProperty(key)) continue;
        used += (localStorage.getItem(key) || '').length;
    }
    if (used > maxSize * 0.9) {
        showStorageWarning();
    }
function showStorageWarning() {
    const area = document.getElementById('stats-area');
    if (area) {
        area.innerHTML += '<div class="text-red-600 font-bold mt-2">Cảnh báo: Bộ nhớ gần đầy!</div>';
    }
}
// Tự động kiểm tra khi thay đổi dữ liệu
window.onWordListsChange = checkStorageWarning;
document.addEventListener('DOMContentLoaded', checkStorageWarning);
}
