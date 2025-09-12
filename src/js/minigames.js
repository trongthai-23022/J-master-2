// Gán các hàm chính vào window để game.js gọi được
window.startFlashcardGame = startFlashcardGame;
window.startQuizGame = startQuizGame;
window.startWritingGame = startWritingGame;

// Mini-games: Flashcard, Quiz, Writing
function startFlashcardGame(wordList, container) {
    if (!container) return;
    let idx = 0;
    container.innerHTML = ''; // Xóa nội dung cũ
    const card = document.createElement('div');
    card.className = 'bg-white rounded-lg shadow-inner p-8 text-center flex flex-col items-center justify-center h-full';
    
    function render() {
        if (wordList.length === 0) {
            card.innerHTML = `<p>Bộ từ này trống, không thể chơi game.</p>`;
            container.appendChild(card);
            return;
        }
        const word = wordList[idx];
        card.innerHTML = `
            <div class="jp-font text-5xl font-bold mb-4">${word.kanji}</div>
            <div class="text-2xl text-gray-600 mb-6">${word.meaning}</div>
            <button class="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700" id="next-flash">Tiếp</button>
        `;
        container.appendChild(card);
        document.getElementById('next-flash').onclick = () => {
            idx = (idx + 1) % wordList.length;
            render();
        };
    }
    render();
}

function startQuizGame(wordList, container) {
    // Tương tự, có thể cập nhật sau
    container.innerHTML = `<p class="text-center">Game Quiz sẽ được xây dựng ở đây.</p>`;
}

function startWritingGame(wordList, container) {
    // Tương tự, có thể cập nhật sau
    container.innerHTML = `<p class="text-center">Game Luyện viết sẽ được xây dựng ở đây.</p>`;
}

// ...Thêm các game khác như match-game, cloze-story nếu cần