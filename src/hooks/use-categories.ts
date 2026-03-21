import { useQuery } from "@tanstack/react-query";
import { getProductCategories } from "@/api/categories";

export const categoryQueryKeys = {
  all: ["categories"] as const,
  list: () => [...categoryQueryKeys.all, "list"] as const,
};

const CATEGORIES_STALE_TIME_MS = 2 * 60 * 1000;

export const useProductCategories = () =>
  useQuery({
    queryKey: categoryQueryKeys.list(),
    queryFn: getProductCategories,
    staleTime: CATEGORIES_STALE_TIME_MS,
  });
