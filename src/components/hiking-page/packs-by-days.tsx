import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { DndContext, PointerSensor, useDraggable, useDroppable, useSensor, useSensors } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

import { useHiking } from "@/hooks";
import { LoadingSkeleton } from "@/components";
import { DayTabs } from "./day-tabs";
import { DayPackCard } from "./day-pack-card";
import { DayProductCard } from "./day-product-card";

type ColumnId = "unassigned" | `pack-${number}`;
type ItemsByColumn = Record<ColumnId, string[]>;

function createEmptyColumns(membersTotal: number): ItemsByColumn {
  const base: Partial<ItemsByColumn> = { unassigned: [] };
  for (let i = 1; i <= Math.max(0, membersTotal); i += 1) {
    base[`pack-${i}`] = [];
  }
  return base as ItemsByColumn;
}

export const PacksByDays = ({ id }: { id: string }) => {
  const { data: hiking, isLoading, error } = useHiking(id);
  const [itemsByDay, setItemsByDay] = useState<Record<number, ItemsByColumn>>({});

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  useEffect(() => {
    if (!hiking) return;

    setItemsByDay((prev) => {
      const next = { ...prev };
      const initDays = Array.from({ length: Math.max(1, hiking.daysTotal) }, (_, i) => i + 1);

      for (const day of initDays) {
        if (next[day]) continue;

        const cols = createEmptyColumns(hiking.membersTotal);
        const dayProducts = hiking.hiking_products.filter((p) => p.day_number === day);

        for (const p of dayProducts) {
          if (p.hiking_day_pack_id == null) {
            cols.unassigned.push(p.id);
            continue;
          }

          const packNumber =
            p.hiking_day_pack?.pack_number ??
            hiking.day_packs.find((pack) => pack.id === p.hiking_day_pack_id)?.pack_number ??
            null;

          if (packNumber == null) {
            cols.unassigned.push(p.id);
            continue;
          }

          const colId = `pack-${packNumber}` as ColumnId;
          (cols[colId] ?? cols.unassigned).push(p.id);
        }

        next[day] = cols;
      }

      return next;
    });
    // only initialize once per hiking id (local dnd state is ephemeral)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hiking?.id]);

  const productsById = useMemo(() => {
    if (!hiking) return;

    const map = new Map<string, (typeof hiking.hiking_products)[number]>();
    for (const p of hiking.hiking_products) map.set(p.id, p);
    return map;
  }, [hiking]);

  if (!id) return <p className="text-muted-foreground text-sm">Hiking id not correct.</p>;
  if (isLoading) return <LoadingSkeleton />;

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

  const days = Array.from({ length: Math.max(1, hiking.daysTotal) }, (_, i) => i + 1);

  return (
    <div className="rounded-md border p-3">
      <DayTabs days={days}>
        {(day) => {
          const items = itemsByDay[day] ?? createEmptyColumns(hiking.membersTotal);

          const handleDragEnd = ({ active, over }: { active: { id: unknown }; over: { id: unknown } | null }) => {
            const activeId = String(active.id);
            const overId = over?.id ? String(over.id) : null;
            if (!overId) return;

            const isOverColumn = overId === "unassigned" || overId.startsWith("pack-");
            if (!isOverColumn) return;

            setItemsByDay((prev) => {
              const current = prev[day] ?? createEmptyColumns(hiking.membersTotal);
              const next: ItemsByColumn = { ...current };

              let fromCol: ColumnId | null = null;
              for (const [col, ids] of Object.entries(current) as [ColumnId, string[]][]) {
                if (ids.includes(activeId)) {
                  fromCol = col;
                  break;
                }
              }

              const toCol = overId as ColumnId;
              if (!fromCol || fromCol === toCol) return prev;

              next[fromCol] = (next[fromCol] ?? []).filter((id) => id !== activeId);
              next[toCol] = [...(next[toCol] ?? []), activeId];

              return { ...prev, [day]: next };
            });
          };

          const renderProduct = (productId: string, columnId: string) => {
            const product = productsById!.get(productId);
            if (!product) return null;
            return <DraggableDayProductCard key={productId} product={product} currentColumnId={columnId} />;
          };

          return (
            <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
              <div className="space-y-6">
                <DroppableUnassignedColumn itemIds={items.unassigned ?? []} renderItem={renderProduct} />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Array.from({ length: hiking.membersTotal }, (_, participantIndex) => {
                    const packNumber = participantIndex + 1;
                    const dayPack = hiking.day_packs.find(
                      (pack) => pack.day_number === day && pack.pack_number === packNumber,
                    );
                    const columnId = `pack-${packNumber}` as ColumnId;

                    return (
                      <DroppablePackCard
                        key={packNumber}
                        columnId={columnId}
                        dayNumber={day}
                        participantIndex={participantIndex}
                        packId={dayPack?.id}
                        hikingId={hiking.id}
                        itemIds={items[columnId] ?? []}
                        renderItem={renderProduct}
                        allProducts={productsById}
                      />
                    );
                  })}
                </div>
              </div>
            </DndContext>
          );
        }}
      </DayTabs>
    </div>
  );
};

type DraggableDayProductCardProps = {
  product: Parameters<typeof DayProductCard>[0]["product"];
  currentColumnId?: string;
};

const DraggableDayProductCard = ({ product, currentColumnId }: DraggableDayProductCardProps) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: product.id });

  // Calculate original column position
  let originalColumnId: string;
  if (product.hiking_day_pack_id == null) {
    originalColumnId = "unassigned";
  } else {
    originalColumnId = `pack-${product.hiking_day_pack?.pack_number}`;
  }

  const isMoved = currentColumnId && currentColumnId !== originalColumnId;

  const style: CSSProperties = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.65 : undefined,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
      <DayProductCard product={product} isMoved={!!isMoved} />
    </div>
  );
};

const DroppableUnassignedColumn = ({
  itemIds,
  renderItem,
}: {
  itemIds: string[];
  renderItem: (id: string, columnId: string) => React.ReactNode;
}) => {
  const { isOver, setNodeRef } = useDroppable({ id: "unassigned" });

  return (
    <div ref={setNodeRef} className={`rounded-md border p-3 bg-card ${isOver ? "ring-2 ring-primary/40" : ""}`}>
      <h3 className="font-semibold text-sm mb-2">Unassigned products</h3>
      {itemIds.length === 0 ? (
        <p className="text-muted-foreground text-sm">Drop products here.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {itemIds.map((id) => renderItem(id, "unassigned"))}
        </div>
      )}
    </div>
  );
};

const DroppablePackCard = ({
  columnId,
  dayNumber,
  participantIndex,
  packId,
  hikingId,
  itemIds,
  renderItem,
  allProducts,
}: {
  columnId: ColumnId;
  dayNumber: number;
  participantIndex: number;
  packId?: string;
  hikingId: string;
  itemIds: string[];
  renderItem: (id: string, columnId: string) => React.ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  allProducts?: Map<string, any>;
}) => {
  const { isOver, setNodeRef } = useDroppable({ id: columnId });

  // Determine which products were moved into this pack
  const movedProductIds = useMemo(() => {
    if (!packId || !allProducts) return [];

    const moved: string[] = [];
    for (const productId of itemIds) {
      const product = allProducts.get(productId);
      if (!product) continue;

      // Product is moved if it wasn't originally in this pack
      let originalPackId: string | null = null;
      if (product.hiking_day_pack_id != null) {
        originalPackId = product.hiking_day_pack_id;
      }

      const currentPackId = columnId.startsWith("pack-") ? packId : null;

      // If the original pack doesn't match current, it was moved
      if (originalPackId !== currentPackId) {
        moved.push(productId);
      }
    }
    return moved;
  }, [packId, itemIds, columnId, allProducts]);

  return (
    <div ref={setNodeRef} className={isOver ? "ring-2 ring-primary/40 rounded-md" : undefined}>
      <DayPackCard
        dayNumber={dayNumber}
        participantIndex={participantIndex}
        packId={packId}
        hikingId={hikingId}
        movedProductIds={movedProductIds}
      >
        <div className="grid grid-cols-1 gap-3">
          {itemIds.length === 0 ? (
            <p className="text-muted-foreground text-sm">Drop products here.</p>
          ) : (
            itemIds.map((id) => renderItem(id, columnId))
          )}
        </div>
      </DayPackCard>
    </div>
  );
};
