// Web Speech API usage example: Phát âm tiếng Nhật
function speakText(text, lang = 'ja-JP') {
    if (!('speechSynthesis' in window)) {
        if (!window.speechApiNotified) {
            window.showToast('Trình duyệt không hỗ trợ phát âm.', 'error');
            window.speechApiNotified = true;
        }
        return;
    }
    const utter = new window.SpeechSynthesisUtterance(text);
    utter.lang = lang;
    window.speechSynthesis.speak(utter);
}

window.speakText = speakText;

// Ví dụ sử dụng:
// speakText('こんにちは'); // Phát âm "Xin chào" bằng tiếng Nhật
// speakText('Hello', 'en-US'); // Phát âm "Hello" bằng tiếng Anh
