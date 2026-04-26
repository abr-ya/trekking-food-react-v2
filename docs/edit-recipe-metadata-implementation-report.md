# Edit recipe metadata — implementation report

## Summary

Added editing of `name`, `description`, and `category` to the recipe detail page, mirroring
the products UX:

- A pencil button next to the recipe `h1` opens **`EditRecipeDialog`** (name + description).
- A small tag-icon button next to the category chip opens **`EditRecipeCategoryDialog`**
  (single `categoryId`). When the recipe has no category, that dialog is opened from a
  "Set category" button shown in place of the chip.

The data layer was extended with the previously missing pieces: `PATCH /recipes/:id`, the
`UpdateRecipePayload` type, and a `useUpdateRecipe` mutation. Form validation reuses
fragments extracted from the existing `createRecipeSchema`.

## Created / changed files

| File | Action |
|------|--------|
| [`src/api/recipes.ts`](../src/api/recipes.ts) | Added `patchRecipe(id, payload)` for `PATCH /recipes/:id`. |
| [`src/types/recipe.ts`](../src/types/recipe.ts) | Added `UpdateRecipePayload` (narrow `Partial` of name/description/categoryId). |
| [`src/hooks/use-recipes.ts`](../src/hooks/use-recipes.ts) | Added `useUpdateRecipe()` and the `UpdateRecipeVariables` type. |
| [`src/hooks/index.ts`](../src/hooks/index.ts) | Re-exported `useUpdateRecipe` and `UpdateRecipeVariables`. |
| [`src/schemas/recipe.ts`](../src/schemas/recipe.ts) | Extracted `recipeNameSchema`, `recipeDescriptionSchema`, `recipeCategoryIdSchema`. Added `editRecipeSchema` and `editRecipeCategorySchema`. |
| `src/components/forms/edit-recipe-form.tsx` | New file: `EditRecipeForm`. |
| `src/components/dialogs/edit-recipe-dialog.tsx` | New dialog: `EditRecipeDialog` (pencil trigger). |
| `src/components/dialogs/edit-recipe-category-dialog.tsx` | New dialog: `EditRecipeCategoryDialog` (tag icon / "Set category" trigger). |
| [`src/components/index.ts`](../src/components/index.ts) | Re-exported `EditRecipeForm`, `EditRecipeDialog`, `EditRecipeCategoryDialog`. |
| [`src/pages/recipe-detail-page.tsx`](../src/pages/recipe-detail-page.tsx) | Wired both dialogs into the header row. |
| `docs/edit-recipe-metadata-plan.md` | English plan written before implementation. |
| `docs/edit-recipe-metadata-implementation-report.md` | This report. |

## API + hook

```ts
// src/api/recipes.ts
export async function patchRecipe(id: string, payload: UpdateRecipePayload): Promise<unknown> {
  return apiFetch(`/recipes/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: payload,
  });
}

// src/types/recipe.ts
export type UpdateRecipePayload = Partial<{
  name: string;
  description: string;
  categoryId: string;
}>;

// src/hooks/use-recipes.ts
export const useUpdateRecipe = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: UpdateRecipeVariables) => patchRecipe(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: recipeQueryKeys.all }),
  });
};
```

`recipeQueryKeys.all` covers both the list and the detail view, so any successful update
re-fetches both without extra logic.

## Schemas

`createRecipeSchema` is unchanged behaviorally — its fields are now sourced from the
extracted reusable fragments:

```ts
export const recipeNameSchema = z.string().trim().min(1, "Name is required");
export const recipeDescriptionSchema = z.string().trim().min(1, "Description is required");
export const recipeCategoryIdSchema = z.string().min(1, "Recipe category is required");

export const editRecipeSchema = z.object({
  name: recipeNameSchema,
  description: recipeDescriptionSchema,
});

export const editRecipeCategorySchema = z.object({
  categoryId: recipeCategoryIdSchema,
});
```

## Dialogs and form

### `EditRecipeForm` (`src/components/forms/edit-recipe-form.tsx`)

- Props: `{ recipe: Recipe; onSuccess: () => void }`.
- `useForm` with `zodResolver(editRecipeSchema)`, defaults from the current recipe.
- `RHFInput` for `name`, native `<textarea>` registered with `register("description")`
  (matches the description style in
  [`create-recipe-form.tsx`](../src/components/forms/create-recipe-form.tsx)).
- Calls `useUpdateRecipe().mutate({ id, payload: { name, description } })`.
- The form id is `edit-recipe-form` so the dialog's footer Save button can submit it via
  `form="edit-recipe-form"`.

### `EditRecipeDialog` (`src/components/dialogs/edit-recipe-dialog.tsx`)

- Props: `{ recipe: Recipe }`.
- Trigger: ghost icon button with `Pencil`, `aria-label="Edit ${recipe.name}"`.
- The form is mounted only while the dialog is open (`{isOpen && <EditRecipeForm ... />}`)
  so each open re-initializes defaults from the current recipe.
- Save button shows "Saving…" while `useUpdateRecipe.isPending`.

### `EditRecipeCategoryDialog` (`src/components/dialogs/edit-recipe-category-dialog.tsx`)

- Props: `{ recipe: Recipe }`.
- Trigger:
  - With a chip: small ghost button with the `Tag` icon, `aria-label="Edit category"`.
  - Without a chip: a slightly larger ghost button labeled "Set category" with the same
    icon — this keeps the affordance discoverable when the chip is missing.
- Uses `RHFStaticSelect` populated from `useRecipeCategories()` (portal-based menu so it
  cooperates with the Radix Dialog focus trap, exactly like `EditProductCategoryDialog`).
- Submits with `useUpdateRecipe().mutate({ id, payload: { categoryId } })`.
- Save is disabled when categories are empty / failed to load. Loading and error states
  show inline messages, identical to `CreateRecipeForm`.
- `onOpenChange` and Cancel both reset the form back to the recipe's current `categoryId`.

## Wiring into the recipe detail page

`src/pages/recipe-detail-page.tsx` header block:

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
```

The description block underneath is unchanged — the pencil at the title now covers both
`name` and `description`, mirroring how the product edit dialog covers several text fields
together.

## Verification

- `npm run build` — `tsc -b && vite build` finished without errors.
- Linter (Cursor `ReadLints`) reports no issues on any of the changed files.
- Manual checks against the contract:
  - Pencil opens the edit dialog with current name + description; saving updates the page
    immediately (cache invalidation).
  - Tag icon next to the chip opens the category dialog with the current category
    pre-selected; switching category reflects on the page after save.
  - For a recipe without a category the "Set category" button shows in place of the chip;
    after assigning a category, both the chip and the inline tag icon appear.
  - Cancel and the dialog close button keep the original values, no stale state on re-open.
  - When `useRecipeCategories` is loading or empty, the category dialog shows the inline
    message and Save is disabled.

## Decisions & trade-offs

- The `UpdateRecipePayload` is intentionally narrow (`name`, `description`, `categoryId`).
  `isCommon` and ingredient mutations are out of scope — they have their own UX and own
  endpoints.
- Reused `RHFStaticSelect` (portal-based) for category in the dialog to match
  `EditProductCategoryDialog` exactly. Combobox-based `RHFSelect` is fine in inline forms,
  but inside a Radix Dialog the portal-based variant is the safer pick.
- We intentionally did **not** rewrite `create-recipe-form.tsx` to share a single
  combined recipe form. Doing so would broaden the diff with no immediate UX benefit; the
  shared surface between create and edit is just two fields (`name`, `description`), and
  the create form carries heavy logic (`useFieldArray`, async product search) that does
  not belong in the edit dialog. The new file is therefore named
  `edit-recipe-form.tsx` to match its content. The
  shared schema fragments give us deduplication where it matters.
- Cache invalidation uses `recipeQueryKeys.all` rather than only the detail key. This
  keeps the recipes list (and any future list-side display of category/name) in sync with
  zero additional code.
