# Recipes list pagination and height limit

## Context

- [`src/components/lists/recipes-list.tsx`](../src/components/lists/recipes-list.tsx) calls `useRecipes()` with no args; [`useRecipes`](../src/hooks/use-recipes.ts) already defaults to `page=1`, `limit=20`, but there is **no local page state** so the user cannot change pages. Only static `meta` text is shown at the bottom.
- [`useRecipes`](../src/hooks/use-recipes.ts) and [`getRecipes`](../src/api/recipes.ts) already support `page` / `limit` / `search`; [`recipeQueryKeys.list`](../src/hooks/use-recipes.ts) includes `page`, `limit`, `search`.
- The site footer lives in [`Layout`](../src/components/layout/layout.tsx) (`<Footer />` below `<main>`). To keep it easier to see without excessive page scroll, the list should be **height-limited and scroll internally**, matching [`ProductsList`](../src/components/lists/products-list.tsx): `relative overflow-y-auto max-h-[54vh] pr-1 min-h-[12rem]` and **pagination below** the scroll area, not inside it.

## 1. `useRecipes` hook

- Import `keepPreviousData` from `@tanstack/react-query`.
- On the list `useQuery`, add **`placeholderData: keepPreviousData`**, same as [`use-products.ts`](../src/hooks/use-products.ts), so page changes do not replace the list with a skeleton and a loading overlay can be shown (aligned with Products).

## 2. `RecipesList` component

Refactor to mirror [`products-list.tsx`](../src/components/lists/products-list.tsx) (no search or category UI in this task):

- Local state: `const [page, setPage] = useState(1)`.
- Constant **`RECIPES_PAGE_SIZE = 20`** (aligned with `DEFAULT_LIST_LIMIT` in `use-recipes`); call `useRecipes({ page, limit: RECIPES_PAGE_SIZE })` (empty `search` is the default in the hook).
- Destructure **`isLoading`**, **`isFetching`**, **`isPlaceholderData`**, `error`, `data`.
- **Skeleton** only on **`isLoading`** (first load with no cache).
- List region: **wrapper** `relative overflow-y-auto max-h-[54vh] pr-1 min-h-[12rem]`.
- **Overlay** with `Loader2` when `isFetching && !isLoading` (same as Products).
- Empty states: distinguish “empty catalog” vs “empty page” like Products (`isPlaceholderData`).
- **Pagination:** use [`Pagination`](../src/components/common/pagination.tsx) from `@/components`; when `meta.totalPages > 1`, pass **`page` from state** (not `meta.page` while refetching), `totalPages={meta.totalPages}`, `onPageChange={setPage}`, `disabled={isFetching}`, `totalItems={meta.total}`; when a single page, a short `meta` summary line (like Products).
- Replace/trim the old static `meta` line to avoid duplicating the pagination block.

## 3. `RecipesPage`

- [`recipes-page.tsx`](../src/pages/recipes-page.tsx) likely needs **no** changes if all layout is in `RecipesList`. If flex clipping appears in testing, optionally add `min-h-0` to the column (only if required).

## 4. “Footer always visible” behavior

- **`max-h-[54vh]`** on the list scroll area limits how tall the left column grows, so the [global `Footer`](../src/components/layout/layout.tsx) stays within easier reach; pagination stays **under** the scroll area, not inside the long list.
- Recipe **search in the UI** is out of scope for this task; when added later, reset `page` to `1` on search string change.

## Files to change

| File | Action |
|------|--------|
| [`src/hooks/use-recipes.ts`](../src/hooks/use-recipes.ts) | `keepPreviousData` on list `useQuery` |
| [`src/components/lists/recipes-list.tsx`](../src/components/lists/recipes-list.tsx) | `page` state, `limit`, scroll + overlay + `Pagination`, align with Products |

After changes: `npm run build`.

## Alignment with Products list

Same pagination component, `keepPreviousData`, initial skeleton vs fetch overlay, and height constraints as on the Products page.
