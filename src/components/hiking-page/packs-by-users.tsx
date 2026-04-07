import { useMemo } from "react";
import { useHiking } from "@/hooks";
import { LoadingSkeleton } from "@/components";
import { groupProductsByDayAndPack } from "./hiking-helpers";
import { PacksHeader } from "./packs-by-users-header";
import { PacksRow } from "./packs-by-users-row";

type PacksByUsersProps = {
  id: string;
};

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
 * - Prepared for future drag-and-drop integration (data-attributes in place)
 *
 * Data flow:
 * 1. useHiking() fetches hiking data including hiking_products and day_packs
 * 2. groupProductsByDayAndPack() transforms flat product list into organized structure
 * 3. Display via PacksHeader + PacksRow for each day
 */
export const PacksByUsers = ({ id }: PacksByUsersProps) => {
  const { data: hiking, isLoading, error } = useHiking(id);

  const packsData = useMemo(() => {
    if (!hiking) return null;
    return groupProductsByDayAndPack(hiking.hiking_products ?? [], hiking.day_packs ?? [], hiking.daysTotal);
  }, [hiking]);

  const maxPackNumber = useMemo(() => {
    if (!hiking) return 0;
    return hiking.membersTotal;
  }, [hiking]);

  const columnTotals = useMemo(() => {
    const totals = new Map<number, number>();
    for (const day of packsData ?? []) {
      for (const [packNum, pack] of day.packs) {
        totals.set(packNum, (totals.get(packNum) || 0) + pack.totalWeight);
      }
    }
    return totals;
  }, [packsData]);

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
    <div className="rounded-md border p-4">
      {/* Scrollable container for the table */}
      <div className="overflow-x-auto">
        {/* Header row */}
        {maxPackNumber > 0 && <PacksHeader maxPackNumber={maxPackNumber} columnTotals={columnTotals} />}

        {/* Data rows */}
        <div>
          {packsData?.map((day) => (
            <PacksRow key={`day-${day.dayNumber}`} day={day} maxPackNumber={maxPackNumber} />
          ))}
        </div>
      </div>

      {/* Helper text */}
      <div className="mt-4 text-xs text-muted-foreground space-y-1">
        <p>The first column (Day) remains visible during horizontal scrolling.</p>
        <p>Each cell shows the total pack weight and the list of items inside.</p>
      </div>
    </div>
  );
};
