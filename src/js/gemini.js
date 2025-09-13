window.generateClozeStory = generateClozeStory;
// Gemini API usage example: Gọi AI tạo truyện chêm
async function generateClozeStory(apiKey, vocabList) {
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
    const wordListString = vocabList.map(w => `${w.kanji} (${w.reading})`).join(', ');
    const systemPrompt = `You are a Japanese language tutor creating a learning exercise. 1. Write a very short, simple story (3-4 sentences) in natural-sounding Japanese. 2. The story MUST include ALL of the following words: ${wordListString}. 3. After the story, create a "fill-in-the-blank" version. In this version, replace ONLY the target words with the placeholder [____]. 4. Finally, provide a Vietnamese translation of the complete story. 5. Format your entire response EXACTLY like this, with these specific headings: [STORY_CLOZE] (Your cloze story here) [STORY_FULL] (Your full, complete Japanese story here) [STORY_TRANSLATION] (Your Vietnamese translation here)`;
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: systemPrompt }] }] })
        });
        if (!response.ok) throw new Error(`API Error: ${response.status} ${await response.text()}`);
        const result = await response.json();
        // Trích xuất kết quả
        const text = result.candidates[0].content.parts[0].text;
        return text;
    } catch (error) {
        console.error('Gemini API error:', error);
        return null;
    }
}

// Ví dụ sử dụng:
// const apiKey = 'YOUR_API_KEY';
// const vocabList = [{kanji: '新しい', reading: 'あたらしい'}];
// generateClozeStory(apiKey, vocabList).then(console.log);
