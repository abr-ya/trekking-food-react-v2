import { apiFetch } from "@/lib/api-client";
import type {
  CreateHikingPayload,
  Hiking,
  HikingProductsFromRecipePayload,
  HikingsListParams,
  HikingsListResponse,
  HikingsMeta,
} from "@/types/hiking";

/** Row as returned by the API (camelCase or snake_case; numeric fields may be strings). */
type HikingApiRow = {
  id: string;
  name?: string;
  daysTotal?: unknown;
  days_total?: unknown;
  membersTotal?: unknown;
  members_total?: unknown;
  vegetariansTotal?: unknown;
  vegetarians_total?: unknown;
  createdAt?: string;
  updatedAt?: string;
  created_at?: string;
  updated_at?: string;
};

const coalesceNumber = (...candidates: unknown[]): number => {
  for (const v of candidates) {
    if (typeof v === "number" && !Number.isNaN(v)) return v;
    if (typeof v === "string" && v.trim() !== "") {
      const n = Number(v);
      if (!Number.isNaN(n)) return n;
    }
  }
  return 0;
};

const normalizeHiking = (row: HikingApiRow): Hiking => ({
  id: String(row.id),
  name: row.name ?? "",
  daysTotal: coalesceNumber(row.daysTotal, row.days_total),
  membersTotal: coalesceNumber(row.membersTotal, row.members_total),
  vegetariansTotal: coalesceNumber(row.vegetariansTotal, row.vegetarians_total),
  createdAt: row.createdAt ?? row.created_at,
  updatedAt: row.updatedAt ?? row.updated_at,
});

const normalizeHikingsList = (data: HikingApiRow[] | undefined): Hiking[] => (data ?? []).map(normalizeHiking);

const metaFromListLength = (length: number): HikingsMeta => ({
  total: length,
  page: 1,
  limit: length,
  totalPages: length > 0 ? 1 : 0,
});

const hikingsListQueryString = (params: HikingsListParams): string => {
  const sp = new URLSearchParams();
  if (params.page != null) sp.set("page", String(params.page));
  if (params.limit != null) sp.set("limit", String(params.limit));
  const q = params.search?.trim();
  if (q) sp.set("search", q);
  return sp.toString() ? `?${sp.toString()}` : "";
};

export const getHikings = async (params: HikingsListParams = {}): Promise<HikingsListResponse> => {
  const path = `/hikings${hikingsListQueryString(params)}`;
  const raw = await apiFetch<HikingApiRow[] | { data?: HikingApiRow[]; meta?: HikingsMeta }>(path, {
    method: "GET",
  });
  if (Array.isArray(raw)) {
    const data = normalizeHikingsList(raw);
    return { data, meta: metaFromListLength(data.length) };
  }
  const data = normalizeHikingsList(raw.data);
  return {
    data,
    meta: raw.meta ?? metaFromListLength(data.length),
  };
};

function unwrapHikingResponse(raw: unknown): HikingApiRow {
  if (raw && typeof raw === "object" && "data" in raw && (raw as { data: unknown }).data != null) {
    return (raw as { data: HikingApiRow }).data;
  }
  return raw as HikingApiRow;
}

/**
 * `GET /hikings/:id` — single hiking (raw object or `{ data }`; normalized to `Hiking`).
 */
export async function getHiking(id: string): Promise<Hiking> {
  const path = `/hikings/${encodeURIComponent(id)}`;
  const raw = await apiFetch<unknown>(path, { method: "GET" });
  return normalizeHiking(unwrapHikingResponse(raw));
}

/**
 * `POST /hikings` — create a hiking plan (auth as required by the API).
 */
export async function postHiking(payload: CreateHikingPayload): Promise<unknown> {
  return apiFetch("/hikings", {
    method: "POST",
    body: payload,
  });
}

/**
 * `POST /hikings/:id/hiking-products/from-recipe` — add hiking products from a recipe for a day / eating time.
 */
export async function postHikingProductsFromRecipe(
  hikingId: string,
  payload: HikingProductsFromRecipePayload,
): Promise<unknown> {
  return apiFetch(`/hikings/${encodeURIComponent(hikingId)}/hiking-products/from-recipe`, {
    method: "POST",
    body: payload,
  });
}
