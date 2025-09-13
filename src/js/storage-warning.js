// Local Storage Warning Logic
function checkStorageWarning() {
    const maxSize = 5 * 1024 * 1024; // 5MB (approximate, string-length based)
    let used = 0;
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        used += ((localStorage.getItem(key) || '').length);
    }
    if (used > maxSize * 0.9) {
        showStorageWarning();
    }
}

function showStorageWarning() {
    const area = document.getElementById('stats-area');
    if (area && !area.querySelector('[data-storage-warning]')) {
        const div = document.createElement('div');
        div.dataset.storageWarning = 'true';
        div.className = 'text-red-600 font-bold mt-2';
        div.textContent = 'Cảnh báo: Bộ nhớ gần đầy!';
        area.appendChild(div);
    }
}

// Re-check on data change and on load
document.addEventListener('DOMContentLoaded', checkStorageWarning);
if (typeof window.onWordListsChange === 'function') {
    window.onWordListsChange(() => checkStorageWarning());
}

