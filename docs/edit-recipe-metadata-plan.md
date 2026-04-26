# Edit recipe metadata

## Goal

Make the recipe `name`, `description`, and `category` editable on the recipe detail page using
the same UX pattern as products: text fields edited in one dialog, the category edited in a
small dedicated dialog. Reuse the existing `Dialog`, `RHFInput`, `RHFStaticSelect`,
`useRecipeCategories`, and patterns from `EditProductDialog` / `EditProductCategoryDialog`.

UX expectations:

- A pencil button next to the recipe `h1` opens `EditRecipeDialog` (name + description).
- A tag-icon button next to the category chip opens `EditRecipeCategoryDialog` (single
  `categoryId` select).
- If the recipe has no category yet, the same dialog is opened from a small "Set category"
  button (the chip is replaced by the action button).
- Both dialogs follow the existing form-id + footer pattern (`form="..."`, Cancel / Save
  in `DialogFooter`), like
  [`edit-product-dialog.tsx`](../src/components/dialogs/edit-product-dialog.tsx).

## API & data layer (currently missing)

1. [`src/api/recipes.ts`](../src/api/recipes.ts) — add `patchRecipe(id, payload)` (PATCH
   `/recipes/:id`), mirroring `patchProduct` in
   [`src/api/products.ts`](../src/api/products.ts).
2. [`src/types/recipe.ts`](../src/types/recipe.ts) — add a narrow
   `UpdateRecipePayload = Partial<Pick<Recipe, "name" | "description" | "categoryId">>`
   (intentionally narrow; `isCommon` and `ingredients` stay out of scope of this task).
3. [`src/hooks/use-recipes.ts`](../src/hooks/use-recipes.ts) — add `useUpdateRecipe()`
   modeled after `useUpdateProduct`:
   - `mutationFn: ({ id, payload }) => patchRecipe(id, payload)`.
   - On success: `invalidateQueries({ queryKey: recipeQueryKeys.all })` (covers both detail
     and list).
   - Export from [`src/hooks/index.ts`](../src/hooks/index.ts).

## Schemas

In [`src/schemas/recipe.ts`](../src/schemas/recipe.ts):

- Extract reusable `recipeNameSchema` and `recipeDescriptionSchema` from the existing
  `createRecipeSchema` (no behavior change for create).
- Add:

  ```ts
  export const editRecipeSchema = z.object({
    name: recipeNameSchema,
    description: recipeDescriptionSchema,
  });
  export type EditRecipeFormData = z.infer<typeof editRecipeSchema>;

  export const editRecipeCategorySchema = z.object({
    categoryId: z.string().min(1, "Recipe category is required"),
  });
  export type EditRecipeCategoryFormData = z.infer<typeof editRecipeCategorySchema>;
  ```

## New components

### `src/components/dialogs/edit-recipe-dialog.tsx`

Clone of [`edit-product-dialog.tsx`](../src/components/dialogs/edit-product-dialog.tsx).
Props: `{ recipe: Recipe }`. Internally renders `EditRecipeForm` with
`form="edit-recipe-form"` and a `DialogFooter` with Cancel / Save. Trigger is a small ghost
icon button (`Pencil` from `lucide-react`).

### `src/components/forms/edit-recipe-form.tsx`

A small new file that hosts only `EditRecipeForm` (named after its content; we deliberately
do **not** rewrite `create-recipe-form.tsx`). It uses:

- `react-hook-form` with `zodResolver(editRecipeSchema)` and `id="edit-recipe-form"`.
- A `RHFInput` for `name`.
- A `<textarea>` registered with `register("description")` (matches
  [`create-recipe-form.tsx`](../src/components/forms/create-recipe-form.tsx) style with
  `inputClassName`).
- Calls `useUpdateRecipe()` with `{ id: recipe.id, payload: data }` and invokes
  `onSuccess()` from props on success.

### `src/components/dialogs/edit-recipe-category-dialog.tsx`

Clone of
[`edit-product-category-dialog.tsx`](../src/components/dialogs/edit-product-category-dialog.tsx).
Props: `{ recipe: Recipe }`.

- Internal `useForm<EditRecipeCategoryFormData>` with
  `defaultValues: { categoryId: recipe.categoryId }`.
- Single `RHFStaticSelect` populated from `useRecipeCategories()` (matches the dialog used
  for products; the static select renders via portal so it works inside a Radix Dialog).
- On submit calls `useUpdateRecipe().mutate({ id: recipe.id, payload: { categoryId } })`.
- Trigger:
  - When the recipe already has a category — a tag icon button (`Tag` from `lucide-react`),
    same size as on the product card.
  - When the recipe has no category — a small ghost button labeled "Set category" so the
    affordance stays visible without a chip.

### Exports

Add to [`src/components/index.ts`](../src/components/index.ts):

```ts
export { EditRecipeDialog } from "./dialogs/edit-recipe-dialog";
export { EditRecipeCategoryDialog } from "./dialogs/edit-recipe-category-dialog";
export { EditRecipeForm } from "./forms/recipe-form";
```

## Wiring into the recipe detail page

[`src/pages/recipe-detail-page.tsx`](../src/pages/recipe-detail-page.tsx) — update the
header block:

```tsx
<div className="flex flex-wrap items-center gap-2">
  <h1 className="text-2xl font-bold">{recipe.name}</h1>
  <EditRecipeDialog recipe={recipe} />
  {recipe.category ? (
    <div className="flex items-center gap-0.5">
      <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
        {recipe.category.name}
      </span>
      <EditRecipeCategoryDialog recipe={recipe} />
    </div>
  ) : (
    <EditRecipeCategoryDialog recipe={recipe} />
  )}
  {recipe.isCommon && (
    <span className="rounded-full bg-blue-500/20 px-2 py-0.5 text-xs font-medium text-blue-700 dark:text-blue-400">
      Common
    </span>
  )}
</div>
{recipe.description && <p className="text-muted-foreground">{recipe.description}</p>}
```

`EditRecipeCategoryDialog` itself decides which trigger to render (icon vs. "Set category"
button) based on `recipe.category`.

## Edge cases & UX details

- Disable Save / show "Saving…" while `useUpdateRecipe.isPending`.
- Close dialogs only on success (`onSuccess`); validation errors keep the dialog open.
- On open/close, reset the form to the latest `recipe.*` values so re-opening shows fresh
  data.
- If `useRecipeCategories()` is loading or errors out, the category select disables itself
  with a placeholder message ("Loading categories…" / error message).
- After a successful update, the detail page re-renders via `recipeQueryKeys.all`
  invalidation — no manual state sync.

## Documentation deliverables

Both files are English-only.

1. **Before implementation** — this file, `docs/edit-recipe-metadata-plan.md`.
2. **After implementation** — `docs/edit-recipe-metadata-implementation-report.md` with
   summary, created/changed files, new API + hook + schemas, dialog/form props and UI
   states, how it is wired in `recipe-detail-page.tsx`, verification (`npm run build`,
   `npm test`, manual checks).

## Files

| File | Action |
|------|--------|
| [`src/api/recipes.ts`](../src/api/recipes.ts) | + `patchRecipe` |
| [`src/types/recipe.ts`](../src/types/recipe.ts) | + `UpdateRecipePayload` |
| [`src/hooks/use-recipes.ts`](../src/hooks/use-recipes.ts) | + `useUpdateRecipe` |
| [`src/hooks/index.ts`](../src/hooks/index.ts) | export `useUpdateRecipe` |
| [`src/schemas/recipe.ts`](../src/schemas/recipe.ts) | + `editRecipeSchema`, `editRecipeCategorySchema` (extract reusable fragments) |
| `src/components/forms/edit-recipe-form.tsx` | new file: `EditRecipeForm` |
| `src/components/dialogs/edit-recipe-dialog.tsx` | new dialog (name + description) |
| `src/components/dialogs/edit-recipe-category-dialog.tsx` | new dialog (categoryId) |
| [`src/components/index.ts`](../src/components/index.ts) | export new dialogs and form |
| [`src/pages/recipe-detail-page.tsx`](../src/pages/recipe-detail-page.tsx) | wire pencil + tag icon next to title and category |
| `docs/edit-recipe-metadata-plan.md` | this English plan |
| `docs/edit-recipe-metadata-implementation-report.md` | English report after implementation |

After changes: `npm run build` and `npm test`.
