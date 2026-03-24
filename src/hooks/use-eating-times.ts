import { useQuery } from "@tanstack/react-query";
import { getEatingTimes } from "@/api/eatings";

const EATING_TIMES_STALE_TIME_MS = 60 * 60 * 1000; // 60 minutes

export const eatingTimeQueryKeys = {
  all: ["eating-times"] as const,
  list: () => [...eatingTimeQueryKeys.all, "list"] as const,
};

/**
 * Fetch eating times (`GET /eatings/times`) for meal slots (e.g. Breakfast).
 */
export const useEatingTimes = () =>
  useQuery({
    queryKey: eatingTimeQueryKeys.list(),
    queryFn: getEatingTimes,
    staleTime: EATING_TIMES_STALE_TIME_MS,
  });
