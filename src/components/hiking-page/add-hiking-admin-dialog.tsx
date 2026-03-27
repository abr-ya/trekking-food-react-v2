import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { UserPlus } from "lucide-react";

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
import { RHFInput } from "@/components/rhf/RHFInput";

type FormData = {
  userId: string;
};

type Props = {
  hikingId: string;
};

export const AddHikingAdminDialog = ({ hikingId }: Props) => {
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
        Add admin
      </Button>

      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent showCloseButton>
          <DialogHeader>
            <DialogTitle>Add admin</DialogTitle>
            <DialogDescription>Enter the user ID to grant admin access to this hiking plan.</DialogDescription>
          </DialogHeader>

          <FormProvider {...form}>
            <form id="add-hiking-admin-form" onSubmit={onSubmit} className="flex flex-col gap-4">
              <RHFInput<FormData>
                name="userId"
                label="User ID"
                placeholder="e.g. a1b2c3d4-e5f6-4789-a012-345678901234"
                autoComplete="off"
              />
              {isError ? (
                <p className="text-destructive text-sm">{error instanceof Error ? error.message : "Request failed."}</p>
              ) : null}
            </form>
          </FormProvider>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" form="add-hiking-admin-form" disabled={isPending}>
              {isPending ? "Adding…" : "Add admin"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
