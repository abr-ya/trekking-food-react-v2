# Tasks

Scope confirmed: menu visibility for anonymous users stays unchanged; page guards
(`ProtectedPage`) stay unchanged. Only the fixes below.

## 1. Menu rendering

- [ ] 1.1 Switch `TopMenu` items from `Link` to `NavLink` with an active style; pass `end` for `/`.
- [ ] 1.2 Verify at most one item is active and section detail routes (`/recipes/:id`, `/hikings/:id`) highlight their section.
- [ ] 1.3 Leave the existing admin filter (`requiresAppAdmin` / `isAppAdmin`) untouched; do NOT add auth-based hiding.

## 2. Routes

- [ ] 2.1 Normalize the products route in `src/App.tsx` from `/products/` to `/products` (matches `MAIN_NAV`).

## 3. Docs reconciliation

- [ ] 3.1 Update the access table in `docs/BUSINESS_LOGIC.md` so Home/Products/Recipes/Categories/Hikings are marked auth-required, About public, Admin admin-only (reflect real guard behavior).
- [ ] 3.2 Update `openspec/CAPABILITIES.md` `navigation` row after implementation.

## 4. Verification

- [ ] 4.1 Add/adjust a Vitest unit test asserting menu-to-route consistency (every `MAIN_NAV` path matches a declared route) and that the admin item is admin-only.
- [ ] 4.2 Run `npm run tsc && npm run lint && npm run test`.
- [ ] 4.3 Manual check: anonymous sees all non-admin items; protected pages show the auth prompt; active item highlights correctly; `/products` resolves.
