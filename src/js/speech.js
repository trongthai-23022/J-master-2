// Web Speech API usage example: Phát âm tiếng Nhật
function speakJapanese(text) {
    if (!('speechSynthesis' in window)) {
        if (!window.speechApiNotified) {
            window.showToast('Trình duyệt không hỗ trợ phát âm.', 'error');
            window.speechApiNotified = true;
        }
        return;
    }
    const utter = new window.SpeechSynthesisUtterance(text);
    utter.lang = 'ja-JP';
    window.speechSynthesis.speak(utter);
}

// Ví dụ sử dụng:
// speakJapanese('こんにちは'); // Phát âm "Xin chào" bằng tiếng Nhật
