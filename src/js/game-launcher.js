// Populate list selector and intercept game launches to require a chosen list
function populateGameListSelect() {
  const select = document.getElementById('game-list-select');
  if (!select) return;
  const lists = (typeof window.getWordLists === 'function') ? window.getWordLists() : {};
  const names = Object.keys(lists);
  const last = localStorage.getItem('jMasterSelectedList') || '';
  select.innerHTML = '';
  if (names.length === 0) {
    const opt = document.createElement('option');
    opt.textContent = 'Chưa có bộ từ';
    opt.value = '';
    opt.disabled = true;
    opt.selected = true;
    select.appendChild(opt);
    return;
  }
  names.forEach(name => {
    const opt = document.createElement('option');
    opt.value = name;
    opt.textContent = `${name} (${(lists[name]||[]).length})`;
    if (last && last === name) opt.selected = true;
    select.appendChild(opt);
  });
  if (!select.value && names.length) select.value = names[0];
  select.onchange = () => localStorage.setItem('jMasterSelectedList', select.value);
}

function launchGameWithSelect(gameType) {
  const lists = (typeof window.getWordLists === 'function') ? window.getWordLists() : {};
  const select = document.getElementById('game-list-select');
  const selectedName = select ? select.value : (Object.keys(lists)[0] || '');
  if (!selectedName || !lists[selectedName] || lists[selectedName].length === 0) {
    alert('Vui lòng chọn một bộ từ có dữ liệu trước khi chơi.');
    return;
  }
  const wordList = lists[selectedName];
  sessionStorage.setItem('jMasterGameType', gameType);
  sessionStorage.setItem('jMasterWordList', JSON.stringify(wordList));
  window.location.href = 'src/game.html';
}

document.addEventListener('DOMContentLoaded', () => {
  try { populateGameListSelect(); } catch {}
  if (typeof window.onWordListsChange === 'function') {
    try { window.onWordListsChange(populateGameListSelect); } catch {}
  }
  const bind = (id, type) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopImmediatePropagation();
      launchGameWithSelect(type);
    }, true); // capture to intercept any earlier listener
  };
  bind('btn-flashcard', 'flashcard');
  bind('btn-quiz', 'quiz');
  bind('btn-writing', 'writing');
  bind('btn-match', 'match-game');
});

