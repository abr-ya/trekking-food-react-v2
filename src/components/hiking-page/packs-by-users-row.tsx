import type { PacksByDayData } from "./hiking-helpers";
import { PackCell } from "./packs-by-users-cell";

type PacksRowProps = {
  day: PacksByDayData;
  maxPackNumber: number;
};

/**
 * PacksRow — displays a single day's row in the table.
 *
 * Structure:
 * - Left column (sticky): day number
 * - Other columns: pack cells (one per pack_number)
 *
 * Uses CSS Grid matching PacksHeader column structure
 */
export const PacksRow = ({ day, maxPackNumber }: PacksRowProps) => {
  const packNumbers = Array.from({ length: maxPackNumber }, (_, i) => i + 1);

  return (
    <div
      className="inline-grid gap-2 border-b py-2 items-start w-full"
      style={{
        gridTemplateColumns: `120px repeat(${maxPackNumber}, minmax(150px, 1fr))`,
      }}
    >
      {/* Day column (sticky) */}
      <div className="text-sm font-medium text-foreground sticky left-0 bg-background px-2 py-1 rounded">
        Day {day.dayNumber}
      </div>

      {/* Pack columns */}
      {packNumbers.map((packNum) => {
        const pack = day.packs.get(packNum);
        return (
          <div key={`day-${day.dayNumber}-pack-${packNum}`}>
            <PackCell pack={pack} dayNumber={day.dayNumber} packNumber={packNum} />
          </div>
        );
      })}
    </div>
  );
};
