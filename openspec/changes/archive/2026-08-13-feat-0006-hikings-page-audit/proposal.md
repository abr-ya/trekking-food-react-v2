## Why

The Hikings screen is implemented, but the `hikings` capability does not yet
have an accepted OpenSpec contract. Backfilling `/hikings` now continues the
screen-by-screen migration after Products, Recipes, and Categories, documents
the current list/create surface, and gives later hiking detail tab audits a
clean boundary.

## What Changes

- Create a `hikings` capability specification for the authenticated `/hikings`
  screen.
- Capture the current page composition: protected page shell, Hikings list
  column, Create hiking column, list cards, and navigation from a hiking card to
  `/hikings/:id`.
- Capture list behavior: `GET /hikings` through the API/hook layer, loading,
  error, empty, card rendering, and pagination metadata copy when the API
  provides list metadata.
- Capture create behavior: validated hiking creation with name, days total,
  members total, vegetarians total, mutation invalidation, and form reset after
  successful creation.
- Document that recipe planning actions are not on `/hikings`; recipe/product
  distribution belongs to the separate `/hikings/:id` detail experience.
- Review directly related `docs/` files and move only docs whose behavior is
  represented by this `/hikings` screen spec to `docs/archive/` after accepted
  spec sync.
- Add the Hikings page title to the current i18n surface as the only runtime
  localization change in this slice.
- Add follow-up backlog rows for `/hikings/:id` detail tab audits and narrower
  localization slices for the list/card surface and create form.

## Non-goals

- No implementation or full audit for `/hikings/:id`; detail tabs will be
  planned separately.
- No food-plan, recipe distribution, shopping-list, packing, members-total edit,
  admins, or day-comment behavior changes in this slice.
- No redesign from card list to table and no new pagination controls unless the
  current screen already provides them.
- No broad Hikings screen localization beyond the page title; list/card/form
  string localization remains separate follow-up work.
- No backend/API contract changes and no new dependencies.

## Capabilities

### New Capabilities

- `hikings`: Hiking list and create screen behavior for authenticated users,
  including navigation from list cards to hiking details.

### Modified Capabilities

- `i18n`: Extend the accepted localization surface to include the Hikings page
  title.

## Impact

- Change name: `feat-0006-hikings-page-audit`.
- Capability touched: `hikings`; related existing capability touched: `i18n`.
- Affected code during implementation is expected to be limited to `/hikings`
  page title i18n, i18n resources/tests, OpenSpec files, capability map/backlog
  bookkeeping, and archiving directly represented Hikings docs if any are
  covered by this screen.
- Existing frontend API calls are reused: `GET /hikings` and `POST /hikings`.
- Backend/API changes: none.
- Dependencies: none.
