
/**
 * Bắt đầu quá trình tạo truyện chêm.
 * @param {Array} vocabList - Danh sách từ vựng cho câu chuyện.
 */
async function createClozeStory(vocabList) {
    const modalContent = document.getElementById('cloze-story-content');
    if (!modalContent) return;

    // Hiển thị trạng thái đang tải
    modalContent.innerHTML = `
        <div class="text-center p-10">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p class="mt-4 text-gray-600">AI đang sáng tác, vui lòng chờ...</p>
        </div>`;
    showModal('cloze-story-modal');

    // Gọi API để lấy nội dung truyện
    const storyData = await window.generateClozeStory(window.getApiKey(), vocabList);
    
    if (storyData) {
        renderClozeStory(storyData, vocabList, modalContent);
    } else {
        // Xử lý lỗi
        modalContent.innerHTML = `
            <div class="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center">
                <strong>Lỗi!</strong>
                <p>Không thể tạo truyện. Vui lòng kiểm tra lại khóa API và kết nối mạng.</p>
            </div>`;
    }
}

/**
 * Render giao diện truyện chêm vào trong modal.
 * @param {string} storyText - Toàn bộ văn bản trả về từ API.
 * @param {Array} vocabList - Danh sách từ vựng.
 * @param {HTMLElement} container - Vùng chứa để render giao diện.
 */
function renderClozeStory(storyText, vocabList, container) {
    // Tách các phần của truyện từ văn bản API trả về
    const clozeText = storyText.split('[STORY_CLOZE]')[1]?.split('[STORY_FULL]')[0]?.trim();
    const fullText = storyText.split('[STORY_FULL]')[1]?.split('[STORY_TRANSLATION]')[0]?.trim();
    const translationText = storyText.split('[STORY_TRANSLATION]')[1]?.trim();

    if (!clozeText || !fullText || !translationText) {
        container.innerHTML = `<div class="p-4 bg-yellow-100 text-yellow-800 rounded">Lỗi: Dữ liệu AI trả về không đúng định dạng.</div>`;
        return;
    }
    
    // Render HTML
    container.innerHTML = `
        <p class="mb-4 text-center text-gray-500">Kéo và thả các từ vào ô trống thích hợp.</p>
        <div id="word-bank" class="flex flex-wrap justify-center gap-3 p-4 mb-6 bg-gray-100 rounded-lg">
            </div>
        <div id="cloze-passage" class="jp-font text-xl leading-loose mb-6 p-4 border rounded-lg bg-gray-50">
            ${clozeText.replace(/\[____\]/g, '<span class="cloze-blank bg-blue-100 border-blue-300 border-dashed border-2 rounded inline-block w-28 h-8 mx-1 align-bottom"></span>')}
        </div>
        <div class="text-center">
            <button id="check-story-btn" class="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700">Kiểm tra đáp án</button>
        </div>
        <div id="story-answer-section" class="hidden mt-6 pt-4 border-t">
            <h4 class="text-lg font-bold mb-2 text-green-700">Truyện Hoàn Chỉnh</h4>
            <p class="jp-font bg-green-50 p-3 rounded mb-4">${fullText}</p>
            <h4 class="text-lg font-bold mb-2 text-blue-700">Bản Dịch Tiếng Việt</h4>
            <p class="bg-blue-50 p-3 rounded">${translationText}</p>
        </div>
    `;

    // Điền từ vào ngân hàng từ (word bank)
    const wordBank = container.querySelector('#word-bank');
    if(window.shuffle) window.shuffle(vocabList);
    vocabList.forEach(word => {
        const wordEl = document.createElement('div');
        wordEl.className = 'word-bank-item jp-font px-3 py-1 bg-white border rounded-full shadow-sm cursor-grab active:cursor-grabbing';
        wordEl.textContent = word.kanji;
        wordEl.draggable = true;
        wordBank.appendChild(wordEl);
    });

    // Thêm các trình xử lý sự kiện
    container.querySelector('#check-story-btn').addEventListener('click', () => {
        container.querySelector('#story-answer-section').classList.remove('hidden');
    });
    addDragDropListeners(container);
}

// Hàm xử lý kéo thả
function addDragDropListeners(container) {
    let draggedItem = null;
    container.querySelectorAll('.word-bank-item').forEach(item => {
        item.addEventListener('dragstart', e => {
            draggedItem = e.target;
            setTimeout(() => e.target.classList.add('opacity-50'), 0);
        });
        item.addEventListener('dragend', e => {
            e.target.classList.remove('opacity-50');
        });
    });

    container.querySelectorAll('.cloze-blank').forEach(blank => {
        blank.addEventListener('dragover', e => {
            e.preventDefault();
            blank.classList.add('bg-blue-200');
        });
        blank.addEventListener('dragleave', () => {
            blank.classList.remove('bg-blue-200');
        });
        blank.addEventListener('drop', e => {
            e.preventDefault();
            blank.classList.remove('bg-blue-200');
            if (draggedItem && !blank.textContent) {
                blank.textContent = draggedItem.textContent;
                blank.classList.add('text-center', 'jp-font', 'text-blue-800');
                draggedItem.remove(); // Xóa từ khỏi ngân hàng
                draggedItem = null;
            }
        });
    });
}

// Gán hàm chính vào window
window.createClozeStory = createClozeStory;

