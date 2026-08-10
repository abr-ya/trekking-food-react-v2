# Products list pagination — implementation report

## Summary

Server-side pagination is wired to the Products page left column. The list now sends `page` and `limit` to `GET /products` (via existing `getProducts` / `useProducts`). A reusable `Pagination` control lives under `src/components/common/`, built with existing `Button` and Lucide chevrons. Category and search filters reset the current page to `1` so users do not stay on an empty page after narrowing results.

## Files created

| File | Purpose |
|------|---------|
| [`docs/products-list-pagination-plan.md`](products-list-pagination-plan.md) | English technical plan (saved before implementation). |
| [`src/components/common/pagination.tsx`](../src/components/common/pagination.tsx) | Shared pagination UI: Previous/Next, “Page x of y”, optional total count. |

## Files changed

| File | Change |
|------|--------|
| [`src/components/lists/products-list.tsx`](../src/components/lists/products-list.tsx) | `page` state, `PRODUCTS_PAGE_SIZE` (20), `useProducts` params include `page`/`limit`, `useEffect` resets `page` when `debouncedSearch` or `selectedCategoryIds` changes, renders `Pagination` when `meta.totalPages > 1`, compact one-line summary when a single page. |
| [`src/components/index.ts`](../src/components/index.ts) | Exports `Pagination` and `PaginationProps`. |

No changes were required to `src/api/products.ts` or `src/hooks/use-products.ts`; they already supported `page` and `limit`.

## `Pagination` public API

Props (`PaginationProps`):

- **`page`** — 1-based current page (usually from `meta.page`).
- **`totalPages`** — from `meta.totalPages`.
- **`onPageChange`** — `(page: number) => void`; parent updates local state and refetches via the data hook.
- **`disabled?`** — e.g. pass `isLoading` from the list query to disable controls during fetch.
- **`className?`** — optional layout tweaks.
- **`totalItems?`** — optional; shown in the center line as “· N total” (Products passes `meta.total`).

Behavior:

- Renders `null` when `totalPages <= 1` (no useless controls).
- `nav[role="navigation"]` for accessibility; Previous disabled on first page, Next on last.

## `ProductsList` wiring

- **Page size:** `PRODUCTS_PAGE_SIZE = 20` (aligned with recipe list defaults elsewhere).
- **Query params:** `{ page, limit: PRODUCTS_PAGE_SIZE, search?, categoryId? }` merged into `useProducts(params)`.
- **Filter reset:** `setPage(1)` runs whenever `debouncedSearch` or `selectedCategoryIds` changes (in addition to existing behavior that clears the search string when categories change).
- **Footer copy:** If `totalPages > 1`, only `Pagination` is shown (it includes page label and total). If `totalPages <= 1` and `meta` exists, a short line shows product count and per-page size.

## Reusing `Pagination` on other screens

1. Add local `const [page, setPage] = useState(1)` and a page-size constant.
2. Pass `page` and `limit` into your list hook (e.g. `useRecipes` / `getRecipes` with the same `meta` shape).
3. Reset `page` to `1` when search or other filters that change the result set change.
4. Render:

   ```tsx
   {meta && meta.totalPages > 1 && (
     <Pagination
       page={meta.page}
       totalPages={meta.totalPages}
       onPageChange={setPage}
       disabled={isLoading}
       totalItems={meta.total}
     />
   )}
   ```

## Edge cases

- **Narrowing filters** — Resetting to page 1 avoids requesting a high page that no longer exists; the API should still return valid `meta` if a bad page is sent, but the UX avoids the common empty state.
- **Single page of results** — `Pagination` returns `null`; a minimal stats line is still shown for context.

## Verification

- `npm run build` (TypeScript project references + Vite production build) completed successfully after these changes.
- Manual check recommended: open Products, confirm network/query includes `page` & `limit`, use Previous/Next, change search/categories and confirm the list returns to page 1.
