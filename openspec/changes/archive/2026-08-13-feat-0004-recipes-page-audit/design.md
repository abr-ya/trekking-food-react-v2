## Context

The `/recipes` screen is implemented but not yet represented by an accepted `recipes` spec. The current screen is a protected two-column page: `RecipesList` on the left, `CreateRecipeForm` plus a recipe category creation entry point on the right. List data flows through `src/hooks/use-recipes.ts` and `src/api/recipes.ts`; create flows through React Hook Form, Zod schemas, `useCreateRecipe`, and TanStack Query invalidation.

This change is mostly a backfill/audit. The only expected runtime change is localizing the Recipes page title to match the already accepted top-menu and Products title i18n pattern.

## Goals / Non-Goals

**Goals:**

- Capture the authenticated `/recipes` page behavior in a new `recipes` delta spec.
- Preserve existing API/hook/component boundaries: API normalization in `src/api/*`, query/mutation wrappers in `src/hooks/*`, components consuming hooks only.
- Extend page title i18n with `pages.recipes.title` using the existing `src/i18n/resources.ts` pattern and test style.
- Archive only directly represented Recipes list pagination docs after their behavior is covered by OpenSpec.
- Keep this screen-level slice as the dependency for a later `/recipes/:id` detail audit.

**Non-Goals:**

- No detail-page implementation or spec backfill beyond list-card navigation to `/recipes/:id`.
- No recipe edit, category edit, ingredient edit/delete, or recipe delete behavior changes.
- No broad localization for list cards, forms, dialogs, loading/error copy, or category UI.
- No backend/API changes and no new package installs.

## Decisions

1. Keep the Recipes screen layout as-is.

   The implementation should preserve `ProtectedPage`, `ColumnsWrapper`, `PageColumn`, `RecipesList`, `CreateRecipeForm`, and `CategoryDialog` composition. A larger layout rewrite would obscure the backfill goal and create avoidable UI risk.

2. Use existing i18n resources for the page title only.

   The Products title already uses `useTranslation()` and `pages.products.title`. Recipes should follow that path with `pages.recipes.title` and an expanded page title key type/test. This avoids introducing a new localization abstraction and keeps the scope intentionally narrow.

3. Treat list pagination behavior as already implemented and document it from code.

   `RecipesList` already owns page state, uses `RECIPES_PAGE_SIZE = 20`, requests `useRecipes({ page, limit })`, renders initial skeletons, uses `isFetching && !isLoading` for an overlay, and delegates multi-page navigation to `Pagination`. The spec should describe this current behavior rather than require a different implementation.

4. Preserve API normalization and cache invalidation.

   `src/api/recipes.ts` normalizes snake_case fields such as `category_id`, `is_common`, `user_id`, `created_at`, and `updated_at` into camelCase client types. `useCreateRecipe` invalidates `recipeQueryKeys.all`, which refreshes both list and detail queries; no new query key shape is needed.

5. Archive only directly processed Recipes list docs.

   `docs/recipes-list-pagination-plan.md` and `docs/recipes-list-pagination-implementation-report.md` are directly represented by this screen spec and can move to `docs/archive/`. Recipe detail docs such as `edit-recipe-metadata-*` are out of scope and should remain active until the detail audit.

## Risks / Trade-offs

- [Risk] Expanding localization beyond the page title would turn this into a broad i18n slice. -> Mitigation: Keep only `pages.recipes.title` in this change and leave list/form/dialog copy for later rows.
- [Risk] Old docs mention implementation details that drifted from code, such as the list height value. -> Mitigation: Spec from current code behavior and archive the docs as processed historical inputs, not as authoritative implementation truth.
- [Risk] The `recipes` capability also includes detail-page behavior in the capability map. -> Mitigation: This change covers only `/recipes`; the follow-up `recipe-detail-page-audit` remains in the backlog and depends on this slice.
