import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  deleteProductCategory,
  deleteRecipeCategory,
  patchProductCategory,
  patchRecipeCategory,
  postProductCategory,
  postRecipeCategory,
} from "@/api/categories";
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

// ToDo: Different invalidate - test: which one is better?
export const useCreateRecipeCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { name: string }) => postRecipeCategory(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: recipeCategoryQueryKeys.all });
      await queryClient.refetchQueries({ queryKey: recipeCategoryQueryKeys.list() });
    },
  });
};

export const useUpdateRecipeCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) => patchRecipeCategory(id, { name }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: recipeCategoryQueryKeys.all });
      await queryClient.refetchQueries({ queryKey: recipeCategoryQueryKeys.list() });
    },
  });
};

export const useDeleteProductCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteProductCategory(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: categoryQueryKeys.all }),
  });
};

export const useDeleteRecipeCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteRecipeCategory(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: recipeCategoryQueryKeys.all });
      await queryClient.refetchQueries({ queryKey: recipeCategoryQueryKeys.list() });
    },
  });
};
