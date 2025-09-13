import { callGeminiAPI } from './gemini.js';
/**
 * Hiển thị modal và bắt đầu quá trình phân tích từ vựng bằng AI.
 * @param {object} word - Object từ vựng cần phân tích ( {kanji, reading, meaning} ).
 */
export async function analyzeWordWithAI(word) {
    const modal = document.getElementById('ai-sensei-modal');
    const contentArea = document.getElementById('ai-sensei-content');
    if (!modal || !contentArea) return;

    // Hiển thị modal với trạng thái đang tải
    contentArea.innerHTML = `
        <div class="text-center p-10">
            <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div>
            <p class="mt-4 text-gray-600 dark:text-gray-400">AI-Sensei đang suy nghĩ...</p>
        </div>`;
    window.showModal('ai-sensei-modal');

    // Lấy API key
    const apiKey = window.getApiKey();
    if (!apiKey) {
        contentArea.innerHTML = `<div class="p-4 bg-red-100 text-red-700 rounded">Lỗi: Vui lòng nhập API Key trong phần Cài đặt.</div>`;
        return;
    }

    // Tạo prompt và gọi API
    const prompt = createAnalysisPrompt(word);
    const resultText = await callGeminiAPI(apiKey, prompt);

    if (resultText) {
        const formattedHtml = parseAIResponse(resultText, word);
        contentArea.innerHTML = formattedHtml;
    } else {
        contentArea.innerHTML = `<div class="p-4 bg-red-100 text-red-700 rounded">Lỗi: Không nhận được phản hồi từ AI. Vui lòng thử lại.</div>`;
    }
}

/**
 * Tạo prompt chi tiết để gửi cho Gemini API.
 * @param {object} word - Object từ vựng.
 * @returns {string} - Chuỗi prompt hoàn chỉnh.
 */
function createAnalysisPrompt(word) {
    return `
    Bạn là một giáo viên tiếng Nhật (Sensei) tận tâm và am hiểu. Hãy phân tích sâu về từ vựng sau đây cho một người Việt đang học:
    Từ vựng: "${word.kanji}"
    Cách đọc: "${word.reading}"
    Nghĩa: "${word.meaning}"

    Hãy trình bày kết quả theo đúng định dạng sau, không thêm bớt bất kỳ tiêu đề nào:

    [SAKUBUN]
    Cung cấp chính xác 3 câu ví dụ sử dụng từ này trong các ngữ cảnh khác nhau. Mỗi câu phải có:
    1. Câu tiếng Nhật (có furigana).
    2. Bản dịch tiếng Việt.
    Ví dụ: 1. 日本語(にほんご)は楽(たの)しいです。- Tiếng Nhật rất thú vị.

    [NUANCE]
    Giải thích ngắn gọn sắc thái và các tình huống sử dụng đặc biệt của từ này. So sánh với một từ đồng nghĩa hoặc dễ nhầm lẫn nếu có.

    [KANJI]
    Phân tích từng chữ Kanji có trong từ (nếu có). Với mỗi Kanji, hãy:
    1. Nêu ý nghĩa Hán Việt.
    2. Liệt kê các bộ thủ chính cấu thành nó.
    3. Kể một câu chuyện ngắn gọn, sáng tạo để liên kết các bộ thủ với ý nghĩa của chữ Kanji đó. Nếu không có câu chuyện thú vị, hãy mô tả ý nghĩa của các bộ thủ.
    `;
}

/**
 * Phân tích văn bản trả về từ AI và chuyển thành HTML để hiển thị.
 * @param {string} text - Văn bản thô từ Gemini.
 * @param {object} word - Object từ vựng ban đầu.
 * @returns {string} - Chuỗi HTML đã được định dạng.
 */
function parseAIResponse(text, word) {
    const sakubun = text.split('[SAKUBUN]')[1]?.split('[NUANCE]')[0]?.trim();
    const nuance = text.split('[NUANCE]')[1]?.split('[KANJI]')[0]?.trim();
    const kanjiAnalysis = text.split('[KANJI]')[1]?.trim();

    // Hàm để chuyển đổi các câu ví dụ thành HTML list
    const formatSentences = (data) => {
        if (!data) return '<p>Không có dữ liệu.</p>';
        return '<ul>' + data.split(/\d+\.\s/).filter(s => s.trim()).map(s =>
            `<li class="mb-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p class="jp-font text-lg">${s.split('-')[0].trim()}</p>
                <p class="text-sm text-gray-600 dark:text-gray-400">${s.split('-')[1]?.trim() || ''}</p>
            </li>`
        ).join('') + '</ul>';
    };

    return `
        <div class="space-y-6">
            <div>
                <h4 class="font-bold text-lg mb-2 text-blue-600 dark:text-blue-400">例文 (Câu ví dụ)</h4>
                ${formatSentences(sakubun)}
            </div>
            <div>
                <h4 class="font-bold text-lg mb-2 text-green-600 dark:text-green-400">ニュアンス (Sắc thái)</h4>
                <p class="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">${nuance || 'Không có dữ liệu.'}</p>
            </div>
            ${kanjiAnalysis ? `
            <div>
                <h4 class="font-bold text-lg mb-2 text-purple-600 dark:text-purple-400">漢字分析 (Phân tích Kanji)</h4>
                <div class="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg whitespace-pre-wrap">${kanjiAnalysis}</div>
            </div>
            ` : ''}
        </div>
    `;
}

// Gán hàm chính vào window để các file khác có thể gọi
window.analyzeWordWithAI = analyzeWordWithAI;
