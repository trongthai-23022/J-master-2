// Writing game: type the reading (hiragana) for a given Kanji
function startWritingGame(wordList, container) {
  if (!container) return;
  if (!Array.isArray(wordList) || wordList.length === 0) {
    container.innerHTML = '<div class="p-8 text-center text-gray-600">Không có từ vựng để chơi.</div>';
    return;
  }

  const items = (window.shuffle ? window.shuffle([...wordList.map(w => ({...w}))]) : [...wordList]);
  let idx = 0;
  let score = 0;

  function render() {
    if (idx >= items.length) {
      container.innerHTML = `
        <div class="text-center p-8">
          <h2 class="text-3xl font-bold text-green-600 mb-3">Hoàn thành!</h2>
          <div class="text-xl">Điểm: ${score} / ${items.length}</div>
        </div>`;
      return;
    }

    const w = items[idx];
    container.innerHTML = `
      <div class="p-6">
        <div class="mb-6 text-center">
          <div class="text-gray-500">Câu ${idx + 1} / ${items.length}</div>
          <div class="jp-font text-5xl font-bold mt-2 mb-1">${w.kanji || ''}</div>
          <div class="text-gray-400">Nhập cách đọc (hiragana)</div>
        </div>
        <div class="flex items-center gap-3 justify-center">
          <input id="ans" class="border rounded px-3 py-2 w-64" placeholder="hiragana..." />
          <button id="check" class="px-4 py-2 rounded bg-blue-600 text-white">Kiểm tra</button>
        </div>
        <div id="fb" class="h-8 mt-4 text-center text-lg font-semibold"></div>
      </div>`;

    const ans = container.querySelector('#ans');
    const fb = container.querySelector('#fb');
    const check = container.querySelector('#check');
    ans.focus();
    check.addEventListener('click', () => {
      const user = (ans.value || '').trim();
      const correct = (w.reading || '').trim();
      if (user && correct && user === correct) {
        score++;
        fb.textContent = 'Chính xác!';
        fb.className = 'h-8 mt-4 text-center text-lg font-semibold text-green-600';
      } else {
        fb.textContent = `Sai rồi! Đáp án: ${correct}`;
        fb.className = 'h-8 mt-4 text-center text-lg font-semibold text-red-600';
      }
      setTimeout(() => { idx++; render(); }, 1200);
    });
  }

  render();
}

window.startWritingGame = startWritingGame;

