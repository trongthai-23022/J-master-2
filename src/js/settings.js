// Gán các hàm chính vào window để app.js gọi được
window.getApiKey = getApiKey;
window.saveApiKey = saveApiKey;
window.getTheme = getTheme;
window.saveTheme = saveTheme;
window.getLang = getLang;
window.saveLang = saveLang;
window.getStorageWarning = getStorageWarning;
window.saveStorageWarning = saveStorageWarning;

// --- API KEY ---
const API_KEY_STORAGE = 'jMasterApiKey';

function getApiKey() {
    const encryptedKey = localStorage.getItem(API_KEY_STORAGE);
    if (!encryptedKey) return '';
    try {
        // Gọi hàm giải mã từ encrypt.js
        return window.decryptData(encryptedKey);
    } catch (e) {
        console.error("Failed to decrypt API key:", e);
        // Nếu giải mã lỗi, xóa key hỏng
        localStorage.removeItem(API_KEY_STORAGE);
        return '';
    }
}

function saveApiKey(key) {
    if (!key || !key.trim()) {
        localStorage.removeItem(API_KEY_STORAGE);
        return;
    }
    // Gọi hàm mã hóa từ encrypt.js
    const encryptedKey = window.encryptData(key.trim());
    localStorage.setItem(API_KEY_STORAGE, encryptedKey);
}


// --- THEME ---
const THEME_STORAGE = 'jMasterTheme';
function getTheme() {
    return localStorage.getItem(THEME_STORAGE) || 'light';
}
function saveTheme(theme) {
    localStorage.setItem(THEME_STORAGE, theme);
    // Áp dụng theme ngay lập tức
    document.documentElement.classList.toggle('dark', theme === 'dark');
}

// --- LANGUAGE ---
const LANG_STORAGE = 'jMasterLang';
function getLang() {
    return localStorage.getItem(LANG_STORAGE) || 'vi';
}
function saveLang(lang) {
    localStorage.setItem(LANG_STORAGE, lang);
    // Gọi hàm cập nhật giao diện nếu có
    if (window.setLangUI) window.setLangUI(lang);
}

// --- STORAGE WARNING ---
const STORAGE_WARNING = 'jMasterStorageWarning';
function getStorageWarning() {
    return localStorage.getItem(STORAGE_WARNING) === 'true';
}
function saveStorageWarning(val) {
    localStorage.setItem(STORAGE_WARNING, val ? 'true' : 'false');
}