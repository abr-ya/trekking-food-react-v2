import type { PackInfo } from "./hiking-helpers";
import { formatWeight } from "./hiking-helpers";

type PackCellProps = {
  pack?: PackInfo;
  dayNumber: number;
  packNumber: number;
};

/**
 * PackCell — displays a single pack's contents compactly.
 *
 * Shows:
 * - Total weight of the pack
 * - List of product names with individual weights
 * - Item count
 *
 * Prepared for future drag-and-drop integration via data-attributes.
 */
export const PackCell = ({ pack, dayNumber, packNumber }: PackCellProps) => {
  if (!pack) {
    return (
      <div
        className="bg-muted/30 rounded border border-dashed p-2 min-h-25 flex items-center justify-center"
        data-pack-id={undefined}
        data-day-number={dayNumber}
        data-pack-number={packNumber}
        data-droppable-id={`pack-${dayNumber}-${packNumber}`}
      >
        <p className="text-xs text-muted-foreground">—</p>
      </div>
    );
  }

  // Show orange indicator when member_slot doesn't match this column (including null)
  const hasMismatch = pack && (pack.member_slot === null || pack.member_slot !== packNumber);

  return (
    <div
      className="bg-background rounded border p-2 space-y-1.5 relative"
      data-pack-id={pack.packId}
      data-day-number={dayNumber}
      data-pack-number={packNumber}
      data-droppable-id={pack.packId}
    >
      {/* Orange indicator for slot mismatch */}
      {hasMismatch && (
        <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-orange-500" title="Member slot mismatch" />
      )}

      {/* Header: Weight & Item Count */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold text-foreground">{formatWeight(pack.totalWeight)}</span>
        <span className="text-xs text-muted-foreground">({pack.itemCount} products)</span>
      </div>

      {/* Product List — with data structure ready for drag-and-drop */}
      <div
        className="space-y-0.5"
        data-products-container="true"
        // TODO: This container will become useDroppable in future drag-and-drop integration
      >
        {pack.products.map((product) => (
          <div
            key={product.id}
            className="text-xs text-foreground pl-2 border-l-2 border-muted flex items-center justify-between gap-1"
            data-product-id={product.id}
            // TODO: This element will become useDraggable in future drag-and-drop integration
          >
            <span>• {product.name}</span>
            <span className="text-muted-foreground">{formatWeight(product.totalQuantity)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
