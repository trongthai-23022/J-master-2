function startQuizGame(wordList, container) {
    if (!container) return;

    let currentQuestionIndex = 0;
    let score = 0;
    let shuffledQuestions = shuffle([...wordList]);

    function renderQuestion() {
        container.innerHTML = ''; // Xóa câu hỏi cũ

        if (shuffledQuestions.length < 4) {
             container.innerHTML = `<div class="text-center p-8">
                <p class="text-xl text-gray-700">Cần ít nhất 4 từ vựng trong bộ từ để chơi game Quiz.</p>
            </div>`;
            return;
        }

        if (currentQuestionIndex >= shuffledQuestions.length) {
            // Kết thúc game
            container.innerHTML = `<div class="text-center p-8 animate-fade-in">
                <h2 class="text-3xl font-bold text-green-600 mb-4">Hoàn thành!</h2>
                <p class="text-xl text-gray-700">Điểm của bạn: <span class="font-bold">${score} / ${shuffledQuestions.length}</span></p>
                <button id="replay-quiz-btn" class="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-transform transform hover:scale-105">Chơi lại</button>
            </div>`;
            document.getElementById('replay-quiz-btn').addEventListener('click', () => {
                // Reset và chơi lại
                currentQuestionIndex = 0;
                score = 0;
                shuffledQuestions = shuffle([...wordList]);
                renderQuestion();
            });
            return;
        }

        const question = shuffledQuestions[currentQuestionIndex];
        const progress = ((currentQuestionIndex + 1) / shuffledQuestions.length) * 100;

        // Tạo các lựa chọn trả lời (1 đúng, 3 sai)
        let options = [question];
        let distractors = shuffle([...wordList].filter(w => w.id !== question.id)).slice(0, 3);
        options.push(...distractors);
        options = shuffle(options);

        // Hiển thị câu hỏi và các lựa chọn
        const quizHTML = `
            <div class="p-4 md:p-8 animate-fade-in">
                <div class="w-full bg-gray-200 rounded-full h-2.5 mb-6">
                    <div class="bg-blue-600 h-2.5 rounded-full" style="width: ${progress}%"></div>
                </div>

                <div class="mb-6 text-center">
                    <p class="text-gray-600 text-lg">Từ sau đây có nghĩa là gì?</p>
                    <h2 class="jp-font text-5xl font-bold my-4 text-gray-800">${question.kanji}</h2>
                    <p class="text-gray-500 text-xl">${question.reading}</p>
                </div>
                <div id="quiz-options" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    ${options.map(opt => `
                        <button data-word-id="${opt.id}" class="quiz-option text-left p-4 bg-white hover:bg-indigo-50 rounded-lg shadow-md border border-gray-200 transition-all transform hover:scale-102 cursor-pointer relative">
                            <span class="text-gray-700">${opt.meaning}</span>
                            <span class="feedback-icon absolute right-4 top-1/2 -translate-y-1/2"></span>
                        </button>
                    `).join('')}
                </div>
                <div class="mt-4 text-center h-8 text-lg font-semibold" id="feedback-area"></div>
            </div>
        `;
        container.innerHTML = quizHTML;

        // Gắn sự kiện click cho các lựa chọn
        document.querySelectorAll('.quiz-option').forEach(button => {
            button.addEventListener('click', handleAnswer);
        });
    }

    function handleAnswer(event) {
        const selectedButton = event.currentTarget;
        const selectedId = parseInt(selectedButton.dataset.wordId);
        const correctId = shuffledQuestions[currentQuestionIndex].id;
        const feedbackArea = document.getElementById('feedback-area');
        const optionsContainer = document.getElementById('quiz-options');

        // Vô hiệu hóa các nút sau khi đã chọn
        optionsContainer.querySelectorAll('button').forEach(btn => {
            btn.disabled = true;
            btn.classList.remove('hover:bg-indigo-50', 'hover:scale-102');
            btn.style.cursor = 'not-allowed';
        });

        const correctButton = optionsContainer.querySelector(`[data-word-id="${correctId}"]`);

        if (selectedId === correctId) {
            score++;
            selectedButton.classList.add('bg-green-100', 'border-green-400');
            selectedButton.querySelector('.feedback-icon').innerHTML = '✔️';
            feedbackArea.textContent = 'Chính xác!';
            feedbackArea.className = 'mt-4 text-center h-8 text-lg font-semibold text-green-600';
        } else {
            selectedButton.classList.add('bg-red-100', 'border-red-400', 'animate-shake');
            selectedButton.querySelector('.feedback-icon').innerHTML = '❌';

            correctButton.classList.add('bg-green-100', 'border-green-400');
            correctButton.querySelector('.feedback-icon').innerHTML = '✔️';
            
            feedbackArea.textContent = 'Sai rồi!';
            feedbackArea.className = 'mt-4 text-center h-8 text-lg font-semibold text-red-600';
        }

        // Chuyển sang câu hỏi tiếp theo
        setTimeout(() => {
            currentQuestionIndex++;
            renderQuestion();
        }, 1800);
    }

    renderQuestion();
}