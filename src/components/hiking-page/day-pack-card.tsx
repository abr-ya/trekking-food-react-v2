import { useCreateHikingDayPack } from "@/hooks";
import { Button } from "@/components/ui/button";

type DayPackCardProps = {
  dayNumber: number;
  participantIndex: number;
  packId?: string;
  hikingId: string;
  children?: React.ReactNode;
};

export const DayPackCard = ({ dayNumber, participantIndex, packId, hikingId, children }: DayPackCardProps) => {
  const createPackMutation = useCreateHikingDayPack();

  const handleCreatePack = () => {
    createPackMutation.mutate({
      hikingId,
      payload: {
        dayNumber,
        packNumber: participantIndex + 1,
      },
    });
  };

  return (
    <div className="rounded-md border p-4 bg-card">
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
          <div className="mt-4">{children}</div>
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
