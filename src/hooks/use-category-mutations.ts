import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchProductCategory, patchRecipeCategory, postProductCategory, postRecipeCategory } from "@/api/categories";
import { categoryQueryKeys, recipeCategoryQueryKeys } from "./use-categories";

export const useCreateProductCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { name: string }) => postProductCategory(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: categoryQueryKeys.all }),
  });
};

export const useUpdateProductCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) => patchProductCategory(id, { name }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: categoryQueryKeys.all }),
  });
};

export const useCreateRecipeCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { name: string }) => postRecipeCategory(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: recipeCategoryQueryKeys.all }),
  });
};

export const useUpdateRecipeCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) => patchRecipeCategory(id, { name }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: recipeCategoryQueryKeys.all }),
  });
};
