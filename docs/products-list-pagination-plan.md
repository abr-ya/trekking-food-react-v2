# Products list pagination

## Current state

- [`src/components/lists/products-list.tsx`](../src/components/lists/products-list.tsx) calls `useProducts(params)` with only `search` and `categoryId`; `page` / `limit` are not sent.
- [`getProducts`](../src/api/products.ts) and [`productQueryKeys.list`](../src/hooks/use-products.ts) already support `page` and `limit` in the request and in the query cache key.
- The list footer shows `meta` text, but the user cannot change pages.
- There is no shadcn-style `pagination` primitive in [`src/components/ui/`](../src/components/ui/); [`Button`](../src/components/ui/button.tsx) and `lucide-react` are available.

## Intended behavior

- Add `const [page, setPage] = useState(1)` and a fixed `limit` (e.g. **20**, aligned with `DEFAULT_LIST_LIMIT` in [`use-recipes.ts`](../src/hooks/use-recipes.ts)), kept in one constant.
- Extend `useProducts` params to `{ ...filters, page, limit }`.
- **Reset to page 1** when `debouncedSearch` or `selectedCategoryIds` changes (`useEffect`), to avoid staying on an empty page after filters narrow the result set.
- Show the pagination control when `meta.totalPages > 1` (on a single page, show a short total line or avoid duplicate labels—implementation detail; at minimum, do not show useless Prev/Next).

## Shared `Pagination` component

- **Path:** [`src/components/common/pagination.tsx`](../src/components/common/pagination.tsx) (alongside `MultiCategoryFilter`), not under `ui/`.

- **API (minimum):**
  - `page: number` (1-based)
  - `totalPages: number`
  - `onPageChange: (page: number) => void`
  - Optional: `disabled?: boolean` (e.g. while loading), `className`, optional `total` for a compact label.

- **Markup:** `nav` with `role="navigation"`, Back/Forward using [`Button`](../src/components/ui/button.tsx) `variant="outline"` `size="sm"`, `ChevronLeft` / `ChevronRight` from `lucide-react`; short center text such as “Page {page} of {totalPages}”. Disable Prev when `page <= 1`, Next when `page >= totalPages`.

## Products integration

- In `products-list.tsx`, import the component, pass `page` and `totalPages` from `meta`, `onPageChange={setPage}`, `disabled={isLoading}`.
- Replace or trim the static `meta` line to avoid duplicating the same information.

## Export

- Export from [`src/components/index.ts`](../src/components/index.ts) in the Common section.

## Reuse

- The same control can be used for recipes or any list that exposes `meta.page` and `meta.totalPages`; the parent owns `page` / `limit` and the data hook.
