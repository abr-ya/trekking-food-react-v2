# Plan: PacksByUsers Save Button with Mutation

## Overview
Rename the "Test" button to "Save", connect it to the `useSaveHikingPacksSlots` mutation, disable it when there are no changes, and block drag-and-drop while the mutation is in progress.

---

## 1. Prepare Save Payload
Create a `buildSavePayload()` function in `packs-by-users.tsx` that:
- Iterates over all days and columns
- Collects `{ packId, memberSlot }` for each slot
- Returns the format `{ assignments: { packId: string; memberSlot: number | null }[] }`

---

## 2. Track Changes (Dirty State)
- Store `initialAssignments` on first data load (alongside current `assignments`)
- Create a `hasChanges` computed value that compares:
  - Current `assignments` in state
  - `initialAssignments` (snapshot from initial load)
- Return `true` if any day/column mapping differs

---

## 3. Connect Mutation
- Import `useSaveHikingPacksSlots` from `@/hooks`
- Call the hook in `PacksByUsers` component
- Create `handleSave` handler that:
  - Calls `buildSavePayload()`
  - Logs payload to console (keep for now)
  - Calls `mutate({ hikingId: id, payload })`

---

## 4. Rename Button and Disable Logic
In `packs-by-users-row.tsx`:
- Rename `handleTest` → `handleSave`
- Accept new props: `hasChanges`, `isPending`, `onSave`
- Button props:
  - `disabled={!hasChanges || isPending}`
  - Text: `"Save"` (default) → `"Saving..."` (while `isPending`)
  - Optionally add `Loader2` icon during saving

---

## 5. Block Drag-and-Drop During Mutation
Pass `isPending` to `DndContext`:

**Option A (recommended):**
```tsx
<DndContext sensors={sensors} onDragEnd={handleDragEnd} enabled={!isPending}>
```

**Option B:**
```tsx
const sensors = useSensors(
  useSensor(PointerSensor, { 
    activationConstraint: { distance: 5 },
    disabled: isPending
  })
);
```

Both approaches block all drag-and-drop while `isPending` is `true`.

---

## 6. Reset State After Save
- The mutation's `onSuccess` already has `invalidateQueries` which refetches hiking data
- The existing `useEffect` on `hiking` will automatically reset `assignments` to the new server values
- No additional code needed

---

## Files to Modify

### 1. `packs-by-users.tsx` (main component)
- Import and call `useSaveHikingPacksSlots`
- Create `buildSavePayload()` and `hasChanges` logic
- Pass `hasChanges`, `isPending`, `handleSave` to `PacksRow`
- Add `enabled={!isPending}` to `DndContext`

### 2. `packs-by-users-row.tsx` (table row)
- Rename `handleTest` → `handleSave`
- Accept new props: `hasChanges`, `isPending`, `onSave`
- Update button: text, `disabled` state, possibly icon

---

## Complexity Assessment

| Task | Difficulty | Notes |
|------|-----------|-------|
| Build save payload | Easy | Iterate assignments, map to API format |
| Track changes | Easy | Compare current vs initial assignments |
| Connect mutation | Easy | Use existing `useSaveHikingPacksSlots` hook |
| Button rename + disable | Easy | Simple prop changes |
| Block drag-and-drop | Very Easy | Single prop: `enabled={!isPending}` |
| Reset after save | No work needed | Existing `useEffect` handles it |

**Total: ~6 steps, 2 files, all straightforward.**
