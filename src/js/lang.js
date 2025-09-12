// Multi-language UI Logic
function setLanguage(lang) {
    localStorage.setItem('jMasterLang', lang);
    setLangUI(lang);
// Hàm cập nhật giao diện
function setLangUI(lang) {
    // Demo: chỉ đổi tiêu đề
    const title = document.querySelector('h1');
    if (!title) return;
    if (lang === 'en') title.textContent = 'J-Master: Japanese Vocabulary Learning';
    else if (lang === 'ja') title.textContent = 'J-Master: 日本語語彙学習';
    else title.textContent = 'J-Master: Học Từ Vựng Tiếng Nhật';
}
document.addEventListener('DOMContentLoaded', () => {
    setLangUI(getLanguage());
    const btn = document.getElementById('btn-lang');
    if (btn) btn.onclick = () => {
        const next = getLanguage() === 'vi' ? 'en' : (getLanguage() === 'en' ? 'ja' : 'vi');
        setLanguage(next);
    };
});
}
function getLanguage() {
    return localStorage.getItem('jMasterLang') || 'vi';
}
// ...Thêm các hàm chuyển đổi, render UI
