import { useHiking } from "@/hooks";
import { AddHikingAdminDialog, LoadingSkeleton } from "@/components";

export const HikingInfo = ({ id }: { id: string }) => {
  const { data: hiking, isLoading, error } = useHiking(id);

  if (!id) return <p className="text-muted-foreground text-sm">Hiking id not correct.</p>;
  if (isLoading) return <LoadingSkeleton />;

  if (error) {
    return (
      <p className="text-destructive text-sm">
        Failed to load hiking: {error instanceof Error ? error.message : "Unknown error"}
      </p>
    );
  }

  if (!hiking) {
    return <p className="text-muted-foreground text-sm">Hiking not found.</p>;
  }

  return (
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
      {hiking.userId ? (
        <p>
          <span className="text-foreground font-medium">Created by:</span> {hiking.userId}
        </p>
      ) : null}
      {hiking.updatedAt ? (
        <p>
          <span className="text-foreground font-medium">Updated:</span> {hiking.updatedAt}
        </p>
      ) : null}
      <div className="flex items-center gap-3">
        <p>
          <span className="text-foreground font-medium">Admins:</span>{" "}
          {hiking.admins.length > 0 ? hiking.admins.map((admin) => admin.name).join(", ") : "No admins yet."}
        </p>
        <AddHikingAdminDialog hikingId={hiking.id} />
      </div>
    </div>
  );
};
