import { formatWeight } from "./hiking-helpers";

type PacksHeaderProps = {
  maxPackNumber: number;
  columnTotals: Map<number, number>;
};

/**
 * PacksHeader — displays column headers for the table.
 */
export const PacksHeader = ({ maxPackNumber, columnTotals }: PacksHeaderProps) => {
  const packNumbers = Array.from({ length: maxPackNumber }, (_, i) => i + 1);

  return (
    <div
      className="inline-grid gap-2 pb-2 border-b sticky top-0 bg-background z-10 w-full"
      style={{
        gridTemplateColumns: `120px repeat(${maxPackNumber}, minmax(150px, 1fr))`,
      }}
    >
      <div className="text-xs font-semibold text-foreground sticky left-0 bg-background px-2 py-1">Day</div>

      {packNumbers.map((num) => {
        const total = columnTotals.get(num) ?? 0;
        return (
          <div key={`pack-${num}`} className="text-center px-1 py-1">
            <div className="text-xs font-semibold text-foreground">Pack {num}</div>
            <div className="text-xs text-muted-foreground">{formatWeight(total)}</div>
          </div>
        );
      })}
    </div>
  );
};
