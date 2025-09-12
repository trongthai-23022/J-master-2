// Data Encryption for Sensitive Info
function encryptData(data, key) {
    // Demo: dùng base64, có thể thay bằng AES
    return btoa(unescape(encodeURIComponent(JSON.stringify(data))));
}
function decryptData(encrypted, key) {
    return JSON.parse(decodeURIComponent(escape(atob(encrypted))));
}
// ...Thêm các hàm bảo mật nâng cao nếu cần
