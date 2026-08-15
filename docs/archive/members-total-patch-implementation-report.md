# Change hiking group size (`members-total`) — implementation report

## Summary

Integrated the backend endpoint `PATCH /hikings/:id/members-total` into the React app so
owners and hiking admins can change `membersTotal` after a plan is created. This is the
**only** supported way to update group size; the UI lives on the hiking **Overview** tab
(`EditMembersTotalDialog`, **Change** button next to Members total).

Decreasing group size requires an explicit second-step confirmation describing pack
deletion, unassigned meals, slot clearing, and total recalculation. Increasing group size
calls the API immediately and shows a success toast reminding users to run Auto-distribute
if new member packs are needed.

`vegetariansTotal` remains editable only at create time (`POST /hikings`). README,
`BUSINESS_LOGIC.md`, and `FEATURE_MEMBERS_TOTAL_API_EN.md` document this as a **TODO** for
a future dedicated endpoint.

## Created / changed files

| File | Action |
|------|--------|
| [`src/types/hiking.ts`](../src/types/hiking.ts) | Added `UpdateHikingMembersTotalPayload`. |
| [`src/api/hikings.ts`](../src/api/hikings.ts) | Added `normalizeHikingDetailRow`, `patchHikingMembersTotal`; refactored `getHiking` and `postAutoDistributePacks` to use shared normalizer. |
| [`src/schemas/hiking.ts`](../src/schemas/hiking.ts) | Added `createUpdateMembersTotalSchema`, `UpdateMembersTotalFormData`. |
| [`src/hooks/use-hikings.ts`](../src/hooks/use-hikings.ts) | Added `useUpdateHikingMembersTotal`, `UpdateHikingMembersTotalVariables`. |
| [`src/hooks/index.ts`](../src/hooks/index.ts) | Re-exported hook and variables type. |
| [`src/components/dialogs/edit-members-total-dialog.tsx`](../src/components/dialogs/edit-members-total-dialog.tsx) | **New:** form + decrease confirm dialog. |
| [`src/components/hiking-page/hiking-info.tsx`](../src/components/hiking-page/hiking-info.tsx) | Wired `EditMembersTotalDialog` next to Members total. |
| [`src/components/index.ts`](../src/components/index.ts) | Exported `EditMembersTotalDialog` and props type. |
| [`README.md`](../README.md) | Documented API, hook, UI, invalidation, vegetarians TODO. |
| [`docs/BUSINESS_LOGIC.md`](BUSINESS_LOGIC.md) | Hiking rules, use case §11, future vegetarians section, formula note. |
| [`docs/FEATURE_MEMBERS_TOTAL_API_EN.md`](FEATURE_MEMBERS_TOTAL_API_EN.md) | **New:** endpoint + frontend reference. |
| [`docs/PROJECT_ANALYSIS.md`](PROJECT_ANALYSIS.md) | Added `PATCH /hikings/:id/members-total` to API table. |
| [`docs/members-total-patch-plan.md`](members-total-patch-plan.md) | English plan (written before implementation). |
| [`docs/members-total-patch-implementation-report.md`](members-total-patch-implementation-report.md) | This report. |

## API + hook

```ts
// src/types/hiking.ts
export type UpdateHikingMembersTotalPayload = { membersTotal: number };

// src/api/hikings.ts
function normalizeHikingDetailRow(row: HikingDetailApiRow): HikingDetail {
  const base = normalizeHiking(row);
  const hiking_products = normalizeHikingProductsList(row.hiking_products);
  const admins = row.admins as HikingAdmin[];
  const day_packs = row.day_packs;
  const day_comments = row.day_comments ?? [];
  const trip_packs = row.trip_packs ?? [];
  return { ...base, hiking_products, admins, day_packs, day_comments, trip_packs };
}

export async function patchHikingMembersTotal(
  hikingId: string,
  payload: UpdateHikingMembersTotalPayload,
): Promise<HikingDetail> {
  const raw = await apiFetch<unknown>(`/hikings/${encodeURIComponent(hikingId)}/members-total`, {
    method: "PATCH",
    body: payload,
  });
  return normalizeHikingDetailRow(unwrapHikingDetailResponse(raw));
}

// src/hooks/use-hikings.ts
export const useUpdateHikingMembersTotal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ hikingId, payload }: UpdateHikingMembersTotalVariables) =>
      patchHikingMembersTotal(hikingId, payload),
    onSuccess: async (_data, { hikingId }) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: hikingQueryKeys.detail(hikingId) }),
        queryClient.invalidateQueries({ queryKey: hikingQueryKeys.all }),
        queryClient.invalidateQueries({ queryKey: hikingQueryKeys.productTotals(hikingId) }),
      ]);
    },
  });
};
```

`getHiking` and `postAutoDistributePacks` now call `normalizeHikingDetailRow` instead of
duplicating the same assembly logic — behavior is unchanged.

## Schema

```ts
export const createUpdateMembersTotalSchema = (vegetariansTotal: number) =>
  z
    .object({
      membersTotal: z.number().int().min(1, "At least 1 member"),
    })
    .superRefine((data, ctx) => {
      if (data.membersTotal < vegetariansTotal) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Cannot be less than vegetarians count",
          path: ["membersTotal"],
        });
      }
    });
```

The factory takes the hiking's current `vegetariansTotal` so the client enforces
`membersTotal >= vegetariansTotal` before the request (server returns `400` if violated).

## UI: `EditMembersTotalDialog`

**Props:** `hikingId`, `currentMembersTotal`, `vegetariansTotal`.

**Main dialog**

- Trigger: outline **Change** button with `Users` icon (same size pattern as Add admin).
- `RHFInput` for `membersTotal` with `valueAsNumber`, `min={max(1, vegetariansTotal)}`.
- Description notes minimum group size and that vegetarians cannot be edited yet.
- **Continue** disabled when value equals `currentMembersTotal` or while pending.
- Inline error when mutation fails (`isError` + `error.message`); `apiFetch` also shows a
  toast on HTTP errors.

**Decrease flow**

- If `membersTotal < currentMembersTotal` after valid submit → store pending value, open
  confirm dialog (does not PATCH yet).
- Confirm title: `Decrease group size to {n}?` with `AlertTriangle`.
- Bullet list: total recalculation (manual overrides lost), day packs with
  `pack_number > n` deleted (meals unassigned), member slots `> n` cleared on day/trip packs.
- **Yes, decrease** runs the same `submitMembersTotal` path as increase.

**Increase flow**

- PATCH immediately on **Continue**.
- Success toast: product totals updated; run Auto-distribute per day if new member packs are
  needed.

**Decrease success toast**

- Notes new group size and that extra packs / slots above the new count were adjusted.

**State reset**

- Closing the main dialog resets form to `currentMembersTotal`, clears confirm state, and
  resets the mutation error state.

## Wiring: `HikingInfo`

```tsx
<div className="flex flex-wrap items-center gap-3">
  <p>
    <span className="text-foreground font-medium">Members total:</span> {hiking.membersTotal}
  </p>
  <EditMembersTotalDialog
    hikingId={hiking.id}
    currentMembersTotal={hiking.membersTotal}
    vegetariansTotal={hiking.vegetariansTotal}
  />
</div>
```

After a successful PATCH, invalidated queries refresh Overview, list cards, Food plan /
Packs tabs (via `useHiking`), and Shopping list totals (via `productTotals`).

## Documentation updates

| Document | What was added |
|----------|----------------|
| [`README.md`](../README.md) | `patchHikingMembersTotal`, `useUpdateHikingMembersTotal`, `EditMembersTotalDialog`, query keys, vegetarians TODO |
| [`BUSINESS_LOGIC.md`](BUSINESS_LOGIC.md) | Transaction rules, use case §11, **Future: edit vegetarians count**, formula override note |
| [`FEATURE_MEMBERS_TOTAL_API_EN.md`](FEATURE_MEMBERS_TOTAL_API_EN.md) | Full API + frontend mapping + checklist |
| [`PROJECT_ANALYSIS.md`](PROJECT_ANALYSIS.md) | Endpoint row in Hikings table |

## Out of scope / follow-ups

- **Edit `vegetariansTotal` after create** — documented as TODO; no API or UI in this
  delivery.
- **Frontend owner/admin gating** — not added (consistent with other hiking mutations;
  server returns `403`).
- **Optimistic `setQueryData`** — not used; invalidate-only matches other hiking mutations.
- **Returning PATCH data into local pack DnD state** — Packs tabs rely on refetched
  `useHiking` detail (same as auto-distribute invalidation pattern).

## Verification

- `npm run build` — `tsc -b && vite build` completed without errors.
- Linter (`ReadLints`) — no issues on new/changed source files.
- **Manual checks** (recommended against a running API):

| Scenario | Expected |
|----------|----------|
| Overview → Change → increase | PATCH succeeds; toast mentions Auto-distribute; member columns grow on Packs tabs after refetch |
| Decrease with confirm | Confirm dialog appears; after confirm, packs with `pack_number > n` gone; columns shrink |
| Same value as current | Continue disabled |
| `membersTotal < vegetariansTotal` | Zod blocks submit and/or server `400` with message in toast + inline |
| Hiking list card | People count updates after change |
| Shopping list | Aggregated totals refresh (`productTotals` invalidated) |

## Decisions & trade-offs

- **`normalizeHikingDetailRow`** — small refactor removes three copy-pasted blocks in
  `getHiking`, `postAutoDistributePacks`, and the new PATCH; lowers risk of drift when the
  detail shape grows.
- **Two dialogs for decrease** — matches `AutoDistributeButton` warning pattern; keeps the
  edit form simple while making destructive shrink explicit.
- **"Continue" label on main dialog** — accurate for decrease (leads to confirm) and
  increase (submits); unchanged value never submits.
- **Invalidating `hikingQueryKeys.all`** — keeps list cards in sync with Overview without
  passing updated counts through props.
- **Vegetarians read-only in UI** — avoids implying a PATCH exists; docs point to future
  work instead of silently ignoring the field.
