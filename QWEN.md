## Qwen Added Memories
- При использовании селекта внутри Radix Dialog всегда использовать RHFStaticSelect (react-select с menuPortalTarget={document.body}), НЕ RHFSelect (Combobox). Combobox рендерится через Portal вне Dialog и при выборе элемента закрывает диалог из-за focus-trap/interact-outside логики Radix.
