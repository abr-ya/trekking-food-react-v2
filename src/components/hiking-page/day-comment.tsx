import { Button } from "@/components/ui/button";

type DayCommentProps = {
  dayNumber: number;
  comment: string | undefined;
};

export const DayComment = ({ dayNumber, comment }: DayCommentProps) => (
  <div className="mb-2 rounded-md border bg-muted/30 px-3 py-2 text-sm">
    <span className="font-medium">Day {dayNumber}</span>{" "}
    {comment ? (
      comment
    ) : (
      <Button
        variant="outline"
        size="sm"
        className="h-7 text-xs text-muted-foreground"
        onClick={() => console.log("Add comment for day", dayNumber)}
      >
        + Add comment
      </Button>
    )}
  </div>
);
