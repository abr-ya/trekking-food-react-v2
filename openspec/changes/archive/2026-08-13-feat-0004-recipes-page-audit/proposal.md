## Why

The Recipes screen is already implemented, but the `recipes` capability does not yet have an accepted OpenSpec contract. Backfilling the `/recipes` screen now keeps the screen-by-screen migration moving after Products, documents the current list/create/category behavior, and gives later recipe detail work a clean dependency.

## What Changes

- Create a `recipes` capability specification for the authenticated `/recipes` screen.
- Capture the current Recipes page composition: protected page shell, Recipes list column, Create recipe column, recipe category creation entry point, and navigation from recipe cards to detail pages.
- Capture list behavior: `GET /recipes` through the hook/API layer, fixed page size, server-backed pagination metadata, initial loading skeletons, background fetch overlay, error state, empty catalog state, and page-empty state.
- Capture create behavior: validated recipe creation with name, description, category, ingredients, quantities, `isCommon`, product/category loading and error states, mutation invalidation, and form reset after successful creation.
- Capture the recipe action permission boundary visible on the list screen: list cards link to recipe detail for viewing/editing, while metadata/category/ingredient edits remain part of the separate recipe detail screen.
- Move directly processed Recipes list pagination docs to `docs/archive/` after the behavior is represented in OpenSpec.
- Add the Recipes page title to the current i18n surface as the only localization change in this slice.

## Non-goals

- No implementation for the separate `/recipes/:id` detail screen beyond documenting that recipe cards navigate there.
- No recipe metadata, category, ingredient edit, or delete behavior changes in this slice.
- No broad Recipes screen localization beyond the page title; list/form/dialog string localization should remain separate follow-up work.
- No product list, hiking food-plan, packing, or shopping-list behavior changes.
- No backend/API contract changes and no new dependencies.

## Capabilities

### New Capabilities

- `recipes`: Recipe catalog screen behavior for listing recipes, creating recipes, creating recipe categories from the Recipes page, and navigating from list cards to recipe details.

### Modified Capabilities

- `i18n`: Extend the accepted localization surface from top menu plus Products title to also include the Recipes page title.

## Impact

- Change name: `feat-0004-recipes-page-audit`.
- Capability touched: `recipes`; related existing capability touched: `i18n`.
- Affected code during implementation is expected to be limited to `/recipes` page title i18n, i18n resources/tests, OpenSpec files, capability map/backlog bookkeeping, and archiving directly represented Recipes pagination docs.
- Existing frontend API calls are reused: `GET /recipes`, `POST /recipes`, `GET /recipe-categories`, `POST /recipe-categories`, and product lookup for recipe ingredients.
- Backend/API changes: none.
- Dependencies: none.
