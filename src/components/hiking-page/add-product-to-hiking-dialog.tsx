import { useState } from "react";
import { PlusCircle } from "lucide-react";

import { useAddHikingProduct } from "@/hooks";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AddProductToHikingForm } from "@/components/forms/add-product-to-hiking-form";

type Props = {
  hikingId: string;
  dayNumber: number;
  eatingTimeId: string;
};

export function AddProductToHikingDialog({ hikingId, dayNumber, eatingTimeId }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const { mutate, isPending, isError, error, reset: resetMutation } = useAddHikingProduct();

  const handleClose = () => setIsOpen(false);

  return (
    <>
      <Button type="button" variant="outline" size="sm" onClick={() => setIsOpen(true)}>
        <PlusCircle className="mr-1.5 size-3.5" />
        Add product
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent showCloseButton>
          <DialogHeader>
            <DialogTitle>Add product</DialogTitle>
            <DialogDescription>
              Search for a product and set per-person and total quantities for day {dayNumber}.
            </DialogDescription>
          </DialogHeader>

          <AddProductToHikingForm
            hikingId={hikingId}
            dayNumber={dayNumber}
            eatingTimeId={eatingTimeId}
            mutate={mutate}
            isError={isError}
            error={error}
            resetMutation={resetMutation}
            onSuccess={handleClose}
          />

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" form="add-product-to-hiking-form" disabled={isPending}>
              {isPending ? "Adding…" : "Add product"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
