## 1. Products Spec Alignment

- [x] 1.1 Review the current `/products` implementation against the new Products spec and keep the spec/code boundary focused on the existing screen.
- [x] 1.2 Update `openspec/CAPABILITIES.md` so `products` points to an accepted spec after this change is synced.

## 2. Products Page Title Localization

- [x] 2.1 Add Products page title translations for English and Russian using the existing i18n resources pattern.
- [x] 2.2 Render the Products page title from i18n in `ProductsPage` while preserving protected-page behavior.
- [x] 2.3 Add or update focused i18n tests so the new Products page title keys are covered without expanding the scope to other screen strings.

## 3. Product Action Permissions

- [x] 3.1 Add a small ownership check for Products list item actions using the authenticated user ID, `product.userId`, and `product.isCommon`.
- [x] 3.2 Hide edit, category-edit, and delete controls for shared products, non-owned personal products, and products with unknown ownership.
- [x] 3.3 Preserve existing product create/update/delete hooks, API normalization, and query invalidation behavior.

## 4. Follow-up Planning

- [x] 4.1 Add backlog idea rows for localizing the Products list/table/card surface, including filters/search/pagination/list states.
- [x] 4.2 Add backlog idea rows for localizing the Products create form and category-loading states.
- [x] 4.3 Add backlog idea rows for localizing Products edit/delete/category-edit dialogs.

## 5. Docs Archive

- [x] 5.1 Create `docs/archive/` if it does not exist.
- [x] 5.2 Move `docs/products-list-pagination-plan.md` and `docs/products-list-pagination-implementation-report.md` to `docs/archive/` after confirming their behavior is represented in the Products spec.
- [x] 5.3 Leave unrelated `docs/` plans and reports in place.

## 6. Verification

- [x] 6.1 Run `openspec status --change feat-0003-products-page-audit` and confirm all planning artifacts are present.
- [x] 6.2 Run `npm run tsc && npm run lint && npm run test`.
