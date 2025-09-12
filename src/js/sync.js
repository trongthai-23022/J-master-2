// Gán hàm export vào window để app.js gọi được
window.exportWordList = exportWordList;

/**
 * Xuất toàn bộ hoặc một danh sách từ vựng ra file JSON.
 * @param {string} [listName] - Tên danh sách cần xuất. Nếu bỏ trống, sẽ xuất tất cả.
 */
function exportWordList(listName) {
    const lists = JSON.parse(localStorage.getItem('jMasterVocabApp') || '{}');
    const data = listName ? { [listName]: lists[listName] } : lists;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = listName ? `${listName}.json` : 'j-master-backup.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}