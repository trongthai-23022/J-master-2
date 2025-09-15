// Thay thế toàn bộ nội dung file: src/js/app.js

import './notifications.js';
import './gemini.js';
import './logging.js';
import './error.js';
import './manager.js';
import './match-game.js';
import './cloze-story.js';
import './settings.js';
import './storage-warning.js';
import './lang.js';
import './theme.js';
import './encrypt.js';
import { analyzeWordWithAI } from './ai-sensei.js';

// --- CÁC HÀM TIỆN ÍCH CHO MODAL (GLOBAL) ---
window.showModal = (modalId) => document.getElementById(modalId)?.classList.remove('hidden');
window.hideModals = () => {
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
        const words = lists[listName] || [];

        const headerRow = `
            <div class="hidden md:grid grid-cols-4 gap-4 text-xs font-semibold text-gray-500 border-b pb-2 mb-2">
                <div>Kanji</div>
                <div>Cách đọc</div>
                <div>Ý nghĩa</div>
                <div class="text-right">Thao tác</div>
            </div>`;

        const wordsHTML = words.map(word => `
            <div class="word-item grid grid-cols-3 md:grid-cols-4 items-center gap-4 border-b md:border-t-0 py-2">
                <div class="font-semibold col-span-2 md:col-span-1">
                    <strong class="jp-font">${word.kanji || ''}</strong>
                    <div class="block md:hidden text-xs text-gray-700 mt-1">${word.reading || ''}</div>
                </div>
                <div class="hidden md:block text-sm text-gray-700">${word.reading || ''}</div>
                <div class="text-sm text-gray-700 col-span-1">${word.meaning || ''}</div>
                <div class="flex gap-2 justify-self-end col-span-3 md:col-span-1 mt-2 md:mt-0">
                    <button class="ai-sensei-btn text-xs bg-purple-100 hover:bg-purple-200 text-purple-700 py-1 px-2 rounded" data-word='${JSON.stringify(word)}' title="AI-Sensei Phân Tích">🤖</button>
                    <button class="edit-word-btn text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 py-1 px-2 rounded" data-list-name="${listName}" data-word-id="${word.id}">Sửa</button>
                    <button class="delete-word-btn text-xs bg-red-100 hover:bg-red-200 text-red-700 py-1 px-2 rounded" data-list-name="${listName}" data-word-id="${word.id}">Xóa</button>
                </div>
            </div>`).join('');

        listContainer.innerHTML = `
            <div class="flex justify-between items-center mb-2 flex-wrap gap-2">
                <h3 class="text-lg font-bold text-gray-800">${listName} (${words.length} từ)</h3>
                <div class="flex gap-2 flex-wrap">
                    <button class="cloze-story-btn text-xs bg-purple-100 hover:bg-purple-200 text-purple-700 py-1 px-2 rounded" data-list-name="${listName}">Tạo truyện</button>
                    <button class="add-word-btn text-xs bg-green-100 hover:bg-green-200 text-green-700 py-1 px-2 rounded" data-list-name="${listName}">Thêm từ</button>
                    <button class="delete-list-btn text-xs bg-red-100 hover:bg-red-200 text-red-700 py-1 px-2 rounded" data-list-name="${listName}">Xóa bộ</button>
                </div>
            </div>
            ${headerRow}
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
        window.showToast("Vui lòng nhập Từ vựng và Ý nghĩa.", 'error');
        return;
    }
    if (id) { window.editWord(listName, parseInt(id), word); }
    else { window.addWord(listName, word); }
    hideModals();
    renderVocabLists();
    updateStats();
    window.showToast(id ? 'Đã cập nhật từ!' : 'Đã thêm từ mới!', 'success');
    window.logEvent && window.logEvent('save_word', { list: listName, word: word.kanji });
}

// --- CÁC HÀM XỬ LÝ CÀI ĐẶT ---
function openSettingsModal() {
    const currentLang = window.getLang();
    const currentTheme = window.getTheme();
    const currentApiKey = window.getApiKey();
    const currentWarning = window.getStorageWarning();
    const currentSpeechLang = window.getSpeechLang();

    document.getElementById('settings-lang').value = currentLang;
    document.getElementById('settings-theme').value = currentTheme;
    document.getElementById('api-key-input').value = currentApiKey;
    document.getElementById('settings-storage-warning').checked = currentWarning;
    document.getElementById('settings-speech-lang').value = currentSpeechLang;

    showModal('modal-settings');
}

function handleSaveSettings() {
    const newLang = document.getElementById('settings-lang').value;
    const newTheme = document.getElementById('settings-theme').value;
    const newApiKey = document.getElementById('api-key-input').value;
    const newWarning = document.getElementById('settings-storage-warning').checked;
    const newSpeechLang = document.getElementById('settings-speech-lang').value;

    window.saveLang(newLang);
    window.saveTheme(newTheme);
    window.saveApiKey(newApiKey);
    window.saveStorageWarning(newWarning);
    window.saveSpeechLang(newSpeechLang);

    hideModals();
    window.showToast('Đã lưu cài đặt!', 'success');
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
        const input = document.getElementById('new-list-name-input');
        const errorEl = document.getElementById('add-list-error');
        if (input) input.value = '';
        if (errorEl) errorEl.textContent = '';
        showModal('add-list-modal');
        input?.focus();
    });

    document.getElementById('save-new-list-btn')?.addEventListener('click', () => {
        const input = document.getElementById('new-list-name-input');
        const errorEl = document.getElementById('add-list-error');
        const name = input.value.trim();
        if (!name) {
            if (errorEl) errorEl.textContent = 'Tên bộ từ không được để trống.';
            return;
        }
        const currentLists = window.getWordLists() || {};
        if (currentLists[name]) {
            if (errorEl) errorEl.textContent = 'Tên này đã tồn tại. Vui lòng chọn tên khác.';
            return;
        }
        window.saveWordLists({ ...currentLists, [name]: [] });
        hideModals();
        renderVocabLists();
        updateStats();
        window.showToast('Đã tạo bộ từ mới!', 'success');
        window.logEvent && window.logEvent('add_list', { list: name });
    });
    
    // --- Xử lý Import/Export (LOGIC MỚI) ---
    const importFileInput = document.getElementById('import-file-input');
    const importModal = document.getElementById('modal-import');

    // Mở modal khi nhấn nút "Import"
    document.getElementById('btn-import').addEventListener('click', () => {
        if (importModal) {
            importModal.querySelector('#import-json-textarea').value = '';
            showModal('modal-import');
        }
    });

    // Xử lý khi nhấn nút "Bắt đầu nhập" trong modal
    document.getElementById('confirm-import-btn')?.addEventListener('click', async () => {
        const textarea = document.getElementById('import-json-textarea');
        const jsonContent = textarea.value;

        if (!jsonContent.trim()) {
            window.showToast('Vui lòng dán nội dung JSON vào ô.', 'error');
            return;
        }

        const result = await window.importWordLists(jsonContent);
        window.showToast(result.message, result.success ? 'success' : 'error');
        
        if (result.success) {
            hideModals();
            renderVocabLists();
            updateStats();
        }
    });

    // Xử lý sao chép mẫu JSON
    document.getElementById('copy-json-sample-btn')?.addEventListener('click', () => {
        const codeEl = document.getElementById('json-sample-code');
        if (navigator.clipboard && codeEl) {
            navigator.clipboard.writeText(codeEl.innerText.trim())
                .then(() => {
                    window.showToast('Đã sao chép JSON mẫu!', 'success');
                })
                .catch(() => {
                    window.showToast('Không thể sao chép.', 'error');
                });
        }
    });

    // Nút "Export" không đổi
    document.getElementById('btn-export').addEventListener('click', () => {
        window.exportWordLists();
        window.showToast('Đã bắt đầu tải xuống file backup.', 'info');
    });

    // Sự kiện chọn file vẫn giữ lại để có thể dùng trong tương lai
    importFileInput.addEventListener('change', async (event) => { 
        // ... code không đổi ...
    });
    
    // Nút "Lưu" trong modal thêm/sửa từ
    document.getElementById('save-word-btn').addEventListener('click', handleSaveWord);

    // Xử lý modal xác nhận xóa
    const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', () => {
            const action = confirmDeleteBtn.dataset.action;
            const listName = confirmDeleteBtn.dataset.listName;
            const wordId = confirmDeleteBtn.dataset.wordId;

            if (action === 'delete-list') {
                window.deleteList(listName);
                window.showToast(`Đã xóa bộ từ "${listName}"!`, 'success');
            } else if (action === 'delete-word') {
                window.deleteWord(listName, parseInt(wordId));
                window.showToast('Đã xóa từ thành công!', 'success');
            }

            hideModals();
            renderVocabLists();
            updateStats();
            delete confirmDeleteBtn.dataset.action;
            delete confirmDeleteBtn.dataset.listName;
            delete confirmDeleteBtn.dataset.wordId;
        });
    }

    // Event Delegation cho các nút trong danh sách
    document.getElementById('vocab-lists-area').addEventListener('click', e => {
        const addBtn = e.target.closest('.add-word-btn');
        const editBtn = e.target.closest('.edit-word-btn');
        const deleteWordBtn = e.target.closest('.delete-word-btn');
        const deleteListBtn = e.target.closest('.delete-list-btn');
        const clozeStoryBtn = e.target.closest('.cloze-story-btn');
        const aiSenseiBtn = e.target.closest('.ai-sensei-btn');

        if (addBtn) {
            const listName = addBtn.dataset.listName;
            document.getElementById('word-modal-title').textContent = `Thêm từ vào bộ "${listName}"`;
            document.getElementById('word-id-input').value = '';
            document.getElementById('word-list-name-input').value = listName;
            document.getElementById('kanji-input').value = '';
            document.getElementById('reading-input').value = '';
            document.getElementById('meaning-input').value = '';
            showModal('add-edit-word-modal');
        } else if (editBtn) {
            const listName = editBtn.dataset.listName;
            const wordId = parseInt(editBtn.dataset.wordId);
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
        } else if (deleteWordBtn) {
            const listName = deleteWordBtn.dataset.listName;
            const wordId = deleteWordBtn.dataset.wordId;
            const confirmBtn = document.getElementById('confirm-delete-btn');
            if (confirmBtn) {
                confirmBtn.dataset.action = 'delete-word';
                confirmBtn.dataset.listName = listName;
                confirmBtn.dataset.wordId = wordId;
            }
            document.getElementById('confirm-delete-title').textContent = 'Xác nhận xóa từ';
            document.getElementById('confirm-delete-message').textContent = 'Bạn có chắc chắn muốn xóa từ này không?';
            showModal('confirm-delete-modal');
        } else if (deleteListBtn) {
            const listName = deleteListBtn.dataset.listName;
            const confirmBtn = document.getElementById('confirm-delete-btn');
            if (confirmBtn) {
                confirmBtn.dataset.action = 'delete-list';
                confirmBtn.dataset.listName = listName;
            }
            document.getElementById('confirm-delete-title').textContent = 'Xác nhận xóa bộ từ';
            document.getElementById('confirm-delete-message').textContent = `Bạn có chắc chắn muốn xóa TOÀN BỘ bộ từ "${listName}" không?`;
            showModal('confirm-delete-modal');
        } else if (clozeStoryBtn) {
            const listName = clozeStoryBtn.dataset.listName;
            const lists = window.getWordLists();
            const wordList = lists[listName];

            if (!window.getApiKey()) {
                window.showToast('Vui lòng nhập khóa API Gemini trong Cài đặt.', 'error');
                return;
            }
            if (!wordList || wordList.length < 3) {
                window.showToast('Cần ít nhất 3 từ vựng trong bộ này để tạo truyện.', 'error');
                return;
            }
            const shuffled = window.shuffle ? window.shuffle([...wordList]) : [...wordList];
            const wordsForStory = shuffled.slice(0, Math.min(5, wordList.length));
            window.createClozeStory(wordsForStory);
        } else if (aiSenseiBtn) {
            try {
                const wordData = JSON.parse(aiSenseiBtn.dataset.word);
                analyzeWordWithAI(wordData);
            } catch (error) {
                console.error("Lỗi đọc dữ liệu từ vựng:", error);
                window.showToast('Không thể đọc dữ liệu của từ này.', 'error');
            }
        }
    });

    // Các nút Hủy (cancel) trên các modal
    document.querySelectorAll('.btn-cancel').forEach(btn => {
        btn.addEventListener('click', hideModals);
    });
    
    // Sự kiện cho các nút trong Header
    document.getElementById('btn-settings').addEventListener('click', openSettingsModal);
    
    // Sự kiện cho nút Lưu trong Modal Cài đặt
    document.getElementById('btn-settings-save').addEventListener('click', handleSaveSettings);

    // GẮN SỰ KIỆN CHO CÁC NÚT MINI-GAME
    function launchGame(gameType) {
        const lists = window.getWordLists ? window.getWordLists() : {};
        const select = document.getElementById('game-list-select');
        const selectedName = select ? select.value : (Object.keys(lists)[0] || '');
        if (!selectedName || !lists[selectedName] || lists[selectedName].length === 0) {
            window.showToast('Vui lòng chọn một bộ từ có dữ liệu để chơi.', 'error');
            return;
        }
        const wordList = lists[selectedName];
        sessionStorage.setItem('jMasterGameType', gameType);
        sessionStorage.setItem('jMasterWordList', JSON.stringify(wordList));
        window.location.href = 'src/game.html';
    }

    document.getElementById('btn-flashcard')?.addEventListener('click', () => launchGame('flashcard'));
    document.getElementById('btn-quiz')?.addEventListener('click', () => launchGame('quiz'));
    document.getElementById('btn-writing')?.addEventListener('click', () => launchGame('writing'));
    document.getElementById('btn-match')?.addEventListener('click', () => launchGame('match-game'));
}

// Xử lý lỗi toàn cục
window.onerror = function(msg, url, line, col, error) {
    if (window.showError) showError(`Lỗi: ${msg} (${url}:${line})`);
    if (window.logEvent) window.logEvent('error', {msg, url, line, col, error});
    return true;
};

// Khởi chạy ứng dụng khi trang đã tải xong
document.addEventListener('DOMContentLoaded', initApp);