import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteHikingDayPack,
  deleteHikingProduct,
  getHiking,
  getHikingProductTotals,
  getHikings,
  patchHikingDayPack,
  patchHikingProduct,
  postHiking,
  postHikingAdmin,
  postHikingDayPack,
  postHikingProduct,
  postHikingProductsFromRecipe,
  postHikingProductsToPack,
} from "@/api/hikings";
import type {
  AddHikingAdminPayload,
  AddHikingProductPayload,
  AssignHikingProductsToPackPayload,
  CreateHikingDayPackPayload,
  CreateHikingPayload,
  HikingProductsFromRecipePayload,
  UpdateHikingDayPackPayload,
} from "@/types/hiking";
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
  productTotals: (id: string) => [...hikingQueryKeys.all, "product-totals", id] as const,
};

export const useHiking = (id: string | undefined) =>
  useQuery({
    queryKey: hikingQueryKeys.detail(id ?? ""),
    queryFn: () => getHiking(id!),
    enabled: Boolean(id),
    staleTime: HIKINGS_STALE_TIME_MS,
  });

export const useHikingProductTotals = (hikingId: string | undefined) =>
  useQuery({
    queryKey: hikingQueryKeys.productTotals(hikingId ?? ""),
    queryFn: () => getHikingProductTotals(hikingId!),
    enabled: Boolean(hikingId),
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

export type AddHikingAdminVariables = {
  hikingId: string;
  payload: AddHikingAdminPayload;
};

export const useAddHikingAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ hikingId, payload }: AddHikingAdminVariables) => postHikingAdmin(hikingId, payload),
    onSuccess: async (_data, { hikingId }) => {
      await queryClient.invalidateQueries({ queryKey: hikingQueryKeys.detail(hikingId) });
    },
  });
};

export type AddHikingProductVariables = {
  hikingId: string;
  payload: AddHikingProductPayload;
};

export const useAddHikingProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ hikingId, payload }: AddHikingProductVariables) => postHikingProduct(hikingId, payload),
    onSuccess: async (_data, { hikingId }) => {
      await queryClient.invalidateQueries({ queryKey: hikingQueryKeys.detail(hikingId), refetchType: "all" });
    },
  });
};

export type DeleteHikingProductVariables = {
  hikingId: string;
  hikingProductId: string;
};

export const useDeleteHikingProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ hikingId, hikingProductId }: DeleteHikingProductVariables) =>
      deleteHikingProduct(hikingId, hikingProductId),
    onSuccess: async (_data, { hikingId }) => {
      await queryClient.invalidateQueries({ queryKey: hikingQueryKeys.detail(hikingId), refetchType: "all" });
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

export type CreateHikingDayPackVariables = {
  hikingId: string;
  payload: CreateHikingDayPackPayload;
};

export const useCreateHikingDayPack = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ hikingId, payload }: CreateHikingDayPackVariables) => postHikingDayPack(hikingId, payload),
    onSuccess: async (_data, { hikingId }) => {
      await queryClient.invalidateQueries({ queryKey: hikingQueryKeys.detail(hikingId) });
    },
  });
};

export type UpdateHikingDayPackVariables = {
  hikingId: string;
  packId: string;
  payload: UpdateHikingDayPackPayload;
};

export const useUpdateHikingDayPack = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ hikingId, packId, payload }: UpdateHikingDayPackVariables) =>
      patchHikingDayPack(hikingId, packId, payload),
    onSuccess: async (_data, { hikingId }) => {
      await queryClient.invalidateQueries({ queryKey: hikingQueryKeys.detail(hikingId) });
    },
  });
};

export type AssignHikingProductsToPackVariables = {
  hikingId: string;
  packId: string;
  payload: AssignHikingProductsToPackPayload;
};

export const useAssignHikingProductsToPack = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ hikingId, packId, payload }: AssignHikingProductsToPackVariables) =>
      postHikingProductsToPack(hikingId, packId, payload),
    onSuccess: async (_data, { hikingId }) => {
      await queryClient.invalidateQueries({ queryKey: hikingQueryKeys.detail(hikingId) });
    },
  });
};

export type DeleteHikingDayPackVariables = {
  hikingId: string;
  packId: string;
};

export const useDeleteHikingDayPack = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ hikingId, packId }: DeleteHikingDayPackVariables) => deleteHikingDayPack(hikingId, packId),
    onSuccess: async (_data, { hikingId }) => {
      await queryClient.invalidateQueries({ queryKey: hikingQueryKeys.detail(hikingId) });
    },
  });
};
