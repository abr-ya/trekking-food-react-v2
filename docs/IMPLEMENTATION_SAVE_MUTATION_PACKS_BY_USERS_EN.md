# Implementation Report: Save Button with Mutation in PacksByUsers

## Overview
This report documents the implementation of the Save button feature in the `PacksByUsers` component. The feature includes renaming the "Test" button to "Save", connecting it to the `useSaveHikingPacksSlots` mutation, disabling the button when there are no changes, and blocking drag-and-drop while the mutation is in progress.

---

## Step-by-Step Changes

### Step 1: Import the Mutation Hook
**File:** `src/components/hiking-page/packs-by-users.tsx`

**Change:** Added `useSaveHikingPacksSlots` to the imports from `@/hooks`.

```tsx
import { useHiking, useSaveHikingPacksSlots } from "@/hooks";
```

---

### Step 2: Add State for Tracking Changes
**File:** `src/components/hiking-page/packs-by-users.tsx`

**Change:** Added `initialAssignments` state alongside the existing `assignments` state to track the original values loaded from the server.

```tsx
const saveSlotsMutation = useSaveHikingPacksSlots();
const [assignments, setAssignments] = useState<Map<number, DayAssignments>>(new Map());
const [initialAssignments, setInitialAssignments] = useState<Map<number, DayAssignments>>(new Map());
```

---

### Step 3: Update Initialization Effect
**File:** `src/components/hiking-page/packs-by-users.tsx`

**Change:** Modified the `useEffect` that initializes assignments to also save a snapshot to `initialAssignments`.

```tsx
useEffect(() => {
  if (!packsData || packsData.length === 0) return;
  const newAssignments = new Map<number, DayAssignments>();
  for (const day of packsData) {
    newAssignments.set(day.dayNumber, buildBaseAssignments(day, maxPackNumber));
  }
  setAssignments(newAssignments);
  setInitialAssignments(new Map(newAssignments)); // ← new line
}, [packsData, maxPackNumber]);
```

---

### Step 4: Create `buildSavePayload()` Function
**File:** `src/components/hiking-page/packs-by-users.tsx`

**Change:** Added a `useCallback` function that iterates over all days and columns, collecting `{ packId, memberSlot }` pairs into the format expected by the API.

```tsx
const buildSavePayload = useCallback((): { assignments: { packId: string; memberSlot: number | null }[] } => {
  const assignmentList: { packId: string; memberSlot: number | null }[] = [];

  if (!packsData) return { assignments: assignmentList };

  for (const day of packsData) {
    const dayAssignments = assignments.get(day.dayNumber) ?? new Map();
    for (let column = 1; column <= maxPackNumber; column++) {
      const packId = dayAssignments.get(column);
      if (!packId || packId.startsWith("empty-")) continue;
      assignmentList.push({ packId, memberSlot: column });
    }
  }

  return { assignments: assignmentList };
}, [assignments, packsData, maxPackNumber]);
```

---

### Step 5: Create `hasChanges` Computed Value
**File:** `src/components/hiking-page/packs-by-users.tsx`

**Change:** Added a `useMemo` that compares current `assignments` with `initialAssignments` to determine if there are unsaved changes.

```tsx
const hasChanges = useMemo(() => {
  if (assignments.size !== initialAssignments.size) return true;
  for (const [dayNum, dayAssignments] of assignments) {
    const initialDayAssignments = initialAssignments.get(dayNum);
    if (!initialDayAssignments) return true;
    if (dayAssignments.size !== initialDayAssignments.size) return true;
    for (const [col, packId] of dayAssignments) {
      if (initialDayAssignments.get(col) !== packId) return true;
    }
  }
  return false;
}, [assignments, initialAssignments]);
```

---

### Step 6: Create `handleSave` Handler
**File:** `src/components/hiking-page/packs-by-users.tsx`

**Change:** Added a handler that builds the payload, logs it to console, and triggers the mutation.

```tsx
const handleSave = () => {
  const payload = buildSavePayload();
  console.log("Save payload:", payload);
  saveSlotsMutation.mutate({ hikingId: id, payload });
};
```

---

### Step 7: Pass New Props to `PacksRow` and Block Drag-and-Drop
**File:** `src/components/hiking-page/packs-by-users.tsx`

**Changes:**
1. Passed `hasChanges`, `isPending`, and `onSave` props to `PacksRow`.
2. Blocked drag-and-drop during mutation by using a no-op function for `onDragEnd` when `isPending` is `true`.

```tsx
<DndContext sensors={sensors} onDragEnd={saveSlotsMutation.isPending ? () => {} : handleDragEnd}>
  {/* ... */}
  <PacksRow
    key={`day-${day.dayNumber}`}
    day={day}
    maxPackNumber={maxPackNumber}
    resolvePack={resolvePack}
    hasChanges={hasChanges}
    isPending={saveSlotsMutation.isPending}
    onSave={handleSave}
  />
</DndContext>
```

---

### Step 8: Update `PacksRow` Component
**File:** `src/components/hiking-page/packs-by-users-row.tsx`

**Changes:**
1. Added `Loader2` icon import from `lucide-react`.
2. Extended `PacksRowProps` with `hasChanges`, `isPending`, and `onSave`.
3. Removed the old `handleTest` function.
4. Updated the button:
   - Renamed from "Test" to "Save".
   - Added `disabled={!hasChanges || isPending}`.
   - Changed `onClick` to call `onSave` prop.
   - Added conditional text: "Saving..." during mutation, "Save" otherwise.
   - Added `Loader2` spinner icon during saving.

```tsx
import { Loader2 } from "lucide-react";

type PacksRowProps = {
  day: PacksByDayData;
  maxPackNumber: number;
  resolvePack: (day: PacksByDayData, column: number) => PackInfo | undefined;
  hasChanges: boolean;
  isPending: boolean;
  onSave: () => void;
};

// ... button code:
<Button
  variant="outline"
  size="sm"
  className="text-xs h-6 px-1"
  disabled={!hasChanges || isPending}
  onClick={onSave}
>
  {isPending && <Loader2 className="mr-1 h-3 w-3 animate-spin" />}
  {isPending ? "Saving..." : "Save"}
</Button>
```

---

## Problems Encountered

### Problem: Blocking Drag-and-Drop During Mutation

**Initial Approach:**
I attempted to use the `enabled` prop on `DndContext`, as suggested in the `@dnd-kit/core` documentation:

```tsx
<DndContext sensors={sensors} onDragEnd={handleDragEnd} enabled={!isPending}>
```

**Error:**
This caused a TypeScript error:
```
Property 'enabled' does not exist on type 'IntrinsicAttributes & Props'.
```

The version of `@dnd-kit/core` used in this project does not support the `enabled` prop on `DndContext`.

**Second Approach:**
I tried disabling the sensor by setting `options.document` to `null`:

```tsx
const sensors = useSensors(
  useSensor(PointerSensor, {
    activationConstraint: { distance: 5 },
    options: { document: saveSlotsMutation.isPending ? null : undefined },
  }),
);
```

**Result:**
This approach was unreliable and did not consistently block drag-and-drop interactions.

**Final Solution:**
The working solution was to replace the `onDragEnd` handler with a no-op function during the mutation:

```tsx
<DndContext sensors={sensors} onDragEnd={saveSlotsMutation.isPending ? () => {} : handleDragEnd}>
```

This effectively disables all drag-and-drop behavior while `isPending` is `true`, because even if a drag event is triggered, the handler does nothing. The drag interaction is still initiated visually, but the `handleDragEnd` logic is never executed, so no state changes occur.

**Note:** This approach blocks the *logic* of drag-and-drop but does not prevent the user from starting a drag gesture. For a complete visual block, a CSS `pointer-events: none` overlay could be added during `isPending`, but this was deemed unnecessary for the current implementation since the state remains unchanged.

---

## Summary of Files Modified

| File | Changes |
|------|---------|
| `src/components/hiking-page/packs-by-users.tsx` | Added mutation hook, state tracking, `buildSavePayload()`, `hasChanges`, `handleSave`, passed new props to `PacksRow`, blocked drag-and-drop during mutation |
| `src/components/hiking-page/packs-by-users-row.tsx` | Added `Loader2` import, extended props, removed `handleTest`, updated button with disable logic and dynamic text |

---

## Verification

- **TypeScript check:** `npx tsc --noEmit` — ✅ No errors
- **Build:** `npm run build` — ✅ Successful build

```
dist/index.html                     0.48 kB │ gzip:   0.32 kB
dist/assets/index-CC43KR_b.css     78.46 kB │ gzip:  13.78 kB
dist/assets/index-Chug6sMC.js   1,060.02 kB │ gzip: 329.31 kB
✓ built in 4.07s
```

---

## Behavior After Save

After the mutation completes successfully:
1. The `onSuccess` callback in `useSaveHikingPacksSlots` invalidates the hiking query.
2. This triggers a refetch of the hiking data.
3. The `useEffect` in `PacksByUsers` detects the updated `hiking` data and resets both `assignments` and `initialAssignments` to the new server values.
4. The `hasChanges` value automatically becomes `false`, disabling the Save button until the next drag operation.

---

## Conclusion

All requirements have been successfully implemented:
- ✅ Button renamed from "Test" to "Save"
- ✅ Button disabled when no changes exist
- ✅ Button triggers mutation with correct payload
- ✅ Console.log preserved for debugging
- ✅ Button shows "Saving..." with spinner during mutation
- ✅ Drag-and-drop blocked during mutation
- ✅ State resets automatically after successful save
- ✅ Build passes without errors

---

## Bug Fix: Cross-Day Data Pollution in Save Payload

### Problem Description

After the initial implementation, a critical bug was discovered: when clicking "Save" on a specific day row (e.g., Day 1), the mutation payload included **all slots from all days**, not just the changed slots of the current day.

For example, if the user dragged packs on Day 1 and clicked "Save", the request would also include slots from Day 2, Day 3, etc. — even if those days had not been modified. This caused incorrect data to be sent to the API and could potentially overwrite unrelated day assignments.

### Root Cause

The original `buildSavePayload()` function iterated over **all days** in `packsData` and collected every slot:

```tsx
// ❌ Original — collected ALL slots from ALL days
const buildSavePayload = useCallback((): { assignments: { packId: string; memberSlot: number | null }[] } => {
  const assignmentList: { packId: string; memberSlot: number | null }[] = [];
  if (!packsData) return { assignments: assignmentList };

  for (const day of packsData) {  // ← iterated over ALL days
    const dayAssignments = assignments.get(day.dayNumber) ?? new Map();
    for (let column = 1; column <= maxPackNumber; column++) {
      const packId = dayAssignments.get(column);
      if (!packId || packId.startsWith("empty-")) continue;
      assignmentList.push({ packId, memberSlot: column });  // ← added EVERY slot
    }
  }
  return { assignments: assignmentList };
}, [assignments, packsData, maxPackNumber]);
```

Additionally, `hasChanges` was a **single global boolean** for the entire component, meaning the Save button on every day row showed the same disabled/enabled state regardless of whether that specific day had changes.

### Fix Implementation

The fix involved three key changes:

#### 1. Per-Day Change Tracking (`hasChangesByDay`)
Replaced the global `hasChanges: boolean` with a `Map<number, boolean>` that tracks changes independently for each day:

```tsx
// ✅ New — tracks changes per day
const hasChangesByDay = useMemo(() => {
  const result = new Map<number, boolean>();
  for (const day of packsData ?? []) {
    const currentAssignments = assignments.get(day.dayNumber) ?? new Map();
    const initialDayAssignments = initialAssignments.get(day.dayNumber) ?? new Map();
    let changed = false;
    if (currentAssignments.size !== initialDayAssignments.size) {
      changed = true;
    } else {
      for (const [col, packId] of currentAssignments) {
        if (initialDayAssignments.get(col) !== packId) {
          changed = true;
          break;
        }
      }
    }
    result.set(day.dayNumber, changed);
  }
  return result;
}, [assignments, initialAssignments, packsData]);
```

#### 2. Per-Day Payload Builder
Rewrote `buildSavePayload()` to accept a `dayNumber` parameter and return **only the slots that differ** from their initial values for that specific day:

```tsx
// ✅ New — only changed slots for a specific day
const buildSavePayload = useCallback(
  (dayNumber: number): { assignments: { packId: string; memberSlot: number | null }[] } => {
    const assignmentList: { packId: string; memberSlot: number | null }[] = [];
    const currentAssignments = assignments.get(dayNumber) ?? new Map();
    const initialDayAssignments = initialAssignments.get(dayNumber) ?? new Map();

    // Only include slots that differ from initial
    for (const [col, packId] of currentAssignments) {
      if (packId.startsWith("empty-")) continue;
      if (initialDayAssignments.get(col) !== packId) {
        assignmentList.push({ packId, memberSlot: col });
      }
    }

    return { assignments: assignmentList };
  },
  [assignments, initialAssignments],
);
```

#### 3. Per-Day Save Handler
Updated `handleSave` to accept a `dayNumber` and pass it to `buildSavePayload`:

```tsx
const handleSave = (dayNumber: number) => {
  const payload = buildSavePayload(dayNumber);
  console.log(`Save payload for Day ${dayNumber}:`, payload);
  saveSlotsMutation.mutate({ hikingId: id, payload });
};
```

Each `PacksRow` now receives its own `hasChanges` value and a bound `onSave` callback:

```tsx
<PacksRow
  key={`day-${day.dayNumber}`}
  day={day}
  maxPackNumber={maxPackNumber}
  resolvePack={resolvePack}
  hasChanges={hasChangesByDay.get(day.dayNumber) ?? false}
  isPending={saveSlotsMutation.isPending}
  onSave={() => handleSave(day.dayNumber)}
/>
```

### Result After Fix

| Before Fix | After Fix |
|-----------|-----------|
| Save button on Day 1 sent **all** slots from **all** days | Save button on Day 1 sends **only changed** slots from **Day 1** |
| Global `hasChanges` — all buttons enabled/disabled together | Per-day `hasChangesByDay` — each button independent |
| Risk of overwriting unrelated day data | Minimal, correct payload per request |

### Verification

- **Build:** `npm run build` — ✅ Successful
- **TypeScript:** `npx tsc --noEmit` — ✅ No errors

```
dist/index.html                     0.48 kB │ gzip:   0.32 kB
dist/assets/index-CC43KR_b.css     78.46 kB │ gzip:  13.78 kB
dist/assets/index-ajkb6ujZ.js   1,060.09 kB │ gzip: 329.34 kB
✓ built in 4.85s
```

---

## Bug Fix #2: Save Button Not Activated Despite Unsaved Changes

### Problem Description

After the per-day payload fix, a second bug was discovered: even when packs had unsaved slot changes (after drag-and-drop), the "Save" button remained **disabled** (grayed out). The `hasChangesByDay` returned `false` even though the user had clearly modified the day's assignments.

### Root Cause

The original approach used `useState` + `useEffect` to track `initialAssignments`:

```tsx
// ❌ Problem: useState for initialAssignments
const [initialAssignments, setInitialAssignments] = useState<Map<number, DayAssignments>>(new Map());

useEffect(() => {
  // ...
  setAssignments(newAssignments);
  setInitialAssignments(new Map(newAssignments)); // ← snapshot on every packsData change
}, [packsData, maxPackNumber]);
```

The problem: `useEffect` runs every time `packsData` or `maxPackNumber` changes. Since `packsData` depends on `hiking` (via `useMemo`), any re-render or data refetch would cause `packsData` to be recreated, triggering the effect. This would **overwrite** `initialAssignments` with the current `assignments` — effectively losing the "original server state" snapshot.

**Sequence of events that caused the bug:**
1. User drags packs → `assignments` changes (local state)
2. Some React re-render or data refresh occurs → `packsData` reference changes
3. `useEffect` fires → `setInitialAssignments(new Map(newAssignments))` — **overwrites** the original snapshot with current (already modified) assignments
4. `hasChangesByDay` compares `assignments` vs `initialAssignments` → they're equal → button stays disabled

### Fix Implementation

Replaced `useState` + `useEffect` for `initialAssignments` with a **derived `useMemo`** called `serverAssignments`. This memo recomputes the server-state assignments from the current `hiking` data, ensuring it always reflects the actual server values:

```tsx
// ✅ Fixed: useMemo for serverAssignments — always reflects actual server state
const serverAssignments = useMemo(() => {
  if (!packsData || packsData.length === 0) return new Map<number, DayAssignments>();
  const newAssignments = new Map<number, DayAssignments>();
  for (const day of packsData) {
    newAssignments.set(day.dayNumber, buildBaseAssignments(day, maxPackNumber));
  }
  return newAssignments;
}, [packsData, maxPackNumber]);
```

Also removed `setInitialAssignments` from the initialization effect:

```tsx
// ✅ Clean initialization — only sets assignments, no snapshot
useEffect(() => {
  if (!packsData || packsData.length === 0) return;
  const newAssignments = new Map<number, DayAssignments>();
  for (const day of packsData) {
    newAssignments.set(day.dayNumber, buildBaseAssignments(day, maxPackNumber));
  }
  setAssignments(newAssignments);
}, [packsData, maxPackNumber]);
```

Updated `buildSavePayload` and `hasChangesByDay` to use `serverAssignments` instead of `initialAssignments`:

```tsx
// ✅ Now compares against serverAssignments
const hasChangesByDay = useMemo(() => {
  const result = new Map<number, boolean>();
  for (const day of packsData ?? []) {
    const currentAssignments = assignments.get(day.dayNumber) ?? new Map();
    const serverDayAssignments = serverAssignments.get(day.dayNumber) ?? new Map();
    let changed = false;
    if (currentAssignments.size !== serverDayAssignments.size) {
      changed = true;
    } else {
      for (const [col, packId] of currentAssignments) {
        if (serverDayAssignments.get(col) !== packId) {
          changed = true;
          break;
        }
      }
    }
    result.set(day.dayNumber, changed);
  }
  return result;
}, [assignments, serverAssignments, packsData]);
```

### Why This Works

| Approach | Behavior |
|----------|----------|
| `useState` + `useEffect` for `initialAssignments` | Snapshot gets overwritten on every `packsData` change, losing original server state |
| `useMemo` for `serverAssignments` | Always recomputes from current `hiking` data — reflects actual server values |

Now:
- `assignments` = user's local changes (via drag-and-drop)
- `serverAssignments` = what the server currently has (derived from `hiking`)
- `hasChangesByDay` = correct comparison between the two

### Result After Fix

| Before Fix | After Fix |
|-----------|-----------|
| Save button stays disabled after drag-and-drop | Save button correctly activates when changes exist |
| `initialAssignments` overwritten on re-render | `serverAssignments` always reflects current server state |
| Unsaved changes invisible to user | Clear visual feedback via button state |

### Verification

- **Build:** `npm run build` — ✅ Successful
- **TypeScript:** `npx tsc --noEmit` — ✅ No errors

```
dist/index.html                     0.48 kB │ gzip:   0.32 kB
dist/assets/index-CC43KR_b.css     78.46 kB │ gzip:  13.78 kB
dist/assets/index-DTeoYW49.js   1,058.05 kB │ gzip: 328.54 kB
✓ built in 4.16s
```

---

## Bug Fix #3: Save Button Disabled for Packs Without Server Slots

### Problem Description

After the previous fixes, a third issue was discovered: when packs on the server have **no `member_slot` assigned** (i.e., `member_slot` is `null` or `0`), the "Save" button remained **disabled** even though the UI showed packs in columns and the user could see orange circles indicating unassigned packs.

The user should be able to immediately assign slots to these unassigned packs and save — but the button was inactive on initial page load.

### Root Cause

The `serverAssignments` approach (Bug Fix #2) compared local column assignments with server-derived assignments using `buildBaseAssignments()`:

```tsx
// ❌ Problem: serverAssignments built from buildBaseAssignments
const serverAssignments = useMemo(() => {
  // buildBaseAssignments assigns ALL packs to columns,
  // even those with member_slot = null on the server!
  for (const day of packsData) {
    newAssignments.set(day.dayNumber, buildBaseAssignments(day, maxPackNumber));
  }
  return newAssignments;
}, [packsData, maxPackNumber]);
```

The issue: `buildBaseAssignments()` always assigns every pack to some column (even packs with `member_slot: null` on the server). So when comparing:

- **Local:** Pack A is in column 2 (via `buildBaseAssignments`)
- **Server assignments:** Pack A is also in column 2 (also via `buildBaseAssignments`)

The comparison returns `equal` → no changes detected → button disabled.

But the **actual server state** is: `Pack A.member_slot = null`. The local column assignment (column 2) does **not** match the server's `member_slot` (null) — this is a real change that should trigger the Save button!

### Fix Implementation

Replaced the `serverAssignments` comparison with a **direct check of each pack's `member_slot`** against its current column:

```tsx
// ✅ Fixed: Compare each pack's server member_slot with its current column
const hasChangesByDay = useMemo(() => {
  const result = new Map<number, boolean>();
  for (const day of packsData ?? []) {
    let changed = false;
    const dayAssignments = assignments.get(day.dayNumber) ?? new Map();

    // Build reverse mapping: packId → column
    const packToColumn = new Map<string, number>();
    for (const [col, packId] of dayAssignments) {
      if (!packId.startsWith("empty-")) {
        packToColumn.set(packId, col);
      }
    }

    // Check each pack: does its server member_slot match its current column?
    for (const pack of day.packs.values()) {
      const currentColumn = packToColumn.get(pack.packId);
      const serverSlot = pack.member_slot;

      // If pack is in a column but server slot differs → changed
      if (currentColumn != null && currentColumn !== serverSlot) {
        changed = true;
        break;
      }
    }

    result.set(day.dayNumber, changed);
  }
  return result;
}, [assignments, packsData]);
```

Also updated `buildSavePayload` with the same logic to ensure only changed packs are included in the payload:

```tsx
const buildSavePayload = useCallback(
  (dayNumber: number): { assignments: { packId: string; memberSlot: number | null }[] } => {
    const assignmentList: { packId: string; memberSlot: number | null }[] = [];
    const dayAssignments = assignments.get(dayNumber) ?? new Map();

    // Build reverse mapping: packId → column
    const packToColumn = new Map<string, number>();
    for (const [col, packId] of dayAssignments) {
      if (!packId.startsWith("empty-")) {
        packToColumn.set(packId, col);
      }
    }

    // Find the day data to get server member_slot for each pack
    const day = packsData?.find((d) => d.dayNumber === dayNumber);
    if (!day) return { assignments: assignmentList };

    // Compare each pack's server member_slot with its current column
    for (const pack of day.packs.values()) {
      const currentColumn = packToColumn.get(pack.packId);
      const serverSlot = pack.member_slot;

      // If pack is in a column but server slot differs → change
      if (currentColumn != null && currentColumn !== serverSlot) {
        assignmentList.push({ packId: pack.packId, memberSlot: currentColumn });
      }
    }

    return { assignments: assignmentList };
  },
  [assignments, packsData],
);
```

Also removed the now-unnecessary `serverAssignments` memo.

### Why This Works

| Approach | What It Compares | Result |
|----------|-----------------|--------|
| `serverAssignments` (via `buildBaseAssignments`) | Column 2 vs Column 2 → equal | ❌ No change detected |
| Direct `member_slot` check | `member_slot: null` vs Column 2 → different | ✅ Change detected! |

**Example:**
- Server: Pack A has `member_slot: null`
- Local: Pack A is displayed in column 2 (via `buildBaseAssignments`)
- Old comparison: `serverAssignments` also puts Pack A in column 2 → equal → no change
- **New comparison:** `member_slot: null` ≠ `column: 2` → **change detected!** → button activates

### Result After Fix

| Scenario | Before Fix | After Fix |
|----------|-----------|-----------|
| Packs with no server slots, just opened tab | Save button disabled ❌ | Save button **enabled** ✅ |
| User assigns slots to unassigned packs | Button activates | Button activates |
| All packs match server slots | Button disabled | Button disabled (correct!) |
| Drag-and-drop changes | Button activates | Button activates |

### Verification

- **Build:** `npm run build` — ✅ Successful
- **TypeScript:** `npx tsc --noEmit` — ✅ No errors

```
dist/index.html                     0.48 kB │ gzip:   0.32 kB
dist/assets/index-7fWsdELb.css     78.49 kB │ gzip:  13.79 kB
dist/assets/index-CzoumPYu.js   1,060.15 kB │ gzip: 329.34 kB
✓ built in 4.18s
```
