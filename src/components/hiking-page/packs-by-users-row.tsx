import type { PacksByDayData, PackInfo } from "./hiking-helpers";
import { PackCell } from "./packs-by-users-cell";
import { Button } from "@/components/ui/button";

type PacksRowProps = {
  day: PacksByDayData;
  maxPackNumber: number;
};

/**
 * Resolve which pack is displayed in each column.
 * Priority: 1) pack with member_slot === column, 2) first unassigned pack (member_slot === null or 0).
 * Each unassigned pack is used at most once.
 */
function resolvePacksByColumn(day: PacksByDayData, maxPackNumber: number): Map<number, PackInfo | undefined> {
  const result = new Map<number, PackInfo | undefined>();
  const unassigned = [...day.packs.values()]
    .filter((p) => p.member_slot == null || p.member_slot === 0)
    .sort((a, b) => a.packNumber - b.packNumber);
  const unassignedQueue = [...unassigned];

  for (let column = 1; column <= maxPackNumber; column++) {
    // 1) Pack assigned to this column
    const slotPack = [...day.packs.values()].find((p) => p.member_slot === column);
    if (slotPack) {
      result.set(column, slotPack);
      continue;
    }
    // 2) Next unassigned pack
    const next = unassignedQueue.shift();
    result.set(column, next);
  }

  return result;
}

/**
 * PacksRow — displays a single day's row in the table.
 *
 * Structure:
 * - Left column (sticky): day number + Test button
 * - Other columns: pack cells (one per pack_number)
 *
 * Packs are displayed according to their member_slot:
 * - Column N shows pack with member_slot === N
 * - If no such pack, shows first unassigned pack (member_slot === null)
 *
 * Uses CSS Grid matching PacksHeader column structure
 */
export const PacksRow = ({ day, maxPackNumber }: PacksRowProps) => {
  const packsByColumn = resolvePacksByColumn(day, maxPackNumber);
  const packNumbers = Array.from({ length: maxPackNumber }, (_, i) => i + 1);

  const handleTest = () => {
    const mismatched: Array<{
      id: string;
      day: number;
      member_slot: number | null;
      column: number;
    }> = [];

    for (const column of packNumbers) {
      const pack = packsByColumn.get(column);
      if (!pack) continue;
      // Show indicator when member_slot is null/0 OR doesn't match column
      if (pack.member_slot == null || pack.member_slot === 0 || pack.member_slot !== column) {
        mismatched.push({ id: pack.packId, day: day.dayNumber, member_slot: pack.member_slot, column });
      }
    }

    console.log("Mismatched packs for Day", day.dayNumber, mismatched);
  };

  return (
    <div
      className="inline-grid gap-2 border-b py-2 items-start w-full"
      style={{
        gridTemplateColumns: `120px repeat(${maxPackNumber}, minmax(150px, 1fr))`,
      }}
    >
      {/* Day column (sticky) */}
      <div className="sticky left-0 bg-background px-2 py-1 rounded flex flex-col gap-1">
        <div className="text-sm font-medium text-foreground">Day {day.dayNumber}</div>
        <Button variant="outline" size="sm" className="text-xs h-6 px-1" onClick={handleTest}>
          Test
        </Button>
      </div>

      {/* Pack columns */}
      {packNumbers.map((column) => {
        const pack = packsByColumn.get(column);
        return (
          <div key={`day-${day.dayNumber}-col-${column}`}>
            <PackCell pack={pack} dayNumber={day.dayNumber} packNumber={column} />
          </div>
        );
      })}
    </div>
  );
};
