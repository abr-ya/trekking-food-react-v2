import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteRecipeIngredient, getRecipe, getRecipes, postRecipe } from "@/api/recipes";
import type { CreateRecipePayload } from "@/types/recipe";

const RECIPES_STALE_TIME_MS = 2 * 60 * 1000; // 2 minutes — match `useProducts`

const DEFAULT_LIST_PAGE = 1;
const DEFAULT_LIST_LIMIT = 20;

export type UseRecipesParams = {
  page?: number;
  limit?: number;
  search?: string;
};

export const recipeQueryKeys = {
  all: ["recipes"] as const,
  list: (params: { page: number; limit: number; search: string }) =>
    [...recipeQueryKeys.all, "list", params.page, params.limit, params.search] as const,
  detail: (id: string) => [...recipeQueryKeys.all, "detail", id] as const,
};

/**
 * Fetch recipes (`GET /recipes`) with pagination and optional name search. Pass `page`, `limit`, `search` like a product list.
 */
export const useRecipes = (params: UseRecipesParams = {}) => {
  const page = params.page ?? DEFAULT_LIST_PAGE;
  const limit = params.limit ?? DEFAULT_LIST_LIMIT;
  const search = params.search ?? "";

  return useQuery({
    queryKey: recipeQueryKeys.list({ page, limit, search }),
    queryFn: () => getRecipes({ page, limit, search: search.trim() || undefined }),
    staleTime: RECIPES_STALE_TIME_MS,
  });
};

export const useRecipe = (id: string | undefined) =>
  useQuery({
    queryKey: recipeQueryKeys.detail(id ?? ""),
    queryFn: () => getRecipe(id!),
    enabled: Boolean(id),
    staleTime: RECIPES_STALE_TIME_MS,
  });

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

export type DeleteRecipeIngredientVariables = {
  recipeId: string;
  ingredientId: string;
};

/**
 * Delete an ingredient from a recipe (`DELETE /recipes/:recipeId/ingredients/:ingredientId`).
 * On success, invalidates recipe queries.
 */
export const useDeleteRecipeIngredient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ recipeId, ingredientId }: DeleteRecipeIngredientVariables) =>
      deleteRecipeIngredient(recipeId, ingredientId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: recipeQueryKeys.all }),
  });
};
