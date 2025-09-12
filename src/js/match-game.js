// Matching Game: Ghép cặp Kanji, nghĩa, đọc, âm thanh
function startMatchGame(wordList, options) {
    // options: {cardA: 'kanji', cardB: 'meaning', pairCount: 8}
    // Tạo mảng cặp thẻ
    const pairs = [];
    const used = new Set();
    while (pairs.length < options.pairCount && pairs.length < wordList.length) {
        const idx = Math.floor(Math.random() * wordList.length);
        if (used.has(idx)) continue;
        used.add(idx);
        const w = wordList[idx];
        pairs.push({a: w[options.cardA], b: w[options.cardB], id: w.id});
    }
    // Tạo board: trộn các thẻ
    const cards = [];
    pairs.forEach(p => {
        cards.push({type: 'A', value: p.a, id: p.id});
        cards.push({type: 'B', value: p.b, id: p.id});
    });
    // Xáo trộn
    for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    // Render UI
    const gameArea = document.getElementById('minigame-area');
    if (!gameArea) return;
    gameArea.innerHTML = '';
    const board = document.createElement('div');
    board.className = 'grid grid-cols-4 gap-4';
    cards.forEach((card, idx) => {
        const btn = document.createElement('button');
        btn.className = 'bg-white border rounded shadow px-2 py-4 text-center hover:bg-blue-50';
        btn.textContent = card.value;
        btn.dataset.cardType = card.type;
        btn.dataset.cardId = card.id;
        btn.dataset.idx = idx;
        btn.onclick = () => selectCard(idx);
        board.appendChild(btn);
    });
    gameArea.appendChild(board);

    // Logic chọn thẻ
    let selected = [];
    function selectCard(idx) {
        if (selected.length === 2) return;
        const btns = board.querySelectorAll('button');
        btns[idx].classList.add('bg-yellow-100');
        selected.push(idx);
        if (selected.length === 2) {
            const c1 = cards[selected[0]];
            const c2 = cards[selected[1]];
            if (c1.id === c2.id && c1.type !== c2.type) {
                // Đúng
                btns[selected[0]].classList.add('bg-green-200');
                btns[selected[1]].classList.add('bg-green-200');
                setTimeout(() => {
                    btns[selected[0]].disabled = true;
                    btns[selected[1]].disabled = true;
                    selected = [];
                }, 500);
            } else {
                // Sai
                btns[selected[0]].classList.add('bg-red-200');
                btns[selected[1]].classList.add('bg-red-200');
                setTimeout(() => {
                    btns[selected[0]].classList.remove('bg-yellow-100', 'bg-red-200');
                    btns[selected[1]].classList.remove('bg-yellow-100', 'bg-red-200');
                    selected = [];
                }, 700);
            }
        }
    }

// Hàm khởi động game từ UI
function launchMatchGame() {
    // Lấy danh sách từ vựng từ manager.js
    const lists = window.getWordLists ? window.getWordLists() : {};
    // Chọn list đầu tiên hoặc rỗng
    const firstList = Object.values(lists)[0] || [];
    startMatchGame(firstList, {cardA: 'kanji', cardB: 'meaning', pairCount: 8});
}

// Gắn vào nút UI
document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('btn-flashcard');
    if (btn) btn.onclick = launchMatchGame;
});
}
// ...Thêm các hàm render UI, xử lý sự kiện
