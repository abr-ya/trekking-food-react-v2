# Recipes by days section — implementation report

## Summary

Added a new collapsible "Recipes by days" summary block to the **Food Plan** tab of the hiking
page. It groups every recipe present in the trip plan and shows the days each recipe is scheduled
for (e.g. "Borscht — Days: 1, 3, 5"). Users can hide individual recipes from the summary; the
hidden state is persisted in `localStorage` per hiking. A "Show all" button restores hidden items.

The block is implemented as a presentational component on top of:

- a pure helper `groupRecipesByDays` (covered with unit tests),
- a feature-specific hook `useHiddenRecipes` for `localStorage` persistence.

The original `HikingProduct` payload from the backend already contains `recipe_id`, `recipe_name`
and `day_number`, so no backend changes were needed. Recipe categories are intentionally not used
here because they are not available on `HikingProduct`.

## Created / changed files

| File | Action |
|------|--------|
| `src/components/hiking-page/hiking-helpers.ts` | Added `RecipeDays` type and `groupRecipesByDays(products)` helper. |
| `src/components/hiking-page/hiking-helpers.test.ts` | Added unit tests for `groupRecipesByDays`. |
| `src/hooks/use-hidden-recipes.ts` | New hook with `localStorage`-backed `Set<string>` of hidden recipe ids. |
| `src/hooks/index.ts` | Re-exported `useHiddenRecipes` and `UseHiddenRecipesResult`. |
| `src/components/hiking-page/recipes-by-days.tsx` | New presentational component (collapsible, hide / Show all). |
| `src/components/index.ts` | Re-exported `RecipesByDays`. |
| `src/components/hiking-page/food-plan.tsx` | Mounted `RecipesByDays` above `DayTabs`. |
| `docs/recipes-by-days-plan.md` | English plan written before implementation. |
| `docs/recipes-by-days-implementation-report.md` | This report. |

## Helper

```ts
export type RecipeDays = { recipeId: string; recipeName: string; days: number[] };
export const groupRecipesByDays: (products: HikingProduct[]) => RecipeDays[];
```

Behavior:

- Skips rows with empty `recipe_id`.
- Collects unique `day_number`s per recipe and sorts them ascending.
- Sorts recipes by `recipeName` using `localeCompare(other, undefined, { sensitivity: "base" })`,
  which gives a stable case-insensitive order within each script (Latin / Cyrillic).

### Tests added (`hiking-helpers.test.ts`)

- Empty input returns `[]`.
- Multiple rows of one recipe collapse into a single entry, days are unique and sorted.
- Rows with empty `recipe_id` are ignored.
- Recipes are sorted alphabetically and case-insensitively within Latin and Cyrillic alphabets.

`npx vitest run src/components/hiking-page/hiking-helpers.test.ts` — 17/17 passed.

## Hook `useHiddenRecipes(hikingId)`

Storage key: `food-plan:hidden-recipes:${hikingId}`.

```ts
type UseHiddenRecipesResult = {
  hiddenIds: ReadonlySet<string>;
  isHidden: (id: string) => boolean;
  hide: (id: string) => void;
  show: (id: string) => void;
  reset: () => void;
};
```

Implementation notes:

- State is a `Set<string>` initialised lazily inside `useState` from `localStorage`.
- A `typeof window !== "undefined"` guard plus `try/catch` protect against SSR, malformed JSON,
  private-mode `localStorage` denial, and `QuotaExceededError` on writes (errors are swallowed).
- `hide`, `show`, `reset` are no-ops when the underlying set would not change, which keeps the
  reference stable and prevents unnecessary re-renders.
- The persisted format is a plain JSON array of strings, filtered through a `typeof === "string"`
  guard on read so corrupt entries cannot leak into the runtime set.

## Component `RecipesByDays`

Props:

```tsx
type RecipesByDaysProps = {
  hikingId: string;
  hikingProducts: HikingProduct[];
};
```

UI states:

- **No recipes (`all.length === 0`)** — component renders nothing, not even the header.
- **Collapsed (`!isOpen`)** — only the header is rendered (no list, no separators). The header
  contains the chevron, title `Recipes by days (N)`, and a `Show all (K hidden)` button when
  `hiddenCount > 0`. The "Show all" button uses `e.stopPropagation()` so it never toggles the
  block.
- **Expanded (`isOpen`)**
  - If `visible.length > 0`, a `<ul>` renders one `<li>` per recipe with: name (truncate-safe),
    `Days: 1, 3, 5`, and a `Hide` icon button (`EyeOff` from `lucide-react`) with an `aria-label`.
  - If everything is hidden, a small line "All recipes are hidden." is shown instead of the list.

Accessibility:

- Toggle button uses `aria-expanded` and `aria-controls` paired with the body's auto-generated
  `id` from `useId()`.
- Each "Hide" button has an `aria-label` referring to the recipe name.

Styling matches existing hiking-page cards (`rounded-md border`, `text-sm`, muted background).
Icons used: `ChevronDown`, `ChevronRight`, `EyeOff` (already used elsewhere in the project).

## Wiring into Food Plan

`src/components/hiking-page/food-plan.tsx`:

```tsx
<div className="rounded-md border p-3">
  <AddRecipeToHikingForm hikingId={id} />
  <RecipesByDays hikingId={id} hikingProducts={hiking.hiking_products} />
  <DayTabs days={days} defaultValue={defaultDay}>
    ...
  </DayTabs>
</div>
```

Because the component renders `null` when there are no recipes, the toggle never appears for an
empty plan and the existing UI is undisturbed.

## Verification

- `npm run build` — `tsc -b` + `vite build` finished successfully (no type or build errors).
- `npx vitest run src/components/hiking-page/hiking-helpers.test.ts` — 17/17 tests pass,
  including the four new cases for `groupRecipesByDays`.
- Manual checks performed against the contract:
  - Trip with several recipes scheduled on multiple days renders one row per recipe with sorted
    unique day numbers.
  - Hiding a recipe removes it from the list and a `Show all (N hidden)` button appears.
  - Reloading the page preserves the hidden set thanks to `localStorage`.
  - Hiding all recipes leaves only the "All recipes are hidden." line plus the Show-all action.
  - Collapsing the block leaves only the header on screen, with no list or empty placeholder.
  - A trip without any recipes does not render the block at all.

## Decisions & trade-offs

- **Categories filter** was dropped on purpose: `HikingProduct` does not carry recipe categories,
  and the user agreed to replace category filtering with a per-recipe hide-and-restore workflow.
- **Persistence is per-hiking** (the `hikingId` is part of the storage key), so hidden recipes do
  not leak between trips. There is intentionally no global "clear" UI; `reset()` is exposed so
  the "Show all" button serves the same purpose.
- The hook is **feature-specific** (`useHiddenRecipes` rather than a generic `usePersistedSet`)
  to keep the contract narrow and avoid premature generalisation.
- The component is purely **presentational**; all data shaping lives in the helper and all
  persistence in the hook, which makes it easy to unit-test the helper and to reuse the hook
  elsewhere in the food-plan UI in the future.
