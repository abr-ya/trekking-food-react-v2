## Why

The Categories screen is implemented, but the `categories` capability does not yet have an accepted OpenSpec contract. Backfilling `/categories` now continues the screen-by-screen migration after Products and Recipes, documents the current category CRUD surface, and gives later Categories localization work a clean dependency.

## What Changes

- Create a `categories` capability specification for the authenticated `/categories` screen.
- Capture the current Categories page composition: protected page shell, product categories column, recipe categories column, create buttons for each category kind, card-based category lists, and shared create/edit dialog behavior.
- Capture list behavior for product and recipe categories: data loading through hooks/API clients, loading skeletons, error state, empty state, category item counts, and separate product/recipe category endpoints.
- Capture category activities: create, edit name, delete with confirmation, mutation pending states, and query invalidation after successful mutations.
- Capture the visible permission boundary: anonymous users cannot access the page; authenticated users can see and invoke category create/edit/delete controls, with final authorization enforced by the backend response.
- Review directly related `docs/` sources and archive only documents whose current Categories behavior is fully represented by OpenSpec.
- Add the Categories page title to the current i18n surface as the only localization change in this slice.
- Add follow-up backlog items for localizing the rest of the Categories screen and for a possible table/pagination redesign after backend readiness is clarified.

## Non-goals

- No redesign from the current card lists to tables.
- No pagination support for categories in this slice.
- No broad Categories screen localization beyond the page title.
- No permission model changes, role gating changes, or new owner/admin rules for category actions.
- No product, recipe, hiking, packing, or shopping-list behavior changes.
- No backend/API contract changes and no new dependencies.

## Capabilities

### New Capabilities

- `categories`: Product and recipe category screen behavior for listing, creating, editing, and deleting categories from `/categories`.

### Modified Capabilities

- `i18n`: Extend the accepted localization surface from top menu plus selected page titles to also include the Categories page title.

## Impact

- Change name: `feat-0005-categories-page-audit`.
- Capability touched: `categories`; related existing capability touched: `i18n`.
- Affected code during implementation is expected to be limited to `/categories` page title i18n, i18n resources/tests, OpenSpec files, capability map/backlog bookkeeping, directly represented docs archive moves if any exist, and follow-up backlog rows.
- Existing frontend API calls are reused: `GET/POST/PATCH/DELETE /product-categories` and `GET/POST/PATCH/DELETE /recipe-categories`.
- Backend/API changes: none for this audit. A separate `categories-table-pagination` follow-up must first clarify whether the backend supports paginated category list responses.
- Dependencies: none.
