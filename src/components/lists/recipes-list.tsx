import { useRecipes } from "@/hooks";
import { Skeleton } from "@/components/ui/skeleton";
import { RecipeCard } from "./recipe-card";

export const RecipesList = () => {
  const { data, isLoading, error } = useRecipes();
  const recipes = data?.data;
  const meta = data?.meta;

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-destructive text-sm">
        Failed to load recipes: {error instanceof Error ? error.message : "Unknown error"}
      </p>
    );
  }

  if (!recipes?.length) {
    return <p className="text-muted-foreground text-sm">No recipes yet. Create one to get started.</p>;
  }

  return (
    <div className="space-y-3">
      <ul className="m-0 list-none space-y-2 p-0">
        {recipes.map((recipe) => (
          <li key={recipe.id}>
            <RecipeCard recipe={recipe} />
          </li>
        ))}
      </ul>
      {meta != null && (
        <p className="text-muted-foreground text-xs">
          Page {meta.page} of {meta.totalPages} · {meta.total} total · {meta.limit} per page
        </p>
      )}
    </div>
  );
};
