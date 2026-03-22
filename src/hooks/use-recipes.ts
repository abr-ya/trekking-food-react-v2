import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postRecipe } from "@/api/recipes";
import type { CreateRecipePayload } from "@/types/recipe";

export const recipeQueryKeys = {
  all: ["recipes"] as const,
  list: () => [...recipeQueryKeys.all, "list"] as const,
};

/**
 * Create a recipe (`POST /recipes`). On success, invalidates recipe queries for future `useRecipes` lists.
 */
export const useCreateRecipe = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateRecipePayload) => postRecipe(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: recipeQueryKeys.all }),
  });
};
