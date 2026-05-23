import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { getFeatures } from "@/api/features";
import type { FeaturesListParams } from "@/types/feature";

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
