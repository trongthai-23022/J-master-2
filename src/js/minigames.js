// Gán các hàm chính vào window để app.js gọi được
window.startFlashcardGame = startFlashcardGame;
window.startQuizGame = startQuizGame;
window.startWritingGame = startWritingGame;
// Mini-games: Flashcard, Quiz, Writing
function startFlashcardGame(wordList) {
    const area = document.getElementById('minigame-area');
    if (!area) return;
    let idx = 0;
    area.innerHTML = '';
    const card = document.createElement('div');
    card.className = 'bg-white rounded shadow p-6 text-center';
    function render() {
        card.innerHTML = `<div class="text-2xl font-bold mb-2">${wordList[idx].kanji}</div><div class="text-lg mb-2">${wordList[idx].meaning}</div><button class="px-3 py-2 bg-blue-600 text-white rounded" id="next-flash">Tiếp</button>`;
        area.appendChild(card);
        document.getElementById('next-flash').onclick = () => {
            idx = (idx + 1) % wordList.length;
            render();
        };
    }
    render();
}
function startQuizGame(wordList) {
    const area = document.getElementById('minigame-area');
    if (!area) return;
    area.innerHTML = '';
    const qIdx = Math.floor(Math.random() * wordList.length);
    const w = wordList[qIdx];
    area.innerHTML = `<div class="mb-2">Kanji: <span class="font-bold">${w.kanji}</span></div><input id="quiz-answer" class="border rounded px-2 py-1" placeholder="Nhập nghĩa..."/><button class="px-3 py-2 bg-green-600 text-white rounded mt-2" id="quiz-submit">Kiểm tra</button><div id="quiz-result" class="mt-2"></div>`;
    document.getElementById('quiz-submit').onclick = () => {
        const val = document.getElementById('quiz-answer').value.trim();
        document.getElementById('quiz-result').textContent = val === w.meaning ? 'Đúng!' : 'Sai!';
    };
}
function startWritingGame(wordList) {
    const area = document.getElementById('minigame-area');
    if (!area) return;
    area.innerHTML = '';
    area.innerHTML = `<div class="mb-2">Hãy viết lại Kanji sau: <span class="font-bold">${wordList[0].kanji}</span></div><textarea class="border rounded w-full h-24 mb-2"></textarea><button class="px-3 py-2 bg-purple-600 text-white rounded">Lưu</button>`;
// Kết nối dashboard
document.addEventListener('DOMContentLoaded', () => {
    const lists = window.getWordLists ? window.getWordLists() : {};
    const firstList = Object.values(lists)[0] || [];
    const btnFlash = document.getElementById('btn-flashcard');
    const btnQuiz = document.getElementById('btn-quiz');
    const btnWriting = document.getElementById('btn-writing');
    if (btnFlash) btnFlash.onclick = () => startFlashcardGame(firstList);
    if (btnQuiz) btnQuiz.onclick = () => startQuizGame(firstList);
    if (btnWriting) btnWriting.onclick = () => startWritingGame(firstList);
});
}
// ...Thêm các hàm render UI, xử lý sự kiện
