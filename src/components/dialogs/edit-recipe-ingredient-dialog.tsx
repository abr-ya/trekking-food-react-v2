import { useState } from "react";
import { Pencil } from "lucide-react";

import { useUpdateRecipeIngredient } from "@/hooks";
import type { RecipeIngredient } from "@/types/recipe";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Props = {
  ingredient: RecipeIngredient;
};

export function EditRecipeIngredientDialog({ ingredient }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [quantity, setQuantity] = useState(ingredient.quantity);
  const { mutate, isPending, isError, error, reset: resetMutation } = useUpdateRecipeIngredient();

  const handleClose = () => {
    setQuantity(ingredient.quantity);
    resetMutation();
    setIsOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quantity <= 0) return;
    mutate(
      {
        recipeId: ingredient.recipeId,
        ingredientId: ingredient.id,
        payload: { quantity },
      },
      { onSuccess: handleClose },
    );
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
        aria-label={`Edit ${ingredient.product.name}`}
      >
        <Pencil className="size-4" />
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent showCloseButton>
          <DialogHeader>
            <DialogTitle>Edit ingredient</DialogTitle>
            <DialogDescription>
              Update the quantity for <span className="font-medium text-foreground">{ingredient.product.name}</span>.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label htmlFor="quantity" className="mb-1 block text-sm font-medium">
                Quantity (g)
              </label>
              <Input
                id="quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                min={1}
              />
            </div>

            {isError ? (
              <p className="text-destructive text-sm">{error instanceof Error ? error.message : "Request failed."}</p>
            ) : null}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose} disabled={isPending}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending || quantity <= 0}>
                {isPending ? "Saving…" : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
