// Thay thế toàn bộ nội dung file: src/js/manager.js

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

function validateWord(word) {
    return word && word.kanji && word.reading && word.meaning;
}

function exportWordLists() {
    return JSON.stringify(getWordLists(), null, 2);
}

function getStats() {
    const lists = getWordLists();
    let vocabCount = 0;
    let listCount = Object.keys(lists).length;
    Object.values(lists).forEach(arr => vocabCount += arr.length);
    return { vocabCount, listCount };
}

let changeCallbacks = [];
function onWordListsChange(cb) {
    changeCallbacks.push(cb);
}

function triggerChange() {
    changeCallbacks.forEach(cb => cb(getWordLists()));
}

function saveWordLists(lists) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lists));
    triggerChange();
}

/**
 * NÂNG CẤP: Xử lý nhập dữ liệu JSON với các tùy chọn Ghi đè, Hợp nhất, Bỏ qua.
 * @param {string} jsonStr - Nội dung file JSON.
 * @returns {Promise<object>} - Promise giải quyết với kết quả { success: boolean, message: string }.
 */
async function importWordLists(jsonStr) {
    let importedLists;
    try {
        importedLists = JSON.parse(jsonStr);
        if (typeof importedLists !== 'object' || importedLists === null) {
            throw new Error("Dữ liệu JSON phải là một object chứa các bộ từ.");
        }
    } catch (e) {
        return { success: false, message: `Lỗi đọc file JSON: ${e.message}` };
    }

    const currentLists = getWordLists();
    const newLists = { ...currentLists };
    let conflicts = 0;
    let newWordsCount = 0;

    for (const listName in importedLists) {
        if (!Array.isArray(importedLists[listName])) continue;

        const wordsToImport = importedLists[listName];

        if (newLists[listName]) { // Xung đột
            conflicts++;
            const choice = await showConflictResolutionModal(listName, wordsToImport.length);

            if (choice === 'merge') {
                const existingWordsSet = new Set(newLists[listName].map(w => `${w.kanji}|${w.meaning}`));
                const newUniqueWords = wordsToImport.filter(w => !existingWordsSet.has(`${w.kanji}|${w.meaning}`));
                newLists[listName].push(...newUniqueWords);
                newWordsCount += newUniqueWords.length;
            } else if (choice === 'overwrite') {
                newLists[listName] = wordsToImport;
            }
            // Bỏ qua nếu choice === 'skip'
        } else {
            // Bộ từ mới
            newLists[listName] = wordsToImport;
            newWordsCount += wordsToImport.length;
        }
    }

    saveWordLists(newLists);
    
    let message = `Nhập thành công!`;
    if (conflicts > 0) {
        message = `Hoàn tất xử lý ${conflicts} bộ từ bị trùng lặp.`;
    } else if (newWordsCount > 0) {
        message = `Đã nhập thành công ${newWordsCount} từ mới.`;
    } else {
        message = `Không có dữ liệu mới nào được nhập.`;
    }

    return { success: true, message };
}

/**
 * Hiển thị modal cho phép người dùng giải quyết xung đột khi import.
 * @param {string} listName - Tên bộ từ bị trùng.
 * @param {number} newCount - Số lượng từ trong bộ từ sắp import.
 * @returns {Promise<string>} - Promise giải quyết với lựa chọn của người dùng ('merge', 'overwrite', 'skip').
 */
function showConflictResolutionModal(listName, newCount) {
    return new Promise((resolve) => {
        const modal = document.getElementById('confirm-delete-modal');
        const title = document.getElementById('confirm-delete-title');
        const message = document.getElementById('confirm-delete-message');
        const buttonContainer = message.nextElementSibling;

        title.textContent = `Bộ từ "${listName}" đã tồn tại`;
        message.innerHTML = `Bạn muốn làm gì với ${newCount} từ sắp được nhập?`;

        buttonContainer.innerHTML = `
            <button id="resolve-merge" class="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 text-sm">Hợp nhất</button>
            <button id="resolve-overwrite" class="px-4 py-2 rounded bg-yellow-500 text-white hover:bg-yellow-600 text-sm">Ghi đè</button>
            <button id="resolve-skip" class="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-sm">Bỏ qua</button>
        `;
        
        const cleanupAndResolve = (choice) => {
            modal.classList.add('hidden');
            resolve(choice);
        };

        document.getElementById('resolve-merge').onclick = () => cleanupAndResolve('merge');
        document.getElementById('resolve-overwrite').onclick = () => cleanupAndResolve('overwrite');
        document.getElementById('resolve-skip').onclick = () => cleanupAndResolve('skip');
        
        modal.classList.remove('hidden');
    });
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