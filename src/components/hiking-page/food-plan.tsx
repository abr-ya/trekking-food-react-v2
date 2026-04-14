import { useHiking } from "@/hooks";
import { AddRecipeToHikingForm, DayEatings, LoadingSkeleton, DayComment } from "@/components";
import { DayTabs } from "./day-tabs";

export const FoodPlan = ({ id }: { id: string }) => {
  const { data: hiking, isLoading, error } = useHiking(id);

  if (!id) return <p className="text-muted-foreground text-sm">Hiking id not correct.</p>;
  if (isLoading) return <LoadingSkeleton />;

  if (error) {
    return (
      <p className="text-destructive text-sm">
        Failed to load food plan: {error instanceof Error ? error.message : "Unknown error"}
      </p>
    );
  }

  if (!hiking) {
    return <p className="text-muted-foreground text-sm">Hiking not found.</p>;
  }

  const days = Array.from({ length: Math.max(1, hiking.daysTotal) }, (_, i) => i + 1);
  const defaultDay = `day-${days[0]}`;

  return (
    <div className="rounded-md border p-3">
      <AddRecipeToHikingForm hikingId={id} />
      <DayTabs days={days} defaultValue={defaultDay}>
        {(day) => (
          <>
            <DayComment
              hikingId={id}
              dayNumber={day}
              comment={hiking.day_comments?.find((c) => c.day_number === day)?.comment}
            />
            <DayEatings hikingId={id} dayNumber={day} hikingProducts={hiking.hiking_products} />
          </>
        )}
      </DayTabs>
    </div>
  );
};
