import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getHiking, getHikings, patchHikingProduct, postHiking, postHikingProductsFromRecipe } from "@/api/hikings";
import type { CreateHikingPayload, HikingProductsFromRecipePayload } from "@/types/hiking";
import type { UpdateHikingProductPayload } from "@/types/hiking-product";

const HIKINGS_STALE_TIME_MS = 2 * 60 * 1000;

const DEFAULT_LIST_PAGE = 1;
const DEFAULT_LIST_LIMIT = 20;

export type UseHikingsParams = {
  page?: number;
  limit?: number;
  search?: string;
};

export const hikingQueryKeys = {
  all: ["hikings"] as const,
  list: (params: { page: number; limit: number; search: string }) =>
    [...hikingQueryKeys.all, "list", params.page, params.limit, params.search] as const,
  detail: (id: string) => [...hikingQueryKeys.all, "detail", id] as const,
};

export const useHiking = (id: string | undefined) =>
  useQuery({
    queryKey: hikingQueryKeys.detail(id ?? ""),
    queryFn: () => getHiking(id!),
    enabled: Boolean(id),
    staleTime: HIKINGS_STALE_TIME_MS,
  });

export const useHikings = (params: UseHikingsParams = {}) => {
  const page = params.page ?? DEFAULT_LIST_PAGE;
  const limit = params.limit ?? DEFAULT_LIST_LIMIT;
  const search = params.search ?? "";

  return useQuery({
    queryKey: hikingQueryKeys.list({ page, limit, search }),
    queryFn: () => getHikings({ page, limit, search: search.trim() || undefined }),
    staleTime: HIKINGS_STALE_TIME_MS,
  });
};

export const useCreateHiking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateHikingPayload) => postHiking(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: hikingQueryKeys.all });
    },
  });
};

export type AddHikingProductsFromRecipeVariables = {
  hikingId: string;
  payload: HikingProductsFromRecipePayload;
};

export type UpdateHikingProductVariables = {
  hikingId: string;
  hikingProductId: string;
  payload: UpdateHikingProductPayload;
};

export const useUpdateHikingProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ hikingId, hikingProductId, payload }: UpdateHikingProductVariables) =>
      patchHikingProduct(hikingId, hikingProductId, payload),
    onSuccess: async (_data, { hikingId }) => {
      await queryClient.invalidateQueries({ queryKey: hikingQueryKeys.detail(hikingId) });
    },
  });
};

export const useAddHikingProductsFromRecipe = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ hikingId, payload }: AddHikingProductsFromRecipeVariables) =>
      postHikingProductsFromRecipe(hikingId, payload),
    onSuccess: async (_data, { hikingId }) => {
      await queryClient.invalidateQueries({ queryKey: hikingQueryKeys.all });
      await queryClient.invalidateQueries({ queryKey: hikingQueryKeys.detail(hikingId) });
    },
  });
};
