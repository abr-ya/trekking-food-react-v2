import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, Loader2, Users } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RHFInput } from "@/components/rhf/rhf-input";
import { useUpdateHikingMembersTotal } from "@/hooks";
import { toastSuccess } from "@/lib/toast";
import { createUpdateMembersTotalSchema, type UpdateMembersTotalFormData } from "@/schemas/hiking";

export type EditMembersTotalDialogProps = {
  hikingId: string;
  currentMembersTotal: number;
  vegetariansTotal: number;
};

export const EditMembersTotalDialog = ({
  hikingId,
  currentMembersTotal,
  vegetariansTotal,
}: EditMembersTotalDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingMembersTotal, setPendingMembersTotal] = useState<number | null>(null);

  const { mutate, isPending, isError, error, reset: resetMutation } = useUpdateHikingMembersTotal();

  const minMembers = Math.max(1, vegetariansTotal);

  const form = useForm<UpdateMembersTotalFormData>({
    resolver: zodResolver(createUpdateMembersTotalSchema(vegetariansTotal)),
    defaultValues: { membersTotal: currentMembersTotal },
    mode: "onSubmit",
  });

  const watchedMembersTotal = form.watch("membersTotal");
  const isUnchanged =
    typeof watchedMembersTotal === "number" && !Number.isNaN(watchedMembersTotal) && watchedMembersTotal === currentMembersTotal;

  const closeAll = () => {
    setIsOpen(false);
    setConfirmOpen(false);
    setPendingMembersTotal(null);
    form.reset({ membersTotal: currentMembersTotal });
    resetMutation();
  };

  const handleMainOpenChange = (open: boolean) => {
    if (!open) {
      closeAll();
      return;
    }
    form.reset({ membersTotal: currentMembersTotal });
    resetMutation();
    setIsOpen(true);
  };

  const submitMembersTotal = (membersTotal: number) => {
    mutate(
      { hikingId, payload: { membersTotal } },
      {
        onSuccess: () => {
          closeAll();
          if (membersTotal > currentMembersTotal) {
            toastSuccess(
              "Group size increased. Product totals were updated. Run Auto-distribute on each day if you need new member packs.",
            );
          } else if (membersTotal < currentMembersTotal) {
            toastSuccess(
              `Group size decreased to ${membersTotal}. Extra day packs were removed and member slots above ${membersTotal} were cleared.`,
            );
          } else {
            toastSuccess("Group size updated.");
          }
        },
      },
    );
  };

  const onFormSubmit = form.handleSubmit(({ membersTotal }) => {
    if (membersTotal === currentMembersTotal) return;
    if (membersTotal < currentMembersTotal) {
      setPendingMembersTotal(membersTotal);
      setConfirmOpen(true);
      return;
    }
    submitMembersTotal(membersTotal);
  });

  const handleConfirmDecrease = () => {
    if (pendingMembersTotal == null) return;
    submitMembersTotal(pendingMembersTotal);
  };

  return (
    <>
      <Button type="button" variant="outline" size="sm" onClick={() => handleMainOpenChange(true)}>
        <Users className="mr-1.5 size-3.5" />
        Change
      </Button>

      <Dialog open={isOpen} onOpenChange={handleMainOpenChange}>
        <DialogContent showCloseButton>
          <DialogHeader>
            <DialogTitle>Change group size</DialogTitle>
            <DialogDescription>
              Update the number of members in this hiking plan. Minimum group size: {vegetariansTotal}{" "}
              {vegetariansTotal === 1 ? "(vegetarian)" : "(vegetarians)"}. Editing vegetarians count is not available
              yet.
            </DialogDescription>
          </DialogHeader>

          <FormProvider {...form}>
            <form id="edit-members-total-form" onSubmit={onFormSubmit} className="flex flex-col gap-4">
              <RHFInput<UpdateMembersTotalFormData>
                name="membersTotal"
                label="Members total"
                type="number"
                step={1}
                min={minMembers}
                id="membersTotal"
                valueAsNumber
              />
              {isError ? (
                <p className="text-destructive text-sm">{error instanceof Error ? error.message : "Request failed."}</p>
              ) : null}
            </form>
          </FormProvider>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleMainOpenChange(false)} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" form="edit-members-total-form" disabled={isPending || isUnchanged}>
              {isPending ? "Saving…" : "Continue"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={confirmOpen}
        onOpenChange={(open) => {
          if (!open && !isPending) {
            setConfirmOpen(false);
            setPendingMembersTotal(null);
          }
        }}
      >
        <DialogContent showCloseButton={!isPending}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Decrease group size to {pendingMembersTotal}?
            </DialogTitle>
            <DialogDescription asChild>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>This action cannot be undone from the UI. The server will:</p>
                <ul className="list-disc space-y-1 pl-5">
                  <li>Recalculate every product total as personal quantity × new group size (manual totals are lost)</li>
                  <li>
                    Delete day packs with pack number greater than {pendingMembersTotal} — their meals become unassigned
                  </li>
                  <li>
                    Clear member slots greater than {pendingMembersTotal} on day packs and trip packs
                  </li>
                </ul>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setConfirmOpen(false);
                setPendingMembersTotal(null);
              }}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="button" onClick={handleConfirmDecrease} disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-1.5 size-3.5 animate-spin" />
                  Saving…
                </>
              ) : (
                "Yes, decrease"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
