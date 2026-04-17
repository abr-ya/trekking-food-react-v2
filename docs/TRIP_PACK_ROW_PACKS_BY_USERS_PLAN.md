# Trip pack row on Packs by Users — implementation plan

## Goal

Add a **Trip** row to the Packs by Users tab: same column grid as member slots (`membersTotal`), drag-and-drop between columns, and persistence of **HikingTripPack** member slots via a **dedicated** API (not the day-pack member-slots route).

## Current behavior (unchanged for day rows)

- `groupProductsByDayAndPack` only includes products with a day pack (`hiking_day_pack_id`). `TRIP_PACK` lines are excluded.
- Day pack slots: `POST /hikings/:id/packs/member-slots` via `useSaveHikingPacksSlots`.
- DnD uses draggable ids `dayNumber:column:packId` and droppable ids `dayNumber:column`.

## API contract

| Action | Route |
|--------|--------|
| Day packs | `POST /hikings/:id/packs/member-slots` |
| Trip packs (bulk HikingTripPack) | `POST /hikings/:id/trip-packs/member-slots` |

Request body uses the same shape as day slots: `{ assignments: { packId: string; memberSlot: number \| null }[] }`, where `packId` is the **hiking trip pack** id (`hiking_trip_pack_id`).

**GET `/hikings/:id`:** `HikingTripPack` includes `member_slot` (normalized from API) for initial column placement and dirty detection.

## Data model (trip row)

- Group `hiking_products` with `packagingKind === "TRIP_PACK"` and non-null `hiking_trip_pack_id` by `hiking_trip_pack_id`.
- Each group becomes one `PackInfo`-compatible cell (`packId` = trip pack id, weights, `member_slot` from nested `hiking_trip_pack`).
- Local state: `tripAssignments: Map<number, string>` (column → pack id or `empty-N`), initialized like day rows (`buildBaseTripAssignments`).

## DnD

- Draggable: `trip:column:packId`
- Droppable: `trip:column`
- `handleDragEnd`: if `active.id` starts with `trip`, swap columns in `tripAssignments` only; day logic unchanged.

## UI

- Trip row **below** day rows: label **Trip**, row total weight, **Save** (trip mutation only).
- Reuse `PackCell`; optional `TripPacksRow` component.

## Header totals

- `columnTotals`: for each column, sum day-pack weights (all days) **plus** trip-pack weight in that column.

## Files to touch

- `src/types/hiking-product.ts` — `member_slot` on `HikingTripPack`
- `src/api/hikings.ts` — `normalizeHikingTripPack`, `postTripPackMemberSlots`
- `src/hooks/use-hikings.ts` — `useSaveTripPackMemberSlots`, exports
- `src/hooks/index.ts` — re-export
- `src/components/hiking-page/hiking-helpers.ts` — `groupTripPacksForUsers`, `buildBaseTripAssignments`
- `src/components/hiking-page/trip-packs-users-row.tsx` — new row component
- `src/components/hiking-page/packs-by-users.tsx` — trip state, DnD branch, merged totals, render trip row

## Risks

- Align request/response types with backend OpenAPI if field names differ (`packId` vs `tripPackId`).
