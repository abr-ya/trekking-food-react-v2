import { useHiking } from "@/hooks";
import { Skeleton } from "@/components/ui/skeleton";

export const HikingInfo = ({ id }: { id: string }) => {
  const { data: hiking, isLoading, error } = useHiking(id);

  if (!id) {
    return <p className="text-muted-foreground text-sm">Hiking id not correct.</p>;
  }

  return (
    <>
      {isLoading ? (
        <div className="space-y-3 max-w-md">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      ) : error ? (
        <p className="text-destructive text-sm">
          Failed to load hiking: {error instanceof Error ? error.message : "Unknown error"}
        </p>
      ) : hiking ? (
        <div className="text-muted-foreground space-y-2 text-sm">
          <p>
            <span className="text-foreground font-medium">Days total:</span> {hiking.daysTotal}
          </p>
          <p>
            <span className="text-foreground font-medium">Members total:</span> {hiking.membersTotal}
          </p>
          <p>
            <span className="text-foreground font-medium">Vegetarians total:</span> {hiking.vegetariansTotal}
          </p>
          {hiking.createdAt ? (
            <p>
              <span className="text-foreground font-medium">Created:</span> {hiking.createdAt}
            </p>
          ) : null}
          {hiking.updatedAt ? (
            <p>
              <span className="text-foreground font-medium">Updated:</span> {hiking.updatedAt}
            </p>
          ) : null}
        </div>
      ) : (
        <p className="text-muted-foreground text-sm">Hiking not found.</p>
      )}
    </>
  );
};
