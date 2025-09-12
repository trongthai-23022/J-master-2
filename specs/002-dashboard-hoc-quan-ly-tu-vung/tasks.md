# Tasks: Dashboard, học, quản lý từ vựng, đồng bộ, chia sẻ, thống kê, giao diện, bảo mật, offline, âm thanh, mini-game

**Input**: Design documents from `/specs/002-dashboard-hoc-quan-ly-tu-vung/`
**Prerequisites**: plan.md (required), research.md, data-model.md, contracts/

## Execution Flow (main)
```
1. Load plan.md from feature directory
2. Load optional design documents: data-model.md, contracts/, research.md
3. Generate tasks by category: Setup, Tests, Core, Integration, Polish
4. Apply task rules: [P] for parallel, sequential for same file
5. Number tasks sequentially (T001, T002...)
6. Generate dependency graph
7. Create parallel execution examples
8. Validate task completeness
9. Return: SUCCESS (tasks ready for execution)
```

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Phase 3.1: Setup
- [ ] T001 Create `src/` structure: `src/css/`, `src/js/`, `src/img/` (if not exists)
- [ ] T002 [P] Add Tailwind CSS setup to `index.html` and `src/css/`
- [ ] T003 [P] Add Web Speech API usage example to `src/js/speech.js`
- [ ] T004 [P] Add Gemini API usage example to `src/js/gemini.js`

## Phase 3.2: Tests First (TDD)
- [ ] T005 [P] Manual test checklist for UI/UX in `tests/manual-testing.md`
- [ ] T006 [P] Contract test for data import/export in `tests/contract/test_import_export.md`
- [ ] T007 [P] Contract test for local storage warning in `tests/contract/test_storage_warning.md`
- [ ] T008 [P] Integration test for offline mode in `tests/integration/test_offline.md`
- [ ] T009 [P] Integration test for multi-language UI in `tests/integration/test_multilang.md`

## Phase 3.3: Core Implementation
- [ ] T010 [P] Implement dashboard UI in `index.html`
- [ ] T011 [P] Implement vocabulary manager in `src/js/manager.js`
- [ ] T012 [P] Implement matching game in `src/js/match-game.js`
- [ ] T013 [P] Implement cloze story AI in `src/js/cloze-story.js`
- [ ] T014 [P] Implement settings modal and local storage logic in `src/js/settings.js`
- [ ] T015 [P] Implement import/export and sync logic in `src/js/sync.js`
- [ ] T016 [P] Implement local storage warning logic in `src/js/storage-warning.js`
- [ ] T017 [P] Implement multi-language UI in `src/js/lang.js`
- [ ] T018 [P] Implement dark/light mode and theme settings in `src/js/theme.js`
- [ ] T019 [P] Implement mini-games (flashcard, quiz, writing) in `src/js/minigames.js`
- [ ] T020 [P] Implement data encryption for sensitive info in `src/js/encrypt.js`

## Phase 3.4: Integration
- [ ] T021 Integrate all modules in `index.html` and `src/js/app.js`
- [ ] T022 Add error handling and UI notifications in `src/js/app.js`
- [ ] T023 Add structured logging for UI events in `src/js/logging.js`

## Phase 3.5: Polish
- [ ] T024 [P] Write unit tests for core modules in `tests/unit/`
- [ ] T025 [P] Write performance tests for load time and offline in `tests/performance/`
- [ ] T026 [P] Update documentation in `README.md` and `specs/002-dashboard-hoc-quan-ly-tu-vung/quickstart.md`
- [ ] T027 [P] Manual regression test and checklist in `tests/manual-testing.md`

## Dependencies
- Setup (T001-T004) before Tests (T005-T009)
- Tests before Core Implementation (T010-T020)
- Core Implementation before Integration (T021-T023)
- Integration before Polish (T024-T027)

## Parallel Example
```
# Launch T002-T004 together:
Task: "Add Tailwind CSS setup to index.html and src/css/"
Task: "Add Web Speech API usage example to src/js/speech.js"
Task: "Add Gemini API usage example to src/js/gemini.js"

# Launch T005-T009 together:
Task: "Manual test checklist for UI/UX in tests/manual-testing.md"
Task: "Contract test for data import/export in tests/contract/test_import_export.md"
Task: "Contract test for local storage warning in tests/contract/test_storage_warning.md"
Task: "Integration test for offline mode in tests/integration/test_offline.md"
Task: "Integration test for multi-language UI in tests/integration/test_multilang.md"
```

## Notes
- [P] tasks = different files, no dependencies
- Verify tests fail before implementing
- Commit after each task
- Avoid: vague tasks, same file conflicts

## Validation Checklist
- [ ] All contracts have corresponding tests
- [ ] All entities have model tasks
- [ ] All tests come before implementation
- [ ] Parallel tasks truly independent
- [ ] Each task specifies exact file path
- [ ] No task modifies same file as another [P] task
