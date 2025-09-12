// Web Speech API usage example: Phát âm tiếng Nhật
function speakJapanese(text) {
    if (!('speechSynthesis' in window)) {
        alert('Trình duyệt của bạn không hỗ trợ Web Speech API.');
        return;
    }
    const utter = new window.SpeechSynthesisUtterance(text);
    utter.lang = 'ja-JP';
    window.speechSynthesis.speak(utter);
}

// Ví dụ sử dụng:
// speakJapanese('こんにちは'); // Phát âm "Xin chào" bằng tiếng Nhật
