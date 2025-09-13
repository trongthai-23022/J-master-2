// Thay thế toàn bộ nội dung file: src/js/games/flashcard.js

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

function startFlashcardGame(wordList, container) {
  if (!container) {
    console.error("Flashcard container not found!");
    return;
  }

  if (!Array.isArray(wordList) || wordList.length === 0) {
    container.innerHTML = `<div class="p-8 text-center text-gray-600">Không có từ vựng để học.</div>`;
    return;
  }

  const state = {
    cards: window.shuffle([...wordList]),
    currentIndex: 0,
    isFlipped: false,
    autoPlay: false,
    autoSpeak: true,
    speedSec: 4,
    autoTimer: null,
  };

  let elements = {};

  const clearAuto = () => {
    if (state.autoTimer) clearTimeout(state.autoTimer);
    state.autoTimer = null;
  };

  const speakNow = () => {
    if (!state.autoSpeak || typeof window.speakJapanese !== 'function') return;
    const word = state.cards[state.currentIndex];
    const text = word.reading || word.kanji || '';
    if (text) window.speakJapanese(text);
  };

  const flipCard = (shouldBeFlipped) => {
    state.isFlipped = typeof shouldBeFlipped === 'boolean' ? shouldBeFlipped : !state.isFlipped;
    elements.cardContainer.classList.toggle('is-flipped', state.isFlipped);
    if (state.isFlipped) {
      speakNow();
    }
    scheduleAuto();
  };

  const goToCard = (index) => {
    clearAuto();
    state.currentIndex = (index + state.cards.length) % state.cards.length;
    if (state.isFlipped) {
        flipCard(false);
        setTimeout(() => {
            updateCardContent();
            scheduleAuto();
        }, 300); 
    } else {
        updateCardContent();
        scheduleAuto();
    }
  };

  const scheduleAuto = () => {
    clearAuto();
    if (!state.autoPlay) return;
    
    const flipDelay = 1500;
    const nextDelay = state.speedSec * 1000;

    if (!state.isFlipped) {
      state.autoTimer = setTimeout(() => {
        flipCard(true);
      }, flipDelay);
    } else {
      state.autoTimer = setTimeout(() => {
        goToCard(state.currentIndex + 1);
      }, nextDelay);
    }
  };
  
  const updateCardContent = () => {
    const word = state.cards[state.currentIndex];
    elements.kanjiDisplay.textContent = word.kanji || '';
    elements.meaningDisplay.textContent = word.meaning || '';
    elements.readingDisplay.textContent = word.reading || '';
    elements.progressText.textContent = `${state.currentIndex + 1} / ${state.cards.length}`;
    
    const progressPercentage = ((state.currentIndex + 1) / state.cards.length) * 100;
    elements.progressBar.style.width = `${progressPercentage}%`;
  };

  function setupEventListeners() {
    elements.cardContainer.addEventListener('click', () => flipCard());
    elements.prevButton.addEventListener('click', () => goToCard(state.currentIndex - 1));
    elements.nextButton.addEventListener('click', () => goToCard(state.currentIndex + 1));
    
    elements.speakButton.addEventListener('click', (e) => {
        e.stopPropagation();
        speakNow();
    });

    elements.autoSpeakCheckbox.addEventListener('change', (e) => { state.autoSpeak = e.target.checked; });
    elements.autoPlayCheckbox.addEventListener('change', (e) => {
      state.autoPlay = e.target.checked;
      elements.speedSlider.disabled = !state.autoPlay;
      scheduleAuto();
    });
    elements.speedSlider.addEventListener('input', (e) => {
      state.speedSec = parseInt(e.target.value, 10);
      elements.speedValue.textContent = `${state.speedSec}s`;
    });
    elements.speedSlider.addEventListener('change', scheduleAuto);

    if (!window.flashcardKeysAttached) {
        document.addEventListener('keydown', (e) => {
            if (container.offsetParent === null) return; 
            
            if (e.code === 'ArrowLeft') goToCard(state.currentIndex - 1);
            else if (e.code === 'ArrowRight') goToCard(state.currentIndex + 1);
            else if (e.code === 'Space') {
                e.preventDefault();
                flipCard();
            }
        });
        window.flashcardKeysAttached = true;
    }
  }

  const renderInitialUI = () => {
    container.innerHTML = `
      <div class="flex flex-col items-center gap-4 p-4 md:p-6 max-w-2xl mx-auto">
        <div class="w-full">
          <div id="progress-text" class="text-right mb-1 text-sm text-gray-600"></div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div id="progress-bar" class="bg-blue-600 h-2 rounded-full transition-all duration-300"></div>
          </div>
        </div>
        
        <div id="flashcard-container" class="flip-container w-full h-64 md:h-80 cursor-pointer select-none">
          <div class="flipper">
            <div class="flip-face bg-white border rounded-xl shadow-lg p-6">
              <div class="text-center">
                <div id="kanji-display" class="jp-font text-6xl md:text-7xl font-bold"></div>
              </div>
            </div>
            <div class="flip-face flip-back bg-white border rounded-xl shadow-lg p-6">
              <div class="text-center">
                <div id="meaning-display" class="text-2xl md:text-3xl font-semibold mb-2"></div>
                <div id="reading-display" class="jp-font text-xl md:text-2xl text-gray-600"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-between w-full max-w-sm">
          <button id="prev-btn" class="p-3 rounded-full hover:bg-gray-200 transition-colors" aria-label="Thẻ trước">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button id="speak-btn" class="p-3 rounded-full text-blue-600 hover:bg-blue-50 transition-colors" aria-label="Phát âm">
            <svg class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
          </button>
          <button id="next-btn" class="p-3 rounded-full hover:bg-gray-200 transition-colors" aria-label="Thẻ kế tiếp">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
        
        <div class="mt-4 p-4 bg-gray-50 rounded-lg w-full text-sm text-gray-700">
          <div class="flex flex-col md:flex-row md:items-center justify-center gap-4 md:gap-6">
             <label class="flex items-center gap-2 cursor-pointer">
                <input id="auto-speak-check" type="checkbox" ${state.autoSpeak ? 'checked' : ''}/> Tự động phát âm
             </label>
             <label class="flex items-center gap-2 cursor-pointer">
                <input id="auto-play-check" type="checkbox" ${state.autoPlay ? 'checked' : ''}/> Tự động chạy
             </label>
             <label class="flex items-center gap-2">
                Tốc độ: 
                <input id="auto-speed-slider" type="range" min="2" max="10" value="${state.speedSec}" class="w-24" ${!state.autoPlay ? 'disabled' : ''}/>
                <span id="auto-speed-value">${state.speedSec}s</span>
             </label>
          </div>
        </div>
      </div>
    `;

    elements = {
        cardContainer: container.querySelector('#flashcard-container'),
        kanjiDisplay: container.querySelector('#kanji-display'),
        meaningDisplay: container.querySelector('#meaning-display'),
        readingDisplay: container.querySelector('#reading-display'),
        progressText: container.querySelector('#progress-text'),
        progressBar: container.querySelector('#progress-bar'),
        prevButton: container.querySelector('#prev-btn'),
        nextButton: container.querySelector('#next-btn'),
        speakButton: container.querySelector('#speak-btn'),
        autoSpeakCheckbox: container.querySelector('#auto-speak-check'),
        autoPlayCheckbox: container.querySelector('#auto-play-check'),
        speedSlider: container.querySelector('#auto-speed-slider'),
        speedValue: container.querySelector('#auto-speed-value'),
    };
  };

  renderInitialUI();
  updateCardContent();
  setupEventListeners();
}

window.startFlashcardGame = startFlashcardGame;