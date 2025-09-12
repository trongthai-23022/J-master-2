// Gán các hàm chính vào window để app.js gọi được
window.getApiKey = getApiKey;
window.saveApiKey = saveApiKey;
window.getTheme = getTheme;
window.saveTheme = saveTheme;
window.getLang = getLang;
window.saveLang = saveLang;
window.getStorageWarning = getStorageWarning;
window.saveStorageWarning = saveStorageWarning;
// Settings Modal & Local Storage Logic
const API_KEY_STORAGE = 'jMasterApiKey';
function getApiKey() {
    return localStorage.getItem(API_KEY_STORAGE) || '';
}
function saveApiKey(key) {
    localStorage.setItem(API_KEY_STORAGE, key);
}

// Lưu/cập nhật theme
const THEME_STORAGE = 'jMasterTheme';
function getTheme() {
    return localStorage.getItem(THEME_STORAGE) || 'light';
}
function saveTheme(theme) {
    localStorage.setItem(THEME_STORAGE, theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
}

// Lưu/cập nhật ngôn ngữ
const LANG_STORAGE = 'jMasterLang';
function getLang() {
    return localStorage.getItem(LANG_STORAGE) || 'vi';
}
function saveLang(lang) {
    localStorage.setItem(LANG_STORAGE, lang);
    // Gọi hàm cập nhật giao diện nếu có
    if (window.setLangUI) window.setLangUI(lang);
}

// Lưu/cập nhật cảnh báo bộ nhớ
const STORAGE_WARNING = 'jMasterStorageWarning';
function getStorageWarning() {
    return localStorage.getItem(STORAGE_WARNING) === 'true';
}
function saveStorageWarning(val) {
    localStorage.setItem(STORAGE_WARNING, val ? 'true' : 'false');
}

// Kết nối với modal UI
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('modal-settings');
    const btnOpen = document.getElementById('btn-settings');
    const btnCancel = document.getElementById('btn-settings-cancel');
    const btnSave = document.getElementById('btn-settings-save');
    if (btnOpen) btnOpen.onclick = () => { modal.classList.remove('hidden'); };
    if (btnCancel) btnCancel.onclick = () => { modal.classList.add('hidden'); };
    if (btnSave) btnSave.onclick = () => {
        const lang = document.getElementById('settings-lang').value;
        const theme = document.getElementById('settings-theme').value;
        const warning = document.getElementById('settings-storage-warning').checked;
        saveLang(lang);
        saveTheme(theme);
        saveStorageWarning(warning);
        modal.classList.add('hidden');
    };
    // Khởi tạo giá trị modal
    document.getElementById('settings-lang').value = getLang();
    document.getElementById('settings-theme').value = getTheme();
    document.getElementById('settings-storage-warning').checked = getStorageWarning();
});
