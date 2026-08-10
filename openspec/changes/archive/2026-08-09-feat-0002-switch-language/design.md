## Context

The top menu is config-driven through `MAIN_NAV`
(`src/config/nav/main-nav.ts`) and rendered by `TopMenu`
(`src/components/layout/top-menu.tsx`). The previous navigation slice made route
paths consistent, preserved anonymous menu visibility, kept `Admin` gated by
`requiresAppAdmin`, and added active-link styling via `NavLink`.

Current menu labels are literal English strings:

| Current label | Path |
|---------------|------|
| Home | `/` |
| Products | `/products` |
| Recipes | `/recipes` |
| Categories | `/categories` |
| Hikings | `/hikings` |
| About | `/about` |
| Admin | `/admin` |

## Goals / Non-Goals

**Goals:**
- Add a production-ready i18n foundation using `i18next` and `react-i18next`.
- Support `en` and `ru`, with `en` as default and fallback.
- Persist the selected language in `localStorage`.
- Localize only top-menu labels in this feature.
- Add a small language switcher in the top header.

**Non-Goals:**
- Whole-app string extraction.
- Localizing forms, validation, API errors, toasts, page content, or admin UI.
- Backend/API changes.
- Header/menu redesign.

## Decisions

- **Use `react-i18next`.** The first slice is narrow, but the library gives the
  app a stable path for future namespaces and richer translation behavior.
- **Use translation keys in nav config.** `MAIN_NAV` should expose a stable label
  key (for example `nav.home`) instead of treating English text as the domain
  value. Routes and admin gating remain unchanged.
- **Keep language state in i18next.** The switcher calls the i18n language-change
  API; persistence is handled with a small app-owned localStorage bridge.
- **Use `en` fallback.** If a key is missing or the saved locale is unsupported,
  the UI falls back to English.
- **Keep all existing access behavior.** Menu visibility remains public for
  non-admin items; `Admin` remains app-admin-only; active route matching remains
  unchanged.

## Expected Structure

- `src/i18n/index.ts`: initializes i18next for the app.
- `src/i18n/resources.ts`: typed `en` / `ru` resources for the first namespace or
  default resource bundle.
- `src/i18n/locales.ts`: supported locale metadata and localStorage key.
- `src/components/layout/language-switcher.tsx`: compact header control.
- `src/config/nav/main-nav.ts`: replace `label` with `labelKey` or equivalent.

Exact file names may follow local patterns discovered during implementation, but
the boundary stays the same: infrastructure plus top menu only.

## Risks / Trade-offs

- **New dependency:** `i18next` / `react-i18next` must be installed by the user
  before implementation can pass typecheck.
- **Scope creep:** once i18n exists, it will be tempting to translate nearby
  header/auth/theme strings. This change intentionally stops at the top menu.
- **Saved unsupported locale:** old or manually edited localStorage values should
  not break rendering; fall back to `en`.

## Open Questions

- None. Decisions confirmed: `react-i18next`, `en`/`ru`, default/fallback `en`,
  persisted locale, and only top-menu localization in this feature.
