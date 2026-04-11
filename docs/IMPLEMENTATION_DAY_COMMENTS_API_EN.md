# Implementation: Day Comments API & Hooks

## Overview

Added CRUD API functions and TanStack Query mutation hooks for per-day hiking comments. Each day in a hiking can have at most one comment (text: 3–500 characters). Comments are returned inside the hiking detail response (`GET /hikings/:id`) in the `day_comments` field — no separate GET endpoint is needed.

**Completion Date**: April 11, 2026

---

## Endpoints

| Method | Path | Description | Returns |
|--------|------|-------------|---------|
| `POST` | `/hikings/{id}/day-comments` | Create a comment for a day | `void` |
| `PATCH` | `/hikings/{id}/day-comments/{dayNumber}` | Update a day's comment | `void` |
| `DELETE` | `/hikings/{id}/day-comments/{dayNumber}` | Delete a day's comment | `204 No Content` |

All mutations invalidate `hikingQueryKeys.detail(hikingId)` so the hiking detail refetches with updated comments.

---

## Step-by-Step Changes

### Step 1: Types (`src/types/hiking.ts`)

Added three type definitions:

```ts
/** Day comment as returned inside hiking detail `day_comments`. */
export type HikingDayComment = {
  day_number: number;
  comment: string;
};

/** Body for `POST /hikings/:id/day-comments`. */
export type CreateHikingDayCommentPayload = {
  dayNumber: number;
  comment: string;
};

/** Body for `PATCH /hikings/:id/day-comments/:dayNumber`. */
export type UpdateHikingDayCommentPayload = {
  comment: string;
};
```

**Design notes:**
- `HikingDayComment` uses `day_number` (snake_case) to match the shape of the hiking detail response from the API.
- Payload types use `dayNumber` (camelCase) for consistency with the client-side codebase. The API client (`apiFetch`) passes body as-is; the backend accepts camelCase for mutations.

---

### Step 2: API Functions (`src/api/hikings.ts`)

Added three API functions following the existing naming convention (`post*`, `patch*`, `delete*` + resource name):

```ts
export async function postHikingDayComment(
  hikingId: string,
  payload: CreateHikingDayCommentPayload,
): Promise<void>

export async function patchHikingDayComment(
  hikingId: string,
  dayNumber: number,
  payload: UpdateHikingDayCommentPayload,
): Promise<void>

export async function deleteHikingDayComment(
  hikingId: string,
  dayNumber: number,
): Promise<void>
```

All three functions use `apiFetch<void>()` since the server returns no body content on success. The URL is constructed as `/hikings/:id/day-comments` (POST) and `/hikings/:id/day-comments/:dayNumber` (PATCH, DELETE).

---

### Step 3: Mutation Hooks (`src/hooks/use-hikings.ts`)

Added three `useMutation` hooks:

| Hook | Variables Type | Invalidation |
|------|---------------|--------------|
| `useCreateHikingDayComment()` | `CreateHikingDayCommentVariables` | `hikingQueryKeys.detail(hikingId)` |
| `useUpdateHikingDayComment()` | `UpdateHikingDayCommentVariables` | `hikingQueryKeys.detail(hikingId)` |
| `useDeleteHikingDayComment()` | `DeleteHikingDayCommentVariables` | `hikingQueryKeys.detail(hikingId)` |

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

**Hook pattern** (same for all three):

```ts
export const useCreateHikingDayComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ hikingId, payload }: CreateHikingDayCommentVariables) =>
      postHikingDayComment(hikingId, payload),
    onSuccess: async (_data, { hikingId }) => {
      await queryClient.invalidateQueries({ queryKey: hikingQueryKeys.detail(hikingId) });
    },
  });
};
```

All hooks follow the established project pattern:
- `mutationFn` destructures the variables object
- `onSuccess` invalidates the hiking detail query to trigger a refetch

---

### Step 4: Zod Schema (`src/schemas/day-comment.ts`)

Created a new schema file for form validation:

```ts
import { z } from "zod";

export const dayCommentSchema = z.object({
  comment: z
    .string()
    .trim()
    .min(3, "Comment must be at least 3 characters")
    .max(500, "Comment must be at most 500 characters"),
  dayNumber: z.number().int().min(1),
});

export type DayCommentFormData = z.infer<typeof dayCommentSchema>;
```

**Validation rules:**
- `comment`: required, trimmed, min 3 chars, max 500 chars
- `dayNumber`: required, integer, ≥ 1

All error messages are in English.

---

### Step 5: Barrel File Exports (`src/hooks/index.ts`)

Added exports for the new hooks and their variable types:

**Hooks:**
- `useCreateHikingDayComment`
- `useUpdateHikingDayComment`
- `useDeleteHikingDayComment`

**Types:**
- `CreateHikingDayCommentVariables`
- `UpdateHikingDayCommentVariables`
- `DeleteHikingDayCommentVariables`

---

## Files Modified

| File | Changes |
|------|---------|
| `src/types/hiking.ts` | + 3 type definitions (`HikingDayComment`, `CreateHikingDayCommentPayload`, `UpdateHikingDayCommentPayload`) |
| `src/api/hikings.ts` | + 3 API functions (`postHikingDayComment`, `patchHikingDayComment`, `deleteHikingDayComment`) + import updates |
| `src/hooks/use-hikings.ts` | + 3 mutation hooks + 3 Variables types + import updates |
| `src/hooks/index.ts` | + 6 exports (3 hooks + 3 types) |
| `src/schemas/day-comment.ts` | ✨ New file: `dayCommentSchema` + `DayCommentFormData` type |

---

## Usage Examples

### Create a comment

```tsx
import { useCreateHikingDayComment } from "@/hooks";

function AddCommentButton({ hikingId }: { hikingId: string }) {
  const { mutate, isPending } = useCreateHikingDayComment();

  return (
    <button
      onClick={() =>
        mutate({
          hikingId,
          payload: { dayNumber: 1, comment: "Early start; cache water at the stream" },
        })
      }
      disabled={isPending}
    >
      Add comment
    </button>
  );
}
```

### Update a comment

```tsx
import { useUpdateHikingDayComment } from "@/hooks";

function EditCommentButton({ hikingId }: { hikingId: string }) {
  const { mutate, isPending } = useUpdateHikingDayComment();

  return (
    <button
      onClick={() =>
        mutate({
          hikingId,
          dayNumber: 1,
          payload: { comment: "Updated: later start" },
        })
      }
      disabled={isPending}
    >
      Update comment
    </button>
  );
}
```

### Delete a comment

```tsx
import { useDeleteHikingDayComment } from "@/hooks";

function DeleteCommentButton({ hikingId }: { hikingId: string }) {
  const { mutate, isPending } = useDeleteHikingDayComment();

  return (
    <button
      onClick={() => mutate({ hikingId, dayNumber: 1 })}
      disabled={isPending}
    >
      Delete comment
    </button>
  );
}
```

### Accessing comments in hiking detail

Comments are included in the `HikingDetail` response (via `useHiking(id)`):

```tsx
import { useHiking } from "@/hooks";

function CommentsList({ hikingId }: { hikingId: string }) {
  const { data: hiking } = useHiking(hikingId);

  // day_comments is not normalized — it comes directly from the API
  const comments = hiking?.day_comments ?? [];

  return (
    <ul>
      {comments.map((c) => (
        <li key={c.day_number}>
          Day {c.day_number}: {c.comment}
        </li>
      ))}
    </ul>
  );
}
```

---

## Verification

- **TypeScript:** `npm run tsc` — ✅ No errors
- **Build:** `npm run build` — passes without errors

---

## Notes

- **No separate GET endpoint** — comments are part of the hiking detail response
- **DELETE returns 204** — all three API functions use `Promise<void>`
- **One comment per day** — enforced server-side; client can rely on `dayNumber` as unique key
- **`day_comments` is not normalized** — the field comes from the API as-is (snake_case), similar to `day_packs`
- **Toast messages** — will be implemented centrally as a separate task (not part of this implementation)

---

*Implementation completed: April 11, 2026*
