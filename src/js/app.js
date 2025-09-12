// App.js: Tích hợp các module chính, khởi tạo app
import './logging.js';
import './error.js';
import './manager.js';
import './match-game.js';
import './cloze-story.js';
import './settings.js';
import './sync.js';
import './storage-warning.js';
import './lang.js';
import './theme.js';
import './minigames.js';
import './encrypt.js';

// --- CÁC HÀM TIỆN ÍCH CHO MODAL ---
const showModal = (modalId) => document.getElementById(modalId)?.classList.remove('hidden');
const hideModals = () => {
    document.querySelectorAll('.fixed.inset-0').forEach(modal => modal.classList.add('hidden'));
};

// --- HÀM CẬP NHẬT GIAO DIỆN ---
function updateStats() {
    if (!window.getStats) return;
    const stats = window.getStats();
    const vocabCountEl = document.getElementById('stat-vocab');
    const listCountEl = document.getElementById('stat-list');
    if (vocabCountEl) vocabCountEl.textContent = stats.vocabCount || 0;
    if (listCountEl) listCountEl.textContent = stats.listCount || 0;
}

function renderVocabLists() {
    const lists = window.getWordLists ? window.getWordLists() : {};
    const container = document.getElementById('vocab-lists-area');
    if (!container) return;
    container.innerHTML = '';
    if (Object.keys(lists).length === 0) {
        container.innerHTML = '<p class="text-gray-500">Chưa có bộ từ nào. Hãy tạo một bộ mới!</p>';
        return;
    }
    for (const listName in lists) {
        const listContainer = document.createElement('div');
        listContainer.className = 'bg-gray-50 p-4 rounded-lg mb-4 shadow-sm';
        const words = lists[listName];
        let wordsHTML = words.map(word => `
            <div class="word-item grid grid-cols-3 items-center gap-4 border-t py-2">
                <div><strong class="jp-font">${word.kanji}</strong><span class="text-xs text-gray-500">${word.reading}</span></div>
                <div class="text-sm text-gray-700 col-span-1">${word.meaning}</div>
                <div class="flex gap-2 justify-self-end">
                    <button class="edit-word-btn text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 py-1 px-2 rounded" data-list-name="${listName}" data-word-id="${word.id}">Sửa</button>
                    <button class="delete-word-btn text-xs bg-red-100 hover:bg-red-200 text-red-700 py-1 px-2 rounded" data-list-name="${listName}" data-word-id="${word.id}">Xóa</button>
                </div>
            </div>`).join('');
        listContainer.innerHTML = `
            <div class="flex justify-between items-center mb-2">
                <h3 class="text-lg font-bold text-gray-800">${listName} (${words.length} từ)</h3>
                <div class="flex gap-2">
                    <button class="add-word-btn text-xs bg-green-100 hover:bg-green-200 text-green-700 py-1 px-2 rounded" data-list-name="${listName}">Thêm từ</button>
                    <button class="delete-list-btn text-xs bg-red-100 hover:bg-red-200 text-red-700 py-1 px-2 rounded" data-list-name="${listName}">Xóa bộ</button>
                </div>
            </div>
            <div class="space-y-1">${wordsHTML || '<p class="text-xs text-center p-2 text-gray-400">Bộ từ này trống.</p>'}</div>`;
        container.appendChild(listContainer);
    }
}

// --- HÀM XỬ LÝ LƯU TỪ VỰNG ---
function handleSaveWord() {
    const id = document.getElementById('word-id-input').value;
    const listName = document.getElementById('word-list-name-input').value;
    const word = {
        id: id ? parseInt(id) : Date.now(),
        kanji: document.getElementById('kanji-input').value.trim(),
        reading: document.getElementById('reading-input').value.trim(),
        meaning: document.getElementById('meaning-input').value.trim(),
    };
    if (!word.kanji || !word.meaning) {
        alert("Vui lòng nhập Từ vựng và Ý nghĩa.");
        return;
    }
    if (id) { window.editWord(listName, parseInt(id), word); }
    else { window.addWord(listName, word); }
    hideModals();
    renderVocabLists();
    updateStats();
    window.logEvent && window.logEvent('save_word', { list: listName, word: word.kanji });
}

// --- CÁC HÀM XỬ LÝ CÀI ĐẶT ---
function openSettingsModal() {
    const currentLang = window.getLang();
    const currentTheme = window.getTheme();
    const currentApiKey = window.getApiKey();
    const currentWarning = window.getStorageWarning();

    document.getElementById('settings-lang').value = currentLang;
    document.getElementById('settings-theme').value = currentTheme;
    document.getElementById('api-key-input').value = currentApiKey;
    document.getElementById('settings-storage-warning').checked = currentWarning;

    showModal('modal-settings');
}

function handleSaveSettings() {
    const newLang = document.getElementById('settings-lang').value;
    const newTheme = document.getElementById('settings-theme').value;
    const newApiKey = document.getElementById('api-key-input').value;
    const newWarning = document.getElementById('settings-storage-warning').checked;

    window.saveLang(newLang);
    window.saveTheme(newTheme);
    window.saveApiKey(newApiKey);
    window.saveStorageWarning(newWarning);

    hideModals();
    alert('Đã lưu cài đặt!');
    window.logEvent && window.logEvent('save_settings');
}


// --- KHỞI TẠO APP VÀ GẮN SỰ KIỆN ---
function initApp() {
    if (window.checkStorageWarning) window.checkStorageWarning();
    if (window.setLangUI) window.setLangUI(window.getLang ? window.getLang() : 'vi');
    if (window.setTheme) window.setTheme(window.getTheme ? window.getTheme() : 'light');

    renderVocabLists();
    updateStats();

    // --- GẮN CÁC SỰ KIỆN CHÍNH ---
    
    // Nút "Thêm Danh Sách"
    document.getElementById('btn-add-list')?.addEventListener('click', () => {
        const name = prompt('Tên danh sách mới:');
        if (name && name.trim()) {
            window.saveWordLists({ ...window.getWordLists(), [name.trim()]: [] });
            renderVocabLists();
            updateStats();
            window.logEvent && window.logEvent('add_list', { list: name });
        }
    });
    
    // Xử lý Import/Export
    const importFileInput = document.getElementById('import-file-input');
    document.getElementById('btn-import').addEventListener('click', () => importFileInput.click());
    document.getElementById('btn-export').addEventListener('click', () => window.exportWordList());
    importFileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            const jsonContent = e.target.result;
            const success = window.importWordLists(jsonContent);
            if (success) {
                alert('Nhập dữ liệu thành công!');
                renderVocabLists();
                updateStats();
            } else {
                alert('Lỗi: Dữ liệu trong tệp không hợp lệ.');
            }
            importFileInput.value = '';
        };
        reader.readAsText(file);
    });
    
    // Nút "Lưu" trong modal thêm/sửa từ
    document.getElementById('save-word-btn').addEventListener('click', handleSaveWord);

    // Event Delegation cho các nút trong danh sách
    document.getElementById('vocab-lists-area').addEventListener('click', e => {
        const target = e.target;
        const listName = target.dataset.listName;

        if (target.classList.contains('add-word-btn')) {
            document.getElementById('word-modal-title').textContent = `Thêm từ vào bộ "${listName}"`;
            document.getElementById('word-id-input').value = '';
            document.getElementById('word-list-name-input').value = listName;
            document.getElementById('kanji-input').value = '';
            document.getElementById('reading-input').value = '';
            document.getElementById('meaning-input').value = '';
            showModal('add-edit-word-modal');
        }

        if (target.classList.contains('edit-word-btn')) {
            const wordId = parseInt(target.dataset.wordId);
            const word = window.getWordLists()[listName].find(w => w.id === wordId);
            if (word) {
                document.getElementById('word-modal-title').textContent = 'Sửa từ';
                document.getElementById('word-id-input').value = word.id;
                document.getElementById('word-list-name-input').value = listName;
                document.getElementById('kanji-input').value = word.kanji;
                document.getElementById('reading-input').value = word.reading;
                document.getElementById('meaning-input').value = word.meaning;
                showModal('add-edit-word-modal');
            }
        }
        
        if (target.classList.contains('delete-word-btn')) {
            const wordId = parseInt(target.dataset.wordId);
            document.getElementById('confirm-delete-title').textContent = 'Xác nhận xóa từ';
            document.getElementById('confirm-delete-message').textContent = 'Bạn có chắc chắn muốn xóa từ này không?';
            showModal('confirm-delete-modal');
            
            document.getElementById('confirm-delete-btn').onclick = () => {
                window.deleteWord(listName, wordId);
                hideModals();
                renderVocabLists();
                updateStats();
            };
        }

        if (target.classList.contains('delete-list-btn')) {
            document.getElementById('confirm-delete-title').textContent = 'Xác nhận xóa bộ từ';
            document.getElementById('confirm-delete-message').textContent = `Bạn có chắc chắn muốn xóa TOÀN BỘ bộ từ "${listName}" không?`;
            showModal('confirm-delete-modal');

            document.getElementById('confirm-delete-btn').onclick = () => {
                window.deleteList(listName);
                hideModals();
                renderVocabLists();
                updateStats();
            };
        }
    });

    // Các nút Hủy (cancel) trên các modal
    document.querySelectorAll('.btn-cancel, #btn-settings-cancel').forEach(btn => {
        btn.addEventListener('click', hideModals);
    });
    
    // Sự kiện cho các nút trong Header
    document.getElementById('btn-settings').addEventListener('click', openSettingsModal);
    
    // Sự kiện cho nút Lưu trong Modal Cài đặt
    document.getElementById('btn-settings-save').addEventListener('click', handleSaveSettings);
}

// Xử lý lỗi toàn cục
window.onerror = function(msg, url, line, col, error) {
    if (window.showError) window.showError(`Lỗi: ${msg} (${url}:${line})`);
    window.logEvent && window.logEvent('error', {msg, url, line, col, error});
    return true;
};

// Khởi chạy ứng dụng khi trang đã tải xong
window.onload = initApp;