// src/js/match-game.js

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
}

// Hàm khởi động game từ UI
function launchMatchGame(wordList, container) {
    // Hàm này dành cho game ghép thẻ, có thể gọi từ game.js
    // Để tương thích với cấu trúc mới, chúng ta sẽ render vào container được truyền vào
    if (!container) return;
    const options = { cardA: 'kanji', cardB: 'meaning', pairCount: Math.min(8, Math.floor(wordList.length / 2) * 2) };
    
    // Tái cấu trúc lại một chút để render vào đúng container
    const pairs = [];
    const used = new Set();
    while (pairs.length < options.pairCount && pairs.length < wordList.length) {
        const idx = Math.floor(Math.random() * wordList.length);
        if (used.has(idx)) continue;
        used.add(idx);
        const w = wordList[idx];
        pairs.push({ a: w[options.cardA], b: w[options.cardB], id: w.id });
    }
    
    const cards = [];
    pairs.forEach(p => {
        cards.push({ type: 'A', value: p.a, id: p.id });
        cards.push({ type: 'B', value: p.b, id: p.id });
    });
    
    shuffle(cards); // Sử dụng hàm shuffle đã có trong minigames.js

    container.innerHTML = '';
    const board = document.createElement('div');
    board.className = 'grid grid-cols-4 gap-4 p-4';
    
    cards.forEach((card) => {
        const btn = document.createElement('button');
        btn.className = 'bg-white border rounded shadow px-2 py-4 text-center hover:bg-blue-50 aspect-square'; // Thêm aspect-square
        btn.textContent = card.value;
        btn.dataset.cardId = card.id;
        board.appendChild(btn);
    });
    container.appendChild(board);

    let firstCard = null;
    let isChecking = false;

    board.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (isChecking || e.currentTarget.classList.contains('matched')) return;

            e.currentTarget.classList.add('bg-yellow-200');

            if (!firstCard) {
                firstCard = e.currentTarget;
            } else {
                isChecking = true;
                const secondCard = e.currentTarget;

                if (firstCard.dataset.cardId === secondCard.dataset.cardId && firstCard !== secondCard) {
                    // Matched
                    setTimeout(() => {
                        firstCard.classList.add('matched', 'bg-green-200');
                        secondCard.classList.add('matched', 'bg-green-200');
                        firstCard = null;
                        isChecking = false;
                    }, 500);
                } else {
                    // Not matched
                    setTimeout(() => {
                        firstCard.classList.remove('bg-yellow-200');
                        secondCard.classList.remove('bg-yellow-200');
                        firstCard = null;
                        isChecking = false;
                    }, 1000);
                }
            }
        });
    });
}
// Gán hàm vào window để game.js có thể gọi
window.launchMatchGame = launchMatchGame;
 
// V2 with flip-on-click UI
function launchMatchGameV2(wordList, container) {
    if (!container) return;
    const options = { cardA: 'kanji', cardB: 'meaning', pairCount: Math.min(8, Math.floor(wordList.length / 2) * 2) };

    const pairs = [];
    const used = new Set();
    while (pairs.length < options.pairCount && pairs.length < wordList.length) {
        const idx = Math.floor(Math.random() * wordList.length);
        if (used.has(idx)) continue;
        used.add(idx);
        const w = wordList[idx];
        pairs.push({ a: w[options.cardA], b: w[options.cardB], id: w.id });
    }

    const cards = [];
    pairs.forEach(p => {
        cards.push({ type: 'A', value: p.a, id: p.id });
        cards.push({ type: 'B', value: p.b, id: p.id });
    });

    if (typeof shuffle === 'function') shuffle(cards);

    container.innerHTML = '';
    const board = document.createElement('div');
    board.className = 'grid grid-cols-4 gap-4 p-4';

    cards.forEach((card) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'flip-container aspect-square relative focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded';
        btn.dataset.cardId = card.id;
        btn.setAttribute('aria-label', 'Card');

        const flipper = document.createElement('div');
        flipper.className = 'flipper w-full h-full bg-white border rounded shadow overflow-hidden';

        const front = document.createElement('div');
        front.className = 'flip-face bg-blue-50 text-blue-600 text-3xl font-bold';
        front.textContent = '?';

        const back = document.createElement('div');
        back.className = 'flip-face flip-back text-center p-2';
        back.innerHTML = `<div class="jp-font text-lg md:text-xl">${card.value}</div>`;

        flipper.appendChild(front);
        flipper.appendChild(back);
        btn.appendChild(flipper);
        board.appendChild(btn);
    });
    container.appendChild(board);

    let firstCard = null;
    let isChecking = false;

    board.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const el = e.currentTarget;
            if (isChecking || el.classList.contains('matched')) return;
            if (firstCard && el === firstCard) return;

            el.classList.add('is-flipped');

            if (!firstCard) {
                firstCard = el;
            } else {
                isChecking = true;
                const secondCard = el;

                if (firstCard.dataset.cardId === secondCard.dataset.cardId && firstCard !== secondCard) {
                    setTimeout(() => {
                        firstCard.classList.add('matched');
                        secondCard.classList.add('matched');
                        firstCard = null;
                        isChecking = false;
                    }, 350);
                } else {
                    setTimeout(() => {
                        firstCard.classList.remove('is-flipped');
                        secondCard.classList.remove('is-flipped');
                        firstCard = null;
                        isChecking = false;
                    }, 800);
                }
            }
        });
    });
}

// Override to use V2 flipping behavior
window.launchMatchGame = launchMatchGameV2;
