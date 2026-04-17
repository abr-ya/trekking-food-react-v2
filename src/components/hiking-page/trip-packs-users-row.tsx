import { useMemo } from "react";
import { useDroppable } from "@dnd-kit/core";
import { Loader2 } from "lucide-react";
import { formatWeight, type PackInfo } from "./hiking-helpers";
import { PackCell } from "./packs-by-users-cell";
import { Button } from "@/components/ui/button";

type TripPacksUsersRowProps = {
  maxPackNumber: number;
  resolveTripPack: (column: number) => PackInfo | undefined;
  hasChanges: boolean;
  isPending: boolean;
  onSave: () => void;
};

function TripDroppableColumn({
  column,
  disabled,
  children,
}: {
  column: number;
  disabled: boolean;
  children: React.ReactNode;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: `trip:${column}`,
    disabled,
  });

  return (
    <div ref={setNodeRef} className={isOver && !disabled ? "ring-2 ring-primary/40 rounded-md transition-shadow" : ""}>
      {children}
    </div>
  );
}

/** Trip pack row — same grid as day rows; draggable ids use `trip:column:packId`. */
export const TripPacksUsersRow = ({
  maxPackNumber,
  resolveTripPack,
  hasChanges,
  isPending,
  onSave,
}: TripPacksUsersRowProps) => {
  const packNumbers = Array.from({ length: maxPackNumber }, (_, i) => i + 1);

  const rowTotalGrams = useMemo(() => {
    let sum = 0;
    for (let col = 1; col <= maxPackNumber; col += 1) {
      sum += resolveTripPack(col)?.totalWeight ?? 0;
    }
    return sum;
  }, [maxPackNumber, resolveTripPack]);

  return (
    <div
      className="inline-grid gap-2 border-b py-2 items-start w-full"
      style={{
        gridTemplateColumns: `120px repeat(${maxPackNumber}, minmax(150px, 1fr))`,
      }}
    >
      <div className="sticky left-0 bg-background px-2 py-1 rounded flex flex-col gap-1">
        <div className="text-sm font-medium text-foreground">Trip</div>
        <div className="text-xs text-muted-foreground tabular-nums">{formatWeight(rowTotalGrams)}</div>
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

      {packNumbers.map((column) => {
        const pack = resolveTripPack(column);
        const packId = pack?.packId ?? `empty-trip-${column}`;
        const dragId = pack ? `trip:${column}:${packId}` : "";
        return (
          <TripDroppableColumn key={`trip-col-${column}`} column={column} disabled={!pack}>
            <PackCell pack={pack} dayNumber={0} packNumber={column} draggableId={dragId} />
          </TripDroppableColumn>
        );
      })}
    </div>
  );
};
