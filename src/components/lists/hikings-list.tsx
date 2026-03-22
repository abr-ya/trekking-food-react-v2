import { useHikings } from "@/hooks";
import { Skeleton } from "@/components/ui/skeleton";
import { HikingCard } from "./hiking-card";

export const HikingsList = () => {
  const { data, isLoading, error } = useHikings();
  const hikings = data?.data;
  const meta = data?.meta;

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-destructive text-sm">
        Failed to load hikings: {error instanceof Error ? error.message : "Unknown error"}
      </p>
    );
  }

  if (!hikings?.length) {
    return <p className="text-muted-foreground text-sm">No hikings yet. Create one to get started.</p>;
  }

  return (
    <div className="space-y-3">
      <ul className="m-0 list-none space-y-2 p-0">
        {hikings.map((hiking) => (
          <li key={hiking.id}>
            <HikingCard hiking={hiking} />
          </li>
        ))}
      </ul>
      {meta != null && (
        <p className="text-muted-foreground text-xs">
          Page {meta.page} of {meta.totalPages} · {meta.total} total · {meta.limit} per page
        </p>
      )}
    </div>
  );
};
