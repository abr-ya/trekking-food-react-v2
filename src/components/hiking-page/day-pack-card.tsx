type DayPackCardProps = {
  dayNumber: number;
  participantIndex: number;
};

export const DayPackCard = ({ dayNumber, participantIndex }: DayPackCardProps) => {
  return (
    <div className="rounded-md border p-4 bg-card">
      <div className="space-y-2">
        <h3 className="font-semibold">Pack {participantIndex + 1}</h3>
        <p className="text-sm text-muted-foreground">Day {dayNumber} pack contents</p>
        {/* Pack details will be added here */}
        <div className="mt-4 p-3 bg-muted rounded text-sm text-muted-foreground">Pack details placeholder</div>
      </div>
    </div>
  );
};
