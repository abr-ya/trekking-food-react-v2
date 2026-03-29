import { Link, useParams } from "react-router-dom";
import { useRecipe } from "@/hooks";
import { ProtectedPage } from "@/components";

export const RecipeDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: recipe, isLoading, error } = useRecipe(id);

  return (
    <ProtectedPage title={recipe?.name ?? "Recipe"}>
      <p className="mb-4">
        <Link to="/recipes" className="text-muted-foreground text-sm hover:text-foreground hover:underline">
          ← Back to recipes
        </Link>
      </p>

      {isLoading && <p className="text-muted-foreground text-sm">Loading…</p>}
      {error && (
        <p className="text-destructive text-sm">
          Failed to load recipe: {error instanceof Error ? error.message : "Unknown error"}
        </p>
      )}

      {recipe && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold">{recipe.name}</h1>
            {recipe.isCommon && (
              <span className="rounded-full bg-blue-500/20 px-2 py-0.5 text-xs font-medium text-blue-700 dark:text-blue-400">
                Common
              </span>
            )}
          </div>

          {recipe.description && (
            <p className="text-muted-foreground">{recipe.description}</p>
          )}

          <div>
            <h2 className="mb-3 text-lg font-semibold">Ingredients</h2>
            {recipe.ingredients.length === 0 ? (
              <p className="text-muted-foreground text-sm">No ingredients.</p>
            ) : (
              <p>Ingredients will be added here...</p>
            )}
          </div>
        </div>
      )}
    </ProtectedPage>
  );
};
