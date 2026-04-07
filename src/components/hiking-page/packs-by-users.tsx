import { useState, useMemo, useCallback, useEffect } from "react";
import { DndContext, PointerSensor, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { useHiking } from "@/hooks";
import { LoadingSkeleton } from "@/components";
import { groupProductsByDayAndPack, type PackInfo, type PacksByDayData } from "./hiking-helpers";
import { PacksHeader } from "./packs-by-users-header";
import { PacksRow } from "./packs-by-users-row";

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
  const [assignments, setAssignments] = useState<Map<number, DayAssignments>>(new Map());

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const packsData = useMemo(() => {
    if (!hiking) return null;
    return groupProductsByDayAndPack(hiking.hiking_products ?? [], hiking.day_packs ?? [], hiking.daysTotal);
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
    return totals;
  }, [packsData, maxPackNumber, resolvePack]);

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over) return;

    const fromParts = String(active.id).split(":");
    const toParts = String(over.id).split(":");
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
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="rounded-md border p-4">
        {/* Scrollable container for the table */}
        <div className="overflow-x-auto">
          {/* Header row */}
          {maxPackNumber > 0 && <PacksHeader maxPackNumber={maxPackNumber} columnTotals={columnTotals} />}

          {/* Data rows */}
          <div>
            {packsData.map((day) => (
              <PacksRow
                key={`day-${day.dayNumber}`}
                day={day}
                maxPackNumber={maxPackNumber}
                resolvePack={resolvePack}
              />
            ))}
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
