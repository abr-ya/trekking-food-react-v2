import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getFeature, getFeatures, patchFeature, postFeature } from "@/api/features";
import type { CreateFeaturePayload, FeaturesListParams, UpdateFeaturePayload } from "@/types/feature";

/** TanStack Query keys for features API. */
export const featureQueryKeys = {
  all: ["features"] as const,
  list: (params: FeaturesListParams = {}) =>
    [
      ...featureQueryKeys.all,
      "list",
      params.page ?? null,
      params.limit ?? null,
      params.status ?? null,
      params.lang ?? null,
      params.isMain ?? null,
    ] as const,
  detail: (id: string) => [...featureQueryKeys.all, "detail", id] as const,
};

const FEATURES_STALE_TIME_MS = 2 * 60 * 1000;

/**
 * Fetch features list (`GET /features`).
 */
export const useFeatures = (params: FeaturesListParams = {}) =>
  useQuery({
    queryKey: featureQueryKeys.list(params),
    queryFn: () => getFeatures(params),
    staleTime: FEATURES_STALE_TIME_MS,
    placeholderData: keepPreviousData,
  });

/**
 * Fetch a single feature (`GET /features/:id`).
 */
export const useFeature = (id: string | undefined) =>
  useQuery({
    queryKey: featureQueryKeys.detail(id ?? ""),
    queryFn: () => getFeature(id ?? ""),
    enabled: Boolean(id),
    staleTime: FEATURES_STALE_TIME_MS,
  });

/**
 * Create a feature (`POST /features`). On success, invalidates feature list queries.
 */
export const useCreateFeature = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateFeaturePayload) => postFeature(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: featureQueryKeys.all }),
  });
};

export type UpdateFeatureVariables = {
  id: string;
  payload: UpdateFeaturePayload;
};

/**
 * Update a feature (`PATCH /features/:id`). On success, invalidates feature queries.
 */
export const useUpdateFeature = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: UpdateFeatureVariables) => patchFeature(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: featureQueryKeys.all }),
  });
};
