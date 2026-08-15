import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { UserPlus } from "lucide-react";
import { useTranslation } from "react-i18next";

import { useAddHikingAdmin } from "@/hooks";
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

type FormData = {
  userId: string;
};

type Props = {
  hikingId: string;
};

export const AddHikingAdminDialog = ({ hikingId }: Props) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const { mutate, isPending, isError, error, reset: resetMutation } = useAddHikingAdmin();

  const form = useForm<FormData>({ defaultValues: { userId: "" } });

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      form.reset();
      resetMutation();
    }
  };

  const onSubmit = form.handleSubmit(({ userId }) => {
    mutate({ hikingId, payload: { userId: userId.trim() } }, { onSuccess: () => handleOpenChange(false) });
  });

  return (
    <>
      <Button type="button" variant="outline" size="sm" onClick={() => setIsOpen(true)}>
        <UserPlus className="mr-1.5 size-3.5" />
        {t("pages.hikingDetail.overview.addAdmin.addButton")}
      </Button>

      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent showCloseButton>
          <DialogHeader>
            <DialogTitle>{t("pages.hikingDetail.overview.addAdmin.title")}</DialogTitle>
            <DialogDescription>{t("pages.hikingDetail.overview.addAdmin.description")}</DialogDescription>
          </DialogHeader>

          <FormProvider {...form}>
            <form id="add-hiking-admin-form" onSubmit={onSubmit} className="flex flex-col gap-4">
              <RHFInput<FormData>
                name="userId"
                label={t("pages.hikingDetail.overview.addAdmin.userIdLabel")}
                placeholder={t("pages.hikingDetail.overview.addAdmin.userIdPlaceholder")}
                autoComplete="off"
              />
              {isError ? (
                <p className="text-destructive text-sm">
                  {error instanceof Error ? error.message : t("pages.hikingDetail.overview.addAdmin.requestFailed")}
                </p>
              ) : null}
            </form>
          </FormProvider>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              {t("pages.hikingDetail.overview.addAdmin.cancel")}
            </Button>
            <Button type="submit" form="add-hiking-admin-form" disabled={isPending}>
              {isPending
                ? t("pages.hikingDetail.overview.addAdmin.adding")
                : t("pages.hikingDetail.overview.addAdmin.submit")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
