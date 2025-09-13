
/**
 * Yêu cầu AI tạo một bộ câu hỏi trắc nghiệm ngữ cảnh.
 * @param {string} apiKey 
 * @param {Array} vocabList - Danh sách từ vựng [{kanji, reading, meaning}]
 * @returns {Promise<Array|null>} - Mảng các object câu hỏi hoặc null nếu lỗi.
 */
export async function generateContextualQuiz(apiKey, vocabList) {
    const wordSelection = window.shuffle([...vocabList]).slice(0, Math.min(10, vocabList.length));
    const wordListString = wordSelection.map(w => `${w.kanji} (${w.meaning})`).join(', ');

    const prompt = `
    Bạn là một người tạo câu hỏi trắc nghiệm tiếng Nhật thông minh.
    Dựa vào danh sách từ vựng sau đây: ${wordListString}.
    Hãy tạo ra ${Math.min(5, wordSelection.length)} câu hỏi trắc nghiệm. Mỗi câu hỏi phải:
    1.  Mô tả một tình huống (context) ngắn gọn bằng tiếng Việt.
    2.  Đặt một câu hỏi (question) bằng tiếng Việt yêu cầu chọn từ tiếng Nhật phù hợp nhất.
    3.  Cung cấp 4 lựa chọn (options), trong đó có 1 đáp án đúng (answer) lấy từ danh sách từ vựng, và 3 lựa chọn sai cũng lấy từ danh sách đó.
    4.  Chỉ định rõ đáp án đúng.

    TRẢ VỀ KẾT QUẢ DƯỚỚI DẠNG MỘT CHUỖI JSON STRINGIFY CỦA MỘT MẢNG (ARRAY) DUY NHẤT, KHÔNG GIẢI THÍCH GÌ THÊM.
    Mỗi phần tử trong mảng phải là một object có cấu trúc:
    {
        "context": "tình huống bằng tiếng Việt",
        "question": "câu hỏi bằng tiếng Việt",
        "options": ["lựa chọn 1", "lựa chọn 2", "lựa chọn 3", "lựa chọn 4"],
        "answer": "đáp án đúng"
    }
    `;

    const jsonString = await callGeminiAPI(apiKey, prompt);
    if (!jsonString) return null;

    try {
        const cleanedString = jsonString.replace(/^```json\s*|```$/g, '');
        return JSON.parse(cleanedString);
    } catch (error) {
        console.error("Lỗi parse JSON từ AI:", error, "Dữ liệu gốc:", jsonString);
        window.showToast('AI trả về dữ liệu không hợp lệ.', 'error');
        return null;
    }
}

/**
 * Hàm gọi API Google Gemini đa dụng.
 * @param {string} apiKey - Khóa API của người dùng.
 * @param {string} prompt - Câu lệnh (prompt) để gửi đến AI.
 * @returns {Promise<string|null>} - Trả về văn bản kết quả, hoặc null nếu có lỗi.
 */
export async function callGeminiAPI(apiKey, prompt) {
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });

        if (!response.ok) {
            const errorBody = await response.text();
            console.error('Gemini API Error:', response.status, errorBody);
            window.showToast(`Lỗi API: ${response.status}. Chi tiết trong console.`, 'error');
            return null;
        }

        const result = await response.json();
        const text = result.candidates[0]?.content?.parts[0]?.text;
        return text;

    } catch (error) {
        console.error('Lỗi khi gọi Gemini API:', error);
        window.showToast('Không thể kết nối đến AI. Vui lòng kiểm tra mạng.', 'error');
        return null;
    }
}

/**
 * Wrapper cho tính năng tạo truyện.
 * @param {string} apiKey 
 * @param {Array} vocabList 
 * @returns {Promise<string|null>}
 */
export async function generateClozeStory(apiKey, vocabList) {
    const wordListString = vocabList.map(w => `${w.kanji} (${w.reading})`).join(', ');
    const prompt = `You are a Japanese language tutor creating a learning exercise. 1. Write a very short, simple story (3-4 sentences) in natural-sounding Japanese. 2. The story MUST include ALL of the following words: ${wordListString}. 3. After the story, create a "fill-in-the-blank" version. In this version, replace ONLY the target words with the placeholder [____]. 4. Finally, provide a Vietnamese translation of the complete story. 5. Format your entire response EXACTLY like this, with these specific headings: [STORY_CLOZE] (Your cloze story here) [STORY_FULL] (Your full, complete Japanese story here) [STORY_TRANSLATION] (Your Vietnamese translation here)`;
    
    return await callGeminiAPI(apiKey, prompt);
}
