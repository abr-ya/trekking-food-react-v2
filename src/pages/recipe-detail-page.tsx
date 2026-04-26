import { useNavigate, useParams } from "react-router-dom";
import { useRecipe } from "@/hooks";
import {
  AddRecipeIngredientDialog,
  EditRecipeCategoryDialog,
  EditRecipeDialog,
  IngredientCard,
  ProtectedPage,
} from "@/components";

export const RecipeDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: recipe, isLoading, error } = useRecipe(id);

  return (
    <ProtectedPage title={recipe?.name ?? "Recipe"}>
      <p className="mb-4">
        <button
          onClick={() => navigate(-1)}
          className="text-muted-foreground text-sm hover:text-foreground hover:underline cursor-pointer"
        >
          ← Back
        </button>
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
            <EditRecipeDialog recipe={recipe} />
            {recipe.category ? (
              <div className="flex items-center gap-0.5">
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                  {recipe.category.name}
                </span>
                <EditRecipeCategoryDialog recipe={recipe} />
              </div>
            ) : (
              <EditRecipeCategoryDialog recipe={recipe} />
            )}
            {recipe.isCommon && (
              <span className="rounded-full bg-blue-500/20 px-2 py-0.5 text-xs font-medium text-blue-700 dark:text-blue-400">
                Common
              </span>
            )}
          </div>

          {recipe.description && <p className="text-muted-foreground">{recipe.description}</p>}

          <div>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Ingredients</h2>
              {id && <AddRecipeIngredientDialog recipeId={id} />}
            </div>
            {recipe.ingredients.length === 0 ? (
              <p className="text-muted-foreground text-sm">No ingredients.</p>
            ) : (
              <ul className="space-y-2 list-none p-0 m-0">
                {recipe.ingredients.map((ing) => (
                  <li key={ing.id}>
                    <IngredientCard ing={ing} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </ProtectedPage>
  );
};
