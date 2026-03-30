import { Pencil, Trash2 } from "lucide-react";

import type { RecipeIngredient } from "@/types/recipe";
import { Card, CardContent } from "../";

export const IngredientCard = ({ ing }: { ing: RecipeIngredient }) => {
  return (
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
            onClick={() => console.log("delete ingredient", ing.id)}
            className="text-muted-foreground hover:text-destructive cursor-pointer transition-colors"
            aria-label={`Delete ${ing.product.name}`}
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      </CardContent>
    </Card>
  );
};
