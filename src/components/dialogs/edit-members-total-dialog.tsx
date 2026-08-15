import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, Loader2, Users } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
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
    typeof watchedMembersTotal === "number" &&
    !Number.isNaN(watchedMembersTotal) &&
    watchedMembersTotal === currentMembersTotal;

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
            toastSuccess(t("pages.hikingDetail.overview.editMembers.toastIncreased"));
          } else if (membersTotal < currentMembersTotal) {
            toastSuccess(t("pages.hikingDetail.overview.editMembers.toastDecreased", { count: membersTotal }));
          } else {
            toastSuccess(t("pages.hikingDetail.overview.editMembers.toastUpdated"));
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

  const vegetarianLabel =
    vegetariansTotal === 1
      ? t("pages.hikingDetail.overview.editMembers.vegetarianSingular")
      : t("pages.hikingDetail.overview.editMembers.vegetarianPlural");

  return (
    <>
      <Button type="button" variant="outline" size="sm" onClick={() => handleMainOpenChange(true)}>
        <Users className="mr-1.5 size-3.5" />
        {t("pages.hikingDetail.overview.editMembers.changeButton")}
      </Button>

      <Dialog open={isOpen} onOpenChange={handleMainOpenChange}>
        <DialogContent showCloseButton>
          <DialogHeader>
            <DialogTitle>{t("pages.hikingDetail.overview.editMembers.title")}</DialogTitle>
            <DialogDescription>
              {t("pages.hikingDetail.overview.editMembers.description", {
                count: vegetariansTotal,
                vegetarianLabel,
              })}
            </DialogDescription>
          </DialogHeader>

          <FormProvider {...form}>
            <form id="edit-members-total-form" onSubmit={onFormSubmit} className="flex flex-col gap-4">
              <RHFInput<UpdateMembersTotalFormData>
                name="membersTotal"
                label={t("pages.hikingDetail.overview.editMembers.membersTotalLabel")}
                type="number"
                step={1}
                min={minMembers}
                id="membersTotal"
                valueAsNumber
              />
              {isError ? (
                <p className="text-destructive text-sm">
                  {error instanceof Error ? error.message : t("pages.hikingDetail.overview.editMembers.requestFailed")}
                </p>
              ) : null}
            </form>
          </FormProvider>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleMainOpenChange(false)} disabled={isPending}>
              {t("pages.hikingDetail.overview.editMembers.cancel")}
            </Button>
            <Button type="submit" form="edit-members-total-form" disabled={isPending || isUnchanged}>
              {isPending
                ? t("pages.hikingDetail.overview.editMembers.saving")
                : t("pages.hikingDetail.overview.editMembers.continue")}
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
              {t("pages.hikingDetail.overview.editMembers.confirmTitle", { count: pendingMembersTotal })}
            </DialogTitle>
            <DialogDescription asChild>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>{t("pages.hikingDetail.overview.editMembers.confirmIntro")}</p>
                <ul className="list-disc space-y-1 pl-5">
                  <li>{t("pages.hikingDetail.overview.editMembers.confirmBulletRecalc")}</li>
                  <li>
                    {t("pages.hikingDetail.overview.editMembers.confirmBulletDeletePacks", {
                      count: pendingMembersTotal,
                    })}
                  </li>
                  <li>
                    {t("pages.hikingDetail.overview.editMembers.confirmBulletClearSlots", {
                      count: pendingMembersTotal,
                    })}
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
              {t("pages.hikingDetail.overview.editMembers.cancel")}
            </Button>
            <Button type="button" onClick={handleConfirmDecrease} disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-1.5 size-3.5 animate-spin" />
                  {t("pages.hikingDetail.overview.editMembers.saving")}
                </>
              ) : (
                t("pages.hikingDetail.overview.editMembers.confirmDecrease")
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
