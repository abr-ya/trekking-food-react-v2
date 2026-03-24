import { useEatingTimes, useHiking } from "@/hooks";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AddRecipeToHikingForm } from "@/components";

export const FoodPlan = ({ id }: { id: string }) => {
  const { data: hiking, isLoading, error } = useHiking(id);
  const { data: eatingTimes } = useEatingTimes();

  console.log(eatingTimes);

  if (!id) {
    return <p className="text-muted-foreground text-sm">Hiking id not correct.</p>;
  }

  if (isLoading) {
    return (
      <div className="space-y-3 max-w-md">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    );
  }

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
      <Tabs defaultValue={defaultDay} orientation="vertical" className="w-full gap-4 md:flex-row">
        <TabsList className="h-auto w-full justify-start md:w-40 md:flex-col md:items-stretch">
          {days.map((day) => (
            <TabsTrigger key={day} value={`day-${day}`} className="justify-start">
              Day {day}
            </TabsTrigger>
          ))}
        </TabsList>
        <div className="flex-1">
          {days.map((day) => (
            <TabsContent key={day} value={`day-${day}`} className="pt-1">
              <div className="text-muted-foreground space-y-2 text-sm">
                <p className="text-foreground font-medium">Day {day}</p>
              </div>
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
};
