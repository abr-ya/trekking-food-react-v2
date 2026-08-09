# Tasks

Scope confirmed: this feature localizes only the top navigation menu. i18n
infrastructure may be added to support that, but no other UI strings should be
migrated in this slice.

## 1. Dependencies

- [ ] 1.1 Ask the user to install runtime dependencies: `npm i i18next react-i18next`.
- [ ] 1.2 Verify the dependencies are present before implementation.

## 2. i18n foundation

- [ ] 2.1 Add supported locale metadata for `en` and `ru`, with `en` as default/fallback.
- [ ] 2.2 Add translation resources for top-menu labels only.
- [ ] 2.3 Initialize `i18next` / `react-i18next` during app startup.
- [ ] 2.4 Persist selected language in `localStorage` and ignore unsupported saved values.

## 3. Top menu localization

- [ ] 3.1 Replace hardcoded top-menu label strings in nav config with stable translation keys.
- [ ] 3.2 Render top-menu labels through `react-i18next`.
- [ ] 3.3 Preserve existing top-menu behavior: route paths, active link styling, anonymous visibility, and admin-only gating.

## 4. Language switcher

- [ ] 4.1 Add a compact language switcher to the header next to existing controls.
- [ ] 4.2 Ensure switching language updates the top-menu labels without a page reload.
- [ ] 4.3 Keep the switcher limited to `en` / `ru`.

## 5. Documentation / capability map

- [ ] 5.1 Update `openspec/CAPABILITIES.md` for `i18n` after implementation.
- [ ] 5.2 Do not mark unrelated app surfaces as localized.

## 6. Verification

- [ ] 6.1 Add/adjust Vitest coverage for top-menu labels in `en` and `ru`.
- [ ] 6.2 Verify unsupported persisted locale falls back to `en`.
- [ ] 6.3 Run `npm run tsc && npm run lint && npm run test`.
- [ ] 6.4 Manual check: language switch updates only top-menu labels; other app text remains unchanged.
