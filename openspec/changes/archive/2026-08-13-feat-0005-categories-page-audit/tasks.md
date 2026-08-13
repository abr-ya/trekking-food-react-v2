## 1. Categories Page Title I18n

- [x] 1.1 Add `pages.categories.title` English and Russian resource entries and update the exported page-title key type.
- [x] 1.2 Update `CategoriesPage` to render its `ProtectedPage` title through `useTranslation()`.
- [x] 1.3 Extend the i18n resource test to assert English and Russian Categories page title labels.

## 2. Screen Backfill Verification

- [x] 2.1 Confirm the current `/categories` page, protected shell, two-column layout, create buttons, category lists, cards, edit dialog, and delete dialog satisfy the Categories delta spec without a table/pagination rewrite.
- [x] 2.2 Confirm product category list behavior uses the product categories hook/API layer and represents loading, error, empty, and card-count states.
- [x] 2.3 Confirm recipe category list behavior uses the recipe categories hook/API layer and represents loading, error, empty, and card-count states.
- [x] 2.4 Confirm category create, edit, and delete mutations keep component access through hooks and preserve current query invalidation behavior.
- [x] 2.5 Confirm the visible permission boundary remains anonymous page blocking plus authenticated category action controls, with backend responses handling final mutation authorization.
- [x] 2.6 Review `docs/` for directly related Categories source docs and move only fully represented docs to `docs/archive/`; leave authoritative and unrelated docs active.

## 3. Follow-Up Backlog

- [x] 3.1 Add follow-up backlog rows for Categories list/column localization, action-label localization, and dialog/form localization.
- [x] 3.2 Keep `categories-table-pagination` in the backlog as not ready until backend pagination support is clarified.

## 4. OpenSpec Bookkeeping

- [x] 4.1 Update `openspec/CAPABILITIES.md` so `categories` remains implemented and its spec status reflects this change's synced spec plan.
- [x] 4.2 Keep `openspec/BACKLOG.md` aligned with `feat-0005-categories-page-audit` as build `0005` until archive.
- [x] 4.3 Before archive, sync the Categories and i18n delta specs into accepted specs under `openspec/specs/`.

## 5. Verification

- [x] 5.1 Run `openspec status --change feat-0005-categories-page-audit --json` and confirm required artifacts are complete before implementation.
- [x] 5.2 Run `openspec validate --changes --strict` and `openspec validate --specs --strict` after implementation/spec sync.
- [x] 5.3 Run `npm run tsc && npm run lint && npm run test`.
