import { useState } from "react";
import { Loader2 } from "lucide-react";

import { useRecipes } from "@/hooks";
import { Pagination, Skeleton } from "@/components";
import { RecipeCard } from "./recipe-card";

const RECIPES_PAGE_SIZE = 20;

export const RecipesList = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading, isFetching, error, isPlaceholderData } = useRecipes({
    page,
    limit: RECIPES_PAGE_SIZE,
  });
  const recipes = data?.data;
  const meta = data?.meta;
  const showFetchOverlay = isFetching && !isLoading;

  return (
    <div className="space-y-3">
      <div className="relative max-h-[75vh] min-h-[12rem] overflow-y-auto pr-1">
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : error ? (
          <p className="text-destructive text-sm">
            Failed to load recipes: {error instanceof Error ? error.message : "Unknown error"}
          </p>
        ) : !recipes?.length && !isPlaceholderData ? (
          <p className="text-muted-foreground text-sm">No recipes yet. Create one to get started.</p>
        ) : (
          <>
            {recipes?.length ? (
              <ul className="m-0 list-none space-y-2 p-0">
                {recipes.map((recipe) => (
                  <li key={recipe.id}>
                    <RecipeCard recipe={recipe} />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground text-sm">No recipes on this page.</p>
            )}
            {showFetchOverlay ? (
              <div
                className="absolute inset-0 z-10 flex items-center justify-center rounded-md bg-background/55 backdrop-blur-[1px]"
                aria-hidden
              >
                <Loader2 className="size-8 shrink-0 animate-spin text-muted-foreground" aria-label="Loading" />
              </div>
            ) : null}
          </>
        )}
      </div>

      {meta != null && meta.totalPages <= 1 && (
        <p className="text-muted-foreground text-xs">
          {meta.total} {meta.total === 1 ? "recipe" : "recipes"}
          {meta.limit ? ` · ${meta.limit} per page` : null}
        </p>
      )}

      {meta != null && meta.totalPages > 1 && (
        <Pagination
          page={page}
          totalPages={meta.totalPages}
          onPageChange={setPage}
          disabled={isFetching}
          totalItems={meta.total}
        />
      )}
    </div>
  );
};
