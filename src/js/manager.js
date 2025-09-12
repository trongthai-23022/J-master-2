// Vocabulary Manager: Thêm, sửa, xóa, lưu từ vựng vào localStorage
const STORAGE_KEY = 'jMasterVocabApp';

function getWordLists() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
}
function addWord(listName, word) {
    const lists = getWordLists();
    if (!lists[listName]) lists[listName] = [];
    lists[listName].push(word);
    saveWordLists(lists);
}
function editWord(listName, wordId, newWord) {
    const lists = getWordLists();
    const idx = lists[listName].findIndex(w => w.id === wordId);
    if (idx > -1) lists[listName][idx] = newWord;
    saveWordLists(lists);
}
function deleteWord(listName, wordId) {
    const lists = getWordLists();
    lists[listName] = lists[listName].filter(w => w.id !== wordId);
    saveWordLists(lists);
}
function deleteList(listName) {
    const lists = getWordLists();
    delete lists[listName];
    saveWordLists(lists);
}
// Validate từ vựng
function validateWord(word) {
    return word && word.kanji && word.reading && word.meaning;
}

// Nhập từ JSON
function importWordLists(jsonStr) {
    try {
        const lists = JSON.parse(jsonStr);
        saveWordLists(lists);
        return true;
    } catch (e) {
        return false;
    }
}

// Xuất ra JSON
function exportWordLists() {
    return JSON.stringify(getWordLists(), null, 2);
}

// Thống kê
function getStats() {
    const lists = getWordLists();
    let vocabCount = 0;
    let listCount = Object.keys(lists).length;
    Object.values(lists).forEach(arr => vocabCount += arr.length);
    return { vocabCount, listCount };
}

// Đăng ký callback khi thay đổi dữ liệu
let changeCallbacks = [];
function onWordListsChange(cb) {
    changeCallbacks.push(cb);
}
function triggerChange() {
    changeCallbacks.forEach(cb => cb(getWordLists()));
}

// Gọi triggerChange sau mỗi thay đổi
function saveWordLists(lists) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lists));
    triggerChange();
}

// Gán các hàm chính vào window để app.js gọi được
window.getWordLists = getWordLists;
window.saveWordLists = saveWordLists;
window.addWord = addWord;
window.editWord = editWord;
window.deleteWord = deleteWord;
window.deleteList = deleteList;
window.importWordLists = importWordLists;
window.exportWordLists = exportWordLists;
window.getStats = getStats;
window.onWordListsChange = onWordListsChange;
