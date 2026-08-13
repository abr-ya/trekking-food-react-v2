## Context

The `/categories` screen is implemented but not yet represented by an accepted `categories` spec. The current screen is a protected two-column page: product categories on the left and recipe categories on the right. Each column has a create button and a card list powered by `src/hooks/use-categories.ts`, `src/api/categories.ts`, `CategoriesList`, `CategoryCard`, `CategoryDialog`, and `DeleteCategoryDialog`.

This change is mostly a backfill/audit. The only expected runtime change is localizing the Categories page title to match the already accepted Products and Recipes page-title i18n pattern.

## Goals / Non-Goals

**Goals:**

- Capture the authenticated `/categories` page behavior in a new `categories` delta spec.
- Preserve existing API/hook/component boundaries: API calls in `src/api/categories.ts`, query/mutation wrappers in `src/hooks/*`, and components consuming hooks only.
- Extend page title i18n with `pages.categories.title` using the existing `src/i18n/resources.ts` pattern and test style.
- Capture the current visible permissions: anonymous users cannot access the page; authenticated users can see category CRUD controls; backend responses remain the final authorization boundary.
- Add follow-up backlog rows for Categories screen localization slices and for possible table/pagination work after backend readiness is clarified.

**Non-Goals:**

- No table rewrite or pagination implementation for Categories lists.
- No new backend/API contract and no package installs.
- No role, owner, or admin gating changes for category create/edit/delete controls.
- No broad localization for column headings, descriptions, list messages, item-count copy, action buttons, form labels, or dialogs.
- No changes to Products, Recipes, Hikings, food planning, packing, or shopping-list behavior.

## Decisions

1. Spec the current card-list screen instead of designing the future table.

   `CategoriesPage` currently renders two `PageColumn` regions and `CategoriesList` renders `CategoryCard` entries. The API client accepts plain arrays or `{ data }` wrappers and does not model pagination metadata. The table/pagination idea is useful, but it needs a backend-readiness check first, so it belongs in a separate backlog row.

2. Use existing category API and hook boundaries.

   Product categories use `/product-categories`; recipe categories use `/recipe-categories`. Create, update, and delete actions go through `use-category-mutations.ts`, which invalidates the matching category query keys. This change should not introduce direct component API calls or new query key shapes.

3. Treat category data as already client-shaped.

   The category API layer currently normalizes response envelope shape rather than field names: it accepts an array or `{ data }` and returns `{ data: [...] }`. Category item counts come from nested `products.length` or `recipes.length`. No snake_case to camelCase conversion is expected in this slice unless the backend response changes.

4. Keep page-title i18n narrow.

   Categories should follow the existing Products and Recipes title path: `useTranslation()` in the page component, `pages.categories.title` in resources, and an i18n test assertion for English and Russian. Other Categories strings remain literal English until follow-up i18n changes.

5. Record follow-up localization by surface.

   The follow-ups should stay small: one row for list/column copy, one for action labels/buttons, and one for create/edit/delete dialogs/forms. This keeps the current audit focused and avoids turning one title change into a broad localization pass.

6. Apply the temporary docs archive flow.

   During implementation, review `docs/` for source documents directly related to the Categories screen or category CRUD behavior. Move only documents whose current behavior is represented in this change's delta spec and later accepted spec into `docs/archive/`. Keep authoritative docs such as `docs/BUSINESS_LOGIC.md` active, and leave unrelated or broader docs in place. The current scan did not find dedicated `categories-*` plan/report files, so this may be a no-op.

## Risks / Trade-offs

- [Risk] The user's desired future table/pagination shape could leak into the audit spec. -> Mitigation: Make the current card-list behavior normative for this change and track `categories-table-pagination` separately as not ready until backend support is clarified.
- [Risk] Permissions may be ambiguous because the frontend currently gates only page access. -> Mitigation: Document the visible frontend boundary and state that backend authorization responses decide whether mutations succeed.
- [Risk] Category mutation invalidation is not perfectly symmetrical between product and recipe categories. -> Mitigation: Preserve current behavior in this audit and avoid unrelated cache refactors unless implementation finds a blocking bug.
- [Risk] Broad localization would expand the slice. -> Mitigation: Limit runtime i18n to `pages.categories.title` and add explicit backlog rows for the rest.
- [Risk] General docs can be mistaken for processed screen docs. -> Mitigation: Archive only directly represented Categories source docs, if any exist, and keep authoritative or cross-capability docs active.
