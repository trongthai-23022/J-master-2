// Unit test for vocabulary manager
// Kiểm tra thêm, sửa, xóa từ vựng

function runManagerTests() {
    // Mock localStorage
    let mockStorage = {};
    global.localStorage = {
        getItem: (key) => mockStorage[key] || null,
        setItem: (key, value) => { mockStorage[key] = value; },
        removeItem: (key) => { delete mockStorage[key]; }
    };
    const STORAGE_KEY = 'jMasterVocabApp';
    // Import functions
    eval(require('fs').readFileSync('src/js/manager.js', 'utf8'));

    // Test addWord
    addWord('TestList', {id: 1, kanji: '新しい', reading: 'あたらしい', meaning: 'Mới'});
    let lists = getWordLists();
    console.assert(lists['TestList'].length === 1, 'addWord failed');

    // Test editWord
    addWord('TestList', {id: 2, kanji: '古い', reading: 'ふるい', meaning: 'Cũ'});
    editWord('TestList', 2, {id: 2, kanji: '古い', reading: 'ふるい', meaning: 'Cũ (đã sửa)'});
    lists = getWordLists();
    console.assert(lists['TestList'][1].meaning === 'Cũ (đã sửa)', 'editWord failed');

    // Test deleteWord
    deleteWord('TestList', 1);
    lists = getWordLists();
    console.assert(lists['TestList'].length === 1 && lists['TestList'][0].id === 2, 'deleteWord failed');

    // Test deleteList
    deleteList('TestList');
    lists = getWordLists();
    console.assert(!lists['TestList'], 'deleteList failed');

    console.log('All manager.js unit tests passed!');
}

runManagerTests();
