// src/js/encrypt.js

// Data Encryption for Sensitive Info
function encryptData(data) {
    // Demo: dùng base64, có thể thay bằng AES
    // Mã hóa một chuỗi đơn giản, không cần JSON.stringify
    return btoa(unescape(encodeURIComponent(data)));
}

function decryptData(encrypted) {
    // Giải mã một chuỗi đơn giản
    return decodeURIComponent(escape(atob(encrypted)));
}

// MỚI: Gán các hàm vào window để các tệp khác có thể gọi
window.encryptData = encryptData;
window.decryptData = decryptData;