type PacksHeaderProps = {
  maxPackNumber: number;
};

/**
 * PacksHeader — displays column headers for the table.
 *
 * Structure:
 * - Left column: "День" (for day numbers, sticky)
 * - Other columns: Pack numbers (Пакет 1, Пакет 2, etc.)
 *
 * Uses CSS Grid with grid-auto-flow: column to align with PacksRow
 */
export const PacksHeader = ({ maxPackNumber }: PacksHeaderProps) => {
  const packNumbers = Array.from({ length: maxPackNumber }, (_, i) => i + 1);

  return (
    <div
      className="inline-grid gap-2 pb-2 border-b sticky top-0 bg-background z-10 w-full"
      style={{
        gridTemplateColumns: `120px repeat(${maxPackNumber}, minmax(150px, 1fr))`,
      }}
    >
      {/* Day column header (sticky) */}
      <div className="text-xs font-semibold text-foreground sticky left-0 bg-background px-2 py-1">День</div>

      {/* Pack column headers */}
      {packNumbers.map((num) => (
        <div key={`pack-${num}`} className="text-xs font-semibold text-center text-foreground px-1 py-1">
          Пакет {num}
        </div>
      ))}
    </div>
  );
};
