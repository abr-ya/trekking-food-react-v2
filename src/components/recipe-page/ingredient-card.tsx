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
        <span className="shrink-0 font-semibold">{ing.quantity} g</span>
      </CardContent>
    </Card>
  );
};
