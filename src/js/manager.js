// src/js/manager.js -- PHIÊN BẢN SỬA LỖI HOÀN CHỈNH

const STORAGE_KEY = 'jMasterVocabApp';

function getWordLists() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
}

function saveWordLists(lists) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lists));
    triggerChange();
}

function addWord(listName, word) {
    const lists = getWordLists();
    if (!lists[listName]) lists[listName] = [];
    // Gán ID duy nhất nếu chưa có
    if (!word.id) {
        word.id = Date.now();
    }
    lists[listName].push(word);
    saveWordLists(lists);
}

function editWord(listName, wordId, newWord) {
    const lists = getWordLists();
    const list = lists[listName] || [];
    const wordIndex = list.findIndex(w => w.id === wordId);
    if (wordIndex > -1) {
        lists[listName][wordIndex] = newWord;
        saveWordLists(lists);
    }
}

function deleteWord(listName, wordId) {
    const lists = getWordLists();
    if (lists[listName]) {
        lists[listName] = lists[listName].filter(w => w.id !== wordId);
        saveWordLists(lists);
    }
}

function deleteList(listName) {
    const lists = getWordLists();
    delete lists[listName];
    saveWordLists(lists);
}

// === PHẦN SỬA LỖI QUAN TRỌNG ===
/**
 * Xuất toàn bộ dữ liệu từ vựng ra file 'j-master-backup.json'.
 * Hàm này sẽ tạo và tự động tải file về máy người dùng.
 */
function exportWordLists() {
    const lists = getWordLists();
    // Chuyển object thành chuỗi JSON định dạng đẹp
    const jsonString = JSON.stringify(lists, null, 2);
    // Tạo một đối tượng Blob (Binary Large Object)
    const blob = new Blob([jsonString], { type: 'application/json' });
    // Tạo một URL tạm thời cho Blob
    const url = URL.createObjectURL(blob);
    
    // Tạo một thẻ <a> ẩn để kích hoạt việc tải file
    const a = document.createElement('a');
    a.href = url;
    a.download = 'j-master-backup.json'; // Tên file khi tải về
    document.body.appendChild(a); // Thêm vào trang
    a.click(); // Giả lập hành động click để tải
    
    // Dọn dẹp
    document.body.removeChild(a); // Xóa thẻ <a>
    URL.revokeObjectURL(url); // Giải phóng URL tạm thời
}

async function importWordLists(jsonStr) {
    let importedLists;
    try {
        importedLists = JSON.parse(jsonStr);
        if (typeof importedLists !== 'object' || importedLists === null || Array.isArray(importedLists)) {
            throw new Error("Dữ liệu JSON phải là một object chứa các bộ từ (không phải là một mảng).");
        }
    } catch (e) {
        return { success: false, message: `Lỗi đọc file JSON: ${e.message}` };
    }

    const currentLists = getWordLists();
    const newLists = { ...currentLists };
    let conflicts = 0;
    let newWordsCount = 0;
    let nextId = Date.now();

    for (const listName in importedLists) {
        if (!Array.isArray(importedLists[listName])) continue;

        const wordsToImport = importedLists[listName].map(word => ({
            ...word,
            id: typeof word.id === 'number' ? word.id : nextId++
        }));

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
        } else { // Bộ từ mới
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
            // Phục hồi lại giao diện cho nút xóa
            buttonContainer.innerHTML = `
                <button class="btn-cancel px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">Hủy</button>
                <button id="confirm-delete-btn" class="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700">Xóa</button>
            `;
            resolve(choice);
        };

        document.getElementById('resolve-merge').onclick = () => cleanupAndResolve('merge');
        document.getElementById('resolve-overwrite').onclick = () => cleanupAndResolve('overwrite');
        document.getElementById('resolve-skip').onclick = () => cleanupAndResolve('skip');
        
        modal.classList.remove('hidden');
    });
}

function getStats() {
    const lists = getWordLists();
    const listCount = Object.keys(lists).length;
    const vocabCount = Object.values(lists).reduce((sum, list) => sum + list.length, 0);
    return { vocabCount, listCount };
}

let changeCallbacks = [];
function onWordListsChange(cb) {
    if (typeof cb === 'function' && !changeCallbacks.includes(cb)) {
        changeCallbacks.push(cb);
    }
}

function triggerChange() {
    const lists = getWordLists();
    changeCallbacks.forEach(cb => cb(lists));
}

// Gán các hàm vào window để có thể truy cập toàn cục
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