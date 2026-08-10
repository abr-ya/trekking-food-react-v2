# Capability Map

Lightweight inventory of the app's domains ("capabilities"). This is **not** a
spec — it's an orientation map. Real, authoritative specs live in
`openspec/specs/<capability>/spec.md` and are backfilled *just-in-time* as we
touch each area through OpenSpec changes.

- **Status legend:** ✅ implemented · 🟡 partial · ⬜ planned / not started
- **Spec:** whether an authoritative spec exists yet in `openspec/specs/`
- Domain source of truth: [`docs/BUSINESS_LOGIC.md`](../docs/BUSINESS_LOGIC.md)

## Capabilities

| Capability | Status | Spec | What it covers | Key code |
|---|---|---|---|---|
| `products` | ✅ | ⬜ | Product catalog: nutrition (kkal/proteins/fats/carbs), price, vegetarian flag, category, personal vs. shared (`isCommon`); list with pagination + search + category filter | `src/api/products.ts`, `src/hooks/use-products.ts`, `src/components/forms/product-form.tsx`, `src/components/lists/products-list.tsx` |
| `recipes` | ✅ | ⬜ | Recipes as sets of ingredients (product + grams/serving); create, list (paginated), detail; edit metadata; add/edit ingredients | `src/api/recipes.ts`, `src/hooks/use-recipes.ts`, `src/components/recipe-page/*`, `src/pages/recipe-detail-page.tsx` |
| `categories` | ✅ | ⬜ | Product/recipe categories: list, create, edit, delete; multi-category filtering | `src/api/categories.ts`, `src/hooks/use-category-mutations.ts`, `src/components/lists/categories-list.tsx` |
| `hikings` | ✅ | ⬜ | Trip entity: days/members/vegetarians, create, list (paginated + search), detail, group-size (`membersTotal`) change with pack recompute | `src/api/hikings.ts`, `src/hooks/use-hikings.ts`, `src/components/forms/create-hiking-form.tsx`, `src/components/hiking-page/hiking-info.tsx` |
| `food-planning` | ✅ | ⬜ | Distribute products/recipes across days × meal times; per-person and total quantities; auto-calc totals; day comments | `src/components/hiking-page/food-plan.tsx`, `day-eatings.tsx`, `recipes-by-days.tsx`, `day-comment.tsx`, `src/api/eatings.ts` |
| `packing` | ✅ | ⬜ | Organize meal lines into day packs / trip packs per member; drag & drop assignment; auto-distribute; per-column TXT export | `src/components/hiking-page/packs-by-users*.tsx`, `packs-by-days.tsx`, `auto-distribute-button.tsx`, `trip-pack-products.tsx` |
| `shopping-list` | ✅ | ⬜ | Aggregate product totals across the trip; export | `src/components/hiking-page/shopping-list.tsx`, `src/lib/download.ts` |
| `auth` | ✅ | ⬜ | Better Auth sessions; roles (anonymous / authenticated / owner / hiking-admin); protected routes; hiking admins management | `src/lib/auth-*.ts`, `src/providers/auth-provider.tsx`, `src/hooks/use-is-admin.ts`, `src/components/layout/protected-page.tsx` |
| `admin-features` | 🟡 | ⬜ | Admin CRUD for marketing/roadmap "features" (status DRAFT→DONE, lang EN/RU, isMain), shown on the home/landing page | `src/api/features.ts`, `src/pages/admin/feature-*.tsx`, `src/components/features/features-accordion.tsx` |
| `navigation` | ✅ | ✅ | Top menu + admin nav: config-driven items (`MAIN_NAV` / `routes`), active-link highlight, admin-only Admin item; menu stays visible to anonymous users (auth prompt on protected pages) | `src/config/nav/*`, `src/components/layout/top-menu.tsx`, `src/components/layout/header.tsx` |
| `i18n` | 🟡 | ✅ | UI language switching foundation (`en`/`ru`) with persisted locale; first localized surface is the top menu only | `src/i18n/*`, `src/components/layout/language-switcher.tsx`, `src/components/layout/top-menu.tsx` |

## Known planned / gaps

Candidates for future OpenSpec changes (`/openspec-propose`). Not yet started
unless noted.

- **Edit vegetarians count** — ⬜ `vegetariansTotal` is set only at creation; no
  update path exists. See "Future: edit vegetarians count" in
  [`docs/BUSINESS_LOGIC.md`](../docs/BUSINESS_LOGIC.md).
- **Tests coverage** — 🟡 Vitest is configured but coverage is thin (see
  `docs/PROJECT_ANALYSIS.md`).
- **Error boundary / retry logic** — ⬜ no global React error boundary; no retry
  in `apiFetch`.

## How this maps to OpenSpec

```
CAPABILITIES.md (this file)     →  the map: what exists, at a glance
openspec/specs/<capability>/    →  the truth: written just-in-time per capability
openspec/changes/<change>/      →  the work: proposals for new/planned features
```

When a change is archived, its delta spec is synced into
`openspec/specs/<capability>/spec.md`, so the `Spec` column above fills in over
time. Keep the table honest: update Status/Spec as capabilities evolve.
