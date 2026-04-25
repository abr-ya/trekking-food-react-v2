# Recipes list pagination — implementation report

## Summary

The Recipes page list now uses the same server-driven pagination and loading UX as the Products list: local `page` state, fixed page size (20), shared `Pagination` component, `keepPreviousData` on the recipes list query, an in-place loading overlay on refetch, and a height-capped scroll region so the pagination row sits below the list and the site footer remains easier to reach.

## Files created

| File | Purpose |
|------|---------|
| [`docs/recipes-list-pagination-plan.md`](recipes-list-pagination-plan.md) | English technical plan (before implementation). |

## Files changed

| File | Change |
|------|--------|
| [`src/hooks/use-recipes.ts`](../src/hooks/use-recipes.ts) | Import `keepPreviousData` from `@tanstack/react-query`; set `placeholderData: keepPreviousData` on the list `useQuery`. |
| [`src/components/lists/recipes-list.tsx`](../src/components/lists/recipes-list.tsx) | `page` state, `RECIPES_PAGE_SIZE = 20`, `useRecipes({ page, limit })`, `isLoading` / `isFetching` / `isPlaceholderData`, scroll wrapper `max-h-[75vh] min-h-[12rem] overflow-y-auto`, `Loader2` overlay when `isFetching && !isLoading`, `Pagination` when `meta.totalPages > 1` (with `page` from state), compact line when a single page; empty states aligned with Products. |

Other call sites (`useRecipes()` with no args in forms) are unchanged and benefit from the same `keepPreviousData` behavior when their query refetches.

## `Pagination` usage

Same as Products: `page` from React state (requested page), `totalPages` and `totalItems` from `meta`, `onPageChange={setPage}`, `disabled={isFetching}`.

## `keepPreviousData` and overlay

While a new page is loading, TanStack Query keeps the previous `data` as placeholder, so the list is not replaced by skeletons. `isFetching && !isLoading` drives a semi-transparent overlay with a spinning `Loader2`.

## Height and site footer

The list uses `max-h-[54vh]` and internal scrolling, matching [`ProductsList`](../src/components/lists/products-list.tsx). Pagination is **outside** the scroll box, so it does not scroll away with the items. Shorter overall column growth makes the global [`Footer`](../src/components/layout/layout.tsx) under `main` easier to see without excessive page scroll.

## Future: recipe search + page reset

When a search field is added to `RecipesList`, pass `search` into `useRecipes` and reset `page` to `1` in a `useEffect` when the debounced search string changes (same pattern as Products).

## Verification

- `npm run build` completed successfully after these changes.
- Manual check: open Recipes, confirm list height, change pages, observe overlay and stable pagination row.
