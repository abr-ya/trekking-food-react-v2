import { useState } from "react";
import { PlusCircle } from "lucide-react";

import { useAddRecipeIngredient } from "@/hooks";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AddRecipeIngredientForm } from "@/components/forms/add-recipe-ingredient-form";

type Props = {
  recipeId: string;
};

export const AddRecipeIngredientDialog = ({ recipeId }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const { mutate, isPending, isError, error, reset: resetMutation } = useAddRecipeIngredient();

  const handleClose = () => setIsOpen(false);

  return (
    <>
      <Button type="button" variant="outline" size="sm" onClick={() => setIsOpen(true)}>
        <PlusCircle className="mr-1.5 size-3.5" />
        Add ingredient
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent showCloseButton>
          <DialogHeader>
            <DialogTitle>Add ingredient</DialogTitle>
            <DialogDescription>Search for a product and set the quantity in grams.</DialogDescription>
          </DialogHeader>

          <AddRecipeIngredientForm
            recipeId={recipeId}
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
            <Button type="submit" form="add-recipe-ingredient-form" disabled={isPending}>
              {isPending ? "Adding…" : "Add ingredient"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
