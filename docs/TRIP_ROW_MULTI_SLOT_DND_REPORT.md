# Trip row multi-slot DnD — implementation report

## Summary

The **Trip** row on **Packs by Users** now matches the intended behavior: there is always one column per member (`membersTotal`), **every** column is a valid drop target (including empty ones), and **multiple** hiking trip packs can live in the same member zone. Drag-and-drop is a **move** (remove from source list, append to target list), not a swap like day packs.

Day pack rows and the day branch of `handleDragEnd` are **unchanged** (still swap, still `disabled={!pack}` on day droppables).

## API

No contract change. Trip member slots are still saved with:

- `POST /hikings/:hikingId/trip-packs/member-slots`
- Body: `TripPackMemberSlotsPayload` — `{ assignments: { packId: string; memberSlot: number | null }[] }`

Multiple assignments may share the same `memberSlot` (one row per trip pack).

## Client behavior

| Area | Behavior |
|------|----------|
| Trip state | `Map<number, string[]>` — column → ordered list of `hiking_trip_pack_id` values |
| Initial layout | [`buildBaseTripAssignments`](../src/components/hiking-page/hiking-helpers.ts): packs with `member_slot` in `1…membersTotal` are grouped into that column; others are placed **round-robin** across columns |
| Dirty / save | [`findTripPackColumn`](../src/components/hiking-page/hiking-helpers.ts) maps each pack to its current column; compare to server `member_slot` |
| Column totals | Sum **all** trip pack weights in each column |
| Drag end (`trip:`) | Parse `trip:fromCol:packId` (pack id = segments after column, joined); drop target column from `trip:toCol` or from `trip:toCol:otherPackId` when hovering another pack |

## Files touched

| File | Change |
|------|--------|
| [`docs/TRIP_ROW_MULTI_SLOT_DND_PLAN.md`](TRIP_ROW_MULTI_SLOT_DND_PLAN.md) | English plan (saved before implementation) |
| [`src/components/hiking-page/hiking-helpers.ts`](../src/components/hiking-page/hiking-helpers.ts) | `TripColumnAssignments`, new `buildBaseTripAssignments`, `findTripPackColumn` |
| [`src/components/hiking-page/packs-by-users.tsx`](../src/components/hiking-page/packs-by-users.tsx) | Trip list state, `resolveTripPacks`, trip DnD move, payload/dirty/totals |
| [`src/components/hiking-page/trip-packs-users-row.tsx`](../src/components/hiking-page/trip-packs-users-row.tsx) | Droppable always on; stack of `PackCell`; row total over all packs |
| [`src/components/hiking-page/hiking-helpers.test.ts`](../src/components/hiking-page/hiking-helpers.test.ts) | Tests for grouping by slot, round-robin, `findTripPackColumn` |

## Limitations

- **Order inside a column** is client-only until refresh; the API stores `memberSlot`, not ordering within a zone.
- **Drop on same column** is a no-op (no in-column reorder).

## Verification

- `npx tsc --noEmit`
- `npm test -- --run src/components/hiking-page/hiking-helpers.test.ts`
