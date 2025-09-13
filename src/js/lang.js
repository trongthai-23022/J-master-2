// Multi-language UI Logic (uses settings.js if present)
function setLangUI(lang) {
    const title = document.querySelector('h1');
    if (!title) return;
    if (lang === 'en') title.textContent = 'J-Master: Japanese Vocabulary Learning';
    else if (lang === 'jp' || lang === 'ja') title.textContent = 'J-Master: 日本語の語彙学習';
    else title.textContent = 'J-Master: Học Từ Vựng Tiếng Nhật';
}

window.setLangUI = setLangUI;

document.addEventListener('DOMContentLoaded', () => {
    const getLang = (window.getLang ? window.getLang : () => localStorage.getItem('jMasterLang') || 'vi');
    const saveLang = (window.saveLang ? window.saveLang : (l => localStorage.setItem('jMasterLang', l)));

    let current = getLang();
    setLangUI(current);
    const btn = document.getElementById('btn-lang');
    if (btn) btn.onclick = () => {
        current = current === 'vi' ? 'en' : (current === 'en' ? 'jp' : 'vi');
        saveLang(current);
        setLangUI(current);
    };
});

