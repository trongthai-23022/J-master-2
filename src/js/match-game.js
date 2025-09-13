// Thay thế toàn bộ nội dung file: src/js/match-game.js

// --- CÁC HÀM TIỆN ÍCH (Giả lập nếu chưa có) ---
if (!window.shuffle) {
  window.shuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };
}
if (!window.speakJapanese) {
  window.speakJapanese = (text) => {
    console.log(`Phát âm: ${text}`);
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ja-JP';
      speechSynthesis.speak(utterance);
    }
  };
}


/**
 * Hàm chính để khởi tạo Match Game, bao gồm cả màn hình cài đặt.
 * @param {Array} wordList - Danh sách từ vựng.
 * @param {HTMLElement} container - Element DOM để render game vào.
 */
function launchMatchGame(wordList, container) {
  if (!container) {
    console.error("Match Game container not found!");
    return;
  }

  // Cần ít nhất 2 từ để tạo 2 cặp thẻ chơi
  if (!Array.isArray(wordList) || wordList.length < 2) {
    container.innerHTML = `<div class="p-8 text-center text-gray-600">Cần ít nhất 2 từ vựng để chơi Ghép thẻ.</div>`;
    return;
  }

  // Bắt đầu bằng việc hiển thị màn hình cài đặt
  renderSettingsScreen(wordList, container);
}

/**
 * Render màn hình cài đặt cho Match Game.
 * @param {Array} wordList - Danh sách từ vựng để tính toán số cặp thẻ.
 * @param {HTMLElement} container - Element DOM để render.
 */
function renderSettingsScreen(wordList, container) {
  container.innerHTML = `
    <div class="p-4 md:p-8 max-w-3xl mx-auto">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-3xl font-bold">Tùy Chỉnh Game Ghép Thẻ</h2>
        <a href="../index.html" class="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 text-sm font-semibold">Quay lại</a>
      </div>
      
      <div class="grid md:grid-cols-2 gap-6 mb-6">
        <div class="bg-gray-50 p-4 rounded-lg">
          <h3 class="font-bold mb-4 text-gray-700">1. Chọn loại thẻ gốc:</h3>
          <div id="cardA-options" class="space-y-2">
            <div>
              <input type="radio" id="a-kanji" name="cardA" value="kanji" class="setting-radio" checked>
              <label for="a-kanji" class="setting-radio-label jp-font">Kanji (例: 反抗)</label>
            </div>
            <div>
              <input type="radio" id="a-reading" name="cardA" value="reading" class="setting-radio">
              <label for="a-reading" class="setting-radio-label jp-font">Cách đọc (例: はんこう)</label>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 p-4 rounded-lg">
          <h3 class="font-bold mb-4 text-gray-700">2. Chọn loại thẻ để ghép:</h3>
          <div id="cardB-options" class="space-y-2">
            <div>
              <input type="radio" id="b-meaning" name="cardB" value="meaning" class="setting-radio" checked>
              <label for="b-meaning" class="setting-radio-label">Ý nghĩa (Vd: Phản kháng)</label>
            </div>
            <div>
              <input type="radio" id="b-audio" name="cardB" value="audio" class="setting-radio">
              <label for="b-audio" class="setting-radio-label">Âm thanh 🔊</label>
            </div>
            <div>
              <input type="radio" id="b-reading" name="cardB" value="reading" class="setting-radio">
              <label for="b-reading" class="setting-radio-label jp-font">Cách đọc (例: はんこう)</label>
            </div>
          </div>
        </div>
      </div>
      
      <div class="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 class="font-bold mb-4 text-gray-700">3. Chọn số lượng cặp thẻ:</h3>
        <select id="pair-count" class="input-select"></select>
      </div>

      <div class="text-center">
        <button id="start-game-btn" class="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-transform transform hover:scale-105">Bắt đầu chơi</button>
      </div>
    </div>
  `;

  // --- Logic cho màn hình cài đặt ---
  const pairCountSelect = container.querySelector('#pair-count');
  const maxPairs = wordList.length;
  // Các tùy chọn số cặp thẻ, đảm bảo không vượt quá số từ có sẵn
  [4, 6, 8, 10, 12].forEach(opt => {
    if (opt <= maxPairs) {
      pairCountSelect.innerHTML += `<option value="${opt}">${opt} cặp (${opt * 2} thẻ)</option>`;
    }
  });
  // Luôn thêm tùy chọn "Tất cả"
  if (maxPairs > 0) {
    pairCountSelect.innerHTML += `<option value="${maxPairs}">Tất cả ${maxPairs} cặp (${maxPairs * 2} thẻ)</option>`;
    pairCountSelect.value = Math.min(maxPairs, 8); // Mặc định là 8 cặp hoặc tối đa
  }

  // Gắn sự kiện cho nút "Bắt đầu chơi"
  container.querySelector('#start-game-btn').addEventListener('click', () => {
    const settings = {
      cardA: container.querySelector('input[name="cardA"]:checked').value,
      cardB: container.querySelector('input[name="cardB"]:checked').value,
      pairCount: parseInt(pairCountSelect.value),
    };
    // Gọi hàm bắt đầu game với các cài đặt đã chọn
    startGamePlay(wordList, container, settings);
  });
}

/**
 * Bắt đầu màn chơi game với các cài đặt đã được chọn.
 * @param {Array} wordList - Danh sách từ vựng.
 * @param {HTMLElement} container - Element DOM để render.
 * @param {object} settings - Các tùy chọn game (cardA, cardB, pairCount).
 */
function startGamePlay(wordList, container, settings) {
  const state = {
    selectedCard: null,
    isChecking: false,
    matchedPairs: 0,
    totalPairs: settings.pairCount,
    seconds: 0,
    timerInterval: null,
  };
  
  // Chuẩn bị dữ liệu game dựa trên settings
  const selectedWords = window.shuffle([...wordList]).slice(0, state.totalPairs);
  let gameCardsData = [];
  selectedWords.forEach(word => {
    gameCardsData.push({ item: word, type: settings.cardA });
    gameCardsData.push({ item: word, type: settings.cardB });
  });
  const shuffledCards = window.shuffle(gameCardsData);

  // Render giao diện game
  container.innerHTML = `
    <div class="p-4">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
        <h2 class="text-2xl font-bold text-indigo-700">Hãy tìm các cặp thẻ!</h2>
        <div class="text-right text-lg font-bold text-gray-700">
          <p>Thời gian: <span id="timer">0</span>s</p>
          <p>Đã ghép: <span id="matched-pairs">0</span>/${state.totalPairs}</p>
        </div>
      </div>
      <div id="game-board" class="grid gap-2 sm:gap-4 grid-cols-4 md:grid-cols-6"></div>
    </div>
  `;

  const gameBoard = container.querySelector('#game-board');
  const timerEl = container.querySelector('#timer');
  const matchedPairsEl = container.querySelector('#matched-pairs');

  // Hàm tạo một thẻ bài
  function createCardElement(cardData) {
    const card = document.createElement('div');
    card.className = 'game-card';
    card.dataset.id = cardData.item.id;
    card.dataset.reading = cardData.item.reading; // Lưu cách đọc để phát âm
    
    const audioIcon = `<svg class="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>`;
    
    const contentMap = {
      'kanji': `<span class="jp-font text-xl sm:text-2xl font-bold pointer-events-none">${cardData.item.kanji}</span>`,
      'reading': `<span class="jp-font text-base sm:text-xl pointer-events-none">${cardData.item.reading}</span>`,
      'meaning': `<span class="text-xs sm:text-sm font-medium pointer-events-none">${cardData.item.meaning}</span>`,
      'audio': audioIcon,
    };
    card.innerHTML = contentMap[cardData.type] || '';
    return card;
  }
  
  // Hàm xử lý click thẻ
  function handleCardClick(e) {
      const clickedCard = e.target.closest('.game-card');
      if (!clickedCard || state.isChecking || clickedCard.classList.contains('is-matched') || clickedCard === state.selectedCard) return;

      // Phát âm khi click
      if (clickedCard.dataset.reading) window.speakJapanese(clickedCard.dataset.reading);

      if (!state.selectedCard) {
          state.selectedCard = clickedCard;
          state.selectedCard.classList.add('is-selected');
      } else {
          state.isChecking = true;
          clickedCard.classList.add('is-selected');
          if (state.selectedCard.dataset.id === clickedCard.dataset.id) {
              setTimeout(() => {
                  state.selectedCard.classList.add('is-matched');
                  clickedCard.classList.add('is-matched');
                  state.selectedCard.classList.remove('is-selected');
                  clickedCard.classList.remove('is-selected');
                  state.selectedCard = null; state.isChecking = false;
                  state.matchedPairs++;
                  matchedPairsEl.textContent = state.matchedPairs;
                  if (state.matchedPairs === state.totalPairs) {
                      clearInterval(state.timerInterval);
                      renderResultsScreen(wordList, container, state);
                  }
              }, 500);
          } else {
              setTimeout(() => {
                  state.selectedCard.classList.add('is-wrong');
                  clickedCard.classList.add('is-wrong');
                  setTimeout(() => {
                      state.selectedCard.classList.remove('is-selected', 'is-wrong');
                      clickedCard.classList.remove('is-selected', 'is-wrong');
                      state.selectedCard = null; state.isChecking = false;
                  }, 800);
              }, 400);
          }
      }
  }

  // Tạo và gắn các thẻ bài vào game board
  shuffledCards.forEach(cardData => gameBoard.appendChild(createCardElement(cardData)));
  gameBoard.addEventListener('click', handleCardClick);

  // Bắt đầu đếm giờ
  state.timerInterval = setInterval(() => {
      state.seconds++;
      timerEl.textContent = state.seconds;
  }, 1000);
}

/**
 * Render màn hình kết quả khi chơi xong.
 */
function renderResultsScreen(wordList, container, gameState) {
    container.innerHTML = `
      <div class="text-center p-8 animate-fade-in">
        <h2 class="text-4xl font-bold text-green-600 mb-4">Hoàn thành!</h2>
        <p class="text-xl mb-2">Thời gian của bạn: <span class="font-bold">${gameState.seconds}</span> giây.</p>
        <p class="text-xl mb-8">Bạn đã ghép được: <span class="font-bold">${gameState.totalPairs}</span> cặp thẻ.</p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button id="play-again-btn" class="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700">Chơi lại</button>
          <button id="change-settings-btn" class="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300">Đổi cài đặt</button>
        </div>
      </div>
    `;

    container.querySelector('#play-again-btn').addEventListener('click', () => {
      // Chơi lại với cùng cài đặt
      const settings = {
        cardA: container.querySelector('input[name="cardA"]:checked')?.value || 'kanji',
        cardB: container.querySelector('input[name="cardB"]:checked')?.value || 'meaning',
        pairCount: gameState.totalPairs,
      };
      startGamePlay(wordList, container, settings);
    });

    container.querySelector('#change-settings-btn').addEventListener('click', () => {
      // Quay về màn hình cài đặt
      renderSettingsScreen(wordList, container);
    });
}

// Gán hàm chính vào window để game.js có thể gọi
window.launchMatchGame = launchMatchGame;