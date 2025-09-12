// src/js/game.js

// Hàm này sẽ được thực thi ngay khi trang game.html được tải
document.addEventListener('DOMContentLoaded', () => {
    // 1. Lấy dữ liệu từ sessionStorage
    const gameType = sessionStorage.getItem('jMasterGameType');
    const wordListJSON = sessionStorage.getItem('jMasterWordList');
    
    const gameTitleEl = document.getElementById('game-title');
    const gameContainerEl = document.getElementById('game-container');

    // 2. Kiểm tra xem có dữ liệu hợp lệ không
    if (!gameType || !wordListJSON) {
        gameTitleEl.textContent = 'Lỗi';
        gameContainerEl.innerHTML = `
            <p class="text-red-600">Không tìm thấy dữ liệu game.</p>
            <p>Vui lòng quay lại trang chính và chọn một bộ từ để bắt đầu.</p>
        `;
        return;
    }

    const wordList = JSON.parse(wordListJSON);

    // 3. Dựa vào gameType, gọi hàm game tương ứng
    switch (gameType) {
        case 'flashcard':
            gameTitleEl.textContent = 'Game: Flashcard';
            // Gọi hàm từ minigames.js
            window.startFlashcardGame(wordList, gameContainerEl);
            break;
        case 'quiz':
            gameTitleEl.textContent = 'Game: Quiz';
            // Gọi hàm từ minigames.js
            window.startQuizGame(wordList, gameContainerEl);
            break;
        case 'writing':
            gameTitleEl.textContent = 'Game: Luyện viết';
             // Gọi hàm từ minigames.js
            window.startWritingGame(wordList, gameContainerEl);
            break;
        case 'match-game':
            gameTitleEl.textContent = 'Game: Ghép thẻ';
            // Gọi hàm từ match-game.js
            window.launchMatchGame(wordList, gameContainerEl);
            break;
        // Thêm các game khác ở đây
        // case 'cloze-story': ...

        default:
            gameTitleEl.textContent = 'Lỗi';
            gameContainerEl.innerHTML = `<p class="text-red-600">Loại game không được hỗ trợ: ${gameType}</p>`;
    }
});