import { useDroppable } from "@dnd-kit/core";
import { Loader2 } from "lucide-react";
import type { PacksByDayData, PackInfo } from "./hiking-helpers";
import { PackCell } from "./packs-by-users-cell";
import { Button } from "@/components/ui/button";

type PacksRowProps = {
  day: PacksByDayData;
  maxPackNumber: number;
  resolvePack: (day: PacksByDayData, column: number) => PackInfo | undefined;
  hasChanges: boolean;
  isPending: boolean;
  onSave: () => void;
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
export const PacksRow = ({ day, maxPackNumber, resolvePack, hasChanges, isPending, onSave }: PacksRowProps) => {
  const packNumbers = Array.from({ length: maxPackNumber }, (_, i) => i + 1);

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
