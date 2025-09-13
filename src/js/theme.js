// Theme init + toggle using settings.js if available
document.addEventListener('DOMContentLoaded', () => {
    try {
        const current = (window.getTheme ? window.getTheme() : (localStorage.getItem('jMasterTheme') || 'light'));
        document.documentElement.classList.toggle('dark', current === 'dark');
    } catch {}

    const btn = document.getElementById('btn-theme');
    if (btn) btn.onclick = () => {
        const current = (window.getTheme ? window.getTheme() : (localStorage.getItem('jMasterTheme') || 'light'));
        const next = current === 'light' ? 'dark' : 'light';
        if (window.saveTheme) {
            window.saveTheme(next);
        } else {
            localStorage.setItem('jMasterTheme', next);
            document.documentElement.classList.toggle('dark', next === 'dark');
        }
    };
});

