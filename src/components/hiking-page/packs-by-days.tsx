import { useHiking } from "@/hooks";
import { LoadingSkeleton } from "@/components";
import { DayTabs } from "./day-tabs";
import { DayPackCard } from "./day-pack-card";

export const PacksByDays = ({ id }: { id: string }) => {
  const { data: hiking, isLoading, error } = useHiking(id);

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
          const unassignedProducts = hiking.hiking_products.filter(
            (p) => p.day_number === day && p.hiking_day_pack_id === null,
          );

          return (
            <div className="space-y-6">
              {unassignedProducts.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm">Unassigned products</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {unassignedProducts.map((product) => (
                      <div key={product.id} className="rounded-md border p-3 bg-muted/50">
                        <p className="font-medium text-sm">{product.product_name}</p>
                        <p className="text-xs text-muted-foreground">{product.eating_time_name}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Total: {product.total_quantity} · Personal: {product.personal_quantity}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: hiking.membersTotal }, (_, participantIndex) => {
                  const dayPack = hiking.day_packs.find(
                    (pack) => pack.day_number === day && pack.pack_number === participantIndex + 1,
                  );
                  return (
                    <DayPackCard
                      key={participantIndex}
                      dayNumber={day}
                      participantIndex={participantIndex}
                      packId={dayPack?.id}
                    />
                  );
                })}
              </div>
            </div>
          );
        }}
      </DayTabs>
    </div>
  );
};
