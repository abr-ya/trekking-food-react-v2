import { useState } from "react";
import { Pencil } from "lucide-react";

import type { Recipe } from "@/types/recipe";
import { useUpdateRecipe } from "@/hooks";
import type { EditRecipeFormData } from "@/schemas/recipe";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EditRecipeForm } from "@/components/forms/edit-recipe-form";

type Props = {
  recipe: Recipe;
};

export const EditRecipeDialog = ({ recipe }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const updateRecipe = useUpdateRecipe();

  const handleClose = () => {
    if (updateRecipe.isPending) return;
    setIsOpen(false);
  };

  const handleSubmit = (data: EditRecipeFormData) => {
    updateRecipe.mutate(
      { id: recipe.id, payload: { name: data.name, description: data.description } },
      { onSuccess: () => setIsOpen(false) },
    );
  };

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="size-7 text-muted-foreground hover:text-foreground [&_svg]:size-3.5"
        aria-label={`Edit ${recipe.name}`}
        onClick={() => setIsOpen(true)}
      >
        <Pencil />
      </Button>

      <Dialog open={isOpen} onOpenChange={(open) => (open ? setIsOpen(true) : handleClose())}>
        <DialogContent showCloseButton>
          <DialogHeader>
            <DialogTitle>Edit recipe</DialogTitle>
            <DialogDescription>Update the name and description for {recipe.name}.</DialogDescription>
          </DialogHeader>

          {isOpen && (
            <EditRecipeForm recipe={recipe} onSubmit={handleSubmit} isSaving={updateRecipe.isPending} />
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={updateRecipe.isPending}>
              Cancel
            </Button>
            <Button type="submit" form="edit-recipe-form" disabled={updateRecipe.isPending}>
              {updateRecipe.isPending ? "Saving…" : "Save changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
