// src/js/games/ai-quiz.js

import { generateContextualQuiz } from '../gemini.js';

async function startAIQuizGame(wordList, container) {
    if (!container) return;

    // Hiển thị trạng thái tải
    container.innerHTML = `
        <div class="text-center p-10">
            <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600 mx-auto"></div>
            <p class="mt-4 text-gray-600">AI đang tạo bộ câu hỏi độc đáo cho bạn...</p>
        </div>`;

    if (wordList.length < 4) {
    container.innerHTML = `<div class="p-8 text-center text-gray-600">Cần ít nhất 4 từ vựng để chơi AI Quiz.</div>`;
        return;
    }

    const apiKey = window.getApiKey();
    if (!apiKey) {
    container.innerHTML = `<div class="p-4 bg-red-100 text-red-700 rounded">Lỗi: Vui lòng nhập API Key trong phần Cài đặt để sử dụng tính năng này.</div>`;
        return;
    }

    // Lấy bộ câu hỏi từ AI
    const quizData = await generateContextualQuiz(apiKey, wordList);

    if (!quizData) {
    container.innerHTML = `<div class="p-4 bg-red-100 text-red-700 rounded">Lỗi: Không thể tạo câu hỏi từ AI. Vui lòng thử lại.</div>`;
        return;
    }

    let currentQuestionIndex = 0;
    let score = 0;

    function renderQuestion() {
        container.innerHTML = '';
        if (currentQuestionIndex >= quizData.length) {
            container.innerHTML = `
                <div class="text-center p-8 animate-fade-in">
                    <h2 class="text-3xl font-bold text-green-600 mb-4">Hoàn thành!</h2>
                    <p class="text-xl text-gray-700">Điểm của bạn: <span class="font-bold">${score} / ${quizData.length}</span></p>
                    <button id="replay-ai-quiz-btn" class="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700">Chơi lại với bộ câu hỏi mới</button>
                </div>`;
            document.getElementById('replay-ai-quiz-btn').addEventListener('click', () => startAIQuizGame(wordList, container));
            return;
        }

        const question = quizData[currentQuestionIndex];
        const progress = ((currentQuestionIndex + 1) / quizData.length) * 100;

        const quizHTML = `
            <div class="p-4 md:p-8 animate-fade-in">
                <div class="w-full bg-gray-200 rounded-full h-2.5 mb-6">
                    <div class="bg-purple-600 h-2.5 rounded-full" style="width: ${progress}%"></div>
                </div>
                <div class="mb-6 text-center">
                    <p class="text-gray-600 text-lg">"${question.context}"</p>
                    <h2 class="jp-font text-2xl font-bold my-4 text-gray-800">${question.question}</h2>
                </div>
                <div id="quiz-options" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    ${question.options.map(opt => `
                        <button data-answer="${opt}" class="quiz-option text-left p-4 bg-white hover:bg-indigo-50 rounded-lg shadow-md border border-gray-200 transition-all transform hover:scale-102 cursor-pointer relative">
                            <span class="text-gray-700">${opt}</span>
                            <span class="feedback-icon absolute right-4 top-1/2 -translate-y-1/2 text-xl"></span>
                        </button>`).join('')}
                </div>
                <div class="mt-4 text-center h-8 text-lg font-semibold" id="feedback-area"></div>
            </div>`;

        container.innerHTML = quizHTML;
        document.querySelectorAll('.quiz-option').forEach(button => {
            button.addEventListener('click', handleAnswer);
        });
    }

    function handleAnswer(event) {
        const selectedButton = event.currentTarget;
        const selectedAnswer = selectedButton.dataset.answer;
        const correctAnswer = quizData[currentQuestionIndex].answer;

        document.querySelectorAll('.quiz-option').forEach(btn => btn.disabled = true);
        const correctButton = document.querySelector(`[data-answer="${correctAnswer}"]`);

        if (selectedAnswer === correctAnswer) {
            score++;
            selectedButton.classList.add('bg-green-100', 'border-green-400');
            selectedButton.querySelector('.feedback-icon').textContent = '✓';
        } else {
            selectedButton.classList.add('bg-red-100', 'border-red-400');
            selectedButton.querySelector('.feedback-icon').textContent = '✗';
            if (correctButton) {
                correctButton.classList.add('bg-green-100', 'border-green-400');
                correctButton.querySelector('.feedback-icon').textContent = '✓';
            }
        }

        setTimeout(() => {
            currentQuestionIndex++;
            renderQuestion();
        }, 1500);
    }

    renderQuestion();
}

window.startAIQuizGame = startAIQuizGame;
