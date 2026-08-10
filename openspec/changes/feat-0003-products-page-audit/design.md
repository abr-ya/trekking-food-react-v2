## Context

The `/products` route renders `ProductsPage`, which is wrapped in `ProtectedPage` and currently passes a literal `title="Products Page"`. The page has two columns: a product list area (`ProductsList`) and a create form (`CreateProductForm`). Product data flows through `src/api/products.ts` and `src/hooks/use-products.ts`; the API layer normalizes snake_case (`is_common`, `user_id`, `product_category_id`) to the client `Product` type (`isCommon`, `userId`, `productCategoryId`).

The existing list already supports server-side pagination, category filtering, search debounce, placeholder data, loading/error/empty states, and cache invalidation after product mutations. The current UI shows edit/delete/category-edit actions on product cards without checking whether the authenticated user owns the product.

## Goals / Non-Goals

**Goals:**

- Establish the initial `products` OpenSpec contract for the current Products screen.
- Localize only the top Products page title via the existing i18n resource pattern.
- Gate product edit/delete/category-edit controls according to the documented product rights.
- Add future backlog items for the remaining Products screen localization work.
- Move processed Products pagination source docs to `docs/archive/` only after their behavior is captured in the spec.

**Non-Goals:**

- No backend/API change.
- No new dependency.
- No full-screen localization sweep.
- No conversion from cards to a new table component.

## Decisions

### Reuse the existing i18n foundation

Use the current `resources` object and translation hook pattern instead of adding a new localization system. Add page-title keys under a page-oriented namespace, for example `pages.products.title`, and render the title from `ProductsPage`.

Alternative considered: passing localized text into `ProtectedPage` from route config. That would spread page-local copy into navigation config and is unnecessary for this focused change.

### Keep product data flow unchanged

Continue using `getProducts`, `useProducts`, `useCreateProduct`, `useUpdateProduct`, and `useDeleteProduct`. Product list cache invalidation remains keyed by `productQueryKeys.all`, and no new data normalization is needed beyond the existing snake_case to camelCase mapping.

Alternative considered: adding a dedicated ownership helper in the API layer. Ownership is UI behavior derived from already-normalized `Product` plus current auth user, so it belongs near the component or a small UI helper.

### Gate visible edit/delete actions in the product card

Use `useAuth()` to compare `product.userId` with the current `user.id`. The UI SHALL show edit/delete/category-edit actions only when the product is personal (`isCommon === false`) and belongs to the current user. Shared/common products remain visible but read-only from this screen.

The backend remains authoritative; hiding controls is a UX and spec-alignment improvement, not a security boundary.

### Archive processed docs narrowly

Create `docs/archive/` if needed and move only source documents whose behavior has been captured by this change. For now that means the Products pagination plan/report, because the spec will document pagination, page reset on filters, and the reusable pagination behavior relevant to `/products`.

Alternative considered: archiving all old plans/reports at once. That would be noisy and token-expensive because unrelated documents would need review.

## Risks / Trade-offs

- Product ownership data may be missing for older API rows -> Treat missing `userId` as not editable in the UI; backend still decides mutation validity.
- Shared/common product rules may evolve on the backend -> Keep this spec aligned with `docs/BUSINESS_LOGIC.md` and update through a later OpenSpec change if backend behavior changes.
- The i18n resource type currently assumes nav keys -> Extend typing carefully so existing nav tests and navigation code keep working.
- Archived docs may still contain useful history -> Moving them under `docs/archive/` preserves the files while making active docs easier to scan.

## Migration Plan

1. Add the localized Products page title key and consume it in `ProductsPage`.
2. Gate product card mutation actions by current user ownership and `isCommon`.
3. Add backlog rows for follow-up Products localization changes.
4. Move processed Products pagination docs into `docs/archive/`.
5. Run `npm run tsc`, `npm run lint`, and `npm run test`.

Rollback is straightforward: revert the frontend edits and move archived docs back to `docs/` if needed.

## Open Questions

- Should future work replace the card list with a literal table, or should the accepted spec continue treating the current card list as the Products list/table surface?
