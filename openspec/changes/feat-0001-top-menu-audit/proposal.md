## Why

The top navigation menu, the route table, and the actual page-level access guards
have drifted apart. Links are advertised to users who then hit an
"You are not authenticated" wall, a route path doesn't match its menu entry, and
the current page isn't highlighted. This change audits the whole menu and aligns
menu visibility, routes, and access control into one consistent model.

Capability touched: `navigation` (see `openspec/CAPABILITIES.md`).

- **Menu visibility stays as-is (by design):** all navigation items remain visible
  to everyone, including anonymous users. Opening an auth-required page shows the
  existing `ProtectedPage` "please authenticate" message. This behavior is
  intentional and is NOT changed. The only gated item stays the admin-only `Admin`
  entry (existing `requiresAppAdmin`).
- **Fix the trailing-slash mismatch**: `MAIN_NAV` uses `/products` while the route
  is declared `/products/`. Normalize to `/products` for consistency with the
  other routes.
- **Add active-link highlighting**: the menu uses `Link`, so the current section
  is not indicated. Switch to `NavLink` with an active style (`end` for `/`).
- **Reconcile the docs**: `docs/BUSINESS_LOGIC.md` states products/recipes/
  categories are anonymously readable, but the app intentionally gates them behind
  `ProtectedPage`. Update the docs to match the real (intended) behavior.
- Confirmed **consistent** (no change needed): the admin check is single-sourced —
  `useIsAdmin()` simply wraps `isAppAdmin()`, and both the `Admin` menu item and
  the `/admin` route use it.

## Capabilities

### New Capabilities
- `navigation`: Defines the top navigation menu — its items, their target routes,
  and per-item access gating — and requires consistency between menu visibility,
  route guards, and the documented access model.

### Modified Capabilities
<!-- None: no existing spec files yet in openspec/specs/. -->

## Impact

- Code: `src/config/nav/main-nav.ts` (path fix only), `src/components/layout/top-menu.tsx` (`NavLink` + active state; existing admin filter unchanged), `src/App.tsx` (normalize `/products/` → `/products`).
- Docs: `docs/BUSINESS_LOGIC.md` access table reconciled to reflect that Home/Products/Recipes/Categories/Hikings require authentication (About public, Admin admin-only).
- Page guards (`ProtectedPage`) are **unchanged**.
- No backend/API changes (frontend-only repo).
- **Decision (confirmed):** menu visibility is intentionally not tied to
  authentication — items stay visible to anonymous users, who get the auth prompt
  on protected pages. Only `Admin` remains gated.

## Non-goals

- Localization / i18n of menu labels (tracked separately as `switch-language`).
- Redesigning the header layout, mobile/hamburger menu, or admin sidebar.
- Reworking the authentication mechanism itself (Better Auth stays as-is).
