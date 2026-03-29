import { Pencil } from "lucide-react";
import { Link } from "react-router-dom";
import type { Recipe } from "@/types/recipe";
import { Card, CardContent } from "@/components";

export const RecipeCard = ({ recipe }: { recipe: Recipe }) => (
  <Card className="py-3 px-4">
    <CardContent className="flex flex-wrap items-center justify-between gap-2 p-0">
      <div className="min-w-0 flex-1">
        <Link to={`/recipes/${recipe.id}`} className="font-medium hover:underline">
          {recipe.name}
        </Link>
        <p className="text-muted-foreground line-clamp-2 text-sm">{recipe.description}</p>
      </div>
      <div className="flex flex-wrap items-center gap-1 sm:gap-2">
        <span className="text-muted-foreground text-sm">{recipe.ingredients.length} ingredients</span>
        {recipe.isCommon && (
          <span className="rounded-full bg-primary/15 px-2 py-0.5 text-xs font-medium text-primary">Common</span>
        )}
        <div className="flex items-center gap-0.5">
          <Link
            to={`/recipes/${recipe.id}`}
            className="size-8 mt-2 text-muted-foreground hover:text-foreground [&_svg]:size-4"
          >
            <Pencil />
          </Link>
        </div>
      </div>
    </CardContent>
  </Card>
);
