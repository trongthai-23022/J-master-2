// Structured Logging for UI Events
function logEvent(event, details = {}) {
    const logEntry = {
        timestamp: new Date().toISOString(),
        event,
        details
    };
    // Lưu log vào localStorage hoặc gửi lên server nếu có
    let logs = JSON.parse(localStorage.getItem('jMasterLogs') || '[]');
    logs.push(logEntry);
    localStorage.setItem('jMasterLogs', JSON.stringify(logs));
    // Có thể mở rộng: hiển thị log trên UI, xuất file log
    showLogOnUI(logEntry);
}
window.logEvent = logEvent;
// Hiển thị log trên UI
function showLogOnUI(logEntry) {
    const area = document.getElementById('stats-area');
    if (!area) return;
    const div = document.createElement('div');
    div.className = 'text-xs text-gray-500';
    div.textContent = `[${logEntry.timestamp}] ${logEntry.event}`;
    area.appendChild(div);
}

// Xuất file log
function exportLogs() {
    const logs = localStorage.getItem('jMasterLogs') || '[]';
    const blob = new Blob([logs], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'logs.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
window.exportLogs = exportLogs;

// Ví dụ sử dụng:
// logEvent('add_word', {word: '新しい', list: 'N2'});
