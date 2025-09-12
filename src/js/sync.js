// Gán các hàm chính vào window để app.js gọi được
window.importWordList = importWordList;
window.exportWordList = exportWordList;
window.syncWithDrive = syncWithDrive;
// Import/Export & Sync Logic
function importWordList(jsonData) {
    try {
        const lists = JSON.parse(jsonData);
        localStorage.setItem('jMasterVocabApp', JSON.stringify(lists));
        if (window.onWordListsChange) window.onWordListsChange(lists);
        alert('Nhập dữ liệu thành công!');
    } catch (e) {
        alert('Dữ liệu không hợp lệ!');
    }
}
function exportWordList(listName) {
    const lists = JSON.parse(localStorage.getItem('jMasterVocabApp') || '{}');
    const data = listName ? lists[listName] : lists;
    const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = listName ? `${listName}.json` : 'vocab.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
function syncWithDrive(link) {
    alert('Để đồng bộ, hãy tải file vocab.json lên Google Drive hoặc dịch vụ cloud, sau đó nhập link tại đây. Tính năng tự động đồng bộ sẽ được cập nhật sau.');
// Kết nối với UI
document.addEventListener('DOMContentLoaded', () => {
    const btnImport = document.getElementById('btn-import');
    const btnExport = document.getElementById('btn-export');
    if (btnImport) btnImport.onclick = () => {
        const input = prompt('Dán dữ liệu JSON để nhập:');
        if (input) importWordList(input);
    };
    if (btnExport) btnExport.onclick = () => {
        exportWordList();
    };
});
}
