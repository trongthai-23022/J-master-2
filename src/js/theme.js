// Dark/Light Mode & Theme Settings
function setTheme(theme) {
    localStorage.setItem('jMasterTheme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
document.addEventListener('DOMContentLoaded', () => {
    setTheme(getTheme());
    const btn = document.getElementById('btn-theme');
    if (btn) btn.onclick = () => {
        const next = getTheme() === 'light' ? 'dark' : 'light';
        setTheme(next);
    };
});
}
function getTheme() {
    return localStorage.getItem('jMasterTheme') || 'light';
}
// ...Thêm các hàm chuyển đổi, render UI
