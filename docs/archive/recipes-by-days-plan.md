# Recipes by days section on Food Plan

## Context and available data

- Each `HikingProduct` row ([`src/types/hiking-product.ts`](../src/types/hiking-product.ts)) already contains `recipe_id`, `recipe_name`, and `day_number`. That is enough to build lines such as “Borscht — 1, 3, 5”.
- Recipe categories are not present on `HikingProduct`, so a category filter is intentionally out of scope here.
- Trip-plan helpers live in [`src/components/hiking-page/hiking-helpers.ts`](../src/components/hiking-page/hiking-helpers.ts), with tests in [`src/components/hiking-page/hiking-helpers.test.ts`](../src/components/hiking-page/hiking-helpers.test.ts).
- The mount point is [`src/components/hiking-page/food-plan.tsx`](../src/components/hiking-page/food-plan.tsx). The new block sits **above `DayTabs`**, after `AddRecipeToHikingForm`, as a summary view.

## 1. Pure helper

Add to [`hiking-helpers.ts`](../src/components/hiking-page/hiking-helpers.ts):

```ts
export type RecipeDays = { recipeId: string; recipeName: string; days: number[] };

export function groupRecipesByDays(products: HikingProduct[]): RecipeDays[];
```

Behavior:

- Skip rows with empty `recipe_id`.
- For each `recipe_id`, collect unique `day_number`s and sort ascending.
- Sort recipes by `recipeName` using `localeCompare(other, undefined, { sensitivity: "base" })` (Cyrillic + Latin, case-insensitive).

Add unit tests in [`hiking-helpers.test.ts`](../src/components/hiking-page/hiking-helpers.test.ts) covering: multi-day recipe, duplicate days, empty `recipe_id` ignored, alphabetic order across Russian and English names, empty input.

## 2. Hook `useHiddenRecipes(hikingId)`

New file `src/hooks/use-hidden-recipes.ts`. Specific to this feature (not generic):

- LocalStorage key: `food-plan:hidden-recipes:${hikingId}` (per hiking).
- Internal state is a `Set<string>`; lazy read in the `useState` initializer with `try/catch` and a `typeof window !== "undefined"` guard, similar to `theme-provider.tsx`.
- Public API:
  - `hiddenIds: ReadonlySet<string>`
  - `isHidden(id): boolean`
  - `hide(id): void`
  - `show(id): void`
  - `reset(): void` — used by “Show all”.
- Persist on every change; ignore write errors silently (private mode / quota).
- Export from [`src/hooks/index.ts`](../src/hooks/index.ts).

## 3. Component `RecipesByDays`

New file `src/components/hiking-page/recipes-by-days.tsx`, presentational only:

- Props: `{ hikingId: string; hikingProducts: HikingProduct[] }`.
- State / data:
  - `useState(true)` for `isOpen` (open by default).
  - `useHiddenRecipes(hikingId)`.
  - `useMemo`: `all = groupRecipesByDays(hikingProducts)`; `visible = all.filter(r => !isHidden(r.recipeId))`; `hiddenCount = all.length - visible.length`.
- **Header (always rendered)** — the only thing on screen when collapsed:
  - Toggle button with `ChevronDown` (open) or `ChevronRight` (collapsed), `aria-expanded={isOpen}`, `aria-controls` paired with the body `id`.
  - Title text “Recipes by days” (optionally with a count, e.g. “Recipes by days (5)”).
  - “Show all (N hidden)” button on the right when `hiddenCount > 0`; rendered as a `<button>` with `onClick` + `e.stopPropagation()` so it does not toggle the block.
- **Collapsed (`!isOpen`)**: render only the header. The body is not mounted at all.
- **Expanded (`isOpen`)**: render a `<ul>` of rows, each row contains:
  - Recipe name (truncate-safe).
  - `Days: 1, 3, 5` to the right (or below the name on narrow widths).
  - “Hide” button with `EyeOff` icon and an `aria-label`.
- Empty states:
  - `all.length === 0` → render nothing (no header either).
  - `visible.length === 0 && all.length > 0` → in expanded view show a single line “All recipes are hidden” instead of `<ul>`; header behaves normally.
- Styling matches other hiking-page cards (e.g. [`eating-card.tsx`](../src/components/hiking-page/eating-card.tsx)): `rounded-md border ...`, `text-sm`. Icons `ChevronDown`, `ChevronRight`, `EyeOff` come from `lucide-react`.
- Export from [`src/components/index.ts`](../src/components/index.ts).

## 4. Wiring into Food Plan

In [`food-plan.tsx`](../src/components/hiking-page/food-plan.tsx) add the block above `DayTabs`:

```tsx
<div className="rounded-md border p-3">
  <AddRecipeToHikingForm hikingId={id} />
  <RecipesByDays hikingId={id} hikingProducts={hiking.hiking_products} />
  <DayTabs days={days} defaultValue={defaultDay}>
    ...
  </DayTabs>
</div>
```

If there are no recipes in `hiking_products`, the component renders nothing, so the toggle never appears for an empty plan.

## Files to change

| File | Action |
|------|--------|
| [`src/components/hiking-page/hiking-helpers.ts`](../src/components/hiking-page/hiking-helpers.ts) | Add `groupRecipesByDays` and `RecipeDays` type. |
| [`src/components/hiking-page/hiking-helpers.test.ts`](../src/components/hiking-page/hiking-helpers.test.ts) | Tests for `groupRecipesByDays`. |
| `src/hooks/use-hidden-recipes.ts` | New hook. |
| [`src/hooks/index.ts`](../src/hooks/index.ts) | Export `useHiddenRecipes`. |
| `src/components/hiking-page/recipes-by-days.tsx` | New component. |
| [`src/components/index.ts`](../src/components/index.ts) | Export `RecipesByDays`. |
| [`src/components/hiking-page/food-plan.tsx`](../src/components/hiking-page/food-plan.tsx) | Mount above `DayTabs`. |

After changes: `npm run build` and `npm test`.
