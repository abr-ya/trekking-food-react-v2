import { useId, useMemo, useState } from "react";
import { ChevronDown, ChevronRight, EyeOff } from "lucide-react";

import { useHiddenRecipes } from "@/hooks";
import type { HikingProduct } from "@/types/hiking-product";
import { groupRecipesByDays } from "./hiking-helpers";

type RecipesByDaysProps = {
  hikingId: string;
  hikingProducts: HikingProduct[];
};

export const RecipesByDays = ({ hikingId, hikingProducts }: RecipesByDaysProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const { isHidden, hide, reset } = useHiddenRecipes(hikingId);
  const bodyId = useId();

  const { all, visible, hiddenCount } = useMemo(() => {
    const all = groupRecipesByDays(hikingProducts);
    const visible = all.filter((r) => !isHidden(r.recipeId));
    return { all, visible, hiddenCount: all.length - visible.length };
  }, [hikingProducts, isHidden]);

  if (all.length === 0) return null;

  return (
    <section className="mt-3 rounded-md border bg-muted/30 text-sm" aria-label="Recipes by days">
      <header className="flex items-center justify-between gap-2 px-3 py-2">
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
          aria-controls={bodyId}
          className="flex flex-1 items-center gap-2 text-left font-medium hover:text-foreground"
        >
          {isOpen ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
          <span>
            Recipes by days <span className="text-muted-foreground font-normal">({all.length})</span>
          </span>
        </button>
        {hiddenCount > 0 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              reset();
            }}
            className="text-muted-foreground hover:text-foreground cursor-pointer text-xs underline-offset-2 hover:underline"
          >
            Show all ({hiddenCount} hidden)
          </button>
        )}
      </header>

      {isOpen && (
        <div id={bodyId} className="border-t px-3 py-2">
          {visible.length === 0 ? (
            <p className="text-muted-foreground py-1 text-xs">All recipes are hidden.</p>
          ) : (
            <ul className="flex flex-col divide-y">
              {visible.map((recipe) => (
                <li
                  key={recipe.recipeId}
                  className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 py-1.5"
                >
                  <span className="min-w-0 flex-1 truncate font-medium" title={recipe.recipeName}>
                    {recipe.recipeName}
                  </span>
                  <span className="text-muted-foreground tabular-nums text-xs">
                    Days: {recipe.days.join(", ")}
                  </span>
                  <button
                    type="button"
                    onClick={() => hide(recipe.recipeId)}
                    className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                    aria-label={`Hide ${recipe.recipeName} from this list`}
                    title="Hide from this list"
                  >
                    <EyeOff className="size-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </section>
  );
};
