# Feature: Change hiking group size (`members-total`)

## Overview

Dedicated backend endpoint and frontend flow to change `membersTotal` for an existing hiking plan. This is the **only** supported way to update group size after creation.

Related docs:

- Implementation plan: [`members-total-patch-plan.md`](members-total-patch-plan.md)
- Business rules: [`BUSINESS_LOGIC.md`](BUSINESS_LOGIC.md) — Hiking entity, use case §11, calculation formulas

---

## Endpoint

| Method | Path | Description |
|--------|------|-------------|
| `PATCH` | `/hikings/{id}/members-total` | Change group size in one transaction |

### Request body

`UpdateHikingMembersTotalPayload` (camelCase):

```json
{
  "membersTotal": 5
}
```

| Field | Rules |
|-------|--------|
| `membersTotal` | Positive integer; must not be less than the hiking's `vegetariansTotal` |

### Response

Full hiking row after the change — **same shape as** `GET /hikings/:id` (`hiking_products`, `day_packs`, `admins`, `day_comments`, `trip_packs`, …).

The React client normalizes snake_case / camelCase via `patchHikingMembersTotal` → `normalizeHikingDetailRow`.

### Errors

| Status | Typical cause |
|--------|----------------|
| `400` | Invalid `membersTotal`, or `membersTotal < vegetariansTotal` |
| `403` | Caller is not owner or hiking admin |

### Authorization

Owner or hiking admin only.

### Server behavior (summary)

In one transaction:

1. Recomputes every `HikingProduct.total_quantity` as `personal_quantity × membersTotal` (overrides manual totals).
2. **When decreasing:** deletes `HikingDayPack` rows with `pack_number > newCount` (meal lines return to unassigned); clears `member_slot > newCount` on day packs and trip packs.
3. Persists the new `members_total`.

**When increasing:** steps 1 and 3 only — no packs are created. Re-run auto-distribute per day if new member columns need packs.

---

## Frontend mapping

| Layer | Symbol | Location |
|-------|--------|----------|
| Type | `UpdateHikingMembersTotalPayload` | [`src/types/hiking.ts`](../src/types/hiking.ts) |
| API | `patchHikingMembersTotal` | [`src/api/hikings.ts`](../src/api/hikings.ts) |
| Schema | `createUpdateMembersTotalSchema(vegetariansTotal)` | [`src/schemas/hiking.ts`](../src/schemas/hiking.ts) |
| Hook | `useUpdateHikingMembersTotal` | [`src/hooks/use-hikings.ts`](../src/hooks/use-hikings.ts) |
| UI | `EditMembersTotalDialog` | [`src/components/dialogs/edit-members-total-dialog.tsx`](../src/components/dialogs/edit-members-total-dialog.tsx) |
| Page | Overview tab — `HikingInfo` | [`src/components/hiking-page/hiking-info.tsx`](../src/components/hiking-page/hiking-info.tsx) |

### Query invalidation (`useUpdateHikingMembersTotal`)

On success:

- `hikingQueryKeys.detail(hikingId)`
- `hikingQueryKeys.all` (hiking list cards show people count)
- `hikingQueryKeys.productTotals(hikingId)`

### UI behavior

- **Change** button next to Members total on the hiking Overview tab.
- Form validates `membersTotal >= max(1, vegetariansTotal)`.
- **Increase:** PATCH immediately; success toast suggests Auto-distribute if new member packs are needed.
- **Decrease:** second confirmation dialog (`AlertTriangle`) listing pack deletion, unassigned meals, slot clearing, and total recalculation before PATCH.
- **Errors:** `apiFetch` shows a toast; the dialog also shows an inline message.

---

## TODO: edit `vegetariansTotal` after create

**Not implemented** in this feature.

- **Create:** `vegetariansTotal` is set in `POST /hikings` (see [`create-hiking-form.tsx`](../src/components/forms/create-hiking-form.tsx)).
- **After create:** no API or UI to change vegetarians; README and [`BUSINESS_LOGIC.md`](BUSINESS_LOGIC.md) document this gap.
- **Future:** a dedicated endpoint should enforce `vegetariansTotal ≤ membersTotal` (user may need to increase group size first via `members-total`).

---

## Manual test checklist

- [ ] Overview → Change → increase: detail and list refresh; toast mentions auto-distribute
- [ ] Decrease: confirm dialog → packs above new size removed; Packs tabs column count matches
- [ ] `membersTotal < vegetariansTotal`: client validation and/or `400`
- [ ] Shopping list / product totals reflect new totals after change
