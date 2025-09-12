// App.js: Tích hợp các module chính, khởi tạo app
import './manager.js';
import './match-game.js';
import './cloze-story.js';
import './settings.js';
import './sync.js';
import './storage-warning.js';
import './lang.js';
import './theme.js';
import './minigames.js';
import './encrypt.js';

// Khởi tạo app, gắn event listeners, render UI
function initApp() {
    // Khởi tạo giao diện, kiểm tra storage, ngôn ngữ, theme
    if (window.checkStorageWarning) window.checkStorageWarning();
    if (window.setLangUI) window.setLangUI(window.getLang ? window.getLang() : 'vi');
    if (window.setTheme) window.setTheme(window.getTheme ? window.getTheme() : 'light');

    // Gắn event listeners cho các nút dashboard
    document.getElementById('btn-add-list')?.addEventListener('click', () => {
        try {
            const name = prompt('Tên danh sách mới:');
            if (name) {
                window.saveWordLists({ ...window.getWordLists(), [name]: [] });
                window.logEvent && window.logEvent('add_list', {list: name});
            }
        } catch (e) {
            window.showError && window.showError('Lỗi thêm danh sách: ' + e.message);
        }
    });
    document.getElementById('btn-settings')?.addEventListener('click', () => {
        window.logEvent && window.logEvent('open_settings');
    });
    // ...Thêm các event khác nếu cần

// Xử lý lỗi toàn cục
window.onerror = function(msg, url, line, col, error) {
    if (window.showError) window.showError(`Lỗi: ${msg} (${url}:${line})`);
    window.logEvent && window.logEvent('error', {msg, url, line, col, error});
    return true;
};
}
window.onload = initApp;
