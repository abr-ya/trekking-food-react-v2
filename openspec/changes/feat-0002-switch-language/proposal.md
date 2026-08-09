## Why

The app currently renders all top-menu labels as hardcoded English strings. We
want to introduce UI language switching in a small, controlled way: establish the
i18n foundation and localize only the top navigation menu first. This gives the
project a durable direction for future localization without turning this slice
into a whole-app translation pass.

Capability touched: `i18n` (see `openspec/CAPABILITIES.md`).

- **Decision: use `react-i18next` + `i18next`.** This is a better long-term fit
  than a custom helper because the app is expected to grow beyond a single menu:
  namespaces, interpolation, fallback language behavior, and later pluralization
  can be added without rewriting the foundation.
- **Decision: localize only the top menu in this feature.** The localization
  infrastructure may be added, but the only user-facing strings moved to
  translation resources are the main top-menu labels.
- **Decision: support `en` and `ru`.** English is the default and fallback
  language because the current UI is already English.
- **Decision: persist the selected language in `localStorage`.** The selected
  locale should survive reloads in the same browser.

## Capabilities

### New Capabilities
- `i18n`: Defines the UI language switcher and translation foundation for
  user-facing interface strings. In this first slice, the only localized surface
  is the top navigation menu.

### Modified Capabilities
<!-- None: no existing i18n spec yet in openspec/specs/. -->

## Impact

- Dependencies: requires `i18next` and `react-i18next`.
- Code: expected additions around `src/i18n/*` or equivalent provider setup,
  top-menu label translation keys, and a compact language switcher in the header.
- `src/config/nav/main-nav.ts`: menu entries should stop carrying display text as
  the source of truth and instead carry stable translation keys.
- `src/components/layout/top-menu.tsx`: render translated labels through the i18n
  hook while preserving the existing route/admin/active-link behavior.
- `src/components/layout/header.tsx`: add the language switcher near existing
  header controls.
- Tests: cover supported locales, fallback/default language behavior, and that
  top-menu labels render in the selected language.
- No backend/API changes (frontend-only repo).

## Non-goals

- Localizing pages, forms, dialogs, validation messages, API errors, toasts,
  admin screens, docs, or markdown content.
- Translating data that comes from the backend.
- Adding automatic browser-language detection beyond persisted choice and
  default/fallback behavior.
- Redesigning the header, changing top-menu visibility rules, or changing route
  access control.
