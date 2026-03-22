import { useQuery } from "@tanstack/react-query";
import { getProductCategories, getRecipeCategories } from "@/api/categories";

export const categoryQueryKeys = {
  all: ["categories"] as const,
  list: () => [...categoryQueryKeys.all, "list"] as const,
};

export const recipeCategoryQueryKeys = {
  all: ["recipe-categories"] as const,
  list: () => [...recipeCategoryQueryKeys.all, "list"] as const,
};

const CATEGORIES_STALE_TIME_MS = 2 * 60 * 1000;

export const useProductCategories = () =>
  useQuery({
    queryKey: categoryQueryKeys.list(),
    queryFn: getProductCategories,
    staleTime: CATEGORIES_STALE_TIME_MS,
  });

export const useRecipeCategories = () =>
  useQuery({
    queryKey: recipeCategoryQueryKeys.list(),
    queryFn: getRecipeCategories,
    staleTime: CATEGORIES_STALE_TIME_MS,
  });
