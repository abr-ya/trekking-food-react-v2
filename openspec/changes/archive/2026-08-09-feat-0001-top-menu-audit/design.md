## Context

The top menu is config-driven: `MAIN_NAV` (`src/config/nav/main-nav.ts`) is a flat
list of `{ label, path, requiresAppAdmin? }`, rendered by `TopMenu`
(`src/components/layout/top-menu.tsx`) which filters out admin-only items via
`isAppAdmin(user)` and renders plain `Link`s. Routes live in `src/App.tsx`.

Audit of the current state:

| Label | `MAIN_NAV` path | Route in `App.tsx` | Page guard | Issue |
|-------|-----------------|--------------------|-----------|-------|
| Home | `/` | `/` | `ProtectedPage` | landing requires auth |
| Products | `/products` | `/products/` | `ProtectedPage` | trailing-slash mismatch; BL says anon-readable |
| Recipes | `/recipes` | `/recipes` | `ProtectedPage` | BL says anon-readable |
| Categories | `/categories` | `/categories` | `ProtectedPage` | BL says anon-readable |
| Hikings | `/hikings` | `/hikings` | `ProtectedPage` | ok (read = all+admins) |
| About | `/about` | `/about` | none | public |
| Admin | `/admin` (`requiresAppAdmin`) | `/admin` | `AdminLayout` (auth + `useIsAdmin`) | consistent |

Findings:
- **Trailing slash**: `MAIN_NAV` `/products` vs route `/products/`.
- **No active state**: `TopMenu` uses `Link`, not `NavLink`.
- **Docs vs reality (not a menu bug)**: every main page is wrapped in
  `ProtectedPage` (auth required, incl. Home), which is the **intended** behavior —
  anonymous users see the "please authenticate" prompt. But `BUSINESS_LOGIC.md`
  still says products/recipes/categories are anon-readable. Only the docs are wrong.
- **Consistent (no change)**: `useIsAdmin()` wraps `isAppAdmin()`; the `Admin` item
  and the `/admin` route share the same predicate.

## Goals / Non-Goals

**Goals:**
- Menu paths match routes exactly; current section is highlighted.
- Docs (`BUSINESS_LOGIC.md`) reflect the real, intended access behavior.

**Non-Goals:**
- Changing menu visibility for anonymous users (kept as-is by explicit decision).
- Changing page guards / `ProtectedPage` behavior.
- i18n of labels (`switch-language`), header/mobile redesign, auth-mechanism changes.

## Decisions

- **Menu visibility is intentionally NOT tied to auth.** All items stay visible to
  anonymous users; opening a protected page shows the existing `ProtectedPage`
  prompt. This is a deliberate product decision — do not add auth gating to the
  menu. The only gated item remains `Admin` via the existing `requiresAppAdmin`.
  `MainNavItem` keeps its current shape (no `access` refactor).
- **Use `NavLink` with `end` for `/`** to get active styling with correct matching
  (so `/` isn't always active). Existing admin filter in `TopMenu` stays untouched.
- **Normalize the route to `/products`** (drop trailing slash) to match siblings.
- **Reconcile docs only.** Update the `BUSINESS_LOGIC.md` access table so
  Home/Products/Recipes/Categories/Hikings are marked auth-required (About public,
  Admin admin-only). No guard or menu-visibility code changes for access.

## Risks / Trade-offs

- [`NavLink` active match on nested routes] → Use `end` on `/` and rely on prefix
  match for sections; verify detail routes (`/recipes/:id`) still highlight their section.
- [`/products` path change] → React Router match; verify existing links/redirects still resolve.
- [Docs drift] → Update `docs/BUSINESS_LOGIC.md` access table in the same change.

## Open Questions

- None. (Access-model question resolved: menu visibility stays as-is; only docs are
  reconciled.)
