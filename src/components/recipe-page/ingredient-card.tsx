import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";

import { useDeleteRecipeIngredient } from "@/hooks";
import type { RecipeIngredient } from "@/types/recipe";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "../";

export const IngredientCard = ({ ing }: { ing: RecipeIngredient }) => {
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const { mutate: deleteIngredient, isPending } = useDeleteRecipeIngredient();

  const handleConfirmDelete = () => {
    if (!pendingDeleteId) return;
    deleteIngredient(
      { recipeId: ing.recipeId, ingredientId: pendingDeleteId },
      { onSuccess: () => setPendingDeleteId(null) },
    );
  };

  return (
    <>
      <Card className="py-2 px-4">
        <CardContent className="flex items-center justify-between gap-4 p-0">
          <div className="min-w-0">
            <p className="font-medium">{ing.product.name}</p>
            <p className="text-muted-foreground text-xs">
              {ing.product.kkal} kcal · P: {ing.product.proteins}g · F: {ing.product.fats}g · C:{" "}
              {ing.product.carbohydrates}g
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className="shrink-0 font-semibold">{ing.quantity} g</span>
            <button
              type="button"
              onClick={() => console.log("edit ingredient", ing.id)}
              className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
              aria-label={`Edit ${ing.product.name}`}
            >
              <Pencil className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => setPendingDeleteId(ing.id)}
              className="text-muted-foreground hover:text-destructive cursor-pointer transition-colors"
              aria-label={`Delete ${ing.product.name}`}
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={pendingDeleteId !== null} onOpenChange={(open) => !open && setPendingDeleteId(null)}>
        <DialogContent showCloseButton>
          <DialogHeader>
            <DialogTitle>Remove this ingredient?</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove <span className="font-medium text-foreground">{ing.product.name}</span>?
              This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setPendingDeleteId(null)} disabled={isPending}>
              Cancel
            </Button>
            <Button type="button" variant="destructive" onClick={handleConfirmDelete} disabled={isPending}>
              {isPending ? "Removing…" : "Remove"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
