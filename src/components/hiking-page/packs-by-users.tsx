import { useState, useMemo } from "react";
import { DndContext, PointerSensor, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { useHiking } from "@/hooks";
import { LoadingSkeleton } from "@/components";
import { groupProductsByDayAndPack } from "./hiking-helpers";
import { PacksHeader } from "./packs-by-users-header";
import { resolvePacksByColumn, PacksRow } from "./packs-by-users-row";

type PacksByUsersProps = {
  id: string;
};

/** Swap state for a single day: sourceColumn → targetColumn (permutation) */
type DaySwaps = Map<number, number>;

/**
 * PacksByUsers — displays a table of packs organized by days and participants.
 *
 * Structure:
 * - Rows: days (1 to daysTotal)
 * - Columns: pack numbers (1 to membersTotal, typically one per participant)
 * - Cells: contain products grouped in packs, with total weight and item count
 *
 * Features:
 * - Compact display of weights, product names, and item counts
 * - Sticky day column for easy reference during horizontal scroll
 * - Supports drag-and-drop to swap packs between columns (within a day)
 *
 * Data flow:
 * 1. useHiking() fetches hiking data including hiking_products and day_packs
 * 2. groupProductsByDayAndPack() transforms flat product list into organized structure
 * 3. Display via PacksHeader + PacksRow for each day
 */
export const PacksByUsers = ({ id }: PacksByUsersProps) => {
  const { data: hiking, isLoading, error } = useHiking(id);
  const [swaps, setSwaps] = useState<Map<number, DaySwaps>>(new Map());

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const packsData = useMemo(() => {
    if (!hiking) return null;
    return groupProductsByDayAndPack(hiking.hiking_products ?? [], hiking.day_packs ?? [], hiking.daysTotal);
  }, [hiking]);

  const maxPackNumber = useMemo(() => {
    if (!hiking) return 0;
    return hiking.membersTotal;
  }, [hiking]);

  const columnTotals = useMemo(() => {
    if (!packsData) return new Map<number, number>();
    const totals = new Map<number, number>();

    // For each day, resolve packs per column (with swaps) and sum weights
    for (const day of packsData) {
      const daySwaps = swaps.get(day.dayNumber);
      const resolved = resolvePacksByColumn(day, maxPackNumber, daySwaps);
      for (const [col, pack] of resolved) {
        if (pack) {
          totals.set(col, (totals.get(col) || 0) + pack.totalWeight);
        }
      }
    }

    return totals;
  }, [packsData, swaps, maxPackNumber]);

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over) return;

    const fromParts = String(active.id).split(":");
    const toParts = String(over.id).split(":");
    if (fromParts.length < 3 || toParts.length < 2) return;

    const dayNum = Number(fromParts[0]);
    const from = Number(fromParts[1]);
    const to = Number(toParts[1]);
    if (dayNum !== Number(toParts[0]) || from === to) return;

    setSwaps((prev) => {
      const daySwaps = prev.get(dayNum) ?? new Map();
      const next = new Map(daySwaps);
      next.set(from, to);
      next.set(to, from);
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
            {packsData?.map((day) => (
              <PacksRow
                key={`day-${day.dayNumber}`}
                day={day}
                maxPackNumber={maxPackNumber}
                daySwaps={swaps.get(day.dayNumber)}
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
