import { useDroppable } from "@dnd-kit/core";
import type { PacksByDayData, PackInfo } from "./hiking-helpers";
import { PackCell } from "./packs-by-users-cell";
import { Button } from "@/components/ui/button";

type PacksRowProps = {
  day: PacksByDayData;
  maxPackNumber: number;
  resolvePack: (day: PacksByDayData, column: number) => PackInfo | undefined;
};

/** Droppable wrapper for a column cell — disabled when empty to prevent drop */
function DroppableColumn({
  dayNumber,
  column,
  disabled,
  children,
}: {
  dayNumber: number;
  column: number;
  disabled: boolean;
  children: React.ReactNode;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: `${dayNumber}:${column}`,
    disabled,
  });

  return (
    <div ref={setNodeRef} className={isOver && !disabled ? "ring-2 ring-primary/40 rounded-md transition-shadow" : ""}>
      {children}
    </div>
  );
}

/**
 * PacksRow — displays a single day's row in the table.
 */
export const PacksRow = ({ day, maxPackNumber, resolvePack }: PacksRowProps) => {
  const packNumbers = Array.from({ length: maxPackNumber }, (_, i) => i + 1);

  const handleTest = () => {
    const mismatched: Array<{
      packId: string;
      day: number;
      member_slot: number | null;
      column: number;
    }> = [];

    for (const column of packNumbers) {
      const pack = resolvePack(day, column);
      if (!pack) continue;
      if (pack.member_slot == null || pack.member_slot === 0 || pack.member_slot !== column) {
        mismatched.push({ packId: pack.packId, day: day.dayNumber, member_slot: pack.member_slot, column });
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
        const pack = resolvePack(day, column);
        const packId = pack?.packId ?? `empty-${day.dayNumber}-${column}`;
        const dragId = pack ? `${day.dayNumber}:${column}:${packId}` : "";
        return (
          <DroppableColumn
            key={`day-${day.dayNumber}-col-${column}`}
            dayNumber={day.dayNumber}
            column={column}
            disabled={!pack}
          >
            <PackCell pack={pack} dayNumber={day.dayNumber} packNumber={column} draggableId={dragId} />
          </DroppableColumn>
        );
      })}
    </div>
  );
};
