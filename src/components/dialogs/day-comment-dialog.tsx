import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateHikingDayComment, useUpdateHikingDayComment } from "@/hooks";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RHFInput } from "@/components/rhf";

const dayCommentFormSchema = z.object({
  comment: z
    .string()
    .trim()
    .min(3, "Comment must be at least 3 characters")
    .max(500, "Comment must be at most 500 characters"),
});

type DayCommentFormFormData = z.infer<typeof dayCommentFormSchema>;

export type DayCommentDialogProps = {
  hikingId: string;
  dayNumber: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** When set, dialog edits this comment. When null/undefined, dialog creates a new comment. */
  initialComment?: string | null;
};

export function DayCommentDialog({
  hikingId,
  dayNumber,
  open,
  onOpenChange,
  initialComment = null,
}: DayCommentDialogProps) {
  const isEdit = initialComment != null;

  const createMutation = useCreateHikingDayComment();
  const updateMutation = useUpdateHikingDayComment();

  const form = useForm<DayCommentFormFormData>({
    resolver: zodResolver(dayCommentFormSchema),
    defaultValues: { comment: "" },
    mode: "onSubmit",
  });

  const { handleSubmit, reset } = form;

  useEffect(() => {
    if (open) {
      reset({ comment: initialComment ?? "" });
    }
  }, [open, initialComment, reset]);

  const saving = isEdit ? updateMutation.isPending : createMutation.isPending;

  const onSubmit = handleSubmit(async (data) => {
    const trimmed = data.comment.trim();
    if (!trimmed) return;

    if (isEdit) {
      await updateMutation.mutateAsync({
        hikingId,
        dayNumber,
        payload: { comment: trimmed },
      });
    } else {
      await createMutation.mutateAsync({
        hikingId,
        payload: { dayNumber, comment: trimmed },
      });
    }
    onOpenChange(false);
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit comment" : "Add comment"} for day {dayNumber}
          </DialogTitle>
          <DialogDescription>
            {isEdit ? "Update the comment for this day." : "Add a note for this day of the hiking."}
          </DialogDescription>
        </DialogHeader>
        <FormProvider {...form}>
          <form onSubmit={onSubmit} className="grid gap-4" noValidate>
            <RHFInput<DayCommentFormFormData>
              name="comment"
              label="Comment"
              type="text"
              autoComplete="off"
              placeholder="e.g. Breakfast at the mountain hut"
              id={`day-comment-${dayNumber}`}
            />
            <DialogFooter className="gap-2 sm:gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? "Saving…" : isEdit ? "Save" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
