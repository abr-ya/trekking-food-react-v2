# Admin section — implementation report

## Summary

Added an app-level **Admin** area at `/admin` for users with `user.role === "admin"` from the Better Auth session. The top navigation shows **Admin** only for those users. Inside `/admin`, a persistent left sidebar lists admin sub-pages; the first page is **Features** at `/admin/features`.

Navigation links for the top menu and admin sidebar live in `src/config/nav/`. The previous hardcoded links in `TopMenu` were replaced with config-driven rendering.

## Auth changes

- Extended `User` with optional `role`.
- `mapBetterAuthUser` now maps `role` from the session user (was previously dropped).
- `src/lib/auth-roles.ts`: `APP_ADMIN_ROLE = "admin"`, `isAppAdmin(user)`.
- `useIsAdmin()` hook for components.

## Admin guards (`AdminLayout`)

| State | Behavior |
|-------|----------|
| Session loading | `LoadingSkeleton` |
| Not authenticated | Login message (no sidebar) |
| Authenticated, not admin | Access denied (no sidebar) |
| App admin | Sidebar + `<Outlet />` |

`/admin` index redirects to `/admin/features`.

## Files created

| File | Purpose |
|------|---------|
| `docs/FEATURE_ADMIN_SECTION_EN.md` | Feature plan |
| `docs/IMPLEMENTATION_ADMIN_SECTION_EN.md` | This report |
| `src/lib/auth-roles.ts` | `isAppAdmin` helper |
| `src/hooks/use-is-admin.ts` | Admin check hook |
| `src/config/nav/main-nav.ts` | Top menu config |
| `src/config/nav/admin-nav.ts` | Admin sidebar config |
| `src/config/nav/index.ts` | Nav barrel |
| `src/components/admin/layout.tsx` | `AdminLayout`, `AdminIndexRedirect` |
| `src/components/admin/sidebar.tsx` | `AdminSidebar` |
| `src/pages/admin/features-page.tsx` | `FeaturesPage` |
| `src/pages/admin/index.ts` | Admin pages barrel |

## Files changed

| File | Change |
|------|--------|
| `src/types/auth.ts` | `role?: string` on `User` |
| `src/providers/auth-provider.tsx` | Map `role` in `mapBetterAuthUser` |
| `src/hooks/index.ts` | Export `useIsAdmin` |
| `src/components/layout/top-menu.tsx` | Render from `MAIN_NAV` + admin filter |
| `src/App.tsx` | Nested `/admin` routes |

## Manual test checklist

- [ ] Guest: no **Admin** in top menu; `/admin` and `/admin/features` show login message.
- [ ] Logged-in user without `role: "admin"`: no **Admin** link; direct URL shows access denied.
- [ ] User with `role: "admin"`: **Admin** visible; `/admin` redirects to Features; sidebar **Features** link works and highlights when active.
- [ ] `npm run build` passes.

## Adding another admin page

1. Create `src/pages/admin/<name>-page.tsx` and export from `src/pages/admin/index.ts`.
2. Add `{ label, path: "/admin/<segment>" }` to `src/config/nav/admin-nav.ts`.
3. Add `<Route path="<segment>" element={<...Page />} />` under `/admin` in `src/App.tsx`.

## Follow-ups (out of scope)

- Feature flags API and UI on Features page
- Block banned users (`user.banned`) from admin area
- Do not use hiking-level `HikingAdmin` for `/admin` access
