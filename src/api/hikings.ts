import { apiFetch } from "@/lib/api-client";
import type {
  CreateHikingPayload,
  Hiking,
  HikingProductsFromRecipePayload,
  HikingsListParams,
  HikingsListResponse,
  HikingsMeta,
  HikingWithProducts,
} from "@/types/hiking";
import type { HikingProduct } from "@/types/hiking-product";

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

type HikingDetailApiRow = HikingApiRow & {
  hiking_products?: unknown;
  hikingProducts?: unknown;
};

function unwrapHikingDetailResponse(raw: unknown): HikingDetailApiRow {
  if (raw && typeof raw === "object" && "data" in raw && (raw as { data: unknown }).data != null) {
    return (raw as { data: HikingDetailApiRow }).data;
  }
  return raw as HikingDetailApiRow;
}

function normalizeHikingProduct(row: unknown): HikingProduct {
  const r = row as Record<string, unknown>;
  return {
    id: String(r.id ?? ""),
    hiking_id: String(r.hiking_id ?? r.hikingId ?? ""),
    day_number: coalesceNumber(r.day_number, r.dayNumber),
    eating_time_id: String(r.eating_time_id ?? r.eatingTimeId ?? ""),
    eating_time_name: String(r.eating_time_name ?? r.eatingTimeName ?? ""),
    product_id: String(r.product_id ?? r.productId ?? ""),
    product_name: String(r.product_name ?? r.productName ?? ""),
    recipe_id: String(r.recipe_id ?? r.recipeId ?? ""),
    recipe_name: String(r.recipe_name ?? r.recipeName ?? ""),
    personal_quantity: coalesceNumber(r.personal_quantity, r.personalQuantity),
    total_quantity: coalesceNumber(r.total_quantity, r.totalQuantity),
  };
}

function normalizeHikingProductsList(raw: unknown): HikingProduct[] {
  if (!Array.isArray(raw)) return [];
  return raw.map(normalizeHikingProduct);
}

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

/**
 * `GET /hikings/:id` — single hiking with `hiking_products` (snake or camel from API; normalized).
 */
export async function getHiking(id: string): Promise<HikingWithProducts> {
  const path = `/hikings/${encodeURIComponent(id)}`;
  const raw = await apiFetch<unknown>(path, { method: "GET" });
  const row = unwrapHikingDetailResponse(raw);
  const base = normalizeHiking(row);
  const productsRaw = row.hiking_products ?? row.hikingProducts;
  const hiking_products = normalizeHikingProductsList(productsRaw);
  return { ...base, hiking_products };
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
