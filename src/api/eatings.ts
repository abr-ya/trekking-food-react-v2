import { apiFetch } from "@/lib/api-client";
import type { EatingTime, EatingTimesListResponse } from "@/types/eating-time";

/**
 * `GET /eatings/times` — list of eating times (`[{ id, name }, …]` or `{ data: [...] }`).
 */
export async function getEatingTimes(): Promise<EatingTimesListResponse> {
  const raw = await apiFetch<EatingTime[] | EatingTimesListResponse>("/eatings/times", { method: "GET" });
  if (Array.isArray(raw)) {
    return { data: raw };
  }
  return { data: raw.data ?? [] };
}
