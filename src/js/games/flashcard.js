// Flashcard game: flip between Kanji / Meaning / Reading with auto speak/run
function startFlashcardGame(wordList, container) {
  if (!container) return;
  if (!Array.isArray(wordList) || wordList.length === 0) {
    container.innerHTML = '<div class="p-8 text-center text-gray-600">Không có từ vựng để chơi.</div>';
    return;
  }

  const cards = (window.shuffle ? window.shuffle([...wordList.map(w => ({...w}))]) : [...wordList]);
  let idx = 0;
  let flipped = false; // false: show kanji, true: show meaning+reading
  let autoPlay = false;
  let autoSpeak = true;
  let speedSec = 3;
  let autoTimer = null;

  function clearAuto() { if (autoTimer) { clearTimeout(autoTimer); autoTimer = null; } }
  function speakNow() {
    if (!autoSpeak) return;
    if (typeof window.speakJapanese === 'function') {
      const w = cards[idx];
      const text = (w.reading || w.kanji || '').toString();
      if (text) window.speakJapanese(text);
    }
  }

  function render() {
    const w = cards[idx];
    clearAuto();
    container.innerHTML = `
      <div class="flex flex-col items-center gap-6 p-8">
        <div class="text-sm text-gray-500">${idx + 1} / ${cards.length}</div>
        <div id="flashcard" class="flip-container w-full md:w-2/3">
          <div class="flipper bg-white border rounded-xl shadow p-10 text-center cursor-pointer select-none">
            <div class="flip-face">
              <div>
                <div class="jp-font text-5xl font-bold mb-3">${w.kanji || ''}</div>
                <div class="text-gray-400">Nhấp để xem nghĩa</div>
              </div>
            </div>
            <div class="flip-face flip-back">
              <div>
                <div class="text-2xl font-semibold mb-2">${w.meaning || ''}</div>
                <div class="jp-font text-xl text-gray-600">${w.reading || ''}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="flex flex-col items-center gap-3 w-full md:w-2/3">
          <div class="flex flex-wrap items-center justify-center gap-3 w-full">
            <button id="prev" class="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200">Trước</button>
            <button id="flip" class="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200">Lật</button>
            <button id="next" class="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200">Sau</button>
            <button id="speak" class="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">Phát âm</button>
          </div>
          <div class="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-700 w-full">
            <label class="flex items-center gap-2"><input id="auto-speak" type="checkbox" ${autoSpeak ? 'checked' : ''}/> Tự động phát âm</label>
            <label class="flex items-center gap-2"><input id="auto-play" type="checkbox" ${autoPlay ? 'checked' : ''}/> Tự động chạy</label>
            <label class="flex items-center gap-2">Tốc độ <input id="auto-speed" type="range" min="2" max="8" value="${speedSec}"/></label>
          </div>
        </div>
      </div>`;

    const containerEl = container.querySelector('#flashcard');
    const setFlip = (state) => {
      flipped = state;
      if (flipped) containerEl.classList.add('is-flipped');
      else containerEl.classList.remove('is-flipped');
    };
    containerEl.addEventListener('click', () => { setFlip(!flipped); if (flipped) speakNow(); scheduleAuto(); });
    container.querySelector('#prev').addEventListener('click', () => {
      idx = (idx - 1 + cards.length) % cards.length;
      setFlip(false);
      render();
    });
    container.querySelector('#flip').addEventListener('click', () => { setFlip(!flipped); if (flipped) speakNow(); scheduleAuto(); });
    container.querySelector('#next').addEventListener('click', () => {
      idx = (idx + 1) % cards.length;
      setFlip(false);
      render();
    });
    container.querySelector('#speak').addEventListener('click', () => {
      if (typeof window.speakJapanese === 'function') {
        window.speakJapanese(cards[idx].reading || cards[idx].kanji || '');
      }
    });

    const autoSpeakEl = container.querySelector('#auto-speak');
    const autoPlayEl = container.querySelector('#auto-play');
    const speedEl = container.querySelector('#auto-speed');
    autoSpeakEl.addEventListener('change', () => { autoSpeak = autoSpeakEl.checked; if (flipped) speakNow(); });
    autoPlayEl.addEventListener('change', () => { autoPlay = autoPlayEl.checked; scheduleAuto(); });
    speedEl.addEventListener('input', () => { speedSec = parseInt(speedEl.value, 10) || 3; scheduleAuto(); });

    setFlip(flipped);
    if (flipped) speakNow();
    scheduleAuto();

    if (!window.__jFlashKeysAdded) {
      window.__jFlashKeysAdded = true;
      document.addEventListener('keydown', (e) => {
        const code = e.code || e.key;
        if (code === 'ArrowLeft') { e.preventDefault(); clearAuto(); idx = (idx - 1 + cards.length) % cards.length; flipped = false; render(); }
        else if (code === 'ArrowRight') { e.preventDefault(); clearAuto(); idx = (idx + 1) % cards.length; flipped = false; render(); }
        else if (code === 'Space') { e.preventDefault(); setFlip(!flipped); if (flipped) speakNow(); scheduleAuto(); }
      });
    }

    function scheduleAuto() {
      clearAuto();
      if (!autoPlay) return;
      if (!flipped) {
        autoTimer = setTimeout(() => { setFlip(true); speakNow(); scheduleAuto(); }, 1000);
      } else {
        autoTimer = setTimeout(() => { idx = (idx + 1) % cards.length; setFlip(false); render(); }, speedSec * 1000);
      }
    }
  }

  render();
}

window.startFlashcardGame = startFlashcardGame;

