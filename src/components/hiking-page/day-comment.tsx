import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DayCommentDialog } from "@/components/dialogs/day-comment-dialog";

type DayCommentProps = {
  hikingId: string;
  dayNumber: number;
  comment: string | undefined;
};

export const DayComment = ({ hikingId, dayNumber, comment }: DayCommentProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="mb-2 rounded-md border bg-muted/30 px-3 py-2 text-sm">
      <span className="font-medium">Day {dayNumber}</span>{" "}
      {comment ? (
        <button
          type="button"
          className="cursor-pointer underline decoration-dotted underline-offset-2 hover:opacity-80"
          onClick={() => setDialogOpen(true)}
        >
          {comment}
        </button>
      ) : (
        <Button
          variant="outline"
          size="sm"
          className="h-7 text-xs text-muted-foreground"
          onClick={() => setDialogOpen(true)}
        >
          + Add comment
        </Button>
      )}
      <DayCommentDialog
        hikingId={hikingId}
        dayNumber={dayNumber}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initialComment={comment}
      />
    </div>
  );
};
