import { useState } from "react";
import { PlusCircle } from "lucide-react";

import { useAddHikingProductsFromRecipe } from "@/hooks";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AddRecipeToSlotForm } from "@/components/forms/add-recipe-to-slot-form";

type Props = {
  hikingId: string;
  dayNumber: number;
  eatingTimeId: string;
};

export const AddRecipeToHikingDialog = ({ hikingId, dayNumber, eatingTimeId }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const { mutate, isPending, isError, error, reset: resetMutation } = useAddHikingProductsFromRecipe();

  const handleClose = () => setIsOpen(false);

  return (
    <>
      <Button type="button" variant="outline" size="sm" className="w-full" onClick={() => setIsOpen(true)}>
        <PlusCircle className="mr-1.5 size-3.5" />
        Add recipe
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent showCloseButton>
          <DialogHeader>
            <DialogTitle>Add recipe</DialogTitle>
            <DialogDescription>Select a recipe to add to this meal slot.</DialogDescription>
          </DialogHeader>

          <AddRecipeToSlotForm
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
            <Button type="submit" form="add-recipe-to-slot-form" disabled={isPending}>
              {isPending ? "Adding…" : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
