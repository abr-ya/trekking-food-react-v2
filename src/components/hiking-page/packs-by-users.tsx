import { useState, useMemo, useCallback, useEffect } from "react";
import { DndContext, PointerSensor, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import type { TripPackMemberSlotsPayload } from "@/types/hiking";
import { useHiking, useSaveHikingPacksSlots, useSaveTripPackMemberSlots } from "@/hooks";
import { LoadingSkeleton } from "@/components";
import { downloadTextFile } from "@/lib/download";
import {
  buildBaseTripAssignments,
  buildPackColumnTextExport,
  findTripPackColumn,
  groupProductsByDayAndPack,
  groupTripPacksForUsers,
  type PackInfo,
  type PacksByDayData,
  type TripPacksRowData,
} from "./hiking-helpers";
import { PacksHeader } from "./packs-by-users-header";
import { PacksRow } from "./packs-by-users-row";
import { TripPacksUsersRow } from "./trip-packs-users-row";

type PacksByUsersProps = {
  id: string;
};

/** Column → packId for one day. Sentinel "empty-N" means no pack in that column. */
type DayAssignments = Map<number, string>;

/** Build base assignments: column → packId based on member_slot / unassigned */
function buildBaseAssignments(day: PacksByDayData, maxPackNumber: number): DayAssignments {
  const assignments = new Map<number, string>();
  const unassigned = [...day.packs.values()]
    .filter((p) => p.member_slot == null || p.member_slot === 0)
    .sort((a, b) => a.packNumber - b.packNumber);
  const unassignedQueue = [...unassigned];

  for (let column = 1; column <= maxPackNumber; column++) {
    const slotPack = [...day.packs.values()].find((p) => p.member_slot === column);
    if (slotPack) {
      assignments.set(column, slotPack.packId);
      continue;
    }
    const next = unassignedQueue.shift();
    assignments.set(column, next?.packId ?? `empty-${column}`);
  }

  return assignments;
}

export const PacksByUsers = ({ id }: PacksByUsersProps) => {
  const { data: hiking, isLoading, error } = useHiking(id);
  const saveSlotsMutation = useSaveHikingPacksSlots();
  const saveTripSlotsMutation = useSaveTripPackMemberSlots();
  const [assignments, setAssignments] = useState<Map<number, DayAssignments>>(new Map());
  const [tripAssignments, setTripAssignments] = useState<Map<number, string[]>>(new Map());

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const packsData = useMemo(() => {
    if (!hiking) return null;
    return groupProductsByDayAndPack(hiking.hiking_products ?? [], hiking.day_packs ?? [], hiking.daysTotal);
  }, [hiking]);

  const tripPacksData = useMemo((): TripPacksRowData | null => {
    if (!hiking) return null;
    return groupTripPacksForUsers(hiking.hiking_products ?? []);
  }, [hiking]);

  const maxPackNumber = useMemo(() => {
    if (!hiking) return 0;
    return hiking.membersTotal;
  }, [hiking]);

  // Initialize assignments on first data load
  useEffect(() => {
    if (!packsData || packsData.length === 0) return;
    const newAssignments = new Map<number, DayAssignments>();
    for (const day of packsData) {
      newAssignments.set(day.dayNumber, buildBaseAssignments(day, maxPackNumber));
    }
    setAssignments(newAssignments);
  }, [packsData, maxPackNumber]);

  useEffect(() => {
    if (!tripPacksData || tripPacksData.packs.size === 0 || maxPackNumber === 0) {
      setTripAssignments(new Map());
      return;
    }
    setTripAssignments(buildBaseTripAssignments(tripPacksData, maxPackNumber));
  }, [tripPacksData, maxPackNumber]);

  /** Resolve column → PackInfo using assignments */
  const resolvePack = useCallback(
    (day: PacksByDayData, column: number): PackInfo | undefined => {
      const dayAssignments = assignments.get(day.dayNumber);
      const packId = dayAssignments?.get(column);
      if (!packId || packId.startsWith("empty-")) return undefined;
      return [...day.packs.values()].find((p) => p.packId === packId);
    },
    [assignments],
  );

  const resolveTripPacks = useCallback(
    (column: number): PackInfo[] => {
      const ids = tripAssignments.get(column) ?? [];
      if (!tripPacksData) return [];
      return ids
        .map((packId) => tripPacksData.packs.get(packId))
        .filter((p): p is PackInfo => p != null);
    },
    [tripAssignments, tripPacksData],
  );

  /** Build payload for save mutation — only changed slots for a specific day */
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

  const buildTripSavePayload = useCallback((): TripPackMemberSlotsPayload => {
    const assignmentList: { packId: string; memberSlot: number | null }[] = [];
    if (!tripPacksData) return { assignments: assignmentList };

    for (const pack of tripPacksData.packs.values()) {
      const currentColumn = findTripPackColumn(tripAssignments, pack.packId);
      const serverSlot = pack.member_slot;
      if (currentColumn != null && currentColumn !== serverSlot) {
        assignmentList.push({ packId: pack.packId, memberSlot: currentColumn });
      }
    }

    return { assignments: assignmentList };
  }, [tripAssignments, tripPacksData]);

  /** Check if there are unsaved changes per day */
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

  const hasTripChanges = useMemo(() => {
    if (!tripPacksData?.packs.size) return false;
    for (const pack of tripPacksData.packs.values()) {
      const currentColumn = findTripPackColumn(tripAssignments, pack.packId);
      const serverSlot = pack.member_slot;
      if (currentColumn != null && currentColumn !== serverSlot) {
        return true;
      }
    }
    return false;
  }, [tripAssignments, tripPacksData]);

  const columnTotals = useMemo(() => {
    const totals = new Map<number, number>();
    if (!packsData) return totals;
    for (const day of packsData) {
      for (let col = 1; col <= maxPackNumber; col++) {
        const pack = resolvePack(day, col);
        if (pack) {
          totals.set(col, (totals.get(col) || 0) + pack.totalWeight);
        }
      }
    }
    if (tripPacksData?.packs.size) {
      for (let col = 1; col <= maxPackNumber; col++) {
        for (const pack of resolveTripPacks(col)) {
          totals.set(col, (totals.get(col) || 0) + pack.totalWeight);
        }
      }
    }
    return totals;
  }, [packsData, maxPackNumber, resolvePack, tripPacksData, resolveTripPacks]);

  const handleSavePackList = useCallback(
    (column: number) => {
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
    },
    [packsData, columnTotals, hiking?.name, resolvePack, resolveTripPacks],
  );

  const dndLocked = saveSlotsMutation.isPending || saveTripSlotsMutation.isPending;

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    if (activeId.startsWith("trip:")) {
      const fromParts = activeId.split(":");
      const toParts = overId.split(":");
      if (fromParts.length < 3 || toParts[0] !== "trip" || toParts.length < 2) return;
      const from = Number(fromParts[1]);
      const to = Number(toParts[1]);
      const packId = fromParts.slice(2).join(":");
      if (from === to) return;

      setTripAssignments((prev) => {
        const fromList = [...(prev.get(from) ?? [])];
        const idx = fromList.indexOf(packId);
        if (idx === -1) return prev;
        const next = new Map<number, string[]>();
        for (let c = 1; c <= maxPackNumber; c += 1) {
          next.set(c, [...(prev.get(c) ?? [])]);
        }
        const newFrom = [...fromList];
        newFrom.splice(idx, 1);
        next.set(from, newFrom);
        const toList = next.get(to) ?? [];
        next.set(to, [...toList, packId]);
        return next;
      });
      return;
    }

    const fromParts = activeId.split(":");
    const toParts = overId.split(":");
    if (fromParts.length < 3 || toParts.length < 2) return;

    const dayNum = Number(fromParts[0]);
    const from = Number(fromParts[1]);
    const to = Number(toParts[1]);
    if (dayNum !== Number(toParts[0]) || from === to) return;

    setAssignments((prev) => {
      const dayAssignments = prev.get(dayNum) ?? new Map();
      const fromPackId = dayAssignments.get(from) ?? `empty-${from}`;
      const toPackId = dayAssignments.get(to) ?? `empty-${to}`;
      const next = new Map(dayAssignments);
      next.set(from, toPackId);
      next.set(to, fromPackId);
      return new Map(prev).set(dayNum, next);
    });
  };

  const handleSave = (dayNumber: number) => {
    const payload = buildSavePayload(dayNumber);
    saveSlotsMutation.mutate({ hikingId: id, payload });
  };

  const handleSaveTrip = () => {
    const payload = buildTripSavePayload();
    saveTripSlotsMutation.mutate({ hikingId: id, payload });
  };

  if (!id) {
    return <p className="text-muted-foreground text-sm">Hiking id not correct.</p>;
  }

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <p className="text-destructive text-sm">
        Failed to load packs: {error instanceof Error ? error.message : "Unknown error"}
      </p>
    );
  }

  if (!hiking) {
    return <p className="text-muted-foreground text-sm">Hiking not found.</p>;
  }

  if (!packsData || packsData.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        No packs created yet. Create packs in the "Packs by Days" tab first.
      </p>
    );
  }

  return (
    <DndContext sensors={sensors} onDragEnd={dndLocked ? () => {} : handleDragEnd}>
      <div className="rounded-md border p-4">
        {/* Scrollable container for the table */}
        <div className="overflow-x-auto">
          {/* Header row */}
          {maxPackNumber > 0 && (
            <PacksHeader
              maxPackNumber={maxPackNumber}
              columnTotals={columnTotals}
              onSave={handleSavePackList}
            />
          )}

          {/* Data rows */}
          <div>
            {packsData.map((day) => (
              <PacksRow
                key={`day-${day.dayNumber}`}
                day={day}
                maxPackNumber={maxPackNumber}
                resolvePack={resolvePack}
                hasChanges={hasChangesByDay.get(day.dayNumber) ?? false}
                isPending={saveSlotsMutation.isPending || saveTripSlotsMutation.isPending}
                onSave={() => handleSave(day.dayNumber)}
              />
            ))}

            {tripPacksData && tripPacksData.packs.size > 0 && maxPackNumber > 0 ? (
              <TripPacksUsersRow
                maxPackNumber={maxPackNumber}
                resolveTripPacks={resolveTripPacks}
                hasChanges={hasTripChanges}
                isPending={saveTripSlotsMutation.isPending || saveSlotsMutation.isPending}
                onSave={handleSaveTrip}
              />
            ) : null}
          </div>
        </div>

        {/* Helper text */}
        <div className="mt-4 text-xs text-muted-foreground space-y-1">
          <p>The first column (Day) remains visible during horizontal scrolling.</p>
          <p>Each cell shows the total pack weight and the list of items inside.</p>
        </div>
      </div>
    </DndContext>
  );
};
