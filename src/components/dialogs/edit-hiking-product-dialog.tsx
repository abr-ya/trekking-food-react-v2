import { useEffect } from "react";
import { FormProvider, useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useUpdateHikingProduct } from "@/hooks";
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
import { hikingProductQuantitiesSchema, type HikingProductQuantitiesFormData } from "@/schemas/add-product-to-hiking";
import type { HikingProduct } from "@/types/hiking-product";

export type EditHikingProductDialogProps = {
  hikingId: string;
  item: HikingProduct | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const EditHikingProductDialog = ({ hikingId, item, open, onOpenChange }: EditHikingProductDialogProps) => {
  const { mutate, isPending, isError, error, reset: resetMutation } = useUpdateHikingProduct();

  const form = useForm<HikingProductQuantitiesFormData>({
    resolver: zodResolver(hikingProductQuantitiesSchema),
    defaultValues: { personalQuantity: 0, totalQuantity: 0 },
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  useEffect(() => {
    if (open && item) {
      form.reset({
        personalQuantity: item.personal_quantity,
        totalQuantity: item.total_quantity,
      });
      resetMutation();
    }
  }, [open, item, form, resetMutation]);

  const onSubmit: SubmitHandler<HikingProductQuantitiesFormData> = (data) => {
    if (!item) return;
    mutate(
      {
        hikingId,
        hikingProductId: item.id,
        payload: {
          personalQuantity: data.personalQuantity,
          totalQuantity: data.totalQuantity,
        },
      },
      {
        onSuccess: () => {
          resetMutation();
          onOpenChange(false);
        },
      },
    );
  };

  const handleClose = () => onOpenChange(false);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton>
        <DialogHeader>
          <DialogTitle>Edit quantities</DialogTitle>
          <DialogDescription>
            {item ? (
              <>
                Update per-person and total grams for <span className="font-medium text-foreground">{item.product_name}</span>.
              </>
            ) : null}
          </DialogDescription>
        </DialogHeader>

        <FormProvider {...form}>
          <form
            id="edit-hiking-product-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <div className="flex gap-3">
              <div className="flex-1">
                <RHFInput<HikingProductQuantitiesFormData> name="personalQuantity" label="Personal qty (g)" isNumber />
              </div>
              <div className="flex-1">
                <RHFInput<HikingProductQuantitiesFormData> name="totalQuantity" label="Total qty (g)" isNumber />
              </div>
            </div>

            {isError ? (
              <p className="text-destructive text-sm">{error instanceof Error ? error.message : "Request failed."}</p>
            ) : null}
          </form>
        </FormProvider>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleClose} disabled={isPending}>
            Cancel
          </Button>
          <Button type="submit" form="edit-hiking-product-form" disabled={isPending}>
            {isPending ? "Saving…" : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
