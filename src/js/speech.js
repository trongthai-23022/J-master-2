// Web Speech API usage example: Phát âm tiếng Nhật
function speakJapanese(text, lang = 'ja') {
    if (!('speechSynthesis' in window)) {
        if (!window.speechApiNotified) {
            window.showToast('Trình duyệt không hỗ trợ phát âm.', 'error');
            window.speechApiNotified = true;
        }
        return;
    }
    const utter = new window.SpeechSynthesisUtterance(text);
    utter.lang = lang === 'en' ? 'en-US' : 'ja-JP';
    window.speechSynthesis.speak(utter);
}

// Ví dụ sử dụng:
// speakJapanese('こんにちは'); // Phát âm "Xin chào" bằng tiếng Nhật
// speakJapanese('Hello', 'en'); // Phát âm "Hello" bằng tiếng Anh
