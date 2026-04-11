## Qwen Added Memories
- При использовании селекта внутри Radix Dialog всегда использовать RHFStaticSelect (react-select с menuPortalTarget={document.body}), НЕ RHFSelect (Combobox). Combobox рендерится через Portal вне Dialog и при выборе элемента закрывает диалог из-за focus-trap/interact-outside логики Radix.
- Toast-сообщения при успехе мутаций (create/update/delete) нужно реализовать централизованно для всего приложения — это отдельная задача, которую пользователь поставит позже.
- Файлы с планами фич в папке docs/ должны именоваться по паттерну: `FEATURE_<NAME>_<LANG>.md` (например `FEATURE_DAY_COMMENTS_API_EN.md`, `FEATURE_PACKS_BY_USERS_RU.md`). IMPLEMENTATION_* — для отчётов о завершённой реализации, FIX_* — для фиксов.
- Для проверки типов использовать `npm run tsc`. При `npm run build` TypeScript проверка выполняется автоматически.
