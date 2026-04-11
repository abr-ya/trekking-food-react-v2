# Plan: Day Comments API & Hooks

## Overview

CRUD operations for per-day hiking comments. One comment per day. Comment text: 3–500 characters. Comments are returned inside the hiking detail response (`GET /hikings/:id`) in the `day_comments` field — no separate GET endpoint needed.

---

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/hikings/{id}/day-comments` | Create a comment for a day |
| `PATCH` | `/hikings/{id}/day-comments/{dayNumber}` | Update a day's comment |
| `DELETE` | `/hikings/{id}/day-comments/{dayNumber}` | Delete a day's comment |

### Request Bodies

**POST** (`CreateHikingDayCommentPayload`):
```json
{
  "dayNumber": 1,
  "comment": "Early start; cache water at the stream"
}
```

**PATCH** (`UpdateHikingDayCommentPayload`):
```json
{
  "comment": "Updated: later start"
}
```

**DELETE**: no body. Returns `204 No Content`.

### Response in Hiking Detail

```json
{
  "...": "...",
  "day_comments": [
    {
      "day_number": 1,
      "comment": "Early start; cache water at the stream"
    }
  ]
}
```

---

## Validation Rules

| Field | Rule | Message |
|-------|------|---------|
| `comment` | required, min 3, max 500 chars | `"Comment must be at least 3 characters"` / `"Comment must be at most 500 characters"` |
| `dayNumber` | required, integer, ≥ 1 | *(client-side only, from hiking context)* |

---

## Step-by-Step Implementation

### Step 1: Types (`src/types/hiking.ts`)

Add interfaces:

```ts
export interface HikingDayComment {
  day_number: number;
  comment: string;
}

export type CreateHikingDayCommentPayload = {
  dayNumber: number;
  comment: string;
};

export type UpdateHikingDayCommentPayload = {
  comment: string;
};
```

### Step 2: API Functions (`src/api/hikings.ts`)

| Function | Method | Path | Returns |
|----------|--------|------|---------|
| `postHikingDayComment` | POST | `/hikings/:id/day-comments` | `void` |
| `patchHikingDayComment` | PATCH | `/hikings/:id/day-comments/:dayNumber` | `void` |
| `deleteHikingDayComment` | DELETE | `/hikings/:id/day-comments/:dayNumber` | `void` |

Follow existing naming conventions: `post*`, `patch*`, `delete*` + resource name.

### Step 3: Hooks (`src/hooks/use-hikings.ts`)

No separate `useQuery` needed (comments come with hiking detail).

Add 3 `useMutation` hooks:

| Hook | Variables Type | Invalidation |
|------|---------------|--------------|
| `useCreateHikingDayComment` | `CreateHikingDayCommentVariables` | `hikingQueryKeys.detail(hikingId)` |
| `useUpdateHikingDayComment` | `UpdateHikingDayCommentVariables` | `hikingQueryKeys.detail(hikingId)` |
| `useDeleteHikingDayComment` | `DeleteHikingDayCommentVariables` | `hikingQueryKeys.detail(hikingId)` |

**Variables types:**

```ts
export type CreateHikingDayCommentVariables = {
  hikingId: string;
  payload: CreateHikingDayCommentPayload;
};

export type UpdateHikingDayCommentVariables = {
  hikingId: string;
  dayNumber: number;
  payload: UpdateHikingDayCommentPayload;
};

export type DeleteHikingDayCommentVariables = {
  hikingId: string;
  dayNumber: number;
};
```

### Step 4: Zod Schema (optional — for forms)

```ts
import { z } from "zod";

export const dayCommentSchema = z.object({
  comment: z
    .string()
    .min(3, "Comment must be at least 3 characters")
    .max(500, "Comment must be at most 500 characters"),
  dayNumber: z.number().int().min(1),
});
```

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/types/hiking.ts` | Add `HikingDayComment`, `CreateHikingDayCommentPayload`, `UpdateHikingDayCommentPayload` |
| `src/api/hikings.ts` | Add 3 API functions (`postHikingDayComment`, `patchHikingDayComment`, `deleteHikingDayComment`) |
| `src/hooks/use-hikings.ts` | Add 3 mutation hooks + Variables types |
| `src/schemas/day-comment.ts` (new) | Add `dayCommentSchema` for form validation |

---

## Notes

- **No separate GET endpoint** — comments are included in `GET /hikings/:id` detail response
- **DELETE returns 204** — use `apiFetch<void>()`, no body parsing
- **One comment per day** — enforced server-side; client can rely on `dayNumber` as unique key
- **Toast messages** — will be implemented separately as a centralized task (not in this PR)

---

*Plan created: April 11, 2026*
