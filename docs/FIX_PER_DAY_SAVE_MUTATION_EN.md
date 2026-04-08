# Fix Report: Save Mutation — Per-Day Payload

## Problem
The original `buildSavePayload()` collected **all** slots from **all** days into a single payload. This caused the API request to include slots from other days that were not modified, leading to incorrect data being sent.

## Required Behavior
Each "Save" button in a day row should:
1. Only include slots from **that specific day**
2. Only include slots that have **actually changed** from their initial values
3. Send a minimal, correct payload to the API

---

## Step-by-Step Fix Plan

### Step 1: Replace `hasChanges` with `hasChangesByDay`
**File:** `packs-by-users.tsx`

Change from a single `boolean` to a `Map<dayNumber, boolean>` that tracks changes per day.

```tsx
const hasChangesByDay = useMemo(() => {
  const result = new Map<number, boolean>();
  for (const day of packsData ?? []) {
    const currentAssignments = assignments.get(day.dayNumber) ?? new Map();
    const initialDayAssignments = initialAssignments.get(day.dayNumber) ?? new Map();
    // Compare current vs initial for this day
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

### Step 2: Rewrite `buildSavePayload` to Accept `dayNumber`
**File:** `packs-by-users.tsx`

Now the function takes a `dayNumber`, finds the specific day data, compares current assignments with initial ones, and returns **only the changed slots**.

```tsx
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

### Step 3: Update `handleSave` to Accept `dayNumber`
**File:** `packs-by-users.tsx`

```tsx
const handleSave = (dayNumber: number) => {
  const payload = buildSavePayload(dayNumber);
  console.log(`Save payload for Day ${dayNumber}:`, payload);
  saveSlotsMutation.mutate({ hikingId: id, payload });
};
```

### Step 4: Update `PacksRow` Props
**File:** `packs-by-users.tsx` (passing props) and `packs-by-users-row.tsx` (receiving props)

**packs-by-users.tsx:**
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

**packs-by-users-row.tsx:**
```tsx
type PacksRowProps = {
  day: PacksByDayData;
  maxPackNumber: number;
  resolvePack: (day: PacksByDayData, column: number) => PackInfo | undefined;
  hasChanges: boolean;  // Now per-day, not global
  isPending: boolean;
  onSave: () => void;
};
```

### Step 5: No Changes Needed in Button Code
The button in `PacksRow` already uses `hasChanges`, `isPending`, and `onSave` — these props now carry the correct per-day values, so the button JSX stays the same.

---

## Expected Result
After this fix:
- Each day's "Save" button only sends slots for **that specific day**
- Only **changed** slots are included in the payload
- No cross-day data pollution
- Minimal, correct API requests

---

## Files Modified
| File | Changes |
|------|---------|
| `packs-by-users.tsx` | Replaced `hasChanges` with `hasChangesByDay`, rewrote `buildSavePayload(dayNumber)`, updated `handleSave(dayNumber)`, updated props passed to `PacksRow` |
| `packs-by-users-row.tsx` | No structural changes needed (props already correct, semantics changed) |
