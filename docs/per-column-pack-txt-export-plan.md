# Per-column pack `.txt` export

## Goal

On the **Packs By Users** tab of the hiking page, add a small `Save .txt` button under each
column header (e.g. under `Pack 1 — 5.752 kg`). Clicking it downloads a plain UTF-8 text
file listing all products that currently sit in that column, ordered by day, plus a final
section with trip-pack products. No backend, no new dependencies.

## Why frontend-only

All the data we need is already on the client:

- [`src/components/hiking-page/packs-by-users.tsx`](../src/components/hiking-page/packs-by-users.tsx)
  builds `packsData = groupProductsByDayAndPack(...)`, `tripPacksData = groupTripPacksForUsers(...)`
  and exposes `resolvePack(day, column)`, `resolveTripPacks(column)`, and a memoised
  `columnTotals: Map<number, number>` (already shown in the header).
- Every `PackInfo.products: ProductSummary[]` carries `{ id, name, totalQuantity }`. The
  app treats `totalQuantity` as grams (see `calculatePackWeight` / `formatWeight` in
  [`hiking-helpers.ts`](../src/components/hiking-page/hiking-helpers.ts)).

So the export is a pure transformation of state already needed for rendering.

## File format (minimal)

For column `N`, plain UTF-8 text:

```
Carpathians 2026 — Pack 1

Day 1: Buckwheat — 200 g
Day 1: Salt — 10 g
Day 2: Pasta — 300 g
Trip: Stove fuel — 250 g

Total: 5.752 kg
```

Rules:

- The first line is a header `{hikingName} — Pack {N}` followed by a blank line. When the
  hiking name is blank, the header degrades to `Pack {N}`.
- Days are listed in the same order as `packsData` (`1..daysTotal`).
- Inside one day, products keep `PackInfo.products` order — same as the visible cell.
- Trip packs follow all days. If the column has more than one trip pack, all their
  products go into a single `Trip:` block; trip-pack labels are not printed in this
  minimal format.
- Use the existing `formatWeight` for unit/format consistency with the UI.
- One trailing blank line, then `Total: <formatWeight(columnTotal)>`, plus a final newline.
- If the column total is 0 (no packs assigned in that column), the button is not rendered.

Filename: `pack-{N}.txt` (literal, no hiking name).

## New code

### `src/lib/download.ts`

Tiny browser-side helper, reusable for future CSV / ODS exports:

```ts
export const downloadTextFile = (
  filename: string,
  content: string,
  mimeType = "text/plain;charset=utf-8",
): void => {
  if (typeof window === "undefined") return;
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};
```

### Helper in `hiking-helpers.ts`

Pure builder:

```ts
export const buildPackColumnTextExport = (params: {
  column: number;
  hikingName: string;
  packsData: PacksByDayData[];
  resolvePack: (day: PacksByDayData, column: number) => PackInfo | undefined;
  resolveTripPacks: (column: number) => PackInfo[];
  totalGrams: number;
}): string;
```

Behavior:

- Emit `{hikingName} — Pack {N}` (or `Pack {N}` when the trimmed name is empty) and a
  blank line.
- Iterate `packsData` in order. For every day where `resolvePack(day, column)` returns a
  pack, emit one line per product:
  `Day {day.dayNumber}: {product.name} — {formatWeight(product.totalQuantity)}`.
- Iterate `resolveTripPacks(column)` and emit per product:
  `Trip: {product.name} — {formatWeight(product.totalQuantity)}`.
- Append blank line, then `Total: {formatWeight(totalGrams)}`.
- Always end with a single trailing newline.

### Tests

Add cases in
[`hiking-helpers.test.ts`](../src/components/hiking-page/hiking-helpers.test.ts):

1. Mixed: two days + one trip pack → verifies row order, separators, and `Total:` line.
2. Day with no pack for the column → that day is silently skipped.
3. Trip-only column → only `Trip:` lines and `Total:`.

## Wiring into the UI

### `PacksByUsers`

Add a memoised handler near `columnTotals`:

```tsx
const handleSavePackList = useCallback((column: number) => {
  if (!packsData) return;
  const total = columnTotals.get(column) ?? 0;
  if (total === 0) return;
  const content = buildPackColumnTextExport({
    column,
    hikingName: hiking?.name ?? "",
    packsData,
    resolvePack,
    resolveTripPacks,
    totalGrams: total,
  });
  downloadTextFile(`pack-${column}.txt`, content);
}, [packsData, columnTotals, hiking?.name, resolvePack, resolveTripPacks]);
```

Pass `onSave={handleSavePackList}` to `<PacksHeader>`.

### `PacksHeader`

Add an optional prop `onSave?: (packNumber: number) => void`. Under the weight line,
render a small ghost button — only when `total > 0`:

```tsx
<div className="text-xs text-muted-foreground">{formatWeight(total)}</div>
{onSave && total > 0 && (
  <Button
    type="button"
    variant="ghost"
    size="sm"
    className="mt-0.5 h-6 gap-1 px-2 text-xs"
    aria-label={`Save Pack ${num} as text`}
    onClick={() => onSave(num)}
  >
    <Download className="size-3" />
    Save .txt
  </Button>
)}
```

Icon `Download` from `lucide-react`.

## Edge cases

- Column total is 0 → button not rendered.
- Trip-only columns → no `Day` lines, only `Trip:` lines and the total.
- Day-only columns → no `Trip:` lines.
- During drag-reassign the handler reads from the same memoised data the cells render, so
  the export always matches what is on screen.
- SSR-safety: `downloadTextFile` no-ops when `window` is undefined.
- Labels stay English (`Day`, `Trip:`, `Total:`) to match the rest of the UI.

## Documentation deliverables

Both files are English-only.

1. **Before implementation** — this file, `docs/per-column-pack-txt-export-plan.md`.
2. **After implementation** — `docs/per-column-pack-txt-export-implementation-report.md`
   with summary, created/changed files, helper signature + tests, button UX,
   verification (`npm run build`, `npm test`, manual download check).

## Files

| File | Action |
|------|--------|
| [`src/components/hiking-page/hiking-helpers.ts`](../src/components/hiking-page/hiking-helpers.ts) | Add `buildPackColumnTextExport`. |
| [`src/components/hiking-page/hiking-helpers.test.ts`](../src/components/hiking-page/hiking-helpers.test.ts) | Add tests for the builder. |
| `src/lib/download.ts` | New file: `downloadTextFile` helper. |
| [`src/components/hiking-page/packs-by-users.tsx`](../src/components/hiking-page/packs-by-users.tsx) | Add `handleSavePackList`, pass `onSave` to `PacksHeader`. |
| [`src/components/hiking-page/packs-by-users-header.tsx`](../src/components/hiking-page/packs-by-users-header.tsx) | Accept `onSave`, render `Save .txt` button per column. |
| `docs/per-column-pack-txt-export-plan.md` | This English plan. |
| `docs/per-column-pack-txt-export-implementation-report.md` | English report after implementation. |

After changes: `npm run build` and `npx vitest run src/components/hiking-page/hiking-helpers.test.ts`.
