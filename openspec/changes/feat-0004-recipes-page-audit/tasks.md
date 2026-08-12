## 1. Recipes Page Title I18n

- [ ] 1.1 Add `pages.recipes.title` English and Russian resource entries and update the exported page-title key type.
- [ ] 1.2 Update `RecipesPage` to render its `ProtectedPage` title through `useTranslation()`.
- [ ] 1.3 Extend the i18n resource test to assert English and Russian Recipes page title labels.

## 2. Screen Backfill And Docs Hygiene

- [ ] 2.1 Confirm the current `/recipes` page, list, card, create form, and recipe category entry point satisfy the Recipes delta spec without broad UI rewrites.
- [ ] 2.2 Move `docs/recipes-list-pagination-plan.md` and `docs/recipes-list-pagination-implementation-report.md` to `docs/archive/`.
- [ ] 2.3 Leave recipe detail docs active for the later `recipe-detail-page-audit` change.

## 3. OpenSpec Bookkeeping

- [ ] 3.1 Update `openspec/CAPABILITIES.md` so `recipes` remains implemented and its spec status reflects this change's synced spec plan.
- [ ] 3.2 Keep `openspec/BACKLOG.md` aligned with `feat-0004-recipes-page-audit` as build `0004` until archive.
- [ ] 3.3 Before archive, sync the Recipes and i18n delta specs into accepted specs under `openspec/specs/`.

## 4. Verification

- [ ] 4.1 Run `openspec status --change feat-0004-recipes-page-audit --json` and confirm required artifacts are complete before implementation.
- [ ] 4.2 Run `openspec validate --changes --strict` and `openspec validate --specs --strict` after implementation/spec sync.
- [ ] 4.3 Run `npm run tsc && npm run lint && npm run test`.
