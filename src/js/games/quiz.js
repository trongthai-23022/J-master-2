// Quiz game: pick the correct meaning for a Kanji
function startQuizGame(wordList, container) {
  if (!container) return;

  if (!Array.isArray(wordList) || wordList.length < 1) {
    container.innerHTML = '<div class="p-8 text-center text-gray-600">Không có từ vựng để chơi.</div>';
    return;
  }

  let currentQuestionIndex = 0;
  let score = 0;
  let shuffledQuestions = (window.shuffle ? window.shuffle([...wordList]) : [...wordList]);

  function renderQuestion() {
    container.innerHTML = '';

    if (shuffledQuestions.length < 4) {
      container.innerHTML = `<div class="text-center p-8">
        <p class="text-xl text-gray-700">Cần ít nhất 4 từ vựng để chơi Quiz.</p>
      </div>`;
      return;
    }

    if (currentQuestionIndex >= shuffledQuestions.length) {
      container.innerHTML = `<div class="text-center p-8 animate-fade-in">
        <h2 class="text-3xl font-bold text-green-600 mb-4">Hoàn thành!</h2>
        <p class="text-xl text-gray-700">Điểm của bạn: <span class="font-bold">${score} / ${shuffledQuestions.length}</span></p>
        <button id="replay-quiz-btn" class="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-transform transform hover:scale-105">Chơi lại</button>
      </div>`;
      document.getElementById('replay-quiz-btn').addEventListener('click', () => {
        currentQuestionIndex = 0;
        score = 0;
        shuffledQuestions = (window.shuffle ? window.shuffle([...wordList]) : [...wordList]);
        renderQuestion();
      });
      return;
    }

    const question = shuffledQuestions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / shuffledQuestions.length) * 100;

    let options = [question];
    let distractors = (window.shuffle ? window.shuffle([...wordList].filter(w => w.id !== question.id)) : [...wordList].filter(w => w.id !== question.id)).slice(0, 3);
    options.push(...distractors);
    options = window.shuffle ? window.shuffle(options) : options.sort(() => Math.random() - 0.5);

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
    const selectedId = parseInt(selectedButton.dataset.wordId);
    const correctId = shuffledQuestions[currentQuestionIndex].id;
    const feedbackArea = document.getElementById('feedback-area');
    const optionsContainer = document.getElementById('quiz-options');

    optionsContainer.querySelectorAll('button').forEach(btn => {
      btn.disabled = true;
      btn.classList.remove('hover:bg-indigo-50', 'hover:scale-102');
      btn.style.cursor = 'not-allowed';
    });

    const correctButton = optionsContainer.querySelector(`[data-word-id="${correctId}"]`);

    if (selectedId === correctId) {
      score++;
      selectedButton.classList.add('bg-green-100', 'border-green-400');
      selectedButton.querySelector('.feedback-icon').textContent = '✓';
      feedbackArea.textContent = 'Chính xác!';
      feedbackArea.className = 'mt-4 text-center h-8 text-lg font-semibold text-green-600';
    } else {
      selectedButton.classList.add('bg-red-100', 'border-red-400');
      correctButton.classList.add('bg-green-100', 'border-green-400');
      correctButton.querySelector('.feedback-icon').textContent = '✓';
      feedbackArea.textContent = 'Sai rồi!';
      feedbackArea.className = 'mt-4 text-center h-8 text-lg font-semibold text-red-600';
    }

    setTimeout(() => {
      currentQuestionIndex++;
      renderQuestion();
    }, 1200);
  }

  renderQuestion();
}

window.startQuizGame = startQuizGame;

