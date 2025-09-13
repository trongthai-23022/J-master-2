// Cloze Story AI: Tạo truyện chêm bằng Gemini API
async function createClozeStory(apiKey, vocabList) {
    const story = await generateClozeStory(apiKey, vocabList);
    if (story) renderClozeStory(story, vocabList);
    return story;
}

// Render UI cho cloze story
function renderClozeStory(story, vocabList) {
    const area = document.getElementById('cloze-story-area');
    if (!area) return;
    area.innerHTML = '';
    // Tìm các chỗ trống dạng ___
    const blanks = story.match(/___/g) || [];
    let html = story.replace(/___/g, (m, i) => `<span class="cloze-blank" data-blank="${i}">___</span>`);
    area.innerHTML = `<div class="mb-4">${html}</div>`;
    // Render từ vựng để kéo thả
    const wordBar = document.createElement('div');
    wordBar.className = 'flex gap-2 flex-wrap mb-2';
    vocabList.forEach(w => {
        const btn = document.createElement('button');
        btn.className = 'bg-blue-100 rounded px-2 py-1 text-sm cursor-move';
        btn.textContent = w.kanji;
        btn.draggable = true;
        btn.ondragstart = e => {
            e.dataTransfer.setData('text/plain', w.kanji);
        };
        wordBar.appendChild(btn);
    });
    area.appendChild(wordBar);
    // Xử lý kéo thả vào chỗ trống
    area.querySelectorAll('.cloze-blank').forEach(blank => {
        blank.ondragover = e => e.preventDefault();
        blank.ondrop = e => {
            e.preventDefault();
            const word = e.dataTransfer.getData('text/plain');
            blank.textContent = word;
            blank.classList.add('bg-green-100');
        };
    });
}

// Khởi động từ UI
function launchClozeStoryAI() {
    // Lấy API key và danh sách từ vựng
    const apiKey = (typeof window.getApiKey === 'function' ? window.getApiKey() : (window.geminiApiKey || ''));
    const lists = window.getWordLists ? window.getWordLists() : {};
    const firstList = Object.values(lists)[0] || [];
    createClozeStory(apiKey, firstList);
}

// Gắn vào nút UI
document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('btn-gen-cloze');
    if (btn) btn.onclick = launchClozeStoryAI;
});

// Expose for potential external use
window.createClozeStory = createClozeStory;
window.renderClozeStory = renderClozeStory;

