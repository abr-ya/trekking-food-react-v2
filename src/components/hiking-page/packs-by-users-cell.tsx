import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import type { PackInfo } from "./hiking-helpers";
import { formatWeight } from "./hiking-helpers";

type PackCellProps = {
  pack?: PackInfo;
  dayNumber: number;
  packNumber: number;
  draggableId: string;
};

/**
 * PackCell — displays a single pack's contents compactly.
 *
 * Shows total weight, product list with individual weights, and item count.
 * The entire cell is draggable via useDraggable.
 */
export const PackCell = ({ pack, dayNumber, packNumber, draggableId }: PackCellProps) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: draggableId,
  });

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

  const hasMismatch = pack.member_slot == null || pack.member_slot === 0 || pack.member_slot !== packNumber;

  const dragStyle: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : undefined,
    zIndex: isDragging ? 999 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      className="bg-background rounded border p-2 space-y-1.5 relative cursor-grab active:cursor-grabbing select-none"
      data-pack-id={pack.packId}
      data-day-number={dayNumber}
      data-pack-number={packNumber}
      data-droppable-id={pack.packId}
      style={dragStyle}
      {...attributes}
      {...listeners}
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

      {/* Product List */}
      <div className="space-y-0.5" data-products-container="true">
        {pack.products.map((product) => (
          <div
            key={product.id}
            className="text-xs text-foreground pl-2 border-l-2 border-muted flex items-center justify-between gap-1"
            data-product-id={product.id}
          >
            <span>• {product.name}</span>
            <span className="text-muted-foreground">{formatWeight(product.totalQuantity)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
