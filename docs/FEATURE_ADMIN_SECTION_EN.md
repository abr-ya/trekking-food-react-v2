# Admin section (app-level)

## Goals

- App administrators (`user.role === "admin"` from Better Auth session) get an **Admin** item in the top navigation.
- `/admin` is a nested area with a **persistent left sidebar** and main content on the right.
- First sub-page: **Features** (`/admin/features`). More pages will be added later.
- Non-admins must not see the top **Admin** link; direct URL access is guarded.

**Not in scope:** hiking-level admins (`HikingAdmin`), feature-flag API, `banned` checks.

## Auth

Better Auth returns `user.role` on sign-in and in `useSession()` (e.g. `"admin"`). The frontend currently drops `role` in `mapBetterAuthUser` — fix by mapping `role` onto `User`.

- [`src/lib/auth-roles.ts`](../src/lib/auth-roles.ts): `APP_ADMIN_ROLE = "admin"`, `isAppAdmin(user)`.
- [`src/hooks/use-is-admin.ts`](../src/hooks/use-is-admin.ts): thin hook over `useAuth().user`.

## Naming conventions

| Area | Path | File example | Export |
|------|------|--------------|--------|
| Admin pages | `src/pages/admin/` | `features-page.tsx` | `FeaturesPage` |
| Admin shell | `src/components/admin/` | `layout.tsx`, `sidebar.tsx` | `AdminLayout`, `AdminSidebar` |

No `admin-` prefix in page filenames; folder provides context. `Admin` prefix on React components only where needed to avoid clashing with root `Layout`.

## Navigation config (single folder)

```
src/config/nav/
  main-nav.ts   # top menu (all items, Admin with requiresAppAdmin)
  admin-nav.ts  # left menu inside /admin
  index.ts
```

`TopMenu` renders `MAIN_NAV` and hides items with `requiresAppAdmin` unless `isAppAdmin(user)`.

## Routes

| URL | Component |
|-----|-----------|
| `/admin` | `AdminLayout` → redirect to `/admin/features` |
| `/admin/features` | `FeaturesPage` |

Stays inside the global `Layout` (header + footer). `App.tsx` imports admin pages from `@/pages/admin`.

## Admin layout guards

1. Loading — minimal placeholder.
2. Not authenticated — same message style as `ProtectedPage` (no sidebar).
3. Authenticated, not app admin — “Access denied” (no sidebar).
4. App admin — sidebar + `<Outlet />`.

## Files to create or change

| File | Action |
|------|--------|
| `docs/FEATURE_ADMIN_SECTION_EN.md` | This plan |
| `src/types/auth.ts` | Add `role?: string` |
| `src/lib/auth-roles.ts` | New |
| `src/providers/auth-provider.tsx` | Map `role` |
| `src/hooks/use-is-admin.ts` | New |
| `src/hooks/index.ts` | Export hook |
| `src/config/nav/main-nav.ts` | New |
| `src/config/nav/admin-nav.ts` | New |
| `src/config/nav/index.ts` | New |
| `src/components/layout/top-menu.tsx` | Use `MAIN_NAV` |
| `src/components/admin/layout.tsx` | New |
| `src/components/admin/sidebar.tsx` | New |
| `src/pages/admin/features-page.tsx` | New |
| `src/pages/admin/index.ts` | New |
| `src/App.tsx` | Nested `/admin` routes |

## Verification

- `npm run build`
- User with `role: "admin"`: **Admin** in top menu, sidebar + Features at `/admin/features`.
- Guest or non-admin: no **Admin** link; `/admin/*` shows login or access denied.
- Adding a page: `pages/admin/foo-page.tsx`, entry in `admin-nav.ts`, `<Route path="foo" />`.

## Implementation report

After coding: [`IMPLEMENTATION_ADMIN_SECTION_EN.md`](./IMPLEMENTATION_ADMIN_SECTION_EN.md).
