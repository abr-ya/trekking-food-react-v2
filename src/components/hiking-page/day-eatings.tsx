import { useEatingTimes } from "@/hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components";
import { Skeleton } from "@/components/ui/skeleton";
import type { HikingProduct } from "@/types/hiking-product";
import { AddFooter } from "./add-footer";
import { EatingCard } from "./eating-card";
import { groupProductsByRecipeId } from "./hiking-helpers";

export type DayEatingsProps = {
  dayNumber: number;
  hikingProducts: HikingProduct[];
  hikingId: string;
};

export const DayEatings = ({ dayNumber, hikingProducts, hikingId }: DayEatingsProps) => {
  const { data: eatingTimesData, isLoading, error } = useEatingTimes();
  const eatingTimes = eatingTimesData?.data ?? [];

  const productsForDay = hikingProducts.filter((p) => p.day_number === dayNumber);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-40 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-destructive text-sm">
        Failed to load eating times{error instanceof Error ? `: ${error.message}` : ""}.
      </p>
    );
  }

  if (eatingTimes.length === 0) {
    return <p className="text-muted-foreground text-sm">No eating times configured.</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {eatingTimes.map((slot) => (
        <Card key={slot.id} className="gap-0 py-4">
          <CardHeader className="pb-2 pt-0">
            <CardTitle className="text-base font-semibold">{slot.name}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 pb-2 pt-0">
            {groupProductsByRecipeId(productsForDay.filter((p) => p.eating_time_id === slot.id)).map((items) => (
              <EatingCard
                key={items[0].recipe_id || items.map((p) => p.id).join("-")}
                items={items}
              />
            ))}
          </CardContent>
          <AddFooter position={{ hikingId, dayNumber, eatingTimeId: slot.id }} />
        </Card>
      ))}
    </div>
  );
};
