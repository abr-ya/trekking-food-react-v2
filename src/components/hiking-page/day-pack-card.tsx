import { useCallback } from "react";
import { useAssignHikingProductsToPack, useCreateHikingDayPack } from "@/hooks";
import { Button } from "@/components/ui/button";

type DayPackCardProps = {
  dayNumber: number;
  participantIndex: number;
  packId?: string;
  hikingId: string;
  children?: React.ReactNode;
  movedProductIds?: string[];
  totalQuantity?: number;
};

export const DayPackCard = ({
  dayNumber,
  participantIndex,
  packId,
  hikingId,
  children,
  movedProductIds = [],
  totalQuantity = 0,
}: DayPackCardProps) => {
  const createPackMutation = useCreateHikingDayPack();
  const assignProductsMutation = useAssignHikingProductsToPack();

  const handleCreatePack = () => {
    createPackMutation.mutate({
      hikingId,
      payload: {
        dayNumber,
        packNumber: participantIndex + 1,
      },
    });
  };

  const handleSavePack = useCallback(() => {
    if (!packId || movedProductIds.length === 0) return;

    assignProductsMutation.mutate({
      hikingId,
      packId,
      payload: {
        hikingProductIds: movedProductIds,
      },
    });
  }, [packId, movedProductIds, hikingId, assignProductsMutation]);

  return (
    <div className="rounded-md border p-4 bg-card relative">
      {totalQuantity > 0 && <div className="absolute top-3 right-5 text-lg font-medium">{totalQuantity}</div>}
      <div className="space-y-2">
        <h3 className="font-semibold">Pack {participantIndex + 1}</h3>
        <p className="text-sm text-muted-foreground">Day {dayNumber} pack contents</p>
        <div className="text-xs">
          {packId ? (
            <span className="text-green-600 font-medium">Pack ID: {packId}</span>
          ) : (
            <span className="text-orange-600">Pack not found</span>
          )}
        </div>
        {packId ? (
          <>
            <div className="mt-4">{children}</div>
            {movedProductIds.length > 0 && (
              <Button
                size="sm"
                variant="default"
                onClick={handleSavePack}
                disabled={assignProductsMutation.isPending}
                className="w-full mt-4"
              >
                {assignProductsMutation.isPending ? "Saving..." : "Save Pack"}
              </Button>
            )}
          </>
        ) : (
          <div className="mt-4">
            <Button
              size="sm"
              variant="outline"
              onClick={handleCreatePack}
              disabled={createPackMutation.isPending}
              className="w-full"
            >
              {createPackMutation.isPending ? "Creating..." : "Create Pack"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
